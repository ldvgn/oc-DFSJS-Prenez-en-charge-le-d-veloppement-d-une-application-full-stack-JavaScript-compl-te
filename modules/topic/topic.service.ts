import type { Topic } from "@/prisma/generated/prisma/client";
import { TopicRepository, topicRepository } from "./topic.repository";

export class TopicService {
  constructor(private readonly repository: TopicRepository = topicRepository) {}

  /**
   * Returns all topics sorted by name.
   *
   * @returns All topics.
   */
  async getAll(): Promise<Topic[]> {
    return this.repository.findAll();
  }
}

export const topicService = new TopicService();
