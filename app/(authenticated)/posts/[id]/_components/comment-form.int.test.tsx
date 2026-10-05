import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommentForm from "@/app/(authenticated)/posts/[id]/_components/comment-form";
import { createCommentAction } from "@/modules/comment/comment.actions";

vi.mock("@/modules/comment/comment.actions", () => ({
  createCommentAction: vi.fn(),
}));

describe("CommentForm", () => {
  it("shows validation errors without calling the action", async () => {
    render(<CommentForm postId="post-1" />);

    await userEvent.click(
      screen.getByRole("button", { name: "Envoyer le commentaire" }),
    );

    expect(await screen.findByText("5 caractères minimum")).toBeInTheDocument();
    expect(createCommentAction).not.toHaveBeenCalled();
  });

  it("shows an error when the content exceeds 5000 characters", async () => {
    render(<CommentForm postId="post-1" />);

    await userEvent.click(screen.getByLabelText("Commentaire"));
    await userEvent.paste("a".repeat(5001));
    await userEvent.click(
      screen.getByRole("button", { name: "Envoyer le commentaire" }),
    );

    expect(
      await screen.findByText("5000 caractères maximum"),
    ).toBeInTheDocument();
    expect(createCommentAction).not.toHaveBeenCalled();
  });

  it("shows the error returned by the action and keeps the content", async () => {
    vi.mocked(createCommentAction).mockResolvedValue({
      message: "Échec de l'envoi. Réessayez plus tard.",
    });
    render(<CommentForm postId="post-1" />);

    await userEvent.type(
      screen.getByLabelText("Commentaire"),
      "Un commentaire valide",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Envoyer le commentaire" }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Échec de l'envoi. Réessayez plus tard.",
    );
    expect(screen.getByLabelText("Commentaire")).toHaveValue(
      "Un commentaire valide",
    );
  });

  it("calls the action once with the content and post ID on valid submission", async () => {
    vi.mocked(createCommentAction).mockResolvedValue(undefined);
    render(<CommentForm postId="post-1" />);

    await userEvent.type(
      screen.getByLabelText("Commentaire"),
      "Un commentaire valide",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Envoyer le commentaire" }),
    );

    expect(createCommentAction).toHaveBeenCalledOnce();
    const [, formData] = vi.mocked(createCommentAction).mock.calls[0];
    expect(formData.get("content")).toBe("Un commentaire valide");
    expect(formData.get("postId")).toBe("post-1");
  });

  it("clears the field after a successful submission", async () => {
    vi.mocked(createCommentAction).mockResolvedValue(undefined);
    render(<CommentForm postId="post-1" />);

    await userEvent.type(
      screen.getByLabelText("Commentaire"),
      "Un commentaire valide",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Envoyer le commentaire" }),
    );

    await waitFor(() =>
      expect(screen.getByLabelText("Commentaire")).toHaveValue(""),
    );
  });
});
