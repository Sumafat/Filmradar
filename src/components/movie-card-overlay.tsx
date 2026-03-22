"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface MovieCardActionsOverlayProps {
  movie: {
    id: number;
    title: string;
    poster_path: string | null;
    overview: string;
  };
}

export function MovieCardActionsOverlay({ movie }: MovieCardActionsOverlayProps) {
  const router = useRouter();
  const [isProcessingWL, setIsProcessingWL] = useState(false);
  const [isProcessingFAV, setIsProcessingFAV] = useState(false);

  // Stop propagation to prevent navigation when clicking buttons
  const handleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isProcessingWL) return;
    setIsProcessingWL(true);
    try {
      await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tmdbId: movie.id,
          title: movie.title,
          poster: movie.poster_path,
        }),
      });
      // Optionally we could show a success toast here
    } catch (error) {
    } finally {
      setIsProcessingWL(false);
    }
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isProcessingFAV) return;
    setIsProcessingFAV(true);
    try {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tmdbId: movie.id,
          title: movie.title,
          poster: movie.poster_path,
          runtime: 0 // Optional runtime
        }),
      });
    } catch (error) {
    } finally {
      setIsProcessingFAV(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-10">
      <div className="text-white space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <h4 className="font-bold text-sm leading-tight line-clamp-2">{movie.title}</h4>
        <p className="text-xs text-slate-300 line-clamp-4 leading-relaxed">
          {movie.overview || 'Bu film için Türkçe özet bulunmamaktadır.'}
        </p>
      </div>

      <div className="flex flex-col gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
        <button 
          onClick={handleWatchlist}
          disabled={isProcessingWL}
          className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md transition disabled:opacity-50"
        >
          {isProcessingWL ? 'Bekleyin...' : 'Watchlist\'e Ekle'}
        </button>
        <button 
          onClick={handleFavorite}
          disabled={isProcessingFAV}
          className="w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-md transition flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          Favorilere Ekle
        </button>
      </div>
    </div>
  );
}
