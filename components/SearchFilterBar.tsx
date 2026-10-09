"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFramework: string;
  onFrameworkChange: (framework: string) => void;
  availableFrameworks: string[];
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  selectedFramework,
  onFrameworkChange,
  availableFrameworks,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects by name..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/60 transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-200"
            title="Clear search"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Framework Filter Pills */}
      {availableFrameworks.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-neutral-500 font-medium mr-1 shrink-0">
            Framework:
          </span>
          <button
            onClick={() => onFrameworkChange("all")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
              selectedFramework === "all"
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                : "bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/80 border border-neutral-800/80"
            }`}
          >
            All
          </button>
          {availableFrameworks.map((framework) => (
            <button
              key={framework}
              onClick={() => onFrameworkChange(framework)}
              className={`px-3 py-1.5 rounded-lg font-medium capitalize transition-all shrink-0 ${
                selectedFramework === framework
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                : "bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/80 border border-neutral-800/80"
              }`}
            >
              {framework}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
