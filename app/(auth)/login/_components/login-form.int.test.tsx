import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/app/(auth)/login/_components/login-form";

const action = vi.fn();

describe("LoginForm", () => {
  it("shows validation errors without calling the action", async () => {
    render(<LoginForm action={action} />);

    await userEvent.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(
      await screen.findByText("L'e-mail ou le nom d'utilisateur est requis"),
    ).toBeInTheDocument();
    expect(action).not.toHaveBeenCalled();
  });

  it("shows the error returned by the action", async () => {
    action.mockResolvedValue({ error: "Identifiants incorrects." });
    render(<LoginForm action={action} />);

    await userEvent.type(
      screen.getByLabelText("E-mail ou nom d'utilisateur"),
      "alice",
    );
    await userEvent.type(screen.getByLabelText("Mot de passe"), "bad");
    await userEvent.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(action).toHaveBeenCalledOnce();
    expect(
      await screen.findByText("Identifiants incorrects."),
    ).toBeInTheDocument();
  });
});
