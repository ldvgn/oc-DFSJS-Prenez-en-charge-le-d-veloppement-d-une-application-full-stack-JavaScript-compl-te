"use server";

import z from "zod";
import { revalidatePath } from "next/cache";
import { authService } from "@/modules/auth/auth.service";
import { CommentSchema } from "./comment.schemas";
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

  const postId = String(formData.get("postId"));
  const parsed = CommentSchema.safeParse({ content: formData.get("content") });

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    await commentService.create(parsed.data, postId, user.id);
  } catch {
    return { message: "Échec de l'envoi. Réessayez plus tard." };
  }

  revalidatePath(`/posts/${postId}`);
}
