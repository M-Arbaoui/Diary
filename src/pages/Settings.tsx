import { Moon, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";
import { useEntries } from "@/lib/diary";
import { toast } from "sonner";

export default function Settings() {
  const { theme, toggle } = useTheme();
  const { entries } = useEntries();

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `my-diary-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported your journal");
  };

  return (
    <div className="max-w-2xl mx-auto px-6 md:px-10 py-10 md:py-14 animate-fade-up">
      <header className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">Settings</p>
        <h1 className="font-serif text-4xl md:text-5xl text-ink mt-2">Make it yours.</h1>
      </header>

      <section className="paper-card p-6 md:p-8 mb-5">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-gradient-sage flex items-center justify-center">
            <User className="h-6 w-6 text-foreground" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-xl text-ink">A quiet writer</h2>
            <p className="text-sm text-ink-muted">Local journal · {entries.length} entries</p>
          </div>
        </div>
      </section>

      <section className="paper-card p-6 md:p-8 mb-5">
        <h2 className="font-serif text-xl text-ink mb-1">Appearance</h2>
        <p className="text-sm text-ink-muted mb-5">Switch between paper and dusk.</p>
        <div className="flex items-center justify-between rounded-xl bg-muted/60 p-4">
          <div className="flex items-center gap-3">
            {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <div>
              <p className="text-sm font-medium text-ink">{theme === "dark" ? "Dusk mode" : "Paper mode"}</p>
              <p className="text-xs text-ink-muted">Currently {theme}</p>
            </div>
          </div>
          <Switch checked={theme === "dark"} onCheckedChange={toggle} />
        </div>
      </section>

      <section className="paper-card p-6 md:p-8">
        <h2 className="font-serif text-xl text-ink mb-1">Your data</h2>
        <p className="text-sm text-ink-muted mb-5">Take your words anywhere.</p>
        <Button onClick={exportJson} className="rounded-full bg-foreground text-background hover:bg-foreground/90">
          Export as JSON
        </Button>
      </section>
    </div>
  );
}
