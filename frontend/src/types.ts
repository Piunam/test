export interface ExperienceListItem {
  id: string;
  title: string;
  location: string;
  summary: string;
  heroImage: string;
  duration: string;
  groupSize: string;
  tags: string[];
  startingFrom: number;
  nextAvailableDate: string | null;
  isSoldOut: boolean;
}

export interface ExperienceDetail {
  id: string;
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
  slots: SlotAvailability[];
}

export interface SlotAvailability {
  id: string;
  date: string;
  time: string;
  capacity: number;
  price: number;
  remaining: number;
  isSoldOut: boolean;
}

export interface BookingPayload {
  experienceId: string;
  slotId: string;
  customerName: string;
  email: string;
  phone: string;
  guests: number;
  promoCode?: string;
}

export interface BookingResponse {
  id: string;
  experienceId: string;
  slotId: string;
  customerName: string;
  email: string;
  phone: string;
  guests: number;
  subtotal: number;
  discount: number;
  total: number;
  promoCode: string | null;
  createdAt: string;
  status: 'confirmed' | 'failed';
}

export interface PromoValidationResponse {
  valid: boolean;
  code: string;
  discount: number;
  finalTotal: number;
  message: string;
}
