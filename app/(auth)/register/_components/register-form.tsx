"use client";

import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterInput,
} from "@/modules/auth/auth.schemas";
import type { RegisterState } from "@/modules/auth/auth.actions";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type RegisterFormProps = {
  action: (
    prevState: RegisterState,
    formData: FormData,
  ) => Promise<RegisterState>;
};

export default function RegisterForm({ action }: RegisterFormProps) {
  const [state, formAction, isPending] = useActionState(action, undefined);
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });
  const { errors } = form.formState;

  function onSubmit(data: RegisterInput) {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    startTransition(() => formAction(formData));
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.username}>
          <FieldLabel htmlFor="username">Nom d&apos;utilisateur</FieldLabel>
          <Input
            id="username"
            autoComplete="username"
            aria-invalid={!!errors.username}
            {...form.register("username")}
          />
          <FieldError errors={[errors.username]} />
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Adresse e-mail</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...form.register("email")}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...form.register("password")}
          />
          <FieldError errors={[errors.password]} />
        </Field>

        <FieldError
          errors={state?.error ? [{ message: state.error }] : undefined}
        />

        <Button type="submit" disabled={isPending} className="mx-auto">
          {isPending ? "Inscription…" : "S'inscrire"}
        </Button>
      </FieldGroup>
    </form>
  );
}
