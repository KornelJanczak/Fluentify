/**
 * Resolve the backend API base URL.
 *
 * Priority:
 *  1. NEXT_PUBLIC_API_URL  – explicit override (works both client & server).
 *     Set this to "/api" in Vercel project settings so the browser uses the
 *     public rewrite, and leave it unset locally so the fallback kicks in.
 *  2. BACKEND_URL          – Vercel service binding (server-side only).
 *  3. http://127.0.0.1:8000 – local development fallback.
 */
export function getApiUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  }
  if (typeof window === "undefined" && process.env.BACKEND_URL) {
    return process.env.BACKEND_URL.replace(/\/+$/, "");
  }
  return "http://127.0.0.1:8000";
}

export function resolveApiUrl(path: string): string {
  const base = getApiUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

type ApiError = { detail?: string };

export async function http<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token =
    typeof window === "undefined"
      ? null
      : window.localStorage.getItem("access_token");
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(resolveApiUrl(path), { ...init, headers });
  if (!response.ok) {
    const payload = (await response
      .json()
      .catch(() => null)) as ApiError | null;
    throw new Error(payload?.detail ?? "The request could not be completed.");
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
