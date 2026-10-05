import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UnsubscribeButton } from "./unsubscribe-button";
import { unsubscribeAction } from "@/modules/subscription/subscription.actions";

vi.mock("@/modules/subscription/subscription.actions", () => ({
  unsubscribeAction: vi.fn(),
}));

describe("UnsubscribeButton", () => {
  it("calls the action once with the topic ID on click", async () => {
    vi.mocked(unsubscribeAction).mockResolvedValue(undefined);
    render(<UnsubscribeButton topicId="topic-1" />);

    await userEvent.click(
      screen.getByRole("button", { name: "Se désabonner" }),
    );

    expect(unsubscribeAction).toHaveBeenCalledOnce();
    const [, formData] = vi.mocked(unsubscribeAction).mock.calls[0];
    expect(formData.get("topicId")).toBe("topic-1");
  });

  it("shows the error returned by the action", async () => {
    vi.mocked(unsubscribeAction).mockResolvedValue({
      message: "Échec du désabonnement. Réessayez plus tard.",
    });
    render(<UnsubscribeButton topicId="topic-1" />);

    await userEvent.click(
      screen.getByRole("button", { name: "Se désabonner" }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Échec du désabonnement. Réessayez plus tard.",
    );
  });
});
