import { test, expect } from "@playwright/test";

test("shows only the posts of the subscribed topics", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail ou nom d'utilisateur").fill("alice");
  await page.getByLabel("Mot de passe").fill("Password123!");
  await page.getByRole("button", { name: "Se connecter" }).click();

  await expect(page).toHaveURL("/posts");

  await expect(page.getByText("Bien démarrer avec TypeScript")).toBeVisible();
  await expect(
    page.getByText("Les compréhensions de liste en Python"),
  ).toHaveCount(0);
});

test("invites a user without subscriptions to follow topics", async ({
  page,
}) => {
  const id = crypto.randomUUID().slice(0, 8);
  await page.goto("/register");
  await page.getByLabel("Nom d'utilisateur").fill(`user${id}`);
  await page.getByLabel("Adresse e-mail").fill(`user${id}@mdd.test`);
  await page.getByLabel("Mot de passe").fill("Password123!");
  await page.getByRole("button", { name: "S'inscrire" }).click();

  await expect(page).toHaveURL("/posts");

  await expect(
    page.getByRole("link", { name: "Abonnez-vous à des thèmes" }),
  ).toBeVisible();
});
