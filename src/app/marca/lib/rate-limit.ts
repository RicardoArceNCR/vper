/**
 * Límite de intentos del login de Marca VPER: 5 intentos fallidos por IP cada
 * 15 minutos (ventana deslizante). Pasado el límite, el login rechaza sin
 * evaluar la contraseña.
 *
 * El intento se anota ANTES de comprobar la contraseña y se borra si salió
 * bien: así 100 envíos simultáneos no pasan todos juntos mientras la primera
 * comprobación todavía no terminó (lo que sí pasaba con solo el retardo).
 *
 * LÍMITE CONOCIDO: el contador vive en la memoria de la instancia. En Vercel
 * (serverless) cada instancia tiene el suyo y se pierde al reciclarla, así que
 * esto frena a un atacante casual, no a uno que reparte pedidos entre
 * instancias. La defensa completa es una regla de rate limit del firewall de
 * Vercel (WAF) sobre `POST /ingresar` (p. ej. 10 pedidos por minuto por IP).
 * Este archivo es la segunda capa, no la única.
 */

export const MAX_FAILS = 5;
export const WINDOW_MS = 15 * 60 * 1000;
/** Tope de IPs recordadas: que una lluvia de IPs no infle la memoria sin fin. */
const MAX_KEYS = 5000;

const fails = new Map<string, number[]>();

function recent(key: string, now: number): number[] {
  const list = (fails.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length) fails.set(key, list);
  else fails.delete(key);
  return list;
}

function prune(now: number) {
  if (fails.size < MAX_KEYS) return;
  for (const key of fails.keys()) recent(key, now);
  // Si sigue lleno, se van las más viejas (Map conserva el orden de alta).
  for (const key of fails.keys()) {
    if (fails.size < MAX_KEYS) break;
    fails.delete(key);
  }
}

export type Gate = { ok: true; release: () => void } | { ok: false; retryMin: number };

/**
 * Pide permiso para un intento. Si hay lugar, lo anota como fallido de entrada
 * y devuelve `release()` para borrarlo cuando la contraseña resulte correcta.
 */
export function tryAttempt(key: string, now = Date.now()): Gate {
  prune(now);
  const list = recent(key, now);
  if (list.length >= MAX_FAILS) {
    const retryMs = list[0]! + WINDOW_MS - now;
    return { ok: false, retryMin: Math.max(1, Math.ceil(retryMs / 60000)) };
  }
  const stamp = now;
  list.push(stamp);
  fails.set(key, list);
  return {
    ok: true,
    release: () => {
      // Entró: se limpia el historial de esa IP (los errores de antes ya no cuentan).
      fails.delete(key);
    },
  };
}

/** IP del cliente según el proxy de Vercel. Sin cabeceras, un único balde. */
export function clientKey(h: Headers): string {
  const fwd = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || h.get("x-real-ip")?.trim() || "sin-ip";
}
