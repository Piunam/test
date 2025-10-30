import { Link } from 'react-router-dom';
import ExperienceCard from '../components/ExperienceCard';
import { EmptyState, LoadingState } from '../components/LoadingState';
import { useExperiences } from '../hooks/useExperiences';

export default function HomePage() {
  const { experiences, loading, error } = useExperiences();

  if (loading) {
    return <LoadingState message="Loading curated escapes…" />;
  }

  if (error) {
    return (
      <EmptyState
        title="Unable to load experiences"
        description="Please refresh the page or try again later."
        action={
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Refresh
          </button>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      <header className="space-y-6 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-teal-700">BookIt</p>
        <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
          Experiences crafted for unforgettable stories
        </h1>
        <p className="mx-auto max-w-2xl text-base text-slate-600">
          Browse handpicked adventures across the globe. Select a date that works for you, secure your spot, and
          we\'ll handle the rest.
        </p>
        <div className="flex justify-center gap-4 text-sm text-slate-500">
          <span>Curated by local hosts</span>
          <span>•</span>
          <span>Flexible scheduling</span>
          <span>•</span>
          <span>Secure checkout</span>
        </div>
      </header>

      <section className="grid gap-8 md:grid-cols-2">
        {experiences.map((experience) => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))}
      </section>

      <footer className="mt-24 flex flex-col items-center gap-3 text-center text-sm text-slate-500">
        <p>
          Ready to host your own experience?{' '}
          <a href="mailto:hello@bookit.travel" className="font-semibold text-teal-600">
            Contact our team
          </a>
        </p>
        <p>© {new Date().getFullYear()} BookIt Travel Co. All rights reserved.</p>
      </footer>
    </div>
  );
}
