import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectsContainer } from "./ProjectsContainer";
import { ProjectDisplayItem } from "@/lib/types";

describe("ProjectsContainer", () => {
  const mockProjects: ProjectDisplayItem[] = [
    {
      id: "1",
      name: "super-app",
      framework: "nextjs",
      webUrl: "https://super-app.vercel.app",
      domains: ["super-app.vercel.app"],
      gitRepo: null,
      updatedAt: Date.now(),
      createdAt: Date.now(),
    },
    {
      id: "2",
      name: "vite-portfolio",
      framework: "vite",
      webUrl: "https://vite-portfolio.vercel.app",
      domains: ["vite-portfolio.vercel.app"],
      gitRepo: null,
      updatedAt: Date.now(),
      createdAt: Date.now(),
    },
  ];

  it("renders setup guide when isConfigured is false", () => {
    render(
      <ProjectsContainer
        initialProjects={[]}
        isConfigured={false}
      />
    );

    expect(
      screen.getByText("Connect Your Vercel Account")
    ).toBeInTheDocument();
  });

  it("renders projects list and filters by search query", () => {
    render(
      <ProjectsContainer
        initialProjects={mockProjects}
        isConfigured={true}
      />
    );

    expect(screen.getByText("super-app")).toBeInTheDocument();
    expect(screen.getByText("vite-portfolio")).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(
      "Search projects by name..."
    );
    fireEvent.change(searchInput, { target: { value: "super" } });

    expect(screen.getByText("super-app")).toBeInTheDocument();
    expect(screen.queryByText("vite-portfolio")).not.toBeInTheDocument();
  });

  it("filters projects by framework selection", () => {
    render(
      <ProjectsContainer
        initialProjects={mockProjects}
        isConfigured={true}
      />
    );

    const viteButton = screen.getByRole("button", { name: "vite" });
    fireEvent.click(viteButton);

    expect(screen.queryByText("super-app")).not.toBeInTheDocument();
    expect(screen.getByText("vite-portfolio")).toBeInTheDocument();
  });

  it("shows empty state when search finds no matches", () => {
    render(
      <ProjectsContainer
        initialProjects={mockProjects}
        isConfigured={true}
      />
    );

    const searchInput = screen.getByPlaceholderText(
      "Search projects by name..."
    );
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });

    expect(screen.getByText("No projects found")).toBeInTheDocument();
  });
});
