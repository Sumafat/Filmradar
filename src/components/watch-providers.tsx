import React from 'react';
import Image from 'next/image';
import { getPosterUrl } from '@/lib/tmdb';

interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

interface WatchProvidersProps {
  providers?: {
    results?: {
      TR?: {
        flatrate?: Provider[];
        rent?: Provider[];
        buy?: Provider[];
        link?: string;
      };
    };
  };
}

export function WatchProviders({ providers }: WatchProvidersProps) {
  const trProviders = providers?.results?.TR;
  
  if (!trProviders || (!trProviders.flatrate && !trProviders.rent && !trProviders.buy)) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <p className="text-sm text-slate-500 italic">Bu film için Türkiye yayın bilgisi bulunamadı.</p>
      </div>
    );
  }

  const renderSection = (title: string, items: Provider[] | undefined) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</h4>
        <div className="flex flex-wrap gap-3">
          {items.map((provider) => (
            <div key={provider.provider_id} className="group relative" title={provider.provider_name}>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border border-slate-200 shadow-sm transition-transform group-hover:scale-110">
                <Image
                  src={getPosterUrl(provider.logo_path, 'w92')}
                  alt={provider.provider_name}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              {/* Tooltip on hover */}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {provider.provider_name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="bg-blue-100 p-1.5 rounded-lg text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        </div>
        <h3 className="font-bold text-slate-900">Nerede İzlenir?</h3>
      </div>

      <div className="space-y-6">
        {renderSection("Dijital Platformlar", trProviders.flatrate)}
        {renderSection("Kiralama", trProviders.rent)}
        {renderSection("Satın Alma", trProviders.buy)}
      </div>

      {trProviders.link && (
        <a 
          href={trProviders.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block text-[10px] text-center text-slate-400 hover:text-blue-600 transition-colors"
        >
          JustWatch tarafından sağlanmıştır
        </a>
      )}
    </div>
  );
}
