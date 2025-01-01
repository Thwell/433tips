"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import styles from "@/app/styles/dashNavLink.module.css";
import { RiVipCrownLine as VipIcon } from "react-icons/ri";
import {
  BiMoneyWithdraw as MoneyIcon,
  BiFootball as FootballIcon,
} from "react-icons/bi";
import { PiCourtBasketball as OtherSportIcon } from "react-icons/pi";

export default function DashNavLink() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const activeLink = searchParams.get('link');

  const dashLinkData = [
    {
      name: "football",
      icon: (
        <FootballIcon
          alt="football icon"
          aria-label="football icon"
          className={styles.dashlinkIcon}
        />
      ),
    },
    {
      name: "othersport",
      icon: (
        <OtherSportIcon
          alt="othersport icon"
          aria-label="othersport icon"
          className={styles.dashlinkIcon}
        />
      ),
    },
    {
      name: "vip",
      icon: (
        <VipIcon
          alt="vip icon"
          aria-label="vip icon"
          className={styles.dashlinkIcon}
        />
      ),
    },
    {
      name: "price",
      icon: (
        <MoneyIcon
          alt="price icon"
          aria-label="price icon"
          className={styles.dashlinkIcon}
        />
      ),
    },
  ];

  const createQueryString = (name, value) => {
    const params = new URLSearchParams(searchParams);
    params.set(name, value);
    
    const card = searchParams.get('card');
    if (card) {
      params.set('card', card);
    }
    
    return params.toString();
  };

  const handleLinkClick = (linkName) => {
    router.push(`${pathname}?${createQueryString('link', linkName)}`);
  };

  return (
    <div className={styles.dashLinkContainer}>
      {dashLinkData.map((data, index) => (
        <div
          className={`${styles.dashLink} ${
            activeLink === data.name ? styles.dashLinkActive : ""
          }`}
          onClick={() => handleLinkClick(data.name)}
          key={index}
        >
          {data.icon}
        </div>
      ))}
    </div>
  );
}