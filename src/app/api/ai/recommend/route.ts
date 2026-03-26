import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getMovies, searchMovies } from '@/lib/tmdb';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'AI is currently unavailable' }, { status: 503 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    
    const aiPrompt = `
      You are a movie recommendation expert for "FilmRadar".
      A user describes their mood or what they want to watch: "${prompt}"
      
      Based on this, suggest 3-5 specific movie titles released between 2020 and 2025 that fit this mood perfectly.
      CRITICAL: Only suggest movies released in 2020 or later.
      Respond ONLY with a JSON array of strings containing the movie titles.
      Example: ["Oppenheimer", "Dune: Part Two", "Spider-Man: Across the Spider-Verse"]
    `;

    console.log("AI_ROUTE_LOG: Using Native Fetch (v4)");
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: aiPrompt }] }]
      })
    });

    const resultData = await response.json();
    
    if (!response.ok) {
      console.error("Native Fetch Error:", resultData);
      throw new Error(resultData.error?.message || 'AI API call failed');
    }

    const text = resultData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No suggestions returned from AI');
    
    // Clean JSON from AI response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response');
    }
    
    const movieTitles = JSON.parse(jsonMatch[0]);

    // Fetch details for each movie from TMDB
    const movieResults = await Promise.all(
      movieTitles.map(async (title: string) => {
        const searchData = await searchMovies(title);
        return searchData.results?.[0] || null;
      })
    );

    const filteredResults = movieResults.filter(Boolean);

    return NextResponse.json({ movies: filteredResults });
  } catch (error) {
    console.error('AI Recommend Error:', error);
    return NextResponse.json({ error: 'Failed to get recommendations' }, { status: 500 });
  }
}
