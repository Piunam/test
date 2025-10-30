import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { BookingPayload, ExperienceDetail, SlotAvailability } from '../types';

type BookingStep = 'browsing' | 'checkout' | 'complete';

interface BookingState {
  experience?: ExperienceDetail;
  slot?: SlotAvailability;
  guests: number;
  step: BookingStep;
  formValues: Omit<BookingPayload, 'experienceId' | 'slotId'>;
}

const defaultState: BookingState = {
  guests: 1,
  step: 'browsing',
  formValues: {
    customerName: '',
    email: '',
    phone: '',
    guests: 1,
    promoCode: undefined
  }
};

interface BookingContextValue extends BookingState {
  setExperience: (experience: ExperienceDetail) => void;
  selectSlot: (slot: SlotAvailability) => void;
  updateGuests: (guests: number) => void;
  updateFormValues: (values: Partial<BookingState['formValues']>) => void;
  reset: () => void;
}

const BookingContext = createContext<BookingContextValue | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>(defaultState);

  const setExperience = useCallback((experience: ExperienceDetail) => {
    setState({
      ...defaultState,
      experience
    });
  }, []);

  const selectSlot = useCallback((slot: SlotAvailability) => {
    setState((prev) => ({
      ...prev,
      slot,
      step: 'checkout'
    }));
  }, []);

  const updateGuests = useCallback((guests: number) => {
    setState((prev) => ({
      ...prev,
      guests,
      formValues: { ...prev.formValues, guests }
    }));
  }, []);

  const updateFormValues = useCallback((values: Partial<BookingState['formValues']>) => {
    setState((prev) => ({
      ...prev,
      formValues: { ...prev.formValues, ...values }
    }));
  }, []);

  const reset = useCallback(() => {
    setState(defaultState);
  }, []);

  const value = useMemo<BookingContextValue>(
    () => ({
      ...state,
      setExperience,
      selectSlot,
      updateGuests,
      updateFormValues,
      reset
    }),
    [state, setExperience, selectSlot, updateGuests, updateFormValues, reset]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
