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
import { HiOutlineDownload as DownloadIcon } from "react-icons/hi";
import {
  MdDeleteOutline as DeleteIcon,
  MdOutlineEmail as EmailIcon,
} from "react-icons/md";
import { IoCopy as CopyIcon } from "react-icons/io5";

export default function AccountTable() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchPaymentPlans, paymentPlans } = usePaymentStore();
  const { sendBulkEmails, toggleAdmin, getUsersByRole, deleteUserAccount } =
    useAuthStore();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await getUsersByRole("admin");
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
  }, [getUsersByRole, fetchPaymentPlans]);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const response = await deleteUserAccount(userId);
      if (response.success) {
        toast.success(response.message);
        const updatedUsers = await getUsersByRole("admin");
        if (updatedUsers.success) {
          setUsers(updatedUsers.data.users);
        }
      } else {
        toast.error(response.message);
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
      const updatedUsers = await getUsersByRole("admin");
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
    const adminUser = users.find((user) => user.isAdmin);
    if (adminUser.length === 0) {
      toast.error("No admin users found");
      return;
    }

    const emailData = {
      emails: users.map((user) => user.email),
      subject: "Admin updates",
      message: "Continue with the good work ",
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
          Alt="No admin account"
          NothingImage={EmptyAccount}
          Text="No  admin account available"
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
              Info
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
                    <td>
                      <ToggleBar
                        Position={user.isAdmin}
                        Toggle={() => handleToggleAdmin(user._id, user.isAdmin)}
                        Placeholder={user.isAdmin ? "Remove" : "Add"}
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
