import { describe, it, expect, vi } from "vitest";
import { APIError } from "better-auth/api";
import { userService } from "./user.service";
import { userRepository } from "./user.repository";
import { auth } from "@/lib/auth";

vi.mock("./user.repository");

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      changePassword: vi.fn(),
      updateUser: vi.fn(),
      changeEmail: vi.fn(),
    },
  },
}));

vi.mock("next/headers", () => ({
  headers: async () => new Headers(),
}));

const currentUser = { username: "alice", email: "alice@test.com" };

const otherUser = {
  id: "user-2",
  name: "bob",
  username: "bob",
  email: "bob@test.com",
  emailVerified: false,
  image: null,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

describe("updateProfile", () => {
  it("does nothing when no field changed", async () => {
    const result = await userService.updateProfile(
      {
        username: "alice",
        email: "alice@test.com",
        currentPassword: "",
        newPassword: "",
      },
      currentUser,
    );

    expect(result).toBeNull();
    expect(userRepository.findByUsername).not.toHaveBeenCalled();
    expect(userRepository.findByEmail).not.toHaveBeenCalled();
    expect(auth.api.changePassword).not.toHaveBeenCalled();
    expect(auth.api.updateUser).not.toHaveBeenCalled();
    expect(auth.api.changeEmail).not.toHaveBeenCalled();
  });

  it("updates the username, email and password", async () => {
    vi.mocked(userRepository.findByUsername).mockResolvedValue(null);
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

    const result = await userService.updateProfile(
      {
        username: "alice2",
        email: "alice2@test.com",
        currentPassword: "Password123!",
        newPassword: "NewPassword1!",
      },
      currentUser,
    );

    expect(result).toBeNull();
    expect(userRepository.findByUsername).toHaveBeenCalledWith("alice2");
    expect(userRepository.findByEmail).toHaveBeenCalledWith("alice2@test.com");
    expect(auth.api.changePassword).toHaveBeenCalledWith({
      body: { currentPassword: "Password123!", newPassword: "NewPassword1!" },
      headers: expect.any(Headers),
    });
    expect(auth.api.updateUser).toHaveBeenCalledWith({
      body: { name: "alice2", username: "alice2" },
      headers: expect.any(Headers),
    });
    expect(auth.api.changeEmail).toHaveBeenCalledWith({
      body: { newEmail: "alice2@test.com" },
      headers: expect.any(Headers),
    });
  });

  it("does not update the username or email when only their case differs", async () => {
    const result = await userService.updateProfile(
      {
        username: "Alice",
        email: "Alice@test.com",
        currentPassword: "",
        newPassword: "",
      },
      currentUser,
    );

    expect(result).toBeNull();
    expect(auth.api.updateUser).not.toHaveBeenCalled();
    expect(auth.api.changeEmail).not.toHaveBeenCalled();
  });

  it("returns TAKEN without updating when the email is already used", async () => {
    vi.mocked(userRepository.findByUsername).mockResolvedValue(null);
    vi.mocked(userRepository.findByEmail).mockResolvedValue(otherUser);

    const result = await userService.updateProfile(
      {
        username: "alice2",
        email: "Bob@test.com",
        currentPassword: "Password123!",
        newPassword: "NewPassword1!",
      },
      currentUser,
    );

    expect(result).toBe("TAKEN");
    expect(userRepository.findByEmail).toHaveBeenCalledWith("bob@test.com");
    expect(auth.api.changePassword).not.toHaveBeenCalled();
    expect(auth.api.updateUser).not.toHaveBeenCalled();
    expect(auth.api.changeEmail).not.toHaveBeenCalled();
  });

  it("returns INVALID_PASSWORD when Better Auth refuses the current password", async () => {
    vi.mocked(userRepository.findByUsername).mockResolvedValue(null);
    vi.mocked(auth.api.changePassword).mockRejectedValue(
      new APIError("BAD_REQUEST", { code: "INVALID_PASSWORD" }),
    );

    const result = await userService.updateProfile(
      {
        username: "alice2",
        email: "alice@test.com",
        currentPassword: "WrongPassword1!",
        newPassword: "NewPassword1!",
      },
      currentUser,
    );

    expect(result).toBe("INVALID_PASSWORD");
    expect(auth.api.updateUser).not.toHaveBeenCalled();
  });

  it("returns TAKEN without updating when the username is already used", async () => {
    vi.mocked(userRepository.findByUsername).mockResolvedValue(otherUser);

    const result = await userService.updateProfile(
      {
        username: "Bob",
        email: "alice@test.com",
        currentPassword: "Password123!",
        newPassword: "NewPassword1!",
      },
      currentUser,
    );

    expect(result).toBe("TAKEN");
    expect(userRepository.findByUsername).toHaveBeenCalledWith("bob");
    expect(auth.api.changePassword).not.toHaveBeenCalled();
    expect(auth.api.updateUser).not.toHaveBeenCalled();
  });

  it("rethrows unexpected errors", async () => {
    vi.mocked(userRepository.findByUsername).mockResolvedValue(null);
    vi.mocked(auth.api.updateUser).mockRejectedValue(new Error("DB down"));

    await expect(
      userService.updateProfile(
        {
          username: "alice2",
          email: "alice@test.com",
          currentPassword: "",
          newPassword: "",
        },
        currentUser,
      ),
    ).rejects.toThrow("DB down");
  });
});
