"use server";

import z from "zod";
import { revalidatePath } from "next/cache";
import { authService } from "@/modules/auth/auth.service";
import { CommentState, CreateCommentSchema } from "./comment.schemas";
import { commentService } from "./comment.service";

/**
 * Adds a comment, then refreshes the post page.
 *
 * @param formData - `postId`, `content`
 * @returns The errors to display
 */
export async function createCommentAction(
  _state: CommentState,
  formData: FormData,
): Promise<CommentState> {
  const user = await authService.requireUser();

  const validatedFields = CreateCommentSchema.safeParse({
    content: formData.get("content"),
    postId: formData.get("postId"),
  });

  if (!validatedFields.success) {
    const { content } = z.flattenError(validatedFields.error).fieldErrors;
    return content
      ? { errors: { content } }
      : { message: "Article introuvable." };
  }

  const { postId, ...comment } = validatedFields.data;

  try {
    await commentService.create(comment, postId, user.id);
  } catch {
    return { message: "Échec de l'envoi. Réessayez plus tard." };
  }

  revalidatePath(`/posts/${postId}`);
}
