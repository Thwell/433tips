"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import Nothing from "@/app/components/Nothing";
import styles from "@/app/styles/single.module.css";
import EmptySportImg from "@/public/assets/emptySport.png";
import { usePredictionStore } from "@/app/store/Prediction";
import { useSearchParams, usePathname } from "next/navigation";
import SingleSportCard from "@/app/components/cards/SingleSportCard";

export default function SingleSport({ params }) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pathParts = pathname.split("/");
  const selectedDate = searchParams.get("date");
  const currentSport = pathParts[pathParts.indexOf("otherSport")] || "otherSport";
  const matchId = params?.slug;

  const {
    singlePrediction: match,
    fetchSinglePrediction,
    loading: storeLoading,
  } = usePredictionStore();

  useEffect(() => {
    const loadPrediction = async () => {
      if (!matchId) {
        setIsLoading(false);
        return;
      }

      try {
        const [teamA, teamB] = matchId
          .split("-vs-")
          .map((team) => decodeURIComponent(team.replace(/-/g, " ").trim()));

        const result = await fetchSinglePrediction(
          currentSport,
          teamA,
          teamB,
          selectedDate
        );

        if (!result.success) {
          toast.error(result.message || "Failed to fetch match data");
        }
      } catch (error) {
        toast.error(
          error.message || "An error occurred while fetching match data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadPrediction();
  }, [matchId, currentSport, fetchSinglePrediction]);

  const calculateTeamStats = (match, team) => {
    const formation = team === "A" ? match?.formationA : match?.formationB;
    if (!Array.isArray(formation))
      return { wins: 0, draws: 0, losses: 0, points: 0 };

    const wins = formation.filter((f) => f.toLowerCase() === "w").length;
    const draws = formation.filter((f) => f.toLowerCase() === "d").length;
    const losses = formation.filter((f) => f.toLowerCase() === "l").length;
    const points = wins * 3 + draws;

    return { wins, draws, losses, points };
  };

  const getFormationColorClass = (formation) => {
    switch (formation?.toLowerCase()) {
      case "w":
        return styles.win;
      case "d":
        return styles.draw;
      case "l":
        return styles.lose;
      default:
        return styles.defaultColor;
    }
  };

  const getTeamImageClass = (sport) => {
    return `${styles.teamImage} ${
      sport === "Tennis" || sport === "Basketball" ? styles.circularShape : ""
    }`;
  };

  if (isLoading || storeLoading) {
    return (
      <div className={styles.singleContainer}>
        <div className={`${styles.reviewContainer} skeleton`}></div>
        <div className={`${styles.singleReviewContainer}`}>
          <div className={`${styles.reviewContainer} skeleton`}></div>
          <div className={`${styles.reviewContainer} skeleton`}></div>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <Nothing
        Alt="No predictions"
        NothingImage={EmptySportImg}
        Text={"No predictions available for this date"}
      />
    );
  }

  return (
    <div className={styles.singleContainer}>
      <SingleSportCard
        key={match._id}
        leagueImage={match.leagueImage}
        teamAImage={match.teamAImage}
        teamBImage={match.teamBImage}
        tip={match.tip}
        league={match.league}
        teamA={match.teamA}
        teamB={match.teamB}
        teamAscore={match.teamAscore}
        teamBscore={match.teamBscore}
        time={match.time}
        status={match.status}
        sport={match.sport || currentSport}
        showScore={match.showScore}
        showBtn={match.showBtn}
      />

      <div className={styles.singleReviewContainer}>
        <div className={styles.reviewContainer}>
          <div className={styles.reviewStanding}>
            <h1>Standing</h1>
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>Team</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>P</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { team: "A", data: match },
                    { team: "B", data: match },
                  ].map((item, index) => {
                    const stats = calculateTeamStats(item.data, item.team);
                    const teamName =
                      item.team === "A" ? match.teamA : match.teamB;
                    const teamImage =
                      item.team === "A" ? match.teamAImage : match.teamBImage;

                    return (
                      <tr key={`team-${item.team}`}>
                        <td className={styles.tableData}>
                          <h3>{index + 1}</h3>
                          <div className={styles.tableInner}>
                            <Image
                              src={teamImage}
                              alt={`${teamName} logo`}
                              priority
                              width={30}
                              height={30}
                              className={getTeamImageClass(match.sport)}
                            />
                            <h2>{teamName}</h2>
                          </div>
                        </td>
                        <td>{stats.wins}</td>
                        <td>{stats.draws}</td>
                        <td>{stats.losses}</td>
                        <td>{stats.points}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.reviewFormation}>
            <h1>Formation</h1>
            <div className={styles.innerFormation}>
              <div className={styles.formation}>
                <Image
                  src={match.teamAImage}
                  alt={`${match.teamA} logo`}
                  priority
                  width={40}
                  height={40}
                  className={getTeamImageClass(match.sport)}
                />
                {match.formationA?.map((result, idx) => (
                  <div
                    key={`teamA-formation-${idx}`}
                    className={`${
                      styles.formationCircle
                    } ${getFormationColorClass(result)}`}
                  >
                    <span>{result.toUpperCase()}</span>
                  </div>
                ))}
              </div>

              <h3>vs</h3>

              <div className={styles.formation}>
                <Image
                  src={match.teamBImage}
                  alt={`${match.teamB} logo`}
                  priority
                  width={40}
                  height={40}
                  className={getTeamImageClass(match.sport)}
                />
                {match.formationB?.map((result, idx) => (
                  <div
                    key={`teamB-formation-${idx}`}
                    className={`${
                      styles.formationCircle
                    } ${getFormationColorClass(result)}`}
                  >
                    <span>{result.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.reviewInfoContainer}>
          <h1>Highlights</h1>
          <div className={styles.reviewInfo}>
            <h2>Team info</h2>
            {match?.description ? (
              <p>{match.description}</p>
            ) : (
              <p>No additional information available for this match.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
