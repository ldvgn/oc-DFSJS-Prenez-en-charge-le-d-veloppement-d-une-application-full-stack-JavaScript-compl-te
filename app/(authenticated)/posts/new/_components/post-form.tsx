"use client";

import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
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
  });

  const { errors } = form.formState;

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
        <Field data-invalid={!!errors.topicId}>
          <FieldLabel htmlFor="topicId" className="sr-only">
            Thème
          </FieldLabel>
          <NativeSelect
            {...form.register("topicId")}
            id="topicId"
            defaultValue=""
            aria-invalid={!!errors.topicId}
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
          {errors.topicId && <FieldError errors={[errors.topicId]} />}
        </Field>

        <Field data-invalid={!!errors.title}>
          <FieldLabel htmlFor="title" className="sr-only">
            Titre de l&apos;article
          </FieldLabel>
          <Input
            {...form.register("title")}
            id="title"
            aria-invalid={!!errors.title}
            placeholder="Titre de l'article"
          />
          {errors.title && <FieldError errors={[errors.title]} />}
        </Field>

        <Field data-invalid={!!errors.content}>
          <FieldLabel htmlFor="content" className="sr-only">
            Contenu de l&apos;article
          </FieldLabel>
          <Textarea
            {...form.register("content")}
            id="content"
            rows={10}
            aria-invalid={!!errors.content}
            placeholder="Contenu de l'article"
          />
          {errors.content && <FieldError errors={[errors.content]} />}
        </Field>

        {state?.message && <p role="alert">{state.message}</p>}

        <Button type="submit" disabled={isPending} className="mx-auto">
          {isPending ? "Création…" : "Créer"}
        </Button>
      </FieldGroup>
    </form>
  );
}
