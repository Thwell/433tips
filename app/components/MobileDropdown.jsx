"use client";

import { useState, useRef } from "react";
import styles from "@/app/styles/mobileDropdown.module.css";
import { RiArrowDropDownLine as DropdownIcon } from "react-icons/ri";

export default function MobileDropdown({ options, onSelect, Icon, dropPlaceHolder, value }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  const selectedOption = options?.find(opt => opt.value === value);

  const handleSelect = (option) => {
    onSelect(option.value);
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
        <span>{selectedOption ? selectedOption.label : dropPlaceHolder}</span>
        <DropdownIcon className={styles.dropdownIcon} aria-label="Dropdown icon" />
      </div>
      {isOpen && options && options.length > 0 && (
        <div className={styles.dropdownArea}>
          {options.map((option, index) => (
            <span 
              key={option.value || index}
              onClick={() => handleSelect(option)}
              className={option.value === value ? styles.selected : ''}
            >
              {option.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}