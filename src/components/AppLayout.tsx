import { Link, Outlet, useLocation } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function AppLayout() {
  const { pathname } = useLocation();
  const onLanding = pathname === "/";

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <header className="sticky top-0 z-40 glass-nav">
        <div className="h-16 flex items-center justify-between px-4 md:px-8 max-w-6xl mx-auto w-full">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-sage flex items-center justify-center shadow-soft shrink-0">
              <BookOpen className="h-4 w-4 text-foreground" strokeWidth={2} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-serif text-lg text-ink">My Diary</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">a quiet place</span>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 h-9 rounded-full text-sm flex items-center transition-colors ${
                onLanding ? "text-ink font-medium" : "text-ink-muted hover:text-ink"
              }`}
            >
              Home
            </Link>
            <Link
              to="/journal"
              className={`px-4 h-9 rounded-full text-sm flex items-center transition-colors ${
                !onLanding ? "bg-foreground text-background" : "text-ink-muted hover:text-ink"
              }`}
            >
              My Journal
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
