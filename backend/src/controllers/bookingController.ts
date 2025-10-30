import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { Booking } from '../models/Booking.js';
import { Experience } from '../models/Experience.js';
import { validatePromo } from '../utils/promotions.js';

const bookingSchema = z.object({
  experienceId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  slotId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  customerName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  guests: z.number().int().min(1).max(10),
  promoCode: z.string().optional()
});

export async function createBooking(req: Request, res: Response) {
  const parseResult = bookingSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid booking data', issues: parseResult.error.flatten() });
  }

  const { experienceId, slotId, customerName, email, phone, guests, promoCode } = parseResult.data;

  const experience = await Experience.findById(experienceId);
  if (!experience) {
    return res.status(404).json({ message: 'Experience not found' });
  }

  const slot = experience.slots.id(slotId as unknown as mongoose.Types.ObjectId);
  if (!slot) {
    return res.status(404).json({ message: 'Selected slot not found' });
  }

  const existingBookings = await Booking.countDocuments({ experienceId, slotId });
  if (existingBookings >= slot.capacity) {
    return res.status(409).json({ message: 'Selected slot is no longer available' });
  }

  const subtotal = slot.price * guests;
  const promo = promoCode ? validatePromo(promoCode, subtotal) : { valid: false, code: '', discountAmount: 0, message: '' };
  const discount = promo.valid ? promo.discountAmount : 0;
  const total = subtotal - discount;

  const booking = await Booking.create({
    experienceId,
    slotId,
    customerName,
    email,
    phone,
    guests,
    promoCode: promo.valid ? promo.code : undefined,
    subtotal,
    discount,
    total,
    status: 'confirmed'
  });

  res.status(201).json({
    id: booking._id,
    experienceId,
    slotId,
    customerName,
    email,
    phone,
    guests,
    subtotal,
    discount,
    total,
    promoCode: booking.promoCode ?? null,
    createdAt: booking.createdAt,
    status: booking.status
  });
}

const promoSchema = z.object({
  code: z.string().min(1),
  subtotal: z.number().min(0)
});

export function validatePromoCode(req: Request, res: Response) {
  const parsed = promoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.flatten() });
  }

  const { code, subtotal } = parsed.data;
  const result = validatePromo(code, subtotal);
  return res.json({
    valid: result.valid,
    code: result.code,
    discount: result.discountAmount,
    finalTotal: subtotal - result.discountAmount,
    message: result.message
  });
}
