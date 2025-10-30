import { useEffect, useState } from 'react';
import { fetchExperiences } from '../lib/api';
import { ExperienceListItem } from '../types';

export function useExperiences() {
  const [experiences, setExperiences] = useState<ExperienceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await fetchExperiences();
        if (mounted) {
          setExperiences(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load experiences');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { experiences, loading, error };
}
