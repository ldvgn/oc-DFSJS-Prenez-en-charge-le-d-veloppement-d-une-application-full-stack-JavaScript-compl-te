import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { authService } from "@/modules/auth/auth.service";
import { postService } from "@/modules/post/post.service";
import Page from "./page";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock("@/modules/auth/auth.service", () => ({
  authService: { requireUser: vi.fn() },
}));
vi.mock("@/modules/post/post.service", () => ({
  postService: { getFeed: vi.fn() },
}));

const renderPage = async (order?: string) =>
  render(
    await Page({
      params: Promise.resolve({}),
      searchParams: Promise.resolve({ order }),
    } as PageProps<"/posts">),
  );

describe("Posts page", () => {
  it("loads the feed of the logged-in user", async () => {
    vi.mocked(authService.requireUser).mockResolvedValue({
      id: "user-1",
    } as never);
    vi.mocked(postService.getFeed).mockResolvedValue([
      {
        id: "post-1",
        title: "Bien démarrer avec TypeScript",
        content: "Contenu de l'article",
        createdAt: new Date("2026-01-01"),
        authorId: "user-2",
        topicId: "topic-1",
        author: { username: "bob" },
      },
    ]);

    await renderPage("asc");

    expect(postService.getFeed).toHaveBeenCalledWith("user-1", "asc");
    expect(
      screen.getByRole("link", { name: "Bien démarrer avec TypeScript" }),
    ).toBeInTheDocument();
  });

  it("invites the user to follow topics when the feed is empty", async () => {
    vi.mocked(authService.requireUser).mockResolvedValue({
      id: "user-1",
    } as never);
    vi.mocked(postService.getFeed).mockResolvedValue([]);

    await renderPage();

    expect(postService.getFeed).toHaveBeenCalledWith("user-1", "desc");
    expect(
      screen.getByRole("link", { name: "Abonnez-vous à des thèmes" }),
    ).toHaveAttribute("href", "/topics");
  });
});
