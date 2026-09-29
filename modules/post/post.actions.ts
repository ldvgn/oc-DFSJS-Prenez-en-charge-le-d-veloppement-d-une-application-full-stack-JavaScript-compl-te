"use server";

import { redirect } from "next/navigation";
import { authService } from "@/modules/auth/auth.service";
import { createPostSchema } from "./post.schemas";
import { postService } from "./post.service";

export type CreatePostState = { error?: string } | undefined;

/**
 * Creates a post for the current user, then redirects to it.
 *
 * @param _prevState - Previous state returned by `useActionState` (not used)
 * @param formData - Form data (`topicId`, `title`, `content`)
 * @returns An error, or nothing (redirects to the post)
 */
export async function createPostAction(
  _prevState: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  const user = await authService.requireUser();

  const parsed = createPostSchema.safeParse({
    topicId: formData.get("topicId"),
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return { error: "Veuillez remplir tous les champs." };
  }

  let post;
  try {
    post = await postService.create(parsed.data, user.id);
  } catch {
    return { error: "Impossible de créer l'article." };
  }
  redirect(`/posts/${post.id}`);
}
