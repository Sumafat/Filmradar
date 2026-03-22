"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMsg('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
    }
    if (searchParams.get('error') === 'CredentialsSignin') {
      setError('E-posta veya şifre hatalı.');
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        setError('E-posta veya şifre hatalı.');
      } else {
        // Full page reload for absolute session sync
        window.location.href = '/';
      }
    } catch (err) {
      setError('Bir hata oluştu, lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
            Tekrar Hoş Geldin!
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Kaldığın yerden filmleri keşfetmeye devam et.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 text-center">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm font-medium border border-green-200 text-center">
              {successMsg}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">E-posta adresi</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-slate-50"
                placeholder="E-posta adresi"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Şifre</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-slate-50"
                placeholder="Şifre"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70"
            >
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">
                veya şununla devam et
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex justify-center items-center py-3 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M12.0003 4.75017C13.5684 4.75231 15.034 5.37894 16.1264 6.495L19.155 3.4664C17.2346 1.63665 14.6548 0.589886 12.0003 0.600007C8.44141 0.600007 5.25056 2.5029 3.32483 5.38546L6.87971 8.1404C7.72895 5.58983 10.1551 3.82422 12.9806 3.82422V4.75017Z" fill="#EA4335" />
                <path d="M23.4025 12.2855C23.4025 11.4587 23.332 10.6548 23.199 9.875H12V14.4326H18.4069C18.1424 15.9082 17.2917 17.1856 16.0592 18.0093L19.5855 20.7381C21.6444 18.8354 22.8465 16.03 23.003 13.0456C23.0116 12.8718 23.0116 12.6976 23.003 12.5238H23.4025V12.2855Z" fill="#4285F4" />
                <path d="M12.0004 23.4C15.2079 23.4 17.8924 22.3396 19.8973 20.55L16.371 17.8211C15.2913 18.5446 13.7847 18.9754 12.0004 18.9754C9.17482 18.9754 6.74868 17.2098 5.89944 14.6592L2.34456 17.4141C4.27029 20.2967 7.46114 22.1996 11.0201 22.1996H12.0004V23.4Z" fill="#34A853" />
                <path d="M5.56846 13.7847C5.32145 13.0441 5.18835 12.2721 5.17646 11.4938C5.17646 10.725 5.31345 9.975 5.56846 9.25922L2.01358 6.50427C1.04758 8.42857 0.49072 10.5735 0.49072 12.8344C0.49072 15.0953 1.04758 17.2403 2.01358 19.1646L5.56846 16.4096V13.7847Z" fill="#FBBC05" />
              </svg>
              Google
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <Link href="/kayit" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Hesabın yok mu? Kayıt Ol
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
