import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { OddsDisplayPreference } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  BettingMetadata,
  RunnersMetadata,
  SportsbookBettingRunnerData,
  BettingGenericMetadata,
  BettingRacingMetadata,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/SportsbookBetting.types";
import { FallbackIconType, AlertType, AlertProps } from "@ppb/the-wall-common/types";
import type { Region } from "@ppb/the-wall-icons/traps";
import {
  BettingState,
  INVALID_SGM_COMBINATIONS_RUNNER_FAILURE_CODES,
  RUNNER_FAILURE_CODES,
  BET_TYPES,
} from "@ppb/betslip-core";
import {
  createSportsbookBettingRunnerSelector,
  getAllUniqueCombinationsFailures,
  getAllUniqueRunnersFailures,
  getSportsbookBettingNumRunners,
  getOperationalFailure,
  getSportsbookBettingSBGBetslipBrandSettingIsSet,
  getSportsbookBettingImplyRunnerFailures,
  getSportsbookBettingRunners,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import {
  getSbkPlaceImportantErrorCode,
  hasAnyMarketClosedFailure,
  hasAnyMarketSuspendedFailure,
  hasAnyInvalidCombinationFailure,
  isSingleLike,
} from "@ppb/tbd-store/helpers/sportsbook-betting";
import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import { getBetslipCard } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { createSelector } from "reselect";
import { RacingSport } from "@ppb/tbd-store";
import { EventType } from "@ppb/tbd-store/state/constants";
import { formatDateWithOrdinal } from "@ppb/formatters";
import { NotificationCode } from "./betslip-notification-code";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import { i18n } from "../../helpers/i18n";
import { TranslationKey } from "../../translations/keys";
import { formatTime } from "../../helpers/dates";
import { buildCombinationOdds } from "./betslip-formatters";
import { formatHandicap, formatRunnerName } from "../../formatters/runner-formatters";
import { getRaceSport, getSilkFallbackType } from "../../helpers/race";
import type { SportsbookPlacePanelNotifications } from "./SportsbookPlace/snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.types";
import { BetSelection } from "./SportsbookReceipt/snowflakes/SportsbookReceiptPanel/snowflakes/BetSelections/BetSelections.types";

type SelectionDescription = {
  title: string;
  name: string;
  subtitle: string;
  eventUrn: string;
  handicap?: string;
  racingSport?: RacingSport;
  icon?: string;
  silkFallbackType?: FallbackIconType;
  meetingCountry?: Region;
  trap?: number | string;
};

export type Combination = {
  id: string;
  creationTimestamp: number;
  legId: string;
  odds: string;
  previousOdds?: string;
  returnsLabel: string;
  stake?: number;
  silkIcon?: string;
  silkFallbackIconType?: FallbackIconType;
  selection: {
    title: string;
    subtitle: string;
  };
  isBonusAvailable: boolean;
  isEachWayAvailable: boolean;
  isEachWaySelected: boolean;
  eachWaySubtitle?: string;
  multiplier?: string;
};

export type BetBuilder = {
  id: string;
  title: string;
  subtitle: string;
  selections: BetSelection[];
  selectionsLabel: string;
};

const buildLotterySelection = <T extends SportsbookBettingRunnerData>(
  metadata: BettingGenericMetadata,
  userDetails: UserDetails,
  runner?: T,
): SelectionDescription => {
  const { eventName, runnerName, eventUrn, competitionName, eventOpenDate } = metadata;
  const runnerHandicap = runner?.handicap ? runner?.handicap : undefined;
  const { localeCodeBcp47, timezone } = userDetails;
  const translations = {
    other: i18n({ key: "I18N.LOTTERIES.DATE_ABBREVIATION_OTHER" }),
    first: i18n({ key: "I18N.LOTTERIES.DATE_ABBREVIATION_FIRST" }),
    second: i18n({ key: "I18N.LOTTERIES.DATE_ABBREVIATION_SECOND" }),
    third: i18n({ key: "I18N.LOTTERIES.DATE_ABBREVIATION_THIRD" }),
  };

  const dateFormated = eventOpenDate
    ? formatDateWithOrdinal(eventOpenDate, localeCodeBcp47, timezone, translations, true)
    : "";

  const subtitle = `${competitionName} ${eventName} ${dateFormated}`.trim();

  return {
    title: formatRunnerName(runnerName, runnerHandicap),
    name: runnerName,
    handicap: formatHandicap(runnerHandicap),
    subtitle,
    eventUrn,
  };
};

const buildGenericSelection = <T extends SportsbookBettingRunnerData>(
  metadata: BettingGenericMetadata,
  runner?: T,
): SelectionDescription => {
  const { marketName, eventName, runnerName, eventUrn, isSuperSub } = metadata;
  const runnerHandicap = runner?.handicap ? runner?.handicap : undefined;

  let subtitle = `${marketName} - ${eventName}`;

  if (isSuperSub) {
    subtitle = i18n({
      key: "I18N.BETSLIP.SUPER_SUB.SUBTITLE",
      interpolationValues: { marketName, eventName },
    });
  }

  return {
    title: formatRunnerName(runnerName, runnerHandicap),
    name: runnerName,
    handicap: formatHandicap(runnerHandicap),
    subtitle,
    eventUrn,
  };
};

export const buildMultiBetBuilderGroup = (
  metadata: BettingMetadata,
  userDetails: UserDetails,
): { groupUrn: string; groupTitle: string } => {
  if (metadata.type === "GENERIC") {
    const { eventUrn, eventName } = metadata;

    return {
      groupUrn: eventUrn,
      groupTitle: eventName,
    };
  }

  const { racing } = metadata;
  const { localeCodeBcp47, timezone } = userDetails;
  const raceTime = formatTime(racing.time, localeCodeBcp47, timezone);

  return {
    groupUrn: racing.urn,
    groupTitle: `${raceTime} ${racing.venue}`,
  };
};

const buildRacingSelection = (metadata: BettingRacingMetadata, userDetails: UserDetails): SelectionDescription => {
  const { racing, runnerName, marketTypeName, marketName, sportId, marketType } = metadata;
  const { localeCodeBcp47, timezone } = userDetails;

  const finalMarketTypeName = marketType === "BETTING_W/O" ? marketName : marketTypeName || marketName;
  const raceTime = formatTime(racing.time, localeCodeBcp47, timezone);
  const saddleCloth = racing.saddleCloth ? `${racing.saddleCloth} ` : "";
  const name = saddleCloth + runnerName;

  const getRegionFromCountry = (country: string): Region => {
    const regionMap: Record<string, Region> = {
      US: "US",
      GB: "UK",
      AU: "AU",
    };

    return regionMap[country] || "AGNOSTIC";
  };

  const getTrapIcon = (trap?: number, market?: string): string | number | undefined => {
    if (market === "WIN" || market === "BETTING_W/O") {
      return trap ?? "default";
    }
    return undefined;
  };

  return {
    title: name,
    name,
    subtitle: `${finalMarketTypeName} - ${raceTime} ${racing.venue}`,
    racingSport: getRaceSport(sportId),
    icon: racing.runnerVisual,
    silkFallbackType: getSilkFallbackType(sportId),
    meetingCountry: racing.meetingCountry ? getRegionFromCountry(racing.meetingCountry) : "AGNOSTIC",
    trap: getTrapIcon(racing.trap, marketType),
    eventUrn: racing.urn,
  };
};

export const buildSelection = <T extends SportsbookBettingRunnerData>(
  metadata: BettingMetadata,
  userDetails: UserDetails,
  runner?: T,
): SelectionDescription => {
  if (metadata?.type === "RACING") {
    return buildRacingSelection(metadata, userDetails);
  }

  if (metadata.sportId === EventType.LOTTERIES) {
    return buildLotterySelection(metadata, userDetails, runner);
  }

  return buildGenericSelection(metadata, runner);
};

export const hasSGMFailures = (runnerFailures: BettingState.ImplyRunnerFailure[]): boolean =>
  runnerFailures.some((failure) =>
    [...INVALID_SGM_COMBINATIONS_RUNNER_FAILURE_CODES, RUNNER_FAILURE_CODES.NOT_ELIGIBLE_SGM_SELECTION].includes(
      failure.failureCode,
    ),
  );

export const hasAnyInvalidSGMCombinationFailure = (runnerFailures: BettingState.ImplyRunnerFailure[] = []): boolean =>
  runnerFailures.some((failure) => failure.failureCode === RUNNER_FAILURE_CODES.INVALID_SGM_COMBINATION);

export const hasAnySameMarketCombinationFailure = (runnerFailures: BettingState.ImplyRunnerFailure[] = []): boolean =>
  runnerFailures.some((failure) => failure.failureCode === RUNNER_FAILURE_CODES.IMPOSSIBLE_SAME_MARKET_COMBINATION);

export const hasNotEligibleSGMSelectionCombinationFailure = (
  runnerFailures: BettingState.ImplyRunnerFailure[] = [],
): boolean => runnerFailures.some((failure) => failure.failureCode === RUNNER_FAILURE_CODES.NOT_ELIGIBLE_SGM_SELECTION);

const checkAnyFailures = (
  failedRunners: BettingState.ImplyRunnerFailuresMap,
  checkFailure: (runnerFailures: BettingState.ImplyRunnerFailure[]) => boolean,
): boolean => Object.values(failedRunners).some((runnerFailures) => checkFailure(runnerFailures));

export const createMultiplesNotificationsSelector = () => {
  const noNotifications: SportsbookPlacePanelNotifications = [];
  const invalidCombinations: SportsbookPlacePanelNotifications = [
    {
      id: NotificationCode.NotCombinable,
      type: AlertType.Warning,
      message: i18n({ key: "I18N.BETSLIP.NOT_COMBINABLE" }),
    },
  ];

  return createSelector([getSportsbookBettingImplyRunnerFailures], (failedRunners) => {
    const hasAnyInvalidCombinationFailures = checkAnyFailures(failedRunners, hasAnyInvalidCombinationFailure);

    if (hasAnyInvalidCombinationFailures) {
      return invalidCombinations;
    }

    return noNotifications;
  });
};

export const createAvailabilityNotificationSelector = () =>
  createSelector(
    [
      getSportsbookBettingImplyRunnerFailures,
      getSportsbookBettingSBGBetslipBrandSettingIsSet,
      getSportsbookBettingNumRunners,
    ],
    (failedRunners: BettingState.ImplyRunnerFailuresMap, sbgBrandSetting: boolean, numRunners: number) => {
      const notification: AlertProps = {
        id: NotificationCode.Availability,
        type: sbgBrandSetting ? AlertType.Info : AlertType.Warning,
      };

      const hasAnyMarketClosed = checkAnyFailures(failedRunners, hasAnyMarketClosedFailure);
      const hasAnyMarketSuspended = checkAnyFailures(failedRunners, hasAnyMarketSuspendedFailure);

      const numFailures = Object.keys(failedRunners).length;

      if (sbgBrandSetting && numRunners > 1 && numFailures < numRunners) {
        if (hasAnyMarketClosed && hasAnyMarketSuspended) {
          return {
            ...notification,
            message: i18n({ key: "I18N.BETSLIP.SBG.AVAILABILITY_CHANGED" }),
            detail: i18n({ key: "I18N.BETSLIP.SBG.EXCLUDE_CLOSED_OR_SUSPENDED" }),
          };
        }

        if (hasAnyMarketSuspended) {
          return {
            ...notification,
            message: i18n({ key: "I18N.BETSLIP.SBG.AVAILABILITY_CHANGED" }),
            detail: i18n({ key: "I18N.BETSLIP.SBG.EXCLUDE_UNAVAILABLE" }),
          };
        }

        if (hasAnyMarketClosed) {
          return {
            ...notification,
            message: i18n({ key: "I18N.BETSLIP.SBK.MARKET_CLOSED" }),
            detail: i18n({ key: "I18N.BETSLIP.SBG.EXCLUDE_CLOSED" }),
          };
        }
      }

      if (hasAnyMarketClosed && hasAnyMarketSuspended) {
        return {
          ...notification,
          message: i18n({ key: "I18N.BETSLIP.AVAILABILITY_NOTIFICATION" }),
        };
      }

      if (hasAnyMarketClosed) {
        return {
          ...notification,
          message: i18n({ key: "I18N.BETSLIP.SBK.MARKET_CLOSED" }),
        };
      }

      if (hasAnyMarketSuspended) {
        return {
          ...notification,
          message: i18n({ key: "I18N.BETSLIP.SBK.MARKET_SUSPENDED" }),
        };
      }

      return undefined;
    },
  );

export const buildSportsbookTransactionalError = (appState: ApplicationState): AlertProps | undefined => {
  const notification = { id: NotificationCode.TransactionalError, type: AlertType.Error };

  const operationalFailure = getOperationalFailure(appState);
  const { hasSportsbookTechnicalError } = getBetslipCard(appState) || {};

  if (hasSportsbookTechnicalError) {
    return {
      ...notification,
      message: i18n({ key: "I18N.BETSLIP.ERROR.UNKNOWN" }),
    };
  }

  if (!operationalFailure) {
    return undefined;
  }

  const messageCode = getSbkPlaceImportantErrorCode({
    operationalFailure,
    uniqueRunnersFailures: getAllUniqueRunnersFailures(appState),
    uniqueCombinationsFailures: getAllUniqueCombinationsFailures(appState),
  });
  return {
    ...notification,
    message: i18n({ key: `I18N.BETSLIP.SBK.ERROR.${messageCode}` as keyof TranslationKey }),
  };
};

export const buildReturnsLabel = ({
  odds,
  potentialReturns,
  userDetails,
  originalPotentialReturns,
  isPriceBoostSelected,
  hasStartingPrice,
}: {
  odds: BettingState.Odds | null;
  potentialReturns: number | null;
  userDetails: UserDetails;
  originalPotentialReturns?: number | null;
  isPriceBoostSelected?: boolean;
  hasStartingPrice?: boolean;
}): string => {
  if (hasStartingPrice || (!potentialReturns && !odds)) {
    return i18n({ key: "I18N.BETSLIP.BET_RETURNS_TBD" });
  }

  const formattedPotential = currencyFormatWithDecimalPlaces({
    ...userDetails,
    value: potentialReturns || 0,
    decimalPlaces: 2,
  });

  if (originalPotentialReturns && isPriceBoostSelected) {
    const formattedOriginalPotential = currencyFormatWithDecimalPlaces({
      ...userDetails,
      value: originalPotentialReturns,
      decimalPlaces: 2,
    });

    return i18n({
      key: "I18N.BETSLIP.BET_RETURNS_WITH_ORIGINAL",
      interpolationValues: {
        potentialReturns: formattedPotential,
        originalPotentialReturns: formattedOriginalPotential,
      },
    });
  }

  return i18n({ key: "I18N.BETSLIP.BET_RETURNS", interpolationValues: { potentialReturns: formattedPotential } });
};

export const buildSingles = (
  state: BettingState.Group,
  userDetails: UserDetails,
  bettingRunnersMetadata: RunnersMetadata,
  oddsDisplay: OddsDisplayPreference,
): Combination[] => {
  const { combinations, legs } = state;
  const combinationsList = Object.values(combinations);
  const getSportsbookBettingRunner = createSportsbookBettingRunnerSelector();

  return combinationsList
    .filter((combination) => isSingleLike(combination, legs))
    .sort((combinationA, combinationB) => combinationA.creationTimestamp - combinationB.creationTimestamp)
    .map((combination) => {
      // Retrieving the first leg based on the assumption we only handle SIMPLE_SELECTION SINGLE's
      const legId = combination.legs[0];
      const { runners } = legs[legId];
      const [legRunnerId] = runners;
      const metadata = bettingRunnersMetadata[legRunnerId];
      const [previousOdds] = metadata.previousOdds || [];
      const bettingRunner = getSportsbookBettingRunner(state.runners, legRunnerId);
      const { title, subtitle, icon, silkFallbackType } = buildSelection(metadata, userDetails, bettingRunner);
      const {
        isEachWayAvailable,
        isEachWaySelected,
        eachWayPlaces,
        eachWayPlacesFraction,
        isPriceBoostAvailable,
        isPriceBoostSelected,
        odds,
        potentialReturns,
      } = combination;

      const eachWaySubtitle = isEachWayAvailable
        ? i18n({
            key: "I18N.BETSLIP.EACHWAY_ODDS_PLACES",
            interpolationValues: {
              numerator: eachWayPlacesFraction?.numerator || "",
              denominator: eachWayPlacesFraction?.denominator || "",
              places: eachWayPlaces || "",
            },
          })
        : undefined;

      return {
        id: combination.id,
        creationTimestamp: combination.creationTimestamp,
        legId,
        odds: buildCombinationOdds(combination, oddsDisplay),
        previousOdds: previousOdds ? formatOdds(previousOdds, oddsDisplay) : undefined,
        stake: combination.stake ? combination.stake : undefined,
        returnsLabel: buildReturnsLabel({ odds, potentialReturns, userDetails }),
        selection: { title, subtitle },
        icon,
        silkFallbackIconType: silkFallbackType,
        isBonusAvailable: combination.isBonusAvailable,
        isEachWayAvailable,
        isEachWaySelected,
        eachWaySubtitle,
        isPriceBoostAvailable,
        isPriceBoostSelected,
        multiplier: combination.isEachWaySelected ? `${combination.numLines * 2}x` : undefined,
      };
    });
};

export const translateMultiple = (betType: BET_TYPES): string => {
  const key = `I18N.BETSLIP.SBK.MULTIPLE.${betType}_LINES` as keyof TranslationKey;
  return i18n({ key });
};

/**
 * With state details return a function that takes a combination
 * and maps to BetBuilder
 */
export const combinationToBetBuilder =
  (
    legsMap: BettingState.LegsMap,
    runnersMetadata: RunnersMetadata,
    userDetails: UserDetails,
    runnersMapBettingState: BettingState.RunnersMap,
  ): ((combination: BettingState.Combination) => BetBuilder) =>
  (combination) => {
    const { id, betType, legs: legsURN } = combination;

    // since the legs are all of the same game, any leg is good to get the metadata from
    const leg = legsMap[legsURN[0]];
    const { runners } = leg;
    const [legRunnerId] = runners;
    const firstRunnerMetadata = runnersMetadata[legRunnerId];

    const selections: BetSelection[] = legsURN.map((legURN) => {
      const runnerID = legsMap[legURN].runners[0];
      const runner = runnersMetadata[runnerID];
      const bettingRunner = runnersMapBettingState[legRunnerId];
      const { title, subtitle } = buildSelection(runner, userDetails, bettingRunner);
      return {
        id: legURN,
        urn: runner.runnerUrn,
        action: i18n({ key: "I18N.BETSLIP.REMOVE" }),
        title,
        subtitle,
      };
    });

    return {
      id,
      title: translateMultiple(betType),
      subtitle:
        firstRunnerMetadata.type === "GENERIC" ? firstRunnerMetadata.eventName : firstRunnerMetadata.racing.venue,
      selections,
      selectionsLabel: i18n({
        key: "I18N.BETSLIP.SELECTIONS_COUNT",
        interpolationValues: { numberOfSelections: selections.length },
      }),
    };
  };

export const createAreAllCombinationsClosedOrSuspendedSelector = () =>
  createSelector(
    [getSportsbookBettingRunners, getSportsbookBettingImplyRunnerFailures],
    (allRunners, failedRunners) => {
      const allRunnersIds = Object.keys(allRunners).sort();
      const failedRunnersIds = Object.keys(failedRunners).sort();

      if (
        allRunnersIds.length !== failedRunnersIds.length &&
        allRunnersIds.some((id, index) => id !== failedRunnersIds[index])
      ) {
        return false;
      }

      const areAllCombinationsClosedOrSuspended = Object.values(failedRunners).every(
        (runnerFailures) => hasAnyMarketClosedFailure(runnerFailures) || hasAnyMarketSuspendedFailure(runnerFailures),
      );

      return areAllCombinationsClosedOrSuspended;
    },
  );
