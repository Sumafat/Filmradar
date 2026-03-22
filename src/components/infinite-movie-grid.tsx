"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MovieCard } from '@/components/movie-card';
import { MovieCardSkeleton } from '@/components/movie-card-skeleton';

interface Movie {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  genre_ids?: number[];
  origin_country?: string[];
  watch_providers?: {
    flatrate?: { logo_path: string; provider_name: string }[];
  };
}

interface InfiniteMovieGridProps {
  initialMovies: Movie[];
  initialTotalPages: number;
  sort_by: string;
  with_genres?: string;
  with_watch_providers?: string;
  primary_release_year?: string;
}

export function InfiniteMovieGrid({
  initialMovies,
  initialTotalPages,
  sort_by,
  with_genres,
  with_watch_providers,
  primary_release_year,
}: InfiniteMovieGridProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialTotalPages > 1);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const nextPage = page + 1;
      const params = new URLSearchParams({ page: String(nextPage), sort_by });
      if (with_genres) params.set('with_genres', with_genres);
      if (with_watch_providers) params.set('with_watch_providers', with_watch_providers);
      if (primary_release_year) params.set('primary_release_year', primary_release_year);

      const res = await fetch(`/api/movies?${params.toString()}`);
      if (!res.ok) throw new Error('API hatası');

      const data = await res.json();
      const newMovies: Movie[] = data.results || [];

      setMovies((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        return [...prev, ...newMovies.filter((m) => !existingIds.has(m.id))];
      });
      setPage(nextPage);
      setHasMore(nextPage < (data.total_pages || 1));
    } catch (err) {
      console.error('Film yükleme hatası:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, sort_by, with_genres, with_watch_providers, primary_release_year]);

  // Sync state when filters change (initialMovies prop changes)
  useEffect(() => {
    setMovies(initialMovies);
    setPage(1);
    setHasMore(initialTotalPages > 1);
  }, [initialMovies, initialTotalPages]);

  // Intersection Observer
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '300px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <MovieCardSkeleton key={`skeleton-${i}`} />
          ))}
      </div>

      {/* Intersection Observer target */}
      <div ref={loaderRef} className="h-4" />

      {!hasMore && movies.length > 0 && (
        <p className="text-center text-slate-400 text-sm py-8">
          Tüm filmler yüklendi 🎬
        </p>
      )}
    </>
  );
}
