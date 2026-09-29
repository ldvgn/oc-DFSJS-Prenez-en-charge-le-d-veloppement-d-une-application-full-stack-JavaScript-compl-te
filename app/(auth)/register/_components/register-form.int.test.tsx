import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "@/app/(auth)/register/_components/register-form";
import { registerAction } from "@/modules/auth/auth.actions";

vi.mock("@/modules/auth/auth.actions", () => ({ registerAction: vi.fn() }));

describe("RegisterForm", () => {
  it("shows validation errors without calling the action", async () => {
    render(<RegisterForm />);

    await userEvent.click(screen.getByRole("button", { name: "S'inscrire" }));

    expect(
      await screen.findByText("Au moins 3 caractères"),
    ).toBeInTheDocument();
    expect(screen.getByText("Adresse e-mail invalide")).toBeInTheDocument();
    expect(screen.getByText("Au moins 8 caractères")).toBeInTheDocument();
    expect(registerAction).not.toHaveBeenCalled();
  });

  it("shows the error returned by the action", async () => {
    vi.mocked(registerAction).mockResolvedValueOnce({
      errors: { email: ["Cette adresse e-mail est déjà utilisée."] },
    });
    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText("Nom d'utilisateur"), "alice");
    await userEvent.type(
      screen.getByLabelText("Adresse e-mail"),
      "alice@mdd.dev",
    );
    await userEvent.type(screen.getByLabelText("Mot de passe"), "Password123!");
    await userEvent.click(screen.getByRole("button", { name: "S'inscrire" }));

    expect(registerAction).toHaveBeenCalledOnce();
    expect(
      await screen.findByText("Cette adresse e-mail est déjà utilisée."),
    ).toBeInTheDocument();
  });
});
