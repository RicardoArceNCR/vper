"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  LOGIN_PATH,
  SESSION_COOKIE,
  SESSION_DAYS,
  SESSION_PATH,
  checkCredentials,
  createSession,
  isConfigured,
  normalizeEmail,
  safeHash,
  safeNext,
  sessionSecret,
} from "./session";
import { clientKey, tryAttempt } from "./rate-limit";
import { aOwner } from "./owner-copy";

/**
 * `to`: a dónde ir cuando hay ancla (ver abajo). `email`: se devuelve con el
 * error porque React vacía el formulario después de cada envío.
 */
export type LoginState = { error?: string; to?: string; email?: string };

export async function ingresar(_prev: LoginState, form: FormData): Promise<LoginState> {
  const secret = sessionSecret();
  if (!secret || !isConfigured()) {
    // El detalle técnico va al log del servidor; a la persona, a quién escribir.
    console.error(
      "[marca] Login cerrado: faltan MARCA_USERS o MARCA_SESSION_SECRET en Vercel.",
    );
    return { error: `El acceso está cerrado por ahora. Escribí ${aOwner()}.` };
  }

  // Límite por IP antes de mirar la contraseña (ver lib/rate-limit.ts: en
  // serverless es por instancia; la defensa completa es el firewall de Vercel).
  const gate = tryAttempt(clientKey(await headers()));
  if (!gate.ok) {
    return {
      error: `Demasiados intentos. Probá de nuevo en ${gate.retryMin} min.`,
      email: normalizeEmail(form.get("email")),
    };
  }

  const email = normalizeEmail(form.get("email"));
  const user = await checkCredentials(email, String(form.get("password") ?? ""));
  if (!user) {
    console.warn(`[marca] Ingreso fallido: ${email.slice(0, 80) || "(sin correo)"}`);
    // Frena el probar contraseñas en serie sin molestar a quien se equivocó una vez.
    await new Promise((r) => setTimeout(r, 700));
    // El mismo mensaje para correo y contraseña: no se revela quién tiene acceso.
    return {
      error: `Correo o contraseña incorrectos. Si no tenés acceso, escribí ${aOwner()}.`,
      email,
    };
  }
  gate.release();
  console.info(`[marca] Ingresó ${user.email}`);

  (await cookies()).set(SESSION_COOKIE, await createSession(user, secret), {
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
