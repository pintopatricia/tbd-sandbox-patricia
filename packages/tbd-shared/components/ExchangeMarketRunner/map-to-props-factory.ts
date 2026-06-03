import { MapStateToPropsFactory } from "react-redux";
import { createSelector, ParametricSelector } from "reselect";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { FallbackIconType, HorseRacingRunnerI18NLabels } from "@ppb/the-wall-common/types";
import {
  createEntityByURNSelector,
  createRichContentExcRunnerWithPNLByMarketAndRunnerURNSelector,
  RichContentExcRunnerAndPNL,
} from "@ppb/tbd-store/state/entities/entities-selectors";
import {
  RaceReplaysToggleAction,
  ToggleRecentRaceAction,
  ToggleRunnerInfo,
  UI__RACE_REPLAYS_TOGGLE,
  UI__RECENT_RACE_TOGGLE,
  UI__TOGGLE_RUNNER_INFO,
} from "@ppb/tbd-store/actions/interface";
import { DeleteViewAction, DELETE_VIEW, FetchCatalogueAction, FETCH_CATALOGUE } from "@ppb/tbd-store/actions/catalogue";
import { doesMarketHierarchyHaveRace } from "@ppb/tbd-store/helpers/markets";
import { RunnerPosition } from "@ppb/bet-engine";

import { EXPAND_RACE_RUNNER, ExpandRaceRunnerAction } from "@ppb/tbd-store/actions/racerunner";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import type {
  ExchangeMarkets,
  ExchangeMarketStatus,
} from "@ppb/tbd-store/state/entities/exchange-markets/ExchangeMarket.types";
import { Sports } from "@ppb/tbd-store/state/entities/sports/Sport.types";
import { RaceReplaysMediaPlayerLoadedAction, UI__RACE_REPLAYS_MEDIA_PLAYER_LOADED } from "@ppb/tbd-store/actions/media";
import { i18n } from "../../helpers/i18n";
import { formatDate, formatTime } from "../../helpers/dates";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import { createHorsePastPerformancesViewModel } from "../../view-model-factories/horse-past-performances";
import { RenderInlineBetslipFactory } from "../Betslip/withInlineBetslip/types";
import { getSilkFallbackType } from "../../helpers/race";
import type { ExchangeMarketRunner } from "../ExchangeMarket/snowflakes/ExchangeMarket/ExchangeMarket.types";
import { horseRacingRunneri18nLabels } from "../SportsbookRunner/horseRacingRunneri18nLabels";

type exchangeMarketRunnerVMProps = {
  runner: RichContentExcRunnerAndPNL;
  userdetails: UserDetails;
};

/**
 * Given the runner position and user details, build an object with formatted Pnl and raw Pnl values
 */
function buildPnl(runnerPosition: RunnerPosition, userDetails: UserDetails): { pnl?: string; rawPnl?: number } {
  if (typeof runnerPosition?.pnl?.win === "undefined") {
    return {};
  }

  return {
    pnl: currencyFormatWithDecimalPlaces({
      ...userDetails,
      value: runnerPosition.pnl.win,
    }),
    rawPnl: runnerPosition.pnl.win,
  };
}

/**
 * Given the runner position and user details, build an object with formatted What-if and raw What-if values
 */
function buildWhatIf(
  runnerPosition: RunnerPosition,
  userDetails: UserDetails,
): { whatIf?: string; rawWhatIf?: number } {
  if (typeof runnerPosition?.whatIf?.win === "undefined") {
    return {};
  }

  return {
    whatIf: currencyFormatWithDecimalPlaces({
      ...userDetails,
      value: runnerPosition.whatIf.win,
    }),
    rawWhatIf: runnerPosition.whatIf.win,
  };
}

const createExchangeMarketRunnerVM = (): ParametricSelector<
  exchangeMarketRunnerVMProps,
  void,
  ExchangeMarketRunner
> => {
  const i18nLabels = {
    nonRunnerReduction: i18n({ key: "I18N.NON_RUNNER.REDUCTION" }),
    nonRunnerTitle: i18n({ key: "I18N.NON_RUNNER.TITLE" }),
  };

  const getHorsePastPerformances = createHorsePastPerformancesViewModel();
  return createSelector(
    [
      ({ runner }: exchangeMarketRunnerVMProps) => runner,
      ({ userdetails }: exchangeMarketRunnerVMProps) => userdetails,
    ],
    (runner, userdetails) => {
      const pnl = runner.runnerPosition && userdetails ? buildPnl(runner.runnerPosition, userdetails) : {};
      const whatIf = runner.runnerPosition && userdetails ? buildWhatIf(runner.runnerPosition, userdetails) : {};
      const formattedReduction = runner.reduction && runner.reduction.toFixed(1);
      const date = runner.date && new Date(runner.date);
      const { localeCodeBcp47, timezone } = userdetails;

      return {
        urn: runner.urn,
        name: runner.name,
        status: runner.status,
        reduction: runner.reduction ? `${formattedReduction}% ${i18nLabels.nonRunnerReduction}` : undefined,
        date: date
          ? `${formatTime(date, localeCodeBcp47, timezone)} ${formatDate(date, localeCodeBcp47, timezone)}`
          : undefined,
        saddleCloth: runner.raceRunner?.details.saddleCloth,
        draw: runner.raceRunner?.details.draw,
        jockeyName: runner.raceRunner?.details.jockeyName,
        trainerName: runner.raceRunner?.details.trainerName,
        silk: runner.raceRunner?.details.silk,
        form: runner.raceRunner?.form,
        apprenticeClaim: runner.raceRunner?.apprenticeClaim,
        crsDisWinFavText: runner.raceRunner?.crsDisWinFavText,
        equipment: runner.raceRunner?.details.equipmentDescription,
        horseAge: runner.raceRunner?.horse.age,
        weight: runner.raceRunner?.details.weight?.stones,
        rating: runner.raceRunner?.rating,
        comments: runner.raceRunner?.comments,
        horseDamName: runner.raceRunner?.horse.damName,
        horseSireName: runner.raceRunner?.horse.sireName,
        horseBred: runner.raceRunner?.horse.bred,
        raceRunnerUrn: runner.raceRunner?.urn,
        horsePastPerformances: getHorsePastPerformances(runner.raceRunner?.horse.pastPerformances, userdetails),
        ...pnl,
        ...whatIf,
      };
    },
  );
};

export type CardProps = {
  marketName: string;
  marketStatus: ExchangeMarketStatus;
  runner: ExchangeMarketRunner;
  hasDefaultSilk: boolean;
  isRaceMarket: boolean;
  i18nLabels: {
    nonRunnerTitle: string;
  };
  horseRacingRunneri18nLabels: HorseRacingRunnerI18NLabels;
};

export type StateProps = CardProps | Record<string, never>;

export type ContainerProps = {
  cardURN: URN;
  marketURN: URN;
  runnerURN: URN;
  isMarketDepthActive: boolean;
  i18nLabels: {
    nonRunnerTitle: string;
  };
  runnerViewLink?: ViewLink;
  runnerViewTitle?: string;
  eventViewLink?: ViewLink;
  renderBetslip?: RenderInlineBetslipFactory;
  runnerIdx?: number;
  runnersLength?: number;
  isRunnerExpandable?: boolean;
};

/** ********************************************
 *                                              *
 *         *  makeMapStateToProps *             *
 *                                              *
 ********************************************** */
export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getExchangeMarketByURN = createEntityByURNSelector<ExchangeMarkets, URN>();
  const getSportByURN = createEntityByURNSelector<Sports, URN>();
  const getExchangeMarketRunnerWithRichContentByMarketAndRunnerURNs =
    createRichContentExcRunnerWithPNLByMarketAndRunnerURNSelector();
  const getExchangeMarketRunnerVM = createExchangeMarketRunnerVM();
  const i18nLabels = {
    nonRunnerReduction: i18n({ key: "I18N.NON_RUNNER.REDUCTION" }),
    nonRunnerTitle: i18n({ key: "I18N.NON_RUNNER.TITLE" }),
  };

  return (state: ApplicationState, props: ContainerProps): StateProps => {
    const userdetails = <UserDetails>state.entities.userdetails;

    const market = getExchangeMarketByURN(state.entities.exchangemarkets, props.marketURN);
    const runner = getExchangeMarketRunnerWithRichContentByMarketAndRunnerURNs(state, {
      marketURN: props.marketURN,
      runnerURN: props.runnerURN,
    });

    if (!market || !runner || !userdetails) {
      return {};
    }

    const sport = getSportByURN(state.entities.sports, market.sport);
    const runnerVm = getExchangeMarketRunnerVM({ runner, userdetails });

    return {
      marketName: market.name,
      marketStatus: market.status,
      hasDefaultSilk: !!sport?.sportId && getSilkFallbackType(sport.sportId) === FallbackIconType.HorseRacing,
      runner: runnerVm,
      isRaceMarket: doesMarketHierarchyHaveRace(market.hierarchy),
      i18nLabels,
      horseRacingRunneri18nLabels,
    };
  };
};

const dispatchToggleRunnerInfo = (marketName: string, runnerName: string, isOpening: boolean): ToggleRunnerInfo => ({
  type: UI__TOGGLE_RUNNER_INFO,
  payload: {
    isOpening,
    marketName,
    runnerName,
  },
});

const dispatchFetchCatalogue = (urn: string): FetchCatalogueAction => ({
  type: FETCH_CATALOGUE,
  payload: {
    urn,
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

const dispatchToggleRecentRaces = (runnerName: string, cardUrn: URN, isClosed: boolean): ToggleRecentRaceAction => ({
  type: UI__RECENT_RACE_TOGGLE,
  payload: {
    runnerName,
    cardUrn,
    isClosed,
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
  dispatchToggleRaceReplays: typeof dispatchToggleRaceReplays;
  dispatchRaceReplaysMediaPlayerLoaded: typeof dispatchRaceReplaysMediaPlayerLoaded;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchFetchCatalogue,
  dispatchToggleRunnerInfo,
  dispatchDeleteView,
  dispatchExpandRunnerData,
  dispatchPushAction,
  dispatchToggleRecentRaces,
  dispatchToggleRaceReplays,
  dispatchRaceReplaysMediaPlayerLoaded,
};
