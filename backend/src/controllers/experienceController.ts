import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Experience } from '../models/Experience.js';
import { Booking } from '../models/Booking.js';

function computeAvailability(experience: any, bookings: any[]) {
  return experience.slots.map((slot: any) => {
    const slotBookings = bookings.filter((booking) => booking.slotId.toString() === slot._id.toString());
    const remaining = Math.max(slot.capacity - slotBookings.length, 0);
    return {
      id: slot._id,
      date: slot.date,
      time: slot.time,
      capacity: slot.capacity,
      price: slot.price,
      remaining,
      isSoldOut: remaining === 0
    };
  });
}

export async function listExperiences(_req: Request, res: Response) {
  const experiences = await Experience.find().sort({ createdAt: 1 }).lean();
  const bookings = await Booking.aggregate([
    { $group: { _id: { experienceId: '$experienceId', slotId: '$slotId' }, count: { $sum: 1 } } }
  ]);

  const availabilityMap = new Map<string, Map<string, number>>();
  bookings.forEach((item) => {
    const { experienceId, slotId } = item._id as { experienceId: mongoose.Types.ObjectId; slotId: mongoose.Types.ObjectId };
    if (!availabilityMap.has(experienceId.toString())) {
      availabilityMap.set(experienceId.toString(), new Map());
    }
    availabilityMap.get(experienceId.toString())!.set(slotId.toString(), item.count as number);
  });

  const payload = experiences.map((experience) => {
    const slotAvailability = availabilityMap.get(experience._id.toString()) ?? new Map();
    const firstAvailableSlot = experience.slots.find((slot: any) => {
      const booked = slotAvailability.get(slot._id.toString()) ?? 0;
      return booked < slot.capacity;
    });

    return {
      id: experience._id,
      title: experience.title,
      location: experience.location,
      summary: experience.summary,
      heroImage: experience.heroImage,
      duration: experience.duration,
      groupSize: experience.groupSize,
      tags: experience.tags,
      startingFrom: experience.slots.reduce((min: number, slot: any) => (slot.price < min ? slot.price : min), experience.slots[0]?.price ?? 0),
      nextAvailableDate: firstAvailableSlot?.date ?? null,
      isSoldOut: !firstAvailableSlot
    };
  });

  res.json(payload);
}

export async function getExperience(req: Request, res: Response) {
  const { id } = req.params;
  const experience = await Experience.findById(id).lean();

  if (!experience) {
    return res.status(404).json({ message: 'Experience not found' });
  }

  const bookings = await Booking.find({ experienceId: experience._id }).lean();
  const slots = computeAvailability(experience, bookings);

  res.json({
    id: experience._id,
    title: experience.title,
    location: experience.location,
    summary: experience.summary,
    description: experience.description,
    heroImage: experience.heroImage,
    gallery: experience.gallery,
    tags: experience.tags,
    duration: experience.duration,
    groupSize: experience.groupSize,
    highlights: experience.highlights,
    slots
  });
}
