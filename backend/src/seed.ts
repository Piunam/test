import mongoose from 'mongoose';
import { Experience } from './models/Experience.js';

const experiencesSeed = [
  {
    title: 'Sunrise Hot Air Balloon Ride',
    location: 'Napa Valley, California',
    summary: 'Float above rolling vineyards as the sun paints the valley in golden hues.',
    description:
      'Experience a breathtaking sunrise above Napa Valley in a private hot air balloon. Enjoy panoramic views, aerial photography moments, and a celebratory champagne brunch after landing.',
    heroImage:
      'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80'
    ],
    tags: ['Ballooning', 'Romantic', 'Scenic'],
    duration: '4 hours',
    groupSize: 'Up to 8 guests',
    highlights: [
      'Private pilot and ground crew',
      'Champagne brunch on landing',
      'Professional photo package'
    ],
    slots: [
      { date: '2024-11-02', time: '05:30', capacity: 8, price: 35000 },
      { date: '2024-11-05', time: '05:30', capacity: 8, price: 36000 },
      { date: '2024-11-09', time: '05:30', capacity: 8, price: 36000 }
    ]
  },
  {
    title: 'Tokyo Night Food Crawl',
    location: 'Shinjuku, Tokyo',
    summary: 'Discover hidden izakayas and street eats on an immersive guided night crawl.',
    description:
      'Join a local foodie host for an unforgettable night exploring Shinjuku\'s vibrant food scene. Sample handmade ramen, yakitori, and desserts while learning the stories behind each dish.',
    heroImage:
      'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1449049607083-e297f3badaef?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1525708827920-7d53586a1ab1?auto=format&fit=crop&w=1600&q=80'
    ],
    tags: ['Food & Drink', 'Nightlife', 'Guided'],
    duration: '3 hours',
    groupSize: 'Up to 10 guests',
    highlights: ['Local foodie host', 'All tastings included', 'Exclusive izakaya access'],
    slots: [
      { date: '2024-10-31', time: '19:00', capacity: 10, price: 12000 },
      { date: '2024-11-02', time: '19:00', capacity: 10, price: 12500 },
      { date: '2024-11-04', time: '19:00', capacity: 10, price: 12500 }
    ]
  },
  {
    title: 'Aurora Borealis Glamping Retreat',
    location: 'Tromsø, Norway',
    summary: 'Sleep under the northern lights in a luxurious glass igloo.',
    description:
      'Spend two nights in a heated glass igloo with uninterrupted views of the aurora borealis. Includes guided snowshoe trek, Sami cultural workshop, and gourmet Arctic cuisine.',
    heroImage:
      'https://images.unsplash.com/photo-1521292270410-a8c7bfdca3f0?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80'
    ],
    tags: ['Outdoors', 'Luxury', 'Multi-day'],
    duration: '2 nights',
    groupSize: 'Up to 4 guests',
    highlights: ['Glass igloo stay', 'Snowshoe trek', 'Sami cultural workshop'],
    slots: [
      { date: '2024-12-12', time: '21:00', capacity: 4, price: 58000 },
      { date: '2024-12-15', time: '21:00', capacity: 4, price: 58000 },
      { date: '2024-12-18', time: '21:00', capacity: 4, price: 60000 }
    ]
  }
];

export async function seedExperiences() {
  const count = await Experience.countDocuments();
  if (count > 0) {
    return;
  }

  await Experience.insertMany(experiencesSeed);
}

if (process.env.RUN_SEED === 'true') {
  mongoose
    .connect(process.env.MONGODB_URI ?? '')
    .then(async () => {
      await seedExperiences();
      console.log('Seed completed');
      await mongoose.disconnect();
    })
    .catch((error) => {
      console.error('Seed failed', error);
      process.exit(1);
    });
}
