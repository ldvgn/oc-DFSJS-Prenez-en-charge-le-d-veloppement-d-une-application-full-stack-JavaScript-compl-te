import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfileForm from "./profile-form";
import { updateProfileAction } from "@/modules/user/user.actions";

vi.mock("@/modules/user/user.actions", () => ({
  updateProfileAction: vi.fn(),
}));

describe("ProfileForm", () => {
  it("prefills the username and email, with empty password fields", () => {
    render(<ProfileForm username="alice" email="alice@test.com" />);

    expect(screen.getByLabelText("Nom d'utilisateur")).toHaveValue("alice");
    expect(screen.getByLabelText("Adresse e-mail")).toHaveValue(
      "alice@test.com",
    );
    expect(screen.getByLabelText("Mot de passe actuel")).toHaveValue("");
    expect(screen.getByLabelText("Nouveau mot de passe")).toHaveValue("");
  });

  it("shows validation errors without calling the action", async () => {
    render(<ProfileForm username="alice" email="alice@test.com" />);

    await userEvent.clear(screen.getByLabelText("Nom d'utilisateur"));
    await userEvent.type(screen.getByLabelText("Nom d'utilisateur"), "al-ice");
    await userEvent.type(
      screen.getByLabelText("Nouveau mot de passe"),
      "NewPassword1!",
    );
    await userEvent.click(screen.getByRole("button", { name: "Sauvegarder" }));

    expect(
      await screen.findByText("Lettres, chiffres, _ et . uniquement"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Le mot de passe actuel est requis"),
    ).toBeInTheDocument();
    expect(updateProfileAction).not.toHaveBeenCalled();
  });

  it("shows the error returned by the action and keeps the fields", async () => {
    vi.mocked(updateProfileAction).mockResolvedValue({
      message: "Ce nom d'utilisateur ou cette adresse e-mail est déjà utilisé.",
    });
    render(<ProfileForm username="alice" email="alice@test.com" />);

    await userEvent.clear(screen.getByLabelText("Nom d'utilisateur"));
    await userEvent.type(screen.getByLabelText("Nom d'utilisateur"), "bob");
    await userEvent.click(screen.getByRole("button", { name: "Sauvegarder" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Ce nom d'utilisateur ou cette adresse e-mail est déjà utilisé.",
    );
    expect(screen.getByLabelText("Nom d'utilisateur")).toHaveValue("bob");
  });

  it("calls the action once with the form data on valid submission", async () => {
    vi.mocked(updateProfileAction).mockResolvedValue({ success: true });
    render(<ProfileForm username="alice" email="alice@test.com" />);

    await userEvent.clear(screen.getByLabelText("Adresse e-mail"));
    await userEvent.type(
      screen.getByLabelText("Adresse e-mail"),
      "alice2@test.com",
    );
    await userEvent.type(
      screen.getByLabelText("Mot de passe actuel"),
      "Password123!",
    );
    await userEvent.type(
      screen.getByLabelText("Nouveau mot de passe"),
      "NewPassword1!",
    );
    await userEvent.click(screen.getByRole("button", { name: "Sauvegarder" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Profil mis à jour.",
    );
    expect(updateProfileAction).toHaveBeenCalledOnce();
    const [, formData] = vi.mocked(updateProfileAction).mock.calls[0];
    expect(formData.get("username")).toBe("alice");
    expect(formData.get("email")).toBe("alice2@test.com");
    expect(formData.get("currentPassword")).toBe("Password123!");
    expect(formData.get("newPassword")).toBe("NewPassword1!");
  });

  it("clears the password fields after a successful update", async () => {
    vi.mocked(updateProfileAction).mockResolvedValue({ success: true });
    render(<ProfileForm username="alice" email="alice@test.com" />);

    await userEvent.type(
      screen.getByLabelText("Mot de passe actuel"),
      "Password123!",
    );
    await userEvent.type(
      screen.getByLabelText("Nouveau mot de passe"),
      "NewPassword1!",
    );
    await userEvent.click(screen.getByRole("button", { name: "Sauvegarder" }));

    expect(await screen.findByRole("status")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe actuel")).toHaveValue("");
    expect(screen.getByLabelText("Nouveau mot de passe")).toHaveValue("");
    expect(screen.getByLabelText("Nom d'utilisateur")).toHaveValue("alice");
  });

  it("submits again after a success without retyping the passwords", async () => {
    vi.mocked(updateProfileAction).mockResolvedValue({ success: true });
    render(<ProfileForm username="alice" email="alice@test.com" />);

    await userEvent.type(
      screen.getByLabelText("Mot de passe actuel"),
      "Password123!",
    );
    await userEvent.type(
      screen.getByLabelText("Nouveau mot de passe"),
      "NewPassword1!",
    );
    await userEvent.click(screen.getByRole("button", { name: "Sauvegarder" }));
    expect(await screen.findByRole("status")).toBeInTheDocument();
    await userEvent.clear(screen.getByLabelText("Nom d'utilisateur"));
    await userEvent.type(screen.getByLabelText("Nom d'utilisateur"), "alice2");
    await userEvent.click(screen.getByRole("button", { name: "Sauvegarder" }));

    await vi.waitFor(() =>
      expect(updateProfileAction).toHaveBeenCalledTimes(2),
    );
    const [, formData] = vi.mocked(updateProfileAction).mock.calls[1];
    expect(formData.get("username")).toBe("alice2");
    expect(formData.get("email")).toBe("alice@test.com");
    expect(formData.get("currentPassword")).toBe("");
    expect(formData.get("newPassword")).toBe("");
  });
});
