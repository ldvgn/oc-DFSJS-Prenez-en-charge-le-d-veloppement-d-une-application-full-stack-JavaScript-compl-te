import { prisma } from "@/lib/prisma";
import { type Comment, Prisma } from "@/prisma/generated/prisma/client";

export class CommentRepository {
  /**
   * Inserts a comment in the database.
   *
   * @param data Comment fields, including postId and authorId
   * @returns The created comment
   */
  create(data: Prisma.CommentUncheckedCreateInput): Promise<Comment> {
    return prisma.comment.create({ data });
  }
}

export const commentRepository = new CommentRepository();
