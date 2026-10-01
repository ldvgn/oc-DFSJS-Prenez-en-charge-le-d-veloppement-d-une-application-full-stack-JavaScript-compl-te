import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";

describe("Not found page", () => {
  it("shows the not found message", () => {
    render(<NotFound />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Page introuvable" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Désolé, nous n'avons pas trouvé la page que vous recherchez.",
      ),
    ).toBeInTheDocument();
  });

  it("links back to the home page", () => {
    render(<NotFound />);

    expect(
      screen.getByRole("link", { name: "Retour à l'accueil" }),
    ).toHaveAttribute("href", "/");
  });
});
