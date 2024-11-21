"use server";
import { cookies } from "next/headers";

export const getSessionToken = async (): Promise<string> => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("fluentify-server-session").value;
  const sessionSignature = cookieStore.get(
    "fluentify-server-session.sig"
  ).value;

  const sessionToken = sessionId + "." + sessionSignature;

  return sessionToken;
};
