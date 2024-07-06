import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";
import Sidebar from "./_components/sidebar";

export const metadata = {
  title: "Protected Routes",
};

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <Sidebar />

      <div className="flex items-center justify-center mx-4 my-6 lg:mt-20">
        {children}
      </div>
    </SessionProvider>
  );
}
