import z from "zod";

export const CommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(5, "5 caractères minimum.")
    .max(5000, "5000 caractères maximum."),
});

export const CreateCommentSchema = CommentSchema.extend({
  postId: z.string().min(1),
});

export type CommentType = z.infer<typeof CommentSchema>;
