import { test, expect } from "./fixtures";

test("logs in with a seeded user", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("E-mail ou nom d'utilisateur").fill("alice");
  await page.getByLabel("Mot de passe").fill("Password123!");
  await page.getByRole("button", { name: "Se connecter" }).click();

  await expect(page).toHaveURL("/posts");
});

test("registers a new user", async ({ page }) => {
  const id = crypto.randomUUID().slice(0, 8);
  await page.goto("/register");

  await page.getByLabel("Nom d'utilisateur").fill(`user${id}`);
  await page.getByLabel("Adresse e-mail").fill(`user${id}@mdd.test`);
  await page.getByLabel("Mot de passe").fill("Password123!");
  await page.getByRole("button", { name: "S'inscrire" }).click();

  await expect(page).toHaveURL("/posts");
});

test("redirects an anonymous visitor from a protected route", async ({
  page,
}) => {
  await page.goto("/posts");

  await expect(page).toHaveURL("/login");
});

test("shows the required field errors on an empty login", async ({ page }) => {
  await page.goto("/login");

  await page.getByRole("button", { name: "Se connecter" }).click();

  await expect(
    page.getByText("L'e-mail ou le nom d'utilisateur est requis"),
  ).toBeVisible();
  await expect(page.getByText("Le mot de passe est requis")).toBeVisible();
});

test("shows an error with wrong credentials", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("E-mail ou nom d'utilisateur").fill("alice");
  await page.getByLabel("Mot de passe").fill("WrongPassword1!");
  await page.getByRole("button", { name: "Se connecter" }).click();

  await expect(page.getByText("Identifiants incorrects.")).toBeVisible();
  await expect(page).toHaveURL("/login");
});

test("shows the field errors on an invalid registration", async ({ page }) => {
  await page.goto("/register");

  await page.getByLabel("Nom d'utilisateur").fill("a");
  await page.getByLabel("Adresse e-mail").fill("user@mdd");
  await page.getByLabel("Mot de passe").fill("short");
  await page.getByRole("button", { name: "S'inscrire" }).click();

  await expect(page.getByText("Au moins 3 caractères")).toBeVisible();
  await expect(page.getByText("Adresse e-mail invalide")).toBeVisible();
  await expect(page.getByText("Au moins 8 caractères")).toBeVisible();
  await expect(page).toHaveURL("/register");
});

test("shows an error when the username is already taken", async ({ page }) => {
  const id = crypto.randomUUID().slice(0, 8);
  await page.goto("/register");

  await page.getByLabel("Nom d'utilisateur").fill("alice");
  await page.getByLabel("Adresse e-mail").fill(`user${id}@mdd.test`);
  await page.getByLabel("Mot de passe").fill("Password123!");
  await page.getByRole("button", { name: "S'inscrire" }).click();

  await expect(
    page.getByText(
      "Ce nom d'utilisateur ou cette adresse e-mail est déjà utilisé.",
    ),
  ).toBeVisible();
});
