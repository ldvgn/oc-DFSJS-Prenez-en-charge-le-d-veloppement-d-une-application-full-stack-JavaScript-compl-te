import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { authService } from "@/modules/auth/auth.service";
import { topicService } from "@/modules/topic/topic.service";
import Page from "./page";

vi.mock("@/modules/auth/auth.service", () => ({
  authService: { requireUser: vi.fn() },
}));
vi.mock("@/modules/topic/topic.service", () => ({
  topicService: { getAllWithUserSubscription: vi.fn() },
}));
vi.mock("@/modules/subscription/subscription.actions", () => ({
  subscribeAction: vi.fn(),
}));

const user = {
  id: "user-1",
  name: "alice",
  username: "alice",
  email: "alice@test.com",
  emailVerified: false,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

describe("Topics page", () => {
  it("lists the topics with a button matching the user's subscription", async () => {
    vi.mocked(authService.requireUser).mockResolvedValue(user);
    vi.mocked(topicService.getAllWithUserSubscription).mockResolvedValue([
      {
        id: "topic-1",
        name: "JavaScript",
        description: "Le langage du web",
        subscriptions: [{ id: "sub-1" }],
      },
      {
        id: "topic-2",
        name: "Python",
        description: "Polyvalent et lisible",
        subscriptions: [],
      },
    ]);

    render(await Page());

    expect(topicService.getAllWithUserSubscription).toHaveBeenCalledWith(
      "user-1",
    );
    expect(
      screen.getByRole("heading", { name: "JavaScript" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Déjà abonné" })).toBeDisabled();
    expect(screen.getByRole("heading", { name: "Python" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "S'abonner" })).toBeEnabled();
  });

  it("shows a message when there is no topic", async () => {
    vi.mocked(authService.requireUser).mockResolvedValue(user);
    vi.mocked(topicService.getAllWithUserSubscription).mockResolvedValue([]);

    render(await Page());

    expect(screen.getByText("Aucun thème pour le moment.")).toBeInTheDocument();
  });
});
