import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/giris",
    error: "/giris",
  },
  trustHost: true,
  providers: [], // Edge-compatible providers could go here, but empty is fine for middleware JWT checking
} satisfies NextAuthConfig;
