import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostForm from "@/app/(authenticated)/posts/new/_components/post-form";
import { createPostAction } from "@/modules/post/post.actions";
import type { Topic } from "@/prisma/generated/prisma/client";

vi.mock("@/modules/post/post.actions", () => ({ createPostAction: vi.fn() }));

const topics: Topic[] = [
  { id: "topic-1", name: "JavaScript", description: "Le langage du web" },
  { id: "topic-2", name: "Python", description: "Le langage polyvalent" },
];

describe("PostForm", () => {
  it("renders an option for each topic", () => {
    render(<PostForm topics={topics} />);

    expect(
      screen.getByRole("option", { name: "JavaScript" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Python" })).toBeInTheDocument();
  });

  it("shows validation errors without calling the action", async () => {
    render(<PostForm topics={topics} />);

    await userEvent.click(screen.getByRole("button", { name: "Créer" }));

    expect(await screen.findByText("Le thème est requis")).toBeInTheDocument();
    expect(screen.getByText("Le titre est requis")).toBeInTheDocument();
    expect(screen.getByText("5 caractères minimum")).toBeInTheDocument();
    expect(createPostAction).not.toHaveBeenCalled();
  });

  it("shows an error when the title exceeds 100 characters", async () => {
    render(<PostForm topics={topics} />);

    await userEvent.selectOptions(screen.getByLabelText("Thème"), "topic-2");
    await userEvent.click(screen.getByLabelText("Titre de l'article"));
    await userEvent.paste("a".repeat(101));
    await userEvent.type(
      screen.getByLabelText("Contenu de l'article"),
      "Un contenu valide",
    );
    await userEvent.click(screen.getByRole("button", { name: "Créer" }));

    expect(await screen.findByText("100 caractères maximum")).toBeInTheDocument();
    expect(createPostAction).not.toHaveBeenCalled();
  });

  it("shows the error returned by the action and keeps the fields", async () => {
    vi.mocked(createPostAction).mockResolvedValue({
      message: "Impossible de créer l'article.",
    });
    render(<PostForm topics={topics} />);

    await userEvent.selectOptions(screen.getByLabelText("Thème"), "topic-2");
    await userEvent.type(
      screen.getByLabelText("Titre de l'article"),
      "Mon article",
    );
    await userEvent.type(
      screen.getByLabelText("Contenu de l'article"),
      "Un contenu valide",
    );
    await userEvent.click(screen.getByRole("button", { name: "Créer" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Impossible de créer l'article.",
    );
    expect(screen.getByLabelText("Titre de l'article")).toHaveValue(
      "Mon article",
    );
    expect(screen.getByLabelText("Contenu de l'article")).toHaveValue(
      "Un contenu valide",
    );
  });

  it("calls the action once with the form data on valid submission", async () => {
    vi.mocked(createPostAction).mockResolvedValue(undefined);
    render(<PostForm topics={topics} />);

    await userEvent.selectOptions(screen.getByLabelText("Thème"), "topic-2");
    await userEvent.type(
      screen.getByLabelText("Titre de l'article"),
      "Mon article",
    );
    await userEvent.type(
      screen.getByLabelText("Contenu de l'article"),
      "Un contenu valide",
    );
    await userEvent.click(screen.getByRole("button", { name: "Créer" }));

    expect(createPostAction).toHaveBeenCalledOnce();
    const [, formData] = vi.mocked(createPostAction).mock.calls[0];
    expect(formData.get("topicId")).toBe("topic-2");
    expect(formData.get("title")).toBe("Mon article");
    expect(formData.get("content")).toBe("Un contenu valide");
  });
});
