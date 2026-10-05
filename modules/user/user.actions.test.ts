import { describe, it, expect, vi } from "vitest";
import { revalidatePath } from "next/cache";
import { updateProfileAction } from "./user.actions";
import { userService } from "./user.service";
import { authService } from "@/modules/auth/auth.service";

vi.mock("./user.service");
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

describe("updateProfileAction", () => {
  it("requires a logged-in user", async () => {
    vi.mocked(authService.requireUser).mockRejectedValue(
      new Error("NEXT_REDIRECT"),
    );
    const formData = new FormData();
    formData.append("username", "alice2");
    formData.append("email", "alice@test.com");
    formData.append("currentPassword", "");
    formData.append("newPassword", "");

    await expect(updateProfileAction(undefined, formData)).rejects.toThrow(
      "NEXT_REDIRECT",
    );
    expect(userService.updateProfile).not.toHaveBeenCalled();
  });

  it("returns field errors when the data is invalid", async () => {
    vi.mocked(authService.requireUser).mockResolvedValue(user);
    const formData = new FormData();
    formData.append("username", "al");
    formData.append("email", "not-an-email");
    formData.append("currentPassword", "Password123!");
    formData.append("newPassword", "short");

    const result = await updateProfileAction(undefined, formData);

    expect(result).toEqual({
      errors: {
        username: ["Au moins 3 caractères"],
        email: ["Adresse e-mail invalide"],
        newPassword: [
          "Au moins 8 caractères",
          "Au moins un chiffre",
          "Au moins une lettre majuscule",
          "Au moins un caractère spécial",
        ],
      },
    });
    expect(userService.updateProfile).not.toHaveBeenCalled();
  });

  it("returns an error when a new password is given without the current one", async () => {
    vi.mocked(authService.requireUser).mockResolvedValue(user);
    const formData = new FormData();
    formData.append("username", "alice");
    formData.append("email", "alice@test.com");
    formData.append("currentPassword", "");
    formData.append("newPassword", "NewPassword1!");

    const result = await updateProfileAction(undefined, formData);

    expect(result).toEqual({
      errors: { currentPassword: ["Le mot de passe actuel est requis"] },
    });
    expect(userService.updateProfile).not.toHaveBeenCalled();
  });

  it("returns an error when the username or email is taken", async () => {
    vi.mocked(authService.requireUser).mockResolvedValue(user);
    vi.mocked(userService.updateProfile).mockResolvedValue("TAKEN");
    const formData = new FormData();
    formData.append("username", "bob");
    formData.append("email", "alice@test.com");
    formData.append("currentPassword", "");
    formData.append("newPassword", "");

    const result = await updateProfileAction(undefined, formData);

    expect(result).toEqual({
      message: "Ce nom d'utilisateur ou cette adresse e-mail est déjà utilisé.",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("returns an error when the current password is wrong", async () => {
    vi.mocked(authService.requireUser).mockResolvedValue(user);
    vi.mocked(userService.updateProfile).mockResolvedValue("INVALID_PASSWORD");
    const formData = new FormData();
    formData.append("username", "alice");
    formData.append("email", "alice@test.com");
    formData.append("currentPassword", "WrongPassword1!");
    formData.append("newPassword", "NewPassword1!");

    const result = await updateProfileAction(undefined, formData);

    expect(result).toEqual({ message: "Mot de passe actuel incorrect." });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("returns an error when the service fails", async () => {
    vi.mocked(authService.requireUser).mockResolvedValue(user);
    vi.mocked(userService.updateProfile).mockRejectedValue(
      new Error("DB down"),
    );
    const formData = new FormData();
    formData.append("username", "alice2");
    formData.append("email", "alice@test.com");
    formData.append("currentPassword", "");
    formData.append("newPassword", "");

    const result = await updateProfileAction(undefined, formData);

    expect(result).toEqual({
      message: "Échec de la mise à jour du profil. Réessayez plus tard.",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("updates the profile and refreshes the profile page on success", async () => {
    vi.mocked(authService.requireUser).mockResolvedValue(user);
    vi.mocked(userService.updateProfile).mockResolvedValue(null);
    const formData = new FormData();
    formData.append("username", "alice2");
    formData.append("email", "alice2@test.com");
    formData.append("currentPassword", "Password123!");
    formData.append("newPassword", "NewPassword1!");

    const result = await updateProfileAction(undefined, formData);

    expect(userService.updateProfile).toHaveBeenCalledWith(
      {
        username: "alice2",
        email: "alice2@test.com",
        currentPassword: "Password123!",
        newPassword: "NewPassword1!",
      },
      user,
    );
    expect(revalidatePath).toHaveBeenCalledWith("/profile");
    expect(result).toEqual({ success: true });
  });
});
