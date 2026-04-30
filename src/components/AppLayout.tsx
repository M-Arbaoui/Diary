import { Link, Outlet } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <header className="sticky top-0 z-40 glass-nav">
        <div className="h-16 flex items-center px-4 md:px-8 max-w-6xl mx-auto w-full">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-sage flex items-center justify-center shadow-soft shrink-0">
              <BookOpen className="h-4 w-4 text-foreground" strokeWidth={2} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-serif text-lg text-ink">My Diary</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">a quiet place</span>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
