import z from "zod";

export const SubscriptionSchema = z.object({
  topicId: z.string().min(1),
});

export type SubscriptionType = z.infer<typeof SubscriptionSchema>;

export type SubscriptionState = { message?: string } | undefined;
