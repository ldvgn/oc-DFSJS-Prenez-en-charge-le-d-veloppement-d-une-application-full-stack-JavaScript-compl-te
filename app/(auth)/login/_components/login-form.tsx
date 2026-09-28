"use client";

import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/modules/auth/auth.schemas";
import type { LoginState } from "@/modules/auth/auth.actions";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type LoginFormProps = {
  action: (prevState: LoginState, formData: FormData) => Promise<LoginState>;
};

export default function LoginForm({ action }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(action, undefined);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });
  const { errors } = form.formState;

  function onSubmit(data: LoginInput) {
    const formData = new FormData();
    formData.append("identifier", data.identifier);
    formData.append("password", data.password);
    startTransition(() => formAction(formData));
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.identifier}>
          <FieldLabel htmlFor="identifier">
            E-mail ou nom d&apos;utilisateur
          </FieldLabel>
          <Input
            id="identifier"
            autoComplete="username"
            aria-invalid={!!errors.identifier}
            {...form.register("identifier")}
          />
          <FieldError errors={[errors.identifier]} />
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...form.register("password")}
          />
          <FieldError errors={[errors.password]} />
        </Field>

        <FieldError
          errors={state?.error ? [{ message: state.error }] : undefined}
        />

        <Button type="submit" disabled={isPending} className="mx-auto">
          {isPending ? "Connexion…" : "Se connecter"}
        </Button>
      </FieldGroup>
    </form>
  );
}
