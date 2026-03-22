import React from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { MovieCard } from '@/components/movie-card';
import Link from 'next/link';

export default async function WatchlistPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/giris?callbackUrl=/watchlist');
  }

  const watchlistItems = await db.watchlist.findMany({
    where: { userId: session.user.id },
    orderBy: { addedAt: 'desc' },
  });

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-serif">
            İzleme Listem
          </h1>
          <p className="text-slate-500 mt-1">
            Daha sonra izlemek için kaydettiğin tüm filmler.
          </p>
        </div>
        <div className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 italic">
          Toplam {watchlistItems.length} Film
        </div>
      </div>

      <hr className="border-slate-200" />

      {watchlistItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {watchlistItems.map((item) => (
            <MovieCard 
              key={item.id} 
              movie={{
                id: item.tmdbId,
                title: item.title,
                poster_path: item.poster,
                vote_average: 0, // Not stored in watchlist currently
                overview: '',    // Not stored
                release_date: '', // Not stored
              }} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-6 bg-white rounded-3xl border border-dashed border-slate-300 shadow-inner">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800">Listen Henüz Boş</h3>
            <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
              Keşfet sayfasından beğendiğin filmleri listene ekleyerek burada görebilirsin.
            </p>
          </div>
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-200"
          >
            Filmleri Keşfet
          </Link>
        </div>
      )}
    </div>
  );
}
