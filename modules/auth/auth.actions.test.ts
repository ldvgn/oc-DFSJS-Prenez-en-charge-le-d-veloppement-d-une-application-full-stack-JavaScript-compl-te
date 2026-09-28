import { describe, it, expect, vi } from "vitest";
import { loginAction, registerAction, logoutAction } from "./auth.actions";
import { redirect } from "next/navigation";
import { authService } from "./auth.service";

vi.mock("./auth.service");
vi.mock("next/navigation");

describe("loginAction", () => {
  it("returns an error when fields are empty", async () => {
    const formData = new FormData();
    formData.append("identifier", "");
    formData.append("password", "");

    const result = await loginAction(undefined, formData);

    expect(result).toEqual({ error: "Veuillez remplir tous les champs." });
    expect(authService.login).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("returns an error when credentials are invalid", async () => {
    vi.mocked(authService.login).mockResolvedValue(false);
    const formData = new FormData();
    formData.append("identifier", "jeandupont");
    formData.append("password", "MauvaisMdp1!");

    const result = await loginAction(undefined, formData);

    expect(result).toEqual({ error: "Identifiants incorrects." });
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects to /posts on successful login", async () => {
    vi.mocked(authService.login).mockResolvedValue(true);
    const formData = new FormData();
    formData.append("identifier", "jeandupont");
    formData.append("password", "Password1!");

    await loginAction(undefined, formData);

    expect(authService.login).toHaveBeenCalledWith({
      identifier: "jeandupont",
      password: "Password1!",
    });
    expect(redirect).toHaveBeenCalledWith("/posts");
  });
});

describe("registerAction", () => {
  it("returns an error when data is invalid", async () => {
    const formData = new FormData();
    formData.append("username", "jeandupont");
    formData.append("email", "pas-un-email");
    formData.append("password", "123");

    const result = await registerAction(undefined, formData);

    expect(result).toEqual({ error: "Données invalides." });
    expect(authService.register).not.toHaveBeenCalled();
  });

  it("returns an error when the username is taken", async () => {
    vi.mocked(authService.register).mockResolvedValue("USERNAME_TAKEN");
    const formData = new FormData();
    formData.append("username", "jeandupont");
    formData.append("email", "jean@test.com");
    formData.append("password", "Password1!");

    const result = await registerAction(undefined, formData);

    expect(result).toEqual({ error: "Ce nom d'utilisateur est déjà utilisé." });
  });

  it("returns an error when the email is taken", async () => {
    vi.mocked(authService.register).mockResolvedValue("EMAIL_TAKEN");
    const formData = new FormData();
    formData.append("username", "jeandupont");
    formData.append("email", "jean@test.com");
    formData.append("password", "Password1!");

    const result = await registerAction(undefined, formData);

    expect(result).toEqual({
      error: "Cette adresse e-mail est déjà utilisée.",
    });
  });

  it("returns a generic error for any other failure", async () => {
    vi.mocked(authService.register).mockResolvedValue("UNKNOWN");
    const formData = new FormData();
    formData.append("username", "jeandupont");
    formData.append("email", "jean@test.com");
    formData.append("password", "Password1!");

    const result = await registerAction(undefined, formData);

    expect(result).toEqual({
      error: "L'inscription a échoué. Veuillez réessayer.",
    });
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects to /posts on successful registration", async () => {
    vi.mocked(authService.register).mockResolvedValue(null);
    const formData = new FormData();
    formData.append("username", "jeandupont");
    formData.append("email", "jean@test.com");
    formData.append("password", "Password1!");

    await registerAction(undefined, formData);

    expect(authService.register).toHaveBeenCalledWith({
      username: "jeandupont",
      email: "jean@test.com",
      password: "Password1!",
    });
    expect(redirect).toHaveBeenCalledWith("/posts");
  });
});

describe("logoutAction", () => {
  it("logs the user out and redirects to /", async () => {
    await logoutAction();

    expect(authService.logout).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/");
  });
});
