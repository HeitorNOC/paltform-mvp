import NextAuth, { User as NextAuthUser } from "next-auth";

interface User extends NextAuthUser {
  role: String;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
}

declare module "next-auth" {
  interface JWT {
    role: String;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
  }

  interface Session {
    user: User & Session["user"];
  }
}
