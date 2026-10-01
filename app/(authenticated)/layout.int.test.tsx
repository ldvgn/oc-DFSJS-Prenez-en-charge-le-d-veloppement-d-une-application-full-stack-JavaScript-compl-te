import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import AuthenticatedLayout from "./layout";

vi.mock("next/navigation", () => ({ usePathname: () => "/posts" }));
vi.mock("@/modules/auth/auth.actions", () => ({ logoutAction: vi.fn() }));

describe("Authenticated layout", () => {
  it("renders the app header", () => {
    render(
      <AuthenticatedLayout params={Promise.resolve({})}>
        <p>Contenu</p>
      </AuthenticatedLayout>,
    );

    const header = screen.getByRole("banner");
    expect(
      within(header).getByRole("link", { name: "Articles" }),
    ).toBeInTheDocument();
  });

  it("renders the children inside the main landmark", () => {
    render(
      <AuthenticatedLayout params={Promise.resolve({})}>
        <p>Contenu</p>
      </AuthenticatedLayout>,
    );

    expect(
      within(screen.getByRole("main")).getByText("Contenu"),
    ).toBeInTheDocument();
  });
});
