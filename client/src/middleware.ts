import { withAuth } from "@kinde-oss/kinde-auth-nextjs/server";

export default function middleware(req) {
  return withAuth(req);
}

export const config = {
  matcher: ["/private"],
};
