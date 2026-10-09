/**
 * Voz y tono de VPER Media — derivados del copy real del sitio.
 * No es una voz nueva: es la que ya está publicada, ordenada en reglas.
 * Cada ejemplo con `fuente` es una cita textual ("archivo:línea").
 * Los ejemplos sin `fuente` (y todos los `despues` / `tono.ejemplo`) son
 * redacciones nuevas escritas en esa misma voz.
 */

export interface Rasgo {
  nombre: string;
  es: string;
  noEs: string;
  ejemplo: string;
  fuente: string;
}

export interface Principio {
  titulo: string;
  regla: string;
  antes: string;
  despues: string;
}

export interface Formato {
  pieza: string;
  regla: string;
  ejemplo: string;
  fuente?: string;
}

export interface Regla {
  regla: string;
  si: string;
  no: string;
}

export interface Inconsistencia {
  donde: string;
  que: string;
  propuesta: string;
}

export interface Situacion {
  situacion: string;
  como: string;
  ejemplo: string;
}

export interface Vocabulario {
  usamos: string[];
  evitamos: { palabra: string; porque: string }[];
}

export interface Voz {
  resumen: string;
  enUnaFrase: string;
  rasgos: Rasgo[];
  principios: Principio[];
  vocabulario: Vocabulario;
  formatos: Formato[];
  tono: Situacion[];
  ortografia: Regla[];
  inconsistencias: Inconsistencia[];
  fuentes: string[];
}

export const VOZ: Voz = {
  resumen:
    "VPER suena como alguien que sabe de su oficio y no necesita demostrarlo: frases cortas, verbos de acción y un guiño por bloque. Habla de vos, en primera persona del plural, y pone a la idea en el centro, no a la agencia. Todo el sitio repite la misma obsesión: siempre hay algo más grande por crear.",

  enUnaFrase: "Directa, de vos y con chispa. La protagonista es la idea.",

  rasgos: [
    {
      nombre: "Directa",
      es: "Una idea por frase. Verbos de acción en primera persona del plural: creamos, convertimos, encontramos, ponemos. Frases de 5 a 15 palabras y fragmentos que rematan.",
      noEs: "Seca ni telegráfica. Tampoco una lista de adjetivos sobre lo buenos que somos.",
      ejemplo:
        "Encontramos el problema detrás del problema. Después ponemos estrategia, criterio y una buena cantidad de preguntas sobre la mesa.",
      fuente: "src/lib/services.ts:43",
    },
    {
      nombre: "Con chispa",
      es: "Humor de oficio: ironía ligera sobre el propio trabajo, un remate inesperado después de una frase seria. Un guiño por bloque, no por frase.",
      noEs: "Chistes, memes, juegos de palabras forzados ni burla del cliente. El humor nunca tapa el dato.",
      ejemplo: "LA MAGIA TIENE MÉTODO. — Y si no, preguntale a Houdini.",
      fuente: "src/sections/process-section.tsx:197-202",
    },
    {
      nombre: "Cercana",
      es: "Le habla a una persona, de vos, y la invita a conversar. Admite que una idea puede estar a medio hacer y que eso está bien.",
      noEs: "Confianzuda ni descuidada. Cercana no es informal: la ortografía y el criterio siguen intactos.",
      ejemplo:
        "Si tenés un proyecto, una marca o apenas una idea dando vueltas, contanos. Las cosas grandes suelen empezar con una conversación.",
      fuente: "src/sections/contact-section.tsx:67",
    },
    {
      nombre: "Inquieta",
      es: "Ambición sin alarde: las ideas crecen, se mueven, llegan más lejos. Cada cierre empuja a lo siguiente.",
      noEs: "Autobombo, superlativos ni premios por delante. La ambición es para la idea, no para el currículum.",
      ejemplo:
        "Publicamos, medimos, escuchamos y aprendemos. Cada proyecto nos deja algo que hace que la próxima idea empiece un poco más adelante.",
      fuente: "src/sections/process-section.tsx:53",
    },
  ],

  principios: [
    {
      titulo: "Una idea por frase",
      regla:
        "Si una frase necesita más de dos comas, partila. El punto es una herramienta de ritmo, no un trámite.",
      antes:
        "Somos una agencia creativa integral que ofrece soluciones innovadoras de comunicación 360° para potenciar el crecimiento de tu marca.",
      despues: "Pensamos la idea. La hacemos. La llevamos a donde está la gente.",
    },
    {
      titulo: "Verbos, no adjetivos",
      regla:
        "Contá lo que hacemos, no lo buenos que somos. Si una frase se sostiene solo con adjetivos (innovador, integral, de alto impacto), reescribila con un verbo.",
      antes:
        "Contamos con un equipo altamente calificado y apasionado por la excelencia audiovisual.",
      despues:
        "Filmamos, editamos y volvemos a editar hasta que la historia se sostenga sola.",
    },
    {
      titulo: "Planteo y giro",
      regla:
        "La estructura de la casa es de dos tiempos: una afirmación que suena esperable y un remate que la da vuelta. Usala en titulares y párrafos de apoyo, no en cada frase.",
      antes: "Conocé nuestro portafolio de trabajos realizados.",
      despues: "Cualquiera dice que es creativo. Nosotros preferimos mostrarlo.",
    },
    {
      titulo: "La idea es la protagonista",
      regla:
        "El sujeto de la frase es la idea, la marca o la gente; VPER aparece como el que la mueve. Al cliente se le da el crédito de lo que ya traía.",
      antes:
        "VPER Media desarrolló una campaña de alto impacto para un cliente líder del sector.",
      despues:
        "La marca ya tenía la historia. Nos tocó encontrarle el cuadro y llevarlo a la calle.",
    },
    {
      titulo: "Hablale a una persona",
      regla:
        "Voseo, segunda persona singular, como en una conversación. Nada de fórmulas de formulario ni de usted genérico.",
      antes:
        "Si usted desea más información, no dude en contactarnos a través del siguiente formulario.",
      despues: "¿Tenés algo dando vueltas? Contanos y lo pensamos juntos.",
    },
    {
      titulo: "El guiño es la sal",
      regla:
        "Un remate con humor por bloque, como mucho. Si el chiste necesita explicación o emoji, sacalo. En temas delicados (errores, quejas, plata) no hay guiño.",
      antes: "¡¡Somos los magos del marketing!! Abracadabra y tus ventas despegan 🚀🎩",
      despues: "No hacemos trucos. Hacemos preguntas, y a veces eso parece magia.",
    },
  ],

  vocabulario: {
    usamos: [
      "idea / buenas ideas",
      "crear (y su remate: algo más grande por crear)",
      "más grande",
      "reto",
      "preguntas",
      "criterio",
      "estrategia",
      "la marca",
      "la gente / las personas",
      "conversación",
      "mover / moverse (las ideas se mueven)",
      "llegar / hasta dónde pueden llegar",
      "pasar cosas",
      "hacer realidad / cobrar vida",
      "acá",
      "Porque… (como inicio de remate)",
      "contanos / hablemos / empecemos",
    ],
    evitamos: [
      {
        palabra: "soluciones / soluciones integrales",
        porque:
          "No dice qué hacemos. Aparece en las bios (src/sections/about-us.tsx:26) y en copy de cliente, nunca en la voz propia del sitio.",
      },
      {
        palabra: "de alto impacto",
        porque:
          "Se repite tres veces en las bios (about-us.tsx:26, 32, 44) y no prueba nada. Mostrá el impacto con un dato.",
      },
      {
        palabra: "orientado a resultados",
        porque:
          "Muletilla de currículum (about-us.tsx:20, 26, 50). Si hay un resultado, decilo: “retornos de hasta 10:1”.",
      },
      {
        palabra: "innovador / innovación",
        porque:
          "Adjetivo que todos se ponen. El sitio demuestra la innovación con el trabajo, no la anuncia.",
      },
      {
        palabra: "360°",
        porque:
          "Promete todo y no explica nada (about-us.tsx:14). Nombrá los servicios concretos.",
      },
      {
        palabra: "sinergia, potenciar, apalancar",
        porque: "Jerga de consultora. Nadie habla así en una mesa.",
      },
      {
        palabra: "líderes / expertos / apasionados",
        porque:
          "Autoelogio. La voz de VPER muestra; no se autodefine (about-us.tsx:20, 44).",
      },
      {
        palabra: "No dude en contactarnos / Nos contactaremos",
        porque:
          "Fórmula de formulario en usted o impersonal (contact-section.tsx:93). Rompe el voseo y la cercanía.",
      },
      {
        palabra: "el cliente (en copy público)",
        porque:
          "El sitio habla de “la marca” y “la gente”. “Cliente” es palabra de administración, no de conversación.",
      },
      {
        palabra: "Haga clic aquí / Más información",
        porque: "CTA vacío. Los CTA del sitio dicen qué pasa: VER PROYECTOS, EMPECEMOS.",
      },
    ],
  },

  formatos: [
    {
      pieza: "Titular display",
      regla:
        "Mayúsculas con tildes. De 2 a 6 palabras por línea, partido en líneas con sentido. Punto final si afirma; signos ¿? si pregunta. Puede ir en serie de tres frases cortas.",
      ejemplo: "LA MAGIA TIENE MÉTODO.",
      fuente: "src/sections/process-section.tsx:197-199",
    },
    {
      pieza: "Golpe en script (Yellowtail)",
      regla:
        "Una sola palabra, con punto, que remata la frase en display. Es un verbo y es la firma de la marca: solo vive en el lema del hero. No se usa para enfatizar otras frases.",
      ejemplo: "SIEMPRE HAY ALGO MÁS GRANDE POR — Crear.",
      fuente: "src/sections/hero.tsx:201-205",
    },
    {
      pieza: "Ceja / overline",
      regla:
        "Una o dos palabras en mayúsculas, sin punto. Nombra la sección o invita (HABLEMOS). No repite el titular.",
      ejemplo: "METODOLOGÍA",
      fuente: "src/sections/process-section.tsx:194",
    },
    {
      pieza: "CTA",
      regla:
        "Verbo + objeto, o una pregunta que invita. Mayúsculas, sin punto. Tiene que hacer exactamente lo que dice: si dice REEL, abre un reel.",
      ejemplo: "¿NOS REUNIMOS?",
      fuente: "src/sections/header.tsx:175",
    },
    {
      pieza: "Párrafo de apoyo",
      regla:
        "De una a tres frases, entre 15 y 40 palabras. Planteo con giro, primera persona del plural, voseo si le habla al lector. Cierra con una imagen, no con un adjetivo.",
      ejemplo:
        "Las buenas ideas tienen un pequeño problema: nunca se quedan quietas. Las convertimos en campañas, contenido y experiencias para descubrir hasta dónde pueden llegar.",
      fuente: "src/sections/hero.tsx:211-213",
    },
    {
      pieza: "Tarjeta de servicio",
      regla:
        "Nombre fijo del servicio + dos frases: qué hacemos (con verbo) y un remate que explica por qué importa, a menudo con “Porque…” o un fragmento corto.",
      ejemplo:
        "Desarrollo web, contenido, medios y datos moviéndose a la velocidad de la gente. Porque el mundo digital cambia todos los días. Nosotros también.",
      fuente: "src/lib/services.ts:37",
    },
    {
      pieza: "Caso de portafolio",
      regla:
        "Título = nombre de la marca tal como la escribe el cliente, en mayúsculas. Bajada de 2 a 3 palabras (qué es). Texto en voz VPER, dos párrafos cortos: de qué se trataba y qué hicimos. Datos (cliente, sector, fecha, país) van en la ficha, no en la prosa.",
      ejemplo:
        "Campaña Bicentenario: un key visual que junta botella, copa y paisaje nicaragüense — volcán, barrica, guardabarranco — en una sola escena. Del boceto a la valla. La marca ya tenía el origen; el trabajo fue armar el cuadro a la altura de un 12 años seriado.",
      fuente: "src/lib/work-items.ts:353",
    },
    {
      pieza: "Firma de correo",
      regla:
        "Solo datos, en este orden: nombre, cargo en español y en minúscula salvo la inicial, VPER Media, correo, teléfono, web y sedes separadas por “·”. Sin frases motivacionales; el único lema permitido es el de la marca.",
      ejemplo:
        "Massiel Narváez · VPER Media · massiel@vpermedia.com · +505 8815 4889 · vpermedia.com · Panamá · Nicaragua",
      fuente: "src/app/marca/firmas/proposals.ts:45-51",
    },
    {
      pieza: "Post de redes",
      regla:
        "Primera línea con planteo y giro (es lo que se ve sin abrir). Máximo tres líneas, voseo, un CTA concreto. Hashtags al final y pocos; emojis solo si suman información.",
      ejemplo:
        "Del boceto a la valla. Así se armó el Bicentenario de Flor de Caña. El caso completo está en vpermedia.com/work.",
    },
    {
      pieza: "Microcopy (formularios, confirmaciones, errores)",
      regla:
        "Mismo tratamiento que el resto (vos). Placeholders cortos y en segunda persona. Las confirmaciones dicen qué pasó y qué sigue.",
      ejemplo: "Tu nombre",
      fuente: "src/sections/contact-section.tsx:105",
    },
  ],

  tono: [
    {
      situacion: "Primer contacto con un prospecto",
      como: "Cálido y curioso. Más preguntas que promesas. Una propuesta concreta para el siguiente paso.",
      ejemplo:
        "Gracias por escribirnos. Antes de proponer nada queremos entender bien el reto: ¿qué tiene que pasar para que este proyecto valga la pena? Si te queda bien, nos reunimos media hora esta semana y lo pensamos juntos.",
    },
    {
      situacion: "Propuesta o presupuesto",
      como: "Segura y ordenada. Baja el humor, sube la claridad: qué entendimos, qué proponemos, qué cuesta, qué sigue.",
      ejemplo:
        "Esto es lo que entendimos, esto es lo que proponemos y esto es lo que cuesta. Si algo no calza, lo ajustamos antes de empezar, no después.",
    },
    {
      situacion: "Redes sociales",
      como: "El punto más suelto de la voz: frases más cortas, más juego, el guiño puede ir arriba. Siempre con algo para ver o hacer.",
      ejemplo:
        "Todo empieza con preguntas. Algunas cómodas, otras bastante menos. Esta semana te contamos la que nos cambió un proyecto entero.",
    },
    {
      situacion: "Error o página 404",
      como: "Un guiño corto que reconoce el tropiezo y una salida clara. Nada de alertas ni tecnicismos.",
      ejemplo:
        "ESTA PÁGINA SE NOS ESCAPÓ. Las buenas ideas nunca se quedan quietas; por lo visto, esta página tampoco. Volvé al inicio o mirá los proyectos.",
    },
    {
      situacion: "Respuesta a un cliente molesto",
      como: "Cero chistes. Primero la responsabilidad, después el siguiente paso con fecha. Frases cortas, sin excusas ni voz pasiva.",
      ejemplo:
        "Tenés razón: la entrega se atrasó y debimos avisarte antes. Hoy a las 5 p. m. te mandamos la versión corregida y mañana revisamos juntos el calendario.",
    },
  ],

  ortografia: [
    {
      regla:
        "Tratamiento: voseo en todos los canales propios (sitio, redes, correos). Con clientes que usan tú o usted en conversación uno a uno, seguí su tratamiento; en plural, siempre “ustedes”.",
      si: "Si tenés un proyecto, una marca o apenas una idea dando vueltas, contanos.",
      no: "Cuéntanos sobre tu proyecto...",
    },
    {
      regla:
        "Imperativos de voseo con la tilde correcta: llanos sin tilde cuando llevan pronombre (contanos, preguntale), agudos con tilde cuando van solos (mirá, volvé).",
      si: "Y si no, preguntale a Houdini.",
      no: "Y si no, pregúntale a Houdini. / preguntále",
    },
    {
      regla:
        "Mayúsculas sostenidas en titulares, cejas, CTA y navegación, siempre con tildes y signos de apertura.",
      si: "UNA SOLA DIRECCIÓN.",
      no: "UNA SOLA DIRECCION.",
    },
    {
      regla:
        "En texto corrido, cargos y bajadas: mayúscula solo en la primera palabra y en nombres propios.",
      si: "Directora de cuentas",
      no: "Web Master Leader / Profesional de Marketing",
    },
    {
      regla:
        "Los seis nombres de servicio son etiquetas fijas y se escriben exactamente como en services.ts, con su mayúscula. Fuera de esa lista, rige la regla anterior.",
      si: "Planeación Estratégica · Digital & Web · ATL & BTL",
      no: "Planeación estratégica · Digital y Web · ATL/BTL",
    },
    {
      regla:
        "Punto final: sí en titulares que afirman y en el golpe de script; no en cejas, CTA, navegación, etiquetas ni bajadas. Las preguntas llevan ¿? y nada más.",
      si: "LA MAGIA TIENE MÉTODO. / EMPECEMOS / ¿QUÉ CREAMOS AHORA?",
      no: "LA MAGIA TIENE MÉTODO / EMPECEMOS. / ¿QUÉ CREAMOS AHORA?.",
    },
    {
      regla:
        "Números: en prosa, de uno a nueve en letra y de 10 en adelante en cifra. En fichas, datos y precios, siempre cifra.",
      si: "cuatro años · 14 años · más de 10 años",
      no: "más de diez años y 14 años en el mismo bloque",
    },
    {
      regla:
        "Moneda: código USD antes de la cifra, con coma de miles. Evita la ambigüedad entre dólar y córdoba.",
      si: "USD 500,000 · USD 650,000",
      no: "$500,000 en una bio y USD 650 mil en la siguiente",
    },
    {
      regla:
        "Teléfonos con código de país y el formato del sitio: espacio después del código y guion en el número.",
      si: "+505 7782-4749",
      no: "+50577824749 / (505) 7782 4749",
    },
    {
      regla:
        "Anglicismos: solo los de oficio que el cliente ya usa y no tienen equivalente corto (Branding, ATL & BTL, reel, key visual, feed, insights). Sin cursiva ni comillas. El resto, en español.",
      si: "Branding · key visual · reel",
      no: "Content manager · enterprise · Smart Home como adorno",
    },
    {
      regla: "Signos de apertura ¿ ¡ siempre, también en mayúsculas y en botones.",
      si: "¿NOS REUNIMOS?",
      no: "NOS REUNIMOS?",
    },
    {
      regla:
        "Comillas tipográficas “ ” para citas, lemas y nombres de pieza. Nunca comillas rectas en copy publicado.",
      si: "El lema dice “Siempre hay algo más grande por crear.”",
      no: 'El lema dice "Siempre hay algo más grande por crear."',
    },
    {
      regla:
        "“&” solo dentro de los nombres de servicio (ATL & BTL, Digital & Web). En prosa, siempre “y”.",
      si: "medios, calles, eventos y experiencias",
      no: "estrategia & creatividad",
    },
    {
      regla:
        "Separadores: raya (—) para incisos y para separar marca de título de página; punto medio (·) para listas de datos como sedes o contacto. No usar barra vertical.",
      si: "Proyectos — VPER Media · Panamá · Nicaragua",
      no: "Managua, Nicaragua | Remoto LATAM",
    },
    {
      regla:
        "Puntos suspensivos con el carácter … y con mesura. Nunca tres puntos sueltos.",
      si: "Contanos de tu proyecto…",
      no: "Cuéntanos sobre tu proyecto...",
    },
    {
      regla:
        "Nombre de la marca: “VPER Media”, VPER en mayúsculas y Media en caja normal. El ® va solo en el logo y en textos legales.",
      si: "© 2026 VPER Media. Todos los derechos reservados.",
      no: "Vper Media · VPER MEDIA en texto corrido · VPER® Media en una firma",
    },
  ],

  inconsistencias: [
    {
      donde:
        "src/sections/contact-section.tsx:67 y :147; src/lib/work-items.ts:129, :202, :274",
      que: "Tratamiento mezclado. La sección de contacto invita con “Si tenés… contanos” y el campo de mensaje del mismo formulario pide “Cuéntanos sobre tu proyecto...”. En los casos conviven “Podés disfrutar” (Toma Tola), “inviertes” (Vida Nica) y “lo más hermoso de ti” (Oh! La Lashes).",
      propuesta:
        "Voseo en todo el copy propio: placeholder “Contanos de tu proyecto…”. El copy de cliente se reescribe en voz VPER o, si se conserva, se presenta como cita del cliente.",
    },
    {
      donde: "src/sections/about-us.tsx:143-147 frente a about-us.tsx:9-57",
      que: "El titular dice “CINCO DIRECTORES.” pero el equipo que se muestra son ocho personas, y solo tres tienen cargo de director. El párrafo nombra cinco áreas (estrategia, creatividad, arte, digital y cuentas), no cinco personas.",
      propuesta:
        "Alinear el titular con lo que se ve, sin perder el ritmo de tres: “CINCO ÁREAS. MUCHAS IDEAS. UNA SOLA DIRECCIÓN.” u “OCHO CABEZAS. MUCHAS IDEAS. UNA SOLA DIRECCIÓN.”",
    },
    {
      donde: "src/sections/about-us.tsx:14-56 (bios del equipo)",
      que: "Las bios están escritas como currículum corporativo: “soluciones y experiencias digitales de alto impacto”, “orientados al logro de resultados”, “enfoque innovador, estratégico y rentable”. Es justo el vocabulario que la voz evita, y aparece en la sección que habla de “buenas cabezas alrededor de una mesa”.",
      propuesta:
        "Bio de dos frases: qué hace en VPER y un dato concreto o rasgo humano. Ej.: “Lleva más de 10 años convirtiendo presupuestos en resultados. Ha manejado más de USD 500,000 en campañas con retornos de hasta 10:1.”",
    },
    {
      donde:
        "src/sections/footer.tsx:98, src/sections/contact-section.tsx:19 frente a src/app/marca/firmas/proposals.ts:51",
      que: "Panamá no aparece en ninguna parte del sitio público: el footer dice “Managua, Nicaragua | Remoto LATAM” y el contacto, “Managua, Nicaragua”. La firma de correo sí dice “Panamá · Nicaragua”.",
      propuesta:
        "Usar “Panamá · Nicaragua” en footer y contacto, con el mismo separador que la firma.",
    },
    {
      donde: "src/sections/hero.tsx:220-222",
      que: "El CTA “VER REEL” no abre ningún reel: lleva a la sección de contacto. Rompe la regla más básica del CTA, que es hacer lo que dice.",
      propuesta:
        "Hasta que exista el reel, cambiarlo por “HABLEMOS” (mismo destino) o apuntarlo a /work con “VER PROYECTOS” como único botón.",
    },
    {
      donde:
        "src/lib/work-items.ts:129, :164, :202, :241, :274, :313 frente a :353 y :378",
      que: "Seis casos usan el texto del cliente en su propia primera persona (“Queríamos crear algo…”, “transformamos la manera en que inviertes…”, “para nosotros cocinar…”). En el sitio de VPER, ese “nosotros” confunde. Flor de Caña y Social Media sí están en voz VPER y son el modelo.",
      propuesta:
        "Reescribir los casos con la plantilla de “Caso de portafolio”: de qué se trataba y qué hicimos, en voz VPER. Si el cliente aporta una frase valiosa, va como cita entre comillas.",
    },
    {
      donde: "src/app/not-found.tsx:20-34 y src/sections/contact-section.tsx:93",
      que: "Los dos momentos de fricción suenan genéricos: “Página no encontrada / Puede que se haya movido o eliminado.” y “¡Formulario enviado! Nos contactaremos pronto.” El primero tiene voseo pero no chispa; el segundo es impersonal y en registro de formulario.",
      propuesta:
        "404: “ESTA PÁGINA SE NOS ESCAPÓ.” + “Las buenas ideas nunca se quedan quietas; por lo visto, esta página tampoco.” Confirmación: “Listo, ya nos llegó. Te escribimos pronto.”",
    },
    {
      donde: "src/lib/work-items.ts:122-129 y :267-271",
      que: "Nombres de proyecto que no coinciden con la marca: el caso de “Oh! La Lashes” se titula “LA LASHES”; Toma Tola aparece como “Toma-Tola” en la bajada y como “Toma Tola” en el texto, y el título es “TOMATO BREW”.",
      propuesta:
        "Título = nombre de la marca tal como la escribe el cliente (“OH! LA LASHES”, “TOMA TOLA”), escrito igual en título, bajada, ficha y texto.",
    },
    {
      donde:
        "src/lib/navigation.ts:25-27 frente a src/sections/process-section.tsx:194 y src/sections/work-gallery.tsx:107",
      que: "El nav dice “NUESTRO PROCESO” y la sección se llama “METODOLOGÍA”; el nav dice “PROYECTOS” y la sección se llama “PORTAFOLIO”. El visitante hace clic en una palabra y aterriza en otra.",
      propuesta:
        "Una palabra por destino: “PROCESO” en nav y ceja; “PROYECTOS” en nav y ceja (el sitio ya usa “proyectos” en todos los CTA).",
    },
    {
      donde:
        "src/sections/work-gallery.tsx:62, src/components/project-pager.tsx:51, src/app/work/[slug]/page.tsx:99",
      que: "Tres textos para el mismo destino (/work): “Ver todos los proyectos”, “VER TODOS LOS PROYECTOS” y “TODOS LOS PROYECTOS”.",
      propuesta:
        "Un destino, un texto: “VER TODOS LOS PROYECTOS” como CTA; “TODOS LOS PROYECTOS” solo como miga de vuelta en el detalle.",
    },
    {
      donde:
        "src/sections/about-us.tsx:14, :44, :56; src/sections/contact-section.tsx:18 frente a src/app/marca/firmas/proposals.ts:49",
      que: "Números sin criterio: “más de diez años” junto a “14 años”; “$500,000” junto a “USD 650 mil”; el teléfono va como “+505 7782-4749” en el sitio y “+505 8815 4889” en la firma.",
      propuesta:
        "Aplicar las reglas de números, moneda y teléfono de esta página en bios, fichas y firmas.",
    },
    {
      donde:
        "src/sections/about-us.tsx:24, :48, :54; src/app/marca/firmas/proposals.ts:248",
      que: "Cargos en inglés y con mayúsculas de título (“Web Master Leader”, “Content manager”) junto a cargos en español (“Director digital”), y “Pauta digital”, que es un área, no un cargo. La firma usa “VPER® Media” y el resto del sistema, “VPER Media”.",
      propuesta:
        "Cargos en español y en minúscula salvo la inicial (“Líder web”, “Gestora de contenido”, “Especialista en pauta digital”). “VPER Media” sin ® fuera del logo.",
    },
    {
      donde: "src/components/section-header.tsx:39, src/app/marca/sistema/page.tsx:629",
      que: "La documentación interna mide los titulares contra “SELECCIONADOS.”, un titular que ya no aparece en ninguna pantalla del sitio.",
      propuesta:
        "Usar como referencia la palabra más larga de un titular vigente (por ejemplo, “DIRECCIÓN.” o “PROYECTOS.”) para que la guía cite copy real.",
    },
  ],

  fuentes: [
    "src/app/layout.tsx",
    "src/app/page.tsx",
    "src/sections/hero.tsx",
    "src/sections/header.tsx",
    "src/sections/logo-ticker.tsx",
    "src/sections/work-gallery.tsx",
    "src/sections/services-grid.tsx",
    "src/sections/process-section.tsx",
    "src/sections/about-us.tsx",
    "src/sections/contact-section.tsx",
    "src/sections/footer.tsx",
    "src/lib/services.ts",
    "src/lib/work-items.ts",
    "src/lib/navigation.ts",
    "src/lab/proceso/icons.ts",
    "src/components/section-header.tsx",
    "src/components/project-pager.tsx",
    "src/ui/components/button.tsx",
    "src/app/work/page.tsx",
    "src/app/work/[slug]/page.tsx",
    "src/app/not-found.tsx",
    "src/app/marca/firmas/proposals.ts",
    "src/app/marca/sistema/page.tsx",
  ],
};
