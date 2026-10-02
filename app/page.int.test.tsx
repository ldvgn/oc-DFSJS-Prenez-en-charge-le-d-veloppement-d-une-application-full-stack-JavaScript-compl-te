import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Page from "./page";

vi.mock("next/headers", () => ({ headers: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/auth", () => ({ auth: { api: { getSession: vi.fn() } } }));

const session = {
  session: {
    id: "session-1",
    userId: "user-1",
    token: "token-1",
    expiresAt: new Date("2026-02-01"),
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  user: {
    id: "user-1",
    name: "alice",
    username: "alice",
    email: "alice@test.com",
    emailVerified: false,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
};

describe("Home page", () => {
  it("shows login and register links", async () => {
    render(await Page());

    expect(screen.getByRole("link", { name: "Se connecter" })).toHaveAttribute(
      "href",
      "/login",
    );
    expect(screen.getByRole("link", { name: "S'inscrire" })).toHaveAttribute(
      "href",
      "/register",
    );
  });

  it("redirects a logged-in user to /posts", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(session);

    await Page();

    expect(redirect).toHaveBeenCalledWith("/posts");
  });
});
