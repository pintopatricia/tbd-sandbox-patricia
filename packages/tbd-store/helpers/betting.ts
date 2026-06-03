import { UserDetails } from "../state/entities";
import { ApplicationState } from "../state/ApplicationState.types";

import { getUserDetails } from "../state/entities/user-details/user-details-selectors";
import { getBetslipCard } from "../state/betslip/betslip-card-selectors";

export const getUniqueId = (state: ApplicationState): string => {
  const { accountId, loggedIn } = <UserDetails>getUserDetails(state);
  const timestamp = Date.now();

  if (!loggedIn) {
    // Observed a duplicate at only about 280.000 strings, due to the birthday paradox. (sqrt(36^7) = 279936)
    const rand = Math.random().toString(36).slice(2, 9);
    return `i${rand}${timestamp}`;
  }

  return `i${accountId}${timestamp}`;
};

/**
 * Returns the unique id of when a runner bet button was clicked, from
 * the taggingMetadata object
 */
export const getRunnerUniqueTaggingId = (state: ApplicationState, runnerUrn: string): string | undefined => {
  const card = getBetslipCard(state);

  return card?.taggingMetadata?.selections?.[runnerUrn]?.uniqueId;
};

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

/**
 * Creates a function that generates customerRefs throttled by a 1 second interval
 */
export function createCustomerRefBuilder() {
  const delta = 1000;
  let currentTime: number = 0;

  return () => {
    const now = Date.now();

    if (now - currentTime >= delta) {
      currentTime = now;
    }

    return currentTime.toString().padStart(20, "0");
  };
}
