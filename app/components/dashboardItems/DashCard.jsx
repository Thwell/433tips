"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import styles from "@/app/styles/termcard.module.css";

export default function DashCard() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const dashcardData = [
    {
      name: "terms",
      title: "Terms and Conditions",
      description: "Read our Terms and Conditions",
    },
    {
      name: "refund",
      title: "Refund Policy",
      description: "Read our Refund Policy",
    },
    {
      name: "disclaimer",
      title: "Our Disclaimer",
      description: "Read our Disclaimer",
    },
  ];

  const handleCardClick = (cardName) => {
    const params = new URLSearchParams(searchParams);
    
    params.set('info', cardName);
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.termcardContainer}>
      {dashcardData.map((data, index) => (
        <div
          className={`${styles.termcard} ${
            showCard === data.name ? styles.termcardActive : ""
          }`}
          onClick={() => handleCardClick(data.name)}
          key={index}
        >
          <div className={styles.termcardTitle}>
            <h3> {data.title}</h3>
            <p>{data.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
