import { describe, it, expect, vi } from "vitest";
import { userRepository } from "./user.repository";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: { user: { findUnique: vi.fn() } },
}));

describe("findByUsername", () => {
  it("queries a user by username", async () => {
    const user = {
      id: "user-1",
      name: "alice",
      username: "alice",
      email: "alice@test.com",
      emailVerified: false,
      image: null,
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    };
    vi.mocked(prisma.user.findUnique).mockResolvedValue(user);

    const result = await userRepository.findByUsername("alice");

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: "alice" },
    });
    expect(result).toBe(user);
  });
});

describe("findByEmail", () => {
  it("queries a user by email", async () => {
    const user = {
      id: "user-1",
      name: "alice",
      username: "alice",
      email: "alice@test.com",
      emailVerified: false,
      image: null,
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    };
    vi.mocked(prisma.user.findUnique).mockResolvedValue(user);

    const result = await userRepository.findByEmail("alice@test.com");

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "alice@test.com" },
    });
    expect(result).toBe(user);
  });

  it("returns null when no user has this email", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const result = await userRepository.findByEmail("unknown@test.com");

    expect(result).toBeNull();
  });
});
