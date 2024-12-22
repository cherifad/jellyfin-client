import { create } from "zustand";

interface BgState {
  bgImageUrl: string | null;
  bgImageAlt: string | null;
  setBgImageUrl: (alt: string, url: string) => void;
}

export const useBgStore = create<BgState>()((set) => ({
  bgImageAlt: "Background image",
  bgImageUrl: "/test-bg2.png",
  setBgImageUrl: (alt: string, url: string) =>
    set({ bgImageAlt: alt, bgImageUrl: url }),
}));
