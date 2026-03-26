"use client";

import React, { useState } from 'react';
import { MovieCard } from './movie-card';
import { MovieCardSkeleton } from './movie-card-skeleton';

export function MoodFilter() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setMovies([]);

    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setMovies(data.movies || []);
      if (data.movies?.length === 0) {
        setError('Maalesef tam aradığın gibi bir şey bulamadım, başka bir mod dener misin?');
      }
    } catch (err: any) {
      setError(err.message === 'AI is currently unavailable' 
        ? '🤖 AI şu an dinleniyor (API Key eksik). Lütfen sonra tekrar dene!' 
        : 'Öneriler getirilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6 bg-slate-900 text-white p-6 md:p-10 rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden relative group">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full group-hover:bg-blue-600/30 transition-all duration-700" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-amber-600/10 blur-[100px] rounded-full group-hover:bg-amber-600/20 transition-all duration-700" />

      <div className="relative space-y-3 max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Yapay Zeka Destekli
        </div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight">
          Şu an tam olarak <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400 font-extrabold italic">nasıl hissediyorsun?</span>
        </h2>
        <p className="text-slate-400 font-medium">
          Dilediğin gibi yaz, AI asistanın senin için en uygun filmleri saniyeler içinde bulsun.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative max-w-2xl flex flex-col md:flex-row gap-3">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Örn: "Biraz hüzünlüyüm ama umut verici, sürükleyici bir macera olsun..." '
          className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner"
        />
        <button
          disabled={loading}
          type="submit"
          className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-900/40 disabled:opacity-50 flex items-center justify-center gap-2 min-w-[160px]"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              Filmleri Bul
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      {movies.length > 0 && (
        <div className="pt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            Senin İçin Seçtiklerim
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div key={movie.id} className="min-w-0">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
