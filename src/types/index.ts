// ─── TMDB Tipleri ────────────────────────────────────────────────────────────

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number | null;
  genres: Genre[];
  origin_country: string[];
  original_language: string;
  popularity: number;
  adult: boolean;
}

export interface MovieSummary {
  id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
  popularity: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  movie_credits: {
    cast: MovieSummary[];
    crew: (MovieSummary & { job: string })[];
  };
}

export interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface WatchProviders {
  results: {
    TR?: {
      link: string;
      flatrate?: WatchProvider[];
      rent?: WatchProvider[];
      buy?: WatchProvider[];
    };
  };
}

export interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// ─── Uygulama Tipleri ────────────────────────────────────────────────────────

export interface FilterState {
  search: string;
  genres: number[];
  countries: string[];
  languages: string[];
  ratingRange: [number, number];
  runtimeCategory: "short" | "medium" | "long" | null;
  period: 1 | 3 | 5;
  sortBy: string;
}

export interface Country {
  iso_3166_1: string;
  english_name: string;
  native_name: string;
}

// localStorage kaydı için
export interface RecentlyViewedMovie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  viewedAt: number; // timestamp
}
