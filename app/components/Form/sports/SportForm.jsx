"use client";

import { toast } from "sonner";
import Image from "next/image";
import Loader from "@/app/components/StateLoader";
import styles from "@/app/styles/form.module.css";
import { useState, useRef, useEffect } from "react";
import ToggleBar from "@/app/components/ToggleBar";
import { usePredictionStore } from "@/app/store/Prediction";
import { BsCameraFill as CameraIcon } from "react-icons/bs";
import { IoIosArrowBack as BackArrow } from "react-icons/io";
import AccountDropdown from "@/app/components/Form/FormDropdown";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import TeamSearchInput from "@/app/components/Form/sports/TeamSearchInput";

const FileInput = ({ onChange, idImage, label, required }) => {
  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    return () => {
      if (idImage && idImage.startsWith("blob:")) {
        URL.revokeObjectURL(idImage);
      }
    };
  }, [idImage]);

  return (
    <div className={styles.formInputWrapper}>
      <label>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      <div
        className={`${styles.formChangeUpload} ${
          idImage ? styles.imageUploaded : ""
        }`}
        onClick={handleIconClick}
      >
        <input
          type="file"
          accept="image/*"
          onChange={onChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        {idImage ? (
          <Image
            src={idImage}
            alt={`Uploaded ${label}`}
            className={styles.IdImage}
            fill
            sizes="100%"
            quality={100}
            objectFit="contain"
            priority
          />
        ) : (
          <CameraIcon
            className={styles.CameraIcon}
            alt="Camera Icon"
            width={30}
            height={30}
          />
        )}
      </div>
    </div>
  );
};

const sportOptions = [
  { value: "Tennis", label: "Tennis" },
  { value: "Basketball", label: "Basketball" },
  { value: "Football", label: "Football" },
];

const dropdownData = [
  { value: "W", label: "Win" },
  { value: "L", label: "Loss" },
  { value: "D", label: "Draw" },
];

const FormationSection = ({ team, formations, onFormationsChange }) => {
  const handleFormationSelect = (selectedOption) => {
    if (!selectedOption) return;

    if (formations.length < 5) {
      onFormationsChange([...formations, selectedOption.value]);
    } else {
      toast.error("Maximum 5 formations allowed");
    }
  };

  const handleRemove = (index) => {
    const newFormations = formations.filter((_, i) => i !== index);
    onFormationsChange(newFormations);
  };

  return (
    <div className={styles.formInputContainer}>
      <label>Formation {team}</label>
      <div className={styles.formationInput}>
        <AccountDropdown
          options={dropdownData}
          dropPlaceHolder="Choose formation"
          onSelect={handleFormationSelect}
          value={null}
          key={formations.length}
        />
      </div>
      <div className={styles.formationList}>
        {formations.map((formation, index) => (
          <div
            key={index}
            className={styles.formationItem}
            onClick={() => handleRemove(index)}
          >
            <span>
              {dropdownData.find((option) => option.value === formation)?.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const prepareFormData = (formData, imageFiles, formationA, formationB) => {
  const formDataObj = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formDataObj.append(key, String(value));
    }
  });

  if (Array.isArray(formationA)) {
    formationA.forEach((formation) => {
      formDataObj.append("formationA", formation);
    });
  }

  if (Array.isArray(formationB)) {
    formationB.forEach((formation) => {
      formDataObj.append("formationB", formation);
    });
  }

  if (imageFiles) {
    Object.entries(imageFiles).forEach(([key, file]) => {
      if (file instanceof File) {
        formDataObj.append(key, file);
      }
    });
  }

  return formDataObj;
};

export default function SportForm({ Title }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sportType = pathname.includes("/football")
    ? "football"
    : pathname.includes("/vip")
    ? "vip"
    : "otherSport";
  const formType = searchParams.get("form") || "Add";
  const predictionId = searchParams.get("id");
  const isEditMode = formType === "Edit";

  const [selectedSport, setSelectedSport] = useState("");
  const { createPrediction, updatePrediction, predictions } =
    usePredictionStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [imageFiles, setImageFiles] = useState({
    leagueImage: null,
    teamAImage: null,
    teamBImage: null,
  });

  const [imageUrls, setImageUrls] = useState({
    leagueImage: null,
    teamAImage: null,
    teamBImage: null,
  });

  const [formationA, setFormationA] = useState([]);
  const [formationB, setFormationB] = useState([]);

  const getCategoryFromTitle = (title) => {
    switch (title.toLowerCase()) {
      case "football":
        return "football";
      case "vip":
        return "vip";
      default:
        return "othersport";
    }
  };

  const [formData, setFormData] = useState({
    league: "",
    teamA: "",
    teamB: "",
    country: "",
    teamAscore: "0",
    teamBscore: "0",
    tip: "",
    time: "",
    sport: Title.toLowerCase() === "football" ? "football" : selectedSport,
    category: getCategoryFromTitle(Title),
    showScore: false,
    showBtn: false,
    status: "",
  });

  const toggleVisibility = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSportChange = (selected) => {
    if (selected) {
      setSelectedSport(selected.value);
      setFormData((prev) => ({
        ...prev,
        sport: Title.toLowerCase() === "football" ? "football" : selected.value,
        league: "",
        teamA: "",
        teamB: "",
        category: getCategoryFromTitle(Title),
      }));
      setImageUrls({
        leagueImage: null,
        teamAImage: null,
        teamBImage: null,
      });
      setImageFiles({
        leagueImage: null,
        teamAImage: null,
        teamBImage: null,
      });
    }
  };

  useEffect(() => {
    if (formType === "Edit" && predictionId) {
      const prediction = predictions.find((p) => p._id === predictionId);
      if (prediction) {
        setFormData({
          league: prediction.league || "",
          teamA: prediction.teamA || "",
          teamB: prediction.teamB || "",
          country: prediction.country || "",
          sport:
            prediction.sport || Title.toLowerCase() === "football"
              ? "football"
              : selectedSport,
          teamAscore: prediction.teamAscore || "",
          teamBscore: prediction.teamBscore || "",
          category: prediction.category || getCategoryFromTitle(Title),
          tip: prediction.tip || "",
          time: prediction.time || "",
          sport:
            prediction.sport || Title.toLowerCase() === "football"
              ? "football"
              : selectedSport,
          showScore: Boolean(prediction.showScore),
          showBtn: prediction.showBtn !== false,
          status: prediction.status || "",
        });
        setSelectedSport(
          prediction.sport || Title.toLowerCase() === "football"
            ? "football"
            : selectedSport
        );
        setFormationA(prediction.formationA || []);
        setFormationB(prediction.formationB || []);
        setImageUrls({
          leagueImage: prediction.leagueImage || null,
          teamAImage: prediction.teamAImage || null,
          teamBImage: prediction.teamBImage || null,
        });
      }
    }
  }, [formType, predictionId, predictions, sportType, selectedSport, Title]);

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload only image files");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageFiles((prev) => ({ ...prev, [field]: file }));
    const imageUrl = URL.createObjectURL(file);
    setImageUrls((prev) => ({ ...prev, [field]: imageUrl }));
  };

  const handleTeamSearchResult = (teamData) => {
    if (teamData.league) {
      setFormData((prev) => ({
        ...prev,
        league: teamData.league,
      }));
    }

    if (teamData.leagueIcon) {
      fetch(teamData.leagueIcon)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "leagueImage.png", {
            type: "image/png",
          });
          setImageFiles((prev) => ({ ...prev, leagueImage: file }));
          setImageUrls((prev) => ({
            ...prev,
            leagueImage: teamData.leagueIcon,
          }));
        });
    }

    if (teamData.teamIcon) {
      const imageField = teamData.isTeamA ? "teamAImage" : "teamBImage";
      fetch(teamData.teamIcon)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `${imageField}.png`, {
            type: "image/png",
          });
          setImageFiles((prev) => ({ ...prev, [imageField]: file }));
          setImageUrls((prev) => ({
            ...prev,
            [imageField]: teamData.teamIcon,
          }));
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isEditMode) {
      const requiredFields = ["league", "teamA", "teamB", "tip", "time"];
      requiredFields.forEach((field) => {
        if (!formData[field]) {
          newErrors[field] = `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } is required`;
        }
      });

      ["leagueImage", "teamAImage", "teamBImage"].forEach((field) => {
        if (!imageFiles[field] && !imageUrls[field]) {
          newErrors[field] = `${field
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()} is required`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const formDataObj = prepareFormData(
        formData,
        imageFiles,
        formationA,
        formationB
      );

      let result;
      if (formType === "Edit" && predictionId) {
        result = await updatePrediction(predictionId, formDataObj);
      } else {
        result = await createPrediction(formDataObj);
      }

      if (result.success) {
        toast.success(
          `${Title} ${formType === "Edit" ? "updated" : "added"} successfully`
        );
      } else {
        throw new Error(result.message || "Operation failed");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error.message || "Failed to submit prediction");
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => router.back();

  return (
    <div className={styles.formMain}>
      <div className={styles.formHeader}>
        <div onClick={goBack} className={styles.backButton}>
          <BackArrow
            className={styles.backButtonIcon}
            aria-label="back icon"
            alt="back icon"
          />
        </div>
        <h1>{`${formType} ${Title}`}</h1>
      </div>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formContainerInner}>
          <div className={styles.formImageContainer}>
            {["leagueImage", "teamAImage", "teamBImage"].map((field) => (
              <FileInput
                key={field}
                onChange={(e) => handleImageUpload(e, field)}
                idImage={imageUrls[field]}
                label={field.replace(/([A-Z])/g, " $1").toLowerCase()}
                required={!isEditMode}
              />
            ))}
          </div>

          {!pathname.includes("/football") && (
            <div className={styles.formInputContainer}>
              <label>
                Sport{" "}
                {!isEditMode && <span className={styles.required}>*</span>}
              </label>
              <AccountDropdown
                options={sportOptions}
                value={sportOptions.find(
                  (option) => option.value === selectedSport
                )}
                onSelect={handleSportChange}
                dropPlaceHolder="Select Sport"
              />
              {errors.sport && (
                <span className={styles.errorText}>{errors.sport}</span>
              )}
            </div>
          )}

          <TeamSearchInput
            label="League"
            name="league"
            value={formData.league}
            onChange={handleChange}
            onSearchResult={handleTeamSearchResult}
            required={!isEditMode}
            title={pathname.includes("/football") ? "Football" : selectedSport}
            error={errors.league}
          />

          <div className={styles.formInputContainer}>
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              className={styles.inputField}
            />
          </div>

          {["A", "B"].map((team) => (
            <div
              key={team}
              className={`${styles.formInputContainer} ${styles.formTeamWrapper}`}
            >
              <TeamSearchInput
                label={`Team ${team}`}
                name={`team${team}`}
                value={formData[`team${team}`]}
                onChange={handleChange}
                onSearchResult={handleTeamSearchResult}
                required={!isEditMode}
                title={
                  pathname.includes("/football") ? "Football" : selectedSport
                }
                error={errors[`team${team}`]}
              />
              {isEditMode && (
                <div className={styles.formTeamContainer}>
                  <label>Score</label>
                  <input
                    type="text"
                    name={`team${team}score`}
                    value={formData[`team${team}score`]}
                    onChange={handleChange}
                    placeholder="Score"
                    className={styles.inputField}
                  />
                </div>
              )}
            </div>
          ))}

          <FormationSection
            team="A"
            formations={formationA}
            onFormationsChange={setFormationA}
          />
          <FormationSection
            team="B"
            formations={formationB}
            onFormationsChange={setFormationB}
          />

          <div className={styles.formInputContainer}>
            <label>
              Tip {!isEditMode && <span className={styles.required}>*</span>}
            </label>
            <input
              type="text"
              name="tip"
              value={formData.tip}
              onChange={handleChange}
              placeholder="Tip"
              className={`${styles.inputField} ${
                errors.tip ? styles.errorInput : ""
              }`}
              required={!isEditMode}
            />
            {errors.tip && (
              <span className={styles.errorText}>{errors.tip}</span>
            )}
          </div>

          <div className={styles.formInputContainer}>
            <label>
              Time {!isEditMode && <span className={styles.required}>*</span>}
            </label>
            <input
              type="datetime-local"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`${styles.inputField} ${
                errors.time ? styles.errorInput : ""
              }`}
              required={!isEditMode}
            />
            {errors.time && (
              <span className={styles.errorText}>{errors.time}</span>
            )}
          </div>

          {isEditMode && (
            <>
              <div className={styles.formInputContainer}>
                <label>Status</label>
                <input
                  type="text"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  placeholder="Status"
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formToggleContainer}>
                <ToggleBar
                  Position={formData.showScore}
                  Toggle={() => toggleVisibility("showScore")}
                  Placeholder={formData.showScore ? "Hide score" : "Show score"}
                />
                <ToggleBar
                  Position={formData.showBtn}
                  Toggle={() => toggleVisibility("showBtn")}
                  Placeholder={formData.showBtn ? "Hide button" : "Show button"}
                />
              </div>
            </>
          )}
        </div>

        <button
          type="submit"
          className={`${styles.submitButton} ${
            isLoading ? styles.loading : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : `${formType} ${Title}`}
        </button>
      </form>
    </div>
  );
}
