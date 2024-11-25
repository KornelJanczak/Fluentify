"use server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const getSessionCookie = async () => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("fluentify-server-session").value;
  const sessionSignature = cookieStore.get(
    "fluentify-server-session.sig"
  ).value;

  const sessionCookie =
    "fluentify-server-session=" +
    sessionId +
    "; fluentify-server-session.sig=" +
    sessionSignature;

  return sessionCookie;
};
