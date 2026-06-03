import { BasketballPeriod, BasketballSegment } from "../../../clients/catalogue/catalogue-response-types";
import URN from "../../../state/layout/URN";

export type BasketballScore = {
  home: number;
  away: number;
};

export type BasketballClock = {
  period?: BasketballPeriod;
  segment?: BasketballSegment;
  timeElapsed?: number;
  timeRemaining?: number;
};

export type BasketballPeriodScore = {
  score?: BasketballScore;
  period?: BasketballPeriod;
  segment?: BasketballSegment;
};

export type BasketballFixture = {
  urn: URN;
  typename: "BasketballFixture";
  score?: BasketballScore;
  clock?: BasketballClock;
  periodScores?: BasketballPeriodScore[];
};

export type BasketballFixtures = {
  [urn: string]: BasketballFixture;
};
