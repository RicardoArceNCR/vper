import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    rules: {
      /**
       * `no-img-element` apagado a propósito (2026-08-29), no por pereza.
       *
       * Este repo es un preview: el sitio final lo arma el desarrollador
       * del cliente en **Vite**, y `docs/guia-desarrollador.md` le pide
       * portar `src/sections/` tal cual. `next/image` no existe fuera de
       * Next, así que cada `<Image />` que pusiéramos acá sería un
       * des-port manual del otro lado — le agregaríamos trabajo a él para
       * ganar nada acá.
       *
       * Lo que la regla quiere resolver ya está resuelto a mano:
       * `FadeInImage` fija `loading`, `fetchPriority` y `decoding` por
       * prop, y los 132 assets de `public/images` ya son WebP, que es la
       * conversión principal que haría el optimizador.
       *
       * Consecuencia: `next/image` no se usa en este repo. Si algún día se
       * usa, se borra esta regla en el mismo cambio — no se mezclan los
       * dos criterios.
       */
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
