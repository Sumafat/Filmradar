import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="bg-blue-600 text-white rounded-lg p-1.5 shadow-sm group-hover:bg-blue-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Film<span className="text-blue-600">Radar</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Vaktinizi sadece kaliteli yapımlara ayırın. FilmRadar ile internetin sonsuzluğunda kaybolmadan, izlemeye değer en iyi filmleri anında bulun.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Hızlı Linkler</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/" className="hover:text-blue-600 transition">Ana Sayfa</Link></li>
              <li><Link href="/watchlist" className="hover:text-blue-600 transition">Watchlist</Link></li>
              <li><Link href="/favoriler" className="hover:text-blue-600 transition">Favoriler</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Kurumsal</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/gizlilik-politikasi" className="hover:text-blue-600 transition">Gizlilik Politikası</Link></li>
              <li><Link href="/kullanim-kosullari" className="hover:text-blue-600 transition">Kullanım Koşulları</Link></li>
              <li><Link href="/iletisim" className="hover:text-blue-600 transition">İletişim</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Hesap</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/profil" className="hover:text-blue-600 transition">Profilim</Link></li>
              <li><Link href="/giris" className="hover:text-blue-600 transition">Giriş Yap</Link></li>
              <li><Link href="/kayit" className="hover:text-blue-600 transition">Kayıt Ol</Link></li>
            </ul>
          </div>
          
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} FilmRadar. Tüm hakları saklıdır.
          </p>
          
          {/* TMDB Attribution (Required by TMDB API terms) */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="max-w-[180px] text-right">
              Bu uygulama TMDB API'sini kullanmaktadır ancak TMDB tarafından onaylanmamış veya sertifikalandırılmamıştır.
            </span>
            {/* The official TMDB abbreviated logo (primary long) */}
            <img 
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" 
              alt="TMDB Logo" 
              className="h-4"
            />
          </div>
        </div>
        
      </div>
    </footer>
  );
}
