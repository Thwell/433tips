"use client";

import Image from "next/image";
import { useMemo } from "react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { IoIosArrowBack as BackArrow } from "react-icons/io";
import styles from "@/app/styles/singleSportcard.module.css";

export default function SingleSportCard({
  leagueImage,
  teamAImage,
  teamBImage,
  tip = "0",
  league,
  teamA,
  teamB,
  teamAscore,
  teamBscore,
  time,
  status,
  sport,
  showScore,
  component,
}) {
  const router = useRouter();
  const formattedTime = useMemo(() => {
    const localTime = DateTime.fromISO(time).setZone(DateTime.local().zoneName);
    return localTime.toFormat("HH:mm");
  }, [time]);
  
  const goBack = () => {
    router.back();
  };


  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardDrop}>
        <Image
          src={teamAImage}
          alt={`${teamA} image`}
          priority={true}
          width={120}
          height={120}
          className={`${styles.teamCardImage} ${
            sport === "Tennis" || sport === "Basketball"
              ? styles.circularShape
              : ""
          }`}
        />
        <Image
          src={teamBImage}
          alt={`${teamB} image`}
          priority={true}
          width={120}
          height={120}
          className={`${styles.teamCardImage} ${
            sport === "Tennis" || sport === "Basketball"
              ? styles.circularShape
              : ""
          }`}
        />
      </div>

      <div className={styles.cardWrapperGlassmorphism}>
      <div onClick={goBack} className={styles.backButton}>
          <BackArrow
            className={styles.backButtonIcon}
            aria-label="back icon"
            alt="back icon"
          />
        </div>
        <div className={styles.cardWrapper}>
          <div className={styles.leagueInfo}>
            <Image
              src={leagueImage}
              alt={`${league} image`}
              width={35}
              height={35}
              priority={true}
              className={styles.leagueImage}
            />
            <h1>{league}</h1>
          </div>
          <div className={styles.cardMiddle}>
            <div className={styles.teamContainer}>
              <div className={styles.teamInner}>
                <Image
                  src={teamAImage}
                  alt={`${teamA} image`}
                  priority={true}
                  width={60}
                  height={60}
                  className={`${styles.teamImage} ${
                    sport === "Tennis" || sport === "Basketball"
                      ? styles.circularShape
                      : ""
                  }`}
                />
                <h2>{teamA}</h2>
              </div>
              {showScore ? <h1>{teamAscore}</h1> : ""}
            </div>
            <div className={styles.matchInfo}>
              <div className={styles.cardStatus}>
                <span>{status ? status : ""}</span>
              </div>
              <h3>[{formattedTime}]</h3>
              {showScore ? "" : <h1>VS</h1>}
              {sport === "Extra" ? "" : component}
            </div>
            <div className={styles.teamContainer}>
              {showScore ? <h1>{teamBscore}</h1> : ""}
              <div className={styles.teamInner}>
                <Image
                  src={teamBImage}
                  alt={`${teamB} image`}
                  priority={true}
                  width={60}
                  height={60}
                  className={`${styles.teamImage} ${
                    sport === "Tennis" || sport === "Basketball"
                      ? styles.circularShape
                      : ""
                  }`}
                />
                <h2>{teamB}</h2>
              </div>
            </div>
          </div>

          <div className={styles.tipContainer}>
            <h2>Tip:</h2>
            <h4>{tip}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
