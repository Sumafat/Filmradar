import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind class birleştirici */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Dakikayı "X sa Y dk" formatına çevirir */
export function formatRuntime(minutes: number): string {
  if (!minutes) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} dk`;
  if (m === 0) return `${h} sa`;
  return `${h} sa ${m} dk`;
}

/** TMDB puanını 1 ondalık hane ile gösterir */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/** ISO tarihini "Oca 2025" formatına çevirir */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    month: "short",
    year: "numeric",
  });
}

/** Son N ay öncesinin tarihini döndürür (YYYY-MM-DD) */
export function monthsAgo(n: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toISOString().split("T")[0];
}

/** Debounce yardımcısı */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
