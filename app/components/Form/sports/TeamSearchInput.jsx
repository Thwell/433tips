"use client";

import { useState, useEffect } from "react";
import Loader from "@/app/components/StateLoader";
import styles from "@/app/styles/form.module.css";
import { useSportStore } from "@/app/store/SportApi";

const TeamSearchInput = ({ 
    label, 
    value, 
    onChange, 
    onSearchResult, 
    name, 
    required = true, 
    title,
    error 
  }) => {
    const { sports, footballPredictions, fetchSports, fetchFootballPredictions } = useSportStore();
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
  
    useEffect(() => {
      const initializeData = async () => {
        if (title?.toLowerCase() === "football" && footballPredictions.length === 0) {
          await fetchFootballPredictions();
        } else if (title?.toLowerCase() !== "football" && sports.length === 0) {
          await fetchSports();
        }
      };
      initializeData();
    }, [title, fetchFootballPredictions, sports, footballPredictions, fetchSports]);
  
    const handleSearch = (searchValue) => {
      onChange({ target: { name, value: searchValue } });
      if (searchValue.length < 2) {
        setSearchResults([]);
        return;
      }
  
      setIsSearching(true);
      const searchTerm = searchValue.toLowerCase();
      let data = title?.toLowerCase() === "football" ? footballPredictions : sports;
      
      if (title?.toLowerCase() !== "football") {
        data = data.filter(item => item.sport === title);
      }
      
      let results = [];
      
      if (name === 'league') {
        results = data
          .filter((item, index, self) => {
            const league = item.league?.toLowerCase();
            return league?.includes(searchTerm) && 
                   self.findIndex(t => t.league?.toLowerCase() === league) === index;
          })
          .map(item => ({
            league: item.league,
            leagueIcon: item.leagueIcon
          }));
      } else {
        const searchByTeam = name === 'teamA' ? 'teamA' : 'teamB';
        const oppositeTeam = name === 'teamA' ? 'teamB' : 'teamA';
        
        results = data
          .filter(item => {
            const teamA = item._id.teamA?.toLowerCase();
            const teamB = item._id.teamB?.toLowerCase();
            return teamA?.includes(searchTerm) || teamB?.includes(searchTerm);
          })
          .flatMap(item => {
            const teams = [];
            if (searchByTeam === 'teamA' && item._id.teamA?.toLowerCase().includes(searchTerm)) {
              teams.push({
                team: item._id.teamA,
                league: item.league,
                teamIcon: item.teamAIcon,
                leagueIcon: item.leagueIcon,
                isTeamA: true
              });
            }
            if (searchByTeam === 'teamB' && item._id.teamB?.toLowerCase().includes(searchTerm)) {
              teams.push({
                team: item._id.teamB,
                league: item.league,
                teamIcon: item.teamBIcon,
                leagueIcon: item.leagueIcon,
                isTeamA: false
              });
            }
            return teams;
          });
      }
  
      results = results.filter((item, index, self) => 
        index === self.findIndex((t) => 
          (item.team ? item.team === t.team : item.league === t.league)
        )
      ).slice(0, 5);
  
      setSearchResults(results);
      setIsSearching(false);
    };
  
    const handleSelect = (result) => {
      if (name === 'league') {
        onChange({ target: { name, value: result.league } });
        onSearchResult({
          league: result.league,
          leagueIcon: result.leagueIcon
        });
      } else {
        onChange({ target: { name, value: result.team } });
        onSearchResult({
          team: result.team,
          league: result.league,
          teamIcon: result.teamIcon,
          leagueIcon: result.leagueIcon,
          isTeamA: result.isTeamA
        });
      }
      setSearchResults([]);
    };
  
    return (
      <div className={styles.formTeamContainer}>
        <label>{label} {required && <span className={styles.required}>*</span>}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => handleSearch(e.target.value)}
          className={`${styles.inputField} ${error ? styles.errorInput : ''}`}
          placeholder={`Search ${label}`}
        />
        {error && <span className={styles.errorText}>{error}</span>}
        {searchResults.length > 0 && (
          <div className={styles.searchResults}>
            {searchResults.map((result, index) => (
              <span
                key={index}
                className={styles.searchResultItem}
                onClick={() => handleSelect(result)}
              >
                {name === 'league' ? result.league : result.team}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };
export default TeamSearchInput;
