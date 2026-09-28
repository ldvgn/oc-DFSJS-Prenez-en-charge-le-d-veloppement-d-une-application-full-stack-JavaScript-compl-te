import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AuthLayout from "./layout";

describe("AuthLayout", () => {
  it("renders children inside main", () => {
    render(
      <AuthLayout params={Promise.resolve({})}>
        <p>Contenu</p>
      </AuthLayout>,
    );

    expect(screen.getByRole("main")).toContainElement(
      screen.getByText("Contenu"),
    );
  });
});
