import { VercelProject, ProjectDisplayItem } from "./types";

/**
 * Normalizes and extracts the primary live web URL and all associated domains for a Vercel project.
 */
export function resolveWebUrl(project: VercelProject): {
  webUrl: string | null;
  domains: string[];
} {
  const domainSet = new Set<string>();

  // 1. Check production target aliases (preferred custom/canonical domains)
  if (project.targets?.production?.alias && Array.isArray(project.targets.production.alias)) {
    for (const alias of project.targets.production.alias) {
      if (typeof alias === "string" && alias.trim()) {
        domainSet.add(alias.trim().replace(/^https?:\/\//i, ""));
      }
    }
  }

  // 2. Check project.alias array
  if (project.alias && Array.isArray(project.alias)) {
    for (const item of project.alias) {
      if (typeof item === "string" && item.trim()) {
        domainSet.add(item.trim().replace(/^https?:\/\//i, ""));
      } else if (item && typeof item === "object" && typeof (item as any).domain === "string") {
        domainSet.add((item as any).domain.trim().replace(/^https?:\/\//i, ""));
      }
    }
  }

  // 3. Check production target URL
  if (project.targets?.production?.url && typeof project.targets.production.url === "string") {
    domainSet.add(project.targets.production.url.trim().replace(/^https?:\/\//i, ""));
  }

  // 4. Check latest production deployment
  if (project.latestDeployments && Array.isArray(project.latestDeployments)) {
    const prodDep = project.latestDeployments.find(
      (d) => d.target === "production" || d.readyState === "READY"
    );
    if (prodDep?.url) {
      domainSet.add(prodDep.url.trim().replace(/^https?:\/\//i, ""));
    }
  }

  const domains = Array.from(domainSet);

  if (domains.length > 0) {
    // Pick the cleanest domain: prefer custom domain or the shortest .vercel.app
    const sorted = [...domains].sort((a, b) => {
      const aIsVercel = a.endsWith(".vercel.app");
      const bIsVercel = b.endsWith(".vercel.app");
      if (!aIsVercel && bIsVercel) return -1;
      if (aIsVercel && !bIsVercel) return 1;
      return a.length - b.length;
    });
    return {
      webUrl: `https://${sorted[0]}`,
      domains,
    };
  }

  // Fallback if no deployments exist yet, standard Vercel subdomain
  if (project.name) {
    const fallbackDomain = `${project.name}.vercel.app`;
    return {
      webUrl: `https://${fallbackDomain}`,
      domains: [fallbackDomain],
    };
  }

  return {
    webUrl: null,
    domains: [],
  };
}

/**
 * Normalizes git repository information
 */
export function resolveGitRepo(project: VercelProject): ProjectDisplayItem["gitRepo"] {
  if (!project.link || !project.link.repo) {
    return null;
  }

  const provider = (project.link.type || "github").toLowerCase();
  const repo = project.link.repo;

  let url = "";
  if (provider === "gitlab") {
    url = `https://gitlab.com/${repo}`;
  } else if (provider === "bitbucket") {
    url = `https://bitbucket.org/${repo}`;
  } else {
    url = `https://github.com/${repo}`;
  }

  return {
    provider,
    repo,
    url,
  };
}

/**
 * Transforms raw Vercel Project entity to clean ProjectDisplayItem
 */
export function normalizeVercelProject(project: VercelProject): ProjectDisplayItem {
  const { webUrl, domains } = resolveWebUrl(project);
  const gitRepo = resolveGitRepo(project);

  return {
    id: project.id,
    name: project.name,
    framework: project.framework || null,
    webUrl,
    domains,
    gitRepo,
    updatedAt: project.updatedAt || project.createdAt,
    createdAt: project.createdAt,
  };
}

/**
 * Checks whether a project should be excluded (specifically 'builtwithai' and 'built-with-ai').
 */
export function isExcludedProject(projectName: string): boolean {
  if (!projectName) return false;
  const normalized = projectName.trim().toLowerCase().replace(/[-_]/g, "");
  return normalized === "builtwithai";
}

/**
 * Fetches projects from the Vercel REST API
 */
export async function fetchVercelProjects(
  token: string,
  teamId?: string
): Promise<ProjectDisplayItem[]> {
  const trimmedToken = token.trim();
  if (!trimmedToken) {
    throw new Error("Missing Vercel API token");
  }

  const url = new URL("https://api.vercel.com/v9/projects");
  url.searchParams.set("limit", "100");
  if (teamId && teamId.trim()) {
    url.searchParams.set("teamId", teamId.trim());
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${trimmedToken}`,
      "Content-Type": "application/json",
    },
    // We can revalidate every 60 seconds
    next: { revalidate: 60 },
  } as any);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        "Invalid or expired Vercel token. Please verify your VERCEL_TOKEN environment variable."
      );
    }
    if (response.status === 403) {
      throw new Error(
        "Access forbidden. Please ensure your VERCEL_TOKEN has permissions to access projects (and check VERCEL_TEAM_ID if applicable)."
      );
    }

    let errorDetail = `Vercel API returned HTTP ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson?.error?.message) {
        errorDetail = errJson.error.message;
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorDetail);
  }

  const data = await response.json();
  const rawProjects: VercelProject[] = data.projects || [];

  return rawProjects
    .filter((project) => !isExcludedProject(project.name))
    .map(normalizeVercelProject)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}
