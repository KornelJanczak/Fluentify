import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function PrivatePage() {
  const { getAccessTokenRaw } = getKindeServerSession();
  const accessToken = await getAccessTokenRaw();
  const response = await fetch("http://localhost:5000/api/protected", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  console.log(data);

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
