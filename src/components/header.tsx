import Link from 'next/link';
import { auth, signOut } from '@/lib/auth';
import { MobileMenu } from '@/components/mobile-menu';

export async function Header() {
  const session = await auth();
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <MobileMenu session={session} />
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-blue-800 p-1.5 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M7 3v18" />
              <path d="M3 7.5h4" />
              <path d="M3 12h18" />
              <path d="M3 16.5h4" />
              <path d="M17 3v18" />
              <path d="M17 7.5h4" />
              <path d="M17 16.5h4" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Film<span className="text-blue-800">Radar</span>
          </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex-1 hidden md:flex items-center justify-center space-x-4 lg:space-x-8 text-sm font-medium">
          <Link href="/" className="text-blue-800 transition-colors">Ana Sayfa</Link>
          <Link href="/#discover" className="text-slate-600 hover:text-slate-900 transition-colors">Keşfet</Link>
          <Link href="/watchlist" className="text-slate-600 hover:text-slate-900 transition-colors">Watchlist</Link>
          <Link href="/favoriler" className="text-slate-600 hover:text-slate-900 transition-colors">Favoriler</Link>
        </nav>

        {/* User / Auth area */}
        <div className="flex items-center space-x-4">
          {session ? (
            <div className="flex items-center space-x-3">
              <Link
                href="/profil"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
                title="Profilim"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold text-sm flex items-center justify-center ring-2 ring-transparent group-hover:ring-blue-300 transition-all">
                  {session.user?.name?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline-block text-sm font-medium text-slate-700">
                  <span className="font-bold text-slate-900">{session.user?.name || session.user?.email?.split('@')[0]}</span>
                </span>
              </Link>
              <form action={async () => {
                "use server";
                await signOut({ redirectTo: '/' });
              }}>
                <button type="submit" className="text-xs font-medium text-slate-400 hover:text-red-600 transition-colors">
                  Çıkış
                </button>
              </form>
            </div>
          ) : (
            <>
              <Link 
                href="/giris"
                className="hidden md:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none hover:bg-slate-100 hover:text-slate-900 h-9 px-2 sm:px-4 py-2"
              >
                Giriş Yap
              </Link>
              <Link
                href="/kayit"
                className="hidden md:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none bg-blue-800 text-slate-50 shadow hover:bg-blue-800/90 h-9 px-3 sm:px-4 py-2"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
