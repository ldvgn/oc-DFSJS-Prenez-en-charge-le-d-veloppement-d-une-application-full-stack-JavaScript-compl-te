"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { unsubscribeAction } from "@/modules/subscription/subscription.actions";

export function UnsubscribeButton({ topicId }: Readonly<{ topicId: string }>) {
  const [state, formAction, isPending] = useActionState(
    unsubscribeAction,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col items-center gap-2">
      <input type="hidden" name="topicId" value={topicId} />
      <Button type="submit" className="w-32" disabled={isPending}>
        Se désabonner
      </Button>
      {state?.message && (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      )}
    </form>
  );
}
