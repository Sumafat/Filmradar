"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function MobileMenu() {
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
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="lg:hidden flex items-center">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 -ml-2 mr-2 text-slate-600 hover:text-slate-900 focus:outline-none"
        aria-label="Menüyü Aç/Kapat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {isOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-xl z-50 animate-in slide-in-from-top-2 p-4 flex flex-col space-y-6">
          <nav className="flex flex-col space-y-2 font-medium text-slate-700 text-lg sm:text-base">
            <Link href="/" onClick={() => setIsOpen(false)} className="px-4 py-3 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors">Ana Sayfa</Link>
            <Link href="/#discover" onClick={() => setIsOpen(false)} className="px-4 py-3 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors">Keşfet</Link>
            <Link href="/watchlist" onClick={() => setIsOpen(false)} className="px-4 py-3 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors">Watchlist</Link>
            <Link href="/favoriler" onClick={() => setIsOpen(false)} className="px-4 py-3 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors">Favoriler</Link>
          </nav>
        </div>
      )}
    </div>
  );
}
