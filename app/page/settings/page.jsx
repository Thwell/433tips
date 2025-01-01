"use client";

import { toast } from 'sonner';
import Image from "next/image";
import Loader from "@/app/components/StateLoader";
import { useAuthStore } from "@/app/store/Auth";
import countries from "@/app/utility/Countries";
import { redirect, useRouter } from "next/navigation";
import styles from "@/app/styles/settings.module.css";
import ProfileImg from "@/public/assets/auth4Image.jpg";
import { useState, useEffect, useRef, useCallback } from "react";

import {
  FiEye as ShowPasswordIcon,
  FiEyeOff as HidePasswordIcon,
} from "react-icons/fi";
import { IoCopy as CopyIcon } from "react-icons/io5";
import { FaLink as LinkIcon } from "react-icons/fa";
import { BiWorld as CountryIcon } from "react-icons/bi";
import { MdDelete as DeleteIcon } from "react-icons/md";
import { FaRegUser as UserNameIcon } from "react-icons/fa6";
import { RiArrowDropDownLine as DropdownIcon } from "react-icons/ri";
import {
  MdOutlineVpnKey as PasswordIcon,
  MdOutlineEmail as EmailIcon,
  MdModeEdit as EditIcon,
} from "react-icons/md";

import Instagram from "@/public/icons/instagram.svg";
import Whatsapp from "@/public/icons/whatsapp.svg";
import LinkedIn from "@/public/icons/linkedIn.svg";
import Telegram from "@/public/icons/telegram.svg";
import Twitter from "@/public/icons/twitter.svg";
import Youtube from "@/public/icons/youtube.svg";

export default function Settings() {
  const {
    email,
    isAuth,
    username,
    country,
    clearUser,
    referralCode,
    profileImage,
    updateProfile,
    updatePassword,
    deleteAccount,
    updateProfileImage,
  } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    profileUpdate: false,
    passwordUpdate: false,
    deleteAccount: false,
    imageUpload: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const websiteUrl = "https://433tips.vercel.app";
  const [isOpen, setIsOpen] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const setLoadingState = (key, value) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }));
  };

  const [formData, setFormData] = useState({
    username: username || "",
    email: email || "",
    currentPassword: "",
    newPassword: "",
    country: country || "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    if (!isAuth) {
      router.push("/authentication/login");
    }
  }, [isAuth, router]);

  const generateShareLink = useCallback(() => {
    const link = `${websiteUrl}/authentication/signup?referral=${referralCode}`;
    setShareLink(link);
  }, [referralCode]);

  useEffect(() => {
    generateShareLink();
  }, [generateShareLink]);

  useEffect(() => {
    const countryObj = countries.find((c) => c.code === formData.country);
    if (countryObj) {
      setSearchTerm(countryObj.name);
    }
  }, [formData.country]);

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setIsCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 3000);
    });
  };

  const openSocialLink = (baseUrl) => {
    window.open(`${baseUrl}${encodeURIComponent(shareLink)}`, "_blank");
  };

  const socialData = [
    {
      name: "Twitter",
      icons: Twitter,
      link: "https://twitter.com/intent/tweet?url=",
    },
    {
      name: "Youtube",
      icons: Youtube,
      link: "https://www.youtube.com/share?url=",
    },
    { name: "Telegram", icons: Telegram, link: "https://t.me/share/url?url=" },
    {
      name: "LinkedIn",
      icons: LinkedIn,
      link: "https://www.linkedin.com/sharing/share-offsite/?url=",
    },
    {
      name: "Whatsapp",
      icons: Whatsapp,
      link: "https://api.whatsapp.com/send?text=",
    },
    {
      name: "Instagram",
      icons: Instagram,
      link: "https://www.instagram.com/share?url=",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountrySelect = (country) => {
    setFormData((prev) => ({ ...prev, country: country.name }));
    setSearchTerm(country.name);
    setIsOpen(false);
    setErrors((prev) => ({ ...prev, country: "" }));
  };

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Please upload an image smaller than 5MB.");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file.");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Image = reader.result;
        setLoadingState("imageUpload", true);
        try {
          const response = await updateProfileImage(base64Image);
          if (response.success) {
            toast.success("Profile image updated successfully");
          } else {
            toast.error(response.message || "Failed to update profile image");
          }
        } catch (error) {
          toast.error("An error occurred while updating profile image");
        } finally {
          setLoadingState("imageUpload", false);
        }
      };
    }
  };

  const validateProfileUpdate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!validateProfileUpdate()) return;

    setLoadingState("profileUpdate", true);
    try {
      const result = await updateProfile({
        newUsername: formData.username,
        newEmail: formData.email,
        newCountry: formData.country,
      });

      if (result.success) {
        toast.success("Profile updated successfully");
        await clearUser();
        router.push("/authentication/login");
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating profile");
    } finally {
      setLoadingState("profileUpdate", false);
    }
  };

  const validatePasswordUpdate = () => {
    const newErrors = {};
    if (!formData.currentPassword)
      newErrors.currentPassword = "Current password is required";
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!validatePasswordUpdate()) return;

    setLoadingState("passwordUpdate", true);
    try {
      const result = await updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (result.success) {
        toast.success("Password updated successfully");
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        }));
        await clearUser();
        router.push("/authentication/login");
      } else {
        toast.error(result.message || "Failed to update password");
      }
    } catch (error) {
      toast.error("An error occurred while updating password");
    } finally {
      setLoadingState("passwordUpdate", false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoadingState("deleteAccount", true);
    try {
      const result = await deleteAccount();
      if (result.success) {
        toast.success("Account deleted successfully");
        router.push("/authentication/signup");
      } else {
        toast.error(result.message || "Failed to delete account");
      }
    } catch (error) {
      toast.error("An error occurred while deleting account");
    } finally {
      setLoadingState("deleteAccount", false);
    }
  };

  return (
    <div className={styles.formSettingContainer}>
      <div className={styles.formSettingContainerInner}>
        <div className={styles.settingWrap}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <div className={styles.profileSection}>
            <div className={styles.profileImageContain}>
              <Image
                src={profileImage || ProfileImg}
                alt={username}
                className={styles.profileImage}
                width={100}
                height={100}
              />
              <div
                className={styles.uploadEditIcon}
                onClick={() => fileInputRef.current?.click()}
              >
                <EditIcon className={styles.editIcon} alt="Edit Icon" />
              </div>
            </div>
            <div className={styles.profileDetails}>
              <h1>{username}</h1>
              <div className={styles.profileGlass}>
                <h3>{email}</h3>
              </div>
              <div className={styles.socialWrapper}>
                <div className={styles.shareLinkCopy}>
                  <CopyIcon
                    className={styles.shareIcon}
                    alt="share icon"
                    onClick={copyLink}
                  />
                  <p>Copy or Refer to get vip offers</p>
                </div>
                <div className={styles.socialContainer}>
                  {socialData.map((data, index) => (
                    <div
                      className={styles.socialIconWrap}
                      key={index}
                      onClick={() => openSocialLink(data.link)}
                    >
                      <Image
                        className={styles.socialIcon}
                        src={data.icons}
                        alt={data.name}
                        height={30}
                        priority={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.settingWrapinfo}>
          <form onSubmit={handleProfileUpdate} className={styles.settingWrapS}>
            <div className={styles.settingInputContainer}>
              <label htmlFor="username" className={styles.settingLabel}>
                Username
              </label>
              <div className={styles.settingInput}>
                <UserNameIcon
                  className={styles.settingIcon}
                  alt="Username icon"
                  width={20}
                  height={20}
                />
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                />
              </div>
              {errors.username && (
                <p className={styles.errorText}>{errors.username}</p>
              )}
            </div>

            <div className={styles.settingInputContainer}>
              <label htmlFor="email" className={styles.settingLabel}>
                Email
              </label>
              <div className={styles.settingInput}>
                <EmailIcon
                  className={styles.settingIcon}
                  alt="email icon"
                  width={20}
                  height={20}
                />
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                />
              </div>
              {errors.email && (
                <p className={styles.errorText}>{errors.email}</p>
              )}
            </div>

            <div className={styles.settingInputContainer}>
              <label htmlFor="country" className={styles.settingLabel}>
                Country
              </label>
              <div className={styles.settingInput}>
                <CountryIcon
                  height={20}
                  alt="country icon"
                  className={styles.settingIcon}
                />
                <div className={styles.dropdownContainer} ref={dropdownRef}>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsOpen(true);
                    }}
                    onClick={() => setIsOpen(true)}
                    placeholder="Search Country"
                    className={styles.dropdownInput}
                  />
                  <DropdownIcon
                    alt="dropdown icon"
                    height={20}
                    className={`${styles.dropdownIcon} ${
                      isOpen ? styles.open : ""
                    }`}
                    onClick={() => setIsOpen(!isOpen)}
                  />
                  {isOpen && (
                    <div className={styles.dropdownArea}>
                      {filteredCountries.map((country) => (
                        <span
                          key={country.code}
                          className={styles.dropdownOption}
                          onClick={() => handleCountrySelect(country)}
                        >
                          {country.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {errors.country && (
                <p className={styles.errorText}>{errors.country}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loadingStates.profileUpdate}
              className={styles.formsettingButton}
            >
              {loadingStates.profileUpdate ? <Loader /> : "Update Profile"}
            </button>

            <p className={styles.errorText}>
              After updating you will be logged out
            </p>
          </form>

          <form onSubmit={handlePasswordUpdate} className={styles.settingWrapS}>
            <div className={styles.settingInputContainer}>
              <label htmlFor="currentPassword" className={styles.settingLabel}>
                Old Password
              </label>
              <div className={styles.settingInput}>
                <PasswordIcon
                  className={styles.settingIcon}
                  alt="password icon"
                  width={20}
                  height={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Old Password"
                />
                <button
                  type="button"
                  className={styles.showBtn}
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <ShowPasswordIcon
                      className={styles.settingIcon}
                      width={20}
                      height={20}
                    />
                  ) : (
                    <HidePasswordIcon
                      className={styles.settingIcon}
                      width={20}
                      height={20}
                    />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className={styles.errorText}>{errors.currentPassword}</p>
              )}
            </div>

            <div className={styles.settingInputContainer}>
              <label htmlFor="newPassword" className={styles.settingLabel}>
                New Password
              </label>
              <div className={styles.settingInput}>
                <PasswordIcon
                  className={styles.settingIcon}
                  alt="password icon"
                  width={20}
                  height={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="New Password"
                />
                <button
                  type="button"
                  className={styles.showBtn}
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <ShowPasswordIcon
                      className={styles.settingIcon}
                      width={20}
                      height={20}
                    />
                  ) : (
                    <HidePasswordIcon
                      className={styles.settingIcon}
                      width={20}
                      height={20}
                    />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className={styles.errorText}>{errors.newPassword}</p>
              )}
            </div>

            <div className={styles.settingInputContainer}>
              <label
                htmlFor="confirmNewPassword"
                className={styles.settingLabel}
              >
                Confirm New Password
              </label>
              <div className={styles.settingInput}>
                <PasswordIcon
                  className={styles.settingIcon}
                  alt="password icon"
                  width={20}
                  height={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm New Password"
                />
                <button
                  type="button"
                  className={styles.showBtn}
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <ShowPasswordIcon
                      className={styles.settingIcon}
                      width={20}
                      height={20}
                    />
                  ) : (
                    <HidePasswordIcon
                      className={styles.settingIcon}
                      width={20}
                      height={20}
                    />
                  )}
                </button>
              </div>
              {errors.confirmNewPassword && (
                <p className={styles.errorText}>{errors.confirmNewPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loadingStates.passwordUpdate}
              className={styles.formsettingButton}
            >
              {loadingStates.passwordUpdate ? <Loader /> : "Update Password"}
            </button>
            <p className={styles.errorText}>
              After updating your password, you will be logged out
            </p>
          </form>
        </div>
        <div className={styles.dangerZone}>
          <h2>Danger Zone</h2>
          <div className={styles.deleteAccount}>
            <div className={styles.deleteInfo}>
              <DeleteIcon className={styles.deleteIcon} />
              <div>
                <h3>Delete Account</h3>
                <p>Permanently delete your account</p>
              </div>
            </div>
            <button
              onClick={handleDeleteAccount}
              className={styles.deleteButton}
              disabled={loadingStates.deleteAccount}
            >
              {loadingStates.deleteAccount ? <Loader /> : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
