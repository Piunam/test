import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PromoInput from '../components/PromoInput';
import { useBooking } from '../context/BookingContext';
import { createBooking } from '../lib/api';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { experience, slot, formValues, updateFormValues, updateGuests, reset } = useBooking();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!experience || !slot) {
      navigate('/');
    }
  }, [experience, slot, navigate]);

  useEffect(() => {
    if (experience) {
      document.title = `Checkout · ${experience.title}`;
    }
    return () => {
      document.title = 'BookIt: Experiences & Slots';
    };
  }, [experience]);

  const subtotal = useMemo(() => {
    if (!slot) return 0;
    return slot.price * (formValues.guests || 1);
  }, [slot, formValues.guests]);

  const total = Math.max(subtotal - discount, 0);

  const resetPromotion = useCallback(() => {
    setDiscount(0);
    setPromoCode(undefined);
    updateFormValues({ promoCode: undefined });
  }, [updateFormValues]);

  useEffect(() => {
    resetPromotion();
  }, [subtotal, resetPromotion]);

  useEffect(() => {
    resetPromotion();
  }, [slot?.id, resetPromotion]);

  function handlePromo(discountAmount: number, code: string | undefined) {
    setDiscount(discountAmount);
    setPromoCode(code);
    updateFormValues({ promoCode: code });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!experience || !slot) return;

    setSubmitting(true);
    setError(null);

    try {
      const booking = await createBooking({
        experienceId: experience.id,
        slotId: slot.id,
        customerName: formValues.customerName,
        email: formValues.email,
        phone: formValues.phone,
        guests: formValues.guests,
        promoCode
      });
      reset();
      navigate('/result', { state: { status: 'success', booking } });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong while completing your booking.';
      setError(message);
      navigate('/result', { state: { status: 'error', error: message } });
    } finally {
      setSubmitting(false);
    }
  }

  if (!experience || !slot) {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20">
      <div className="py-8">
        <Link to={`/experiences/${experience.id}`} className="text-sm font-semibold text-teal-600">
          ← Back to details
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr]">
        <section className="space-y-6">
          <header className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">Secure checkout</p>
            <h1 className="text-3xl font-semibold text-slate-900">Guest details</h1>
            <p className="text-sm text-slate-500">We\'ll use this information to confirm your booking.</p>
          </header>

          <div className="space-y-5 rounded-4xl bg-white p-8 shadow-lg">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Full name
                <input
                  type="text"
                  value={formValues.customerName}
                  onChange={(event) => updateFormValues({ customerName: event.target.value })}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                  placeholder="Alex Johnson"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Email
                <input
                  type="email"
                  value={formValues.email}
                  onChange={(event) => updateFormValues({ email: event.target.value })}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                  placeholder="alex@email.com"
                />
              </label>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Phone number
                <input
                  type="tel"
                  value={formValues.phone}
                  onChange={(event) => updateFormValues({ phone: event.target.value })}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                  placeholder="+1 555 555 1234"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Guests
                <input
                  type="number"
                  min={1}
                  max={slot.capacity}
                  value={formValues.guests}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    updateGuests(Number.isFinite(value) && value > 0 ? value : 1);
                  }}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                />
              </label>
            </div>
            <PromoInput subtotal={subtotal} onValidated={handlePromo} />
            {error && <p className="text-sm text-rose-600">{error}</p>}
          </div>
        </section>

        <aside className="space-y-6 rounded-4xl bg-white p-8 shadow-lg">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">Booking summary</p>
            <h2 className="text-2xl font-semibold text-slate-900">{experience.title}</h2>
            <p className="text-sm text-slate-500">
              {slot.date} · {slot.time} · {experience.location}
            </p>
          </div>
          <div className="space-y-4 rounded-3xl bg-sand-100 p-6">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>{formValues.guests} guests</span>
              <span>{currency.format(subtotal / 100)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Discount</span>
              <span className="text-teal-700">- {currency.format(discount / 100)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-base font-semibold text-slate-900">
              <span>Total due</span>
              <span>{currency.format(total / 100)}</span>
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:bg-slate-400"
            disabled={submitting}
          >
            {submitting ? 'Processing…' : 'Confirm booking'}
          </button>
          <p className="text-xs text-slate-500">
            By confirming, you agree to our terms and authorize BookIt to charge the payment method on file.
          </p>
        </aside>
      </form>
    </div>
  );
}
