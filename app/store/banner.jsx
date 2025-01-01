import { create } from "zustand";
import { persist } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useBannerStore = create(
    persist(
      (set, get) => ({
        banners: [],
        loading: false,
        error: null,
  
        fetchBanners: async () => {
          try {
            set({ loading: true, error: null });
            const response = await fetch(`${SERVER_API}/banners`);
            
            const data = await response.json();
            if (data.status === "success") {
              set({ banners: data.data });
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
  
        createBanner: async (bannerImages) => {
          try {
            set({ loading: true, error: null });
            const { accessToken } = get();
            
            const formData = new FormData();
            bannerImages.forEach(image => {
              formData.append('bannerImage', image);
            });
  
            const response = await fetch(`${SERVER_API}/banners`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`
              },
              body: formData
            });
  
            const data = await response.json();
            if (data.status === "success") {
              set(state => ({
                banners: [...state.banners, data.data]
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
  
        updateBanner: async (id, bannerImages, isActive) => {
          try {
            set({ loading: true, error: null });
            const { accessToken } = get();
            
            const formData = new FormData();
            if (bannerImages?.length) {
              bannerImages.forEach(image => {
                formData.append('bannerImage', image);
              });
            }
            if (isActive !== undefined) {
              formData.append('isActive', isActive);
            }
  
            const response = await fetch(`${SERVER_API}/banners/${id}`, {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${accessToken}`
              },
              body: formData
            });
  
            const data = await response.json();
            if (data.status === "success") {
              set(state => ({
                banners: state.banners.map(banner => 
                  banner._id === id ? data.data : banner
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
  
        deleteBanner: async (id) => {
          try {
            set({ loading: true, error: null });
            const { accessToken } = get();
            
            const response = await fetch(`${SERVER_API}/banners/${id}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            });
  
            const data = await response.json();
            if (data.status === "success") {
              set(state => ({
                banners: state.banners.filter(banner => banner._id !== id)
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
        name: "banner-store",
        getStorage: () => localStorage,
      }
    )
  );