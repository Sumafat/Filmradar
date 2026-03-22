"use client";

import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface MovieFiltersProps {
  genres: { id: number; name: string }[];
  providers: { provider_id: number; provider_name: string }[];
}

export function MovieFilters({ genres, providers }: MovieFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const currentSort = searchParams.get("sort_by") || "vote_average.desc";
  const currentGenre = searchParams.get("with_genres") || "";
  const currentProvider = searchParams.get("with_watch_providers") || "";
  const currentYear = searchParams.get("primary_release_year") || "";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(pathname + "?" + params.toString(), { scroll: false });
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex flex-wrap items-center gap-2">
        {/* Toggle Filters Button */}
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            isFilterOpen || currentGenre 
              ? 'bg-blue-50 border-blue-200 text-blue-800' 
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          Türler: {currentGenre ? genres.find(g => g.id.toString() === currentGenre)?.name : 'Tümü'}
        </button>

        {/* Sort Select */}
        <div className="relative inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 h-4 w-4 text-slate-500 pointer-events-none"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
          <select
            value={currentSort}
            onChange={(e) => updateParam("sort_by", e.target.value)}
            className="appearance-none inline-flex items-center justify-center rounded-full border border-slate-200 bg-white pl-9 pr-10 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="vote_average.desc">En Yüksek Puanlılar</option>
            <option value="popularity.desc">En Popüler Olanlar</option>
            <option value="primary_release_date.desc">En Yeniler</option>
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3 h-4 w-4 text-slate-500 pointer-events-none"><path d="m6 9 6 6 6-6"/></svg>
        </div>
        
        {/* Platform Select */}
        <div className="relative inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 h-4 w-4 text-slate-500 pointer-events-none"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          <select
            value={currentProvider}
            onChange={(e) => updateParam("with_watch_providers", e.target.value)}
            className="appearance-none inline-flex items-center justify-center rounded-full border border-slate-200 bg-white pl-9 pr-10 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tüm Platformlar</option>
            {providers.map(p => (
              <option key={p.provider_id} value={p.provider_id.toString()}>
                {p.provider_name}
              </option>
            ))}
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3 h-4 w-4 text-slate-500 pointer-events-none"><path d="m6 9 6 6 6-6"/></svg>
        </div>

        {/* Year Select */}
        <div className="relative inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 h-4 w-4 text-slate-500 pointer-events-none"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
          <select
            value={currentYear}
            onChange={(e) => updateParam("primary_release_year", e.target.value)}
            className="appearance-none inline-flex items-center justify-center rounded-full border border-slate-200 bg-white pl-9 pr-10 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Son 5 Ay</option>
            {[2025, 2024, 2023, 2022, 2021, 2020].map(y => (
              <option key={y} value={y.toString()}>{y}</option>
            ))}
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3 h-4 w-4 text-slate-500 pointer-events-none"><path d="m6 9 6 6 6-6"/></svg>
        </div>
        
        {/* Clear Filters */}
        {(currentGenre || currentProvider || currentYear) && (
          <button 
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete("with_genres");
              params.delete("with_watch_providers");
              params.delete("primary_release_year");
              router.push(pathname + "?" + params.toString(), { scroll: false });
            }}
            className="text-xs text-slate-500 hover:text-slate-800 underline ml-2"
          >
            Tümünü Temizle
          </button>
        )}
      </div>

      {/* Expanded Filters Area */}
      {isFilterOpen && (
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => updateParam("with_genres", "")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !currentGenre ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tümü
          </button>
          {genres.map(genre => (
            <button
              key={genre.id}
              onClick={() => updateParam("with_genres", genre.id.toString())}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                currentGenre === genre.id.toString() 
                  ? 'bg-blue-800 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
