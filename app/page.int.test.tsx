import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Page from "./page";

vi.mock("next/headers", () => ({ headers: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/auth", () => ({ auth: { api: { getSession: vi.fn() } } }));

describe("Home page", () => {
  it("shows login and register buttons", async () => {
    render(await Page());

    expect(
      screen.getByRole("button", { name: "Se connecter" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "S'inscrire" }),
    ).toBeInTheDocument();
  });

  it("redirects a logged-in user to /posts", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({} as never);

    await Page();

    expect(redirect).toHaveBeenCalledWith("/posts");
  });
});
