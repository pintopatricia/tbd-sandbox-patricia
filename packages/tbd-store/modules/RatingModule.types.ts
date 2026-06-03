import { ApplicationState } from "../state/ApplicationState.types";
import { RateMyAppSessionState } from "../state/rating/Rating.types";

export type CheckRatingRequirements = (state: ApplicationState, triggerIsBet?: boolean) => boolean;
export type HandleSession = (session: RateMyAppSessionState | undefined) => RateMyAppSessionState;

export type RatingModule = {
  checkRatingRequirements: CheckRatingRequirements;
  handleSession: HandleSession;
};
