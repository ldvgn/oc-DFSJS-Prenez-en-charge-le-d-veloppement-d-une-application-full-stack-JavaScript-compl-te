import { test, expect } from "@playwright/test";

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
