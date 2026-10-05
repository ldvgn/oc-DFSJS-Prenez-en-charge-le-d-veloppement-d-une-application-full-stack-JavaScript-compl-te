import { describe, it, expect, vi } from "vitest";
import { subscriptionService } from "./subscription.service";
import { subscriptionRepository } from "./subscription.repository";
import { topicRepository } from "@/modules/topic/topic.repository";

vi.mock("./subscription.repository");
vi.mock("@/modules/topic/topic.repository");

const topic = {
  id: "topic-1",
  name: "JavaScript",
  description: "Le langage du web",
};

describe("subscribe", () => {
  it("subscribes the user to the topic", async () => {
    const subscription = { id: "sub-1", userId: "user-1", topicId: "topic-1" };
    vi.mocked(topicRepository.findById).mockResolvedValue(topic);
    vi.mocked(subscriptionRepository.upsert).mockResolvedValue(subscription);

    const result = await subscriptionService.subscribe(
      { topicId: "topic-1" },
      "user-1",
    );

    expect(topicRepository.findById).toHaveBeenCalledWith("topic-1");
    expect(subscriptionRepository.upsert).toHaveBeenCalledWith(
      "user-1",
      "topic-1",
    );
    expect(result).toBe(subscription);
  });

  it("returns null when the topic does not exist", async () => {
    vi.mocked(topicRepository.findById).mockResolvedValue(null);

    const result = await subscriptionService.subscribe(
      { topicId: "unknown" },
      "user-1",
    );

    expect(subscriptionRepository.upsert).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it("rethrows repository errors", async () => {
    vi.mocked(topicRepository.findById).mockResolvedValue(topic);
    vi.mocked(subscriptionRepository.upsert).mockRejectedValue(
      new Error("DB down"),
    );

    await expect(
      subscriptionService.subscribe({ topicId: "topic-1" }, "user-1"),
    ).rejects.toThrow("DB down");
  });
});

describe("unsubscribe", () => {
  it("deletes the user's subscription to the topic", async () => {
    await subscriptionService.unsubscribe({ topicId: "topic-1" }, "user-1");

    expect(subscriptionRepository.delete).toHaveBeenCalledWith(
      "user-1",
      "topic-1",
    );
  });

  it("rethrows repository errors", async () => {
    vi.mocked(subscriptionRepository.delete).mockRejectedValue(
      new Error("DB down"),
    );

    await expect(
      subscriptionService.unsubscribe({ topicId: "topic-1" }, "user-1"),
    ).rejects.toThrow("DB down");
  });
});
