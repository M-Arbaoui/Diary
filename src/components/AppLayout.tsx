import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

export default function AppLayout() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + / to toggle dark mode
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [toggleTheme]);

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <header className="sticky top-0 z-40 glass-nav">
        <div className="h-16 flex items-center justify-between px-4 md:px-8 max-w-6xl mx-auto w-full">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/favicon.png" alt="My Diary Logo" className="h-12 w-12 rounded-xl shadow-soft shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="font-serif text-lg text-ink">My Diary</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">a quiet place</span>
            </div>
          </Link>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full h-10 w-10 text-ink-muted hover:text-ink hover:bg-card"
            title={`Toggle dark mode (Cmd/Ctrl + /)`}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
