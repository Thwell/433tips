"use client";

import { toast } from "sonner";
import Image from "next/image";
import date from "date-and-time";
import { useEffect, useState } from "react";
import Nothing from "@/app/components/Nothing";
import { GrAdd as AddIcon } from "react-icons/gr";
import { FiEdit as EditIcon } from "react-icons/fi";
import LoadingLogo from "@/app/components/LoadingLogo";
import EmptySport from "@/public/assets/emptySport.png";
import styles from "@/app/styles/accounttable.module.css";
import { usePredictionStore } from "@/app/store/Prediction";
import { MdDeleteOutline as DeleteIcon } from "react-icons/md";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function FootballTable({ sport }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { predictions, fetchPredictions, loading } = usePredictionStore();
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const [userId, setUserId] = useState(null);

  const currentDate = new Date().toISOString().split("T")[0];
  const dateKey = searchParams.get("date") || currentDate;

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set("date", selectedDate);
    const queryString = urlParams.toString();
    router.replace(`${pathname}?${queryString}`);
  };

  const handleDelete = (id) => {
    console.log("Deleting data with id:", id);
    toast.success("Delete functionality to be implemented");
  };

  const handleEdit = (id) => {
    setUserId(id);
    router.push(`dashboard/${sport}?form=Edit&id=${id}`, { scroll: false });
  };

  const addTeam = () => {
    router.push(`dashboard/${sport}?form=Add`, { scroll: false });
  };

  useEffect(() => {
    const loadPredictions = async () => {
      try {
        const result = await fetchPredictions(dateKey, sport);
        setHasAttemptedLoad(true);
      } catch (error) {
        console.error("Error loading predictions:", error);
        setHasAttemptedLoad(true);
        toast.error("Failed to load predictions");
      }
    };

    if (dateKey && sport) {
      loadPredictions();
    }
  }, [dateKey, sport, fetchPredictions]);

  useEffect(() => {
    if (!Array.isArray(predictions)) {
      setFilteredPredictions([]);
      return;
    }

    const sortedPredictions = [...predictions].sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    );

    setFilteredPredictions(sortedPredictions);
  }, [predictions]);

  const renderTableContent = () => {
    return filteredPredictions.map((prediction) => (
      <tr key={prediction._id} className={styles.tableRow}>
        <td>
          <div className={styles.teamInner}>
            <Image
              src={prediction.leagueImage}
              alt={`${prediction.league} image`}
              priority={true}
              width={30}
              height={30}
              className={styles.teamImage}
            />
            {prediction.league}
          </div>
        </td>
        <td>
          <div className={styles.teamInner}>
            <Image
              src={prediction.teamAImage}
              alt={`${prediction.teamA} image`}
              priority={true}
              width={30}
              height={30}
              className={`${styles.teamImage} ${
                prediction.sport === "Tennis" ||
                prediction.sport === "Basketball"
                  ? styles.circularShape
                  : ""
              }`}
            />
            {prediction.teamA}
          </div>
        </td>
        <td>
          <div className={styles.teamInner}>
            <Image
              src={prediction.teamBImage}
              alt={`${prediction.teamB} image`}
              priority={true}
              width={30}
              height={30}
              className={`${styles.teamImage} ${
                prediction.sport === "Tennis" ||
                prediction.sport === "Basketball"
                  ? styles.circularShape
                  : ""
              }`}
            />
            {prediction.teamB}
          </div>
        </td>
        <td>
          {prediction.showScore
            ? `${prediction.teamAscore} - ${prediction.teamBscore}`
            : "VS"}
        </td>
        <td>{date.format(new Date(prediction.time), "HH:mm")}</td>
        <td>{prediction.status || "-"}</td>
        <td>{prediction.tip}</td>
        <td>
          <EditIcon
            onClick={() => handleEdit(prediction._id)}
            aria-label="edit data"
            className={styles.editIcon}
          />
        </td>
        <td>
          <DeleteIcon
            onClick={() => handleDelete(prediction._id)}
            aria-label="delete data"
            className={styles.deleteIcon}
          />
        </td>
      </tr>
    ));
  };

  if (loading)
    return (
      <div className={styles.notLoading}>
        <LoadingLogo />
      </div>
    );


  return (
    <div className={styles.dataContainer}>
      <div className={styles.tableHeader}>
        <div className={styles.addContainer} onClick={addTeam}>
          <AddIcon aria-label="add data" className={styles.copyIcon} />
          Add Team
        </div>
        <input
          type="date"
          className={styles.dateInput}
          onChange={handleDateChange}
          value={dateKey}
        />
      </div>
      {!filteredPredictions || filteredPredictions.length === 0 ? (
        <Nothing
          Alt="No football prediction"
          NothingImage={EmptySport}
          Text="No football predictions available for this date"
        />
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.sportsTable}>
            <thead>
              <tr>
                <th>League</th>
                <th>Team A</th>
                <th>Team B</th>
                <th>Score</th>
                <th>Time</th>
                <th>Status</th>
                <th>Tip</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>{renderTableContent()}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
