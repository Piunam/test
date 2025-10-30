import mongoose, { Document, Schema } from 'mongoose';

export interface BookingDocument extends Document {
  experienceId: mongoose.Types.ObjectId;
  slotId: mongoose.Types.ObjectId;
  customerName: string;
  email: string;
  phone: string;
  guests: number;
  promoCode?: string;
  subtotal: number;
  discount: number;
  total: number;
  status: 'confirmed' | 'failed';
}

const BookingSchema = new Schema<BookingDocument>(
  {
    experienceId: { type: Schema.Types.ObjectId, ref: 'Experience', required: true },
    slotId: { type: Schema.Types.ObjectId, required: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    guests: { type: Number, required: true, min: 1 },
    promoCode: { type: String },
    subtotal: { type: Number, required: true },
    discount: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: ['confirmed', 'failed'], default: 'confirmed' }
  },
  { timestamps: true }
);

export const Booking = mongoose.model<BookingDocument>('Booking', BookingSchema);
