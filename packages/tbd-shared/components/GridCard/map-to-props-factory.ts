import { createSelector, OutputParametricSelector } from "reselect";
import { MapStateToPropsFactory } from "react-redux";

import { ApplicationState, createGetThrottleSelector, Entities } from "@ppb/tbd-store";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createGetGridCardSportsbookMarketsSelector } from "@ppb/tbd-store/state/layout/cards/grid/grid-cards-selectors";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { GridCard, GridCardLayout, GridCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import {
  AzSwitchClickAction,
  ToggleShowMoreRunnersAction,
  UI__AZ_SWITCH_CLICK,
  UI__TOGGLE_SHOW_MORE_RUNNERS,
} from "@ppb/tbd-store/actions/interface";
import {
  StartRefreshCardAction,
  START_REFRESH_CARD,
  StopRefreshCardAction,
  STOP_REFRESH_CARD,
} from "@ppb/tbd-store/actions/refresh";

import { MarketBlurb, MARKET_BLURB_SUPER_SUB } from "../../config/market-blurb";
import {
  extractFootballPlayerRunnerContext,
  getPlayerStatValue,
  getRunnerJersey,
  STAT_LABEL_I18N_KEY,
} from "../FootballRunner/helpers/FootballRunnerHelpers";
import {
  createFootballFixtureByURNSelector,
  createFootballPlayerFixtureContextByURNSelector,
} from "@ppb/tbd-store/state/entities/entities-selectors";

export type ContainerProps = {
  urn: URN;
  visible?: boolean;
};

export type GridCardItem = {
  label?: string;
  marketUrn: URN;
  selectionId?: number;
};

export type GridCardLine = {
  label: string;
  items: GridCardItem[];
  jersey?: string;
  useFallbackJersey?: boolean;
  statValue?: string;
  statValueInterpolation?: Record<string, string | number>;
  statLabel?: string;
};

export type CardProps = {
  marketUrn?: URN;
  layout: GridCardLayout;
  numberOfItemsToDisplay: number;
  lines: GridCardLine[];
  marketBlurb?: MarketBlurb;
  infoBlurb?: string;
};

export type StateProps = CardProps | Record<string, never>;

export const createViewModel = (): OutputParametricSelector<
  ApplicationState,
  URN,
  CardProps | undefined,
  (
    card: GridCard,
    entities: Pick<Entities, "sportsbookmarkets" | "footballfixtures" | "footballplayerfixturecontexts" | "throttles">,
    throttles: {
      isSuperSubBlurbThrottleActive: boolean;
    },
  ) => CardProps | undefined
> => {
  const getGridCardByURN = createCardByURNSelector<GridCards, URN>();
  const getGridCardSportsbookMarkets = createGetGridCardSportsbookMarketsSelector();
  const getThrottle = createGetThrottleSelector();
  const getFootballFixtureByURN = createFootballFixtureByURNSelector();
  const getFootballPlayerFixtureContextByURN = createFootballPlayerFixtureContextByURNSelector();

  return createSelector(
    [
      (state: ApplicationState, urn: URN): GridCard | null => getGridCardByURN(state.layouts.cards.grids, urn),
      ({ entities }: ApplicationState) => ({
        sportsbookmarkets: entities.sportsbookmarkets,
        footballfixtures: entities.footballfixtures,
        footballplayerfixturecontexts: entities.footballplayerfixturecontexts,
        throttles: entities.throttles,
      }),
      ({
        entities,
      }: ApplicationState): {
        isSuperSubBlurbThrottleActive: boolean;
      } => ({
        isSuperSubBlurbThrottleActive: !!getThrottle(entities.throttles, "SUPER_SUB_MARKET_BLURBS")?.isActive,
      }),
    ],
    (card, entitiesData, { isSuperSubBlurbThrottleActive }) => {
      if (!card) {
        return undefined;
      }
      const {
        sportsbookmarkets: sportsbookMarkets,
        footballfixtures: footballFixtures,
        footballplayerfixturecontexts: footballPlayerFixtures,
      } = entitiesData;
      let lines = [];

      try {
        if (card.layout === "HORIZONTAL_MARKETS") {
          lines = card.markets.map((market) => {
            const titles = [...new Set(card.runners.map((item) => item.name))];
            if (!market.displayLabel) {
              throw new Error("Missing required horizontal market displayLabel.");
            }

            return {
              label: market.displayLabel,
              items: titles.map((title) => {
                // Find a runner that has the same title and it is from same market
                const selectionId = card.runners.find((item) => market.urn === item.marketURN && item.name === title)
                  ?.selectionId;

                return {
                  label: title,
                  marketUrn: market.urn,
                  selectionId,
                };
              }),
            };
          });
        } else {
          const { jerseys, playerHomeAwayMap, playerStats } = extractFootballPlayerRunnerContext(
            getThrottle,
            getFootballFixtureByURN,
            getFootballPlayerFixtureContextByURN,
            entitiesData.throttles,
            card,
            footballFixtures,
            footballPlayerFixtures,
          );
          const statLabel = playerStats && card.stat ? STAT_LABEL_I18N_KEY[card.stat] : undefined;
          lines = card.runners.map((runner) => {
            const { jerseyUrl, useFallbackJersey } = getRunnerJersey(jerseys, playerHomeAwayMap, runner.participantId);

            let playerStatValue: string | undefined;
            let playerStatValueInterpolation: Record<string, string | number> | undefined;

            if (playerStats && runner.participantId) {
              const statResult = getPlayerStatValue(playerStats[runner.participantId], card.stat);
              playerStatValue = statResult?.value;
              playerStatValueInterpolation = statResult?.interpolation;
            }

            return {
              label: runner.name,
              jersey: jerseyUrl,
              useFallbackJersey,
              statValue: playerStatValue,
              statValueInterpolation: playerStatValueInterpolation,
              statLabel,
              items: card.markets.map((market) => ({
                label: market.displayLabel,
                marketUrn: market.urn,
                selectionId: runner.selectionId,
              })),
            };
          });
        }
      } catch {
        return undefined;
      }

      if (!card.markets.length) {
        return undefined;
      }

      const cardMarkets = getGridCardSportsbookMarkets(card, sportsbookMarkets);
      const hasSuperSubBlurb =
        isSuperSubBlurbThrottleActive && !!cardMarkets?.some(({ isSuperSub }): boolean => isSuperSub);

      return {
        marketUrn: card.markets[0]?.urn,
        marketBlurb: hasSuperSubBlurb ? MARKET_BLURB_SUPER_SUB : undefined,
        infoBlurb: card.infoBlurbs?.[0]?.title,
        layout: card.layout,
        numberOfItemsToDisplay: card.numberOfItemsToDisplay || lines.length,
        lines,
      };
    },
  );
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getViewModel = createViewModel();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const viewModel = getViewModel(state, urn);

    if (!viewModel) {
      return {};
    }

    return viewModel;
  };
};

const dispatchToggleShowMoreRunners = (
  cardUrn: URN,
  showMore: boolean,
  gaModuleSuffix?: string,
): ToggleShowMoreRunnersAction => ({
  type: UI__TOGGLE_SHOW_MORE_RUNNERS,
  payload: {
    cardUrn,
    showMore,
    gaModuleSuffix,
  },
});

const dispatchRefreshCard = (urn: URN, isIntersecting: boolean): StartRefreshCardAction | StopRefreshCardAction => ({
  type: isIntersecting ? START_REFRESH_CARD : STOP_REFRESH_CARD,
  payload: urn,
});

const dispatchAzSwitchClick = (label: string, isToggleOn: boolean): AzSwitchClickAction => ({
  type: UI__AZ_SWITCH_CLICK,
  payload: {
    label,
    isToggleOn,
  },
});

export type DispatchProps = {
  dispatchToggleShowMoreRunners: typeof dispatchToggleShowMoreRunners;
  dispatchRefreshCard: typeof dispatchRefreshCard;
  dispatchAzSwitchClick: typeof dispatchAzSwitchClick;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchToggleShowMoreRunners,
  dispatchRefreshCard,
  dispatchAzSwitchClick,
};
