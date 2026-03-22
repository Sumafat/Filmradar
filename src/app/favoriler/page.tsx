import React from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { MovieCard } from '@/components/movie-card';
import Link from 'next/link';

export default async function FavoritesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/giris?callbackUrl=/favoriler');
  }

  const favoriteItems = await db.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { addedAt: 'desc' },
  });

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-serif">
            Favorilerim
          </h1>
          <p className="text-slate-500 mt-1">
            En sevdiğin ve kalbinde yer eden tüm filmler.
          </p>
        </div>
        <div className="text-sm font-medium text-rose-600 bg-rose-50 px-4 py-2 rounded-full border border-rose-100 italic">
          Toplam {favoriteItems.length} Favori
        </div>
      </div>

      <hr className="border-slate-200" />

      {favoriteItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {favoriteItems.map((item) => (
            <MovieCard 
              key={item.id} 
              movie={{
                id: item.tmdbId,
                title: item.title,
                poster_path: item.poster,
                vote_average: 0, 
                overview: '',    
                release_date: '', 
              }} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-6 bg-white rounded-3xl border border-dashed border-slate-300 shadow-inner">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800">Favori Listen Boş</h3>
            <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
              Kalp ikonuna tıklayarak sevdiğin filmleri buraya ekleyebilirsin.
            </p>
          </div>
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition shadow-lg shadow-rose-200"
          >
            Filmleri Keşfet
          </Link>
        </div>
      )}
    </div>
  );
}
