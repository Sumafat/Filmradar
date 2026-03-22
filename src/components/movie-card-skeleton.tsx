import React from 'react';

export function MovieCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden bg-white border border-slate-100 shadow-sm animate-pulse">
      {/* Poster area skeleton */}
      <div className="relative w-full aspect-[2/3] bg-slate-200">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-200/50 to-transparent" />
      </div>

      {/* Content area skeleton */}
      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <div className="h-5 bg-slate-200 rounded-md w-3/4" />
        
        {/* Meta info skeleton (year, runtime) */}
        <div className="flex items-center space-x-2">
          <div className="h-4 bg-slate-200 rounded-md w-12" />
          <div className="h-4 bg-slate-200 rounded-md w-16" />
        </div>

        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-2 pt-2">
          <div className="h-5 bg-slate-200 rounded-full w-14" />
          <div className="h-5 bg-slate-200 rounded-full w-12" />
        </div>
      </div>
    </div>
  );
}
