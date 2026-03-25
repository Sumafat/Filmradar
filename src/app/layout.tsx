import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "FilmRadar – Kaliteli Filmleri Keşfet",
    template: "%s | FilmRadar",
  },
  description:
    "Son 5 ayda yayınlanan, 7+ puanlı filmleri keşfet. Watchlist oluştur, favorilerini yönet.",
  keywords: ["film", "sinema", "filmler", "TMDB", "watchlist", "favoriler", "film keşfet", "popüler filmler"],
  authors: [{ name: "FilmRadar Team" }],
  creator: "FilmRadar",
  publisher: "FilmRadar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://filmradar.com.tr"
  ),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://filmradar.com.tr",
    siteName: "FilmRadar",
    title: "FilmRadar – Kaliteli Filmleri Keşfet",
    description: "Son 5 ayda yayınlanan, 7+ puanlı filmleri keşfet. Watchlist oluştur, favorilerini yönet.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FilmRadar – Kaliteli Filmleri Keşfet",
    description: "Son 5 ayda yayınlanan, 7+ puanlı filmleri keşfet. Watchlist oluştur, favorilerini yönet.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster position="bottom-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
