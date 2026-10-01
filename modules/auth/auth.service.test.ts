import { describe, it, expect, vi } from "vitest";
import { APIError } from "better-auth/api";
import { redirect } from "next/navigation";
import { authService } from "./auth.service";
import { auth } from "@/lib/auth";

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      signInEmail: vi.fn(),
      signInUsername: vi.fn(),
      signUpEmail: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
    },
  },
}));

vi.mock("next/navigation");

vi.mock("next/headers", () => ({
  headers: async () => new Headers(),
}));

describe("login", () => {
  it("logs in with email when the identifier contains an @", async () => {
    const result = await authService.login({
      identifier: "jean@test.com",
      password: "Password1!",
    });

    expect(result).toBe(true);
    expect(auth.api.signInEmail).toHaveBeenCalledWith({
      body: { email: "jean@test.com", password: "Password1!" },
    });
    expect(auth.api.signInUsername).not.toHaveBeenCalled();
  });

  it("logs in with username when the identifier has no @", async () => {
    const result = await authService.login({
      identifier: "jeandupont",
      password: "Password1!",
    });

    expect(result).toBe(true);
    expect(auth.api.signInUsername).toHaveBeenCalledWith({
      body: { username: "jeandupont", password: "Password1!" },
    });
    expect(auth.api.signInEmail).not.toHaveBeenCalled();
  });

  it("returns false when credentials are invalid", async () => {
    vi.mocked(auth.api.signInEmail).mockRejectedValue(
      new APIError("UNAUTHORIZED", { code: "INVALID_EMAIL_OR_PASSWORD" }),
    );

    const result = await authService.login({
      identifier: "jean@test.com",
      password: "MauvaisMdp1!",
    });

    expect(result).toBe(false);
  });

  it("rethrows technical errors", async () => {
    vi.mocked(auth.api.signInEmail).mockRejectedValue(
      new Error("Base de données indisponible"),
    );

    await expect(
      authService.login({
        identifier: "jean@test.com",
        password: "Password1!",
      }),
    ).rejects.toThrow("Base de données indisponible");
  });
});

describe("register", () => {
  it("returns true on successful registration", async () => {
    const result = await authService.register({
      username: "jeandupont",
      email: "jean@test.com",
      password: "Password1!",
    });

    expect(result).toBe(true);
    expect(auth.api.signUpEmail).toHaveBeenCalledWith({
      body: {
        name: "jeandupont",
        username: "jeandupont",
        email: "jean@test.com",
        password: "Password1!",
      },
    });
  });

  it("returns false when Better Auth refuses the sign up", async () => {
    vi.mocked(auth.api.signUpEmail).mockRejectedValue(
      new APIError("UNPROCESSABLE_ENTITY"),
    );

    const result = await authService.register({
      username: "jeandupont",
      email: "jean@test.com",
      password: "Password1!",
    });

    expect(result).toBe(false);
  });

  it("rethrows technical errors", async () => {
    vi.mocked(auth.api.signUpEmail).mockRejectedValue(
      new Error("Base de données indisponible"),
    );

    await expect(
      authService.register({
        username: "jeandupont",
        email: "jean@test.com",
        password: "Password1!",
      }),
    ).rejects.toThrow("Base de données indisponible");
  });
});

describe("logout", () => {
  it("calls signOut with the request headers", async () => {
    await authService.logout();

    expect(auth.api.signOut).toHaveBeenCalledWith({
      headers: expect.any(Headers),
    });
  });
});

describe("requireUser", () => {
  it("returns the user when logged in", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "1", name: "jeandupont" },
    } as never);

    const result = await authService.requireUser();

    expect(result).toEqual({ id: "1", name: "jeandupont" });
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects to /login when no one is logged in", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null);
    vi.mocked(redirect).mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });

    await expect(authService.requireUser()).rejects.toThrow("NEXT_REDIRECT");
    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
