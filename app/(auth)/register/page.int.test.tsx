import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Register from "./page";

describe("Register page", () => {
  it("renders the header and the register form", () => {
    render(<Register />);

    expect(
      screen.getByRole("heading", { name: "Inscription" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "S'inscrire" }),
    ).toBeInTheDocument();
  });
});
