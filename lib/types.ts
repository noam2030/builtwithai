export interface VercelGitLink {
  type: "github" | "gitlab" | "bitbucket" | string;
  repo: string;
  org?: string;
  repoId?: number | string;
}

export interface VercelTargetProduction {
  id?: string;
  url?: string;
  alias?: string[];
  readyState?: string;
  createdAt?: number;
}

export interface VercelProject {
  id: string;
  name: string;
  framework?: string | null;
  createdAt: number;
  updatedAt: number;
  targets?: {
    production?: VercelTargetProduction;
    [key: string]: any;
  };
  alias?: Array<{ domain: string }> | string[];
  link?: VercelGitLink;
  latestDeployments?: Array<{
    id: string;
    url: string;
    readyState: string;
    target?: string;
  }>;
}

export interface ProjectDisplayItem {
  id: string;
  name: string;
  framework: string | null;
  webUrl: string | null;
  domains: string[];
  gitRepo: {
    provider: string;
    repo: string;
    url: string;
  } | null;
  updatedAt: number;
  createdAt: number;
}

export interface ProjectsApiResponse {
  success: boolean;
  isConfigured: boolean;
  projects: ProjectDisplayItem[];
  error?: string;
  teamName?: string;
}
