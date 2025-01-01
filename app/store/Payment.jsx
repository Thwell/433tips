import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "@/app/store/Auth";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const usePaymentStore = create(
  persist(
    (set, get) => ({
      paymentPlans: [],
      loading: false,
      error: null,

      fetchPaymentPlans: async () => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`${SERVER_API}/payment`);
          
          const data = await response.json();
          if (data.status === "success") {
            set({ paymentPlans: data.data });
            return { success: true, data: data.data , message: data.message };
          }
          throw new Error(data.message);
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message || "Failed to fetch payment plans" };
        } finally {
          set({ loading: false });
        }
      },


      getPaymentPlanByCountry: async (country) => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`${SERVER_API}/payment/${encodeURIComponent(country)}`);
          
          const data = await response.json();
          if (data.status === "success") {
            return { success: true, data: data.data };
          }
          throw new Error(data.message);
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

    
      createPaymentPlan: async (planData) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;
          
          const response = await fetch(`${SERVER_API}/payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(planData)
          });

          const data = await response.json();
          if (data.status === "success") {
            set(state => ({
              paymentPlans: [...state.paymentPlans, data.data]
            }));
            return { success: true, data: data.data };
          }
          throw new Error(data.message);
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },


      updatePaymentPlan: async (id, updateData) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;
          
          const response = await fetch(`${SERVER_API}/payment/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(updateData)
          });

          const data = await response.json();
          if (data.status === "success") {
            set(state => ({
              paymentPlans: state.paymentPlans.map(plan => 
                plan._id === id ? data.data : plan
              )
            }));
            return { success: true, data: data.data };
          }
          throw new Error(data.message);
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      deletePaymentPlan: async (id) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;
          
          const response = await fetch(`${SERVER_API}/payment/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });

          const data = await response.json();
          if (data.status === "success") {
            set(state => ({
              paymentPlans: state.paymentPlans.filter(plan => plan._id !== id)
            }));
            return { success: true };
          }
          throw new Error(data.message);
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "payment-store",
      getStorage: () => localStorage,
    }
  )
);