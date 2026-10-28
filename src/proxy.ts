import { type NextRequest, NextResponse } from "next/server";
import { hasLocale, negotiateLocale } from "@/lib/locale";

/** Sends every URL without a locale prefix to `/es/...` or `/en/...` based on Accept-Language. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [, first] = pathname.split("/");
  if (hasLocale(first)) return NextResponse.next();

  const locale = negotiateLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.redirect(url);
  response.headers.set("Vary", "Accept-Language");
  return response;
}

export const config = {
  // Skip Next internals, the extension-less icon routes and anything with a file extension
  // (public assets, PDFs, sitemap.xml, robots.txt, manifest.webmanifest...).
  matcher: ["/((?!_next|api|icon|apple-icon|.*\\..*).*)"],
};
