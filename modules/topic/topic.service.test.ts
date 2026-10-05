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

describe("getAllWithUserSubscription", () => {
  it("returns all topics with the user's subscription", async () => {
    const topics = [
      {
        id: "topic-1",
        name: "JavaScript",
        description: "Le langage du web",
        subscriptions: [{ id: "sub-1" }],
      },
    ];
    vi.mocked(topicRepository.findAllWithSubscriptions).mockResolvedValue(
      topics,
    );

    const result = await topicService.getAllWithUserSubscription("user-1");

    expect(topicRepository.findAllWithSubscriptions).toHaveBeenCalledWith(
      "user-1",
    );
    expect(result).toBe(topics);
  });

  it("rethrows repository errors", async () => {
    vi.mocked(topicRepository.findAllWithSubscriptions).mockRejectedValue(
      new Error("DB down"),
    );

    await expect(
      topicService.getAllWithUserSubscription("user-1"),
    ).rejects.toThrow("DB down");
  });
});

describe("getSubscribedByUser", () => {
  it("returns the topics the user subscribes to", async () => {
    const topics = [
      { id: "topic-1", name: "JavaScript", description: "Le langage du web" },
    ];
    vi.mocked(topicRepository.findSubscribedByUser).mockResolvedValue(topics);

    const result = await topicService.getSubscribedByUser("user-1");

    expect(topicRepository.findSubscribedByUser).toHaveBeenCalledWith("user-1");
    expect(result).toBe(topics);
  });

  it("rethrows repository errors", async () => {
    vi.mocked(topicRepository.findSubscribedByUser).mockRejectedValue(
      new Error("DB down"),
    );

    await expect(topicService.getSubscribedByUser("user-1")).rejects.toThrow(
      "DB down",
    );
  });
});
