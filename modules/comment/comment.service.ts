import { commentRepository } from "./comment.repository";
import type { CommentType } from "./comment.schemas";

export const commentService = {
  /**
   * Creates a comment on a post.
   *
   * @param data Validated comment content
   * @param postId Id of the commented post
   * @param authorId Id of the comment author
   * @returns The created comment
   */
  create: (data: CommentType, postId: string, authorId: string) =>
    commentRepository.create({ ...data, postId, authorId }),
};
