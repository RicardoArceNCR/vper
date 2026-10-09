/**
 * ZIP mínimo, sin compresión (método "store"). Los PNG ya vienen comprimidos, así
 * que deflate no ganaría casi nada, y esto evita sumar una dependencia al repo
 * por un botón de una página interna. Formato: PKWARE APPNOTE 6.3 (cabecera local
 * + directorio central + fin de directorio). Nombres en UTF-8 (bit 11).
 */

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    c = (CRC_TABLE[(c ^ (data[i] ?? 0)) & 0xff] ?? 0) ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

/** Fecha y hora en formato MS-DOS, como las guarda el ZIP. */
function dosDateTime(d: Date): { time: number; date: number } {
  return {
    time: (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2),
    date: ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
  };
}

export interface ZipEntry {
  /** Ruta dentro del ZIP, con "/" como separador. */
  name: string;
  data: Uint8Array;
}

export function makeZip(entries: readonly ZipEntry[], when = new Date()): Blob {
  const enc = new TextEncoder();
  const { time, date } = dosDateTime(when);
  const parts: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  for (const e of entries) {
    const name = enc.encode(e.name);
    const crc = crc32(e.data);
    const size = e.data.length;

    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true); // firma de cabecera local
    local.setUint16(4, 20, true); // versión mínima
    local.setUint16(6, 0x0800, true); // bit 11: nombre en UTF-8
    local.setUint16(8, 0, true); // método: store
    local.setUint16(10, time, true);
    local.setUint16(12, date, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, size, true); // tamaño comprimido
    local.setUint32(22, size, true); // tamaño real
    local.setUint16(26, name.length, true);
    local.setUint16(28, 0, true); // sin campo extra
    parts.push(new Uint8Array(local.buffer), name, e.data);

    const cd = new DataView(new ArrayBuffer(46));
    cd.setUint32(0, 0x02014b50, true); // firma de directorio central
    cd.setUint16(4, 20, true); // hecho por
    cd.setUint16(6, 20, true); // versión mínima
    cd.setUint16(8, 0x0800, true);
    cd.setUint16(10, 0, true);
    cd.setUint16(12, time, true);
    cd.setUint16(14, date, true);
    cd.setUint32(16, crc, true);
    cd.setUint32(20, size, true);
    cd.setUint32(24, size, true);
    cd.setUint16(28, name.length, true);
    // 30–41: extra, comentario, disco, atributos internos/externos → 0
    cd.setUint32(42, offset, true); // dónde empieza su cabecera local
    central.push(new Uint8Array(cd.buffer), name);

    offset += 30 + name.length + size;
  }

  const cdSize = central.reduce((n, p) => n + p.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true); // fin de directorio central
  end.setUint16(8, entries.length, true);
  end.setUint16(10, entries.length, true);
  end.setUint32(12, cdSize, true);
  end.setUint32(16, offset, true);

  return new Blob([...parts, ...central, new Uint8Array(end.buffer)] as BlobPart[], {
    type: "application/zip",
  });
}
