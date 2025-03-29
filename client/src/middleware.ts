import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { chatService } from "./common/api/services/chat.service";
import { settingsService } from "./common/api/services/settings.service";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  const cookieStore = request.cookies;
  const sessionID = cookieStore.get("connect.sid");

  if (pathname.startsWith("/dashboard")) {
    if (!sessionID) {
      response.headers.set("Cache-Control", "no-store");
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    console.log("sessionID", sessionID);

    const settings = await settingsService.getChatSettingsByUserId();

    console.log("settings", settings);

    if (!settings) {
      console.log("no settings found, redirecting to onboarding");
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    return response;
  }

  if (pathname.startsWith("/onboarding")) {
    console.log("onboarding middleware");

    if (!sessionID)
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));

    return response;
  }
}
