const TMDB_BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY!;
export const TMDB_IMAGE_BASE_URL =
  process.env.TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";

// ─── Görsel URL yardımcıları ─────────────────────────────

export function getPosterUrl(path: string | null, size = "w500") {
  if (!path) return "/images/no-poster.png";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function getBackdropUrl(path: string | null, size = "original") {
  if (!path) return "/images/no-backdrop.png";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function getProfileUrl(path: string | null, size = "w185") {
  if (!path) return "/images/no-profile.png";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

// ─── Watch Providers Helper ─────────────────────────────
export async function getWatchProviders(id: number) {
  try {
    const data = await tmdbFetch<any>(`/movie/${id}/watch/providers`, {}, 86400);
    return data.results?.TR || null;
  } catch (error) {
    return null;
  }
}

async function enrichWithProviders(movies: any[]) {
  return Promise.all(
    movies.map(async (movie) => {
      const providers = await getWatchProviders(movie.id);
      return { ...movie, watch_providers: providers };
    })
  );
}

// ─── Temel fetch helper ──────────────────────────────────

async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string | number | boolean> = {},
  revalidate = 3600
): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  url.searchParams.set("language", "tr-TR");

  Object.entries(params).forEach(([k, v]) =>
    url.searchParams.set(k, String(v))
  );

  const res = await fetch(url.toString(), { next: { revalidate } });
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${endpoint}`);
  return res.json();
}

// ─── API fonksiyonları ───────────────────────────────────

/** Son 5 ay, 7+ puanlı filmler (veyahut gelen filtreli) */
export async function getMovies(params: Record<string, string | number | boolean> = {}) {
  const defaultParams: any = {
    page: 1,
    sort_by: "vote_average.desc",
    "vote_average.gte": 7.0,
    "vote_count.gte": 100,
  };

  // Eğer belirli bir çıkış yılı (primary_release_year) aranmıyorsa son 5 ay kuralını zorla
  if (!params.primary_release_year) {
    const fiveMonthsAgo = new Date();
    fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);
    defaultParams["primary_release_date.gte"] = fiveMonthsAgo.toISOString().split("T")[0];
  }

  // Eğer platform filtresi (with_watch_providers) varsa bölge TR zorunludur
  if (params.with_watch_providers) {
    defaultParams.watch_region = "TR";
  }

  const data = await tmdbFetch<any>("/discover/movie", {
    ...defaultParams,
    ...params,
  });

  if (data.results) {
    data.results = await enrichWithProviders(data.results);
  }

  return data;
}

/** Bu haftanın trendleri (Site kurallarına göre süzülmüş) */
export async function getTrendingMovies() {
  const data = await tmdbFetch<any>("/trending/movie/week", {}, 3600);
  
  const fiveMonthsAgo = new Date();
  fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);

  if (data.results) {
    data.results = data.results.filter((m: any) => {
      const releaseDate = m.release_date ? new Date(m.release_date) : null;
      return (
        m.vote_average >= 7.0 && 
        releaseDate && releaseDate >= fiveMonthsAgo &&
        m.vote_count >= 50 // Trending için biraz daha esnek tutalım ama puan kalsın
      );
    });
    data.results = await enrichWithProviders(data.results);
  }
  
  return data;
}

/** Film detayı (credits + videos + images + similar + watch/providers) */
export async function getMovieDetails(id: number) {
  return tmdbFetch(
    `/movie/${id}`,
    { append_to_response: "credits,videos,images,similar,recommendations,watch/providers" },
    21600 // ISR: 6 saat
  );
}

/** Kişi profili + filmografisi */
export async function getPersonDetails(id: number) {
  return tmdbFetch(`/person/${id}`, { append_to_response: "movie_credits" }, 86400);
}

/** Film türleri */
export async function getGenres() {
  return tmdbFetch<{ genres: { id: number; name: string }[] }>(
    "/genre/movie/list",
    {},
    86400
  );
}

/** Ülkeler */
export async function getCountries() {
  return tmdbFetch("/configuration/countries", {}, 86400);
}

/** Türkiye İzleme Platformları (Providers) */
export async function getProviders() {
  const data = await tmdbFetch<any>("/watch/providers/movie", { watch_region: "TR" }, 86400);
  return data.results || [];
}

/** Film Arama */
export async function searchMovies(query: string, page: number = 1) {
  const data = await tmdbFetch<any>("/search/movie", {
    query,
    page,
    include_adult: false,
  });

  if (data.results) {
    // Sadece afişi olan ve puanı olan filmleri filtreleyelim
    data.results = data.results.filter((m: any) => m.poster_path != null && m.vote_count > 0);
  }

  return data;
}
