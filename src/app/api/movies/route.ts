import { NextRequest, NextResponse } from 'next/server';
import { getMovies } from '@/lib/tmdb';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || '1');
  const sort_by = searchParams.get('sort_by') || 'vote_average.desc';
  const with_genres = searchParams.get('with_genres') || undefined;
  const with_watch_providers = searchParams.get('with_watch_providers') || undefined;
  const primary_release_year = searchParams.get('primary_release_year') || undefined;

  try {
    const data = await getMovies({
      page,
      sort_by,
      ...(with_genres && { with_genres }),
      ...(with_watch_providers && { with_watch_providers }),
      ...(primary_release_year && { primary_release_year })
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Film verisi alınamadı' }, { status: 500 });
  }
}
