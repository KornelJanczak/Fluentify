import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const cookieStore = request.cookies;
  const sessionID = cookieStore.get("connect.sid");

  if (!sessionID) return NextResponse.redirect(new URL("/", request.url));

  return NextResponse.next({
    headers: {
      Cookies: request.cookies.toString(),
    },
  });
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
