// client/src/app/page.tsx

import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
        Home Page
      </h1>
    </main>
  );
}
