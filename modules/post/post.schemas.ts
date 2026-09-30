import z from "zod";

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
    .min(5, "5 caractères minimum.")
    .max(5000, "5000 caractères maximum."),
});

export type PostType = z.infer<typeof PostSchema>;
