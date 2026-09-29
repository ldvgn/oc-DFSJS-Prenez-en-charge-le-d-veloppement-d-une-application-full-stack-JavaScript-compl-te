"use client";

import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createPostSchema,
  type CreatePostInput,
} from "@/modules/post/post.schemas";
import type { CreatePostState } from "@/modules/post/post.actions";
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

type PostFormProps = {
  topics: Topic[];
  action: (
    prevState: CreatePostState,
    formData: FormData,
  ) => Promise<CreatePostState>;
};

export default function PostForm({ topics, action }: PostFormProps) {
  const [state, formAction, isPending] = useActionState(action, undefined);
  const form = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { topicId: "", title: "", content: "" },
  });
  const { errors } = form.formState;

  function onSubmit(data: CreatePostInput) {
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
          <FieldLabel htmlFor="topicId">Thème</FieldLabel>
          <NativeSelect
            id="topicId"
            aria-invalid={!!errors.topicId}
            {...form.register("topicId")}
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
          <FieldError errors={[errors.topicId]} />
        </Field>

        <Field data-invalid={!!errors.title}>
          <FieldLabel htmlFor="title">Titre de l&apos;article</FieldLabel>
          <Input
            id="title"
            aria-invalid={!!errors.title}
            {...form.register("title")}
          />
          <FieldError errors={[errors.title]} />
        </Field>

        <Field data-invalid={!!errors.content}>
          <FieldLabel htmlFor="content">Contenu de l&apos;article</FieldLabel>
          <Textarea
            id="content"
            rows={10}
            aria-invalid={!!errors.content}
            {...form.register("content")}
          />
          <FieldError errors={[errors.content]} />
        </Field>

        <FieldError
          errors={state?.error ? [{ message: state.error }] : undefined}
        />

        <Button type="submit" disabled={isPending} className="mx-auto">
          {isPending ? "Création…" : "Créer"}
        </Button>
      </FieldGroup>
    </form>
  );
}
