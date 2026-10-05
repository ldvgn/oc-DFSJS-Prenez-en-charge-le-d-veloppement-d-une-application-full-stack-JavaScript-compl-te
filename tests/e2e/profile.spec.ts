import { test, expect } from "./fixtures";

test("removes a topic from the profile once unsubscribed", async ({ page }) => {
  const id = crypto.randomUUID().slice(0, 8);

  // New user: no topic subscriptions yet
  await page.goto("/register");
  await page.getByLabel("Nom d'utilisateur").fill(`user${id}`);
  await page.getByLabel("Adresse e-mail").fill(`user${id}@mdd.test`);
  await page.getByLabel("Mot de passe").fill("Password123!");
  await page.getByRole("button", { name: "S'inscrire" }).click();
  await expect(page).toHaveURL("/posts");
  await page.goto("/topics");
  const python = page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: "Python" }) });
  await python.getByRole("button", { name: "S'abonner" }).click();
  await expect(
    python.getByRole("button", { name: "Déjà abonné" }),
  ).toBeDisabled();

  await page.goto("/profile");
  await expect(page.getByRole("heading", { name: "Python" })).toBeVisible();
  await page.getByRole("button", { name: "Se désabonner" }).click();

  await expect(page.getByRole("heading", { name: "Python" })).toHaveCount(0);
  await expect(
    page.getByText("Aucun abonnement pour le moment."),
  ).toBeVisible();
});

test("logs in with the new credentials after updating the profile", async ({
  page,
}) => {
  const id = crypto.randomUUID().slice(0, 8);

  await page.goto("/register");
  await page.getByLabel("Nom d'utilisateur").fill(`user${id}`);
  await page.getByLabel("Adresse e-mail").fill(`user${id}@mdd.test`);
  await page.getByLabel("Mot de passe").fill("Password123!");
  await page.getByRole("button", { name: "S'inscrire" }).click();
  await expect(page).toHaveURL("/posts");

  await page.goto("/profile");
  await expect(page.getByLabel("Nom d'utilisateur")).toHaveValue(`user${id}`);
  await page.getByLabel("Nom d'utilisateur").fill(`new${id}`);
  await page.getByLabel("Adresse e-mail").fill(`new${id}@mdd.test`);
  await page.getByLabel("Mot de passe actuel").fill("Password123!");
  await page.getByLabel("Nouveau mot de passe").fill("NewPassword1!");
  await page.getByRole("button", { name: "Sauvegarder" }).click();
  await expect(page.getByRole("status")).toHaveText("Profil mis à jour.");

  await page.context().clearCookies();
  await page.goto("/login");
  await page.getByLabel("E-mail ou nom d'utilisateur").fill(`new${id}`);
  await page.getByLabel("Mot de passe").fill("NewPassword1!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/posts");

  await page.goto("/profile");
  await expect(page.getByLabel("Adresse e-mail")).toHaveValue(
    `new${id}@mdd.test`,
  );
});

test("shows an error when the email is already used", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail ou nom d'utilisateur").fill("bob");
  await page.getByLabel("Mot de passe").fill("Password123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/posts");

  await page.goto("/profile");
  await expect(page.getByLabel("Adresse e-mail")).toHaveValue("bob@mdd.dev");
  await page.getByLabel("Adresse e-mail").fill("alice@mdd.dev");
  await page.getByRole("button", { name: "Sauvegarder" }).click();

  await expect(
    page.getByText(
      "Ce nom d'utilisateur ou cette adresse e-mail est déjà utilisé.",
    ),
  ).toBeVisible();
});

test("shows the field errors on an invalid profile", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail ou nom d'utilisateur").fill("bob");
  await page.getByLabel("Mot de passe").fill("Password123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/posts");

  await page.goto("/profile");
  await expect(page.getByLabel("Adresse e-mail")).toHaveValue("bob@mdd.dev");
  await page.getByLabel("Nom d'utilisateur").fill("a");
  await page.getByLabel("Adresse e-mail").fill("bob@mdd");
  await page.getByLabel("Nouveau mot de passe").fill("short");
  await page.getByRole("button", { name: "Sauvegarder" }).click();

  await expect(page.getByText("Au moins 3 caractères")).toBeVisible();
  await expect(page.getByText("Adresse e-mail invalide")).toBeVisible();
  await expect(page.getByText("Au moins 8 caractères")).toBeVisible();
});

test("requires the current password to set a new one", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail ou nom d'utilisateur").fill("bob");
  await page.getByLabel("Mot de passe").fill("Password123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/posts");

  await page.goto("/profile");
  await expect(page.getByLabel("Adresse e-mail")).toHaveValue("bob@mdd.dev");
  await page.getByLabel("Nouveau mot de passe").fill("NewPassword1!");
  await page.getByRole("button", { name: "Sauvegarder" }).click();

  await expect(
    page.getByText("Le mot de passe actuel est requis"),
  ).toBeVisible();
});

test("shows an error when unsubscribing with a forged topic", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("E-mail ou nom d'utilisateur").fill("alice");
  await page.getByLabel("Mot de passe").fill("Password123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/posts");

  await page.getByRole("link", { name: "Mon profil" }).click();
  await expect(page).toHaveURL("/profile");
  const javascript = page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: "JavaScript" }) });
  await javascript
    .locator('input[name="topicId"]')
    .evaluate((input: HTMLInputElement) => (input.value = ""));
  await javascript.getByRole("button", { name: "Se désabonner" }).click();

  await expect(javascript.getByText("Thème introuvable.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "JavaScript" })).toBeVisible();
});
