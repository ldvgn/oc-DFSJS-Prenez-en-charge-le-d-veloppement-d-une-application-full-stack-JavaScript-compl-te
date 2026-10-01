import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { notFound } from "next/navigation";
import { authService } from "@/modules/auth/auth.service";
import { postService } from "@/modules/post/post.service";
import type { PostDetail } from "@/modules/post/post.schemas";
import Post from "./page";

vi.mock("next/navigation");
vi.mock("@/modules/auth/auth.service", () => ({
  authService: { requireUser: vi.fn() },
}));
vi.mock("@/modules/post/post.service", () => ({
  postService: { getById: vi.fn() },
}));
vi.mock("@/modules/comment/comment.actions", () => ({
  createCommentAction: vi.fn(),
}));

const post: PostDetail = {
  id: "post-1",
  title: "Découvrir les Server Actions",
  content: "Les Server Actions simplifient les formulaires.",
  createdAt: new Date("2026-03-15T10:00:00Z"),
  authorId: "user-1",
  topicId: "topic-1",
  author: { username: "alice" },
  topic: {
    id: "topic-1",
    name: "JavaScript",
    description: "Le langage du web.",
  },
  comments: [],
};

describe("Post detail page", () => {
  it("renders the post with its title, meta and content", async () => {
    vi.mocked(postService.getById).mockResolvedValue(post);

    render(
      await Post({
        params: Promise.resolve({ id: "post-1" }),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(postService.getById).toHaveBeenCalledWith("post-1");
    const article = screen.getByRole("article", {
      name: "Découvrir les Server Actions",
    });
    expect(within(article).getByText("15/03/2026")).toBeInTheDocument();
    expect(within(article).getByText("alice")).toBeInTheDocument();
    expect(within(article).getByText("JavaScript")).toBeInTheDocument();
    expect(
      within(article).getByText(
        "Les Server Actions simplifient les formulaires.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the header with a back link to /posts", async () => {
    vi.mocked(postService.getById).mockResolvedValue(post);

    render(
      await Post({
        params: Promise.resolve({ id: "post-1" }),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Découvrir les Server Actions",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Retour" })).toHaveAttribute(
      "href",
      "/posts",
    );
  });

  it("shows an empty message when the post has no comments", async () => {
    vi.mocked(postService.getById).mockResolvedValue(post);

    render(
      await Post({
        params: Promise.resolve({ id: "post-1" }),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(
      screen.getByText("Aucun commentaire pour le moment."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("lists the comments with their author", async () => {
    vi.mocked(postService.getById).mockResolvedValue({
      ...post,
      comments: [
        {
          id: "comment-1",
          content: "Très clair, merci !",
          createdAt: new Date("2026-03-16T10:00:00Z"),
          authorId: "user-2",
          postId: "post-1",
          author: { username: "bob" },
        },
        {
          id: "comment-2",
          content: "Et pour les erreurs ?",
          createdAt: new Date("2026-03-17T10:00:00Z"),
          authorId: "user-3",
          postId: "post-1",
          author: { username: "carol" },
        },
      ],
    });

    render(
      await Post({
        params: Promise.resolve({ id: "post-1" }),
        searchParams: Promise.resolve({}),
      }),
    );

    const comments = within(
      screen.getByRole("region", { name: "Commentaires" }),
    ).getAllByRole("listitem");
    expect(comments).toHaveLength(2);
    expect(within(comments[0]).getByText("bob")).toBeInTheDocument();
    expect(
      within(comments[0]).getByText("Très clair, merci !"),
    ).toBeInTheDocument();
    expect(within(comments[1]).getByText("carol")).toBeInTheDocument();
    expect(
      within(comments[1]).getByText("Et pour les erreurs ?"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Aucun commentaire pour le moment."),
    ).not.toBeInTheDocument();
  });

  it("renders the comment form", async () => {
    vi.mocked(postService.getById).mockResolvedValue(post);

    render(
      await Post({
        params: Promise.resolve({ id: "post-1" }),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(screen.getByLabelText("Commentaire")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Envoyer le commentaire" }),
    ).toBeInTheDocument();
  });

  it("calls notFound when the post does not exist", async () => {
    vi.mocked(postService.getById).mockResolvedValue(null);
    vi.mocked(notFound).mockImplementationOnce(() => {
      throw new Error("NEXT_NOT_FOUND");
    });

    await expect(
      Post({
        params: Promise.resolve({ id: "unknown" }),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalled();
  });

  it("does not load the post when the user is not logged in", async () => {
    vi.mocked(authService.requireUser).mockRejectedValueOnce(
      new Error("NEXT_REDIRECT"),
    );

    await expect(
      Post({
        params: Promise.resolve({ id: "post-1" }),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toThrow("NEXT_REDIRECT");

    expect(postService.getById).not.toHaveBeenCalled();
  });
});
