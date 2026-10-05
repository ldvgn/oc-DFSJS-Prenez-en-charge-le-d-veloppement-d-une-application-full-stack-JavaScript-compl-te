import { prisma } from "@/lib/prisma";
import type { Subscription } from "@/prisma/generated/prisma/client";

export class SubscriptionRepository {
  /**
   * Creates a subscription, or returns it if it already exists.
   *
   * @param userId - Subscriber ID
   * @param topicId - Topic ID
   * @returns The subscription
   */
  async upsert(userId: string, topicId: string): Promise<Subscription> {
    return prisma.subscription.upsert({
      where: { userId_topicId: { userId, topicId } },
      create: { userId, topicId },
      update: {},
    });
  }

  /**
   * Deletes a subscription, if it exists.
   *
   * @param userId - Subscriber ID
   * @param topicId - Topic ID
   */
  async delete(userId: string, topicId: string): Promise<void> {
    await prisma.subscription.deleteMany({ where: { userId, topicId } });
  }
}

export const subscriptionRepository = new SubscriptionRepository();
