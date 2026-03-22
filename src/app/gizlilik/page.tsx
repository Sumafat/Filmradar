import React from 'react';

export const metadata = {
  title: 'Gizlilik Politikası | FilmRadar',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl min-h-[60vh]">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Gizlilik Politikası</h1>
      <div className="prose prose-slate lg:prose-lg text-slate-600 leading-relaxed space-y-6">
        <p>
          FilmRadar olarak kullanıcılarımızın gizliliğine ve kişisel verilerinin korunmasına büyük önem veriyoruz. Bu gizlilik politikası, sitemizi kullanırken topladığımız bilgileri ve bu bilgileri nasıl kullandığımızı açıklamaktadır.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Veri Toplama ve Kullanımı</h2>
        <p>
          Sitemize üye olurken sağladığınız e-posta adresi ve isim gibi temel bilgiler, yalnızca hesap doğrulama, izleme listesi (Watchlist) ve favoriler gibi kişiselleştirilmiş özelliklerin çalışması için kullanılmaktadır. Üçüncü şahıslarla reklam veya pazarlama amacıyla paylaşılmaz.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Çerezler (Cookies)</h2>
        <p>
          Sitemiz, kullanıcı deneyimini iyileştirmek ve oturum bilgilerini güvenli bir şekilde saklamak amacıyla standart analiz ve oturum çerezleri kullanır.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">İletişim</h2>
        <p>
          Gizlilik iddiaları ve kişisel veri silme talepleriniz için iletişim sayfamızdan bizimle bağlantıya geçebilirsiniz.
        </p>
      </div>
    </div>
  );
}
