"use client";

import { useCallback } from "react";

export interface RecentMovie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
}

const STORAGE_KEY = "filmradar_recent";
const MAX_ITEMS = 10;

export function useRecentlyViewed() {
  const getAll = useCallback((): RecentMovie[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const addMovie = useCallback((movie: RecentMovie) => {
    if (typeof window === "undefined") return;
    try {
      const existing = (() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as RecentMovie[]) : [];
      })();
      // Remove if already exists to push to front
      const filtered = existing.filter((m) => m.id !== movie.id);
      const updated = [movie, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // silent fail
    }
  }, []);

  const clearAll = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { getAll, addMovie, clearAll };
}
