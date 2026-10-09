# Built With AI — Vercel Projects Hub

A fast, responsive web application built to be deployed strictly on Vercel. It connects to your Vercel account, retrieves all deployed projects via the Vercel REST API, and showcases them in a curated directory with direct clickable links to each project's live production webpage.

## Features

- **Direct Live Links**: Instant access to every project's live production URL and custom domains.
- **Vercel API Integration**: Automatically fetches project details (name, framework, deployment URLs, git repositories, and update dates).
- **Search & Framework Filters**: Real-time client-side search by project name and framework filter pills (Next.js, Vite, Astro, etc.).
- **URL Copy & Repository Links**: One-click URL copy and quick links to linked GitHub/GitLab/Bitbucket repos.
- **Zero-Config Vercel Deployment**: Native Next.js 14 App Router project designed for Vercel Edge & Serverless execution.
- **Secure Token Handling**: Vercel API token is strictly scoped to the server runtime and never exposed to the browser.
- **Friendly Setup Mode**: Clear visual guide when `VERCEL_TOKEN` has not yet been set up.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create `.env.local` in the project root:

```env
# Vercel Personal Access Token
# Create one at: https://vercel.com/account/tokens
VERCEL_TOKEN=your_token_here

# (Optional) Vercel Team ID if listing projects belonging to a team
# VERCEL_TEAM_ID=team_xxxxxxxxxxxxx
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view your projects.

### 4. Run Tests

```bash
npm test
```

## Deploying to Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import the repository in [Vercel](https://vercel.com/new).
3. Under **Environment Variables**, add:
   - `VERCEL_TOKEN`: Your Vercel Personal Access Token
   - `VERCEL_TEAM_ID`: (Optional, if you want to display projects belonging to a specific team)
4. Click **Deploy**.
