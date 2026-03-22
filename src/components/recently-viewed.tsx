"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getPosterUrl } from "@/lib/tmdb";
import { useRecentlyViewed, type RecentMovie } from "@/hooks/use-recently-viewed";

export function RecentlyViewed() {
  const { getAll, clearAll } = useRecentlyViewed();
  const [movies, setMovies] = useState<RecentMovie[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMovies(getAll());
  }, [getAll]);

  if (!mounted || movies.length === 0) return null;

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </span>
          Son Baktıklarım
        </h2>
        <button
          onClick={() => {
            clearAll();
            setMovies([]);
          }}
          className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
        >
          Temizle
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar snap-x">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movie/${movie.id}`}
            className="min-w-[110px] snap-start group flex-shrink-0"
          >
            <div className="relative w-[110px] aspect-[2/3] rounded-xl overflow-hidden bg-slate-200 shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
              <Image
                src={getPosterUrl(movie.poster_path, "w185")}
                alt={movie.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="110px"
              />
              {movie.vote_average > 0 && (
                <div className="absolute top-1.5 right-1.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                  {movie.vote_average.toFixed(1)}
                </div>
              )}
            </div>
            <p className="mt-1.5 text-xs font-medium text-slate-700 line-clamp-1 group-hover:text-blue-700 transition-colors">
              {movie.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
