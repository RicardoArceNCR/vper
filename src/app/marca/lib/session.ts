/**
 * Acceso al portal de marca: una contraseña compartida (`MARCA_PASSWORD`, en
 * Vercel) y una cookie firmada con HMAC-SHA256. Sin dependencias: Web Crypto
 * corre igual en el middleware (Edge) que en una server action (Node).
 *
 * La clave de firma es la propia contraseña, así que cambiarla en Vercel cierra
 * todas las sesiones abiertas sin ningún otro paso.
 *
 * Sin `MARCA_PASSWORD`: en local el portal queda abierto (para desarrollar) y en
 * producción queda cerrado. Nunca se publica abierto por olvido.
 */

export const SESSION_COOKIE = "vper_marca";
export const SESSION_DAYS = 30;
/** La cookie solo viaja a /marca: el resto del sitio no la ve. */
export const SESSION_PATH = "/marca";
export const LOGIN_PATH = "/ingresar";

const VERSION = "v1";
const enc = new TextEncoder();

export function marcaPassword(): string | undefined {
  const p = process.env.MARCA_PASSWORD?.trim();
  return p || undefined;
}

/** En local y sin contraseña, el portal no pide nada. */
export function isOpenForDev(): boolean {
  return !marcaPassword() && process.env.NODE_ENV !== "production";
}

async function sign(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
  return Array.from(sig, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Comparación en tiempo constante para strings de igual largo (firmas hex). */
function same(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Se comparan las firmas, no los textos: mismo largo y mismo tiempo siempre. */
export async function checkPassword(input: string, secret: string): Promise<boolean> {
  const [a, b] = await Promise.all([
    sign(secret, `pw:${input}`),
    sign(secret, `pw:${secret}`),
  ]);
  return same(a, b);
}

export async function createSession(secret: string): Promise<string> {
  const exp = Date.now() + SESSION_DAYS * 864e5;
  const payload = `${VERSION}.${exp}`;
  return `${payload}.${await sign(secret, payload)}`;
}

export async function verifySession(
  token: string | undefined,
  secret: string,
): Promise<boolean> {
  if (!token) return false;
  const [version, exp, sig] = token.split(".");
  if (version !== VERSION || !exp || !sig) return false;
  if (!(Number(exp) > Date.now())) return false;
  return same(sig, await sign(secret, `${version}.${exp}`));
}

/** A dónde volver después de entrar: solo rutas del portal, nunca otro sitio. */
export function safeNext(next: unknown): string {
  if (typeof next !== "string") return "/marca";
  return /^\/marca(?:\/[\w-]+)*\/?$/.test(next) ? next : "/marca";
}
