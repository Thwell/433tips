import { useMemo } from "react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import styles from "@/app/styles/sportcardtable.module.css";

export default function SportTable({ games }) {
  const router = useRouter();

  const formattedTimes = useMemo(() => {
    return games.map((game) => {
      const localTime = DateTime.fromISO(game.time).setZone(
        DateTime.local().zoneName
      );
      return localTime.toFormat("HH:mm");
    });
  }, [games]);


  return (
    <div className={styles.tableWrapper}>
      <table className={styles.sportsTable}>
        <thead>
          <tr>
            <th>Team A</th>
            <th>Score</th>
            <th>Team B</th>
            <th>League</th>

            <th>Time</th>
            <th>Tip</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game, index) => (
            <tr key={index} className={styles.tableRow}>
              <td>
                <span>{game.teamA}</span>
              </td>
              <td className={styles.scoreCell}>
                {game.showScore ? (
                  <span>
                    {game.teamAscore} - {game.teamBscore}
                  </span>
                ) : (
                  <span>VS</span>
                )}
              </td>
              <td>
              {game.teamB}
              </td>
              <td>
              {game.league}
              </td>
              <td className={styles.time}>
              [{formattedTimes[index]}]
              </td>
              <td className={styles.tip}>
               {game.tip}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
