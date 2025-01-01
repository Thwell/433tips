"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import MobileDropdown from "@/app/components/MobileDropdown";
import styles from "@/app/styles/mobileFilter.module.css";
import { BiWorld as CountryIcon } from "react-icons/bi";
import { BiFootball as FootballIcon } from "react-icons/bi";
import date from "date-and-time";

export default function MobileFilter({ predictions, title }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentDate = date.format(new Date(), "DD-MM-YYYY");
  const initialDate = searchParams.get("date") || currentDate;
  
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [league, setLeague] = useState(searchParams.get("league") || "");
  const [country, setCountry] = useState(searchParams.get("country") || "");

  const { countryData, leagueData } = useMemo(() => {
    if (!Array.isArray(predictions)) {
      return { countryData: [], leagueData: [] };
    }

    const uniqueCountries = new Set();
    const uniqueLeagues = new Set();

    predictions.forEach(prediction => {
      if (prediction?.country) {
        uniqueCountries.add(prediction.country);
      }
      if (prediction?.league) {
        uniqueLeagues.add(prediction.league);
      }
    });

    const countryData = Array.from(uniqueCountries)
      .sort()
      .map(country => ({
        label: country.charAt(0).toUpperCase() + country.slice(1).toLowerCase(),
        value: country.toLowerCase()
      }));

    const leagueData = Array.from(uniqueLeagues)
      .sort()
      .map(league => ({
        label: league,
        value: league.toLowerCase()
      }));

    return { countryData, leagueData };
  }, [predictions]);

  const updateURL = useMemo(
    () =>
      debounce((params) => {
        const urlParams = new URLSearchParams(searchParams);
        
        Object.entries(params).forEach(([key, value]) => {
          if (value) {
            urlParams.set(key, value);
          } else {
            urlParams.delete(key);
          }
        });

        const queryString = urlParams.toString();
        const newPath = `${pathname}${queryString ? '?' + queryString : ''}`;
        router.replace(newPath);
      }, 300),
    [pathname, router, searchParams]
  );

  useEffect(() => {
    updateURL({
      date: selectedDate,
      league,
      country
    });

    return () => updateURL.cancel();
  }, [selectedDate, league, country, updateURL]);

  const handleLeagueSelect = useCallback((selectedValue) => {
    setLeague(selectedValue);
  }, []);

  const handleCountrySelect = useCallback((selectedValue) => {
    setCountry(selectedValue);
  }, []);

  const handleDateChange = useCallback((e) => {
    const rawDate = new Date(e.target.value);
    const formattedDate = date.format(rawDate, "DD-MM-YYYY");
    setSelectedDate(formattedDate);
  }, []);

  return (
    <div className={styles.mobileFilterContainer}>
      <div className={styles.mobileFilterHead}>
        <h1>{title} betting tips and prediction</h1>
        <h2>({selectedDate})</h2>
      </div>
      <div className={styles.filterInner}>
        <MobileDropdown
          options={leagueData}
          Icon={
            <FootballIcon
              className={styles.filterIcon}
              aria-label="league icon"
            />
          }
          dropPlaceHolder="League"
          onSelect={handleLeagueSelect}
          value={league}
        />

        <MobileDropdown
          options={countryData}
          Icon={
            <CountryIcon
              className={styles.filterIcon}
              aria-label="country icon"
            />
          }
          dropPlaceHolder="Country"
          onSelect={handleCountrySelect}
          value={country}
        />

        <div className={styles.filterDate}>
          <input
            type="date"
            className={styles.dateInput}
            onChange={handleDateChange}
            value={selectedDate ? date.format(new Date(selectedDate.split('-').reverse().join('-')), "YYYY-MM-DD") : ""}
          />
        </div>
      </div>
    </div>
  );
}

const debounce = (func, wait) => {
  let timeout;
  const debouncedFunc = (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  debouncedFunc.cancel = () => clearTimeout(timeout);
  return debouncedFunc;
};