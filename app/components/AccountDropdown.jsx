"use client";

import { useState, useRef, useEffect } from "react";
import styles from "@/app/styles/accountDropdown.module.css";
import { RiArrowDropDownLine as DropdownIcon } from "react-icons/ri";

export default function Dropdown({ options, onSelect, Icon, dropPlaceHolder }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <div
        className={styles.dropdownInput}
        onClick={() => setIsOpen(!isOpen)}
        ref={triggerRef}
      >
        {Icon}
        <span>{selectedOption || dropPlaceHolder}</span>
        <DropdownIcon className={styles.dropdownIcon} aria-label="Dropdown icon"  />
      </div>
      {isOpen && options && options.length > 0 && (
        <div className={styles.dropdownArea}>
          {options.map((option, index) => (
            <span key={index} onClick={() => handleSelect(option)}>
              {option}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
