import { describe, it, expect, vi } from "vitest";
import { redirect } from "next/navigation";
import { createPostAction } from "./post.actions";
import { postService } from "./post.service";
import { authService } from "@/modules/auth/auth.service";

vi.mock("./post.service");
vi.mock("next/navigation");
vi.mock("@/modules/auth/auth.service");

const user = {
  id: "user-1",
  name: "alice",
  username: "alice",
  email: "alice@test.com",
  emailVerified: false,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

describe("createPostAction", () => {
  it("requires a logged-in user", async () => {
    vi.mocked(authService.requireUser).mockRejectedValue(
      new Error("NEXT_REDIRECT"),
    );
    const formData = new FormData();
    formData.append("topicId", "topic-1");
    formData.append("title", "Mon article");
    formData.append("content", "Un contenu valide");

    await expect(createPostAction(undefined, formData)).rejects.toThrow(
      "NEXT_REDIRECT",
    );
    expect(postService.create).not.toHaveBeenCalled();
  });

  it("returns an error when fields are empty", async () => {
    vi.mocked(authService.requireUser).mockResolvedValue(user);
    const formData = new FormData();
    formData.append("topicId", "");
    formData.append("title", "");
    formData.append("content", "");

    const result = await createPostAction(undefined, formData);

    expect(result).toEqual({
      errors: {
        topicId: ["Le thème est requis"],
        title: ["Le titre est requis"],
        content: ["5 caractères minimum"],
      },
    });
    expect(postService.create).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("returns an error when the service fails", async () => {
    vi.mocked(authService.requireUser).mockResolvedValue(user);
    vi.mocked(postService.create).mockRejectedValue(new Error("DB down"));
    const formData = new FormData();
    formData.append("topicId", "topic-1");
    formData.append("title", "Mon article");
    formData.append("content", "Un contenu valide");

    const result = await createPostAction(undefined, formData);

    expect(result).toEqual({ message: "Impossible de créer l'article." });
    expect(redirect).not.toHaveBeenCalled();
  });

  it("creates the post and redirects to it on success", async () => {
    vi.mocked(authService.requireUser).mockResolvedValue(user);
    vi.mocked(postService.create).mockResolvedValue({
      id: "post-1",
      topicId: "topic-1",
      title: "Mon article",
      content: "Un contenu valide",
      createdAt: new Date("2026-01-01"),
      authorId: "user-1",
    });
    const formData = new FormData();
    formData.append("topicId", "topic-1");
    formData.append("title", "  Mon article  ");
    formData.append("content", "Un contenu valide");

    await createPostAction(undefined, formData);

    expect(postService.create).toHaveBeenCalledWith(
      {
        topicId: "topic-1",
        title: "Mon article",
        content: "Un contenu valide",
      },
      "user-1",
    );
    expect(redirect).toHaveBeenCalledWith("/posts/post-1");
  });
});
