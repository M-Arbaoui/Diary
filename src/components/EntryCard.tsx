import { Link } from "react-router-dom";
import { MoreHorizontal, Trash2, Pencil } from "lucide-react";
import type { Entry } from "@/lib/diary";
import { moodOf } from "@/lib/diary";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function EntryCard({ entry, onDelete }: { entry: Entry; onDelete: () => void }) {
  const m = moodOf(entry.mood);
  const date = new Date(entry.createdAt);

  return (
    <Link to={`/editor/${entry.id}`} className="block paper-card p-6 md:p-7 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 text-xs text-ink-muted">
          <span className="text-base leading-none">{m.emoji}</span>
          <span className="uppercase tracking-[0.18em]">
            {date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
          </span>
          <span className="opacity-50">·</span>
          <span>{date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <button
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-muted"
              aria-label="Entry actions"
            >
              <MoreHorizontal className="h-4 w-4 text-ink-muted" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem asChild>
              <Link to={`/editor/${entry.id}`} className="cursor-pointer">
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => { e.preventDefault(); onDelete(); }}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h3 className="font-serif text-2xl md:text-[26px] text-ink mt-3 leading-snug">
        {entry.title || "Untitled entry"}
      </h3>
      <p className="mt-2 text-ink-muted leading-relaxed text-[15px] line-clamp-3">
        {entry.content || "No words yet…"}
      </p>
    </Link>
  );
}
