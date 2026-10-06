import { prisma } from "@/lib/prisma";
import type { Topic } from "@/prisma/generated/prisma/client";
import type { TopicWithSubscriptions } from "./topic.definitions";

export class TopicRepository {
  /**
   * Returns all topics sorted by name.
   *
   * @returns All topics
   */
  async findAll(): Promise<Topic[]> {
    return prisma.topic.findMany({ orderBy: { name: "asc" } });
  }

  /**
   * Returns a single topic.
   *
   * @param id - Topic ID
   * @returns The topic, or `null` if not found
   */
  async findById(id: string): Promise<Topic | null> {
    return prisma.topic.findUnique({ where: { id } });
  }

  /**
   * Returns all topics sorted by name with the user's subscription.
   *
   * @param userId - Subscriber ID
   * @returns The topics with the user's subscription, if any
   */
  async findAllWithSubscriptions(
    userId: string,
  ): Promise<TopicWithSubscriptions[]> {
    return prisma.topic.findMany({
      include: {
        subscriptions: { where: { userId }, select: { id: true } },
      },
      orderBy: { name: "asc" },
    });
  }

  /**
   * Returns the topics the user subscribes to, sorted by name.
   *
   * @param userId - Subscriber ID
   * @returns The subscribed topics
   */
  async findSubscribedByUser(userId: string): Promise<Topic[]> {
    return prisma.topic.findMany({
      where: { subscriptions: { some: { userId } } },
      orderBy: { name: "asc" },
    });
  }
}

export const topicRepository = new TopicRepository();
