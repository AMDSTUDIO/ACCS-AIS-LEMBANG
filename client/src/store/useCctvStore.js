import { create } from 'zustand';

export const useCctvStore = create((set) => ({
  cameras: [],
  setCameras: (cameras) => set({ cameras }),
  settings: { map_config: { lat: -6.808722, lng: 107.649002, zoom: 19 } },
  setSettings: (settings) => set({ settings }),
  activeMultiViews: [],
  addToMultiView: (cam) => set((state) => {
    if (!state.activeMultiViews.find(c => c.id === cam.id)) {
      return { activeMultiViews: [...state.activeMultiViews, cam] };
    }
    return state;
  }),
  removeFromMultiView: (id) => set((state) => ({
    activeMultiViews: state.activeMultiViews.filter(c => c.id !== id)
  })),
}));
