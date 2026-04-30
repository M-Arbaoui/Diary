import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Feather, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
      {/* soft animated blobs */}
      <div className="absolute inset-0 -z-10 bg-gradient-warm" />
      <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-sage-soft opacity-60 blur-3xl animate-blob -z-10" />
      <div className="absolute top-40 -right-24 w-[28rem] h-[28rem] rounded-full bg-beige-soft opacity-70 blur-3xl animate-blob -z-10" style={{ animationDelay: "4s" }} />

      <section className="max-w-5xl mx-auto px-6 md:px-10 pt-20 md:pt-32 pb-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 backdrop-blur px-4 py-1.5 mb-8 animate-fade-in">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="text-xs tracking-wide text-ink-muted">A quiet place to write</span>
        </div>

        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-ink leading-[1.05] tracking-tight animate-fade-up">
          The diary that feels
          <br />
          <span className="italic text-primary">like paper.</span>
        </h1>

        <p className="mt-8 max-w-xl mx-auto text-base md:text-lg text-ink-muted leading-relaxed animate-fade-up" style={{ animationDelay: "0.1s" }}>
          A calm, distraction-free space for your daily thoughts. Write, reflect, and watch
          your timeline grow — softly.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <Button asChild size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-7 h-12">
            <Link to="/dashboard">
              Open my journal <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="rounded-full px-7 h-12 hover:bg-card">
            <Link to="/editor/new">Start writing</Link>
          </Button>
        </div>

        {/* preview mock */}
        <div className="relative mt-20 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="paper-card text-left p-8 md:p-10">
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <span>🌿</span>
              <span className="uppercase tracking-[0.18em]">Tuesday · April 30</span>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-ink mt-3">Morning light through the curtains</h3>
            <p className="mt-3 text-ink-muted leading-relaxed text-[15px]">
              Woke up earlier than usual and watched the sun spill across the kitchen tiles. Made
              coffee slowly, no phone, just the kettle humming…
            </p>
          </div>
          <div className="absolute -bottom-6 -right-4 md:-right-10 paper-card p-4 hidden md:flex items-center gap-3 animate-float">
            <div className="h-9 w-9 rounded-full bg-sage-soft flex items-center justify-center">
              <Heart className="h-4 w-4 text-primary" fill="currentColor" />
            </div>
            <div className="text-left">
              <p className="text-xs text-ink-muted">Auto-saved</p>
              <p className="font-serif text-sm text-ink">just now</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 md:px-10 pb-24 grid md:grid-cols-3 gap-5">
        {[
          { icon: Feather, title: "Write softly", text: "A wide, quiet writing area. No toolbars shouting at you." },
          { icon: BookOpen, title: "A timeline of you", text: "Your entries arrange themselves into a gentle chronology." },
          { icon: Heart, title: "Mood, gently", text: "Tag how you felt. Spot patterns without trying." },
        ].map((f, i) => (
          <div key={f.title} className="paper-card p-6 animate-fade-up" style={{ animationDelay: `${0.1 * i}s` }}>
            <div className="h-10 w-10 rounded-xl bg-sage-soft flex items-center justify-center mb-4">
              <f.icon className="h-5 w-5 text-ink" />
            </div>
            <h3 className="font-serif text-xl text-ink">{f.title}</h3>
            <p className="text-sm text-ink-muted mt-1.5 leading-relaxed">{f.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
