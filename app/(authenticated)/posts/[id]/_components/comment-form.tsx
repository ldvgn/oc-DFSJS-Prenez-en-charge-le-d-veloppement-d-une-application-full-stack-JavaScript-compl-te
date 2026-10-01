"use client";

import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  CommentSchema,
  type CommentType,
} from "@/modules/comment/comment.schemas";
import { createCommentAction } from "@/modules/comment/comment.actions";

export default function CommentForm({ postId }: { postId: string }) {
  const [state, formAction, isPending] = useActionState(
    createCommentAction,
    undefined,
  );

  const form = useForm<CommentType>({
    resolver: zodResolver(CommentSchema),
  });

  const { errors } = form.formState;

  // Clear the field after a successful send.
  useEffect(() => {
    if (!isPending && form.formState.isSubmitSuccessful && !state) form.reset();
  }, [isPending, state, form]);

  function onSubmit(data: CommentType) {
    const formData = new FormData();
    formData.append("content", data.content);
    formData.append("postId", postId);
    startTransition(() => formAction(formData));
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid grid-cols-10 gap-8"
    >
      <Field
        data-invalid={!!errors.content}
        className="col-start-1 col-end-9 lg:col-span-8 lg:col-start-2"
      >
        <FieldLabel htmlFor="content" className="sr-only">
          Commentaire
        </FieldLabel>
        <Textarea
          {...form.register("content")}
          id="content"
          aria-invalid={!!errors.content}
          placeholder="Écrivez ici votre commentaire"
        />
        {errors.content && <FieldError errors={[errors.content]} />}
      </Field>

      {state?.message && <p role="alert">{state.message}</p>}

      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="size-14"
        disabled={isPending}
        aria-label="Envoyer le commentaire"
      >
        <Send className="size-10 text-primary" />
      </Button>
    </form>
  );
}
