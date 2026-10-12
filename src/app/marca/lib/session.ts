/**
 * Acceso al portal de marca: una contraseña compartida (`MARCA_PASSWORD`, en
 * Vercel) y una cookie firmada con HMAC-SHA256. Sin dependencias: Web Crypto
 * corre igual en el middleware (Edge) que en una server action (Node).
 *
 * La clave de firma es la propia contraseña, así que cambiarla en Vercel cierra
 * todas las sesiones abiertas sin ningún otro paso.
 *
 * Cerrar todas las sesiones sin cambiar la contraseña: cambiar (o crear) la
 * variable opcional `MARCA_SESSION_EPOCH` en Vercel (cualquier texto, p. ej. la
 * fecha). Entra en lo que se firma, así que las cookies emitidas con otro valor
 * dejan de valer. Sin la variable, la firma es la de siempre (retrocompatible).
 * Ojo: "Salir" borra la cookie de ese navegador, pero una copia del token sigue
 * sirviendo hasta que vence (14 días) o hasta que cambie el epoch o la contraseña.
 *
 * Sin `MARCA_PASSWORD`: en local el portal queda abierto (para desarrollar) y en
 * producción queda cerrado. Nunca se publica abierto por olvido.
 */

export const SESSION_COOKIE = "vper_marca";
export const SESSION_DAYS = 14;
/** La cookie solo viaja a /marca: el resto del sitio no la ve. */
export const SESSION_PATH = "/marca";
export const LOGIN_PATH = "/ingresar";

const VERSION = "v1";
const enc = new TextEncoder();

export function marcaPassword(): string | undefined {
  const p = process.env.MARCA_PASSWORD?.trim();
  return p || undefined;
}

/** Época de las sesiones (opcional). Cambiarla invalida todas las cookies. */
function sessionEpoch(): string {
  return process.env.MARCA_SESSION_EPOCH?.trim() ?? "";
}

/** Lo que se firma: versión, vencimiento y, si existe, la época. */
function signed(version: string, exp: string): string {
  const epoch = sessionEpoch();
  return epoch ? `${version}.${exp}.${epoch}` : `${version}.${exp}`;
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
  return `${VERSION}.${exp}.${await sign(secret, signed(VERSION, String(exp)))}`;
}

export async function verifySession(
  token: string | undefined,
  secret: string,
): Promise<boolean> {
  if (!token) return false;
  const [version, exp, sig, extra] = token.split(".");
  if (version !== VERSION || !exp || !sig || extra !== undefined) return false;
  if (!/^\d+$/.test(exp) || !(Number(exp) > Date.now())) return false;
  return same(sig, await sign(secret, signed(version, exp)));
}

const SAFE_PATH = /^\/marca(?:\/[\w-]+)*\/?$/;

/**
 * A dónde volver después de entrar: solo rutas del portal, nunca otro sitio.
 * Se valida el path con una lista blanca estricta (sin "..", "//", "\\" ni
 * codificados); la query, si la hay, se re-arma con URLSearchParams para que
 * no traiga nada raro. Todo lo demás cae en /marca.
 */
export function safeNext(next: unknown): string {
  if (typeof next !== "string") return "/marca";
  const q = next.indexOf("?");
  const path = q === -1 ? next : next.slice(0, q);
  if (!SAFE_PATH.test(path)) return "/marca";
  if (q === -1) return path;
  const query = new URLSearchParams(next.slice(q + 1)).toString();
  return query ? `${path}?${query}` : path;
}

/** Ancla para volver a la misma sección (p. ej. #kit). Solo letras, números, - y _. */
export function safeHash(hash: unknown): string {
  return typeof hash === "string" && /^#[\w-]+$/.test(hash) ? hash : "";
}
