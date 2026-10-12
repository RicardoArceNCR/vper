"use client";

import { useActionState, useEffect, useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { ingresar, type LoginState } from "@/app/marca/lib/auth-actions";
import { MARCA, hasOwner } from "@/app/marca/lib/config";
import { aOwner } from "@/app/marca/lib/owner-copy";
import { SESSION_DAYS } from "@/app/marca/lib/session";

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(ingresar, {});
  const [visible, setVisible] = useState(false);
  const id = useId();
  const emailId = `${id}-email`;
  const errorId = `${id}-error`;
  // El ancla (#kit) no viaja al servidor: se lee acá y va en un campo oculto.
  const [hash, setHash] = useState("");
  useEffect(() => setHash(window.location.hash), []);
  // Entró y hay ancla: navegación completa para que el navegador baje a la sección.
  useEffect(() => {
    if (state.to) window.location.replace(state.to);
  }, [state.to]);

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="next" value={next} />
      <input type="hidden" name="hash" value={hash} />
      <div className="grid gap-2">
        <label htmlFor={emailId} className="font-sans text-label-sm font-bold uppercase">
          Correo
        </label>
        <Input
          id={emailId}
          name="email"
          type="email"
          defaultValue={state.email}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          autoFocus
          required
          state={state.error ? "error" : "default"}
          aria-describedby={state.error ? errorId : undefined}
          className="h-12 text-body-md"
        />
      </div>
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
      <Button
        type="submit"
        size="lg"
        disabled={pending || Boolean(state.to)}
        className="w-full"
      >
        {pending || state.to ? "Entrando…" : "Entrar"}
        {pending || state.to ? null : <ArrowRight aria-hidden />}
      </Button>
      <div className="grid gap-1.5 font-sans text-body-sm text-[var(--text-secondary)]">
        <p>
          ¿No tenés acceso o te olvidaste la contraseña? Pedísela{" "}
          {hasOwner() ? "a " : null}
          {hasOwner() ? (
            <a
              href={`mailto:${MARCA.owner.email}`}
              className="font-bold text-[var(--text-primary)] underline underline-offset-4"
            >
              {MARCA.owner.name}
            </a>
          ) : (
            aOwner()
          )}
          .
        </p>
        {/* La cookie solo viaja a /marca: desde acá no se puede saber si ya hay
            sesión. El enlace entra directo si la hay (y si no, vuelve acá). */}
        <p>
          <Link
            href={next}
            className="font-bold text-[var(--text-primary)] underline underline-offset-4"
          >
            ¿Ya entraste? Ir a {MARCA.name}
          </Link>
        </p>
        <p className="text-body-xs">
          La sesión dura {SESSION_DAYS} días en este navegador.
        </p>
      </div>
    </form>
  );
}
