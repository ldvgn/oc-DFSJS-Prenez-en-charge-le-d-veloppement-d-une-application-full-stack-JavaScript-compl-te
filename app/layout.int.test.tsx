import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RootLayout from "./layout";

vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "font-inter" }),
  Geist_Mono: () => ({ variable: "font-geist-mono" }),
}));

describe("RootLayout", () => {
  it("renders children and applies font classes", () => {
    render(
      <RootLayout params={Promise.resolve({})}>
        <p>Contenu</p>
      </RootLayout>,
    );

    expect(screen.getByText("Contenu")).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("font-inter");
    expect(document.documentElement).toHaveClass("font-geist-mono");
  });
});
