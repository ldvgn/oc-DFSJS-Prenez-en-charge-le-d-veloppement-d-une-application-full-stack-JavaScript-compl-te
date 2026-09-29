"use server";

import z from "zod";
import { redirect } from "next/navigation";
import { authService } from "@/modules/auth/auth.service";
import { PostSchema } from "./post.schemas";
import { postService } from "./post.service";

export type PostState =
  | {
      errors?: { topicId?: string[]; title?: string[]; content?: string[] };
      message?: string;
    }
  | undefined;

/**
 * Creates a post for the current user, then redirects to it.
 *
 * @param _prevState - Previous `useActionState` state (unused)
 * @param formData - `topicId`, `title`, `content`
 * @returns Field errors or a message, or redirects to the post
 */
export async function createPostAction(
  _prevState: PostState,
  formData: FormData,
): Promise<PostState> {
  const user = await authService.requireUser();

  const parsed = PostSchema.safeParse({
    topicId: formData.get("topicId"),
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  let post;
  try {
    post = await postService.create(parsed.data, user.id);
  } catch {
    return { message: "Impossible de créer l'article." };
  }
  redirect(`/posts/${post.id}`);
}
