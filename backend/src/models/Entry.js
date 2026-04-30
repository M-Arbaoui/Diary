import mongoose from "mongoose";

const MOODS = ["happy", "calm", "grateful", "thoughtful", "sad", "excited"];

const entrySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, default: "", maxlength: 20000 },
    mood: { type: String, enum: MOODS, default: "calm" },
  },
  { timestamps: true }
);

export default mongoose.model("Entry", entrySchema);
export { MOODS };
