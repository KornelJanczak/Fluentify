"use client";

import React, { createContext, useEffect, useMemo, useState } from "react";
import { User } from "../services/auth/auth-service";

export interface Session {
  user?: User;
  sessionCookies: string;
}

export interface SessionProviderProps {
  children: React.ReactNode;
  session?: Session | null;
  baseUrl?: string;
  basePath?: string;
}

type SessionContextValue = {
  data: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
};

const SessionContext = createContext<SessionContextValue | undefined>(
  undefined
);

export default function SessionProvider(props: SessionProviderProps) {
  if (!SessionContext) {
    throw new Error("React Context is unavailable in Server Components");
  }

  const { children } = props;

  // const hasInitialSession = props.session !== undefined;

  const [session] = useState<Session | null>(props.session || null);

  const value: any = useMemo(
    () => ({
      data: session,
    }),
    [session]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
