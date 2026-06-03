import type { JSX, ReactNode } from "react";
import type { ExchangeMarketStatus } from "@ppb/tbd-store";
import type { ExchangeRunnerStatus } from "@ppb/tbd-store/state/constants";
import type { ExchangeSide } from "@ppb/tbd-store/state/betting/exchange-bets/ExchangeBet.types";
import type { MarketPromoProps } from "@ppb/the-wall-common/types";
import type { PastPerformance } from "@ppb/the-wall-common/types/RecentRaces.types";
import type { ViewLinks } from "@ppb/the-wall-common/types/ViewLink.types";

export type ExchangeMarketI18N = {
  back: string;
  lay: string;
  matched: string;
  marketSuspended: string;
  marketClosed: string;
  marketDepth: string;
  nonRunnerTitle: string;
  nonRunnerReduction: string;
  marketRules: string;
  liability: string;
};

export type ExchangeMarketPrices = {
  side: ExchangeSide;
  marketDepth: number;
  price?: number;
  liquidity?: string;
  isSelected?: boolean;
  disabled?: boolean;
};

export type ExchangeMarketRunner = {
  urn: string;
  name: string;
  pnl?: string;
  rawPnl?: number;
  whatIf?: string;
  rawWhatIf?: number;
  reduction?: string;
  date?: string;
  status?: ExchangeRunnerStatus;
  form?: string;
  apprenticeClaim?: number;
  crsDisWinFavText?: string;
  weight?: string;
  rating?: number;
  comments?: string;
  equipment?: string;
  horseAge?: number;
  horseDamName?: string;
  horseSireName?: string;
  horseBred?: string;
  raceRunnerUrn?: string;
  horsePastPerformances?: PastPerformance[];
};

export type ExchangeHeaderButtonsViewModel = {
  isMarketDepthActive?: boolean;
  onMarketDepthButtonTap: () => void;
  hasMarketRules?: boolean;
  onMarketRulesButtonTap: () => void;
};

export type ExchangeMarketDepthProps = {
  bookPercentage?: {
    back: number;
    lay: number;
  };
  isMarketDepthActive?: boolean;
};

export type ExchangeRaceMarketRunner = {
  horseName: string;
  jockeyName: string;
  trainerName: string;
  saddleCloth: string;
  silk?: string;
  draw?: number;
} & ExchangeMarketRunner;

export type ExchangeMarketProps = {
  marketURN: string;
  liquidity: string | undefined;
  status: ExchangeMarketStatus;
  runners: ExchangeMarketRunner[];
  isRaceMarket: boolean;
  i18nLabels: ExchangeMarketI18N;
  runnerViewLinks?: ViewLinks;
  marketRulesButton?: ReactNode;
  hasMarketRules?: boolean;
  hasMarketGraph?: boolean;
  marketPromo?: MarketPromoProps;
  turnInPlayEnabled?: boolean;
  inplay?: boolean;
  onMarketPromoClick?: (isOpen: boolean) => void;
} & ExchangeMarketDepthProps;

type ExcOnBetClickArgs = {
  marketURN: string;
  urn: string;
  side: ExchangeSide;
  isSelected: boolean;
  marketDepth: number;
  price?: number;
};

export type ExchangeMarketOnBetClick = (bet: ExcOnBetClickArgs) => void;
export type ExchangeMarketOnRunnerClick = (runnerURN: string) => void;

export type ExchangeMarketViewModel = {
  renderBetslip?: (urn: string) => JSX.Element | null;
  onMarketDepthButtonTap: () => void;
  onMarketRulesButtonTap: () => void;
  onMarketGraphButtonTap: () => void;
  children: React.ReactNode;
} & ExchangeMarketProps;
