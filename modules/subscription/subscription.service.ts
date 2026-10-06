import type { Subscription } from "@/prisma/generated/prisma/client";
import {
  TopicRepository,
  topicRepository,
} from "@/modules/topic/topic.repository";
import {
  SubscriptionRepository,
  subscriptionRepository,
} from "./subscription.repository";
import type { SubscriptionType } from "./subscription.definitions";

export class SubscriptionService {
  constructor(
    private readonly repository: SubscriptionRepository = subscriptionRepository,
    private readonly topics: TopicRepository = topicRepository,
  ) {}

  /**
   * Subscribes a user to a topic.
   *
   * @param input - Subscription form data
   * @param userId - Subscriber ID
   * @returns The subscription, or `null` if the topic is not found
   */
  async subscribe(
    input: SubscriptionType,
    userId: string,
  ): Promise<Subscription | null> {
    const topic = await this.topics.findById(input.topicId);
    if (!topic) return null;

    return this.repository.upsert(userId, input.topicId);
  }

  /**
   * Unsubscribes a user from a topic.
   *
   * @param input - Subscription form data
   * @param userId - Subscriber ID
   */
  async unsubscribe(input: SubscriptionType, userId: string): Promise<void> {
    await this.repository.delete(userId, input.topicId);
  }
}

export const subscriptionService = new SubscriptionService();
