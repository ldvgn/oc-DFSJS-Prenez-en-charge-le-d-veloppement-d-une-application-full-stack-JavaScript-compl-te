import z from "zod";

export const CommentSchema = z.object({
  content: z.string().trim().min(5, "5 caractères minimum."),
});

export type CommentType = z.infer<typeof CommentSchema>;
