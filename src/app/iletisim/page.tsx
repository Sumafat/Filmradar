import React from 'react';

export const metadata = {
  title: 'İletişim | FilmRadar',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl min-h-[60vh]">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-8">İletişim</h1>
      <div className="prose prose-slate lg:prose-lg text-slate-600 leading-relaxed space-y-6">
        <p>
          Görüş, öneri veya şikayetleriniz için bizimle iletişime geçebilirsiniz. FilmRadar'ı daha iyi bir yer haline getirmemize yardımcı olacak geri dönüşlerinizi büyük bir heyecanla bekliyoruz.
        </p>
        
        <div className="bg-slate-100 p-8 rounded-2xl mt-8">
          <p className="font-semibold text-slate-900 mb-2">E-posta Adresimiz:</p>
          <a href="mailto:mustafakilicerr@gmail.com" className="text-blue-600 hover:underline text-lg">mustafakilicerr@gmail.com</a>
        </div>
        
        <p className="text-sm text-slate-500 mt-8">
          Not: Film önergeleri veya teknik sorun bildirimleri için lütfen mail başlığına [Destek] ibaresini ekleyin.
        </p>
      </div>
    </div>
  );
}
