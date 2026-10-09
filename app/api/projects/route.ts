import { NextResponse } from "next/server";
import { fetchVercelProjects } from "@/lib/vercel";
import { ProjectsApiResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = process.env.VERCEL_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!token || !token.trim()) {
    const response: ProjectsApiResponse = {
      success: true,
      isConfigured: false,
      projects: [],
    };
    return NextResponse.json(response);
  }

  try {
    const projects = await fetchVercelProjects(token, teamId);
    const response: ProjectsApiResponse = {
      success: true,
      isConfigured: true,
      projects,
    };
    return NextResponse.json(response);
  } catch (err: any) {
    const response: ProjectsApiResponse = {
      success: false,
      isConfigured: true,
      projects: [],
      error: err?.message || "Failed to fetch projects from Vercel",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
