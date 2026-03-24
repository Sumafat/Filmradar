"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

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
  const { data: session, status } = useSession();
  
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingWL, setIsProcessingWL] = useState(false);
  const [isProcessingFAV, setIsProcessingFAV] = useState(false);

  // Fetch initial status if logged in
  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchStatus = async () => {
      setIsLoading(true);
      try {
        const [wlRes, favRes] = await Promise.all([
          fetch(`/api/watchlist?tmdbId=${movie.id}`),
          fetch(`/api/favorites?tmdbId=${movie.id}`)
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
  }, [movie.id, status]);

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (status === 'unauthenticated') {
      toast.error('Bu özelliği kullanmak için giriş yapmalısınız.');
      router.push(`/giris?callbackUrl=${window.location.pathname}`);
      return;
    }
    
    action();
  };

  const handleWatchlist = async () => {
    if (isProcessingWL) return;
    setIsProcessingWL(true);
    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tmdbId: movie.id,
          title: movie.title,
          poster: movie.poster_path,
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setInWatchlist(data.inWatchlist);
        toast.success(data.inWatchlist ? 'Watchlist\'e eklendi' : 'Watchlist\'ten çıkarıldı');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    } finally {
      setIsProcessingWL(false);
    }
  };

  const handleFavorite = async () => {
    if (isProcessingFAV) return;
    setIsProcessingFAV(true);
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tmdbId: movie.id,
          title: movie.title,
          poster: movie.poster_path,
          runtime: 0
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setIsFavorite(data.isFavorite);
        toast.success(data.isFavorite ? 'Favorilere eklendi' : 'Favorilerden çıkarıldı');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
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
          onClick={(e) => handleActionClick(e, handleWatchlist)}
          disabled={isProcessingWL || isLoading}
          className={`w-full py-1.5 text-xs font-semibold rounded-md transition disabled:opacity-50 flex items-center justify-center gap-1.5 ${
            inWatchlist 
              ? 'bg-amber-500 hover:bg-amber-600 text-slate-900' 
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          {inWatchlist ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          )}
          {isProcessingWL ? 'Bekleyin...' : inWatchlist ? 'Listemden Çıkar' : 'Watchlist\'e Ekle'}
        </button>
        <button 
          onClick={(e) => handleActionClick(e, handleFavorite)}
          disabled={isProcessingFAV || isLoading}
          className={`w-full py-1.5 text-xs font-semibold rounded-md transition flex items-center justify-center gap-1.5 disabled:opacity-50 ${
            isFavorite 
              ? 'bg-rose-600 hover:bg-rose-500 text-white' 
              : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
          }`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill={isFavorite ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
          {isProcessingFAV ? 'Bekleyin...' : isFavorite ? 'Favorilerimde' : 'Favorilere Ekle'}
        </button>
      </div>
    </div>
  );
}
