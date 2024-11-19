import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      //@ts-ignore
      async authorize(credentials, req) {
        console.log("a");
        const user = { id: 1, name: "John Doe", email: "  " };
        // const user = await fetch(
        //   `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
        // );

        // console.log(user);

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
};

export default NextAuth(authOptions);
