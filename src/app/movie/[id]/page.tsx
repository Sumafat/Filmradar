import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMovieDetails, getBackdropUrl, getPosterUrl, getProfileUrl } from '@/lib/tmdb';
import { MovieActions } from '@/components/movie-actions';
import { WatchProviders } from '@/components/watch-providers';
import { TrackRecentMovie } from '@/components/track-recent-movie';
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const movieId = parseInt(resolvedParams.id, 10);
  
  if (!movieId || isNaN(movieId)) {
    return { title: 'Dizi / Film Bulunamadı' };
  }

  try {
    const movie = await getMovieDetails(movieId) as any;
    
    // We optionally fetch the next metadata block from parent if we want to inherit
    // const previousImages = (await parent).openGraph?.images || []
    
    if (!movie || !movie.title) return { title: 'Bulunamadı | FilmRadar' };
    
    const posterUrl = getPosterUrl(movie.poster_path, 'w500');
    const description = movie.overview ? (movie.overview.length > 150 ? movie.overview.substring(0, 147) + '...' : movie.overview) : 'Bu film için detaylı bilgi FilmRadar\'da.';
    
    return {
      title: movie.title,
      description: description,
      openGraph: {
        title: `${movie.title} | FilmRadar`,
        description: description,
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/movie/${movie.id}`,
        siteName: 'FilmRadar',
        images: posterUrl ? [
          {
            url: posterUrl,
            width: 500,
            height: 750,
            alt: `${movie.title} Afişi`,
          }
        ] : [],
        type: 'video.movie',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${movie.title} | FilmRadar`,
        description: description,
        images: posterUrl ? [posterUrl] : [],
      },
    };
  } catch (error) {
    return { title: 'FilmRadar' };
  }
}

export default async function MovieDetailPage({ params }: { params: { id: string } }) {
  // `params` is a Promise in Next.js 15+ but Next 14 handles it directly. For future-proofing we might await it, but let's stick to standard synchronous usage for now. If it's a promise, we await it.
  const resolvedParams = await Promise.resolve(params); // Safe for both versions.
  
  try {
    const movie = await getMovieDetails(parseInt(resolvedParams.id, 10)) as any;

    if (!movie || !movie.id) {
      return notFound();
    }

    const backdropUrl = getBackdropUrl(movie.backdrop_path);
    const posterUrl = getPosterUrl(movie.poster_path);
    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';
    
    // Find directors
    const directors = movie.credits?.crew?.filter((c: any) => c.job === 'Director') || [];
    const cast = movie.credits?.cast?.slice(0, 10) || [];
    
    // Format duration
    const hours = Math.floor((movie.runtime || 0) / 60);
    const minutes = (movie.runtime || 0) % 60;
    const runtimeStr = hours > 0 ? `${hours}s ${minutes}dk` : `${minutes}dk`;

    // Similar / recommended movies filtered to 7+ rating and 2020+ year
    const similarMovies = [
      ...(movie.recommendations?.results || []),
      ...(movie.similar?.results || []),
    ]
      .filter(
        (m: any, index: number, self: any[]) => {
          const releaseYear = m.release_date ? new Date(m.release_date).getFullYear() : 0;
          return (
            m.vote_average >= 7.0 &&
            m.poster_path &&
            releaseYear >= 2020 &&
            self.findIndex((x: any) => x.id === m.id) === index &&
            m.id !== movie.id
          );
        }
      )
      .slice(0, 8);

    return (
      <div className="min-h-screen bg-slate-50 pb-20">
        {/* Track this visit in localStorage */}
        <TrackRecentMovie movie={{ id: movie.id, title: movie.title, poster_path: movie.poster_path, vote_average: movie.vote_average, release_date: movie.release_date }} />
        
        {/* HERO SECTION */}
        <div className="relative w-full h-[50vh] md:h-[70vh] min-h-[400px] max-h-[700px] overflow-hidden bg-slate-900 border-b border-slate-200 shadow-sm">
          {/* Backdrop Image */}
          <div className="absolute inset-0 opacity-40">
             <Image
              src={backdropUrl}
              alt={movie.title || 'Arka plan'}
              fill
              className="object-cover"
              priority
             />
          </div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          
          <div className="container mx-auto px-4 h-full relative flex items-end pb-8 md:pb-16 pt-24">
            <div className="flex flex-col md:flex-row items-end md:items-start gap-6 w-full">
              
              {/* Poster */}
              <div className="w-32 h-48 md:w-56 md:h-80 shrink-0 rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 hidden sm:block relative">
                 <Image
                  src={posterUrl}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Info */}
              <div className="flex-1 text-white space-y-4">
                <div className="space-y-1">
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-md">
                    {movie.title}
                  </h1>
                  {movie.original_title && movie.original_title !== movie.title && (
                    <p className="text-slate-300 text-sm md:text-base font-medium">Orijinal: {movie.original_title}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-200">
                  <span className="flex items-center bg-amber-500 text-slate-900 px-2 py-1 rounded-md font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="mr-1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    {rating} <span className="text-slate-800 ml-1 font-normal">({movie.vote_count})</span>
                  </span>
                  <span>{releaseYear}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  <span>{runtimeStr}</span>
                  {movie.production_countries?.[0] && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                      <span>{movie.production_countries[0].iso_3166_1}</span>
                    </>
                  )}
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {movie.genres?.map((g: any) => (
                    <span key={g.id} className="px-3 py-1 bg-white/10 hover:bg-white/20 transition backdrop-blur-sm rounded-full text-xs font-semibold text-white border border-white/20">
                      {g.name}
                    </span>
                  ))}
                </div>

                <div className="pt-2 text-slate-300">
                  <span className="font-semibold text-white">Yönetmen: </span> 
                  {directors.map((d: any) => d.name).join(', ') || 'Bilinmiyor'}
                </div>

                {/* Action Buttons */}
                <MovieActions 
                  movieId={movie.id} 
                  title={movie.title}
                  posterPath={movie.poster_path}
                  runtime={movie.runtime}
                  videos={movie.videos?.results} 
                />
              </div>

            </div>
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-12">
          
          {/* Main Info */}
          <div className="flex-1 space-y-10">
            {/* Overview */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Özet</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {movie.overview || 'Bu film için henüz Türkçe bir özet eklenmemiş.'}
              </p>
            </section>

            {/* Cast Carousel */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Oyuncular</h2>
              
              <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x">
                {cast.length > 0 ? cast.map((actor: any) => (
                  <div key={actor.id} className="min-w-[120px] md:min-w-[140px] snap-start flex flex-col space-y-2 group">
                    <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-slate-200 border border-slate-200 shadow-sm">
                       <Image
                        src={getProfileUrl(actor.profile_path)}
                        alt={actor.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="140px"
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold text-sm text-slate-900 line-clamp-1" title={actor.name}>{actor.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1" title={actor.character}>{actor.character}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-slate-500">Oyuncu bilgisi bulunmuyor.</p>
                )}
              </div>
            </section>

            {/* Similar Movies */}
            {similarMovies.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Bunları da Sevebilirsin</h2>
                <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x">
                  {similarMovies.map((sim: any) => {
                    const simYear = sim.release_date ? new Date(sim.release_date).getFullYear() : '';
                    return (
                      <Link
                        key={sim.id}
                        href={`/movie/${sim.id}`}
                        className="min-w-[130px] md:min-w-[150px] snap-start flex-shrink-0 group"
                      >
                        <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-slate-200 shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                          <Image
                            src={getPosterUrl(sim.poster_path, 'w185')}
                            alt={sim.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="150px"
                          />
                          <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                            {sim.vote_average.toFixed(1)}
                          </div>
                        </div>
                        <div className="mt-2 space-y-0.5">
                          <h4 className="text-xs font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-700 transition-colors leading-tight">{sim.title}</h4>
                          {simYear && <p className="text-[10px] text-slate-400 font-medium">{simYear}</p>}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="w-full lg:w-80 space-y-8 h-fit">
            <WatchProviders providers={movie['watch/providers']} />

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-8">
              <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">Hızlı Bilgiler</h3>
            
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-slate-500 font-medium">Orijinal Dil</dt>
                <dd className="text-slate-900 font-semibold uppercase">{movie.original_language}</dd>
              </div>
              
              <div>
                <dt className="text-slate-500 font-medium">Durum</dt>
                <dd className="text-slate-900 font-semibold">{movie.status}</dd>
              </div>

              {movie.budget > 0 && (
                <div>
                  <dt className="text-slate-500 font-medium">Bütçe</dt>
                  <dd className="text-slate-900 font-semibold">${movie.budget.toLocaleString()}</dd>
                </div>
              )}

              {movie.revenue > 0 && (
                <div>
                  <dt className="text-slate-500 font-medium">Hasılat</dt>
                  <dd className="text-slate-900 font-semibold">${movie.revenue.toLocaleString()}</dd>
                </div>
              )}
            </dl>
            </div>
          </div>

        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    return notFound();
  }
}
