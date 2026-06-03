export const timeFormatter = (timing?: number): number[] => {
  const timeLeft = (timing || 0) < 10 ? `0${timing}` : timing;
  return Array.from(String(timeLeft), Number);
};

export const isValidNumber = (num?: number): boolean => num !== undefined;
