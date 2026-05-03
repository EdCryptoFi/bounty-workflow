import { notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Não-admins recebem 404 pra não vazar a existência da área
  if (!(await isAdmin())) notFound();
  return <>{children}</>;
}
