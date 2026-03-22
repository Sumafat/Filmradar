"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface RandomMovieButtonProps {
  movieIds: number[];
}

export function RandomMovieButton({ movieIds }: RandomMovieButtonProps) {
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);

  const handleClick = () => {
    if (!movieIds.length || spinning) return;
    setSpinning(true);
    const randomId = movieIds[Math.floor(Math.random() * movieIds.length)];
    setTimeout(() => {
      router.push(`/movie/${randomId}`);
    }, 600);
  };

  return (
    <button
      onClick={handleClick}
      disabled={spinning || movieIds.length === 0}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-violet-600 hover:bg-violet-700 active:scale-95 text-white shadow-lg shadow-violet-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      title="Rastgele Film Öner"
    >
      <span
        className={`text-lg leading-none transition-transform duration-500 ${
          spinning ? "animate-spin" : ""
        }`}
        aria-hidden="true"
      >
        🎲
      </span>
      {spinning ? "Seçiliyor..." : "Şansıma Bırak"}
    </button>
  );
}
