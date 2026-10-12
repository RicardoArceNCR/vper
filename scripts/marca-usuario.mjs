#!/usr/bin/env node
/**
 * Alta de personas para el portal Marca VPER (/marca).
 *
 *   node scripts/marca-usuario.mjs ana@vpermedia.com [otro@gmail.com …]
 *   node scripts/marca-usuario.mjs --secreto
 *
 * Por cada correo inventa una contraseña, la muestra UNA vez (para mandársela a
 * esa persona por un canal privado) e imprime la entrada para `MARCA_USERS` en
 * Vercel. La contraseña no se guarda en ningún lado: solo su hash.
 *
 * Para cambiarle la contraseña a alguien: correr esto con su correo y
 * reemplazar su entrada. Para sacarlo: borrar su entrada. Detalle en
 * src/app/marca/lib/session.ts.
 */
import { pbkdf2Sync, randomBytes, randomInt } from "node:crypto";

const ITERATIONS = 600_000; // = PBKDF2_ITERATIONS en session.ts
// Sin 0/o, 1/l/i: se dicta y se copia sin confusiones.
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

const b64url = (buf) => Buffer.from(buf).toString("base64url");

function password() {
  // 4 grupos de 4 → ~79 bits: sobra contra cualquier intento por la web.
  return Array.from({ length: 4 }, () =>
    Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join(""),
  ).join("-");
}

const args = process.argv.slice(2);

if (args.includes("--secreto")) {
  console.log("\nMARCA_SESSION_SECRET (pegalo en Vercel, no lo compartas):\n");
  console.log(b64url(randomBytes(32)) + "\n");
  process.exit(0);
}

const emails = args.map((e) => e.trim().toLowerCase()).filter(Boolean);
if (!emails.length || emails.some((e) => !/^[^\s:,]+@[^\s:,]+$/.test(e))) {
  console.error("Uso: node scripts/marca-usuario.mjs correo@x.com [otro@y.com …]");
  console.error("     node scripts/marca-usuario.mjs --secreto");
  process.exit(1);
}

const entries = [];
console.log("\nContraseñas (se muestran una sola vez; mandalas por privado):\n");
for (const email of emails) {
  const pw = password();
  const salt = randomBytes(16);
  const hash = pbkdf2Sync(pw, salt, ITERATIONS, 32, "sha256");
  entries.push(`${email}:pbkdf2.${ITERATIONS}.${b64url(salt)}.${b64url(hash)}`);
  console.log(`  ${email.padEnd(32)} ${pw}`);
}
console.log("\nValor para MARCA_USERS (copiá esta línea entera y pegala en Vercel):\n");
console.log(entries.join(",") + "\n");
console.log("Si ya hay personas cargadas, agregala al final del valor actual con una coma.\n");
