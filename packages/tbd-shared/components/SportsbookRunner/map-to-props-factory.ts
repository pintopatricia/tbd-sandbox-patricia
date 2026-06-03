import { MapStateToPropsFactory } from "react-redux";
import { createSelectorCreator, defaultMemoize, ParametricSelector } from "reselect";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  FallbackIconType,
  HorseRacingRunnerI18NLabels,
  SportsbookMarketStatus,
  URN,
  ViewLink,
} from "@ppb/the-wall-common/types";
import {
  createEntityByURNSelector,
  createSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURNSelector,
  SBKRunnerWithRichContentAndStatus,
} from "@ppb/tbd-store/state/entities/entities-selectors";
import { isRaceHierarchy } from "@ppb/tbd-store/helpers/markets";
import { FETCH_CATALOGUE, FetchCatalogueAction, DELETE_VIEW, DeleteViewAction } from "@ppb/tbd-store/actions/catalogue";
import {
  RaceReplaysToggleAction,
  ToggleRecentRaceAction,
  ToggleRunnerInfo,
  UI__RACE_REPLAYS_TOGGLE,
  UI__RECENT_RACE_TOGGLE,
  UI__TOGGLE_RUNNER_INFO,
} from "@ppb/tbd-store/actions/interface";

import { areObjectsDeepEqual } from "@ppb/tbd-store/helpers/obj-deep-equal-comparator";

import { PastPerformance } from "@ppb/the-wall-common/types/RecentRaces.types";
import { EXPAND_RACE_RUNNER, ExpandRaceRunnerAction } from "@ppb/tbd-store/actions/racerunner";
import { RaceRunner, GreyhoundRaceRunner, createGetThrottleSelector } from "@ppb/tbd-store";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { NavigateToView, UI__NAVIGATE_TO_VIEW } from "@ppb/tbd-store/actions/navigation";
import { RacingSport, Sports } from "@ppb/tbd-store/state/entities/sports/Sport.types";
import { SportsbookMarkets } from "@ppb/tbd-store/state/entities/sportsbook-markets/SportsbookMarket.types";
import { RaceReplaysMediaPlayerLoadedAction, UI__RACE_REPLAYS_MEDIA_PLAYER_LOADED } from "@ppb/tbd-store/actions/media";
import { i18n } from "../../helpers/i18n";
import { formatRunnerName, formatHorseInfo } from "../../formatters/runner-formatters";
import { createHorsePastPerformancesViewModel } from "../../view-model-factories/horse-past-performances";
import { getSilkFallbackType } from "../../helpers/race";
import { horseRacingRunneri18nLabels } from "./horseRacingRunneri18nLabels";

export type ContainerProps = {
  cardUrn: URN;
  runnerURN: URN;
  marketUrn: URN;
  runnerViewLink: ViewLink | undefined;
  runnerViewTitle?: string;
  isRunnerExpandable?: boolean;
  eventViewLink?: ViewLink;
  runnerIdx?: number;
  numberOfRunners?: number;
  jerseyUrl?: string;
  useFallbackJersey?: boolean;
  statValue?: string;
  statValueInterpolation?: Record<string, string | number>;
  statLabel?: string;
  hasJerseys: boolean;
  hasStats: boolean;
};

export type CardProps = {
  runner: SportsbookRunnerVM;
  hasDefaultSilk: boolean;
  isRaceMarket: boolean;
  marketName: string;
  marketStatus: SportsbookMarketStatus;
  isMarketInplay: boolean | undefined;
  runnerViewLink: ViewLink | undefined;
  nonRunnerTitle: string;
  horsePastPerformances: PastPerformance[];
  horseRacingRunneri18nLabels: HorseRacingRunnerI18NLabels;
  isOddsboostMarketType: boolean;
  showTrapIcon: boolean;
};

type RaceRunnerType = "GREYHOUND" | "HORSE";
type GreyhoundRunner = Pick<GreyhoundRaceRunner, "trap" | "urn"> & { meetingCountry?: string };

type HorseRunnerDetails = {
  type: "HORSE";
  raceRunner?: RaceRunner;
};

type GreyhoundRunnerDetails = {
  type: "GREYHOUND";
  raceRunner?: GreyhoundRunner;
};

type SportsbookRunnerVM = SBKRunnerWithRichContentAndStatus & {
  raceRunnerDetails?: HorseRunnerDetails | GreyhoundRunnerDetails;
} & {
  jersey?: string;
  useFallbackJersey?: boolean;
  statValue?: string;
  statValueInterpolation?: Record<string, string | number>;
  statLabel?: string;
};

export type StateProps = CardProps | Record<string, never>;

type RunnerVMInput = SBKRunnerWithRichContentAndStatus & {
  sportId?: number;
  jersey?: string;
  useFallbackJersey?: boolean;
  statValue?: string;
  statValueInterpolation?: Record<string, string | number>;
  statLabel?: string;
};

function createSportsbookRunnerVM(): ParametricSelector<RunnerVMInput, void, SportsbookRunnerVM> {
  return createSelectorCreator(defaultMemoize, areObjectsDeepEqual)(
    [(runnerWithRichContent: RunnerVMInput) => runnerWithRichContent],
    (runnerWithRichContent) => {
      let raceRunnerType: RaceRunnerType | undefined;
      if (runnerWithRichContent.sportId === RacingSport.GREYHOUND_RACING) {
        raceRunnerType = "GREYHOUND";
      } else if (runnerWithRichContent.sportId === RacingSport.HORSE_RACING) {
        raceRunnerType = "HORSE";
      }

      const baseRunner = {
        urn: runnerWithRichContent.urn,
        selectionId: runnerWithRichContent.selectionId,
        jersey: runnerWithRichContent.jersey,
        useFallbackJersey: runnerWithRichContent.useFallbackJersey,
        statValue: runnerWithRichContent.statValue,
        statValueInterpolation: runnerWithRichContent.statValueInterpolation,
        statLabel: runnerWithRichContent.statLabel,
        handicap: runnerWithRichContent.handicap,
        handicapLabel: runnerWithRichContent.handicapLabel,
        resultType: runnerWithRichContent.resultType,
        status: runnerWithRichContent.status,
        name: formatRunnerName(runnerWithRichContent.name, runnerWithRichContent.handicap),
      };

      if (!raceRunnerType) {
        return baseRunner;
      }

      return {
        ...baseRunner,
        ...(raceRunnerType === "HORSE" && {
          raceRunnerDetails: {
            type: "HORSE",
            ...(raceRunnerType === "HORSE" &&
              runnerWithRichContent?.richContent?.horseRaceRunner && {
                raceRunner: {
                  ...runnerWithRichContent?.richContent?.horseRaceRunner,
                  horse: {
                    ...runnerWithRichContent.richContent.horseRaceRunner.horse,
                    damName: formatHorseInfo(runnerWithRichContent.richContent.horseRaceRunner.horse.damName),
                    sireName: formatHorseInfo(runnerWithRichContent.richContent.horseRaceRunner.horse.sireName),
                  },
                  details: {
                    ...runnerWithRichContent.richContent.horseRaceRunner.details,
                    jockeyName: formatHorseInfo(runnerWithRichContent.richContent.horseRaceRunner.details.jockeyName),
                    trainerName: formatHorseInfo(runnerWithRichContent.richContent.horseRaceRunner.details.trainerName),
                  },
                },
              }),
          },
        }),
        ...(raceRunnerType === "GREYHOUND" && {
          raceRunnerDetails: {
            type: "GREYHOUND",
            ...(raceRunnerType === "GREYHOUND" &&
              runnerWithRichContent?.richContent?.greyhoundRaceRunner && {
                raceRunner: {
                  ...runnerWithRichContent?.richContent?.greyhoundRaceRunner,
                },
              }),
          },
        }),
      };
    },
  );
}

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURN =
    createSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURNSelector();
  const getSportsbookRunnerVM = createSportsbookRunnerVM();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getHorsePastPerformances = createHorsePastPerformancesViewModel();
  const getSportsbookMarketByURN = createEntityByURNSelector<SportsbookMarkets, URN>();
  const getSportByURN = createEntityByURNSelector<Sports, URN>();
  const getThrottle = createGetThrottleSelector();

  return function mapStateToProps(
    state: ApplicationState,
    {
      marketUrn,
      runnerURN,
      runnerViewLink,
      jerseyUrl,
      useFallbackJersey,
      statValue,
      statValueInterpolation,
      statLabel,
    },
  ): StateProps {
    const market = getSportsbookMarketByURN(state.entities.sportsbookmarkets, marketUrn);

    if (!market) {
      return {};
    }

    const sport = getSportByURN(state.entities.sports, market.sport);

    const runnerWithRichContent = getSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURN(state.entities, {
      marketUrn,
      runnerUrn: runnerURN,
      sportId: sport?.sportId,
    });

    if (!runnerWithRichContent) {
      return {};
    }

    const { status, isOddsboostMarketType } = market;

    const runner = getSportsbookRunnerVM({
      ...runnerWithRichContent,
      sportId: sport?.sportId,
      jersey: jerseyUrl,
      useFallbackJersey,
      statValue,
      statValueInterpolation,
      statLabel,
    });

    const userDetails = <UserDetails>getUserDetailsSelector(state);
    const pastPerformances =
      runner.raceRunnerDetails?.type === "HORSE"
        ? runner.raceRunnerDetails.raceRunner?.horse.pastPerformances
        : undefined;

    const trapIconThrottle = getThrottle(state.entities.throttles, "SHOW_TRAP_ICON");

    return {
      runner,
      hasDefaultSilk: !!sport?.sportId && getSilkFallbackType(sport.sportId) === FallbackIconType.HorseRacing,
      marketName: market.name,
      marketStatus: status || "OPEN",
      isRaceMarket: isRaceHierarchy(market.hierarchy),
      isMarketInplay: market.inplay,
      runnerViewLink,
      nonRunnerTitle: i18n({ key: "I18N.NON_RUNNER.TITLE" }),
      horsePastPerformances: getHorsePastPerformances(pastPerformances, userDetails),
      showTrapIcon: trapIconThrottle?.isActive ?? false,
      horseRacingRunneri18nLabels,
      isOddsboostMarketType: !!isOddsboostMarketType,
    };
  };
};

const dispatchToggleRecentRaces = (runnerName: string, cardUrn: URN, isClosed: boolean): ToggleRecentRaceAction => ({
  type: UI__RECENT_RACE_TOGGLE,
  payload: {
    runnerName,
    cardUrn,
    isClosed,
  },
});

const dispatchFetchCatalogue = (urn: string): FetchCatalogueAction => ({
  type: FETCH_CATALOGUE,
  payload: {
    urn,
  },
});

const dispatchToggleRunnerInfo = (marketName: string, runnerName: string, isOpening: boolean): ToggleRunnerInfo => ({
  type: UI__TOGGLE_RUNNER_INFO,
  payload: {
    isOpening,
    marketName,
    runnerName,
  },
});

const dispatchDeleteView = (urn: string): DeleteViewAction => ({
  type: DELETE_VIEW,
  payload: urn,
});

const dispatchExpandRunnerData = (urns: URN[]): ExpandRaceRunnerAction => ({
  type: EXPAND_RACE_RUNNER,
  payload: urns,
});

const dispatchPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

const dispatchNavigateToView = (destination: string, cardURN: URN, label: string): NavigateToView => ({
  type: UI__NAVIGATE_TO_VIEW,
  payload: {
    url: destination,
    cardURN,
    label,
    module: "primary swimlane",
  },
});

const dispatchToggleRaceReplays = (runnerName: string, isClosed: boolean, cardUrn: URN): RaceReplaysToggleAction => ({
  type: UI__RACE_REPLAYS_TOGGLE,
  payload: {
    selection: runnerName,
    isClosed,
    cardUrn,
  },
});

const dispatchRaceReplaysMediaPlayerLoaded = (marketUrn: URN): RaceReplaysMediaPlayerLoadedAction => ({
  type: UI__RACE_REPLAYS_MEDIA_PLAYER_LOADED,
  payload: { marketUrn },
});

export type DispatchProps = {
  dispatchFetchCatalogue: typeof dispatchFetchCatalogue;
  dispatchToggleRunnerInfo: typeof dispatchToggleRunnerInfo;
  dispatchDeleteView: typeof dispatchDeleteView;
  dispatchExpandRunnerData: typeof dispatchExpandRunnerData;
  dispatchPushAction: typeof dispatchPushAction;
  dispatchToggleRecentRaces: typeof dispatchToggleRecentRaces;
  dispatchNavigateToView: typeof dispatchNavigateToView;
  dispatchToggleRaceReplays: typeof dispatchToggleRaceReplays;
  dispatchRaceReplaysMediaPlayerLoaded: typeof dispatchRaceReplaysMediaPlayerLoaded;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchFetchCatalogue,
  dispatchDeleteView,
  dispatchToggleRunnerInfo,
  dispatchExpandRunnerData,
  dispatchPushAction,
  dispatchToggleRecentRaces,
  dispatchNavigateToView,
  dispatchToggleRaceReplays,
  dispatchRaceReplaysMediaPlayerLoaded,
};
