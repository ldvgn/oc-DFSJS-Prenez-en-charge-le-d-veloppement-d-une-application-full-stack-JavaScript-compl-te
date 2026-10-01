import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { authService } from "@/modules/auth/auth.service";
import { topicService } from "@/modules/topic/topic.service";
import PostCreate from "./page";

vi.mock("@/modules/auth/auth.service", () => ({
  authService: { requireUser: vi.fn() },
}));
vi.mock("@/modules/topic/topic.service", () => ({
  topicService: { getAll: vi.fn() },
}));
vi.mock("@/modules/post/post.actions", () => ({ createPostAction: vi.fn() }));

describe("New post page", () => {
  it("renders the header with a back link to /posts", async () => {
    vi.mocked(topicService.getAll).mockResolvedValue([]);

    render(await PostCreate());

    expect(
      screen.getByRole("heading", { level: 1, name: "Créer un nouvel article" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Retour" })).toHaveAttribute(
      "href",
      "/posts",
    );
  });

  it("renders the form with the topics as options", async () => {
    vi.mocked(topicService.getAll).mockResolvedValue([
      { id: "topic-1", name: "JavaScript", description: "Le langage du web." },
      { id: "topic-2", name: "TypeScript", description: "JavaScript typé." },
    ]);

    render(await PostCreate());

    expect(screen.getByRole("option", { name: "JavaScript" })).toHaveValue(
      "topic-1",
    );
    expect(screen.getByRole("option", { name: "TypeScript" })).toHaveValue(
      "topic-2",
    );
    expect(screen.getByRole("button", { name: "Créer" })).toBeInTheDocument();
  });

  it("does not load the topics when the user is not logged in", async () => {
    vi.mocked(authService.requireUser).mockRejectedValueOnce(
      new Error("NEXT_REDIRECT"),
    );

    await expect(PostCreate()).rejects.toThrow("NEXT_REDIRECT");

    expect(topicService.getAll).not.toHaveBeenCalled();
  });
});
