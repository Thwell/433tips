"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import styles from "@/app/styles/termcard.module.css";

export default function TermCard() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentCard = searchParams.get("info" || "terms");
  const termcardData = [
    {
      name: "terms",
      title: "Terms and Conditions",
      description: "Read our terms and conditions",
    },
    {
      name: "policy",
      title: "Policy",
      description: "Read our policies",
    },
    {
      name: "disclaimer",
      title: "Our Disclaimer",
      description: "Read our disclaimer",
    },
    {
      name: "faqs",
      title: "FAQs and Q&A",
      description: "Get more details",
    },
  ];


  const handleCardClick = (cardName) => {
    const params = new URLSearchParams(searchParams);

    params.set("info", cardName);

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.termcardContainer}>
      {termcardData.map((data, index) => (
        <div
          className={`${styles.termcard} ${
            currentCard === data.name ? styles.termcardActive : ""
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
