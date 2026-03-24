"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface MobileMenuProps {
  session: any;
}

export function MobileMenu({ session }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      // Disable scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className="md:hidden flex items-center">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 -ml-3 mr-2 text-slate-700 hover:text-blue-600 focus:outline-none transition-colors"
        aria-label="Menüyü Aç/Kapat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {isOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <div className="fixed inset-0 top-16 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity" />
          
          <div className="absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-2xl z-50 animate-in slide-in-from-top-4 duration-300 p-4 flex flex-col space-y-4">
            <nav className="flex flex-col space-y-1 font-medium text-slate-700 text-lg">
              <Link href="/" onClick={() => setIsOpen(false)} className="px-4 py-3 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all">Ana Sayfa</Link>
              <Link href="/#discover" onClick={() => setIsOpen(false)} className="px-4 py-3 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all">Keşfet</Link>
              <Link href="/watchlist" onClick={() => setIsOpen(false)} className="px-4 py-3 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all">Watchlist</Link>
              <Link href="/favoriler" onClick={() => setIsOpen(false)} className="px-4 py-3 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all">Favoriler</Link>
            </nav>

            <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col space-y-3">
              {session ? (
                <>
                  <Link 
                    href="/profil" 
                    onClick={() => setIsOpen(false)} 
                    className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-800 rounded-xl font-bold transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-sm font-bold">
                      {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    Profilim
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-3 text-left font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 p-1">
                  <Link 
                    href="/giris" 
                    onClick={() => setIsOpen(false)} 
                    className="flex items-center justify-center py-3 bg-slate-100 text-slate-900 rounded-xl font-bold transition-all"
                  >
                    Giriş Yap
                  </Link>
                  <Link 
                    href="/kayit" 
                    onClick={() => setIsOpen(false)} 
                    className="flex items-center justify-center py-3 bg-blue-800 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all"
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
