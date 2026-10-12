/**
 * Acceso al portal de marca: una contraseña por persona y una cookie firmada con
 * HMAC-SHA256. Sin dependencias: Web Crypto corre igual en el middleware (Edge)
 * que en una server action (Node).
 *
 * Dos variables en Vercel (Production y Preview):
 *
 * - `MARCA_USERS`: quién puede entrar. Una entrada por persona, separadas por
 *   coma o salto de línea: `correo:pbkdf2.<iteraciones>.<sal>.<hash>`. Nunca la
 *   contraseña en claro: la entrada se genera con
 *   `node scripts/marca-usuario.mjs correo@x.com`, que inventa la contraseña y
 *   la muestra una sola vez para mandársela a esa persona.
 * - `MARCA_SESSION_SECRET`: la clave que firma las cookies (texto largo al
 *   azar, `node scripts/marca-usuario.mjs --secreto`).
 *
 * Qué pasa cuando cambia algo:
 * - Sacar a alguien de `MARCA_USERS`: su sesión deja de valer en el próximo
 *   pedido (el middleware busca el correo en la lista cada vez).
 * - Cambiarle la contraseña a alguien (entrada nueva): se cierran solo sus
 *   sesiones, porque un pedazo de su hash entra en lo que se firma.
 * - Cambiar `MARCA_SESSION_SECRET` o la opcional `MARCA_SESSION_EPOCH`: se
 *   cierran las sesiones de todos, sin tocar las contraseñas.
 * Ojo: "Salir" borra la cookie de ese navegador, pero una copia del token sigue
 * sirviendo hasta que vence (14 días) o hasta alguno de los cambios de arriba.
 *
 * Cada ingreso queda en los logs de Vercel con el correo (`[marca] Ingresó …`).
 *
 * Sin `MARCA_USERS`: en local el portal queda abierto (para desarrollar) y en
 * producción queda cerrado. Nunca se publica abierto por olvido.
 */

export const SESSION_COOKIE = "vper_marca";
export const SESSION_DAYS = 14;
/** La cookie solo viaja a /marca: el resto del sitio no la ve. */
export const SESSION_PATH = "/marca";
export const LOGIN_PATH = "/ingresar";

/** v2: la cookie lleva el correo. Las v1 (contraseña compartida) ya no valen. */
const VERSION = "v2";
const enc = new TextEncoder();

/** Iteraciones de PBKDF2-SHA256 que usa el script (OWASP 2023). */
export const PBKDF2_ITERATIONS = 600_000;

export type MarcaUser = {
  email: string;
  iterations: number;
  salt: Uint8Array;
  /** Hash de la contraseña, en base64url. */
  hash: string;
};

/* ------------------------------------------------------------------ */
/* Variables de entorno                                                */
/* ------------------------------------------------------------------ */

export function normalizeEmail(email: unknown): string {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

const ENTRY = /^([^\s:,]+@[^\s:,]+):pbkdf2\.(\d+)\.([\w-]+)\.([\w-]+)$/;

let cache: { raw: string; users: Map<string, MarcaUser> } | undefined;

/** La lista de `MARCA_USERS`, por correo. Las entradas mal escritas se saltean. */
export function marcaUsers(): Map<string, MarcaUser> {
  const raw = process.env.MARCA_USERS?.trim() ?? "";
  if (cache?.raw === raw) return cache.users;
  const users = new Map<string, MarcaUser>();
  for (const entry of raw.split(/[\s,]+/).filter(Boolean)) {
    const m = ENTRY.exec(entry);
    if (!m) {
      // Solo el comienzo: que el log no muestre el hash entero.
      console.error(`[marca] Entrada inválida en MARCA_USERS: "${entry.slice(0, 24)}…"`);
      continue;
    }
    const [, email, iterations, salt, hash] = m;
    users.set(normalizeEmail(email), {
      email: normalizeEmail(email),
      iterations: Number(iterations),
      salt: fromB64url(salt!),
      hash: hash!,
    });
  }
  cache = { raw, users };
  return users;
}

export function sessionSecret(): string | undefined {
  const s = process.env.MARCA_SESSION_SECRET?.trim();
  return s || undefined;
}

/** Hay con qué entrar: al menos una persona y la clave de las cookies. */
export function isConfigured(): boolean {
  return marcaUsers().size > 0 && Boolean(sessionSecret());
}

/** En local y sin `MARCA_USERS`, el portal no pide nada. */
export function isOpenForDev(): boolean {
  return !process.env.MARCA_USERS?.trim() && process.env.NODE_ENV !== "production";
}

/** Época de las sesiones (opcional). Cambiarla invalida todas las cookies. */
function sessionEpoch(): string {
  return process.env.MARCA_SESSION_EPOCH?.trim() ?? "";
}

/* ------------------------------------------------------------------ */
/* Contraseñas                                                         */
/* ------------------------------------------------------------------ */

/** Sal fija para cuando el correo no existe: se hace el mismo trabajo igual. */
const DUMMY: MarcaUser = {
  email: "",
  iterations: PBKDF2_ITERATIONS,
  salt: new Uint8Array(16),
  hash: "A".repeat(43),
};

async function pbkdf2(password: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations },
    key,
    256,
  );
  return toB64url(new Uint8Array(bits));
}

/**
 * Devuelve la persona si correo y contraseña coinciden. Con un correo que no
 * está en la lista se calcula un hash igual, para que la demora no delate
 * qué correos existen.
 */
export async function checkCredentials(
  email: string,
  password: string,
): Promise<MarcaUser | null> {
  const user = marcaUsers().get(normalizeEmail(email));
  const ref = user ?? DUMMY;
  const got = await pbkdf2(password, ref.salt, ref.iterations);
  return same(got, ref.hash) && user ? user : null;
}

/* ------------------------------------------------------------------ */
/* Cookie de sesión                                                    */
/* ------------------------------------------------------------------ */

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

/** Lo que se firma: versión, vencimiento, correo, huella del hash y la época. */
function signed(exp: string, user: MarcaUser): string {
  const base = `${VERSION}.${exp}.${user.email}.${user.hash.slice(0, 16)}`;
  const epoch = sessionEpoch();
  return epoch ? `${base}.${epoch}` : base;
}

/** Token: `v2.<vence>.<correo en base64url>.<firma>`. */
export async function createSession(user: MarcaUser, secret: string): Promise<string> {
  const exp = String(Date.now() + SESSION_DAYS * 864e5);
  const who = toB64url(enc.encode(user.email));
  return `${VERSION}.${exp}.${who}.${await sign(secret, signed(exp, user))}`;
}

/** El correo de la sesión, o null si la cookie no vale (o esa persona ya no está). */
export async function verifySession(
  token: string | undefined,
  secret: string,
): Promise<string | null> {
  if (!token) return null;
  const [version, exp, who, sig, extra] = token.split(".");
  if (version !== VERSION || !exp || !who || !sig || extra !== undefined) return null;
  if (!/^\d+$/.test(exp) || !(Number(exp) > Date.now())) return null;
  let email: string;
  try {
    email = new TextDecoder().decode(fromB64url(who));
  } catch {
    return null;
  }
  const user = marcaUsers().get(email);
  if (!user) return null;
  return same(sig, await sign(secret, signed(exp, user))) ? email : null;
}

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

/** Comparación en tiempo constante para strings de igual largo. */
function same(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function toB64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
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
