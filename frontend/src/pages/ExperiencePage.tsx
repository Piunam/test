import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SlotSelector } from '../components/SlotSelector';
import { EmptyState, LoadingState } from '../components/LoadingState';
import { fetchExperience } from '../lib/api';
import { useBooking } from '../context/BookingContext';
import { ExperienceDetail, SlotAvailability } from '../types';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export default function ExperiencePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setExperience, selectSlot, experience, slot } = useBooking();
  const [data, setData] = useState<ExperienceDetail | null>(experience && experience.id === id ? experience : null);
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SlotAvailability | undefined>(slot);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        const response = await fetchExperience(id);
        if (mounted) {
          setData(response);
          setExperience(response);
          if (!response.slots.find((item) => item.id === selectedSlot?.id)) {
            setSelectedSlot(undefined);
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Unable to load experience');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (!data) {
      load();
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (data) {
      document.title = `${data.title} · BookIt`;
    }
    return () => {
      document.title = 'BookIt: Experiences & Slots';
    };
  }, [data]);

  const availability = useMemo(() => data?.slots ?? [], [data]);

  if (loading) {
    return <LoadingState message="Curating details…" />;
  }

  if (error) {
    return (
      <EmptyState
        title="Experience unavailable"
        description="We couldn\'t load this experience right now."
        action={
          <Link to="/" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">
            Back to home
          </Link>
        }
      />
    );
  }

  if (!data) {
    return null;
  }

  function handleContinue() {
    if (!selectedSlot) return;
    selectSlot(selectedSlot);
    navigate('/checkout');
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20">
      <div className="py-8">
        <Link to="/" className="text-sm font-semibold text-teal-600">
          ← All experiences
        </Link>
      </div>

      <section className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-8">
          <div className="overflow-hidden rounded-4xl">
            <img src={data.heroImage} alt={data.title} className="h-80 w-full rounded-4xl object-cover" />
          </div>
          <header className="space-y-4">
            <h1 className="text-4xl font-semibold text-slate-900">{data.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="rounded-full bg-teal-100 px-3 py-1 font-medium text-teal-700">{data.location}</span>
              <span>Duration: {data.duration}</span>
              <span>Group size: {data.groupSize}</span>
            </div>
            <p className="text-base leading-relaxed text-slate-600">{data.summary}</p>
          </header>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">What\'s included</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {data.highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="mt-1 h-2 w-2 rounded-full bg-teal-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Experience details</h2>
            <p className="text-base leading-7 text-slate-600">{data.description}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {data.gallery.map((image) => (
                <img key={image} src={image} alt={data.title} className="h-40 w-full rounded-3xl object-cover" loading="lazy" />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6 rounded-4xl bg-white p-8 shadow-xl">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">Select a slot</p>
            <h2 className="text-2xl font-semibold text-slate-900">Choose your date</h2>
            <p className="text-sm text-slate-500">Pick a time that suits your travel plans. Each slot is limited.</p>
          </div>
          <SlotSelector
            slots={availability}
            selectedSlotId={selectedSlot?.id}
            onSelect={(slotOption) => setSelectedSlot(slotOption)}
          />
          <div className="space-y-4 rounded-3xl bg-sand-100 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Summary</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">From</span>
              <span className="text-xl font-semibold text-slate-900">
                {currency.format(selectedSlot ? selectedSlot.price / 100 : data.slots[0]?.price / 100)}
              </span>
            </div>
            <button
              type="button"
              disabled={!selectedSlot}
              onClick={handleContinue}
              className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:bg-slate-400"
            >
              Continue to checkout
            </button>
            {!selectedSlot && <p className="text-xs text-slate-500">Select a slot to continue.</p>}
          </div>
        </aside>
      </section>
    </div>
  );
}
