export const PRICE_LADDER_CONFIG = {
  MIN_PRICE: 1.01,
  MAX_PRICE: 1000,
  STEPS: [
    { minimum: 1.01, increment: 0.01 },
    { minimum: 2, increment: 0.02 },
    { minimum: 3, increment: 0.05 },
    { minimum: 4, increment: 0.1 },
    { minimum: 6, increment: 0.2 },
    { minimum: 10, increment: 0.5 },
    { minimum: 20, increment: 1 },
    { minimum: 30, increment: 2 },
    { minimum: 50, increment: 5 },
    { minimum: 100, increment: 10 },
  ],
};

export const SIZE_LADDER_CONFIG = {
  MAX_SIZE: 999999999,
  INTERVAL: 0.01,
};

export const SIZE_NUDGE_STEP = 1;

export const LADDER_DEFAULT_MIN_SIZE = 1;
export const DISCOUNT = 0;
