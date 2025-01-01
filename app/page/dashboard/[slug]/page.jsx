"use client";

import OtherSportForm from "@/app/components/Form/sports/OtherSportForm";
import FootballForm from "@/app/components/Form/sports/FootballForm";
import PaymentForm from "@/app/components/Form/sports/PaymentForm";
import VipForm from "@/app/components/Form/sports/VipForm";
import styles from "@/app/styles/dashboardSingle.module.css";

export default function DashboardSingle({ params }) {
  const PageName = decodeURIComponent(params.slug || "");

  const renderCardContent = (page) => {
    switch (page) {
      case "football":
        return <FootballForm Title={PageName} />;
      case "othersport":
        return <OtherSportForm Title={PageName} />;
      case "payment":
        return <PaymentForm Title={PageName} />;
      case "vip":
        return <VipForm Title={PageName} />;
      default:
        return <FootballForm Title={PageName} />;
    }
  };

  return (
    <div className={styles.dashboardMain}>
      {renderCardContent(PageName)}</div>
  );
}
