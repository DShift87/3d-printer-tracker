import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Drop shadow for icon: X=0, Y=6, Blur=30, Spread=12, Color at 16%. Spread approximated with second layer (drop-shadow has no spread). */
export function getIconDropShadow(hexColor: string): string {
  const hex = hexColor.replace("#", "");
  if (hex.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(hex)) {
    return "drop-shadow(0 6px 30px rgba(156, 163, 175, 0.16)) drop-shadow(0 6px 42px rgba(156, 163, 175, 0.16))";
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `drop-shadow(0 6px 30px rgba(${r}, ${g}, ${b}, 0.16)) drop-shadow(0 6px 42px rgba(${r}, ${g}, ${b}, 0.16))`;
}

/** Figma drop shadow: 0 6px 30px 12px with color at 16% opacity */
export function getIconShadow(hexColor: string): string {
  const hex = hexColor.replace("#", "");
  if (hex.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(hex)) {
    // Fallback for invalid colors (e.g. "gray")
    return "0 6px 30px 12px rgba(156, 163, 175, 0.16)";
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `0 6px 30px 12px rgba(${r}, ${g}, ${b}, 0.16)`;
}

/** Returns true if the color is light (high luminance). Use to pick icon color for contrast. */
export function isLightColor(hexColor: string): boolean {
  const hex = hexColor.replace("#", "");
  if (hex.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(hex)) return false;
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 0.65;
}
