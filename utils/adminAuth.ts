// utils/adminAuth.ts
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth-options"; // default import
import { redirect } from "next/navigation";

export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return (session as any)?.user?.role === "admin";
}

export async function requireAdmin() {
  const admin = await isAdmin();
  if (!admin) {
    redirect("/login");
  }
}
