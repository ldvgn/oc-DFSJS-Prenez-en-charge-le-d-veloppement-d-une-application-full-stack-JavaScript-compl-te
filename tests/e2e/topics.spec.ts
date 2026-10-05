import { test, expect } from "./fixtures";

test("shows the topics the user already subscribes to as disabled", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("E-mail ou nom d'utilisateur").fill("alice");
  await page.getByLabel("Mot de passe").fill("Password123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/posts");

  await page.goto("/topics");

  const javascript = page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: "JavaScript" }) });
  await expect(
    javascript.getByRole("button", { name: "Déjà abonné" }),
  ).toBeDisabled();
  const python = page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: "Python" }) });
  await expect(python.getByRole("button", { name: "S'abonner" })).toBeEnabled();
});

test("shows the posts of a topic in the feed once subscribed", async ({
  page,
}) => {
  const id = crypto.randomUUID().slice(0, 8);
  const title = `Article Python ${id}`;

  // New user: no topic subscriptions yet
  await page.goto("/register");
  await page.getByLabel("Nom d'utilisateur").fill(`user${id}`);
  await page.getByLabel("Adresse e-mail").fill(`user${id}@mdd.test`);
  await page.getByLabel("Mot de passe").fill("Password123!");
  await page.getByRole("button", { name: "S'inscrire" }).click();
  await expect(page).toHaveURL("/posts");
  await page.getByRole("link", { name: "Créer un article" }).click();
  await expect(page).toHaveURL("/posts/new");
  await page.getByLabel("Thème").selectOption({ label: "Python" });
  await page.getByLabel("Titre de l'article").fill(title);
  await page.getByLabel("Contenu de l'article").fill("Contenu de test.");
  await page.getByRole("button", { name: "Créer" }).click();
  await expect(page.getByRole("heading", { name: title })).toBeVisible();

  await page.goto("/posts");
  await expect(page.getByText(title)).toHaveCount(0);

  await page.goto("/topics");
  const python = page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: "Python" }) });
  await python.getByRole("button", { name: "S'abonner" }).click();
  await expect(
    python.getByRole("button", { name: "Déjà abonné" }),
  ).toBeDisabled();

  await page.goto("/posts");
  await expect(page.getByText(title)).toBeVisible();
});

test("shows an error when subscribing to an unknown topic", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("E-mail ou nom d'utilisateur").fill("alice");
  await page.getByLabel("Mot de passe").fill("Password123!");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/posts");

  await page.getByRole("link", { name: "Thèmes" }).click();
  await expect(page).toHaveURL("/topics");
  const python = page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: "Python" }) });
  await python
    .locator('input[name="topicId"]')
    .evaluate((input: HTMLInputElement) => (input.value = "unknown-topic"));
  await python.getByRole("button", { name: "S'abonner" }).click();

  await expect(python.getByText("Thème introuvable.")).toBeVisible();
  await expect(python.getByRole("button", { name: "S'abonner" })).toBeEnabled();
});
