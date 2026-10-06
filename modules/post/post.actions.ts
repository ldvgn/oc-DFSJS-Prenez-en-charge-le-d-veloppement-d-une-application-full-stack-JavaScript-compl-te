"use server";

import z from "zod";
import { redirect } from "next/navigation";
import { authService } from "@/modules/auth/auth.service";
import { PostSchema, PostState } from "./post.definitions";
import { postService } from "./post.service";

/**
 * Creates a post, then redirects to it.
 *
 * @param formData - `topicId`, `title`, `content`
 * @returns The errors to display
 */
export async function createPostAction(
  _state: PostState,
  formData: FormData,
): Promise<PostState> {
  const user = await authService.requireUser();

  const validatedFields = PostSchema.safeParse({
    topicId: formData.get("topicId"),
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  let post;
  try {
    post = await postService.create(validatedFields.data, user.id);
  } catch {
    return { message: "Impossible de créer l'article." };
  }

  redirect(`/posts/${post.id}`);
}
