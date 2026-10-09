# Project Specification

## 1. Overview
BuiltWithAI (Vercel Projects Hub) is a fast, responsive web application designed to be deployed strictly on Vercel. It connects to the user's Vercel account via the Vercel REST API, retrieves all deployed projects, and renders a curated directory showcasing each project with a direct, clickable link to its live webpage, its framework, last update date, and git repository details.

## 2. Requirements
- Retrieve projects from the Vercel REST API (`GET https://api.vercel.com/v9/projects`).
- Securely authenticate API requests using a server-side `VERCEL_TOKEN` (never exposed to client browsers).
- Support optional `VERCEL_TEAM_ID` for querying projects within a Vercel Team or Organization.
- For each project, extract and construct the primary live website URL from production targets or custom domains.
- Display key project metadata: name, framework badge, live webpage link, custom domains, git repository link, and last deployment/update time.
- Provide real-time client-side search by project name and filtering by framework.
- Display a guided configuration state when `VERCEL_TOKEN` is not yet configured, explaining step-by-step how to add the token locally or in the Vercel dashboard.
- Responsive modern UI styled with dark-mode elegance tailored to Vercel's design language.
- Automatically exclude the 'builtwithai' project (case-insensitive, matching 'builtwithai' and 'built-with-ai') from the list so the hub does not list itself.
- Strictly target Vercel for hosting and deployment.

## 3. User Experience
- **Header**: Displays application branding, project count badge, and a re-sync/refresh button.
- **Search & Filters**: Instant search bar with clear button, alongside framework filter chips (e.g., All, Next.js, Vite, React, Astro, Nuxt, etc.).
- **Project Cards**:
  - Project title with direct external link to the live production site.
  - Framework badge with descriptive tag.
  - Live webpage URL badge with one-click copy and "Open Webpage" action.
  - Git repository link (GitHub/GitLab/Bitbucket) if linked.
  - Relative timestamp for the last update.
- **Empty States**: Friendly message and reset filter button when no projects match the search query.
- **Setup Guide**: If `VERCEL_TOKEN` is missing, renders an interactive onboarding guide with token generation links and instructions.

## 4. Architecture
- **Framework**: Next.js (App Router) leveraging React Server Components and Route Handlers.
- **Security Boundary**: All communication with the external Vercel API happens strictly within server-side route handlers / server utilities. `VERCEL_TOKEN` is never sent to the client.
- **Data Flow**:
  1. Client calls internal route `GET /api/projects`.
  2. Server fetches data from `https://api.vercel.com/v9/projects` using `VERCEL_TOKEN`.
  3. Server normalizes projects into a clean `ProjectDisplayItem` array and resolves production live URLs.
  4. Client renders the project directory with instant search and filter capabilities.

## 5. Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Testing**: Vitest, @testing-library/react, @testing-library/jest-dom, jsdom
- **Runtime & Deployment**: Node.js 18+ / Vercel Edge & Serverless Runtime

## 6. Backend
- **Vercel Service (`lib/vercel.ts`)**:
  - `fetchVercelProjects(token: string, teamId?: string)`: Communicates with Vercel API.
  - Resolves live URLs: prioritizes `targets.production.alias[0]`, then `targets.production.url`, prefixing `https://`.
  - Filters out the 'builtwithai' project (case-insensitive, matching 'builtwithai' and 'built-with-ai') from the final project list.
  - Handles HTTP status codes (200, 401 Unauthorized, 403 Forbidden, rate limits) with clear error messaging.
- **Internal API Route (`app/api/projects/route.ts`)**:
  - Exposes `GET /api/projects`.
  - Checks presence of `VERCEL_TOKEN`. If not configured, returns `isConfigured: false` and friendly status.
  - Returns JSON response with cached/revalidated data (`export const revalidate = 60`).

## 7. Frontend
- **Root Layout (`app/layout.tsx`)**: Global metadata, Inter/Geist fonts, root HTML, and dark background styling.
- **Home Page (`app/page.tsx`)**: Entry point orchestrating initial data fetching and mounting `ProjectsContainer`.
- **Components**:
  - `ProjectsContainer`: Coordinates state, search query, selected framework filter, and renders list or setup banner.
  - `ProjectCard`: Card component rendering project details, live webpage link, framework badge, and git link.
  - `SearchFilterBar`: Search input field and framework filter buttons.
  - `SetupGuide`: Informative onboarding banner when `VERCEL_TOKEN` needs to be set.
  - `EmptyState`: Empty state display with search reset option.

## 8. Data Model
- **`ProjectDisplayItem`**:
  - `id`: string (Vercel project ID)
  - `name`: string (Project display name)
  - `framework`: string | null (e.g., "nextjs", "vite", "astro")
  - `webUrl`: string | null (Primary live website URL, e.g., "https://my-app.vercel.app")
  - `domains`: string[] (All assigned production domains/aliases)
  - `gitRepo`: { provider: string; repo: string; url: string } | null
  - `updatedAt`: number (Timestamp in milliseconds)
  - `createdAt`: number (Timestamp in milliseconds)
- **`ProjectsApiResponse`**:
  - `success`: boolean
  - `isConfigured`: boolean
  - `projects`: ProjectDisplayItem[]
  - `error`?: string

## 9. API
- **Internal Route**: `GET /api/projects`
  - Response (Success): `{ success: true, isConfigured: true, projects: ProjectDisplayItem[] }`
  - Response (Not Configured): `{ success: true, isConfigured: false, projects: [] }`
  - Response (Error): `{ success: false, isConfigured: true, error: string, projects: [] }` (Status 500 / 401)
- **External Vercel API**: `GET https://api.vercel.com/v9/projects?limit=100`
  - Headers: `Authorization: Bearer ${VERCEL_TOKEN}`
  - Optional Query: `teamId=${VERCEL_TEAM_ID}`

## 10. Configuration
- **Environment Variables**:
  - `VERCEL_TOKEN` (required for live data): Vercel Personal Access Token generated at `https://vercel.com/account/tokens`.
  - `VERCEL_TEAM_ID` (optional): Vercel Team ID for team-owned projects.
- **Configuration Files**:
  - `.env.example`: Template for environment variables.
  - `next.config.mjs`: Next.js configuration.
  - `tailwind.config.ts` and `postcss.config.js`: Tailwind styling configuration.
  - `tsconfig.json`: TypeScript compiler configuration.

## 11. Testing
- **Framework**: Vitest with `@testing-library/react` and `jsdom`.
- **Test Suites**:
  - `lib/vercel.test.ts`: Tests URL resolution, error parsing, and project normalization from mock Vercel API payloads.
  - `components/ProjectCard.test.tsx`: Tests rendering of project details, live links, and target attributes.
  - `components/ProjectsContainer.test.tsx`: Tests search filtering and empty state handling.
- **Coverage**: Core business logic and user-facing interactive components.

## 12. Deployment
- **Platform**: Vercel.
- **Build Command**: `npm run build`
- **Output**: Next.js standalone / serverless output automatically detected by Vercel.
- **Environment Variables on Vercel**: Set `VERCEL_TOKEN` (and `VERCEL_TEAM_ID` if applicable) in Vercel Project Settings > Environment Variables.
- **CI / CD**: GitHub Actions workflow running automated linting, test suite, and build checks on pull requests.
