import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookingResponse } from '../types';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

type ResultState =
  | { status: 'success'; booking: BookingResponse }
  | { status: 'error'; error: string }
  | undefined;

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultState;

  useEffect(() => {
    if (!state) {
      navigate('/');
    }
  }, [state, navigate]);

  useEffect(() => {
    if (state?.status === 'success') {
      document.title = 'Booking confirmed · BookIt';
    } else if (state?.status === 'error') {
      document.title = 'Booking failed · BookIt';
    }
    return () => {
      document.title = 'BookIt: Experiences & Slots';
    };
  }, [state]);

  if (!state) {
    return null;
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      {state.status === 'success' ? (
        <div className="space-y-6 rounded-4xl bg-white p-10 shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-600">
            ✓
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-slate-900">Booking confirmed!</h1>
            <p className="text-sm text-slate-500">
              A confirmation email was sent to {state.booking.email}. We\'re thrilled to host you.
            </p>
          </div>
          <div className="space-y-2 rounded-3xl bg-sand-100 p-6 text-left text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Guests</span>
              <span>{state.booking.guests}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{currency.format(state.booking.subtotal / 100)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span className="text-teal-700">- {currency.format(state.booking.discount / 100)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-base font-semibold text-slate-900">
              <span>Total charged</span>
              <span>{currency.format(state.booking.total / 100)}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
              Explore more experiences
            </Link>
            <a
              href={`mailto:${state.booking.email}?subject=Booking ${state.booking.id}`}
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:ring-slate-300"
            >
              Email itinerary
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-6 rounded-4xl bg-white p-10 shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-500">!</div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-slate-900">We couldn\'t complete your booking</h1>
            <p className="text-sm text-slate-500">{state.error}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
              Try again
            </Link>
            <a
              href="mailto:hello@bookit.travel"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:ring-slate-300"
            >
              Contact support
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
