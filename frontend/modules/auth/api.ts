const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

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
  const response = await fetch(`${apiUrl}${path}`, {
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
