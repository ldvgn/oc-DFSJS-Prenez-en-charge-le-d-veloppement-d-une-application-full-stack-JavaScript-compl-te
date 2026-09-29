import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/app/(auth)/login/_components/login-form";
import { loginAction } from "@/modules/auth/auth.actions";

vi.mock("@/modules/auth/auth.actions", () => ({ loginAction: vi.fn() }));

describe("LoginForm", () => {
  it("shows validation errors without calling the action", async () => {
    render(<LoginForm />);

    await userEvent.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(
      await screen.findByText("L'e-mail ou le nom d'utilisateur est requis"),
    ).toBeInTheDocument();
    expect(loginAction).not.toHaveBeenCalled();
  });

  it("shows the error returned by the action", async () => {
    vi.mocked(loginAction).mockResolvedValue({
      message: "Identifiants incorrects.",
    });
    render(<LoginForm />);

    await userEvent.type(
      screen.getByLabelText("E-mail ou nom d'utilisateur"),
      "alice",
    );
    await userEvent.type(screen.getByLabelText("Mot de passe"), "bad");
    await userEvent.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(loginAction).toHaveBeenCalledOnce();
    expect(
      await screen.findByText("Identifiants incorrects."),
    ).toBeInTheDocument();
  });
});
