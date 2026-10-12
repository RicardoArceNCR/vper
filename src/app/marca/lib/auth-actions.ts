"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  LOGIN_PATH,
  SESSION_COOKIE,
  SESSION_DAYS,
  SESSION_PATH,
  checkPassword,
  createSession,
  marcaPassword,
  safeHash,
  safeNext,
} from "./session";
import { clientKey, tryAttempt } from "./rate-limit";
import { aOwner } from "./owner-copy";

/** `to`: a dónde ir cuando hay ancla (ver abajo). */
export type LoginState = { error?: string; to?: string };

export async function ingresar(_prev: LoginState, form: FormData): Promise<LoginState> {
  const secret = marcaPassword();
  if (!secret) {
    // El detalle técnico va al log del servidor; a la persona, a quién escribir.
    console.error("[marca] Login cerrado: falta la variable MARCA_PASSWORD en Vercel.");
    return { error: `El acceso está cerrado por ahora. Escribí ${aOwner()}.` };
  }

  // Límite por IP antes de mirar la contraseña (ver lib/rate-limit.ts: en
  // serverless es por instancia; la defensa completa es el firewall de Vercel).
  const gate = tryAttempt(clientKey(await headers()));
  if (!gate.ok) {
    return { error: `Demasiados intentos. Probá de nuevo en ${gate.retryMin} min.` };
  }

  const ok = await checkPassword(String(form.get("password") ?? ""), secret);
  if (!ok) {
    // Frena el probar contraseñas en serie sin molestar a quien se equivocó una vez.
    await new Promise((r) => setTimeout(r, 700));
    return { error: `Esa no es. Revisala o pedísela ${aOwner()}.` };
  }
  gate.release();

  (await cookies()).set(SESSION_COOKIE, await createSession(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: SESSION_PATH,
    maxAge: SESSION_DAYS * 86400,
  });
  const to = safeNext(form.get("next"));
  const hash = safeHash(form.get("hash"));
  // El router de Next pierde el ancla en el redirect de una server action
  // (manda "/marca/firmas#kit" y termina en "/marca/firmas"). Con ancla, el
  // formulario navega él mismo; sin ancla, redirect normal (anda sin JS).
  if (hash) return { to: to + hash };
  redirect(to);
}

export async function salir() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: SESSION_PATH });
  redirect(LOGIN_PATH);
}
