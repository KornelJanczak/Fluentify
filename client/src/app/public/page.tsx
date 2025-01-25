"use client";
// client/src/app/public/page.tsx

import React, { useState, useEffect, use } from "react";

export default function PublicPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/auth/status",
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const userData = await response.json();

        console.log(userData);
        
        setUser(userData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
        Public Page
      </h1>
      {user && (
        <div>
          <p>Welcome, {user.email}!</p>
        </div>
      )}
    </div>
  );
}
