import { type Comment } from "@/prisma/generated/prisma/client";
import { CommentRepository, commentRepository } from "./comment.repository";
import { type CommentType } from "./comment.definitions";

export class CommentService {
  constructor(
    private readonly repository: CommentRepository = commentRepository,
  ) {}

  /**
   * Creates a comment on a post.
   *
   * @param input - Comment form data
   * @param postId - Post ID
   * @param authorId - Author ID
   * @returns The created comment
   */
  async create(
    input: CommentType,
    postId: string,
    authorId: string,
  ): Promise<Comment> {
    return this.repository.create({ ...input, postId, authorId });
  }
}

export const commentService = new CommentService();
