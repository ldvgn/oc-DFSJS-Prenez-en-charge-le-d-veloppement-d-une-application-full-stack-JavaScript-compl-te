import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "@/app/(auth)/register/_components/register-form";

const action = vi.fn();

describe("RegisterForm", () => {
  it("shows validation errors without calling the action", async () => {
    render(<RegisterForm action={action} />);

    await userEvent.click(screen.getByRole("button", { name: "S'inscrire" }));

    expect(
      await screen.findByText("Au moins 3 caractères"),
    ).toBeInTheDocument();
    expect(screen.getByText("Adresse e-mail invalide")).toBeInTheDocument();
    expect(screen.getByText("Au moins 8 caractères")).toBeInTheDocument();
    expect(action).not.toHaveBeenCalled();
  });

  it("shows the error returned by the action", async () => {
    action.mockResolvedValueOnce({
      error: "Cette adresse e-mail est déjà utilisée.",
    });
    render(<RegisterForm action={action} />);

    await userEvent.type(screen.getByLabelText("Nom d'utilisateur"), "alice");
    await userEvent.type(
      screen.getByLabelText("Adresse e-mail"),
      "alice@mdd.dev",
    );
    await userEvent.type(screen.getByLabelText("Mot de passe"), "Password123!");
    await userEvent.click(screen.getByRole("button", { name: "S'inscrire" }));

    expect(action).toHaveBeenCalledOnce();
    expect(
      await screen.findByText("Cette adresse e-mail est déjà utilisée."),
    ).toBeInTheDocument();
  });
});
