"use client";

import React, { useState, useEffect } from 'react';

interface MovieActionsProps {
  movieId: number;
  title: string;
  posterPath?: string;
  runtime?: number;
  videos?: any[];
}

export function MovieActions({ movieId, title, posterPath, runtime, videos }: MovieActionsProps) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Find official YouTube trailer
  const trailers = videos?.filter((v) => v.site === 'YouTube' && v.type === 'Trailer') || [];
  const mainTrailer = trailers.find(v => v.official) || trailers[0];

  // Fetch initial status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const [wlRes, favRes] = await Promise.all([
          fetch(`/api/watchlist?tmdbId=${movieId}`),
          fetch(`/api/favorites?tmdbId=${movieId}`)
        ]);
        
        if (wlRes.ok) {
          const data = await wlRes.json();
          setInWatchlist(data.inWatchlist);
        }
        
        if (favRes.ok) {
          const data = await favRes.json();
          setIsFavorite(data.isFavorite);
        }
      } catch (error) {
        console.error('Status fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, [movieId]);

  // Toggle handlers
  const toggleWatchlist = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tmdbId: movieId,
          title,
          poster: posterPath,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setInWatchlist(data.inWatchlist);
      }
    } catch (error) {
      console.error('Watchlist toggle error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleFavorite = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tmdbId: movieId,
          title,
          poster: posterPath,
          runtime,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsFavorite(data.isFavorite);
      }
    } catch (error) {
      console.error('Favorites toggle error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsTrailerOpen(false);
    };
    if (isTrailerOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isTrailerOpen]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isTrailerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isTrailerOpen]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 pt-4">
        <button 
          onClick={toggleWatchlist}
          disabled={isLoading || isProcessing}
          className={`flex items-center justify-center font-medium py-2.5 px-6 rounded-lg transition shadow-lg ${
            inWatchlist 
              ? 'bg-amber-500 hover:bg-amber-600 text-slate-900 shadow-amber-900/20' 
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/20'
          } disabled:opacity-50`}
        >
          {inWatchlist ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          )}
          {inWatchlist ? 'Listemden Çıkar' : 'Watchlist'}
        </button>
        
        <button 
          onClick={toggleFavorite}
          disabled={isLoading || isProcessing}
          className={`flex items-center justify-center font-medium py-2.5 px-6 rounded-lg transition shadow-lg backdrop-blur-md border ${
            isFavorite 
              ? 'bg-rose-600/90 hover:bg-rose-700 text-white border-rose-500/50 shadow-rose-900/20' 
              : 'bg-white/10 hover:bg-white/20 border-white/20 text-white shadow-black/20'
          } disabled:opacity-50`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill={isFavorite ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-2"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
          {isFavorite ? 'Favorilerimde' : 'Favorilere Ekle'}
        </button>
        
        {mainTrailer && (
          <button 
            onClick={() => setIsTrailerOpen(true)}
            className="flex items-center justify-center bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium py-2.5 px-6 rounded-lg transition shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="mr-2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Fragman
          </button>
        )}
      </div>

      {/* Trailer Modal */}
      {isTrailerOpen && mainTrailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="absolute inset-0" 
            onClick={() => setIsTrailerOpen(false)} 
          />
          
          <div className="relative w-full max-w-4xl bg-black rounded-xl shadow-2xl overflow-hidden aspect-video border border-slate-800 scale-in duration-200">
            {/* Close button */}
            <button 
              onClick={() => setIsTrailerOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black text-white rounded-full transition-colors backdrop-blur-md"
              title="Kapat (ESC)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            
            {/* YouTube Embed */}
            <iframe
              src={`https://www.youtube.com/embed/${mainTrailer.key}?autoplay=1&rel=0&modestbranding=1`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Film Fragmanı"
            />
          </div>
        </div>
      )}
    </>
  );
}
