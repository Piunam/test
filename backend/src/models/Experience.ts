import mongoose, { Document, Schema } from 'mongoose';

export interface SlotOption {
  _id: mongoose.Types.ObjectId;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // 24h time, e.g. "09:00"
  capacity: number;
  price: number; // price per guest in cents
}

export interface ExperienceDocument extends Document {
  title: string;
  location: string;
  summary: string;
  description: string;
  heroImage: string;
  gallery: string[];
  tags: string[];
  duration: string;
  groupSize: string;
  highlights: string[];
  slots: mongoose.Types.DocumentArray<SlotOption>;
}

const SlotSchema = new Schema<SlotOption>(
  {
    date: { type: String, required: true },
    time: { type: String, required: true },
    capacity: { type: Number, required: true },
    price: { type: Number, required: true }
  },
  { _id: true }
);

const ExperienceSchema = new Schema<ExperienceDocument>(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    heroImage: { type: String, required: true },
    gallery: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    duration: { type: String, required: true },
    groupSize: { type: String, required: true },
    highlights: { type: [String], default: [] },
    slots: { type: [SlotSchema], default: [] }
  },
  { timestamps: true }
);

export const Experience = mongoose.model<ExperienceDocument>('Experience', ExperienceSchema);
