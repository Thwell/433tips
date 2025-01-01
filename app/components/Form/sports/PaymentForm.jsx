"use client";

import { toast } from 'sonner';
import { useState, useEffect } from "react";
import Loader from "@/app/components/StateLoader";
import styles from "@/app/styles/form.module.css";
import { usePaymentStore } from "@/app/store/Payment";
import { IoIosArrowBack as BackArrow } from "react-icons/io";
import AccountDropdown from "@/app/components/Form/FormDropdown";
import { useRouter, useSearchParams } from "next/navigation";

const countryOptions = [
  { currency: "KE", label: "Kenya" },
  { currency: "NG", label: "Nigeria" },
  { currency: "CM", label: "Cameroon" },
  { currency: "GH", label: "Ghana" },
  { currency: "ZA", label: "South Africa" },
  { currency: "TZ", label: "Tanzania" },
  { currency: "UG", label: "Uganda" },
  { currency: "ZM", label: "Zambia" },
  { currency: "RW", label: "Rwanda" },
  { currency: "MW", label: "Malawi" },
  { currency: "USD", label: "Other" },
];

export default function PaymentForm({ Title }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formType = searchParams.get("form") || "";
  const paymentId = searchParams.get("id") || "";
  const isEditing = formType === "Edit";

  const { 
    createPaymentPlan, 
    updatePaymentPlan,
    loading,
    error 
  } = usePaymentStore();

  const [formData, setFormData] = useState({
    country: "",
    currency: "",
    weekly: "",
    monthly: "",
  });



  const handleDropdownChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      country: selectedOption.label,
      currency: selectedOption.currency,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers and empty string
    if (value === '' || /^\d+$/.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!formData.country) {
      toast.error("Please select a country");
      return false;
    }
    
    const weekly = Number(formData.weekly);
    const monthly = Number(formData.monthly);
    
    if (weekly === 0 && monthly === 0) {
      toast.error("Please enter at least one price (weekly or monthly)");
      return false;
    }
    
    if ((formData.weekly && weekly <= 0) || (formData.monthly && monthly <= 0)) {
      toast.error("Prices must be greater than 0");
      return false;
    }
    
    return true;
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      const planData = {
        country: formData.country,
        currency: formData.currency,
        weekly: formData.weekly ? Number(formData.weekly) : 0,
        monthly: formData.monthly ? Number(formData.monthly) : 0,
      };

      let result;
      if (isEditing) {
        result = await updatePaymentPlan(paymentId, planData);
      } else {
        result = await createPaymentPlan(planData);
      }

      if (result.success) {
        toast.success(`Payment plan ${isEditing ? 'updated' : 'created'} successfully`);
      } else {
        throw new Error(result.message || `Failed to ${isEditing ? 'update' : 'create'} payment plan`);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || `Failed to ${isEditing ? 'update' : 'create'} payment plan`);
    }
  };

  const goBack = () => {
    router.back();
  };

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

      <form onSubmit={onSubmit} className={styles.formContainer}>
        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Country Dropdown */}
        <div className={styles.formInputContainer}>
          <label>Country</label>
          <AccountDropdown
            options={countryOptions}
            dropPlaceHolder="Choose country"
            onSelect={handleDropdownChange}
            value={formData.country}
            disabled={isEditing}
            initialValue={isEditing ? countryOptions.find(opt => opt.label === formData.country) : null}
          />
        </div>

        {/* Weekly Price Input */}
        <div className={styles.formInputContainer}>
          <label>Weekly Price</label>
          <input
            type="text"
            name="weekly"
            value={formData.weekly}
            onChange={handleChange}
            placeholder="30000"
            className={styles.inputField}
          />
        </div>

        {/* Monthly Price Input */}
        <div className={styles.formInputContainer}>
          <label>Monthly Price</label>
          <input
            type="text"
            name="monthly"
            value={formData.monthly}
            onChange={handleChange}
            placeholder="100000"
            className={styles.inputField}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? <Loader /> : isEditing ? "Update Payment" : "Add Payment"}
        </button>
      </form>
    </div>
  );
}