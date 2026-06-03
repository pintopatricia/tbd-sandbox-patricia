import { SportsbookOdds } from "@ppb/the-wall-common/types/Indicators/Odds.types";

type SbkOnBetClickArgs = {
  urn: string;
  odds?: SportsbookOdds;
};

export type HighlightedSelectionCardOnBetClickCb = (bet: SbkOnBetClickArgs) => void;

export type HighlightedSelectionCardProps = {
  children: React.ReactNode;
  text: string;
  isMarketClosed: boolean;
};
