import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  resolveWebUrl,
  resolveGitRepo,
  normalizeVercelProject,
  fetchVercelProjects,
} from "./vercel";
import { VercelProject } from "./types";

describe("vercel lib utilities", () => {
  const mockProject: VercelProject = {
    id: "prj_123",
    name: "portfolio-app",
    framework: "nextjs",
    createdAt: 1700000000000,
    updatedAt: 1700000500000,
    targets: {
      production: {
        id: "dpl_abc",
        url: "portfolio-app-prod.vercel.app",
        alias: ["portfolio.example.com", "portfolio-app.vercel.app"],
        readyState: "READY",
      },
    },
    link: {
      type: "github",
      repo: "user/portfolio-app",
    },
  };

  describe("resolveWebUrl", () => {
    it("prefers custom domain over .vercel.app alias", () => {
      const { webUrl, domains } = resolveWebUrl(mockProject);
      expect(webUrl).toBe("https://portfolio.example.com");
      expect(domains).toContain("portfolio.example.com");
      expect(domains).toContain("portfolio-app.vercel.app");
      expect(domains).toContain("portfolio-app-prod.vercel.app");
    });

    it("falls back to project.name.vercel.app if no targets or deployments exist", () => {
      const emptyProject: VercelProject = {
        id: "prj_empty",
        name: "my-cool-site",
        createdAt: 1700000000000,
        updatedAt: 1700000000000,
      };
      const { webUrl, domains } = resolveWebUrl(emptyProject);
      expect(webUrl).toBe("https://my-cool-site.vercel.app");
      expect(domains).toEqual(["my-cool-site.vercel.app"]);
    });

    it("correctly handles latestDeployments fallback", () => {
      const depProject: VercelProject = {
        id: "prj_dep",
        name: "test-dep",
        createdAt: 1700000000000,
        updatedAt: 1700000000000,
        latestDeployments: [
          {
            id: "dpl_1",
            url: "test-dep-preview.vercel.app",
            readyState: "READY",
            target: "production",
          },
        ],
      };
      const { webUrl } = resolveWebUrl(depProject);
      expect(webUrl).toBe("https://test-dep-preview.vercel.app");
    });
  });

  describe("resolveGitRepo", () => {
    it("formats GitHub repo URL correctly", () => {
      const repoInfo = resolveGitRepo(mockProject);
      expect(repoInfo).toEqual({
        provider: "github",
        repo: "user/portfolio-app",
        url: "https://github.com/user/portfolio-app",
      });
    });

    it("formats GitLab repo URL correctly", () => {
      const gitlabProject: VercelProject = {
        ...mockProject,
        link: {
          type: "gitlab",
          repo: "org/gitlab-repo",
        },
      };
      const repoInfo = resolveGitRepo(gitlabProject);
      expect(repoInfo?.url).toBe("https://gitlab.com/org/gitlab-repo");
    });

    it("returns null if no repository link is present", () => {
      const noRepoProject: VercelProject = {
        ...mockProject,
        link: undefined,
      };
      expect(resolveGitRepo(noRepoProject)).toBeNull();
    });
  });

  describe("normalizeVercelProject", () => {
    it("normalizes a raw VercelProject into ProjectDisplayItem", () => {
      const item = normalizeVercelProject(mockProject);
      expect(item.id).toBe("prj_123");
      expect(item.name).toBe("portfolio-app");
      expect(item.framework).toBe("nextjs");
      expect(item.webUrl).toBe("https://portfolio.example.com");
      expect(item.gitRepo?.repo).toBe("user/portfolio-app");
      expect(item.updatedAt).toBe(1700000500000);
    });
  });

  describe("fetchVercelProjects", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("throws an error when token is empty", async () => {
      await expect(fetchVercelProjects("")).rejects.toThrow(
        "Missing Vercel API token"
      );
    });

    it("handles 401 Unauthorized status with informative error", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: { message: "Invalid token" } }),
      } as any);

      await expect(fetchVercelProjects("invalid_token")).rejects.toThrow(
        /Invalid or expired Vercel token/
      );
    });

    it("fetches and normalizes projects successfully", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          projects: [mockProject],
        }),
      } as any);

      const projects = await fetchVercelProjects("valid_token", "team_123");
      expect(projects).toHaveLength(1);
      expect(projects[0].name).toBe("portfolio-app");
      expect(projects[0].webUrl).toBe("https://portfolio.example.com");
    });
  });
});
