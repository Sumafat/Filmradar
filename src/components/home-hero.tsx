"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getBackdropUrl } from '@/lib/tmdb';

interface HomeHeroProps {
  movie?: any;
}

export function HomeHero({ movie }: HomeHeroProps) {
  const backdropUrl = movie ? getBackdropUrl(movie.backdrop_path) : '';
  
  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-3xl bg-slate-900 shadow-2xl border border-white/5 mx-auto mb-12 group">
      {/* Background Image with Parallax-like effect */}
      {movie && (
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
          <Image
            src={backdropUrl}
            alt={movie.title || 'Öne Çıkan Film'}
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>
      )}
      
      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/40 to-transparent hidden md:block" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 space-y-6">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center space-x-2 bg-amber-500 text-slate-950 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase animate-in fade-in slide-in-from-left duration-700 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="mr-1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Haftanın Öne Çıkanı
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white leading-tight drop-shadow-2xl animate-in fade-in slide-in-from-bottom duration-700 delay-100 line-clamp-2">
            {movie?.title || 'Yükleniyor...'}
          </h1>
          
          <div className="flex items-center gap-4 text-slate-300 animate-in fade-in slide-in-from-bottom duration-700 delay-150 font-medium h-6">
            {movie && (
              <>
                <span className="flex items-center text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-md">
                  ★ {movie.vote_average?.toFixed(1)}
                </span>
                {movie.release_date && (
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                )}
                {movie.genre_ids && movie.genre_ids.length > 0 && (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    <span>{movie.genre_ids.length} Tür</span>
                  </>
                )}
              </>
            )}
          </div>

          <p className="text-base md:text-lg text-slate-200 max-w-2xl leading-relaxed drop-shadow-md animate-in fade-in slide-in-from-bottom duration-700 delay-200 line-clamp-3">
            {movie?.overview || 'Bu yapım için henüz bir özet eklenmemiş ancak izleyicilerden yüksek puan alarak haftanın en çok konuşulanları arasına girmeyi başardı.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            {movie && (
              <Link 
                href={`/movie/${movie.id}`}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition shadow-xl shadow-white/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                Filmi İncele
              </Link>
            )}
            <button 
              onClick={() => document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition"
            >
              Tüm Filmleri Keşfet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
