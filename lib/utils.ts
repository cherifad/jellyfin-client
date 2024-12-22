import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const buildBackdropUrl = (serverUrl: string, media: BaseItemDto) => {
  return `${serverUrl}/Items/${media.Id}/Images/Backdrop?tag=${media.ImageTags?.Backdrop}&maxWidth=2880&quality=80`;
};

export const buildPosterUrl = (serverUrl: string, id: string) => {
  return `${serverUrl}/Items/${id}/Images/Primary?maxWidth=400&quality=80`;
};

export const buildLogoUrl = (serverUrl: string, media: BaseItemDto) => {
  return `${serverUrl}/Items/${media.Id}/Images/Logo?tag=${media.ImageTags?.Logo}&quality=90`;
};

export const getInitals = (name: string, limit: number = 2) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, limit)
    .join("");
};

export const ticksToString = (ticks: number) => {
  const hours = Math.floor(ticks / 36000000000);
  const minutes = Math.floor((ticks % 36000000000) / 600000000);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

export const truncateNumber = (num: number, digits: number = 2) => {
  return num.toFixed(digits);
};
