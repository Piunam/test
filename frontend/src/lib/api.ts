import axios from 'axios';
import {
  BookingPayload,
  BookingResponse,
  ExperienceDetail,
  ExperienceListItem,
  PromoValidationResponse
} from '../types';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}` : '/api'
});

export async function fetchExperiences(): Promise<ExperienceListItem[]> {
  const { data } = await apiClient.get<ExperienceListItem[]>('/experiences');
  return data;
}

export async function fetchExperience(id: string): Promise<ExperienceDetail> {
  const { data } = await apiClient.get<ExperienceDetail>(`/experiences/${id}`);
  return data;
}

export async function createBooking(payload: BookingPayload): Promise<BookingResponse> {
  const { data } = await apiClient.post<BookingResponse>('/bookings', payload);
  return data;
}

export async function validatePromo(code: string, subtotal: number): Promise<PromoValidationResponse> {
  const { data } = await apiClient.post<PromoValidationResponse>('/promo/validate', { code, subtotal });
  return data;
}
