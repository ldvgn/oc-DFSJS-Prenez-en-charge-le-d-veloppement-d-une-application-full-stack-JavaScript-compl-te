"use client";

import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginType } from "@/modules/auth/auth.schemas";
import { loginAction } from "@/modules/auth/auth.actions";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useServerErrors } from "@/hooks/use-server-errors";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  const form = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
  });

  const { errors } = form.formState;

  useServerErrors(form, state?.errors);

  function onSubmit(data: LoginType) {
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
            {...form.register("identifier")}
            id="identifier"
            autoComplete="username"
            aria-invalid={!!errors.identifier}
          />
          {errors.identifier && <FieldError errors={[errors.identifier]} />}
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
          <Input
            {...form.register("password")}
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
          />
          {errors.password && <FieldError errors={[errors.password]} />}
        </Field>

        {state?.message && <p role="alert">{state.message}</p>}

        <Button type="submit" disabled={isPending} className="mx-auto">
          {isPending ? "Connexion…" : "Se connecter"}
        </Button>
      </FieldGroup>
    </form>
  );
}
