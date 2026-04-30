import { Router } from "express";
import Entry, { MOODS } from "../models/Entry.js";

const router = Router();

// GET /api/entries?search=&mood=
router.get("/", async (req, res, next) => {
  try {
    const { search, mood } = req.query;
    const q = {};
    if (mood && MOODS.includes(mood)) q.mood = mood;
    if (search) {
      q.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }
    const entries = await Entry.find(q).sort({ createdAt: -1 });
    res.json(entries);
  } catch (e) { next(e); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: "Not found" });
    res.json(entry);
  } catch (e) { next(e); }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, content, mood } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ error: "Title is required" });
    const entry = await Entry.create({ title, content, mood });
    res.status(201).json(entry);
  } catch (e) { next(e); }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { title, content, mood } = req.body;
    const entry = await Entry.findByIdAndUpdate(
      req.params.id,
      { title, content, mood },
      { new: true, runValidators: true }
    );
    if (!entry) return res.status(404).json({ error: "Not found" });
    res.json(entry);
  } catch (e) { next(e); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const entry = await Entry.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
