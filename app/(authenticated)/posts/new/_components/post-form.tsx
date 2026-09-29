"use client";

import { startTransition, useActionState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostSchema, type PostType } from "@/modules/post/post.schemas";
import { createPostAction } from "@/modules/post/post.actions";
import type { Topic } from "@/prisma/generated/prisma/client";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";
import { useServerErrors } from "@/hooks/use-server-errors";

export default function PostForm({ topics }: { topics: Topic[] }) {
  const [state, formAction, isPending] = useActionState(
    createPostAction,
    undefined,
  );

  const form = useForm<PostType>({
    resolver: zodResolver(PostSchema),
    defaultValues: { topicId: "", title: "", content: "" },
  });

  useServerErrors(form, state?.errors);

  function onSubmit(data: PostType) {
    const formData = new FormData();
    formData.append("topicId", data.topicId);
    formData.append("title", data.title);
    formData.append("content", data.content);
    startTransition(() => formAction(formData));
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="topicId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="topicId" className="sr-only">
                Thème
              </FieldLabel>
              <NativeSelect
                {...field}
                id="topicId"
                aria-invalid={fieldState.invalid}
              >
                <NativeSelectOption value="" disabled>
                  Sélectionner un thème
                </NativeSelectOption>
                {topics.map((topic) => (
                  <NativeSelectOption key={topic.id} value={topic.id}>
                    {topic.name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title" className="sr-only">
                Titre de l&apos;article
              </FieldLabel>
              <Input
                {...field}
                id="title"
                aria-invalid={fieldState.invalid}
                placeholder="Titre de l’article"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="content"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="content" className="sr-only">
                Contenu de l&apos;article
              </FieldLabel>
              <Textarea
                {...field}
                id="content"
                rows={10}
                aria-invalid={fieldState.invalid}
                placeholder="Contenu de l’article"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {state?.message && <p aria-live="polite">{state.message}</p>}

        <Button type="submit" disabled={isPending} className="mx-auto">
          {isPending ? "Création…" : "Créer"}
        </Button>
      </FieldGroup>
    </form>
  );
}
