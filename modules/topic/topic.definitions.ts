import type { Prisma } from "@/prisma/generated/prisma/client";

export type TopicWithSubscriptions = Prisma.TopicGetPayload<{
  include: { subscriptions: { select: { id: true } } };
}>;
