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

export const getUser = async () => {
  const sessionCookie = await getSessionCookie();

  const response = await fetch("http://localhost:5000/api/v1/auth/session", {
    credentials: "include",
    headers: {
      Cookie: sessionCookie,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get session");
  }

  return response.json();
};
