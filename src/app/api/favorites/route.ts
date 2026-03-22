import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ isFavorite: false }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const tmdbId = searchParams.get('tmdbId');

    if (!tmdbId) {
      return NextResponse.json({ message: 'tmdbId missing' }, { status: 400 });
    }

    const entry = await db.favorite.findUnique({
      where: {
        userId_tmdbId: {
          userId: session.user.id,
          tmdbId: parseInt(tmdbId),
        },
      },
    });

    return NextResponse.json({ isFavorite: !!entry });
  } catch (error) {
    return NextResponse.json({ isFavorite: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { tmdbId, title, poster, runtime } = body;

    if (!tmdbId || !title) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    const userId = session.user.id;
    const movieTmdbId = parseInt(tmdbId);

    const existing = await db.favorite.findUnique({
      where: {
        userId_tmdbId: {
          userId,
          tmdbId: movieTmdbId,
        },
      },
    });

    if (existing) {
      await db.favorite.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ isFavorite: false, message: 'Removed from favorites' });
    } else {
      await db.favorite.create({
        data: {
          userId,
          tmdbId: movieTmdbId,
          title,
          poster,
          runtime,
        },
      });
      return NextResponse.json({ isFavorite: true, message: 'Added to favorites' });
    }
  } catch (error) {
    console.error('Favorites Error:', error);
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}
