export interface PromoResult {
  valid: boolean;
  code: string;
  discountAmount: number;
  message: string;
}

const PROMO_CODES: Record<string, { type: 'percent' | 'flat'; value: number; description: string }> = {
  SAVE10: { type: 'percent', value: 10, description: 'Save 10% on your booking' },
  FLAT100: { type: 'flat', value: 1000, description: 'Flat $10 off (1000 cents)' },
  SUMMER25: { type: 'percent', value: 25, description: 'Summer special 25% off' }
};

export function validatePromo(code: string, subtotal: number): PromoResult {
  const normalized = code.trim().toUpperCase();
  const config = PROMO_CODES[normalized];

  if (!config) {
    return {
      valid: false,
      code: normalized,
      discountAmount: 0,
      message: 'Promo code is not valid.'
    };
  }

  let discount = 0;
  if (config.type === 'percent') {
    discount = Math.round((config.value / 100) * subtotal);
  } else {
    discount = config.value;
  }

  if (discount > subtotal) {
    discount = subtotal;
  }

  return {
    valid: true,
    code: normalized,
    discountAmount: discount,
    message: config.description
  };
}
