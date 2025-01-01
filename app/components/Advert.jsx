"use client";

import Image from "next/image";
import styles from "@/app/styles/advert.module.css";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Advert1Image from "@/public/assets/auth1Image.jpg";
import Advert2Image from "@/public/assets/auth2Image.jpg";
import Advert3Image from "@/public/assets/auth3Image.jpg";

export default function Banner() {
  const images = [Advert1Image, Advert2Image, Advert3Image];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [nextImage]);

  const goToVip = () => {
    router.push("vip", { scroll: false });
  };

  return (
    <div className={`${styles.advertComponent} skeleton `}>
      <Image
        className={styles.advertImage}
        src={images[currentImageIndex]}
        alt={`Advertisement ${currentImageIndex + 1}`}
        fill
          sizes="100%"
        objectFit="cover"
        priority={true}
      />
      <div className={styles.bannerInfo}>
        {pathname === "/page/vip" ? (
          <h1>
            WELCOME OUR <span> VIP</span> MEMBER, ENJOY OUR ACCURATE TIPS{" "}
          </h1>
        ) : (
          <>
            <h1>
              JOIN OUR <span> VIP</span> FOR ACCURATE TIPS AND PREDICTION{" "}
            </h1>

            <button onClick={goToVip} className={styles.buttonBanner}>
              Join our vip
            </button>
          </>
        )}
      </div>
      <div className={styles.imageSlider}>
        {images.map((_, index) => (
          <div
            key={index}
            className={`${styles.circleAdv} ${
              currentImageIndex === index ? styles.activeCircle : ""
            }`}
            onClick={() => setCurrentImageIndex(index)}
          ></div>
        ))}
      </div>
    </div>
  );
}
