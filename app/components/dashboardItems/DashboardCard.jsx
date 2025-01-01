"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { MdAdminPanelSettings as AdminIcon } from "react-icons/md";
import { RiVipCrownLine as VipIcon } from "react-icons/ri";
import { GiMoneyStack as MoneyIcon } from "react-icons/gi";
import { FaUsers as UserIcon } from "react-icons/fa";
import { IoFootball as SportIcon } from "react-icons/io5";
import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/styles/dashboardCard.module.css";

export default function DashboardCard() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const activeCard = searchParams.get('card');
  
  const { 
    getRevenueAnalytics, 
    getAllUsers, 
    getUsersByRole, 
    activeUsersCount, 
    vipUsersCount, 
    adminUsersCount, 
    setActiveUsersCount, 
    setVipUsersCount, 
    setAdminUsersCount 
  } = useAuthStore();

  const [dashboardStats, setDashboardStats] = useState({
    monthlyRevenue: 0,
    activeUsers: activeUsersCount,
    vipUsers: vipUsersCount,
    adminUsers: adminUsersCount
  });

  const refreshStats = useCallback(async () => {
    try {
      const revenueResponse = await getRevenueAnalytics();
      if (revenueResponse?.success) {
        const currentMonth = new Date().getMonth();
        const currentMonthRevenue = revenueResponse.data?.monthlyData?.[currentMonth]?.revenue ?? 0;
        setDashboardStats(prev => ({
          ...prev,
          monthlyRevenue: currentMonthRevenue
        }));
      }

      const usersResponse = await getAllUsers();
      if (usersResponse?.success) {
        setActiveUsersCount(usersResponse.data.count);
        setDashboardStats(prev => ({
          ...prev,
          activeUsers: usersResponse.data.count
        }));
      }

      const vipUsersResponse = await getUsersByRole('vip');
      if (vipUsersResponse?.success) {
        setVipUsersCount(vipUsersResponse.data.count);
        setDashboardStats(prev => ({
          ...prev,
          vipUsers: vipUsersResponse.data.count
        }));
      }

      const adminUsersResponse = await getUsersByRole('admin');
      if (adminUsersResponse?.success) {
        setAdminUsersCount(adminUsersResponse.data.count);
        setDashboardStats(prev => ({
          ...prev,
          adminUsers: adminUsersResponse.data.count
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  }, [getRevenueAnalytics, getAllUsers, getUsersByRole, setActiveUsersCount, setVipUsersCount, setAdminUsersCount]);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  useEffect(() => {
    setDashboardStats(prev => ({
      ...prev,
      activeUsers: activeUsersCount,
      vipUsers: vipUsersCount,
      adminUsers: adminUsersCount
    }));
  }, [activeUsersCount, vipUsersCount, adminUsersCount]);

  useEffect(() => {
    const intervalId = setInterval(refreshStats, 30000);
    return () => clearInterval(intervalId);
  }, [refreshStats]);

  const formatNumber = (value) => {
    return (value ?? 0).toLocaleString();
  };

  const dashCardData = [
    {
      name: "revenue",
      icon: MoneyIcon,
      title: "Monthly Revenue",
      revenue: `$ ${formatNumber(dashboardStats.monthlyRevenue)}`,
    },
    {
      name: "users",
      icon: UserIcon,
      title: "Accounts active",
      revenue: formatNumber(dashboardStats.activeUsers),
    },
    {
      name: "vip",
      icon: VipIcon,
      title: "Vip subscriptions",
      revenue: formatNumber(dashboardStats.vipUsers),
    },
    {
      name: "admin",
      icon: AdminIcon,
      title: "Admin accounts",
      revenue: formatNumber(dashboardStats.adminUsers),
    },
    {
      name: "sports",
      icon: SportIcon,
      title: "Monitor sports",
      revenue: "Active",
    },
  ];

  const handleCardClick = (cardName) => {
    const params = new URLSearchParams(searchParams);
    params.set('card', cardName);
    
    if (cardName !== 'sports') {
      params.delete('link');
    }

    if(cardName === 'sports') {
      router.push(`${pathname}?${params.toString()}&link=football`);
    } else {
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div className={styles.dashcardContainer}>
      {dashCardData.map((data, index) => (
        <div
          className={`${styles.dashcard} ${
            activeCard === data.name ? styles.dashcardActive : ""
          }`}
          onClick={() => handleCardClick(data.name)}
          key={index}
        >
          <div className={styles.dashcardTitle}>
            <h3>{data.title}</h3>
            <div className={styles.dashCardIconWrapper}>
              <data.icon height={30} width={30} className={styles.dashCardIcon} />
            </div>
          </div>
          <h1>{data.revenue}</h1>
        </div>
      ))}
    </div>
  );
}