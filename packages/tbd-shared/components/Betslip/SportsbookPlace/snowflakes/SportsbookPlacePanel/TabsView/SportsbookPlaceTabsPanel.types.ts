import { ReactNode } from "react";
import { SportsbookPlacePanelCallbacks, SportsbookPlacePanelProps } from "../SportsbookPlacePanel.types";

export type SportsbookPlaceTabsPanelViewModel = SportsbookPlacePanelProps & {
  experimentVariant: "with-all" | "without-all";
  hasSingles: boolean;
  hasOnlyOneSingle: boolean;
  hasOneLineMultiple: boolean;
  hasMultipleLinesMultiples: boolean;
  hasMultiBetBuilder: boolean;
  hasCastBets: boolean;
  hasPriceBoost: boolean;
  hasBetBuilders: boolean;
  betBuilderIds: string[];
  boostedCombinationIds: string[];
  failedCombinationGroups: number[];
  failedCombinationGroupIds: string[];
} & SportsbookPlacePanelCallbacks;

export type TabResolverFn<T> = (props: SportsbookPlaceTabsPanelViewModel) => T;

export type TabResolver = {
  key: string;
  title: TabResolverFn<string>;
  visible: TabResolverFn<boolean>;
  content: TabResolverFn<ReactNode>;
};

export type BetslipTab = "ALL" | "BET_BUILDER" | "MULTIPLES" | "CAST_BET" | "SINGLES";

export type TabsResolvers = Record<BetslipTab, TabResolver>;
