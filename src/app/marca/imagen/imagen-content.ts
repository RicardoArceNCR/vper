// Lineamientos de IMAGEN (fotografía) e ICONOGRAFÍA de VPER Media.
//
// Derivados del sitio tal como está hoy (2026-10-09), no de un estilo
// nuevo: cada regla sale de una foto o un ícono que ya se publica, y cada
// `src` es una ruta real bajo /public. Si cambia el material del sitio,
// este archivo se revisa contra el material, no al revés.
//
// Fuentes leídas: ver `IMAGEN.fuentes` al final.

export interface Principio {
  titulo: string;
  regla: string;
}

export interface Foto {
  src: string;
  alt: string;
  proyecto: string;
  nota: string;
}

export interface Icono {
  src: string;
  nombre: string;
  uso: string;
}

export interface SetIconos {
  nombre: string;
  descripcion: string;
  cuando: string;
  iconos: Icono[];
}

export const IMAGEN: {
  resumen: string;
  fotografia: {
    principios: Principio[];
    ejemplos: Foto[];
    evitar: string[];
    tecnico: Principio[];
  };
  iconografia: {
    principios: Principio[];
    sets: SetIconos[];
    reglas: Principio[];
  };
  inconsistencias: { donde: string; que: string; propuesta: string }[];
  fuentes: string[];
} = {
  resumen:
    "En imagen, VPER se ve en clave baja: fondos que caen a negro, una sola luz dirigida y un único color saturado que viene de la marca del cliente (el rojo de una lata, el ámbar de la madera, el neón magenta y azul de un retrato). El encuadre es cerrado y táctil (rostros que miran a cámara, manos trabajando, producto que sangra por el borde) y la paleta propia de VPER (sky → clay → amber) nunca tiñe la foto: vive en la interfaz que la rodea, como anillo de hover, título en degradé o textura de radios. La única foto 'de casa' es la del equipo: blanco y negro, retrato a la altura del pecho sobre gris claro con el wordmark VPER gigante detrás.",

  fotografia: {
    principios: [
      {
        titulo: "Luz: clave baja, una sola fuente",
        regla:
          "La luz entra por un lado o desde arriba y deja caer el resto del cuadro a negro: el humidor iluminado desde la izquierda (hero-tabaco), las latas con sombra profunda entre ellas (hero-tomatola), el letrero retroiluminado de WOK en un pasillo en penumbra. Si la foto necesita relleno, se rellena con color de marca del cliente (neón, cálido de madera), no con luz blanca pareja. La excepción registrada es el producto sobre un plano de color sólido (Toma-Tola sobre verde, latas sobre rojo y amarillo), que se ilumina parejo pero conserva la sombra dura bajo el objeto.",
      },
      {
        titulo: "Color: un tono saturado dominante, el resto neutro u oscuro",
        regla:
          "Cada foto tiene un color protagonista y uno solo: rojo Toma-Tola, ámbar y madera en Monumental Humidors, magenta y azul eléctrico en el retrato de NetForemost, verde lima en Oh! La Lashes. Ese color sale del producto o de la identidad del cliente, nunca de la paleta VPER. Lo que no es el color protagonista se resuelve en negro, madera oscura o gris.",
      },
      {
        titulo: "Encuadre: cerrado, horizontal y con el sujeto llenando el cuadro",
        regla:
          "Plano cerrado o detalle macro antes que plano general: un ojo, un pin en la solapa, la mano que saca un puro, latas apiladas que se salen por los cuatro bordes. Las láminas de proyecto son horizontales 16:9. En el hero de la home el tercio inferior queda libre de información, porque el sitio le pone encima un degradé a negro del 28 % del alto y el titular.",
      },
      {
        titulo: "Contraste: negros profundos, sin grises lavados",
        regla:
          "Las sombras llegan a negro real y los brillos quedan en el producto (metal de la lata, vidrio de la botella, lente de los anteojos). Esto es lo que permite poner texto blanco directo sobre la foto en el hero, con solo una sombra de texto y el degradé inferior, sin cajas ni velos de color.",
      },
      {
        titulo: "Personas y producto: mirada a cámara o manos en acción",
        regla:
          "Cuando hay una persona, o mira de frente a cámara (retrato del hero, retratos del equipo) o está haciendo algo con las manos (el artesano de Monumental, la técnica de Oh! La Lashes, la mano con el puro). El producto se muestra en uso o en su contexto real (cooler, bodega de barricas, letrero en el local), no aislado sobre blanco.",
      },
      {
        titulo: "Tratamiento: la foto del cliente intacta; el equipo en blanco y negro",
        regla:
          "Sobre fotos de clientes no se aplican filtros, tintes ni el degradé de VPER: la marca VPER aparece alrededor (anillo cónico sky → clay → amber al hover, título con `title-brand-gradient`, textura de radios en la sección). El movimiento también es del contenedor: zoom suave al hover (1.05 en cards de proyecto, 1.06 en equipo) y Ken Burns de 1 a 1.08 en 6 s en el hero. Las fotos de equipo son la excepción: blanco y negro, fondo gris claro con las letras VPER gigantes en gris medio y la parte baja que funde a oscuro.",
      },
    ],

    ejemplos: [
      {
        src: "/images/hero-face-mobile.webp",
        alt: "Retrato frontal con anteojos transparentes iluminado con neón magenta y azul sobre fondo negro",
        proyecto: "NetForemost (primer slide del hero de la home)",
        nota: "La regla completa en una imagen: fondo negro, dos luces de color que vienen de la marca del cliente, mirada directa a cámara y encuadre tan cerrado que el rostro llena el ancho. Además es el LCP de la home, así que define la primera impresión del sitio.",
      },
      {
        src: "/images/hero-tabaco-mobile.webp",
        alt: "Mano sacando un puro de un humidor de madera abierto, en penumbra",
        proyecto: "Monumental Humidors (hero de la home)",
        nota: "Luz lateral sobre la madera y todo lo demás a negro. Fijate en las manos como sujeto: no hace falta mostrar la cara para que haya persona.",
      },
      {
        src: "/images/hero-tomatola-mobile.webp",
        alt: "Latas rojas de Toma-Tola apiladas en primer plano",
        proyecto: "Toma-Tola (hero de la home)",
        nota: "Producto que sangra por los cuatro bordes y un solo color (rojo). Mirá cómo el tercio inferior ya funde a negro: es donde el sitio pone el degradé y el titular.",
      },
      {
        src: "/images/toma-tola-hero.webp",
        alt: "Lata Deliciously Hot sobre fondo verde con tomates al pie",
        proyecto: "Toma-Tola",
        nota: "El otro registro válido: producto centrado sobre un plano de color saturado y plano. El fondo es el complementario del producto (verde contra rojo), no un gris neutro.",
      },
      {
        src: "/images/monumental-humidors-hero.webp",
        alt: "Pin dorado MH en la solapa de un saco oscuro",
        proyecto: "Monumental Humidors",
        nota: "Detalle macro: la marca aparece en un objeto usado por una persona, no como logo plano. Paleta de dos tonos (dorado y negro).",
      },
      {
        src: "/images/monumental-humidors-12.webp",
        alt: "Artesano sonriendo en el taller con camiseta de la marca",
        proyecto: "Monumental Humidors",
        nota: "Persona en acción con luz cálida lateral y fondo en penumbra. Es la versión 'gente real' del estilo: el mismo clima que el producto.",
      },
      {
        src: "/images/wok-12.webp",
        alt: "Letrero retroiluminado de WOK con faroles chinos en un pasillo en penumbra",
        proyecto: "WOK Cantonese Kitchen",
        nota: "La única luz es la del propio letrero y los faroles. Mostrar la marca en su lugar real, encendida, en vez de un render sobre blanco.",
      },
      {
        src: "/images/flor-de-cana-02.webp",
        alt: "Botella de Flor de Caña sobre barrica en una bodega con luz cálida",
        proyecto: "Flor de Caña",
        nota: "Fondo desenfocado y oscuro, un solo brillo cálido sobre el vidrio. Comparalo con flor-de-cana-01 (volcán a contraluz): mismo producto, pero acá el fondo cae a oscuro y el producto manda.",
      },
      {
        src: "/images/team-karen.webp",
        alt: "Retrato en blanco y negro de una integrante del equipo, sonriendo, sobre fondo gris con letras VPER",
        proyecto: "Equipo VPER (sección Nosotros)",
        nota: "Plantilla de la foto de equipo: blanco y negro, a la altura del pecho, mirada a cámara, cabeza en el tercio superior (el sitio recorta con object-top) y el wordmark VPER gigante en gris detrás.",
      },
    ],

    evitar: [
      "Producto recortado sobre blanco infinito con luz pareja y sin sombra: el sitio no tiene una sola foto de catálogo así, y al lado de las demás se lee como stock.",
      "Texto, logo o producto importante en el tercio inferior de un hero de la home: ahí el sitio pinta un degradé a negro del 28 % del alto más el titular y el CTA.",
      "Teñir fotos de clientes con el degradé sky → clay → amber, ponerles un velo de color o un filtro de marca VPER: la paleta de VPER va en el anillo, el título y la textura, no sobre la foto.",
      "Dos o más colores saturados compitiendo en el mismo cuadro, o fondos grises lavados sin negro real: rompen el contraste del que depende el texto blanco del hero.",
      "Fotos de equipo en color, con fondo de oficina o en plano general: las ocho fotos actuales son blanco y negro, a la altura del pecho, sobre el mismo fondo con letras VPER.",
      "Imágenes genéricas de stock sin el producto o la marca del cliente (gente en reuniones, manos sobre un teclado): fueron justamente los placeholders que se sacaron del portafolio en 2026-08.",
    ],

    tecnico: [
      {
        titulo: "Formato",
        regla:
          "Todo el material fotográfico va en WebP (los héroes de la home a calidad ~78). No se usa `next/image`: el sitio se porta a Vite, así que `loading`, `fetchPriority` y `decoding` se fijan a mano en el `<img>`.",
      },
      {
        titulo: "Hero de la home",
        regla:
          "Dos recortes por slide servidos con `<picture>`: desktop horizontal con tope de 3840 px de ancho (2× de 1920) y mobile vertical de 960×1510. El primer retrato (hero-face) es el LCP: carga sin lazy y no se anima hasta que el navegador registró el LCP.",
      },
      {
        titulo: "Héroes de proyecto (vitrina y detalle)",
        regla:
          'Tope 1024×576 (16:9) para `{proyecto}-hero.webp`, más una versión `{proyecto}-hero-sm.webp` de 640×360 para el `srcset` de la card. La card recorta a 11/6 (3/2 en la vitrina mobile), así que el contenido importante no puede ir pegado a los bordes. En la home, `loading="lazy"`; prioridad solo en las primeras cards de /work.',
      },
      {
        titulo: "Galería de proyecto",
        regla:
          "Una columna, cada imagen a su alto natural, sin `object-cover` ni proporción impuesta: se publica la lámina completa. Nombre `{proyecto}-{nn}.webp` en el orden original del material del cliente (si falta un número, como el -02, se respeta el hueco).",
      },
      {
        titulo: "Equipo",
        regla:
          'Retrato vertical 3:4 de ~966×1293 px (no 1930), `loading="lazy"` con `width` y `height`, recortado con `object-top` dentro de una caja `aspect-[3/4]` con radio 2xl. Nombre `team-{nombre}.webp`.',
      },
      {
        titulo: "Textura de sección (radios VPER)",
        regla:
          "Cuatro recortes por tema: `bg-horizontal.webp` / `bg-horizontal-l.webp` a 1816×1025 para desktop y `bg-mobile.webp` / `bg-mobile-l.webp` a 1696×2528 para mobile; el sufijo `-l` es el tema claro. Se aplican solo con la clase `bg-brand-texture` (token `--brand-section-texture`), nunca como `<img>`.",
      },
    ],
  },

  iconografia: {
    principios: [
      {
        titulo: "Un dibujo por set, sin mezclar trazo y relleno",
        regla:
          "Cada set tiene una sola técnica: los íconos de servicios son de trazo (contorno de grosor uniforme y terminales redondeadas), los glifos de proceso son silueta rellena sin contorno, la interfaz usa lucide (trazo de 2 px, esquinas redondeadas) y el proceso en pantalla es 3D de vidrio. Dentro de un set no hay íconos de otra técnica.",
      },
      {
        titulo: "Esquinas y terminales redondeadas",
        regla:
          "Todos los sets en uso redondean: los extremos del trazo en servicios y lucide, las puntas de los glifos (la flecha, el cohete, los corchetes de `code`) y los bordes biselados del 3D. No hay ícono en uso con esquinas vivas a 90°.",
      },
      {
        titulo: "Monocromo, con el color puesto por el contexto",
        regla:
          "Cada ícono es de un solo color. En servicios el trazo usa el tono fuerte y la baldosa el mismo tono en claro: ámbar sobre `--color-main-200` (Creatividad, Audiovisual), cielo sobre `--color-info-300` (Branding, ATL & BTL) y verde agua sobre `--color-leaf-200` (Digital & Web, Planeación). En interfaz el ícono hereda `currentColor` (`text-foreground`, `text-primary`). El 3D toma `--brand-sky`; la única excepción de color es la llama naranja del cohete.",
      },
      {
        titulo: "Siempre dentro de un contenedor",
        regla:
          "Ningún ícono flota suelto: va en una baldosa `rounded-xl` de 48–56 px (servicios), en un cuadro de 48 px con borde y `--radius-md` (contacto), en un círculo de 36–44 px con borde (flechas de proyecto, redes sociales) o dentro del anillo circular del proceso. El contenedor es el que recibe el hover (borde a `primary`, anillo cónico, glow), no el ícono.",
      },
      {
        titulo: "Escala por función",
        regla:
          "Interfaz de 14 a 22 px (14 en el paginador, 16–18 en flechas y tema, 20 en redes, 22 en contacto y play). Servicios: dibujo de ~36 px dentro de la baldosa de 48/56 px. Proceso: caja de 128 px en mobile, 176 px en tablet y 224 px en desktop. Un ícono de un set no se usa a la escala de otro.",
      },
    ],

    sets: [
      {
        nombre: "Servicios (ilustrativos de trazo)",
        descripcion:
          "Seis íconos de contorno, de trazo medio y uniforme con terminales redondeadas, cada uno en un solo color (cielo, ámbar o verde agua) y apoyado en una baldosa del mismo tono en claro. Hoy son WebP de 80 px con el color ya horneado.",
        cuando:
          "Solo para nombrar uno de los seis servicios de `lib/services.ts`, en la grilla de servicios. Uno por servicio, siempre el mismo.",
        iconos: [
          {
            src: "/images/service-creatividad.webp",
            nombre: "Creatividad (foco)",
            uso: "Card Creatividad. Trazo ámbar sobre baldosa `--color-main-200`.",
          },
          {
            src: "/images/service-branding.webp",
            nombre: "Branding (pluma con curva Bézier)",
            uso: "Card Branding. Trazo cielo sobre baldosa `--color-info-300`.",
          },
          {
            src: "/images/service-digital.webp",
            nombre: "Digital & Web (globo)",
            uso: "Card Digital & Web. Trazo verde agua sobre baldosa `--color-leaf-200`.",
          },
          {
            src: "/images/service-planeacion.webp",
            nombre: "Planeación Estratégica (diana)",
            uso: "Card Planeación Estratégica. Trazo verde agua sobre baldosa `--color-leaf-200`.",
          },
          {
            src: "/images/service-audiovisual.webp",
            nombre: "Audiovisual (claqueta)",
            uso: "Card Audiovisual. Trazo ámbar sobre baldosa `--color-main-200`.",
          },
          {
            src: "/images/service-atl.webp",
            nombre: "ATL & BTL (megáfono)",
            uso: "Card ATL & BTL. Trazo cielo sobre baldosa `--color-info-300`.",
          },
        ],
      },
      {
        nombre: "Proceso 3D (vidrio azul)",
        descripcion:
          "Cinco objetos 3D (GLB) con material de vidrio: color base `--brand-sky`, fresnel claro en los bordes, brillo violáceo en la parte baja y glow difuso alrededor; el cohete suma una llama naranja. Giran lento en reposo y más rápido al hover. Cuando hay movimiento reducido o el bloque todavía no se acercó al viewport, se muestra su render plano en WebP (768×764, fondo negro), que es el `src` de esta lista.",
        cuando:
          "Solo en la sección Metodología, un objeto por paso (Preguntar, Pensar, Crear, Hacer, Aprender), dentro del anillo circular con `hover-brand-ring-thick`. No se usa en cards chicas ni como ícono de interfaz.",
        iconos: [
          {
            src: "/images/process-investigacion.webp",
            nombre: "Preguntar (lupa)",
            uso: "Paso 1. Modelo `/lab/proceso/preguntar.glb`.",
          },
          {
            src: "/images/process-estrategia.webp",
            nombre: "Pensar (caballo de ajedrez)",
            uso: "Paso 2. Modelo `/lab/proceso/pensar.glb`; es la referencia de escala óptica (visualScale 1).",
          },
          {
            src: "/images/process-diseno.webp",
            nombre: "Crear (pluma estilográfica)",
            uso: "Paso 3. Modelo `/lab/proceso/crear.glb`.",
          },
          {
            src: "/images/process-desarrollo.webp",
            nombre: "Hacer (hexágono)",
            uso: "Paso 4. Modelo `/lab/proceso/hacer.glb`.",
          },
          {
            src: "/images/process-entrega.webp",
            nombre: "Aprender (cohete)",
            uso: "Paso 5. Modelo `/lab/proceso/aprender.glb`, el único con llama naranja.",
          },
        ],
      },
      {
        nombre: "Glifos de proceso (silueta rellena)",
        descripcion:
          "Siluetas planas en blanco, sin contorno, de formas gruesas y redondeadas (exportadas de Illustrator). Están declaradas como `svg` de cada paso en `lab/proceso/icons.ts` para extruirlas a 3D, pero hoy los cinco pasos usan el GLB, así que no se ven en pantalla.",
        cuando:
          "Como molde para extrusión 3D o, si se usan planos, en blanco sobre fondo oscuro y a tamaño de ilustración (64 px o más), nunca como ícono de interfaz.",
        iconos: [
          {
            src: "/images/lupa.svg",
            nombre: "Lupa con gráfico de barras",
            uso: "Preguntar (fuente SVG, sin uso visible).",
          },
          {
            src: "/images/flecha.svg",
            nombre: "Flecha ascendente curva",
            uso: "Pensar (fuente SVG, sin uso visible; el GLB es un caballo).",
          },
          {
            src: "/images/pluma.svg",
            nombre: "Pluma",
            uso: "Crear (fuente SVG, sin uso visible).",
          },
          {
            src: "/images/code.svg",
            nombre: "Corchetes de código",
            uso: "Hacer (fuente SVG, sin uso visible; el GLB es un hexágono).",
          },
          {
            src: "/images/cohete.svg",
            nombre: "Cohete con humo",
            uso: "Aprender (fuente SVG, sin uso visible).",
          },
          {
            src: "/images/arrow-2.svg",
            nombre: "Flecha circular de retorno",
            uso: "Mismo dibujo que los anteriores; no está referenciada en `src/`.",
          },
        ],
      },
      {
        nombre: "Interfaz (lucide-react)",
        descripcion:
          "Íconos de trazo de lucide con su grosor por defecto (2 px) y terminales redondeadas, en `currentColor`. Son los únicos que se ven en tamaño de texto.",
        cuando:
          "Acciones, navegación y datos de contacto: abrir un proyecto, paginar, volver, cambiar tema, redes, teléfono, correo, descargas del portal /marca. Nunca para representar un servicio ni un paso del proceso.",
        iconos: [
          {
            src: "lucide:ArrowUpRight",
            nombre: "ArrowUpRight",
            uso: "Badge de la card de proyecto (18 px, aparece al hover), 'Ver todos los proyectos' (16 px) y enlaces externos del portal.",
          },
          {
            src: "lucide:ArrowLeft",
            nombre: "ArrowLeft / ArrowRight",
            uso: "Paginador de proyectos (14 px) y volver al índice desde el detalle.",
          },
          {
            src: "lucide:LayoutGrid",
            nombre: "LayoutGrid",
            uso: "Paginador: ir al índice de /work (14 px).",
          },
          {
            src: "lucide:Play",
            nombre: "Play",
            uso: "Botón de video del hero de proyecto (22 px dentro de un círculo de 64 px).",
          },
          {
            src: "lucide:ChevronDown",
            nombre: "ChevronDown",
            uso: "Desplegar la bio en las cards de equipo y el menú mobile del portal.",
          },
          {
            src: "lucide:Phone",
            nombre: "Phone / Mail / MapPin",
            uso: "Datos de contacto (22 px en cuadro de 48 px con borde, color `primary`).",
          },
          {
            src: "lucide:Instagram",
            nombre: "Facebook / Instagram / Linkedin",
            uso: "Redes del footer (20 px en círculo de 44 px con borde).",
          },
          {
            src: "lucide:Sun",
            nombre: "Sun / Moon",
            uso: "Cambio de tema claro/oscuro (18 px).",
          },
          {
            src: "lucide:Download",
            nombre: "Download / LoaderCircle / Check",
            uso: "Descargas del portal /marca (logo y kit de firmas) y su estado.",
          },
        ],
      },
      {
        nombre: "Ilustraciones de línea fina (en archivo, sin uso)",
        descripcion:
          "Cinco ilustraciones blancas de trazo fino y mucho detalle (isométricas, con elementos secundarios como cubos, estrellas o laberintos). Están en /public/images pero ningún archivo de `src/` las referencia.",
        cuando:
          "Hoy en ningún lado. Si se recuperan, solo como ilustración grande de sección sobre fondo oscuro, nunca junto a los íconos de servicios (el grosor y el nivel de detalle no conviven).",
        iconos: [
          {
            src: "/images/icon-1.svg",
            nombre: "Bloques y corchetes de código",
            uso: "Sin uso. Temática de desarrollo.",
          },
          {
            src: "/images/icon-2.svg",
            nombre: "Navegador con lupa y gráficos",
            uso: "Sin uso. Temática de investigación y datos.",
          },
          {
            src: "/images/icon-3.svg",
            nombre: "Cohete con flecha de crecimiento",
            uso: "Sin uso. Temática de lanzamiento.",
          },
          {
            src: "/images/icon-4.svg",
            nombre: "Rey de ajedrez sobre laberinto",
            uso: "Sin uso. Temática de estrategia.",
          },
          {
            src: "/images/icon-5.svg",
            nombre: "Gema con lápiz y paleta",
            uso: "Sin uso. Temática de diseño.",
          },
        ],
      },
    ],

    reglas: [
      {
        titulo: "Un set por superficie",
        regla:
          "La grilla de servicios usa solo íconos de servicios, Metodología usa solo el 3D de proceso y la interfaz usa solo lucide. Lucide puede convivir con los otros sets en la misma página, pero no en la misma fila ni en el mismo rol.",
      },
      {
        titulo: "El degradé de marca va en el contenedor, no en el ícono",
        regla:
          "El anillo cónico sky → clay → amber (`hover-brand-ring`) y el glow ámbar al hover se aplican a la baldosa, la card o el anillo. Ningún ícono se rellena con el degradé ni con `title-brand-gradient`.",
      },
      {
        titulo: "No mezclar trazo grueso con trazo fino",
        regla:
          "Los íconos de servicios (trazo medio, pocos elementos) y las ilustraciones icon-1 a icon-5 (trazo fino, muy detalladas) no comparten pantalla; tampoco los glifos rellenos con lucide, que es de trazo.",
      },
      {
        titulo: "El 3D es exclusivo del proceso",
        regla:
          "El vidrio azul con glow solo existe en los cinco pasos de Metodología y a 128 px o más. No se usa para servicios, botones ni listas, y si un paso cambia de metáfora, cambian juntos el GLB, el WebP de respaldo y el SVG de origen.",
      },
      {
        titulo: "Los logos de clientes no son íconos",
        regla:
          "Los SVG blancos de marcas de clientes (logo-06/07/08, Artboard 4/6/7/8: Qonexia, WOK, Avanz, Pasolion) van en el ticker de logos o en la ficha del proyecto, nunca en un set de íconos ni en una baldosa de servicio.",
      },
    ],
  },

  inconsistencias: [
    {
      donde: "src/components/project-hero.tsx (detalle de proyecto)",
      que: "El hero del detalle mete láminas 16:9 de 1024×576 en una caja `aspect-[4/3]` con `object-cover`: se pierde ~25 % del ancho, justo en láminas con texto o wordmark (NetForemost, Vida Nica, Social Media). Contradice a la galería, que se rediseñó para no recortar nunca.",
      propuesta:
        "Pasar la caja a `aspect-video` (16:9) para que coincida con el archivo, o exigir zona segura central 4:3 en las láminas de hero y documentarla junto al tope 1024×576.",
    },
    {
      donde: "src/lib/services.ts + public/images/service-*.webp",
      que: "Los íconos de servicios son WebP de 59–80 px con el color horneado, mientras todos los demás íconos son vector (SVG, lucide) o 3D. No escalan bien en pantallas 3×, no siguen los tokens si cambia la paleta y no se adaptan al tema oscuro.",
      propuesta:
        "Redibujarlos (o vectorizarlos) como SVG de trazo en `currentColor` y poner el color desde el token de la baldosa (ámbar, cielo, verde agua en su stop fuerte), igual que lucide.",
    },
    {
      donde: "src/lab/proceso/icons.ts (Pensar y Hacer)",
      que: "Cada paso declara tres dibujos y en dos no coinciden: Pensar es una flecha curva en `flecha.svg` pero un caballo de ajedrez en el GLB y en el WebP; Hacer son corchetes de código en `code.svg` pero un hexágono en el GLB y en el WebP. Hoy el SVG no se ve, pero cualquiera que lo tome como fuente arma un set con otra metáfora.",
      propuesta:
        "Elegir una metáfora por paso y alinear los tres archivos (o borrar el campo `svg` si la extrusión ya no se usa); documentar la decisión en el comentario del array.",
    },
    {
      donde: "public/images/hero-*-desktop.webp",
      que: "Los cuatro recortes desktop del hero tienen proporciones distintas (3840×2160, 3840×2188, 3840×2509 y 3840×2560) y pesos de 284 KB a 1,85 MB (hero-tabaco). El slide hero-santa es una ilustración (cerveza Black Santa) en un carrusel de fotografía y no tiene caso en /work.",
      propuesta:
        "Normalizar los desktop a 3840×2160 con un techo de peso común, y decidir si Black Santa entra al portafolio como caso o sale del hero.",
    },
    {
      donde: "public/images (galerías de proyecto)",
      que: "Las galerías mezclan anchos: 1920×1080 (Toma-Tola, WOK), 1600×900 (Flor de Caña, Social Media) y 1024×576 (NetForemost, Vida Nica, Monumental, Oh! La Lashes). Se muestran a ancho completo de columna, así que unas se ven nítidas y otras blandas en la misma página.",
      propuesta:
        "Fijar un ancho único para galería (1600 px cubre la columna del detalle a 2×) y re-exportar el resto desde el material original.",
    },
    {
      donde: "public/images (archivos sin uso y nombres)",
      que: "icon-1 a icon-5 y arrow-2.svg no se referencian en `src/`; los `Artboard *.svg` son logos de clientes con nombre de archivo de Illustrator; quedan 28 WebP con nombre hash de la plantilla original sin ninguna referencia.",
      propuesta:
        "Renombrar los Artboard como `logo-{cliente}.svg`, mover icon-1..5 y arrow-2 a una carpeta de archivo (o borrarlos) y limpiar los WebP hash tras confirmar que no los usa el sitio en Vite.",
    },
    {
      donde: "Íconos lucide en src/",
      que: 'El tamaño se fija con dos APIs distintas (`size={14|16|18|20|22}` en el sitio, `className="size-4"` o `w-4 h-4` en /marca y 404) y sin escala declarada, así que el mismo rol (flecha de enlace) aparece a 14, 16 o 18 px según el archivo.',
      propuesta:
        "Definir tres tamaños de interfaz (16 en texto, 20 en botones redondos, 22 en cuadros de contacto) y usar una sola forma de declararlos.",
    },
  ],

  fuentes: [
    "public/images/hero-*-desktop.webp y hero-*-mobile.webp",
    "public/images/{toma-tola,netforemost,vida-nica,monumental-humidors,oh-la-lashes,wok,flor-de-cana,social-media}-*.webp",
    "public/images/team-*.webp",
    "public/images/bg-*.webp",
    "public/images/service-*.webp y process-*.webp",
    "public/images/{cohete,lupa,pluma,code,flecha,arrow-2,icon-1..5,Artboard *}.svg",
    "public/lab/proceso/*.glb",
    "src/sections/hero.tsx",
    "src/sections/work-gallery.tsx",
    "src/sections/about-us.tsx",
    "src/sections/services-grid.tsx",
    "src/sections/process-section.tsx",
    "src/sections/contact-section.tsx",
    "src/sections/footer.tsx",
    "src/components/work-card.tsx",
    "src/components/project-hero.tsx",
    "src/components/project-gallery.tsx",
    "src/lib/work-items.ts",
    "src/lib/services.ts",
    "src/lab/proceso/icons.ts",
    "src/lab/proceso/glass-material.tsx",
    "src/lab/proceso/process-icon-shared.tsx",
    "src/app/brand.css",
    "src/app/globals.css",
    "AGENTS.md (payload de la home)",
    "docs/guia-desarrollador.md (tabla de payload de imágenes)",
  ],
};
