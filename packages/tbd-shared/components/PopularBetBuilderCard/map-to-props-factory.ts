import { MapStateToPropsFactory } from "react-redux";
import { createSelector } from "reselect";

import {
  ApplicationState,
  BettingOpportunityType,
  OfflineUserDetails,
  PUSH,
  PushAction,
  RacingSport,
  UserDetails,
} from "@ppb/tbd-store";
import {
  BetslipBetBuilderNavigateToEventAction,
  PopularBetBuilderNavigateToBetBuilderAction,
  UI__NAVIGATE_TO_BET_BUILDER_EVENT_FROM_PP_BET_BUILDER,
  UI__NAVIGATE_TO_EVENT_FROM_BETSLIP_PP_BET_BUILDER,
} from "@ppb/tbd-store/actions/navigation";
import { createGetExperimentSelector } from "@ppb/tbd-store/state/entities/experiments/experiments-selectors";
import {
  AvBOportunitySelection,
  PopularBettingOpportunityHydrated,
  RacingOportunitySelection,
  createPopularBettingOpportunityHydratedSelector,
} from "@ppb/tbd-store/state/entities/popular-betting-opportunities/popular-betting-opportunities-selectors";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import {
  PopularBetBuilderCards,
  PopularMultiplesBetBuilderCards,
  PriceBoostMultisCards,
} from "@ppb/tbd-store/state/layout/cards/Card.types";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ViewLink } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { codecs } from "@ppb/tbd-urn-codecs";
import { type Icons, IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { i18n } from "../../helpers/i18n";
import { formatStartTimeWithAt, formatTime } from "../../helpers/dates";
import { getSelectionTypeIcon, SelectionTypeIconVariant } from "../../helpers/selection-type";
import { BubbleItemCommonProps } from "./snowflakes/BubbleItem/BubbleItem.types";

export type ContainerProps = {
  urn: URN;
  visible?: boolean;
};

type Selection = {
  marketUrn: URN;
  runnerUrn: URN;
};

type OportunityItem = BubbleItemCommonProps & {
  marketId?: string;
  runnerUrn?: string;
  selectionTypeIcon?: Icons;
};

export type CardProps = {
  timesBackedLabel?: string;
  fixture?: URN;
  sportevent?: URN;
  bettingOpportunityUrn: URN;
  bettingOpportunityType: BettingOpportunityType | null;
  showWasPrice: boolean;
  items: OportunityItem[];
  selections: Selection[];
  cardUrn: URN;
  viewLink?: ViewLink;
  tabViewLink?: ViewLink;
  isRacing: boolean;
  marketTitle?: string;
  cardTitle?: string;
  buildYourOwn?: boolean;
  buildYourOwnBtnLabel: string;
};

export type StateProps = CardProps | Record<string, never>;

const isRacingOpportunity = (urn: string): boolean => {
  const sportURN = codecs.parse(urn);
  const sportId = sportURN && codecs.bettingOpportunity.popular.extract(sportURN).sportId;

  return !!sportId && !!RacingSport[sportId];
};

function isRaceItem(item: RacingOportunitySelection | AvBOportunitySelection): item is RacingOportunitySelection {
  return "race" in item;
}

export const createBettingOpportunityItemsViewModel = () =>
  createSelector(
    [
      ({
        popularBettingOpportunityHydrated,
      }: {
        popularBettingOpportunityHydrated: PopularBettingOpportunityHydrated;
      }) => popularBettingOpportunityHydrated.items,
      ({ fromSameEvent }: { fromSameEvent: boolean }) => fromSameEvent,
      ({ fromCmsConfig }: { fromCmsConfig: boolean }) => fromCmsConfig,
      ({ userDetails }: { userDetails: UserDetails | OfflineUserDetails }) => userDetails,
      ({ isSelectionTypeIconThrottleActive }: { isSelectionTypeIconThrottleActive: boolean }) =>
        isSelectionTypeIconThrottleActive,
    ],
    (items, fromSameEvent, fromCmsConfig, { localeCodeBcp47, timezone }, isSelectionTypeIconThrottleActive) => {
      let marketTitle: string | undefined = items[0]?.market.name;

      const itemsVm: OportunityItem[] = items.map((item) => {
        if (fromCmsConfig || (!!marketTitle && marketTitle !== item.market.name)) {
          marketTitle = undefined;
        }

        if (isRaceItem(item)) {
          const { venue } = item.meeting;
          const { startTime, name: raceName } = item.race;

          return {
            titleIcon: item.silkUrl,
            title: { bold: item.runner.name },
            description: [
              ...(fromCmsConfig ? [item.market.marketTypeName || item.market.name] : []),
              `${formatTime(startTime, localeCodeBcp47, timezone)} ${venue}`,
              raceName,
            ].join(" • "),
            subDescription:
              item.jockeyName && item.trainerName ? `J: ${item.jockeyName} • T: ${item.trainerName}` : undefined,
            marketId: item.market.marketId,
            runnerUrn: item.runner.urn,
          };
        }

        if (fromSameEvent) {
          let selectionTypeIcon;

          if (isSelectionTypeIconThrottleActive) {
            const is90Min = item.market.marketType === "MATCH_ODDS_90";

            selectionTypeIcon = is90Min
              ? IconsList.NINETY_MINUTE_PAYOUT
              : getSelectionTypeIcon(item.market.marketType, item.market.isSuperSub, SelectionTypeIconVariant.COLORED);
          }

          return {
            title: {
              bold: item.runner.name,
              regular: item.market.name,
            },
            selectionTypeIcon,
          };
        }

        let dateTime;
        if (item.sportEvent.openDate) {
          dateTime = formatStartTimeWithAt(item.sportEvent.openDate, localeCodeBcp47, timezone);
        }

        return {
          title: {
            bold: item.runner.name,
          },
          description: [...(fromCmsConfig ? [item.market.name] : []), item.sportEvent.name, ...[dateTime || []]].join(
            " - ",
          ),
          marketId: item.market.marketId,
          runnerUrn: item.runner.urn,
        };
      });

      return {
        items: itemsVm,
        marketTitle,
      };
    },
  );

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getPopularBetBuilderCardByURN = createCardByURNSelector<PopularBetBuilderCards, URN>();
  const getPopularMultiplesBetBuilderCardByURN = createCardByURNSelector<PopularMultiplesBetBuilderCards, URN>();
  const getPriceBoostMultipleCardByURN = createCardByURNSelector<PriceBoostMultisCards, URN>();
  const getPopularBettingOpportunityHydrated = createPopularBettingOpportunityHydratedSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getBettingOpportunityItemsViewModel = createBettingOpportunityItemsViewModel();
  const getExperiment = createGetExperimentSelector();
  const getThrottle = createGetThrottleSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const popularBetBuilderCard = getPopularBetBuilderCardByURN(state.layouts.cards.popularbetbuilders, urn);
    const popularMultiplesBetBuilderCard = getPopularMultiplesBetBuilderCardByURN(
      state.layouts.cards.popularmultiplesbetbuilders,
      urn,
    );
    const priceBoostMultipleCard = getPriceBoostMultipleCardByURN(state.layouts.cards.priceboostmulticards, urn);

    const card = popularBetBuilderCard || popularMultiplesBetBuilderCard || priceBoostMultipleCard;
    if (!card) {
      return {};
    }

    const popularBettingOpportunityHydrated = getPopularBettingOpportunityHydrated(
      state,
      card.popularbettingopportunity,
    );
    if (!popularBettingOpportunityHydrated) {
      return {};
    }
    const userDetails = getUserDetailsSelector(state);

    const fromSameEvent = "fixture" in card;

    const isSelectionTypeIconThrottleActive = !!getThrottle(
      state.entities.throttles,
      "POPULAR_BET_BUILDER_SELECTION_TYPE_ICON",
    )?.isActive;

    const formatedItems = getBettingOpportunityItemsViewModel({
      popularBettingOpportunityHydrated,
      userDetails,
      fromSameEvent,
      fromCmsConfig: "fromCmsConfig" in card && card.fromCmsConfig,
      isSelectionTypeIconThrottleActive,
    });

    const buildYourOwnExp =
      getExperiment(state.entities.experiments, "exp-pop-bet-builder-create-own")?.variant ===
      "exp-pop-bet-builder-create-own-button-on";

    return {
      bettingOpportunityType: popularBettingOpportunityHydrated.type,
      showWasPrice: "showWasPrice" in card ? card.showWasPrice : false,
      fixture: "fixture" in card ? card.fixture : undefined,
      timesBackedLabel:
        popularBettingOpportunityHydrated.count > 0
          ? i18n({
              key: "I18N.POPULAR.TIMES_BACKED",
              interpolationValues: { count: popularBettingOpportunityHydrated.count },
            })
          : undefined,
      isRacing: isRacingOpportunity(urn),
      bettingOpportunityUrn: popularBettingOpportunityHydrated.urn,
      selections: popularBettingOpportunityHydrated.selections,
      items: formatedItems.items,
      cardUrn: urn,
      viewLink: "viewLink" in card ? card.viewLink : undefined,
      tabViewLink: "tabViewLink" in card ? card.tabViewLink : undefined,
      sportevent: "sportevent" in card ? card.sportevent : undefined,
      marketTitle: formatedItems.marketTitle,
      cardTitle: "title" in card ? card.title : undefined,
      buildYourOwn: buildYourOwnExp,
      buildYourOwnBtnLabel: i18n({ key: "I18N.POPULAR.BUILD_YOUR_OWN" }),
    };
  };
};

const dispatchNavigateToEvent = (urn: URN, url: string, runnerUrn: URN): BetslipBetBuilderNavigateToEventAction => ({
  type: UI__NAVIGATE_TO_EVENT_FROM_BETSLIP_PP_BET_BUILDER,
  payload: { urn, url, runnerUrn },
});

const dispatchNavigateToEventBetBuilderTab = (
  urn: URN,
  url: string,
  runnerUrn: URN,
): PopularBetBuilderNavigateToBetBuilderAction => ({
  type: UI__NAVIGATE_TO_BET_BUILDER_EVENT_FROM_PP_BET_BUILDER,
  payload: { urn, url, runnerUrn },
});

const dispatchPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

export type DispatchProps = {
  dispatchNavigateToEvent: typeof dispatchNavigateToEvent;
  dispatchPushAction: typeof dispatchPushAction;
  dispatchNavigateToEventBetBuilderTab: typeof dispatchNavigateToEventBetBuilderTab;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchNavigateToEvent,
  dispatchPushAction,
  dispatchNavigateToEventBetBuilderTab,
};
