"use client";

import React, { useEffect, useCallback } from "react";

interface TrailerModalProps {
  videos?: { key: string; type: string; site: string; name: string }[];
  isOpen: boolean;
  onClose: () => void;
}

export function TrailerModal({ videos, isOpen, onClose }: TrailerModalProps) {
  const trailer = videos?.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  ) || videos?.find((v) => v.site === "YouTube");

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleClose]);

  if (!isOpen || !trailer) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      aria-modal="true"
      role="dialog"
      aria-label="Fragman"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-black">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Kapat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* YouTube Embed */}
        <div className="relative w-full aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1`}
            title={trailer.name || "Film Fragmanı"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-neutral-900 flex items-center justify-between">
          <p className="text-white/80 text-sm font-medium truncate">
            {trailer.name || "Resmi Fragman"}
          </p>
          <a
            href={`https://www.youtube.com/watch?v=${trailer.key}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors shrink-0 ml-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.8 5 12 5 12 5s-4.8 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.2.9C6.6 19 12 19 12 19s4.8 0 7-.1c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM10 14.5v-5l5.5 2.5-5.5 2.5z" />
            </svg>
            YouTube'da İzle
          </a>
        </div>
      </div>
    </div>
  );
}
