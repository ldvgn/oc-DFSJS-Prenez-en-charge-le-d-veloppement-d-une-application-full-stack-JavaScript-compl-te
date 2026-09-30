"use server";

import z from "zod";
import { revalidatePath } from "next/cache";
import { authService } from "@/modules/auth/auth.service";
import { CreateCommentSchema } from "./comment.schemas";
import { commentService } from "./comment.service";

export type CommentState =
  | {
      errors?: { content?: string[] };
      message?: string;
    }
  | undefined;

/**
 * Adds a comment from the current user to a post, then refreshes the post page.
 *
 * @param _prevState - Previous `useActionState` state (unused)
 * @param formData - `postId`, `content`
 * @returns Field errors or a message, or nothing on success
 */
export async function createCommentAction(
  _prevState: CommentState,
  formData: FormData,
): Promise<CommentState> {
  const user = await authService.requireUser();

  const parsed = CreateCommentSchema.safeParse({
    content: formData.get("content"),
    postId: formData.get("postId"),
  });

  if (!parsed.success) {
    const { content } = z.flattenError(parsed.error).fieldErrors;
    return content
      ? { errors: { content } }
      : { message: "Article introuvable." };
  }

  const { postId, ...comment } = parsed.data;

  try {
    await commentService.create(comment, postId, user.id);
  } catch {
    return { message: "Échec de l'envoi. Réessayez plus tard." };
  }

  revalidatePath(`/posts/${postId}`);
}
