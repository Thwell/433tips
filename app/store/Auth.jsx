import { create } from "zustand";
import { persist } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;
const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000; // 50 minutes

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuth: false,
      userId: "",
      username: "",
      email: "",
      country: "",
      profileImage: "",
      referralCode: "",
      isVip: false,
      vipPlan: "",
      duration: "",
      expires: "",
      isAdmin: false,
      payment: 0,
      accessToken: "",
      refreshToken: "",
      lastLogin: null,
      tokenExpirationTime: null,
      refreshTimeoutId: null,
      emailVerified: false,
      referredBy: "",
      referrals: [],
      activeUsersCount: 0,
      vipUsersCount: 0,
      adminUsersCount: 0,
      isAuthorized: false,

      setUser: (userData) => {
        const tokenExpirationTime = Date.now() + TOKEN_REFRESH_INTERVAL;
        set({
          isAuth: true,
          userId: userData.id,
          username: userData.username,
          email: userData.email,
          payment: userData.payment || 0,
          duration: userData.duration || 0,
          expires: userData.expires || null,
          country: userData.country || "",
          profileImage: userData.profileImage || "",
          referralCode: userData.referralCode || "",
          isVip: userData.isVip || false,
          vipPlan: userData.vipPlan || "",
          isAdmin: userData.isAdmin || false,
          emailVerified: userData.emailVerified || false,
          referredBy: userData.referredBy || "",
          referrals: userData.referrals || [],
          isAuthorized: userData.isAuthorized || false,
          accessToken: userData.tokens.accessToken,
          refreshToken: userData.tokens.refreshToken,
          lastLogin: userData.lastLogin || new Date().toISOString(),
          tokenExpirationTime,
        });
        get().scheduleTokenRefresh();
      },

      updateUser: (userData) => {
        set((state) => ({
          ...state,
          ...userData,
        }));
      },

      clearUser: () => {
        get().cancelTokenRefresh();
        set({
          isAuth: false,
          userId: "",
          username: "",
          email: "",
          country: "",
          profileImage: "",
          referralCode: "",
          isVip: false,
          vipPlan: "",
          duration: "",
          expires: "",
          isAdmin: false,
          payment: 0,
          accessToken: "",
          refreshToken: "",
          lastLogin: null,
          tokenExpirationTime: null,
          emailVerified: false,
          referredBy: "",
          referrals: [],
          isAuthorized: false,
        });
      },

      sendVerificationEmail: async (email) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/send-verification`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();
          return { success: data.status === "success", message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to send verification email" };
        }
      },

      verifyEmail: async (email, verificationCode) => {
        try {
          const { accessToken } = get(); 
          
          const response = await fetch(`${SERVER_API}/auth/verify-email`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}` 
            },
            body: JSON.stringify({ email, verificationCode }),
          });
      
          const data = await response.json();
          if (data.status === "success") {
            set({ emailVerified: true });
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Email verification failed" };
        }
      },

      register: async (userData) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          });
      
          const data = await response.json();
      
          if (data.status === "success") {
            const userWithTokens = {
              ...data.data.user,
              tokens: data.data.tokens,
              profileImage: "",
              isAdmin: false,
              lastLogin: new Date().toISOString(),
            };
            
            get().setUser(userWithTokens);
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Registration failed" };
        }
      },

      login: async (email, password) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
      
          const data = await response.json();
      
          if (data.data?.user?.emailVerified === false) {
            return { 
              success: false, 
              message: "Please verify your email to log in. Check your inbox.",
              isVip: data.data?.user?.isVip || false,
              isAdmin: data.data?.user?.isAdmin || false,
            };
          }
      
          if (data.status === "success" && data.data?.user && data.data?.tokens) {
            const userWithTokens = {
              ...data.data.user,
              tokens: data.data.tokens,
              profileImage: data.data.user.profileImage || "",
              lastLogin: data.data.user.lastLogin || new Date().toISOString(),
            };
      
            get().setUser(userWithTokens);
            return { 
              success: true, 
              message: data.message,
              isVip: data.data.user.isVip, 
              isAdmin: data.data.user.isAdmin 
            };
          }
      
          return { 
            success: false, 
            message: data.message || "Login failed", 
            isVip: data.data?.user?.isVip || false, 
            isAdmin: data.data?.user?.isAdmin || false 
          };
        } catch (error) {
          return { 
            success: false, 
            message: "Login failed", 
            isVip: false, 
            isAdmin: false 
          };
        }
      },
      
      logout: async () => {
        try {
          const { accessToken } = get();
          await fetch(`${SERVER_API}/auth/logout`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          get().clearUser();
          return { success: true, message: "Logout successful" };
        } catch (error) {
          return { success: false, message: "Logout failed" };
        }
      },

      refreshAccessToken: async () => {
        try {
          const { refreshToken } = get();
          if (!refreshToken) {
            get().clearUser();
            return false;
          }

          const response = await fetch(`${SERVER_API}/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          const data = await response.json();
          if (data.status === "success") {
            set({
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              tokenExpirationTime: Date.now() + TOKEN_REFRESH_INTERVAL,
            });
            get().scheduleTokenRefresh();
            return true;
          }
          get().clearUser();
          return false;
        } catch (error) {
          get().clearUser();
          return false;
        }
      },

      updateProfile: async (updateData) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/update-profile`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(updateData),
          });

          const data = await response.json();
          if (data.status === "success") {
            get().updateUser(data.data.user);
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Profile update failed" };
        }
      },

      updatePassword: async (passwordData) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/update-password`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(passwordData),
          });

          const data = await response.json();
          return { success: data.status === "success", message: data.message };
        } catch (error) {
          return { success: false, message: "Password update failed" };
        }
      },

      updateProfileImage: async (imageData) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/update-profile-image`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ image: imageData }),
          });

          const data = await response.json();
          if (data.status === "success") {
            set({ profileImage: data.data.profileImage });
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Profile image update failed" };
        }
      },

      requestPasswordReset: async (email) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/reset-password-request`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();
          return { success: data.status === "success", message: data.message };
        } catch (error) {
          return { success: false, message: "Password reset request failed" };
        }
      },

      resetPassword: async (token, newPassword) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, newPassword }),
          });

          const data = await response.json();
          return { success: data.status === "success", message: data.message };
        } catch (error) {
          return { success: false, message: "Password reset failed" };
        }
      },

      toggleVipStatus: async (userData) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/admin/toggle-vip`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(userData),
          });

          const data = await response.json();
          if (data.status === "success") {
            const updatedUsers = await get().getAllUsers();
            // Update VIP users count 
            const vipUsersResponse = await get().getUsersByRole('vip');
            if (vipUsersResponse.success) {
              set({ vipUsersCount: vipUsersResponse.data.count });
            }
            return { ...data, users: updatedUsers.data.users };
          }
          return data;
        } catch (error) {
          return { success: false, message: "VIP status update failed" };
        }
      },

      submitContactForm: async (email, username, message) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, username, message }),
          });
      
          const data = await response.json();
          if (data.status === "success") {
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to submit contact form" };
        }
      },

      toggleAdmin: async (userId, makeAdmin) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/admin/toggle`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ userId, makeAdmin }),
          });

          const data = await response.json();
          if (data.status === "success") {
            const updatedUsers = await get().getAllUsers();
            if (updatedUsers.success) {
              return { ...data, users: updatedUsers.data.users };
            }
          }
          return { success: data.status === "success", message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to toggle admin status" };
        }
      },

      bulkDeleteAccounts: async (userIds) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/admin/bulk-delete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ userIds }),
          });

          const data = await response.json();
          return {
            success: data.status === "success",
            message: data.message,
            data: data.data,
          };
        } catch (error) {
          return {
            success: false,
            message: "Failed to perform bulk deletion",
          };
        }
      },

      deleteUserAccount: async (userId) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/delete-account/${userId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = await response.json();
          return { success: data.status === "success", message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to delete user account" };
        }
      },

      deleteAccount: async () => {
        try {
          const { accessToken } = get();

          if (!accessToken) {
            return { success: false, message: "Not authenticated" };
          }
          
          const response = await fetch(`${SERVER_API}/auth/delete-account`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = await response.json();
          if (data.status === "success") {
            get().clearUser();
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to delete account" };
        }
      },

      


      getAllUsers: async () => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/admin/users`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          const data = await response.json();
          if (data.status === "success") {
            set({ activeUsersCount: data.data.count });
          }
          return { success: data.status === "success", data: data.data };
        } catch (error) {
          return { success: false, message: "Failed to fetch users" };
        }
      },

      getUsersByRole: async (role, action, userId) => {
        try {
          const { accessToken } = get();
          let url = `${SERVER_API}/auth/admin/users/by-role?role=${role}`;
          let options = {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
          };

          if (action === "delete" && userId) {
            options = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ userId }),
            };
          }

          const response = await fetch(url, options);
          const data = await response.json();
          if (data.status === "success") {
            if (role === 'vip') {
              set({ vipUsersCount: data.data.count });
            } else if (role === 'admin') {
              set({ adminUsersCount: data.data.count });
            }
          }
          return { success: data.status === "success", data: data.data };
        } catch (error) {
          return { success: false, message: "Failed to fetch/update users by role" };
        }
      },

      setActiveUsersCount: (count) => set({ activeUsersCount: count }),
      setVipUsersCount: (count) => set({ vipUsersCount: count }),
      setAdminUsersCount: (count) => set({ adminUsersCount: count }),


      getRevenueAnalytics: async () => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/admin/analytics/revenue`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          const data = await response.json();
          return { success: data.status === "success", data: data.data };
        } catch (error) {
          return { success: false, message: "Failed to fetch revenue analytics" };
        }
      },

      sendBulkEmails: async (emailData) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/admin/email/bulk`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(emailData),
          });

          const data = await response.json();
          return { success: data.status === "success", message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to send bulk emails" };
        }
      },

      scheduleTokenRefresh: () => {
        const { tokenExpirationTime, refreshTimeoutId } = get();
        if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
        }

        const timeUntilRefresh = Math.max(0, tokenExpirationTime - Date.now() - 60000);
        const newTimeoutId = setTimeout(() => {
          get().refreshAccessToken();
        }, timeUntilRefresh);

        set({ refreshTimeoutId: newTimeoutId });
      },

      cancelTokenRefresh: () => {
        const { refreshTimeoutId } = get();
        if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
          set({ refreshTimeoutId: null });
        }
      },
    }),
    {
      name: "authenticate-store",
      getStorage: () => localStorage,
    }
  )
);