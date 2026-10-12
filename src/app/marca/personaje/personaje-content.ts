// Lineamientos del PERSONAJE de VPER: vpercito.
//
// Escrito el 2026-10-12 a partir del render que entregó diseño
// (public/images/vpercito/vpercito-original.png), de las guías de voz e
// imagen y de una revisión de dirección de arte sobre dónde ubicarlo en el
// sitio. Las ubicaciones con `estado: "pendiente"` son la lista de trabajo,
// no están aplicadas.

export interface Regla {
  titulo: string;
  regla: string;
}

export interface Lugar {
  donde: string;
  como: string;
  copy?: string;
  estado: "aplicado" | "pendiente";
}

export interface Pose {
  nombre: string;
  para: string;
  estado: "lista" | "pedir";
}

export const PERSONAJE = {
  resumen:
    "vpercito es el robot de VPER: cabeza de monitor sky, cara de LEDs amber, botón clay y cuerpo negro mate. Es el anfitrión de los momentos de transición: aparece cuando alguien se pierde, espera o termina algo. Nunca cuando tiene que mirar el trabajo de un cliente. Es el guiño del bloque hecho personaje, no un logo de reemplazo.",

  ficha: [
    { k: "Nombre", v: "vpercito (en minúscula, también al inicio de frase)" },
    { k: "Papel", v: "Anfitrión de transiciones" },
    { k: "Carácter", v: "Curioso, servicial, un poco torpe con las puertas" },
    { k: "Colores", v: "Sky, amber y clay de la paleta VPER, sobre negro" },
    { k: "Técnica", v: "3D vinyl toy. Set propio: no se mezcla con otros íconos" },
  ],

  principios: [
    {
      titulo: "Aparece en las transiciones",
      regla:
        "404, envío de un formulario, estados vacíos, carga. Es donde una persona necesita un guiño y no hay trabajo de cliente compitiendo por la mirada.",
    },
    {
      titulo: "La idea sigue siendo la protagonista",
      regla:
        "vpercito acompaña al titular, no lo reemplaza. El mensaje lo da el texto; él pone la cara. Si se lo saca y la pantalla deja de entenderse, está mal usado.",
    },
    {
      titulo: "No habla",
      regla:
        "Sin globos de diálogo ni primera persona del robot. El copy sigue siendo de VPER, en plural y de vos (guía de voz). Lo que cambia es su pose y su cara de LEDs.",
    },
    {
      titulo: "Uno por pantalla",
      regla:
        "Una sola aparición por vista y nunca dos poses juntas. Si ya hay un guiño en el bloque (Houdini en Metodología), no se suma otro.",
    },
  ] satisfies Regla[],

  lugares: [
    {
      donde: "Página 404",
      como: "Centrado sobre el titular, flotando 6 px. 128 px en mobile, 200 px en desktop: el titular manda. Hoy con la pose «saludando»; cambia a «buscando» cuando exista.",
      copy: "ESTA PÁGINA SE NOS ESCAPÓ. Las buenas ideas nunca se quedan quietas; por lo visto, esta página tampoco.",
      estado: "aplicado",
    },
    {
      donde: "Envío del formulario de contacto",
      como: "Reemplaza al formulario dentro de la misma card oscura. 120 px en mobile, 180 px en desktop. Se carga solo al enviar. Hoy el envío es un alert() del navegador.",
      copy: "Listo, ya nos llegó. Te escribimos pronto.",
      estado: "pendiente",
    },
    {
      donde: "Contacto, asomándose (solo desktop xl)",
      como: "Cabeza y mano saliendo del borde superior derecho de la card, ~140 px, entra una vez con el scroll. Necesita la pose «asomándose». Medir PageSpeed mobile antes y después.",
      estado: "pendiente",
    },
    {
      donde: "Marca VPER (esta página)",
      como: "Lineamientos y kit de descarga.",
      estado: "aplicado",
    },
  ] satisfies Lugar[],

  dondeNo: [
    "Hero de la home: la foto LCP es del cliente y es lo que mide PageSpeed. vpercito le robaría el primer segundo.",
    "Trabajos, páginas de proyecto y cinta de logos: son territorio del cliente. Al lado de Flor de Caña, un juguete achica el ticket.",
    "Metodología: ya tiene su guiño (Houdini) y su set de íconos 3D de vidrio. Dentro de un set no se mezclan técnicas.",
    "Equipo: junto a retratos reales en blanco y negro, el robot gana la comparación, y no a favor del equipo.",
    "Header, favicon o en lugar del logo: el logo no se reemplaza. vpercito no es un isotipo.",
    "Burbuja de chat flotante: promete un asistente que no existe.",
    "Firma de correo personal: ver «En el correo», más abajo.",
  ],

  uso: [
    {
      titulo: "Sobre oscuro, siempre con halo",
      regla:
        "El cuerpo es negro mate y sobre --background-page negro desaparece. El componente `<Vpercito />` pone un halo sky detrás por defecto (clase `vpercito-halo`). En claro el halo baja y suma sombra de contacto.",
    },
    {
      titulo: "Tamaño mínimo",
      regla:
        "96 px de ancho en pantalla, 128 px en emoji de Slack. Más chico la cara de LEDs deja de leerse; ahí se usa el monograma, no el robot.",
    },
    {
      titulo: "Sin recolorear ni deformar",
      regla:
        "No cambiar el sky de la cabeza, no teñirlo con el degradé VPER, no estirarlo, no recortarle los pies (salvo la pose «asomándose», que ya viene recortada).",
    },
    {
      titulo: "Movimiento corto",
      regla:
        "Flotado de 6 px en 4 s o una entrada única. Solo transform, nunca sobre el <img>. Con prefers-reduced-motion queda quieto.",
    },
    {
      titulo: "Texto alternativo",
      regla:
        "alt vacío si el titular ya dice todo (es lo normal). Si va solo, describí la pose: «vpercito, el robot de VPER, saludando».",
    },
    {
      titulo: "Nunca el PNG en el sitio",
      regla:
        "El master pesa 740 KB. En la web va `<Vpercito />`, que sirve AVIF/WebP de 240, 480 o 720 px (7 a 41 KB). El PNG es para presentaciones y Office.",
    },
  ] satisfies Regla[],

  poses: [
    { nombre: "Saludando", para: "Bienvenida, avatar, presentaciones", estado: "lista" },
    { nombre: "Neutral", para: "Base para cualquier pieza nueva", estado: "pedir" },
    { nombre: "Buscando", para: "404 (LEDs «?» o mirando al costado)", estado: "pedir" },
    { nombre: "Pulgar arriba", para: "Envío exitoso (LEDs ✓ o ^ ^)", estado: "pedir" },
    { nombre: "Asomándose", para: "Desde el borde de una card", estado: "pedir" },
    {
      nombre: "Señalando izq. / der.",
      para: "Llevar la mirada a un botón",
      estado: "pedir",
    },
    { nombre: "Tecleando", para: "Estado «enviando…» y cargas", estado: "pedir" },
  ] satisfies Pose[],

  pedidoIlustrador:
    "Misma cámara, luz y escala que el saludo, fondo transparente, 2048 px de lado largo. Todas con un rim light frío (sky) en el contorno para que el cuerpo no se pierda sobre negro. Y la pantalla de LEDs como capa aparte (PNG o SVG): con un solo cuerpo se cambia la expresión sin pedir un render nuevo.",

  firmas:
    "En la firma personal, no: aparece en cada correo (el guiño se vuelve muletilla), compite con la persona que firma y en un hilo de presupuesto resta seriedad. Sí en la respuesta automática de fuera de oficina (una transición de verdad) y en banners de campaña con fecha de baja: 480×120 (archivo 960×240), fondo negro horneado con el halo, vpercito a ~100 px de alto, texto en HTML y PNG cuantizado a ≤ 30 KB.",

  pendientes: [
    {
      donde: "src/sections/contact-section.tsx:93",
      que: "El envío exitoso es un `alert()` del navegador: el pico emocional del sitio es una ventana del sistema.",
      propuesta:
        "Estado de éxito dentro de la card con vpercito (pose «pulgar arriba») y «Listo, ya nos llegó. Te escribimos pronto.». Va junto con la integración real del envío.",
    },
    {
      donde: "src/sections/contact-section.tsx:147",
      que: "El placeholder del mensaje dice «Cuéntanos sobre tu proyecto...»: tuteo en un sitio de vos.",
      propuesta: "«Contanos sobre tu proyecto…».",
    },
    {
      donde: "public/images/vpercito/",
      que: "Hay una sola pose y el cuerpo se pierde sobre negro sin el halo de CSS.",
      propuesta: "Pedir las poses de la lista con rim light horneado (ver «Poses»).",
    },
  ],
};
