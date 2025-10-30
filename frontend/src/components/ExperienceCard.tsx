import { Link } from 'react-router-dom';
import { ExperienceListItem } from '../types';

interface Props {
  experience: ExperienceListItem;
}

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export default function ExperienceCard({ experience }: Props) {
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-56 w-full overflow-hidden">
        <img src={experience.heroImage} alt={experience.title} className="h-full w-full object-cover" loading="lazy" />
        {experience.isSoldOut && (
          <span className="absolute left-4 top-4 rounded-full bg-rose-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Sold out
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{experience.title}</h3>
            <p className="text-sm text-slate-500">{experience.location}</p>
          </div>
          <div className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">{experience.duration}</div>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">{experience.summary}</p>
        <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-500">
          {experience.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-sand-100 px-3 py-1">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="text-sm text-slate-500">
            Starting at{' '}
            <span className="text-base font-semibold text-slate-900">{currency.format(experience.startingFrom / 100)}</span>
            {experience.nextAvailableDate && <span className="block text-xs">Next: {experience.nextAvailableDate}</span>}
          </div>
          <Link
            to={`/experiences/${experience.id}`}
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
