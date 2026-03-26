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

    console.log("AI_ROUTE_LOG: Listing Models (v5)");
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`);
    const resultData = await response.json();
    
    console.log("Accessible Models:", JSON.stringify(resultData, null, 2));
    
    if (!response.ok) {
      throw new Error(resultData.error?.message || 'ListModels failed');
    }

    // Since we are debugging, just return the model list as an error for visibility in the UI if needed, 
    // or just throw to see in logs.
    throw new Error(`Model Check: ${resultData.models?.map((m: any) => m.name).join(', ') || 'No models found'}`);
    
    // The following code is temporarily unreachable during debugging
    /*
    const movieTitles = JSON.parse(jsonMatch[0]);
    // ...
    */
    return NextResponse.json({ models: resultData.models });
  } catch (error) {
    console.error('AI Recommend Error:', error);
    return NextResponse.json({ error: 'Failed to get recommendations' }, { status: 500 });
  }
}
