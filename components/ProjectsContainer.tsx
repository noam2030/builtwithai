"use client";

import React, { useState, useMemo } from "react";
import { ProjectDisplayItem } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { SearchFilterBar } from "./SearchFilterBar";
import { SetupGuide } from "./SetupGuide";
import { EmptyState } from "./EmptyState";
import { RefreshCw, AlertCircle, Sparkles } from "lucide-react";

interface ProjectsContainerProps {
  initialProjects: ProjectDisplayItem[];
  isConfigured: boolean;
  initialError?: string;
}

export function ProjectsContainer({
  initialProjects,
  isConfigured,
  initialError,
}: ProjectsContainerProps) {
  const [projects, setProjects] = useState<ProjectDisplayItem[]>(initialProjects);
  const [configured, setConfigured] = useState<boolean>(isConfigured);
  const [error, setError] = useState<string | undefined>(initialError);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFramework, setSelectedFramework] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Collect unique frameworks
  const availableFrameworks = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) {
      if (p.framework && p.framework.trim()) {
        set.add(p.framework.toLowerCase().trim());
      }
    }
    return Array.from(set).sort();
  }, [projects]);

  // Filter projects by search and framework
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (project.webUrl &&
          project.webUrl.toLowerCase().includes(searchQuery.toLowerCase().trim())) ||
        (project.gitRepo &&
          project.gitRepo.repo.toLowerCase().includes(searchQuery.toLowerCase().trim()));

      const matchesFramework =
        selectedFramework === "all" ||
        (project.framework &&
          project.framework.toLowerCase() === selectedFramework.toLowerCase());

      return matchesSearch && matchesFramework;
    });
  }, [projects, searchQuery, selectedFramework]);

  // Refresh data handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(undefined);
    try {
      const res = await fetch("/api/projects", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects || []);
        setConfigured(Boolean(data.isConfigured));
      } else {
        setError(data.error || "Failed to refresh projects");
      }
    } catch (err: any) {
      setError(err?.message || "Network error while refreshing projects");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedFramework("all");
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Header / Hero */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Vercel Portfolio & Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            My Projects
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-400 max-w-xl">
            Live directory of all web applications deployed to Vercel, with direct access to production webpages.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs font-semibold text-neutral-300">
            <span className="text-blue-400 font-bold">{projects.length}</span>{" "}
            {projects.length === 1 ? "project" : "projects"}
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-xs font-medium text-neutral-200 transition-colors border border-neutral-700/80"
            title="Refresh projects list from Vercel"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-400" : ""}`}
            />
            <span>{isRefreshing ? "Syncing..." : "Refresh"}</span>
          </button>
        </div>
      </header>

      {/* Error Alert if any */}
      {error && (
        <div className="my-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Unable to load Vercel projects</p>
            <p className="text-xs text-rose-300/90 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Setup Guide if token is missing */}
      {!configured ? (
        <SetupGuide />
      ) : (
        <div className="mt-8 space-y-6">
          {/* Controls: Search and filter */}
          <SearchFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFramework={selectedFramework}
            onFrameworkChange={setSelectedFramework}
            availableFrameworks={availableFrameworks}
          />

          {/* Results List / Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState
              hasFilters={searchQuery.trim() !== "" || selectedFramework !== "all"}
              onReset={handleResetFilters}
            />
          )}
        </div>
      )}
    </div>
  );
}
