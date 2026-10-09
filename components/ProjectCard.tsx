"use client";

import React, { useState } from "react";
import { ProjectDisplayItem } from "@/lib/types";
import {
  ExternalLink,
  Globe,
  GitBranch,
  Copy,
  Check,
  Calendar,
  Layers,
} from "lucide-react";

interface ProjectCardProps {
  project: ProjectDisplayItem;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!project.webUrl) return;
    navigator.clipboard.writeText(project.webUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatRelativeDate = (timestamp: number) => {
    if (!timestamp) return "Recently";
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
  };

  const getFrameworkColor = (framework: string | null) => {
    switch (framework?.toLowerCase()) {
      case "nextjs":
        return "bg-neutral-800 text-neutral-200 border-neutral-700";
      case "vite":
        return "bg-purple-950/60 text-purple-300 border-purple-800/60";
      case "astro":
        return "bg-orange-950/60 text-orange-300 border-orange-800/60";
      case "remix":
        return "bg-cyan-950/60 text-cyan-300 border-cyan-800/60";
      case "svelte":
      case "sveltekit":
        return "bg-rose-950/60 text-rose-300 border-rose-800/60";
      case "vue":
      case "nuxtjs":
        return "bg-emerald-950/60 text-emerald-300 border-emerald-800/60";
      default:
        return "bg-blue-950/60 text-blue-300 border-blue-800/60";
    }
  };

  const displayDomain = project.webUrl
    ? project.webUrl.replace(/^https?:\/\//i, "")
    : null;

  return (
    <div className="group relative flex flex-col justify-between rounded-xl p-5 transition-all duration-200 glass-panel glass-panel-hover">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors line-clamp-1 tracking-tight">
            {project.name}
          </h3>
          {project.framework && (
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border shrink-0 ${getFrameworkColor(
                project.framework
              )}`}
            >
              <Layers className="w-3 h-3" />
              {project.framework}
            </span>
          )}
        </div>

        {/* Live URL Display */}
        {project.webUrl ? (
          <div className="mt-3 flex items-center justify-between gap-2 p-2 rounded-lg bg-neutral-900/80 border border-neutral-800/80 text-xs text-neutral-400">
            <div className="flex items-center gap-2 truncate">
              <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <a
                href={project.webUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate hover:text-white transition-colors hover:underline"
                title={project.webUrl}
              >
                {displayDomain}
              </a>
            </div>
            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors shrink-0"
              title="Copy URL"
              aria-label="Copy URL"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-neutral-900/40 border border-neutral-800/50 text-xs text-neutral-500">
            <Globe className="w-3.5 h-3.5 opacity-40 shrink-0" />
            <span>No deployment URL yet</span>
          </div>
        )}
      </div>

      {/* Card Footer: Metadata & Direct Action Link */}
      <div className="mt-5 pt-3.5 border-t border-neutral-800/60 flex items-center justify-between gap-2 text-xs text-neutral-400">
        <div className="flex items-center gap-3">
          {/* Updated date */}
          <span className="flex items-center gap-1.5 text-neutral-400" title="Last updated">
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            {formatRelativeDate(project.updatedAt)}
          </span>

          {/* Git Repository Link if attached */}
          {project.gitRepo && (
            <a
              href={project.gitRepo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-neutral-200 transition-colors"
              title={`View repository on ${project.gitRepo.provider}`}
            >
              <GitBranch className="w-3.5 h-3.5 text-neutral-500" />
              <span className="truncate max-w-[100px]">{project.gitRepo.repo}</span>
            </a>
          )}
        </div>

        {/* Primary Action Button */}
        {project.webUrl && (
          <a
            href={project.webUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shadow-sm shadow-blue-500/20"
          >
            <span>Visit Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
