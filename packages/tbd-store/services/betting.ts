/**
 * Remove useless betId prefix to reduce business logic complexity
 *
 * @returns Returns the betId without the prefix
 */
export const sanitizeBetId = (betId: string): string => betId.replace(/^(\d+:)/, "");

/**
 * Prepend "1:" to a betId before updating/cancelling a bet
 *
 * @returns Returns the betId with the "1:" prefix
 */
export const prefixLBRBetId = (betId: string): string => `1:${betId}`;
