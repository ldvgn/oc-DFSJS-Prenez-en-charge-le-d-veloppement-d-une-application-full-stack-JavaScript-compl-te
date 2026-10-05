import { test, expect } from "./fixtures";

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

test("toggles the feed order by date", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail ou nom d'utilisateur").fill("alice");
  await page.getByLabel("Mot de passe").fill("Password123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/posts");

  await page.getByRole("button", { name: "Trier par date" }).click();
  await expect(page).toHaveURL("/posts?order=asc");
  await page.getByRole("button", { name: "Trier par date" }).click();

  await expect(page).toHaveURL("/posts?order=desc");
});

test("shows the field errors on an empty post", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail ou nom d'utilisateur").fill("alice");
  await page.getByLabel("Mot de passe").fill("Password123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/posts");

  await page.goto("/posts/new");
  await page.getByRole("button", { name: "Créer" }).click();

  await expect(page.getByText("Le thème est requis")).toBeVisible();
  await expect(page.getByText("Le titre est requis")).toBeVisible();
  await expect(page.getByText("5 caractères minimum")).toBeVisible();
  await expect(page).toHaveURL("/posts/new");
});

test("adds a comment to a post", async ({ page }) => {
  const comment = `Commentaire ${crypto.randomUUID().slice(0, 8)}`;
  await page.goto("/login");
  await page.getByLabel("E-mail ou nom d'utilisateur").fill("alice");
  await page.getByLabel("Mot de passe").fill("Password123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/posts");

  await page
    .getByRole("link", { name: "Bien démarrer avec TypeScript" })
    .click();
  await page.getByLabel("Commentaire", { exact: true }).fill(comment);
  await page.getByRole("button", { name: "Envoyer le commentaire" }).click();

  await expect(page.getByText(comment)).toBeVisible();
  await expect(page.getByLabel("Commentaire", { exact: true })).toHaveValue("");
});

test("shows an error on a too short comment", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail ou nom d'utilisateur").fill("alice");
  await page.getByLabel("Mot de passe").fill("Password123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/posts");

  await page
    .getByRole("link", { name: "Bien démarrer avec TypeScript" })
    .click();
  await page.getByLabel("Commentaire", { exact: true }).fill("abc");
  await page.getByRole("button", { name: "Envoyer le commentaire" }).click();

  await expect(page.getByText("5 caractères minimum")).toBeVisible();
});

test("navigates with the mobile menu", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login");
  await page.getByLabel("E-mail ou nom d'utilisateur").fill("alice");
  await page.getByLabel("Mot de passe").fill("Password123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/posts");

  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  await page.getByRole("link", { name: "Thèmes" }).click();

  await expect(page).toHaveURL("/topics");
  await expect(page.getByRole("link", { name: "Thèmes" })).toHaveCount(0);
});
