import React, { Suspense } from 'react';
import { MovieCardSkeleton } from '@/components/movie-card-skeleton';
import { MovieCard } from '@/components/movie-card';
import { InfiniteMovieGrid } from '@/components/infinite-movie-grid';
import { getMovies, getTrendingMovies, getGenres, getProviders } from '@/lib/tmdb';
import { MovieFilters } from '@/components/movie-filters';
import { HomeHero } from '@/components/home-hero';
import { RandomMovieButton } from '@/components/random-movie-button';
import { RecentlyViewed } from '@/components/recently-viewed';
import { MoodFilter } from '@/components/mood-filter';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = (await searchParams) || {};
  const sort_by = typeof sp.sort_by === 'string' ? sp.sort_by : 'vote_average.desc';
  const with_genres = typeof sp.with_genres === 'string' ? sp.with_genres : undefined;
  const with_watch_providers = typeof sp.with_watch_providers === 'string' ? sp.with_watch_providers : undefined;
  const primary_release_year = typeof sp.primary_release_year === 'string' ? sp.primary_release_year : undefined;

  // Parallel data fetching for performance
  const [discoverData, trendingData, genresData, providersData] = await Promise.all([
    getMovies({ 
      sort_by, 
      ...(with_genres && { with_genres }),
      ...(with_watch_providers && { with_watch_providers }),
      ...(primary_release_year && { primary_release_year })
    }),
    getTrendingMovies(),
    getGenres(),
    getProviders()
  ]);

  const movies = (discoverData as any).results || [];
  const movieIds: number[] = movies.map((m: any) => m.id);
  const trendingMovies = (trendingData as any).results || [];
  const genres = genresData.genres || [];
  const providers = providersData || [];

  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      
      {/* Global Quality Rule Note */}
      <div className="flex flex-col items-center justify-center animate-in fade-in slide-in-from-top duration-1000 mb-8">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="inline-flex items-center space-x-3 bg-white/50 border border-slate-200/50 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-sm font-medium text-slate-600 tracking-tight italic">
              Sadece son 5 ayda yayınlanan <span className="text-slate-900 font-bold">IMDb skoru 7 ve üzeri</span> filmler
            </span>
          </div>
          {movieIds.length > 0 && <RandomMovieButton movieIds={movieIds} />}
        </div>
      </div>

      {/* Premium Hero Section */}
      <HomeHero movie={trendingMovies[0]} />

      {/* AI Mood Filter Section */}
      <MoodFilter />

      {/* Trending Carousel Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center">
            <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            </span>
            Bu Hafta <span className="text-amber-600 ml-1.5 font-extrabold italic uppercase tracking-tighter">Popüler</span>
          </h2>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto pb-6 hide-scrollbar snap-x">
          {trendingMovies.length > 0 ? (
            trendingMovies.slice(0, 10).map((movie: any) => (
              <div key={movie.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                <MovieCard movie={movie} />
              </div>
            ))
          ) : (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="min-w-[280px] md:min-w-[320px] snap-start">
                <MovieCardSkeleton />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Son Baktıklarım */}
      <RecentlyViewed />

      {/* Main Discover Section */}
      <section id="discover" className="space-y-8 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Keşfet
            </h2>
            <p className="text-slate-500 font-medium">
              Tam kriterlerine göre filtrelenmiş seçki.
            </p>
          </div>

          {/* Filters Area */}
          <MovieFilters genres={genres} providers={providers} />
        </div>

        {/* Movie Grid — Infinite Scroll */}
        {movies.length > 0 ? (
          <InfiniteMovieGrid
            initialMovies={movies}
            initialTotalPages={(discoverData as any).total_pages || 1}
            sort_by={sort_by}
            with_genres={with_genres}
            with_watch_providers={with_watch_providers}
            primary_release_year={primary_release_year}
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
            {Array.from({ length: 15 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
