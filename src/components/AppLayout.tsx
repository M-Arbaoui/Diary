import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Moon, Plus, Sun } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export default function AppLayout() {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onEditor = pathname.startsWith("/editor");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-40 glass-nav">
            <div className="h-16 flex items-center justify-between px-4 md:px-8">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="rounded-xl hover:bg-muted" />
                <div className="hidden sm:block">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-ink-muted">
                    {new Date().toLocaleDateString(undefined, { weekday: "long" })}
                  </p>
                  <p className="font-serif text-sm text-ink -mt-0.5">
                    {new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggle}
                  className="rounded-xl hover:bg-muted"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                {!onEditor && (
                  <Button
                    onClick={() => navigate("/editor/new")}
                    className="rounded-xl bg-foreground text-background hover:bg-foreground/90 hidden sm:flex"
                  >
                    <Plus className="h-4 w-4 mr-1.5" /> New entry
                  </Button>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 relative">
            <Outlet />

            {!onEditor && (
              <button
                onClick={() => navigate("/editor/new")}
                className="sm:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full bg-foreground text-background shadow-float flex items-center justify-center hover:scale-105 transition-transform z-50"
                aria-label="New entry"
              >
                <Plus className="h-6 w-6" />
              </button>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
