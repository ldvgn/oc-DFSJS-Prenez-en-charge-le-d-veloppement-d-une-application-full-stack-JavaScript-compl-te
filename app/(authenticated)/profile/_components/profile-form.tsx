"use client";

import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileSchema, type ProfileType } from "@/modules/user/user.schemas";
import { updateProfileAction } from "@/modules/user/user.actions";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ProfileFormProps = {
  username: string;
  email: string;
};

export default function ProfileForm({ username, email }: Readonly<ProfileFormProps>) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    undefined,
  );

  const form = useForm<ProfileType>({
    resolver: zodResolver(ProfileSchema),
  });

  const { errors } = form.formState;

  // Clear the password fields after a successful update.
  useEffect(() => {
    if (state?.success) {
      form.resetField("currentPassword", { defaultValue: "" });
      form.resetField("newPassword", { defaultValue: "" });
    }
  }, [state, form]);

  function onSubmit(data: ProfileType) {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("currentPassword", data.currentPassword);
    formData.append("newPassword", data.newPassword);
    startTransition(() => formAction(formData));
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.username}>
          <FieldLabel htmlFor="username" className="sr-only">
            Nom d&apos;utilisateur
          </FieldLabel>
          <Input
            {...form.register("username")}
            id="username"
            defaultValue={username}
            autoComplete="username"
            aria-invalid={!!errors.username}
            placeholder="Nom d'utilisateur"
          />
          {errors.username && <FieldError errors={[errors.username]} />}
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email" className="sr-only">
            Adresse e-mail
          </FieldLabel>
          <Input
            {...form.register("email")}
            id="email"
            type="email"
            defaultValue={email}
            autoComplete="email"
            aria-invalid={!!errors.email}
            placeholder="Adresse e-mail"
          />
          {errors.email && <FieldError errors={[errors.email]} />}
        </Field>

        <Field data-invalid={!!errors.currentPassword}>
          <FieldLabel htmlFor="currentPassword" className="sr-only">
            Mot de passe actuel
          </FieldLabel>
          <Input
            {...form.register("currentPassword")}
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.currentPassword}
            placeholder="Mot de passe actuel"
          />
          {errors.currentPassword && (
            <FieldError errors={[errors.currentPassword]} />
          )}
        </Field>

        <Field data-invalid={!!errors.newPassword}>
          <FieldLabel htmlFor="newPassword" className="sr-only">
            Nouveau mot de passe
          </FieldLabel>
          <Input
            {...form.register("newPassword")}
            id="newPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.newPassword}
            placeholder="Nouveau mot de passe"
          />
          {errors.newPassword && <FieldError errors={[errors.newPassword]} />}
        </Field>

        {state?.message && <p role="alert">{state.message}</p>}
        {state?.success && <output>Profil mis à jour.</output>}

        <Button type="submit" disabled={isPending} className="mx-auto">
          {isPending ? "Sauvegarde…" : "Sauvegarder"}
        </Button>
      </FieldGroup>
    </form>
  );
}
