import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectCard } from "./ProjectCard";
import { ProjectDisplayItem } from "@/lib/types";

describe("ProjectCard", () => {
  const sampleProject: ProjectDisplayItem = {
    id: "prj_abc",
    name: "ai-generator",
    framework: "nextjs",
    webUrl: "https://ai-generator.vercel.app",
    domains: ["ai-generator.vercel.app"],
    gitRepo: {
      provider: "github",
      repo: "myorg/ai-generator",
      url: "https://github.com/myorg/ai-generator",
    },
    updatedAt: Date.now() - 3600 * 1000, // 1 hour ago
    createdAt: Date.now() - 86400 * 1000,
  };

  it("renders project name, framework badge, and live link", () => {
    render(<ProjectCard project={sampleProject} />);

    expect(screen.getByText("ai-generator")).toBeInTheDocument();
    expect(screen.getByText("nextjs")).toBeInTheDocument();
    expect(screen.getByText("ai-generator.vercel.app")).toBeInTheDocument();

    const visitLink = screen.getByRole("link", { name: /visit site/i });
    expect(visitLink).toHaveAttribute("href", "https://ai-generator.vercel.app");
    expect(visitLink).toHaveAttribute("target", "_blank");
  });

  it("renders git repository link", () => {
    render(<ProjectCard project={sampleProject} />);

    const repoLink = screen.getByTitle("View repository on github");
    expect(repoLink).toHaveAttribute(
      "href",
      "https://github.com/myorg/ai-generator"
    );
  });

  it("supports copying URL to clipboard", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<ProjectCard project={sampleProject} />);
    const copyButton = screen.getByLabelText("Copy URL");
    fireEvent.click(copyButton);

    expect(writeTextMock).toHaveBeenCalledWith("https://ai-generator.vercel.app");
  });
});
