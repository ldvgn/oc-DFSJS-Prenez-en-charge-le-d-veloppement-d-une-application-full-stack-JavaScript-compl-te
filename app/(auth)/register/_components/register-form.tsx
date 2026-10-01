"use client";

import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterType } from "@/modules/auth/auth.schemas";
import { registerAction } from "@/modules/auth/auth.actions";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    undefined,
  );

  const form = useForm<RegisterType>({
    resolver: zodResolver(RegisterSchema),
  });

  const { errors } = form.formState;

  function onSubmit(data: RegisterType) {
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
            {...form.register("username")}
            id="username"
            autoComplete="username"
            aria-invalid={!!errors.username}
          />
          {errors.username && <FieldError errors={[errors.username]} />}
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Adresse e-mail</FieldLabel>
          <Input
            {...form.register("email")}
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
          />
          {errors.email && <FieldError errors={[errors.email]} />}
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
          <Input
            {...form.register("password")}
            id="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
          />
          {errors.password && <FieldError errors={[errors.password]} />}
        </Field>

        {state?.message && <p role="alert">{state.message}</p>}

        <Button type="submit" disabled={isPending} className="mx-auto">
          {isPending ? "Inscription…" : "S'inscrire"}
        </Button>
      </FieldGroup>
    </form>
  );
}
