import { FormEvent, useState } from 'react';
import { validatePromo } from '../lib/api';

interface PromoInputProps {
  subtotal: number;
  onValidated: (discount: number, code: string | undefined) => void;
}

export default function PromoInput({ subtotal, onValidated }: PromoInputProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!code.trim()) {
      onValidated(0, undefined);
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const result = await validatePromo(code, subtotal);
      setMessage(result.message);
      if (result.valid) {
        onValidated(result.discount, result.code);
      } else {
        onValidated(0, undefined);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to validate promo code');
      onValidated(0, undefined);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label className="text-sm font-medium text-slate-700">
        Promo code
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="SAVE10"
            className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
          />
          <button
            type="submit"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            disabled={loading}
          >
            {loading ? 'Checking…' : 'Apply'}
          </button>
        </div>
      </label>
      {message && <p className="text-xs text-slate-500">{message}</p>}
    </form>
  );
}
