import { resolveApiUrl } from "@/infrastructure/http/client";

export type User = {
  id: string;
  email: string;
  created_at: string;
};

type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

async function request<T>(path: string, body: object): Promise<T> {
  const response = await fetch(resolveApiUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      detail?: string;
    } | null;
    throw new Error(payload?.detail ?? "The request could not be completed.");
  }

  return response.json() as Promise<T>;
}

export function login(email: string, password: string): Promise<TokenResponse> {
  return request<TokenResponse>("/auth/login", { email, password });
}

export function register(email: string, password: string): Promise<User> {
  return request<User>("/auth/register", { email, password });
}

export function saveAccessToken(token: string): void {
  window.localStorage.setItem("access_token", token);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("access_token");
}

function decodeBase64Url(base64Url: string): string {
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  return atob(base64);
}

export function getCurrentUserId(token?: string): string | null {
  const jwt = token ?? getAccessToken();
  if (!jwt) return null;
  try {
    const parts = jwt.split(".");
    if (parts.length < 2) return null;
    const jsonString = decodeBase64Url(parts[1]);
    const payload = JSON.parse(jsonString) as Record<string, unknown>;
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}
