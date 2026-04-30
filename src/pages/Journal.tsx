import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Search, Plus, ArrowLeft, Check, Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEntries, MOODS, type Mood, type Entry } from "@/lib/diary";
import { moodOf } from "@/lib/diary";
import { toast } from "sonner";

type View = { mode: "list" } | { mode: "edit"; id: string | "new" };

const VIEW_KEY = "my-diary-view";

function loadView(): View {
  try {
    const raw = localStorage.getItem(VIEW_KEY);
    if (raw) return JSON.parse(raw) as View;
  } catch { /* ignore */ }
  return { mode: "list" };
}

export default function Journal() {
  const { entries, loading, create, update, remove, get } = useEntries();
  const [view, setView] = useState<View>(loadView);

  useEffect(() => {
    localStorage.setItem(VIEW_KEY, JSON.stringify(view));
  }, [view]);

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
    const map = new Map<string, Entry[]>();
    for (const e of filtered) {
      const d = new Date(e.createdAt);
      const key = d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return Array.from(map.entries());
  }, [filtered]);

  if (view.mode === "edit") {
    return (
      <EntryEditor
        key={view.id}
        entryId={view.id}
        get={get}
        create={create}
        update={update}
        remove={remove}
        onClose={() => setView({ mode: "list" })}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-10 md:py-14">
      <header className="mb-10 animate-fade-up flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">Your journal</p>
          <h1 className="font-serif text-4xl md:text-5xl text-ink mt-2">
            {entries.length > 0 ? "Welcome back." : "A blank page awaits."}
          </h1>
          <p className="text-ink-muted mt-2">
            {entries.length} {entries.length === 1 ? "entry" : "entries"} · written with care
          </p>
        </div>
        <Button
          onClick={() => setView({ mode: "edit", id: "new" })}
          className="rounded-full bg-foreground text-background hover:bg-foreground/90 h-11 px-6"
        >
          <Plus className="h-4 w-4 mr-1.5" /> New entry
        </Button>
      </header>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
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

      {loading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState hasEntries={entries.length > 0} onWrite={() => setView({ mode: "edit", id: "new" })} />
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
                      <EntryRow
                        entry={e}
                        onOpen={() => setView({ mode: "edit", id: e.id })}
                        onDelete={() => remove(e.id)}
                      />
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

function EntryRow({ entry, onOpen, onDelete }: { entry: Entry; onOpen: () => void; onDelete: () => void }) {
  const m = moodOf(entry.mood);
  const date = new Date(entry.createdAt);
  return (
    <div onClick={onOpen} className="block paper-card p-6 md:p-7 group cursor-pointer">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 text-xs text-ink-muted">
          <span className="text-base leading-none">{m.emoji}</span>
          <span className="uppercase tracking-[0.18em]">
            {date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-destructive/10 text-ink-muted hover:text-destructive"
          aria-label="Delete entry"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <h3 className="font-serif text-2xl md:text-[26px] text-ink mt-3 leading-snug">
        {entry.title || "Untitled entry"}
      </h3>
      <p className="mt-2 text-ink-muted leading-relaxed text-[15px] line-clamp-3">
        {entry.content || "No words yet…"}
      </p>
    </div>
  );
}

function EmptyState({ hasEntries, onWrite }: { hasEntries: boolean; onWrite: () => void }) {
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
      <Button onClick={onWrite} className="mt-6 rounded-full bg-foreground text-background hover:bg-foreground/90">
        <Plus className="h-4 w-4 mr-1.5" /> Write your first entry
      </Button>
    </div>
  );
}

function EntryEditor({
  entryId,
  get,
  create,
  update,
  remove,
  onClose,
}: {
  entryId: string | "new";
  get: (id: string) => Entry | undefined;
  create: ReturnType<typeof useEntries>["create"];
  update: ReturnType<typeof useEntries>["update"];
  remove: ReturnType<typeof useEntries>["remove"];
  onClose: () => void;
}) {
  const isNew = entryId === "new";
  const existing = isNew ? null : get(entryId);
  const DRAFT_KEY = "my-diary-draft-new";

  // Restore an in-progress new-entry draft if present
  const draft = (() => {
    if (!isNew) return null;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? (JSON.parse(raw) as { title: string; content: string; mood: Mood }) : null;
    } catch { return null; }
  })();

  const [title, setTitle] = useState(existing?.title ?? draft?.title ?? "");
  const [content, setContent] = useState(existing?.content ?? draft?.content ?? "");
  const [mood, setMood] = useState<Mood>(existing?.mood ?? draft?.mood ?? "calm");
  const [currentId, setCurrentId] = useState<string | null>(existing?.id ?? null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const initialized = useRef(false);
  const saveTimer = useRef<number | null>(null);

  // Keep a live draft snapshot of unsaved new entries so refresh never loses work
  useEffect(() => {
    if (currentId) return; // once saved, the entry itself is the source of truth
    if (!title.trim() && !content.trim()) {
      localStorage.removeItem(DRAFT_KEY);
      return;
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, content, mood }));
  }, [title, content, mood, currentId]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    if (!title.trim() && !content.trim()) return;

    setStatus("saving");
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      if (currentId) {
        update(currentId, { title, content, mood });
      } else {
        const e = create({ title: title || "Untitled entry", content, mood });
        setCurrentId(e.id);
        localStorage.removeItem(DRAFT_KEY);
      }
      setStatus("saved");
      window.setTimeout(() => setStatus("idle"), 1500);
    }, 700);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, mood]);

  const handleDelete = () => {
    if (currentId) {
      remove(currentId);
      toast.success("Entry deleted");
    }
    localStorage.removeItem(DRAFT_KEY);
    onClose();
  };

  const handleDone = () => {
    // Flush any pending debounced save immediately
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    if (title.trim() || content.trim()) {
      if (currentId) {
        update(currentId, { title, content, mood });
      } else {
        create({ title: title || "Untitled entry", content, mood });
      }
    }
    localStorage.removeItem(DRAFT_KEY);
    toast.success(currentId ? "Entry saved" : "Saved to your journal");
    onClose();
  };


  return (
    <div className="max-w-3xl mx-auto px-6 md:px-10 py-8 md:py-12 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          onClick={onClose}
          className="rounded-full hover:bg-card text-ink-muted -ml-3"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to journal
        </Button>

        <div className="flex items-center gap-2 text-xs text-ink-muted h-8">
          {status === "saving" && (
            <span className="flex items-center gap-1.5 animate-fade-in">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
            </span>
          )}
          {status === "saved" && (
            <span className="flex items-center gap-1.5 text-primary animate-fade-in">
              <Check className="h-3.5 w-3.5" /> Saved
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {MOODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMood(m.id)}
            className={`px-3.5 h-9 rounded-full text-sm flex items-center gap-1.5 border transition-all ${
              mood === m.id
                ? "bg-sage-soft border-primary text-ink"
                : "bg-card border-border/70 text-ink-muted hover:text-ink"
            }`}
          >
            <span>{m.emoji}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Give today a title…"
        className="w-full bg-transparent border-0 outline-none font-serif text-4xl md:text-5xl text-ink placeholder:text-ink-muted/50 leading-tight tracking-tight"
      />

      <div className="my-6 flex items-center gap-3 text-xs text-ink-muted">
        <span className="h-px flex-1 bg-border/70" />
        <span>{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</span>
        <span className="h-px flex-1 bg-border/70" />
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write whatever's on your mind. No one's reading but you."
        rows={16}
        className="w-full bg-transparent border-0 outline-none resize-none text-[17px] leading-[1.85] text-ink placeholder:text-ink-muted/60 font-sans"
      />

      <div className="mt-12 flex items-center justify-between border-t border-border/60 pt-6">
        <div className="text-xs text-ink-muted">
          {content.trim().split(/\s+/).filter(Boolean).length} words
        </div>
        <div className="flex items-center gap-2">
          {currentId && (
            <Button
              variant="ghost"
              onClick={handleDelete}
              className="rounded-full text-ink-muted hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-1.5" /> Delete
            </Button>
          )}
          <Button
            onClick={handleDone}
            className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-6"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
