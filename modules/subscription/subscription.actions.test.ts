import { describe, it, expect, vi } from "vitest";
import { revalidatePath } from "next/cache";
import { subscribeAction } from "./subscription.actions";
import { subscriptionService } from "./subscription.service";
import { authService } from "@/modules/auth/auth.service";

vi.mock("./subscription.service");
vi.mock("next/cache");
vi.mock("@/modules/auth/auth.service");

const user = {
  id: "user-1",
  name: "alice",
  username: "alice",
  email: "alice@test.com",
  emailVerified: false,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

describe("subscribeAction", () => {
  it("requires a logged-in user", async () => {
    vi.mocked(authService.requireUser).mockRejectedValue(
      new Error("NEXT_REDIRECT"),
    );
    const formData = new FormData();
    formData.append("topicId", "topic-1");

    await expect(subscribeAction(undefined, formData)).rejects.toThrow(
      "NEXT_REDIRECT",
    );
    expect(subscriptionService.subscribe).not.toHaveBeenCalled();
  });

  it("returns an error when the topic ID is missing", async () => {
    vi.mocked(authService.requireUser).mockResolvedValue(user);
    const formData = new FormData();
    formData.append("topicId", "");

    const result = await subscribeAction(undefined, formData);

    expect(result).toEqual({ message: "Thème introuvable." });
    expect(subscriptionService.subscribe).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("returns an error when the topic does not exist", async () => {
    vi.mocked(authService.requireUser).mockResolvedValue(user);
    vi.mocked(subscriptionService.subscribe).mockResolvedValue(null);
    const formData = new FormData();
    formData.append("topicId", "unknown");

    const result = await subscribeAction(undefined, formData);

    expect(result).toEqual({ message: "Thème introuvable." });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("returns an error when the service fails", async () => {
    vi.mocked(authService.requireUser).mockResolvedValue(user);
    vi.mocked(subscriptionService.subscribe).mockRejectedValue(
      new Error("DB down"),
    );
    const formData = new FormData();
    formData.append("topicId", "topic-1");

    const result = await subscribeAction(undefined, formData);

    expect(result).toEqual({
      message: "Échec de l'abonnement. Réessayez plus tard.",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("subscribes the user and refreshes the topics page on success", async () => {
    vi.mocked(authService.requireUser).mockResolvedValue(user);
    vi.mocked(subscriptionService.subscribe).mockResolvedValue({
      id: "sub-1",
      userId: "user-1",
      topicId: "topic-1",
    });
    const formData = new FormData();
    formData.append("topicId", "topic-1");

    const result = await subscribeAction(undefined, formData);

    expect(subscriptionService.subscribe).toHaveBeenCalledWith(
      { topicId: "topic-1" },
      "user-1",
    );
    expect(revalidatePath).toHaveBeenCalledWith("/topics");
    expect(result).toBeUndefined();
  });
});
