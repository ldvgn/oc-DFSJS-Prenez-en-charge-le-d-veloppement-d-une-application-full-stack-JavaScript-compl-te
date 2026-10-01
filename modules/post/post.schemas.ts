import z from "zod";
import type { Prisma } from "@/prisma/generated/prisma/client";

export const PostSchema = z.object({
  topicId: z.string().min(1, "Le thème est requis"),
  title: z
    .string()
    .trim()
    .min(1, "Le titre est requis")
    .max(100, "100 caractères maximum"),
  content: z
    .string()
    .trim()
    .min(5, "5 caractères minimum")
    .max(5000, "5000 caractères maximum"),
});

export type PostType = z.infer<typeof PostSchema>;

export type PostState =
  | {
      errors?: {
        topicId?: string[];
        title?: string[];
        content?: string[];
      };
      message?: string;
    }
  | undefined;

export type SortOrder = Prisma.SortOrder;

export type PostWithAuthor = Prisma.PostGetPayload<{
  include: {
    author: { select: { username: true } };
  };
}>;

export type PostDetail = Prisma.PostGetPayload<{
  include: {
    author: { select: { username: true } };
    topic: true;
    comments: { include: { author: { select: { username: true } } } };
  };
}>;
