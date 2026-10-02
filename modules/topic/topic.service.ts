import type { Topic } from "@/prisma/generated/prisma/client";
import { TopicRepository, topicRepository } from "./topic.repository";
import type { TopicWithSubscriptions } from "./topic.schemas";

export class TopicService {
  constructor(private readonly repository: TopicRepository = topicRepository) {}

  /**
   * Returns all topics sorted by name.
   *
   * @returns All topics
   */
  async getAll(): Promise<Topic[]> {
    return this.repository.findAll();
  }

  /**
   * Returns all topics sorted by name with the user's subscription.
   *
   * @param userId - Subscriber ID
   * @returns The topics with the user's subscription, if any
   */
  async getAllWithUserSubscription(
    userId: string,
  ): Promise<TopicWithSubscriptions[]> {
    return this.repository.findAllWithSubscriptions(userId);
  }
}

export const topicService = new TopicService();
