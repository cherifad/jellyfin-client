import { create } from "zustand";
import { isUrl } from "@/lib/utils";

interface BgState {
  bgImageUrl: string | null;
  bgImageAlt: string | null;
  setBgImageUrl: (alt: string, url: string) => void;
}

export const useBgStore = create<BgState>()((set) => ({
  bgImageAlt: "Background image",
  bgImageUrl: "/test-bg2.png",
  setBgImageUrl: (alt: string, url: string) => {
    if (!isUrl(url)) {
      console.error("Invalid URL:", url);
      return;
    }
    set({ bgImageAlt: alt, bgImageUrl: url });
  },
}));
