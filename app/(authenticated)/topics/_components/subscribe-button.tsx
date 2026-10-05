"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { subscribeAction } from "@/modules/subscription/subscription.actions";

type SubscribeButtonProps = {
  topicId: string;
  subscribed: boolean;
};

export function SubscribeButton({ topicId, subscribed }: Readonly<SubscribeButtonProps>) {
  const [state, formAction, isPending] = useActionState(
    subscribeAction,
    undefined,
  );

  if (subscribed) {
    return (
      <Button
        disabled
        className="w-32 disabled:opacity-100 disabled:bg-neutral-400 disabled:text-white"
      >
        Déjà abonné
      </Button>
    );
  }

  return (
    <form action={formAction} className="flex flex-col items-center gap-2">
      <input type="hidden" name="topicId" value={topicId} />
      <Button type="submit" className="w-32" disabled={isPending}>
        S&apos;abonner
      </Button>
      {state?.message && (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      )}
    </form>
  );
}
