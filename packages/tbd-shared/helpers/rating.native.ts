import { getDaysBetweenDates, isToday } from "@ppb/tbd-store/helpers/dates";
import { RatingModule, CheckRatingRequirements, HandleSession } from "@ppb/tbd-store/modules/RatingModule.types";

const FIRST_TIME_RATING = {
  numberOfSessions: 3,
  numberOfBets: 5,
};

const SECOND_TIME_RATING = {
  numberOfSessions: 6,
  numberOfBets: 10,
};

const BET_TIMESPAN = 180;
const MAX_NUMBER_OF_RATINGS = 2;

/**
 * Checks if it has the required minimum sessions.
 * Currently is 6 except on the first rating (3).
 */
const checkRequiredSessions = (numberOfSessions: number, hasRated: boolean): boolean =>
  hasRated
    ? numberOfSessions >= SECOND_TIME_RATING.numberOfSessions
    : numberOfSessions >= FIRST_TIME_RATING.numberOfSessions;

/**
 * Checks if it has the required minimum number of bets.
 * Currently is 10 except on the first rating (5).
 */
const checkRequiredBets = (numberOfBets: number, hasRated: boolean): boolean =>
  hasRated ? numberOfBets >= SECOND_TIME_RATING.numberOfBets : numberOfBets >= FIRST_TIME_RATING.numberOfBets;

/**
 * Checks if it has the required minimum timespan between now and the last rate.
 * Currently is 180 days except on the first rating (0).
 */
const checkRequiredTimespan = (lastRatingDate: Date | undefined): boolean =>
  lastRatingDate ? getDaysBetweenDates(new Date(Date.now()), lastRatingDate) >= BET_TIMESPAN : true;

/**
 * Checks if all the requirements for rate my app are met.
 */
const checkRatingRequirements: CheckRatingRequirements = (state, triggerIsBet = false) => {
  const { rating } = state;
  const loggedIn = !!state.entities.userdetails?.loggedIn;

  // An user must be logged in to rate
  if (!loggedIn) {
    return false;
  }

  // Currently an user cannot rate more than two times
  if (rating.ratingCount && rating.ratingCount >= MAX_NUMBER_OF_RATINGS) {
    return false;
  }

  const { lastRatingDate } = rating;
  const hasRated = !!lastRatingDate;

  /* If the trigger is a bet we can count +1 in our evaluation because
  that bet has not yet been counted in the rating state. */
  const numberOfBets = triggerIsBet ? (rating.numberOfBets || 0) + 1 : rating.numberOfBets || 0;
  const numberOfSessions = rating.session?.numberOfSessions || 0;

  const hasRequiredSessions = checkRequiredSessions(numberOfSessions, hasRated);
  const hasRequiredBets = checkRequiredBets(numberOfBets, hasRated);
  const hasRequiredTimespan = checkRequiredTimespan(lastRatingDate);

  return hasRequiredSessions && hasRequiredBets && hasRequiredTimespan;
};

/**
 * Checks if the current session has been counted and if not adds it to the state.
 * Returns the session state, updated or not.
 */
const handleSession: HandleSession = (session) => {
  const currentDate = new Date(Date.now());
  const numberOfSessions = (session?.numberOfSessions || 0) + 1; // adding the current session

  if (!session?.lastSessionDate || !isToday(new Date(session.lastSessionDate))) {
    return {
      lastSessionDate: currentDate,
      numberOfSessions,
    };
  }

  return session;
};

const Rating: RatingModule = {
  checkRatingRequirements,
  handleSession,
};

export default Rating;
