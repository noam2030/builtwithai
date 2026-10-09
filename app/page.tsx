import { fetchVercelProjects } from "@/lib/vercel";
import { ProjectDisplayItem } from "@/lib/types";
import { ProjectsContainer } from "@/components/ProjectsContainer";

export const revalidate = 60; // Revalidate at most every 60 seconds

export default async function HomePage() {
  const token = process.env.VERCEL_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID;

  let initialProjects: ProjectDisplayItem[] = [];
  let isConfigured = false;
  let initialError: string | undefined = undefined;

  if (token && token.trim()) {
    isConfigured = true;
    try {
      initialProjects = await fetchVercelProjects(token, teamId);
    } catch (err: any) {
      initialError = err?.message || "Failed to load projects from Vercel";
    }
  }

  return (
    <main className="min-h-screen">
      <ProjectsContainer
        initialProjects={initialProjects}
        isConfigured={isConfigured}
        initialError={initialError}
      />
    </main>
  );
}
