import { describe, it, expect, vi } from "vitest";
import { topicService } from "./topic.service";
import { topicRepository } from "./topic.repository";

vi.mock("./topic.repository");

describe("getAll", () => {
  it("returns all topics", async () => {
    const topics = [
      { id: "topic-1", name: "JavaScript", description: "Le langage du web" },
      { id: "topic-2", name: "TypeScript", description: "Le JS typé" },
    ];
    vi.mocked(topicRepository.findAll).mockResolvedValue(topics);

    const result = await topicService.getAll();

    expect(topicRepository.findAll).toHaveBeenCalled();
    expect(result).toBe(topics);
  });

  it("rethrows repository errors", async () => {
    vi.mocked(topicRepository.findAll).mockRejectedValue(new Error("DB down"));

    await expect(topicService.getAll()).rejects.toThrow("DB down");
  });
});
