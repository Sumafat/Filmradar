"use client";

import React, { useEffect } from "react";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";

interface TrackRecentMovieProps {
  movie: {
    id: number;
    title: string;
    poster_path: string | null;
    vote_average: number;
    release_date?: string;
  };
}

/**
 * Bu bileşen yalnızca yan etki (side effect) yaratır:
 * Film detay sayfası açıldığında localStorage'a kayıt yapar.
 * Hiç UI render etmez.
 */
export function TrackRecentMovie({ movie }: TrackRecentMovieProps) {
  const { addMovie } = useRecentlyViewed();

  useEffect(() => {
    addMovie({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
    });
  }, [movie, addMovie]);

  return null;
}
