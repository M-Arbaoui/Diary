import { useEffect, useState, useCallback } from "react";

export type Mood = "happy" | "calm" | "grateful" | "thoughtful" | "sad" | "excited";

export const MOODS: { id: Mood; emoji: string; label: string }[] = [
  { id: "happy", emoji: "😊", label: "Happy" },
  { id: "calm", emoji: "🌿", label: "Calm" },
  { id: "grateful", emoji: "🙏", label: "Grateful" },
  { id: "thoughtful", emoji: "💭", label: "Thoughtful" },
  { id: "sad", emoji: "🌧️", label: "Sad" },
  { id: "excited", emoji: "✨", label: "Excited" },
];

export interface Entry {
  id: string;
  title: string;
  content: string;
  mood: Mood;
  createdAt: string;
  updatedAt: string;
}

const KEY = "my-diary-entries";

const seed = (): Entry[] => {
  const now = Date.now();
  const day = 86400000;
  return [
    {
      id: crypto.randomUUID(),
      title: "Morning light through the curtains",
      content:
        "Woke up earlier than usual and watched the sun spill across the kitchen tiles. Made coffee slowly, no phone, just the kettle humming. There's a particular peace in unhurried mornings — I want more of them.",
      mood: "calm",
      createdAt: new Date(now - day * 6).toISOString(),
      updatedAt: new Date(now - day * 6).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: "A small win at work",
      content:
        "Shipped the feature I've been wrestling with for two weeks. The team noticed. I'm learning that patience compounds — the slow days were doing more than I thought.",
      mood: "happy",
      createdAt: new Date(now - day * 3).toISOString(),
      updatedAt: new Date(now - day * 3).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: "Evening walk, no destination",
      content:
        "Took the long way home through the park. The leaves are turning. Thought about how much of life happens in transit — between things, between thoughts.",
      mood: "thoughtful",
      createdAt: new Date(now - day * 1).toISOString(),
      updatedAt: new Date(now - day * 1).toISOString(),
    },
  ];
};

function read(): Entry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const s = seed();
      localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw) as Entry[];
  } catch {
    return [];
  }
}

function write(entries: Entry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event("diary:update"));
}

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setEntries(read());
      setLoading(false);
    }, 350);
    const onUpdate = () => setEntries(read());
    window.addEventListener("diary:update", onUpdate);
    return () => {
      clearTimeout(t);
      window.removeEventListener("diary:update", onUpdate);
    };
  }, []);

  const create = useCallback((data: Omit<Entry, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const entry: Entry = { ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
    write([entry, ...read()]);
    return entry;
  }, []);

  const update = useCallback((id: string, data: Partial<Omit<Entry, "id" | "createdAt">>) => {
    const next = read().map((e) =>
      e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e
    );
    write(next);
  }, []);

  const remove = useCallback((id: string) => {
    write(read().filter((e) => e.id !== id));
  }, []);

  const get = useCallback((id: string) => read().find((e) => e.id === id), []);

  return { entries, loading, create, update, remove, get };
}

export function moodOf(id: Mood) {
  return MOODS.find((m) => m.id === id) ?? MOODS[1];
}
