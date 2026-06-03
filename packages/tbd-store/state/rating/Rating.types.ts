export type RatingState = {
  lastRatingDate?: Date;
  ratingCount?: number;
  rateMyAppTriggered?: boolean;
  numberOfBets?: number;
  session?: RateMyAppSessionState;
};

export type RateMyAppSessionState = {
  numberOfSessions?: number;
  lastSessionDate?: Date;
};
