import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const cookieStore = request.cookies;
  const sessionId = cookieStore.get("fluentify-server-session")?.value;
  const sessionSignature = cookieStore.get(
    "fluentify-server-session.sig"
  )?.value;

  if (!sessionId || !sessionSignature) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const sessionCookie =
    "fluentify-server-session=" +
    sessionId +
    "; fluentify-server-session.sig=" +
    sessionSignature;


    
  return NextResponse.next({
    headers: {
      Cookies: sessionCookie,
    },
  });
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
