import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPosterUrl } from '@/lib/tmdb';
import { MovieCardActionsOverlay } from './movie-card-overlay';

// ── Türkçe Genre Map (TMDB ID → Türkçe ad) ────────────────────────
const GENRE_MAP: Record<number, string> = {
  28: 'Aksiyon',
  12: 'Macera',
  16: 'Animasyon',
  35: 'Komedi',
  80: 'Suç',
  99: 'Belgesel',
  18: 'Dram',
  10751: 'Aile',
  14: 'Fantastik',
  36: 'Tarih',
  27: 'Korku',
  10402: 'Müzik',
  9648: 'Gizem',
  10749: 'Romantik',
  878: 'Bilim Kurgu',
  10770: 'TV Film',
  53: 'Gerilim',
  10752: 'Savaş',
  37: 'Western',
};

// ── ISO 3166-1 alpha-2 → Bayrak Emoji ─────────────────────────────
function countryToFlag(code: string): string {
  if (!code || code.length !== 2) return '🌍';
  const codePoints = [...code.toUpperCase()].map(
    (c) => 0x1F1E6 - 65 + c.charCodeAt(0)
  );
  return String.fromCodePoint(...codePoints);
}

interface MovieCardProps {
  movie: {
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
  };
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getPosterUrl(movie.poster_path);
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '---';
  const rating = (movie.vote_average && movie.vote_average > 0) ? movie.vote_average.toFixed(1) : 'NR';

  const streamingProviders = (movie.watch_providers?.flatrate || []).slice(0, 3);
  const genres = (movie.genre_ids || []).map(id => GENRE_MAP[id]).filter(Boolean).slice(0, 2);
  const flagEmoji = movie.origin_country?.[0] ? countryToFlag(movie.origin_country[0]) : null;

  return (
    <Link href={`/movie/${movie.id}`} className="group flex flex-col rounded-xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative">
      
      {/* Poster */}
      <div className="relative w-full aspect-[2/3] bg-slate-100 overflow-hidden">
        <Image
          src={posterUrl}
          alt={movie.title || "Film Afişi"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
        />
        {/* Rating Badge */}
        <div className="absolute top-2 right-2 z-20 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          {rating}
        </div>
        
        {/* Hover Action Overlay */}
        <MovieCardActionsOverlay movie={movie} />
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-grow gap-1.5">
        <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-800 transition-colors text-sm" title={movie.title}>
          {movie.title}
        </h3>
        
        {/* Year + Country + Streaming logos */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            {flagEmoji && (
              <span className="text-base leading-none" title={movie.origin_country?.[0]}>
                {flagEmoji}
              </span>
            )}
            <span>{year}</span>
          </div>
          
          {streamingProviders.length > 0 && (
            <div className="flex -space-x-1.5">
              {streamingProviders.map((provider, i) => (
                <div
                  key={i}
                  className="w-5 h-5 md:w-6 md:h-6 rounded-sm overflow-hidden border border-slate-100 shadow-sm"
                  title={provider.provider_name}
                >
                  <Image
                    src={getPosterUrl(provider.logo_path, 'w92')}
                    alt={provider.provider_name}
                    width={24}
                    height={24}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Genre tags */}
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {genres.map((genre) => (
              <span
                key={genre}
                className="text-[10px] font-medium bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full border border-blue-100 leading-tight"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
