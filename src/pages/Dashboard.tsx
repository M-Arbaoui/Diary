import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEntries, MOODS, moodOf, type Mood } from "@/lib/diary";
import { EntryCard } from "@/components/EntryCard";

export default function Dashboard() {
  const { entries, loading, remove } = useEntries();
  const [query, setQuery] = useState("");
  const [mood, setMood] = useState<Mood | "all">("all");

  const filtered = useMemo(() => {
    return entries
      .filter((e) => (mood === "all" ? true : e.mood === mood))
      .filter((e) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q);
      })
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [entries, query, mood]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const e of filtered) {
      const d = new Date(e.createdAt);
      const key = d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-10 md:py-14">
      <header className="mb-10 animate-fade-up">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">Your journal</p>
        <h1 className="font-serif text-4xl md:text-5xl text-ink mt-2">
          {entries.length > 0 ? "Welcome back." : "A blank page awaits."}
        </h1>
        <p className="text-ink-muted mt-2">
          {entries.length} {entries.length === 1 ? "entry" : "entries"} · written with care
        </p>
      </header>

      {/* Search + filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your entries…"
            className="pl-11 h-12 rounded-2xl bg-card border-border/70 focus-visible:ring-primary/40"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        <FilterChip active={mood === "all"} onClick={() => setMood("all")}>All</FilterChip>
        {MOODS.map((m) => (
          <FilterChip key={m.id} active={mood === m.id} onClick={() => setMood(m.id)}>
            <span>{m.emoji}</span> <span>{m.label}</span>
          </FilterChip>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState hasEntries={entries.length > 0} />
      ) : (
        <div className="space-y-12">
          {grouped.map(([month, items]) => (
            <section key={month}>
              <h2 className="font-serif text-lg text-ink-muted italic mb-5 pl-1">{month}</h2>
              <div className="relative pl-8 md:pl-10">
                <div className="absolute left-2 md:left-3 top-2 bottom-2 w-px timeline-line" />
                <div className="space-y-5">
                  {items.map((e, i) => (
                    <div key={e.id} className="relative animate-fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                      <div className="absolute -left-[26px] md:-left-[30px] top-6 h-3 w-3 rounded-full bg-card border-2 border-primary" />
                      <EntryCard entry={e} onDelete={() => remove(e.id)} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 h-9 rounded-full text-sm flex items-center gap-1.5 border transition-all ${
        active
          ? "bg-foreground text-background border-foreground"
          : "bg-card text-ink-muted border-border/70 hover:text-ink hover:border-border"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ hasEntries }: { hasEntries: boolean }) {
  return (
    <div className="paper-card p-12 md:p-16 text-center animate-fade-up">
      <div className="mx-auto h-20 w-20 rounded-full bg-sage-soft flex items-center justify-center mb-6">
        <BookOpen className="h-9 w-9 text-ink" strokeWidth={1.5} />
      </div>
      <h3 className="font-serif text-2xl text-ink">
        {hasEntries ? "Nothing matches that." : "Begin your story."}
      </h3>
      <p className="text-ink-muted mt-2 max-w-sm mx-auto">
        {hasEntries
          ? "Try a different search or clear your filters."
          : "Your first entry is the hardest. After that, words flow easier."}
      </p>
      <Button asChild className="mt-6 rounded-full bg-foreground text-background hover:bg-foreground/90">
        <Link to="/editor/new"><Plus className="h-4 w-4 mr-1.5" /> Write your first entry</Link>
      </Button>
    </div>
  );
}
