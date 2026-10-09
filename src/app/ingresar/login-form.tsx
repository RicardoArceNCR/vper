"use client";

import { useActionState, useId, useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { ingresar, type LoginState } from "@/app/marca/lib/auth-actions";

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(ingresar, {});
  const [visible, setVisible] = useState(false);
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="next" value={next} />
      <div className="grid gap-2">
        <label htmlFor={id} className="font-sans text-label-sm font-bold uppercase">
          Contraseña
        </label>
        <div className="relative">
          <Input
            id={id}
            name="password"
            type={visible ? "text" : "password"}
            autoComplete="current-password"
            autoFocus
            required
            state={state.error ? "error" : "default"}
            aria-describedby={state.error ? errorId : undefined}
            className="h-12 pr-12 text-body-md"
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={visible}
            className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)]"
          >
            {visible ? (
              <EyeOff aria-hidden className="size-4" />
            ) : (
              <Eye aria-hidden className="size-4" />
            )}
          </button>
        </div>
        {state.error ? (
          <p
            id={errorId}
            role="alert"
            className="font-sans text-body-sm font-bold text-[var(--feedback-error-text)]"
          >
            {state.error}
          </p>
        ) : null}
      </div>
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Entrando…" : "Entrar"}
        {pending ? null : <ArrowRight aria-hidden />}
      </Button>
      <p className="font-sans text-body-xs text-[var(--text-secondary)]">
        La sesión dura 30 días en este navegador.
      </p>
    </form>
  );
}
