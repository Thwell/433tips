"use client";

import { toast } from 'sonner';
import Advert from "@/app/components/Advert";
import { useEffect, useState } from "react";
import Nothing from "@/app/components/Nothing"
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/styles/vip.module.css";
import SportCard from "@/app/components/cards/SportCard";
import MobileFilter from "@/app/components/MobileFilter";
import EmptySportImg from "@/public/assets/emptySport.png";
import { usePredictionStore } from "@/app/store/Prediction";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function Vip() {
  const emptyCardCount = 20;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSport = pathname.split("/").pop();

  const { isAuth, isVip } = useAuthStore();
  const { predictions, fetchPredictions, loading } = usePredictionStore();
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  const searchKey = searchParams.get("q")?.trim().toLowerCase() || "";
  const dateKey = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const leagueKey = searchParams.get("league")?.trim().toLowerCase() || "";
  const countryKey = searchParams.get("country")?.trim().toLowerCase() || "";

  useEffect(() => {
    const loadVipPredictions = async () => {
      if (isAuth && isVip) {
        try {
          const result = await fetchPredictions(dateKey, currentSport);
          setHasAttemptedLoad(true);
          
          if (!result.success) {
            toast.error(result.message || 'Failed to fetch VIP predictions');
          }
        } catch (error) {
          toast.error(error.message || 'An error occurred while fetching VIP predictions');
          console.error('Error loading VIP predictions:', error);
          setHasAttemptedLoad(true);
        }
      }
    };

    if (dateKey && isAuth && isVip) {
      loadVipPredictions();
    }
  }, [dateKey, isAuth, isVip, fetchPredictions]);

  useEffect(() => {
    if (!Array.isArray(predictions)) {
      setFilteredPredictions([]);
      return;
    }

    const filtered = predictions.filter((item) => {
      if (!item) return false;

      const matchesSearch = !searchKey || [
        item.teamA,
        item.teamB,
        item.league,
        item.country
      ].some(field => 
        field?.toLowerCase().includes(searchKey)
      );

      const matchesLeague = !leagueKey ||
        item.league?.toLowerCase().includes(leagueKey);

      const matchesCountry = !countryKey ||
        item.country?.toLowerCase().includes(countryKey);

      return matchesSearch && matchesLeague && matchesCountry;
    });

    const sortedPredictions = filtered.sort((a, b) => 
      new Date(a.time).getTime() - new Date(b.time).getTime()
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
          role="presentation"
          aria-hidden="true"
        />
      ));
  };

  const handleCardClick = (id) => {
    if (id !== "empty") {
      router.push(`${pathname}/${id}`, { scroll: false });
    }
  };

  if (!isAuth) {
    return (
      <AuthPrompt
        message="Please login to access VIP"
        buttonText="Login"
        onClick={() => router.push("/authentication/login")}
      />
    );
  }

  if (!isVip) {
    return (
      <AuthPrompt
        message="Join VIP to access accurate tips"
        buttonText="Join VIP"
        onClick={() => router.push("payment")}
      />
    );
  }

  if (loading) {
    return (
      <div className={styles.vipContainer}>
        <Advert />
        <MobileFilter predictions={predictions} title={currentSport} />
        <div className={styles.content}>
          {renderEmptyCards()}
        </div>
      </div>
    );
  }

  const shouldShowNothing = hasAttemptedLoad && 
    (!Array.isArray(filteredPredictions) || filteredPredictions.length === 0);

  return (
    <div className={styles.vipContainer}>
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

const AuthPrompt = ({ message, buttonText, onClick }) => (
  <div className={styles.defaultContainer}>
    <div className={styles.defaultContain}>
      <h1>{message}</h1>
      <button 
        onClick={onClick} 
        className={styles.defaultButton} 
        role="button"
      >
        {buttonText}
      </button>
    </div>
  </div>
);