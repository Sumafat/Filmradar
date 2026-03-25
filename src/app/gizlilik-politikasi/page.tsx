import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası',
  description: 'FilmRadar gizlilik politikası ve veri kullanımı hakkında bilgiler.',
};

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Gizlilik Politikası</h1>
      
      <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">1. Veri Toplama</h2>
          <p>
            FilmRadar olarak, kullanıcı deneyiminizi iyileştirmek için Google OAuth aracılığıyla temel profil bilgilerinizi (ad, soyad, e-posta) topluyoruz. Bu bilgiler sadece favori listelerinizi ve watchlist'inizi senkronize etmek için kullanılır.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">2. Çerezler (Cookies)</h2>
          <p>
            Sitemiz, oturum yönetimi ve kullanıcı tercihlerini hatırlamak için çerezler kullanır. Ayrıca Google Analytics ve Google AdSense gibi üçüncü taraf servisler, trafik analizi ve reklam kişiselleştirme amacıyla çerez kullanabilir.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">3. Veri Güvenliği</h2>
          <p>
            Verileriniz güvenli sunucularda saklanır ve asla üçüncü taraflarla paylaşılmaz veya satılmaz. Şifreleriniz modern şifreleme yöntemleri ile korunmaktadır.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">4. İletişim</h2>
          <p>
            Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz.
          </p>
        </section>

        <p className="text-sm text-slate-500 mt-8">
          Son güncelleme: 25 Mart 2026
        </p>
      </div>
    </div>
  );
}
