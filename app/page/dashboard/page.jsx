"use client";

import { useSearchParams } from "next/navigation";
import styles from "@/app/styles/dashboard.module.css";
import SportActive from "@/app/components/dashboardItems/SportActive";
import AdminTable from "@/app/components/dashboardItems/AdminTable";
import VipTable from "@/app/components/dashboardItems/VipTable";
import AccountTable from "@/app/components/dashboardItems/AccountTable";
import DashboardCard from "@/app/components/dashboardItems/DashboardCard";
import StatisticGraph from "@/app/components/dashboardItems/StatisticsGraph";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const activeCard = searchParams.get('card') || 'revenue'; 

  const renderCardContent = (param) => {
    switch (param) {
      case "revenue":
        return <StatisticGraph />;
      case "users":
        return <AccountTable />;
      case "sports":
        return <SportActive />;
      case "vip":
        return <VipTable />;
      case "admin":
        return <AdminTable />;
        
      default:
        return <StatisticGraph />; 
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <DashboardCard />
      <div className={styles.dashboardLayout}>{renderCardContent(activeCard)}</div>
    </div>
  );
}