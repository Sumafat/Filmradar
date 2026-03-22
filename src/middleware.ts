import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

// Korunan rotalar – giriş yapılmadan erişilemez
const protectedRoutes = ["/watchlist", "/favoriler", "/profil"];

// Sadece misafirlere açık rotalar – giriş yapmışlar yönlendirilir
const authRoutes = ["/giris", "/kayit", "/sifre-sifirla"];

export default NextAuth(authConfig).auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Korunan rotaya girişsiz erişim → giriş sayfasına yönlendir
  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !isLoggedIn) {
    const loginUrl = new URL("/giris", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Giriş yapmışken auth sayfalarına erişim → ana sayfaya yönlendir
  if (authRoutes.includes(pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)",
  ],
};
