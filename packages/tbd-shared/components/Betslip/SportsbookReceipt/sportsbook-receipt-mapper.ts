import { codecs } from "@ppb/tbd-urn-codecs";
import { createSelector } from "reselect";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { SportsbookOdds } from "@ppb/tbd-store/state/entities/SportsbookOdds.types";
import { BetslipSportsbookReport, CastBetRunnerSelectionProps } from "@ppb/tbd-store";
import { createIsBrandSettingEnabledSelector } from "@ppb/tbd-store/state/entities/brand-settings/brand-settings-selectors";
import { UserPreferences } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { getSportsbookReport } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import { UserDetails, UserDetailsState } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import {
  BettingMetadata,
  RunnersMetadata,
  SportsbookBettingRunnerData,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/SportsbookBetting.types";
import { createSportIdEventTypeMapper } from "@ppb/tbd-store/state/entities/notifications/Notifications";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { BettingState, PlaceResult, LEG_TYPES } from "@ppb/betslip-core";
import { BetSegmentsIcons } from "@ppb/the-wall-common/types";
import {
  isCast,
  isMultiple,
  isSingle,
  isBetBuilder,
  isMultiBetBuilder,
  isBoostedMultiple,
  isLotteries,
} from "@ppb/tbd-store/helpers/sportsbook-betting";
import { createGetUnsupportedEventIdsSelector } from "@ppb/tbd-store/state/entities/notifications/notifications-selectors";
import { Entities } from "@ppb/tbd-store/state/entities/Entities.types";
import { createSportEventByURNSelector } from "@ppb/tbd-store/state/entities/sport-events/sport-event-selectors";
import { createRaceByURNSelector } from "@ppb/tbd-store/state/entities/races/race-selectors";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { currencyFormatWithDecimalPlaces } from "../../../formatters/currency-formatters";
import { TranslationKey } from "../../../translations/keys";
import { i18n } from "../../../helpers/i18n";
import {
  buildSportsbookFreeBetsLabel,
  buildOriginalPotentialReturns,
  buildPotentialReturns,
  getCastOrdinal,
  buildRacingTitle,
  buildOdds,
} from "../betslip-formatters";
import { buildMultiBetBuilderGroup, buildSelection } from "../connected-sportsbook-betslip-mapper";
import { buildFreeBetsAlertMessage, getGenerosityReceiptAlertData } from "../../../helpers/generosity-wallets";
import { getSelectionTypeIcon } from "../../../helpers/selection-type";
import { getBoostedInfo } from "../../../helpers/boosted-info";

import {
  SportsbookReceiptPanelBetBuilder,
  SportsbookReceiptPanelCastBet,
  SportsbookReceiptPanelMultiBetBuilder,
  SportsbookReceiptPanelMultiBetBuilderGroups,
  SportsbookReceiptPanelMultiple,
  SportsbookReceiptPanelOneLegBet,
  SportsbookReceiptPanelProps,
  SportsbookReceiptPanelSelection,
  SportsbookReceiptPanelSingle,
} from "./snowflakes/SportsbookReceiptPanel/SportsbookReceiptPanel.types";
import { BetSelection } from "./snowflakes/SportsbookReceiptPanel/snowflakes/BetSelections/BetSelections.types";

type Runner = {
  runnerURN: string;
  selectionId: number;
  name: string;
  resultType: string | null;
};

function mapBoostedLeg(
  leg: PlaceResult.PlacedLeg,
  report: BetslipSportsbookReport,
  userDetails: UserDetailsState,
  preferences: UserPreferences,
) {
  const {
    result: { relations },
    metadata,
  } = report;
  const { runners, id: legId } = leg;
  const [legRunnerId] = runners;
  const runnerRelations = relations.legsRunners[legId][legRunnerId];

  const { title, subtitle, icon, silkFallbackType } = buildSelection(metadata[legRunnerId], <UserDetails>userDetails, {
    handicap: runnerRelations.handicap,
  });

  const odd = !leg.isBoosted
    ? buildOdds(leg.originalDisplayOdds || leg.displayOdds, preferences.sportsbookOddsDisplay)
    : undefined;

  return {
    urn: metadata[legRunnerId].runnerUrn,
    id: leg.id,
    title,
    subtitle,
    icon,
    silkFallbackType,
    odd,
    is90Min: metadata[legRunnerId].is90Min,
  };
}

export const createSelectionsBuilder = () => {
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getUnsupportedEventIds = createGetUnsupportedEventIdsSelector();
  const getSportEventByURN = createSportEventByURNSelector();
  const getRaceByURN = createRaceByURNSelector();
  const getThrottle = createGetThrottleSelector();
  const isBrandSettingEnabled = createIsBrandSettingEnabledSelector();

  return createSelector(
    [
      getSportsbookReport,
      (state: ApplicationState) => getUserPreferencesWithProductSwitcher(state.entities.preferences),
      (state: ApplicationState): UserDetailsState => getUserDetailsSelector(state),
      (state: ApplicationState) => getUnsupportedEventIds(state.notifications),
      (state: ApplicationState) => state.entities,
      (state: ApplicationState) => getThrottle(state.entities.throttles, "HR_PUSH_NOTIFICATIONS_SUPPORT")?.isActive,
      (state: ApplicationState) => isBrandSettingEnabled(state, "SHOW_SELECTION_TYPE_ICON"),
    ],
    (
      report,
      preferences,
      userDetails,
      unsupportedEventIds,
      entities,
      isHRThrottleActive,
      isSelectionTypeIconEnabled,
    ) => {
      if (!report) {
        return [];
      }

      const {
        result: { legs, relations },
        metadata,
      } = report;
      return Object.values(legs)
        .filter((leg) => leg.legType === LEG_TYPES.SIMPLE_SELECTION)
        .map<SportsbookReceiptPanelSelection>((leg) => {
          const { runners, id: legId } = leg;
          const [legRunnerId] = runners;
          const runnerRelations = relations.legsRunners[legId][legRunnerId];

          const { title, subtitle, eventUrn, icon, trap, meetingCountry, silkFallbackType, racingSport } =
            buildSelection(metadata[legRunnerId], <UserDetails>userDetails, {
              handicap: runnerRelations.handicap,
            });

          const isRacingType = metadata[legRunnerId].type === "RACING";

          const eventId = isRacingType
            ? getRaceByURN(entities.races, eventUrn)?.raceId
            : getSportEventByURN(entities.sportevents, eventUrn)?.eventId?.toString();

          const SportIdEventTypeMapper = createSportIdEventTypeMapper(!!isHRThrottleActive);

          // checks if the current sportId supports push notifications
          const isPushNotificationsSupported = !!SportIdEventTypeMapper[metadata[legRunnerId].sportId];

          // checks if all selections has the same sportId
          const isSameSportName =
            new Set(Object.values(metadata).map((betMetadata) => betMetadata.sportName)).size === 1;

          // checks if all selections events are unsupported
          const areAllUnsupported = Object.values(metadata)
            .map((betMetadata) => SportIdEventTypeMapper[betMetadata.sportId])
            .every((item) => !item);

          // checks if all conditions are true, otherwise push notifications are unavailable for this selection
          const isPushNotificationsUnavailable =
            !areAllUnsupported &&
            (!eventId || unsupportedEventIds.includes(eventId)) &&
            (!isSameSportName || isPushNotificationsSupported);

          return {
            urn: metadata[legRunnerId].runnerUrn,
            id: leg.id,
            title,
            subtitle,
            icon,
            trap,
            meetingCountry,
            silkFallbackType,
            racingSport,
            action: i18n({ key: "I18N.BETSLIP.REMOVE" }),
            odd: buildOdds(
              leg.originalDisplayOdds || leg.displayOdds,
              preferences.sportsbookOddsDisplay,
              report.result.isAnyPriceBoostUsed,
            ),
            is90Min: metadata[legRunnerId].is90Min,
            selectionTypeIcon: isSelectionTypeIconEnabled
              ? getSelectionTypeIcon(metadata[legRunnerId].marketType, metadata[legRunnerId].isSuperSub)
              : undefined,
            isPushNotificationsUnavailable,
          };
        });
    },
  );
};

const buildMultiple = (
  combination: PlaceResult.PlacedCombination,
  preferences: UserPreferences,
  userDetails: UserDetails,
  isFreeBetsSelected: boolean,
  isFreeBetsWalletsActive: boolean,
): SportsbookReceiptPanelMultiple => {
  const {
    betType,
    displayOdds,
    totalStake,
    totalPotentialReturns,
    originalTotalPotentialReturns,
    hasBonusUsed,
    totalBonusUsed,
    lines,
    isEachWaySelected,
    isAccaInsured,
    isAccaInsuredToken,
    betReceiptId,
    regulatorId,
    isPriceBoosted,
    originalDisplayOdds,
  } = combination;

  const key = `I18N.BETSLIP.SBK.MULTIPLE.${betType}_LINES` as keyof TranslationKey;
  let previousValue;
  let previousOdds;

  if (isPriceBoosted && originalTotalPotentialReturns && originalDisplayOdds) {
    previousValue = buildOriginalPotentialReturns(totalStake, originalTotalPotentialReturns, userDetails);
    previousOdds = formatOdds(originalDisplayOdds, preferences.sportsbookOddsDisplay);
  }

  const freeBetsLabel =
    !isFreeBetsWalletsActive && isFreeBetsSelected
      ? buildSportsbookFreeBetsLabel(totalBonusUsed, userDetails, "I18N.BETSLIP.USED_BONUS")
      : undefined;

  const { message: generosityAlertMessage, icon: generosityIconName } = getGenerosityReceiptAlertData({
    combination,
    userDetails,
    isFreeBetsWalletsActive,
  });

  return {
    title: i18n({ key }),
    odds: buildOdds(displayOdds, preferences.sportsbookOddsDisplay),
    previousOdds,
    stake: currencyFormatWithDecimalPlaces({
      ...userDetails,
      value: totalStake,
    }),
    returns: buildPotentialReturns(totalStake, totalPotentialReturns, userDetails),
    previousValue,
    hasMyOddsBoost: isPriceBoosted,
    hasBonusUsed: hasBonusUsed && !isFreeBetsWalletsActive,
    freeBetsLabel,
    generosityAlertMessage,
    generosityIconName,
    lines,
    hasEachWay: isEachWaySelected,
    hasAccaInsurance: isAccaInsured && !isAccaInsuredToken,
    betReceiptId,
    regulatorId,
  };
};

export const createMultiplesBuilder = () => {
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();

  return createSelector(
    [
      getSportsbookReport,
      (state: ApplicationState) => getUserPreferencesWithProductSwitcher(state.entities.preferences),
      getUserDetailsSelector,
      (state: ApplicationState) => !!state.betslip?.hasGenerosityWallets,
    ],
    (report, preferences, userDetails, hasGenerosityWallets) => {
      if (!report) {
        return [];
      }

      const {
        result: { combinations },
        isFreeBetsSelected,
      } = report;

      return Object.values(combinations)
        .filter((combination) => isMultiple(combination))
        .sort((combinationA, combinationB) => combinationA.lines - combinationB.lines)
        .map((combination) =>
          buildMultiple(combination, preferences, <UserDetails>userDetails, isFreeBetsSelected, hasGenerosityWallets),
        );
    },
  );
};

const buildCastSelections = (
  relations: PlaceResult.PlacedRunnerRelationMap,
  metadata: RunnersMetadata,
  userDetails: UserDetails,
): CastBetRunnerSelectionProps[] =>
  Object.keys(relations)
    .sort((runnerIdA, runnerIdB) => {
      const relationA = relations[runnerIdA];
      const relationB = relations[runnerIdB];

      if (!relationA?.order || !relationB?.order) {
        return 0;
      }

      return relationA.order - relationB.order;
    })
    .map((runnerId) => {
      const relatedRunner = relations[runnerId];
      const runnerMetadata = metadata[runnerId];
      const selection = buildSelection(runnerMetadata, userDetails);

      return {
        id: runnerId,
        horse: selection.title,
        position: relatedRunner.order,
        positionOrdinal: relatedRunner.order ? getCastOrdinal(relatedRunner.order) : undefined,
        icon: selection.icon,
        meetingCountry: selection.meetingCountry,
        trap: selection.trap,
        racingSport: selection.racingSport,
        silkFallbackType: selection.silkFallbackType,
      };
    });

const buildCast = (
  result: PlaceResult.PlacedBetResults,
  combination: PlaceResult.PlacedCombination,
  metadata: RunnersMetadata,
  userDetails: UserDetails,
  isFreeBetsWalletsActive: boolean,
): SportsbookReceiptPanelCastBet => {
  const { lines, totalStake, totalPotentialReturns, betReceiptId, regulatorId, hasBonusUsed, totalBonusUsed } =
    combination;
  const { legs, relations } = result;

  const combinationLeg = legs[combination.legs[0]];
  const combinationMetadata = metadata[combinationLeg.runners[0]];
  const legRunnersRelations = relations.legsRunners[combinationLeg.id];
  const title = buildRacingTitle(combinationMetadata, userDetails);

  const freeBetsLabel =
    !isFreeBetsWalletsActive && hasBonusUsed
      ? buildSportsbookFreeBetsLabel(totalBonusUsed, userDetails, "I18N.BETSLIP.USED_BONUS")
      : undefined;

  const { message: generosityAlertMessage, icon: generosityIconName } = getGenerosityReceiptAlertData({
    combination,
    userDetails,
    isFreeBetsWalletsActive,
  });

  return {
    title,
    subtitle: i18n({ key: `I18N.BETSLIP.SBK.CAST.${combinationLeg.legType}` as keyof TranslationKey }),
    selections: buildCastSelections(legRunnersRelations, metadata, userDetails),
    lines,
    stake: currencyFormatWithDecimalPlaces({
      ...userDetails,
      value: totalStake,
    }),
    returns: buildPotentialReturns(totalStake, totalPotentialReturns, userDetails),
    betReceiptId,
    regulatorId,
    hasBonusUsed: hasBonusUsed && !isFreeBetsWalletsActive,
    freeBetsLabel,
    generosityAlertMessage,
    generosityIconName,
  };
};

export const createCastsBuilder = () => {
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();

  return createSelector(
    [getSportsbookReport, getUserDetailsSelector, (state: ApplicationState) => !!state.betslip?.hasGenerosityWallets],
    (report, userDetails, hasGenerosityWallets) => {
      if (!report) {
        return [];
      }

      const { result, metadata } = report;
      const { combinations, legs } = result;

      return Object.values(combinations)
        .filter((combination) => isCast(combination, legs))
        .sort((combinationOne, combinationTwo) => {
          // Since all runners have the same parent race we just use one of the runners
          const combinationOneLegs = legs[combinationOne.legs[0]];
          const combinationTwoLegs = legs[combinationTwo.legs[0]];
          let combinationOneRacing;
          let combinationTwoRacing;
          const metadataOne = metadata[combinationOneLegs.runners[0]];
          const metadataTwo = metadata[combinationTwoLegs.runners[0]];

          if (metadataOne.type === "RACING") {
            combinationOneRacing = metadataOne.racing;
          }
          if (metadataTwo.type === "RACING") {
            combinationTwoRacing = metadataTwo.racing;
          }

          if (!combinationOneRacing || !combinationTwoRacing) {
            return 0;
          }

          const racingTimeDelta =
            new Date(combinationOneRacing.time).getTime() - new Date(combinationTwoRacing.time).getTime();

          if (racingTimeDelta !== 0) {
            return racingTimeDelta;
          }

          return combinationOne.lines - combinationTwo.lines;
        })
        .map((combination) => buildCast(result, combination, metadata, <UserDetails>userDetails, hasGenerosityWallets));
    },
  );
};

const buildOneLineBet = (
  combination: PlaceResult.PlacedCombination,
  runners: PlaceResult.PlacedRunnersMap,
  runnerIds: string[],
  metadata: RunnersMetadata,
  preferences: UserPreferences,
  userDetails: UserDetails,
  isFreeBetsSelected: boolean,
  isFreeBetsWalletsActive: boolean,
  isSelectionTypeIconEnabled: boolean,
): SportsbookReceiptPanelOneLegBet => {
  const { totalStake, totalPotentialReturns, totalBonusUsed, hasBonusUsed, betReceiptId, regulatorId } = combination;

  const metadataRunner: {
    name: string;
    subtitle: string;
    marketType: string;
    isSuperSub: boolean;
    runnerUrn: string;
    selectionId: number;
  }[] = [];

  runnerIds.forEach((runnerId) => {
    const runnerMetadata = metadata[runnerId];
    if (runnerMetadata?.runnerName) {
      const { subtitle } = buildSelection(runnerMetadata, userDetails);

      metadataRunner.push({
        name: runnerMetadata.runnerName,
        subtitle,
        marketType: runnerMetadata.marketType,
        isSuperSub: runnerMetadata.isSuperSub ?? false,
        runnerUrn: runnerMetadata.runnerUrn,
        selectionId: runners[runnerId].selectionId,
      });
    }
  });

  const lottoRunners: Runner[] = [];
  metadataRunner.forEach((currentMetadata) => {
    lottoRunners.push({
      runnerURN: currentMetadata.runnerUrn,
      selectionId: currentMetadata.selectionId,
      name: currentMetadata.name,
      resultType: null,
    });
  });

  const { displayOdds } = runners[runnerIds[0]];

  const formattedTotalStake = currencyFormatWithDecimalPlaces({
    ...userDetails,
    value: totalStake,
  });

  const freeBetsLabel =
    !isFreeBetsWalletsActive && isFreeBetsSelected
      ? buildSportsbookFreeBetsLabel(totalBonusUsed, userDetails, "I18N.BETSLIP.USED_BONUS")
      : undefined;

  const generosityAlertMessage =
    isFreeBetsWalletsActive && hasBonusUsed
      ? buildFreeBetsAlertMessage({ userDetails, combinationAmount: totalBonusUsed })
      : undefined;

  const { subtitle, marketType, isSuperSub } = metadataRunner[0];

  return {
    title: combination.id,
    subtitle,
    odds: buildOdds(displayOdds, preferences.sportsbookOddsDisplay),
    profitOrLiability: buildPotentialReturns(totalStake, totalPotentialReturns, userDetails),
    stake: formattedTotalStake,
    hasBonusUsed: hasBonusUsed && !isFreeBetsWalletsActive,
    freeBetsLabel,
    generosityAlertMessage,
    selectionTypeIcon: isSelectionTypeIconEnabled ? getSelectionTypeIcon(marketType, isSuperSub) : undefined,
    runners: lottoRunners,
    betReceiptId,
    regulatorId,
  };
};

export const createOneLineBetsBuilder = () => {
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const isBrandSettingEnabled = createIsBrandSettingEnabledSelector();

  return createSelector(
    [
      getSportsbookReport,
      (state: ApplicationState) => getUserPreferencesWithProductSwitcher(state.entities.preferences),
      getUserDetailsSelector,
      (state: ApplicationState) => !!state.betslip?.hasGenerosityWallets,
      (state: ApplicationState) => isBrandSettingEnabled(state, "SHOW_SELECTION_TYPE_ICON"),
    ],
    (report, preferences, userDetails, hasGenerosityWallets, isSelectionTypeIconEnabled) => {
      if (!report) {
        return [];
      }

      const { result, metadata, isFreeBetsSelected } = report;
      const { combinations, legs, runners } = result;
      const placedOneLineBets = Object.values(combinations).filter((combination) => isLotteries(combination, legs));

      return placedOneLineBets.map((combination) => {
        const [legId] = combination.legs;
        const { runners: runnerIds } = legs[legId];

        return buildOneLineBet(
          combination,
          runners,
          runnerIds,
          metadata,
          preferences,
          <UserDetails>userDetails,
          isFreeBetsSelected,
          hasGenerosityWallets,
          isSelectionTypeIconEnabled,
        );
      });
    },
  );
};

const buildSingle = (
  combination: PlaceResult.PlacedCombination,
  leg: PlaceResult.PlacedLeg,
  metadata: BettingMetadata,
  runnerRelations: SportsbookBettingRunnerData,
  preferences: UserPreferences,
  userDetails: UserDetails,
  unsupportedEventIds: string[],
  isHRThrottleActive: boolean,
  isFreeBetsSelected: boolean,
  isFreeBetsWalletsActive: boolean,
  isSelectionTypeIconEnabled: boolean,
): SportsbookReceiptPanelSingle => {
  const {
    totalStake,
    totalPotentialReturns,
    totalBonusUsed,
    hasBonusUsed,
    isEachWaySelected: hasEachWay,
    eachWayPlacesFraction,
    eachWayPlaces,
    isGuaranteedPriceSelected,
    betReceiptId,
    regulatorId,
  } = combination;

  const { displayOdds } = leg;
  let previousOdds: BettingState.Odds | SportsbookOdds | null = metadata.previousOdds ? metadata.previousOdds[0] : null;

  let previousProfitOrLiability;
  if (combination.isPriceBoosted && combination.originalTotalPotentialReturns && combination.originalDisplayOdds) {
    previousProfitOrLiability = currencyFormatWithDecimalPlaces({
      ...userDetails,
      value: combination.originalTotalPotentialReturns,
    });
    previousOdds = combination.originalDisplayOdds;
  }

  const formattedTotalStake = currencyFormatWithDecimalPlaces({
    ...userDetails,
    value: totalStake,
  });
  const { title, subtitle, icon, meetingCountry, silkFallbackType, racingSport, trap } = buildSelection(
    metadata,
    userDetails,
    runnerRelations,
  );

  const eachWaySubtitle = hasEachWay
    ? i18n({
        key: "I18N.BETSLIP.EACHWAY_ODDS_PLACES",
        interpolationValues: {
          numerator: eachWayPlacesFraction?.numerator || "",
          denominator: eachWayPlacesFraction?.denominator || "",
          places: eachWayPlaces || "",
        },
      })
    : "";

  const { isOddsboostMarketType, marketType } = metadata;

  let eventId;
  if (metadata.type === "RACING") {
    const { racing } = metadata;
    eventId = codecs.fixture.decode(racing.urn);
  } else {
    const { eventUrn } = metadata;
    eventId = codecs.fixture.decode(eventUrn);
  }

  const SportIdEventTypeMapper = createSportIdEventTypeMapper(isHRThrottleActive);

  const isPushNotificationsSupported = !!SportIdEventTypeMapper[metadata.sportId];

  const isPushNotificationsUnavailable =
    (!eventId || unsupportedEventIds.includes(eventId)) && isPushNotificationsSupported;

  const freeBetsLabel =
    !isFreeBetsWalletsActive && isFreeBetsSelected
      ? buildSportsbookFreeBetsLabel(totalBonusUsed, userDetails, "I18N.BETSLIP.USED_BONUS")
      : undefined;

  const { message: generosityAlertMessage, icon: generosityIconName } = getGenerosityReceiptAlertData({
    combination,
    userDetails,
    isFreeBetsWalletsActive,
  });

  const buildSegmentsIcon = () => {
    if (!isOddsboostMarketType) {
      return undefined;
    }

    switch (marketType) {
      case "SUPER_BOOST":
      case "SBG_-_SUPER_BOOST":
        return BetSegmentsIcons.SUPER_BOOST;
      case "SBG_-_DOUBLE_UP_BOOST":
        return BetSegmentsIcons.DOUBLE_UP_BOOST;
      default:
        return BetSegmentsIcons.ODDSBOOST;
    }
  };

  return {
    title,
    subtitle,
    icon,
    meetingCountry,
    trap,
    silkIconAlt: "",
    silkFallbackIconType: silkFallbackType,
    racingSport,
    odds: buildOdds(displayOdds, preferences.sportsbookOddsDisplay),
    previousOdds: previousOdds ? formatOdds(previousOdds, preferences.sportsbookOddsDisplay) : undefined,
    stake: formattedTotalStake,
    profitOrLiability: buildPotentialReturns(totalStake, totalPotentialReturns, userDetails),
    previousProfitOrLiability,
    segmentsIcon: buildSegmentsIcon(),
    boostedInfo: isOddsboostMarketType ? getBoostedInfo(marketType) : undefined,
    hasBonusUsed: hasBonusUsed && !isFreeBetsWalletsActive,
    freeBetsLabel,
    generosityAlertMessage,
    generosityIconName,
    hasEachWay,
    eachWaySubtitle,
    hasMyOddsBoost: combination.isPriceBoosted,
    isPriceBoosted: !!isOddsboostMarketType,
    isGuaranteedPriceSelected,
    is90Min: metadata.is90Min,
    selectionTypeIcon: isSelectionTypeIconEnabled
      ? getSelectionTypeIcon(metadata.marketType, metadata.isSuperSub)
      : undefined,
    betReceiptId,
    regulatorId,
    isPushNotificationsUnavailable,
  };
};

export const createSinglesBuilder = () => {
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getUnsupportedEventIds = createGetUnsupportedEventIdsSelector();
  const getThrottle = createGetThrottleSelector();
  const isBrandSettingEnabled = createIsBrandSettingEnabledSelector();

  return createSelector(
    [
      getSportsbookReport,
      (state: ApplicationState) => getUserPreferencesWithProductSwitcher(state.entities.preferences),
      getUserDetailsSelector,
      (state: ApplicationState) => getUnsupportedEventIds(state.notifications),
      (state: ApplicationState) => getThrottle(state.entities.throttles, "HR_PUSH_NOTIFICATIONS_SUPPORT")?.isActive,
      (state: ApplicationState) => !!state.betslip?.hasGenerosityWallets,
      (state: ApplicationState) => isBrandSettingEnabled(state, "SHOW_SELECTION_TYPE_ICON"),
    ],
    (
      report,
      preferences,
      userDetails,
      unsupportedEventIds,
      isHRThrottleActive,
      hasGenerosityWallets,
      isSelectionTypeIconEnabled,
    ) => {
      if (!report) {
        return [];
      }

      const { metadata, result, isFreeBetsSelected } = report;
      const { combinations, legs, relations } = result;
      const placedSingles = Object.values(combinations).filter((combination) => isSingle(combination, legs));

      return placedSingles.map((combination) => {
        const [legId] = combination.legs;
        const { runners: legRunners } = legs[legId];
        const [runnerId] = legRunners;
        const runnerRelations = relations.legsRunners[legId][runnerId] as SportsbookBettingRunnerData;

        return buildSingle(
          combination,
          legs[legId],
          metadata[runnerId],
          runnerRelations,
          preferences,
          <UserDetails>userDetails,
          unsupportedEventIds,
          !!isHRThrottleActive,
          isFreeBetsSelected,
          hasGenerosityWallets,
          isSelectionTypeIconEnabled,
        );
      });
    },
  );
};

export const buildBetBuilder = (
  entities: Entities,
  combination: PlaceResult.PlacedCombination,
  metadata: RunnersMetadata,
  legs: PlaceResult.PlacedLegsMap,
  preferences: UserPreferences,
  userDetails: UserDetails,
  unsupportedEventIds: string[],
  isHRThrottleActive: boolean,
  isFreeBetsSelected: boolean,
  isFreeBetsWalletsActive: boolean,
  isSelectionTypeIconEnabled: boolean,
): SportsbookReceiptPanelBetBuilder => {
  const getSportEventByURN = createSportEventByURNSelector();
  const getRaceByURN = createRaceByURNSelector();

  let title = "";
  let isPushNotificationsUnavailable = false;

  const {
    betReceiptId,
    betType,
    displayOdds,
    hasBonusUsed,
    isPriceBoosted,
    legs: combinationLegs,
    originalDisplayOdds,
    originalTotalPotentialReturns,
    regulatorId,
    totalBonusUsed,
    totalPotentialReturns,
    totalStake,
  } = combination;

  const selections: BetSelection[] = Object.values(combinationLegs).map((legURN) => {
    const { id, runners } = legs[legURN];
    const runnerID = runners[0]; // any runner works
    const runner = metadata[runnerID];
    title = runner.type === "GENERIC" ? runner.eventName : runner.racing.venue;
    const { title: selectionTitle, subtitle } = buildSelection(runner, userDetails);

    const isRacingType = runner.type === "RACING";
    const eventId = isRacingType
      ? getRaceByURN(entities.races, runner.racing.urn)?.raceId
      : getSportEventByURN(entities.sportevents, runner.eventUrn)?.eventId?.toString();

    const SportIdEventTypeMapper = createSportIdEventTypeMapper(isHRThrottleActive);

    const isPushNotificationsSupported = !!SportIdEventTypeMapper[metadata[runnerID].sportId];

    isPushNotificationsUnavailable =
      (!eventId || unsupportedEventIds.includes(eventId)) && isPushNotificationsSupported;

    return {
      urn: runner.runnerUrn,
      id,
      title: selectionTitle,
      subtitle,
      is90Min: runner.is90Min,
      selectionTypeIcon: isSelectionTypeIconEnabled
        ? getSelectionTypeIcon(runner.marketType, runner.isSuperSub)
        : undefined,
    };
  });

  const key = `I18N.BETSLIP.SBK.MULTIPLE.${betType}_LINES` as keyof TranslationKey;
  let previousValue: string | undefined;
  let previousOdds: string | undefined;

  if (isPriceBoosted && originalTotalPotentialReturns && originalDisplayOdds) {
    previousValue = buildOriginalPotentialReturns(totalStake, originalTotalPotentialReturns, userDetails);
    previousOdds = formatOdds(originalDisplayOdds, preferences.sportsbookOddsDisplay);
  }

  const freeBetsLabel =
    !isFreeBetsWalletsActive && isFreeBetsSelected
      ? buildSportsbookFreeBetsLabel(totalBonusUsed, userDetails, "I18N.BETSLIP.USED_BONUS")
      : undefined;

  const { message: generosityAlertMessage, icon: generosityIconName } = getGenerosityReceiptAlertData({
    combination,
    userDetails,
    isFreeBetsWalletsActive,
  });

  return {
    id: betReceiptId,
    title,
    type: i18n({ key }),
    odds: buildOdds(displayOdds, preferences.sportsbookOddsDisplay),
    previousValue,
    previousOdds,
    returns: buildPotentialReturns(totalStake, totalPotentialReturns, userDetails),
    hasMyOddsBoost: isPriceBoosted,
    hasBonusUsed: hasBonusUsed && !isFreeBetsWalletsActive,
    freeBetsLabel,
    generosityAlertMessage,
    generosityIconName,
    stake: currencyFormatWithDecimalPlaces({
      ...userDetails,
      value: totalStake,
    }),
    selectionsLabel: i18n({
      key: "I18N.BETSLIP.SELECTIONS_COUNT",
      interpolationValues: { numberOfSelections: selections.length },
    }),
    selections,
    betReceiptId,
    regulatorId,
    isPushNotificationsUnavailable,
  };
};

export const createBetBuildersBuilder = () => {
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getUnsupportedEventIds = createGetUnsupportedEventIdsSelector();
  const getThrottle = createGetThrottleSelector();
  const isBrandSettingEnabled = createIsBrandSettingEnabledSelector();

  return createSelector(
    [
      getSportsbookReport,
      (state: ApplicationState) => getUserPreferencesWithProductSwitcher(state.entities.preferences),
      getUserDetailsSelector,
      (state: ApplicationState) => getUnsupportedEventIds(state.notifications),
      (state: ApplicationState) => state.entities,
      (state: ApplicationState) => getThrottle(state.entities.throttles, "HR_PUSH_NOTIFICATIONS_SUPPORT")?.isActive,
      (state: ApplicationState) => !!state.betslip?.hasGenerosityWallets,
      (state: ApplicationState) => isBrandSettingEnabled(state, "SHOW_SELECTION_TYPE_ICON"),
    ],
    (
      report,
      preferences,
      userDetails,
      unsupportedEventIds,
      entities,
      isHRThrottleActive,
      hasGenerosityWallets,
      isSelectionTypeIconEnabled,
    ) => {
      if (!report) {
        return [];
      }

      const {
        metadata,
        result: { combinations, legs },
        isFreeBetsSelected,
      } = report;

      return Object.values(combinations)
        .filter((combination) => isBetBuilder(combination))
        .map((combination) =>
          buildBetBuilder(
            entities,
            combination,
            metadata,
            legs,
            preferences,
            <UserDetails>userDetails,
            unsupportedEventIds,
            !!isHRThrottleActive,
            isFreeBetsSelected,
            hasGenerosityWallets,
            isSelectionTypeIconEnabled,
          ),
        );
    },
  );
};

export const buildMultiBetBuilder = (
  combination: PlaceResult.PlacedCombination,
  preferences: UserPreferences,
  userDetails: UserDetails,
  isFreeBetsWalletsActive: boolean,
): SportsbookReceiptPanelMultiBetBuilder => {
  const {
    betReceiptId,
    betType,
    displayOdds,
    hasBonusUsed,
    isPriceBoosted,
    originalDisplayOdds,
    originalTotalPotentialReturns,
    regulatorId,
    totalBonusUsed,
    totalPotentialReturns,
    totalStake,
  } = combination;

  const key = `I18N.BETSLIP.SBK.MULTIPLE.${betType}_LINES` as keyof TranslationKey;
  let previousValue: string | undefined;
  let previousOdds: string | undefined;

  if (isPriceBoosted && originalTotalPotentialReturns && originalDisplayOdds) {
    previousValue = buildOriginalPotentialReturns(totalStake, originalTotalPotentialReturns, userDetails);
    previousOdds = formatOdds(originalDisplayOdds, preferences.sportsbookOddsDisplay);
  }

  const freeBetsLabel =
    !isFreeBetsWalletsActive && hasBonusUsed
      ? buildSportsbookFreeBetsLabel(totalBonusUsed, userDetails, "I18N.BETSLIP.USED_BONUS")
      : undefined;

  const { message: generosityAlertMessage, icon: generosityIconName } = getGenerosityReceiptAlertData({
    combination,
    userDetails,
    isFreeBetsWalletsActive,
  });

  return {
    title: i18n({ key }),
    odds: buildOdds(displayOdds, preferences.sportsbookOddsDisplay),
    previousOdds,
    previousValue,
    returns: buildPotentialReturns(totalStake, totalPotentialReturns, userDetails),
    stake: currencyFormatWithDecimalPlaces({
      ...userDetails,
      value: totalStake,
    }),
    hasBonusUsed: hasBonusUsed && !isFreeBetsWalletsActive,
    freeBetsLabel,
    generosityAlertMessage,
    generosityIconName,
    betReceiptId,
    regulatorId,
    hasMyOddsBoost: isPriceBoosted,
  };
};

export const createMultiBetBuilder = () => {
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();

  return createSelector(
    [
      getSportsbookReport,
      (state: ApplicationState) => getUserPreferencesWithProductSwitcher(state.entities.preferences),
      getUserDetailsSelector,
      (state: ApplicationState) => !!state.betslip?.hasGenerosityWallets,
    ],
    (report, preferences, userDetails, hasGenerosityWallets) => {
      if (!report) {
        return undefined;
      }

      const multiBetBuilder = Object.values(report.result.combinations).find((combination) =>
        isMultiBetBuilder(combination),
      );

      if (!multiBetBuilder) {
        return undefined;
      }

      return buildMultiBetBuilder(multiBetBuilder, preferences, <UserDetails>userDetails, hasGenerosityWallets);
    },
  );
};

const buildMultiBetBuilderGroups = (
  combination: PlaceResult.PlacedCombination,
  report: BetslipSportsbookReport,
  userDetails: UserDetails,
  isSelectionTypeIconEnabled: boolean,
): SportsbookReceiptPanelProps["multiBetBuilderGroups"] => {
  const {
    result: { legs },
    metadata,
  } = report;

  return combination.legs.reduce((finalEventGroupMap: SportsbookReceiptPanelMultiBetBuilderGroups, legId: string) => {
    const currentLeg = legs[legId];
    const [anyRunnerId] = currentLeg.runners;
    const runnerMetadata = metadata[anyRunnerId];

    const { groupUrn, groupTitle } = buildMultiBetBuilderGroup(runnerMetadata, userDetails);
    const currentEventGroup = finalEventGroupMap[groupUrn] || { selections: [] };
    const { title, subtitle, icon, racingSport, meetingCountry, trap, silkFallbackType } = buildSelection(
      runnerMetadata,
      <UserDetails>userDetails,
    );
    const selection = {
      id: legId,
      title,
      subtitle,
      is90Min: runnerMetadata.is90Min,
      selectionTypeIcon: isSelectionTypeIconEnabled
        ? getSelectionTypeIcon(runnerMetadata.marketType, runnerMetadata.isSuperSub)
        : undefined,
      icon,
      racingSport,
      meetingCountry,
      trap,
      silkFallbackType,
    };

    return {
      ...finalEventGroupMap,
      [groupUrn]: {
        urn: groupUrn,
        title: groupTitle,
        selections: [...currentEventGroup.selections, selection],
      },
    };
  }, {});
};

export const createMultiBetBuilderGroups = () => {
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const isBrandSettingEnabled = createIsBrandSettingEnabledSelector();

  return createSelector(
    [
      getSportsbookReport,
      getUserDetailsSelector,
      (state: ApplicationState) => isBrandSettingEnabled(state, "SHOW_SELECTION_TYPE_ICON"),
    ],
    (report, userDetails, isSelectionTypeIconEnabled): SportsbookReceiptPanelProps["multiBetBuilderGroups"] => {
      if (!report) {
        return undefined;
      }

      const multiBetBuilder = Object.values(report.result.combinations).find((combination) =>
        isMultiBetBuilder(combination),
      );

      if (!multiBetBuilder) {
        return undefined;
      }

      return buildMultiBetBuilderGroups(multiBetBuilder, report, <UserDetails>userDetails, isSelectionTypeIconEnabled);
    },
  );
};

export const createBoostedMultiplesBuilder = () => {
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();

  return createSelector(
    [
      getSportsbookReport,
      (state: ApplicationState) => getUserPreferencesWithProductSwitcher(state.entities.preferences),
      (state: ApplicationState): UserDetailsState => getUserDetailsSelector(state),
      (state: ApplicationState) => !!state.betslip?.hasGenerosityWallets,
    ],
    (report, preferences, userDetails, hasGenerosityWallets) => {
      if (!report) {
        return [];
      }

      const { isFreeBetsSelected } = report;

      return Object.values(report.result.combinations)
        .filter((combination) => isBoostedMultiple(combination))
        .sort((combinationA, combinationB) => combinationA.lines - combinationB.lines)
        .map<SportsbookReceiptPanelProps["boostedMultiples"][0]>((combination) => {
          const combinationVm = buildMultiple(
            combination,
            preferences,
            <UserDetails>userDetails,
            isFreeBetsSelected,
            hasGenerosityWallets,
          );
          const legs = combination.legs.map((legId) => report.result.legs[legId]);
          const selections = legs.map((leg) => mapBoostedLeg(leg, report, userDetails, preferences));

          return {
            ...combinationVm,
            id: combination.id,
            selections,
          };
        });
    },
  );
};
