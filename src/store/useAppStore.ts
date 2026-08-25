import { create } from 'zustand';
import type {
  ExportSettings,
  ImageItem,
  ProcessProgress,
  WatermarkSettings,
} from '../types';
import { defaultExport, defaultWatermark } from '../types';

const MAX_IMAGES = 200;
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);

interface AppState {
  images: ImageItem[];
  selectedId: string | null;
  watermark: WatermarkSettings;
  exportSettings: ExportSettings;
  presetKey: string;
  processing: boolean;
  progress: ProcessProgress | null;
  // 图片
  addFiles: (files: FileList | File[]) => void;
  removeImage: (id: string) => void;
  clearAll: () => void;
  selectImage: (id: string) => void;
  // 水印
  updateWatermark: (patch: Partial<WatermarkSettings>) => void;
  setLogo: (dataUrl: string | null) => void;
  resetWatermark: () => void;
  // 导出
  updateExport: (patch: Partial<ExportSettings>) => void;
  setPreset: (key: string) => void;
  setProcessing: (p: boolean) => void;
  setProgress: (p: ProcessProgress | null) => void;
}

function loadImageMeta(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth || img.width, height: img.naturalHeight || img.height });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = url;
  });
}

let idCounter = 0;
const nextId = () => `img_${++idCounter}_${Date.now()}`;

export const useAppStore = create<AppState>((set, get) => ({
  images: [],
  selectedId: null,
  watermark: defaultWatermark(),
  exportSettings: defaultExport(),
  presetKey: 'none',
  processing: false,
  progress: null,

  addFiles: async (files) => {
    const list = Array.from(files).filter((f) => ALLOWED.has(f.type));
    const current = get().images;
    const room = MAX_IMAGES - current.length;
    const toAdd = list.slice(0, Math.max(room, 0));

    const items: ImageItem[] = [];
    for (const file of toAdd) {
      const url = URL.createObjectURL(file);
      const { width, height } = await loadImageMeta(url);
      items.push({
        id: nextId(),
        name: file.name,
        file,
        url,
        width,
        height,
        size: file.size,
        status: 'idle',
      });
    }

    let selectedId = get().selectedId;
    if (items.length > 0 && !selectedId) {
      selectedId = items[0].id;
    }
    set((s) => ({
      images: [...s.images, ...items],
      selectedId,
    }));
  },

  removeImage: (id) =>
    set((s) => {
      const idx = s.images.findIndex((i) => i.id === id);
      const img = s.images[idx];
      if (img) URL.revokeObjectURL(img.url);
      const images = s.images.filter((i) => i.id !== id);
      let selectedId = s.selectedId;
      if (selectedId === id) {
        selectedId = images[idx]?.id ?? images[idx - 1]?.id ?? null;
      }
      return { images, selectedId };
    }),

  clearAll: () => {
    get().images.forEach((i) => URL.revokeObjectURL(i.url));
    set({ images: [], selectedId: null });
  },

  selectImage: (id) => set({ selectedId: id }),

  updateWatermark: (patch) => {
    const current = get().watermark;
    const next = { ...current, ...patch };
    // 切换类型时若切到 image 但无 Logo，自动切换保持类型
    set({ watermark: next });
  },

  setLogo: (dataUrl) =>
    set((s) => ({ watermark: { ...s.watermark, logoDataUrl: dataUrl } })),

  resetWatermark: () => set({ watermark: defaultWatermark() }),

  updateExport: (patch) =>
    set((s) => ({ exportSettings: { ...s.exportSettings, ...patch } })),

  setPreset: (key) => set({ presetKey: key }),
  setProcessing: (p) => set({ processing: p }),
  setProgress: (p) => set({ progress: p }),
}));
