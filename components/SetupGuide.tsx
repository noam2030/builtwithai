"use client";

import React, { useState } from "react";
import { KeyRound, ExternalLink, Check, Copy, Info } from "lucide-react";

export function SetupGuide() {
  const [copiedEnv, setCopiedEnv] = useState(false);

  const envSnippet = `VERCEL_TOKEN=your_token_here\n# VERCEL_TEAM_ID=team_xxxxxxxxxxxxx (optional)`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(envSnippet);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto my-8 rounded-2xl glass-panel p-6 sm:p-8 border-blue-900/40 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
          <KeyRound className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Connect Your Vercel Account
          </h2>
          <p className="text-sm text-neutral-400">
            Set your Vercel Access Token to automatically fetch and display your live projects.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4 text-sm text-neutral-300">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 text-xs font-semibold shrink-0">
            1
          </span>
          <div className="flex-1">
            <p className="font-medium text-neutral-200">
              Create a Vercel Personal Access Token
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              Go to your Vercel account settings, create an access token with project read permissions.
            </p>
            <a
              href="https://vercel.com/account/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 mt-2 font-medium"
            >
              <span>Open Vercel Account Tokens</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 text-xs font-semibold shrink-0">
            2
          </span>
          <div className="flex-1">
            <p className="font-medium text-neutral-200">
              Configure Environment Variable
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              Add your token to <code className="text-blue-300 bg-neutral-800/80 px-1.5 py-0.5 rounded">.env.local</code> for local testing, or in your Vercel project dashboard under <strong>Settings &gt; Environment Variables</strong> for production.
            </p>
            <div className="relative mt-2.5 rounded-lg bg-black/60 p-3 font-mono text-xs text-neutral-300 border border-neutral-800">
              <pre className="overflow-x-auto">{envSnippet}</pre>
              <button
                onClick={handleCopyEnv}
                className="absolute top-2 right-2 p-1.5 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 transition-colors"
                title="Copy snippet"
                aria-label="Copy snippet"
              >
                {copiedEnv ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 text-xs font-semibold shrink-0">
            3
          </span>
          <div className="flex-1">
            <p className="font-medium text-neutral-200">
              Refresh the page
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              Once configured, restart your local server or redeploy to Vercel. Your projects and their live URLs will appear automatically!
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs text-neutral-400 bg-blue-950/20 border border-blue-900/30 rounded-lg p-3">
        <Info className="w-4 h-4 text-blue-400 shrink-0" />
        <span>
          <strong>Security note:</strong> Your Vercel token is processed strictly on the server and is never sent or exposed to client browsers.
        </span>
      </div>
    </div>
  );
}
