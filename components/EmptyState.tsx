"use client";

import React from "react";
import { FolderSearch, RotateCcw } from "lucide-react";

interface EmptyStateProps {
  hasFilters: boolean;
  onReset: () => void;
}

export function EmptyState({ hasFilters, onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl glass-panel my-8">
      <div className="p-3.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 mb-4 shadow-inner">
        <FolderSearch className="w-8 h-8 opacity-75" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-200">
        No projects found
      </h3>
      <p className="mt-1 text-sm text-neutral-400 max-w-sm">
        {hasFilters
          ? "No projects matched your search query or selected framework filter."
          : "There are no projects available in your Vercel account yet."}
      </p>
      {hasFilters && (
        <button
          onClick={onReset}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm font-medium text-neutral-200 transition-colors border border-neutral-700"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset filters</span>
        </button>
      )}
    </div>
  );
}
