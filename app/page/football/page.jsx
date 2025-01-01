"use client";

import { useEffect, useState } from "react";
import Advert from "@/app/components/Advert";
import Nothing from "@/app/components/Nothing";
import styles from "@/app/styles/football.module.css";
import MobileFilter from "@/app/components/MobileFilter";
import SportCard from "@/app/components/cards/SportCard";
import EmptySportImg from "@/public/assets/emptySport.png";
import { usePredictionStore } from "@/app/store/Prediction";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function Football() {
  const emptyCardCount = 20;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSport = pathname.split("/").pop();

  const { predictions, fetchPredictions, loading } = usePredictionStore();
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  const searchKey = searchParams.get("q")?.trim() || "";
  const dateKey =
    searchParams.get("date") || new Date().toISOString().split("T")[0];
  const leagueKey = searchParams.get("league")?.trim() || "";
  const countryKey = searchParams.get("country")?.trim() || "";

  useEffect(() => {
    const loadPredictions = async () => {
      try {
        const result = await fetchPredictions(dateKey, currentSport);
        setHasAttemptedLoad(true);
      } catch (error) {
        console.error("Error loading predictions:", error);
        setHasAttemptedLoad(true);
      }
    };

    if (dateKey && currentSport) {
      loadPredictions();
    }
  }, [dateKey, currentSport, fetchPredictions]);

  useEffect(() => {
    if (!Array.isArray(predictions)) {
      setFilteredPredictions([]);
      return;
    }

    const filtered = predictions.filter((item) => {
      if (!item) return false;

      const matchesSearch =
        !searchKey ||
        [item.teamA, item.teamB, item.league, item.country].some((field) =>
          field?.toLowerCase().includes(searchKey.toLowerCase())
        );

      const matchesLeague =
        !leagueKey ||
        item.league?.toLowerCase().includes(leagueKey.toLowerCase());

      const matchesCountry =
        !countryKey ||
        item.country?.toLowerCase().includes(countryKey.toLowerCase());

      return matchesSearch && matchesLeague && matchesCountry;
    });

    const sortedPredictions = filtered.sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    );

    setFilteredPredictions(sortedPredictions);
  }, [predictions, searchKey, leagueKey, countryKey]);

  const renderEmptyCards = () => {
    return Array(emptyCardCount)
      .fill(0)
      .map((_, index) => (
        <div
          className={`${styles.emptyCard} skeleton`}
          key={`empty-${index}`}
        />
      ));
  };

  const handleCardClick = (id) => {
    if (id !== "empty") {
      router.push(`${pathname}/${id}`, { scroll: false });
    }
  };

  if (loading) {
    return (
      <div className={styles.footballContainer}>
        <Advert />
        <MobileFilter predictions={predictions} title={currentSport} />
        <div className={styles.content}>{renderEmptyCards()}</div>
      </div>
    );
  }

  const shouldShowNothing =
    hasAttemptedLoad &&
    (!Array.isArray(filteredPredictions) || filteredPredictions.length === 0);

  return (
    <div className={styles.footballContainer}>
      <Advert />
      <MobileFilter predictions={predictions} title={currentSport} />

      {shouldShowNothing ? (
        <Nothing
          Alt="No prediction"
          NothingImage={EmptySportImg}
          Text={
            searchKey || leagueKey || countryKey
              ? "No predictions match your filters"
              : "No predictions available for this date"
          }
        />
      ) : (
        <div className={styles.content}>
          {filteredPredictions.map((data) => (
            <SportCard
              key={data._id}
              formationA={data.formationA || []}
              formationB={data.formationB || []}
              leagueImage={data.leagueImage}
              teamAImage={data.teamAImage}
              teamBImage={data.teamBImage}
              tip={data.tip}
              league={data.league}
              teamA={data.teamA}
              teamB={data.teamB}
              teamAscore={data.teamAscore}
              teamBscore={data.teamBscore}
              time={data.time}
              status={data.status}
              sport={data.sport}
              category={data.category}
              showScore={data.showScore}
              currentDate={dateKey}
              onClick={() => handleCardClick(data._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
