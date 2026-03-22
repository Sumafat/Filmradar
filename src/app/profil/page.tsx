import React from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Profilim – FilmRadar',
  description: 'FilmRadar kullanıcı profil sayfası',
};

function StatCard({
  label,
  value,
  icon,
  href,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group`}
    >
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-xl shrink-0 ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
          {value}
        </p>
        <p className="text-sm font-medium text-slate-500">{label}</p>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ml-auto text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </Link>
  );
}

function formatWatchTime(totalMinutes: number): string {
  if (totalMinutes === 0) return '0 dk';
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `${mins} dk`;
  if (mins === 0) return `${hours} saat`;
  return `${hours}s ${mins}dk`;
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/giris?callbackUrl=/profil');
  }

  const userId = session.user.id as string;

  // Fetch counts and total runtime in parallel
  const [watchlistCount, favorites] = await Promise.all([
    db.watchlist.count({ where: { userId } }),
    db.favorite.findMany({
      where: { userId },
      select: { runtime: true, addedAt: true },
      orderBy: { addedAt: 'desc' },
    }),
  ]);

  const favoritesCount = favorites.length;
  const totalWatchTime = favorites.reduce(
    (acc, f) => acc + (f.runtime || 0),
    0
  );

  const joinedAt = (session.user as any).createdAt
    ? new Date((session.user as any).createdAt).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const avatarLetter = (session.user.name || session.user.email || 'U')[0].toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <div className="h-40 bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 pb-16">
        {/* Avatar + Name */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 mb-10 relative z-10">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-blue-600 flex items-center justify-center shrink-0">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || 'Avatar'}
                width={112}
                height={112}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-4xl font-extrabold text-white">
                {avatarLetter}
              </span>
            )}
          </div>

          <div className="flex-1 sm:pb-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {session.user.name || 'Kullanıcı'}
            </h1>
            <p className="text-slate-500 font-medium text-sm">{session.user.email}</p>
            {joinedAt && (
              <p className="text-xs text-slate-400 mt-0.5">
                <span className="font-semibold text-slate-500">Üye oldu:</span> {joinedAt}
              </p>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          <StatCard
            label="Watchlist"
            value={watchlistCount}
            href="/watchlist"
            color="bg-blue-50 text-blue-600"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            }
          />
          <StatCard
            label="Favoriler"
            value={favoritesCount}
            href="/favoriler"
            color="bg-rose-50 text-rose-600"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            }
          />
          <StatCard
            label="Toplam İzleme Süresi"
            value={favoritesCount > 0 ? formatWatchTime(totalWatchTime) : '—'}
            href="/favoriler"
            color="bg-amber-50 text-amber-600"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            }
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Hızlı Erişim</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Film Keşfet
            </Link>
            <Link
              href="/watchlist"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              Watchlist ({watchlistCount})
            </Link>
            <Link
              href="/favoriler"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              Favoriler ({favoritesCount})
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
