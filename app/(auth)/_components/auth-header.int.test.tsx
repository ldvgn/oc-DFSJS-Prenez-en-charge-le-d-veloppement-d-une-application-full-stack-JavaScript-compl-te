import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AuthHeader from "./auth-header";

describe("AuthHeader", () => {
  it("renders the title and a back link to home", () => {
    render(<AuthHeader title="Connexion" />);

    expect(
      screen.getByRole("heading", { name: "Connexion" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Retour" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});
