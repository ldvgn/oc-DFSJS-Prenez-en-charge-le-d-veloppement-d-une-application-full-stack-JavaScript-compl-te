"use client";

import { startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
  const [state, formAction, pending] = useActionState(
    createCommentAction,
    undefined,
  );

  const form = useForm<CommentType>({
    resolver: zodResolver(CommentSchema),
    defaultValues: { content: "" },
  });

  // Clear the field after a successful send.
  useEffect(() => {
    if (!pending && form.formState.isSubmitSuccessful && !state) form.reset();
  }, [pending, state, form]);

  // Show server-side validation errors on the field.
  useEffect(() => {
    const message = state?.errors?.content?.[0];
    if (message) form.setError("content", { type: "server", message });
  }, [state, form]);

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
      <Controller
        name="content"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            data-invalid={fieldState.invalid}
            className="col-start-1 col-end-9 lg:col-span-8 lg:col-start-2"
          >
            <FieldLabel htmlFor="content" className="sr-only">
              Commentaire
            </FieldLabel>
            <Textarea
              {...field}
              id="content"
              aria-invalid={fieldState.invalid}
              placeholder="Écrivez ici votre commentaire"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {state?.message && <p aria-live="polite">{state.message}</p>}

      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="size-14"
        disabled={pending}
        aria-label="Envoyer le commentaire"
      >
        <Send className="size-10 text-primary" />
      </Button>
    </form>
  );
}
