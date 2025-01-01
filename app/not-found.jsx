"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "@/app/styles/notfound.module.css";
import NotFoundImage from "@/public/assets/notfound.png";

export default function NotFound() {
  const router = useRouter();

  const goHome = () => {
    router.push("/page/football");
  };

  return (
    <div className={styles.notFound}>
      <Image
        className={styles.notFoundImg}
        src={NotFoundImage}
        height={240}
        alt="Not found image"
        priority={true}
      />
      <h1>seems your lost</h1> 
     <button className={styles.notFoundBtn} onClick={goHome}>
     your way back home
     </button>
    </div>
  );
}
