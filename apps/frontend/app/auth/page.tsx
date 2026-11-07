"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { login, register, saveAccessToken } from "@/modules/auth/api";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (mode === "register") await register(email, password);
      const token = await login(email, password);
      saveAccessToken(token.access_token);
      router.push("/dashboard/flashcard-sets");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Authentication failed.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="brand" href="/">
          Second Tongue
        </Link>
      </nav>
      <section className="auth-panel">
        <p className="kicker">Your practice room</p>
        <h1>{mode === "login" ? "Welcome back." : "Start speaking."}</h1>
        <p className="auth-summary">
          Sign in to keep your flashcards and conversations private.
        </p>
        <form className="auth-form" onSubmit={submit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
          />
          <button type="submit" disabled={isLoading}>
            {isLoading
              ? "Opening..."
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        <button
          className="auth-switch"
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
        >
          {mode === "login"
            ? "Need an account? Create one"
            : "Already have an account? Sign in"}
        </button>
      </section>
    </main>
  );
}
