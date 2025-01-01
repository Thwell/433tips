"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import DashNavLink from "@/app/components/dashboardItems/DashNavLinks";
import FootballTable from "@/app/components/Form/tables/FootballTable";
import OtherSportTable from "@/app/components/Form/tables/OtherSportTable";
import PaymentTable from "@/app/components/Form/tables/PaymentTable";
import VipTable from "@/app/components/Form/tables/VipTable";
import styles from "@/app/styles/sportActive.module.css";

export default function SportActive() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeLink = searchParams.get("link");
  const activeCard = searchParams.get("card");

  useEffect(() => {
    if (activeCard === "sports" && !activeLink) {
      const params = new URLSearchParams(searchParams);
      params.set("link", "football");
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [activeCard, activeLink, pathname, router, searchParams]);

  const renderCardContent = (card) => {
    switch (card) {
      case "football":
        return <FootballTable sport="football" />;
      case "othersport":
        return <OtherSportTable sport="othersport" />;
      case "vip":
        return <VipTable sport="vip" />;
      case "price":
        return <PaymentTable Sport="price" />;
      default:
        return <FootballTable Sport="football" />;
    }
  };

  return (
    <div className={styles.sportActiveContainer}>
      <DashNavLink />
      <div className={styles.sportActiveLayout}>
        {renderCardContent(activeLink)}
      </div>
    </div>
  );
}
