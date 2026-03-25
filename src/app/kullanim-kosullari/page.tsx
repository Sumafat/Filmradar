import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kullanım Koşulları',
  description: 'FilmRadar kullanım şartları ve yasal uyarılar.',
};

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Kullanım Koşulları</h1>
      
      <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">1. Hizmet Tanımı</h2>
          <p>
            FilmRadar, kullanıcılara yeni ve popüler filmleri keşfetme, kendi listelerini oluşturma ve film bilgilerine erişme imkanı sunan bir platformdur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">2. Kullanıcı Sorumlulukları</h2>
          <p>
            Kullanıcılar, siteyi yasalara uygun bir şekilde kullanmakla yükümlüdür. Hesap güvenliğinden kullanıcı bizzat sorumludur. Google Auth aracılığıyla yapılan işlemler kullanıcıya aittir.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">3. Fikri Mülkiyet</h2>
          <p>
            Sitedeki film verileri ve görseller TMDB API kullanılarak sağlanmaktadır. Site tasarımı ve kodları FilmRadar'a aittir.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">4. Feragatname</h2>
          <p>
            FilmRadar, sağlanan içeriklerin doğruluğu konusunda garanti vermez. Servis "olduğu gibi" sunulur ve teknik aksaklıklardan doğabilecek veri kayıplarından platform sorumlu tutulamaz.
          </p>
        </section>

        <p className="text-sm text-slate-500 mt-8">
          Son güncelleme: 25 Mart 2026
        </p>
      </div>
    </div>
  );
}
