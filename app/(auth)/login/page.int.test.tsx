import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Login from "./page";

vi.mock("next/headers", () => ({ headers: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/auth", () => ({ auth: { api: { getSession: vi.fn() } } }));

describe("Login page", () => {
  it("renders the header and the login form", async () => {
    render(await Login());

    expect(
      screen.getByRole("heading", { name: "Se connecter" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Se connecter" }),
    ).toBeInTheDocument();
  });

  it("redirects a logged-in user to /posts", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({} as never);

    await Login();

    expect(redirect).toHaveBeenCalledWith("/posts");
  });
});
