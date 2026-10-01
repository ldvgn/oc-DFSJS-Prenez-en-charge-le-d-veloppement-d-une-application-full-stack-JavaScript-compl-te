import { prisma } from "@/lib/prisma";
import type { Topic } from "@/prisma/generated/prisma/client";

export class TopicRepository {
  /**
   * Returns all topics sorted by name.
   *
   * @returns All topics
   */
  async findAll(): Promise<Topic[]> {
    return prisma.topic.findMany({ orderBy: { name: "asc" } });
  }
}

export const topicRepository = new TopicRepository();
