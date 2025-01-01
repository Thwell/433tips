import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "@/app/store/Auth"; 

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const usePredictionStore = create(
  persist(
    (set, get) => ({
      predictions: [],
      singlePrediction: null,
      loading: false,
      error: null,

      fetchSinglePrediction: async (category, teamA, teamB, date) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;
          
          if (category === 'vip') {
            if (!accessToken) {
              throw new Error('Authentication required for VIP predictions');
            }
          }
      
          const requestOptions = {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
              ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
            }
          };
      
          const response = await fetch(
            `${SERVER_API}/predictions/${category}/${teamA}/${teamB}/${date}`,
            requestOptions
          );
      
          if (response.status === 401) {
            throw new Error('Authentication required. Please log in again.');
          }
          
          if (response.status === 403) {
            throw new Error('VIP subscription required or has expired');
          }

          if (response.status === 404) {
            set({ singlePrediction: null });
            throw new Error('Prediction not found');
          }
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
      
          if (data.status === "success" && data.data) {
            set({ singlePrediction: data.data });
            return { success: true, data: data.data };
          } else {
            set({ singlePrediction: null });
            throw new Error(data.message || 'Invalid data format received from server');
          }
        } catch (error) {
          set({ error: error.message, singlePrediction: null });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      fetchPredictions: async (date, category = 'football') => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;
          
          if (category === 'vip') {
            if (!accessToken) {
              throw new Error('Authentication required for VIP predictions');
            }
          }
      
          const requestOptions = {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
              ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
            }
          };
      
          const response = await fetch(
            `${SERVER_API}/predictions/${category}/${date}`,
            requestOptions
          );
      
          if (response.status === 401) {
            throw new Error('Authentication required. Please log in again.');
          }
          
          if (response.status === 403) {
            throw new Error('VIP subscription required or has expired');
          }
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
      
          if (data.status === "success" && Array.isArray(data.data)) {
            const sortedPredictions = data.data.sort((a, b) => 
              new Date(a.time).getTime() - new Date(b.time).getTime()
            );
            
            set({ predictions: sortedPredictions });
            return { success: true, data: sortedPredictions };
          } else {
            set({ predictions: [] });
            throw new Error(data.message || 'Invalid data format received from server');
          }
        } catch (error) {
          set({ error: error.message, predictions: [] });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      createPrediction: async (formData) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;

          if (!accessToken) {
            throw new Error('Authentication required');
          }

          const response = await fetch(`${SERVER_API}/predictions`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`
            },
            body: formData
          });

          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to create prediction');
          }

          if (data.status === "success") {
            set(state => ({
              predictions: [...state.predictions, data.data]
            }));
            return { success: true, data: data.data };
          }
          
          throw new Error(data.message || 'Failed to create prediction');
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      updatePrediction: async (id, formData) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;

          if (!accessToken) {
            throw new Error('Authentication required');
          }

          const response = await fetch(`${SERVER_API}/predictions/${id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${accessToken}`
            },
            body: formData 
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Failed to update prediction');
          }

          if (data.status === "success") {
            set(state => ({
              predictions: state.predictions.map(pred => 
                pred._id === id ? data.data : pred
              )
            }));
            return { success: true, data: data.data };
          }
          
          throw new Error(data.message || 'Failed to update prediction');
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      deletePrediction: async (id) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;
          
          if (!accessToken) {
            throw new Error('Authentication required');
          }

          const response = await fetch(`${SERVER_API}/predictions/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Failed to delete prediction');
          }

          if (data.status === "success") {
            set(state => ({
              predictions: state.predictions.filter(pred => pred._id !== id)
            }));
            return { success: true };
          }
          
          throw new Error(data.message || 'Failed to delete prediction');
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "prediction-store",
      getStorage: () => localStorage,
    }
  )
);