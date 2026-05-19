"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarNav } from "./sidebar";
import { Button } from "@/components/ui";

export function MobileDrawer({ userSlot, showAdmin }: { userSlot?: React.ReactNode; showAdmin?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setOpen(false); }, [pathname]);

  // Trava scroll quando aberto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-9 w-9 p-0 lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 border-r border-border bg-background">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 h-8 w-8 p-0"
              aria-label="Fechar menu"
            >
              <X className="h-4 w-4" />
            </Button>
            <SidebarNav onNavigate={() => setOpen(false)} userSlot={userSlot} showAdmin={showAdmin} />
          </aside>
        </div>
      )}
    </>
  );
}
