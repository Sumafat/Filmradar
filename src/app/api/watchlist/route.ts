import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

// Get watchlist state for a movie
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ inWatchlist: false }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const tmdbId = searchParams.get('tmdbId');

    if (!tmdbId) {
      return NextResponse.json({ message: 'tmdbId missing' }, { status: 400 });
    }

    const entry = await db.watchlist.findUnique({
      where: {
        userId_tmdbId: {
          userId: session.user.id,
          tmdbId: parseInt(tmdbId),
        },
      },
    });

    return NextResponse.json({ inWatchlist: !!entry });
  } catch (error) {
    return NextResponse.json({ inWatchlist: false }, { status: 500 });
  }
}

// Toggle watchlist state
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { tmdbId, title, poster } = body;

    if (!tmdbId || !title) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    const userId = session.user.id;
    const movieTmdbId = parseInt(tmdbId);

    // Check if exists
    const existing = await db.watchlist.findUnique({
      where: {
        userId_tmdbId: {
          userId,
          tmdbId: movieTmdbId,
        },
      },
    });

    if (existing) {
      // Remove
      await db.watchlist.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ inWatchlist: false, message: 'Removed from watchlist' });
    } else {
      // Add
      await db.watchlist.create({
        data: {
          userId,
          tmdbId: movieTmdbId,
          title,
          poster,
        },
      });
      return NextResponse.json({ inWatchlist: true, message: 'Added to watchlist' });
    }
  } catch (error) {
    console.error('Watchlist Error:', error);
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}
