import { create } from 'zustand';
import type { PhotoItem, WatermarkSettings } from '../types';
import { defaultWatermark } from '../types';

interface AppState {
  photos: PhotoItem[];
  selectedId: string | null;
  watermark: WatermarkSettings;
  processing: boolean;
  progress: { total: number; done: number; current: string } | null;
  // actions
  setPhotos: (photos: PhotoItem[]) => void;
  addPhotos: (photos: PhotoItem[]) => void;
  removePhoto: (id: string) => void;
  clearPhotos: () => void;
  selectPhoto: (id: string) => void;
  updateWatermark: (patch: Partial<WatermarkSettings>) => void;
  setLogo: (uri: string | null) => void;
  resetWatermark: () => void;
  setProcessing: (v: boolean) => void;
  setProgress: (p: { total: number; done: number; current: string } | null) => void;
}

let counter = 0;
const nextId = () => `photo_${Date.now()}_${++counter}`;

export const useAppStore = create<AppState>((set) => ({
  photos: [],
  selectedId: null,
  watermark: defaultWatermark(),
  processing: false,
  progress: null,

  setPhotos: (photos) => set({ photos, selectedId: photos[0]?.id ?? null }),
  addPhotos: (incoming) =>
    set((s) => {
      const existing = new Set(s.photos.map((p) => p.uri));
      const toAdd = incoming.filter((p) => !existing.has(p.uri)).map((p) => ({ ...p, id: nextId() }));
      const photos = [...s.photos, ...toAdd];
      return { photos, selectedId: s.selectedId ?? photos[0]?.id ?? null };
    }),

  removePhoto: (id) =>
    set((s) => {
      const idx = s.photos.findIndex((p) => p.id === id);
      const photos = s.photos.filter((p) => p.id !== id);
      let selectedId = s.selectedId;
      if (selectedId === id) {
        selectedId = photos[idx]?.id ?? photos[idx - 1]?.id ?? null;
      }
      return { photos, selectedId };
    }),

  clearPhotos: () => set({ photos: [], selectedId: null }),
  selectPhoto: (id) => set({ selectedId: id }),
  updateWatermark: (patch) => set((s) => ({ watermark: { ...s.watermark, ...patch } })),
  setLogo: (uri) => set((s) => ({ watermark: { ...s.watermark, logoUri: uri } })),
  resetWatermark: () => set({ watermark: defaultWatermark() }),
  setProcessing: (v) => set({ processing: v }),
  setProgress: (p) => set({ progress: p }),
}));
