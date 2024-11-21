import { getSessionToken } from "@/common/lib/auth";

export default async function PrivatePage() {
  const sessionToken = await getSessionToken();

  console.log(sessionToken);

  const response = await fetch("http://localhost:5000/api/v1/auth/status");

  console.log(response);

  return (
    <>
      <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
        Private Page
      </h1>

      <button className="mt-10 block rounded bg-pink-800/50 px-2 py-1 text-white hover:opacity-70">
        Call API
      </button>

      <div className="mt-20"></div>
    </>
  );
}
