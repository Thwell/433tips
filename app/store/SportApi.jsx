import { create } from "zustand";
import { persist } from "zustand/middleware";

const SPORTS_API = process.env.NEXT_PUBLIC_SPORTS_API;
const FOOTBALL_API = process.env.NEXT_PUBLIC_FOOTBALL_API;


export const useSportStore = create(
  persist(
    (set, get) => ({
      sports: [],
      footballPredictions: [],
      loading: false,
      error: null,

      fetchSports: async () => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(SPORTS_API);
          const data = await response.json();

          if (data.success) {
            set({ sports: data.data });
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

      fetchFootballPredictions: async () => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(FOOTBALL_API);
          const data = await response.json();

          if (data.success) {
            set({ footballPredictions: data.data });
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

      fetchAllData: async () => {
        const [sportsResult, footballResult] = await Promise.all([
          get().fetchSports(),
          get().fetchFootballPredictions(),
        ]);

        return {
          sports: sportsResult,
          football: footballResult,
        };
      },

      getSportsCategories: () => {
        const sports = get().sports;
        return [...new Set(sports.map(sport => sport.sport))];
      },

      getSportsByCategory: (category) => {
        const sports = get().sports;
        return sports.filter(sport => sport.sport === category);
      },

      clearData: () => {
        set({ sports: [], footballPredictions: [], error: null });
      },
    }),
    {
      name: "sports-store",
      getStorage: () => localStorage,
    }
  )
);