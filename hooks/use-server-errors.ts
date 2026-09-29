import { useEffect } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

/**
 * Pushes server-side field errors into react-hook-form.
 *
 * @param form - The react-hook-form instance
 * @param errors - Field errors returned by the server action
 */
export function useServerErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
  errors?: Partial<Record<Path<T>, string[]>>,
) {
  useEffect(() => {
    if (!errors) return;
    for (const [name, messages] of Object.entries(errors)) {
      const message = (messages as string[] | undefined)?.[0];
      if (message) form.setError(name as Path<T>, { type: "server", message });
    }
  }, [errors, form]);
}
