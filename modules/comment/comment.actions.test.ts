import { describe, it, expect, vi } from "vitest";
import { revalidatePath } from "next/cache";
import { createCommentAction } from "./comment.actions";
import { commentService } from "./comment.service";
import { authService } from "@/modules/auth/auth.service";

vi.mock("./comment.service");
vi.mock("next/cache");
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

describe("createCommentAction", () => {
  it("requires a logged-in user", async () => {
    vi.mocked(authService.requireUser).mockRejectedValue(
      new Error("NEXT_REDIRECT"),
    );
    const formData = new FormData();
    formData.append("postId", "post-1");
    formData.append("content", "Un commentaire valide");

    await expect(createCommentAction(undefined, formData)).rejects.toThrow(
      "NEXT_REDIRECT",
    );
    expect(commentService.create).not.toHaveBeenCalled();
  });

  it("returns an error when the content is too short", async () => {
    vi.mocked(authService.requireUser).mockResolvedValue(user);
    const formData = new FormData();
    formData.append("postId", "post-1");
    formData.append("content", "abc");

    const result = await createCommentAction(undefined, formData);

    expect(result).toEqual({ errors: { content: ["5 caractères minimum"] } });
    expect(commentService.create).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("returns an error when the post ID is missing", async () => {
    vi.mocked(authService.requireUser).mockResolvedValue(user);
    const formData = new FormData();
    formData.append("postId", "");
    formData.append("content", "Un commentaire valide");

    const result = await createCommentAction(undefined, formData);

    expect(result).toEqual({ message: "Article introuvable." });
    expect(commentService.create).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("returns an error when the service fails", async () => {
    vi.mocked(authService.requireUser).mockResolvedValue(user);
    vi.mocked(commentService.create).mockRejectedValue(new Error("DB down"));
    const formData = new FormData();
    formData.append("postId", "post-1");
    formData.append("content", "Un commentaire valide");

    const result = await createCommentAction(undefined, formData);

    expect(result).toEqual({
      message: "Échec de l'envoi. Réessayez plus tard.",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("creates the comment and refreshes the post page on success", async () => {
    vi.mocked(authService.requireUser).mockResolvedValue(user);
    vi.mocked(commentService.create).mockResolvedValue({
      id: "comment-1",
      content: "Un commentaire valide",
      createdAt: new Date("2026-01-01"),
      postId: "post-1",
      authorId: "user-1",
    });
    const formData = new FormData();
    formData.append("postId", "post-1");
    formData.append("content", "  Un commentaire valide  ");

    const result = await createCommentAction(undefined, formData);

    expect(commentService.create).toHaveBeenCalledWith(
      { content: "Un commentaire valide" },
      "post-1",
      "user-1",
    );
    expect(revalidatePath).toHaveBeenCalledWith("/posts/post-1");
    expect(result).toBeUndefined();
  });
});
