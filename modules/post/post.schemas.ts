import { z } from "zod";

export const createPostSchema = z.object({
  topicId: z.string().min(1, "Le thème est requis"),
  title: z
    .string()
    .trim()
    .min(1, "Le titre est requis")
    .max(100, "100 caractères maximum"),
  content: z.string().trim().min(1, "Le contenu est requis"),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
