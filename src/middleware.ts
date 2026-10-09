import { NextResponse, type NextRequest } from "next/server";
import {
  LOGIN_PATH,
  SESSION_COOKIE,
  isOpenForDev,
  marcaPassword,
  verifySession,
} from "@/app/marca/lib/session";

/**
 * Portero de /marca. Solo corre en esas rutas (ver `matcher`): el sitio, las
 * imágenes de las firmas de correo (public/images/firma) y todo lo demás siguen
 * públicos. Detalle del mecanismo en src/app/marca/lib/session.ts.
 */
export async function middleware(req: NextRequest) {
  if (isOpenForDev()) return NextResponse.next();

  const secret = marcaPassword();
  if (secret && (await verifySession(req.cookies.get(SESSION_COOKIE)?.value, secret))) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  url.search = "";
  url.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/marca", "/marca/:path*"] };
