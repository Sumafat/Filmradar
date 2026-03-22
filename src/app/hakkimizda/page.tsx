import React from 'react';

export const metadata = {
  title: 'Hakkımızda | FilmRadar',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl min-h-[60vh]">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Hakkımızda</h1>
      <div className="prose prose-slate lg:prose-lg text-slate-600 leading-relaxed space-y-6">
        <p>
          FilmRadar, sinemaseverlerin ne izleyeceklerine karar verirken vakit kaybetmelerini önlemek amacıyla doğmuş bağımsız bir platformdur. Amacımız, devasa içerik yığınları arasından en kaliteli ve özenle seçilmiş filmleri sizinle buluşturmaktır.
        </p>
        <p>
          Yalnızca belirli bir kalite standardının (IMDb skoru 7 ve üzeri) üzerindeki güncel yapımlara odaklanarak, her akşam yaşanan "Ne izlesek?" sorununu ortadan kaldırmayı hedefliyoruz. Geliştirdiğimiz algoritma sayesinde, her zaman izlemeye değer, yüksek puanlı yapımlar keşfedebilirsiniz.
        </p>
        <p>
          Sitemizdeki tüm veriler The Movie Database (TMDB) API'si tarafından sağlanmaktadır.
        </p>
      </div>
    </div>
  );
}
