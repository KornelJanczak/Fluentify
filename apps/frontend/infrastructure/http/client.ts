const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

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

  const response = await fetch(`${apiUrl}${path}`, { ...init, headers });
  if (!response.ok) {
    const payload = (await response
      .json()
      .catch(() => null)) as ApiError | null;
    throw new Error(payload?.detail ?? "The request could not be completed.");
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
