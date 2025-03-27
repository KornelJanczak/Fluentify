import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { chatService } from "./common/api/services/chat.service";

export async function middleware(request: NextRequest) {
  const cookieStore = request.cookies;
  const sessionID = cookieStore.get("connect.sid");

  if (!sessionID)
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));

  const response = NextResponse.next();
  response.headers.set("Cookies", request.cookies.toString());

  const settings = await chatService.getChatSettingsByUserId();

  if (!settings)
    return NextResponse.redirect(new URL("/onboarding", request.url));

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
