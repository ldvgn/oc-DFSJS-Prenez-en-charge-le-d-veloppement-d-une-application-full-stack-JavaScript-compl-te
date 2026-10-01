import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Register from "./page";

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

describe("Register page", () => {
  it("renders the header and the register form", async () => {
    render(await Register());

    expect(
      screen.getByRole("heading", { name: "Inscription" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "S'inscrire" }),
    ).toBeInTheDocument();
  });

  it("redirects a logged-in user to /posts", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(session);

    await Register();

    expect(redirect).toHaveBeenCalledWith("/posts");
  });
});
