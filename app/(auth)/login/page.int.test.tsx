import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Login from "./page";

describe("Login page", () => {
  it("renders the header and the login form", () => {
    render(<Login />);

    expect(
      screen.getByRole("heading", { name: "Se connecter" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Se connecter" }),
    ).toBeInTheDocument();
  });
});
