import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SubscribeButton } from "./subscribe-button";
import { subscribeAction } from "@/modules/subscription/subscription.actions";

vi.mock("@/modules/subscription/subscription.actions", () => ({
  subscribeAction: vi.fn(),
}));

describe("SubscribeButton", () => {
  it("shows a disabled button when the user is already subscribed", () => {
    render(<SubscribeButton topicId="topic-1" subscribed />);

    expect(screen.getByRole("button", { name: "Déjà abonné" })).toBeDisabled();
    expect(
      screen.queryByRole("button", { name: "S'abonner" }),
    ).not.toBeInTheDocument();
  });

  it("calls the action once with the topic ID on click", async () => {
    vi.mocked(subscribeAction).mockResolvedValue(undefined);
    render(<SubscribeButton topicId="topic-1" subscribed={false} />);

    await userEvent.click(screen.getByRole("button", { name: "S'abonner" }));

    expect(subscribeAction).toHaveBeenCalledOnce();
    const [, formData] = vi.mocked(subscribeAction).mock.calls[0];
    expect(formData.get("topicId")).toBe("topic-1");
  });

  it("shows the error returned by the action", async () => {
    vi.mocked(subscribeAction).mockResolvedValue({
      message: "Échec de l'abonnement. Réessayez plus tard.",
    });
    render(<SubscribeButton topicId="topic-1" subscribed={false} />);

    await userEvent.click(screen.getByRole("button", { name: "S'abonner" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Échec de l'abonnement. Réessayez plus tard.",
    );
  });
});
