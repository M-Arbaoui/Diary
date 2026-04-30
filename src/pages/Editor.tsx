import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOODS, useEntries, type Mood } from "@/lib/diary";
import { toast } from "sonner";

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { get, create, update, remove } = useEntries();
  const isNew = !id || id === "new";

  const existing = useMemo(() => (isNew ? null : get(id!)), [id, isNew, get]);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [content, setContent] = useState(existing?.content ?? "");
  const [mood, setMood] = useState<Mood>(existing?.mood ?? "calm");
  const [entryId, setEntryId] = useState<string | null>(existing?.id ?? null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const initialized = useRef(false);
  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!isNew && !existing) {
      navigate("/dashboard", { replace: true });
    }
  }, [isNew, existing, navigate]);

  // Simulated auto-save
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    if (!title.trim() && !content.trim()) return;

    setStatus("saving");
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      if (entryId) {
        update(entryId, { title, content, mood });
      } else {
        const e = create({ title: title || "Untitled entry", content, mood });
        setEntryId(e.id);
        // reflect new id in URL without reload
        window.history.replaceState(null, "", `/editor/${e.id}`);
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
    if (entryId) {
      remove(entryId);
      toast.success("Entry deleted");
    }
    navigate("/dashboard");
  };

  const handleDone = () => {
    toast.success(entryId ? "Entry saved" : "Saved to your journal");
    navigate("/dashboard");
  };

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-10 py-8 md:py-12 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="rounded-full hover:bg-card text-ink-muted -ml-3"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
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

      {/* Mood selector */}
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
          {entryId && (
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
