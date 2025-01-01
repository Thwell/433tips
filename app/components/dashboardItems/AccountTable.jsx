"use client";

import { toast } from "sonner";
import Image from "next/image";
import Nothing from "@/app/components/Nothing";
import { useAuthStore } from "@/app/store/Auth";
import ToggleBar from "@/app/components/ToggleBar";
import { usePaymentStore } from "@/app/store/Payment";
import LoadingLogo from "@/app/components/LoadingLogo";
import ProfileImg from "@/public/assets/auth4Image.jpg";
import { useState, useEffect, useCallback } from "react";
import styles from "@/app/styles/accounttable.module.css";
import EmptyAccount from "@/public/assets/emptyAccount.png";
import AccountDropdown from "@/app/components/AccountDropdown";
import { HiOutlineDownload as DownloadIcon } from "react-icons/hi";
import {
  MdDeleteOutline as DeleteIcon,
  MdOutlineEmail as EmailIcon,
} from "react-icons/md";
import { IoCopy as CopyIcon } from "react-icons/io5";

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

export default function AccountTable() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchPaymentPlans, paymentPlans } = usePaymentStore();
  const {
    toggleVipStatus,
    sendBulkEmails,
    toggleAdmin,
    getAllUsers,
    deleteUserAccount,
  } = useAuthStore();

  const planTypes = ["weekly", "monthly"];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await getAllUsers();
        if (response.success) {
          setUsers(response.data.users);
        } else {
          toast.error(response.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
    fetchPaymentPlans();
  }, [getAllUsers, fetchPaymentPlans]);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const response = await deleteUserAccount(userId);
      if (response.success) {
        toast.success(response.message);
        const updatedUsers = await getAllUsers();
        if (updatedUsers.success) {
          setUsers(updatedUsers.data.users);
        }
      } else {
        toast.error(response.message);
      }
    }
  };

  const isCountryInOptions = (countryName) => {
    return countryOptions.some(
      (option) => option.label.toLowerCase() === countryName.toLowerCase()
    );
  };

  const getPlanAmount = (country, planType) => {
    const countryToUse = isCountryInOptions(country) ? country : "Other";
    const plan = paymentPlans.find((p) => p.country === countryToUse);
    if (!plan) return null;
    return plan[planType];
  };

  const handlePlanSelect = async (userId, selectedPlanType) => {
    const user = users.find((u) => u._id === userId);
    if (!user) {
      toast.error("User not found");
      return;
    }

    const countryToUse = isCountryInOptions(user.country)
      ? user.country
      : "Other";
    const planAmount = getPlanAmount(countryToUse, selectedPlanType);

    if (!planAmount) {
      toast.error(`No ${selectedPlanType} plan found for ${user.country}`);
      return;
    }

    const vipData = {
      userId,
      isVip: true,
      vipPlan: selectedPlanType,
      payment: planAmount,
      country: user.country,
    };

    const response = await toggleVipStatus(vipData);
    if (response.success) {
      toast.success(`Plan updated to ${selectedPlanType}`);
      const updatedUsers = await getAllUsers();
      if (updatedUsers.success) {
        setUsers(updatedUsers.data.users);
      }
    } else {
      toast.error(response.message);
    }
  };

  const handleToggleVip = async (userId, currentVipStatus, currentPlan) => {
    const user = users.find((u) => u._id === userId);
    if (!user) {
      toast.error("User not found");
      return;
    }

    if (!currentVipStatus && !currentPlan) {
      toast.error("Please select a plan type first");
      return;
    }

    const countryToUse = isCountryInOptions(user.country)
      ? user.country
      : "Other";
    const planAmount = getPlanAmount(countryToUse, currentPlan);

    if (!currentVipStatus && !planAmount) {
      toast.error(`No ${currentPlan} plan found for ${user.country}`);
      return;
    }

    // Update state immediately
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u._id === userId ? { ...u, isVip: !currentVipStatus } : u
      )
    );

    const vipData = {
      userId,
      isVip: !currentVipStatus,
      vipPlan: !currentVipStatus ? currentPlan : "",
      payment: !currentVipStatus ? planAmount : 0,
      country: user.country,
    };

    const response = await toggleVipStatus(vipData);

    if (response.success) {
      toast.success(response.message);
      if (response.data?.user) {
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u._id === userId ? response.data.user : u))
        );
      }
    } else {
      toast.error(response.message);
      const updatedUsers = await getAllUsers();
      if (updatedUsers.success) {
        setUsers(updatedUsers.data.users);
      }
    }
  };

  const handleToggleAdmin = async (userId, currentAdminStatus) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u._id === userId ? { ...u, isAdmin: !currentAdminStatus } : u
      )
    );

    const response = await toggleAdmin(userId, !currentAdminStatus);
    if (response.success) {
      toast.success(response.message);
      if (response.users) {
        setUsers(response.users);
      }
    } else {
      toast.error(response.message);
      const updatedUsers = await getAllUsers();
      if (updatedUsers.success) {
        setUsers(updatedUsers.data.users);
      }
    }
  };

  const fetchGmailAccounts = useCallback(() => {
    const gmailEmails = users
      .filter((user) => user.email.endsWith("@gmail.com"))
      .map((user) => user.email)
      .join(", ");

    navigator.clipboard
      .writeText(gmailEmails)
      .then(() => toast.success("Gmail addresses copied to clipboard!"))
      .catch(() => toast.error("Failed to copy emails to clipboard."));
  }, [users]);

  const downloadEmail = useCallback(() => {
    const emailList = users.map((user) => user.email).join("\n");
    const blob = new Blob([emailList], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "emails.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Emails downloaded successfully!");
  }, [users]);

  const sendSubcriptionEmail = async () => {
    const emailData = {
      emails: users.map((user) => user.email),
      subject: "Join Vip Members",
      message:
        "Join our vip members and get exclusive access to accurate predictions and tips on football, Tennis, basketball, and more...",
    };

    const response = await sendBulkEmails(emailData);
    if (response.success) {
      toast.success("VIP subscription emails sent successfully");
    } else {
      toast.error(response.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCurrentPlanAmount = (user) => {
    if (!user.isVip || !user.vipPlan) return "N/A";
    const countryToUse = isCountryInOptions(user.country)
      ? user.country
      : "Other";
    const plan = paymentPlans.find((p) => p.country === countryToUse);
    if (!plan) return "N/A";
    const amount = plan[user.vipPlan];
    return amount ? `${amount} ${plan.currency || ""}` : "N/A";
  };

  if (isLoading) {
    return <LoadingLogo />;
  }

  return (
    <>
      {users.length === 0 ? (
        <Nothing
          Alt="No users"
          NothingImage={EmptyAccount}
          Text="No users available"
        />
      ) : (
        <div className={styles.accountContainer}>
          <div className={styles.tableHeader}>
            <div className={styles.copyContainer} onClick={downloadEmail}>
              <DownloadIcon
                aria-label="download icon"
                className={styles.copyIcon}
              />
              Emails
            </div>

            <div
              className={styles.copyContainer}
              onClick={sendSubcriptionEmail}
            >
              <EmailIcon aria-label="email icon" className={styles.copyIcon} />
              Subcriptions
            </div>
            <div className={styles.copyContainer} onClick={fetchGmailAccounts}>
              <CopyIcon aria-label="copy icon" className={styles.copyIcon} />
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.sportsTable}>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Country</th>
                  <th>VIP Status</th>
                  <th>Plan Type</th>
                  <th>Admin Status</th>
                  <th>Toggle VIP</th>
                  <th>Toggle Admin</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className={styles.tableRow}>
                    <td className={styles.userContainer}>
                      <Image
                        src={user.profileImage || ProfileImg}
                        height={35}
                        width={35}
                        alt={`${user.username}'s profile`}
                        priority
                        className={styles.profileImg}
                      />
                      {user.username}
                    </td>
                    <td>{user.email}</td>
                    <td>{user.country}</td>
                    <td>{user.isVip ? "VIP" : "User"}</td>
                    <td>
                      <AccountDropdown
                        options={planTypes}
                        value={user.vipPlan || ""}
                        onSelect={(plan) => handlePlanSelect(user._id, plan)}
                      />
                    </td>
                    <td>{formatDate(user.activation || user.createdAt)}</td>
                    <td>
                      <ToggleBar
                        Position={user.isVip}
                        Toggle={() =>
                          handleToggleVip(user._id, user.isVip, user.vipPlan)
                        }
                        Placeholder={user.isVip ? "Deactivate" : "Activate"}
                      />
                    </td>
                    <td>
                      <ToggleBar
                        Position={user.isAdmin}
                        Toggle={() => handleToggleAdmin(user._id, user.isAdmin)}
                        Placeholder={
                          user.isAdmin ? "Remove Admin" : "Make Admin"
                        }
                      />
                    </td>
                    <td>
                      <DeleteIcon
                        onClick={() => handleDelete(user._id)}
                        aria-label="delete account"
                        className={styles.deleteIcon}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
