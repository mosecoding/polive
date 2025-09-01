import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function nextWeek() {
  const currentDate = new Date();
  const nextWeekDate = new Date();
  nextWeekDate.setDate(currentDate.getDate() + 7);
  return nextWeekDate;
}

export function normalizeSpaces(text: string) {
  return text.replace(/\s+/g, " ");
}

export function formatTimeLeft(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days}D: ${hours}H: ${minutes}M: ${seconds}S`;
}
