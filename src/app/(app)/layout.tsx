import { AppShell } from "@/components/app/app-shell";
import { requireUser } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Middleware já redireciona não-autenticados, mas reforçamos aqui pro edge cases.
  await requireUser();
  return <AppShell>{children}</AppShell>;
}
