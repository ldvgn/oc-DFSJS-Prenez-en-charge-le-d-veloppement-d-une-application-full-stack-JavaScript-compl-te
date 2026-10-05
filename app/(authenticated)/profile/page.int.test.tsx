import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { authService } from "@/modules/auth/auth.service";
import { topicService } from "@/modules/topic/topic.service";
import Page from "./page";

vi.mock("@/modules/auth/auth.service", () => ({
  authService: { requireUser: vi.fn() },
}));
vi.mock("@/modules/topic/topic.service", () => ({
  topicService: { getSubscribedByUser: vi.fn() },
}));
vi.mock("@/modules/user/user.actions", () => ({
  updateProfileAction: vi.fn(),
}));
vi.mock("@/modules/subscription/subscription.actions", () => ({
  unsubscribeAction: vi.fn(),
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

describe("Profile page", () => {
  it("shows the profile form and the subscribed topics", async () => {
    vi.mocked(authService.requireUser).mockResolvedValue(user);
    vi.mocked(topicService.getSubscribedByUser).mockResolvedValue([
      { id: "topic-1", name: "JavaScript", description: "Le langage du web" },
      { id: "topic-2", name: "Python", description: "Polyvalent et lisible" },
    ]);

    render(await Page());

    expect(topicService.getSubscribedByUser).toHaveBeenCalledWith("user-1");
    expect(
      screen.getByRole("heading", { name: "Profil utilisateur" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Nom d'utilisateur")).toHaveValue("alice");
    expect(screen.getByLabelText("Adresse e-mail")).toHaveValue(
      "alice@test.com",
    );
    expect(
      screen.getByRole("heading", { name: "Abonnements" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "JavaScript" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Python" })).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Se désabonner" }),
    ).toHaveLength(2);
  });

  it("shows a message when the user has no subscription", async () => {
    vi.mocked(authService.requireUser).mockResolvedValue(user);
    vi.mocked(topicService.getSubscribedByUser).mockResolvedValue([]);

    render(await Page());

    expect(
      screen.getByText("Aucun abonnement pour le moment."),
    ).toBeInTheDocument();
  });
});
