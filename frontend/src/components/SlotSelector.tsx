import clsx from 'clsx';
import { SlotAvailability } from '../types';

interface SlotSelectorProps {
  slots: SlotAvailability[];
  selectedSlotId?: string;
  onSelect: (slot: SlotAvailability) => void;
}

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function SlotSelector({ slots, selectedSlotId, onSelect }: SlotSelectorProps) {
  const grouped = slots.reduce<Record<string, SlotAvailability[]>>((acc, slot) => {
    acc[slot.date] = acc[slot.date] ? [...acc[slot.date], slot] : [slot];
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => (
        <div key={date} className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">{date}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {grouped[date]
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((slot) => {
                const isSelected = slot.id === selectedSlotId;
                const disabled = slot.isSoldOut;
                return (
                  <button
                    key={slot.id}
                    onClick={() => !disabled && onSelect(slot)}
                    className={clsx(
                      'flex items-center justify-between rounded-2xl border px-4 py-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
                      {
                        'border-slate-200 bg-white shadow-sm hover:border-teal-500 hover:shadow-md': !isSelected && !disabled,
                        'border-teal-600 bg-teal-50 shadow-lg': isSelected,
                        'border-slate-100 bg-slate-50 text-slate-400 hover:cursor-not-allowed': disabled
                      }
                    )}
                    disabled={disabled}
                    type="button"
                  >
                    <div>
                      <p className="text-base font-semibold text-slate-900">{slot.time}</p>
                      <p className="text-xs text-slate-500">{slot.remaining} spots left</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{currency.format(slot.price / 100)}</p>
                      <p className="text-xs text-slate-500">per guest</p>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
