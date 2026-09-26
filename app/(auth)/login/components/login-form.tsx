"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/modules/auth/schemas";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type LoginFormProps = {
  action: (
    prevState: string | undefined,
    formData: FormData,
  ) => Promise<string | undefined>;
};

export default function LoginForm({ action }: LoginFormProps) {
  const [errorMessage, formAction, isPending] = useActionState(
    action,
    undefined,
  );
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  function onSubmit(data: LoginInput) {
    const formData = new FormData();
    formData.append("identifier", data.identifier);
    formData.append("password", data.password);
    formAction(formData); // délègue à la Server Action + useActionState
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.identifier}>
          <FieldLabel htmlFor="identifier">
            E-mail ou nom d’utilisateur
          </FieldLabel>
          <Input
            id="identifier"
            autoComplete="username"
            aria-invalid={!!form.formState.errors.identifier}
            {...form.register("identifier")}
          />
          <FieldError errors={[form.formState.errors.identifier]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.password}>
          <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!form.formState.errors.password}
            {...form.register("password")}
          />
          <FieldError errors={[form.formState.errors.password]} />
        </Field>

        <FieldError
          errors={errorMessage ? [{ message: errorMessage }] : undefined}
        />

        <Button
          type="submit"
          aria-disabled={isPending}
          disabled={isPending}
          className="mx-auto"
        >
          {isPending ? "Connexion…" : "Se connecter"}
        </Button>
      </FieldGroup>
    </form>
  );
}
