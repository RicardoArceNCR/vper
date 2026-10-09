"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  LOGIN_PATH,
  SESSION_COOKIE,
  SESSION_DAYS,
  SESSION_PATH,
  checkPassword,
  createSession,
  marcaPassword,
  safeNext,
} from "./session";

export type LoginState = { error?: string };

export async function ingresar(_prev: LoginState, form: FormData): Promise<LoginState> {
  const secret = marcaPassword();
  if (!secret) return { error: "Falta configurar MARCA_PASSWORD en Vercel." };

  const ok = await checkPassword(String(form.get("password") ?? ""), secret);
  if (!ok) {
    // Frena el probar contraseñas en serie sin molestar a quien se equivocó una vez.
    await new Promise((r) => setTimeout(r, 700));
    return { error: "Esa no es la contraseña." };
  }

  (await cookies()).set(SESSION_COOKIE, await createSession(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: SESSION_PATH,
    maxAge: SESSION_DAYS * 86400,
  });
  redirect(safeNext(form.get("next")));
}

export async function salir() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: SESSION_PATH });
  redirect(LOGIN_PATH);
}
