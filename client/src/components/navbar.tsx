"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn } from "@/common/lib/auth";

const navItems = {
  nextLinks: [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Public",
      href: "/public",
    },
    {
      name: "Private",
      href: "/private",
    },
  ],
  anchorLinks: {
    loginItem: {
      name: "Login",
      href: "/api/auth/login",
    },
    logoutItem: {
      name: "Logout",
      href: "/api/auth/logout",
    },
  },
};

export default function Navbar() {
  let pathname = usePathname();

  const singInHandler = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`);
  };

  return (
    <>
      <nav className="bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-center mx-auto p-4">
          <div className="w-full md:block md:w-auto" id="navbar-default">
            <div className="flex gap-8  items-center justify-center flex-row">
              {navItems.nextLinks.map((item) => {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      item.href === pathname
                        ? "block rounded md:p-0 hover:opacity-70 text-pink-500"
                        : "block rounded md:p-0 hover:opacity-70 text-white"
                    }
                  >
                    {item.name}
                  </Link>
                );
              })}
              <button onClick={singInHandler}>Login</button>
              <button>Logout</button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
