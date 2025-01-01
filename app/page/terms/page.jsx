"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import TermCard from "@/app/components/termitems/TermCard";
import TermsInfo from "@/app/components/termitems/TermsInfo";
import Policy from "@/app/components/termitems/PolicyInfo";
import FaqsInfo from "@/app/components/termitems/FaqsInfo";
import DisclaimerInfo from "@/app/components/termitems/DisclaimerInfo";
import styles from "@/app/styles/about.module.css";

export default function TermPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeInfo = searchParams.get('info');

  useEffect(() => {
    if (!activeInfo) {
      const params = new URLSearchParams(searchParams);
      params.set('info', 'terms');
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [activeInfo, pathname, router, searchParams]);

  const showCardHandler = () => {
    switch (activeInfo) {
      case "terms":
        return <TermsInfo />;
      case "policy":
        return <Policy />;
      case "disclaimer":
        return <DisclaimerInfo />;
      case "faqs":
        return <FaqsInfo />;
      default:
        return <TermsInfo />; 
    }
  };

  return (
    <div className={styles.aboutContainer}>
      <TermCard />
      {showCardHandler()}
    </div>
  );
}