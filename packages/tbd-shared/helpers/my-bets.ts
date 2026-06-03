import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import {
  BetEdgeEnum,
  BetLeg,
  BetProduct,
  ExpressionInfo,
  ExpressionMetadata,
  LegPart,
  ObbPlayerVsPlayerParams,
  ObbSquadBetParams,
  ObbSquadVsSquadBetParams,
  ObbTemplateParams,
  SportsbookBet,
} from "@ppb/tbd-store/state/betting/sportsbook-bets/SportsbookBet.types";
import { LegType, Result, BetType, ObbLegTemplateIds } from "@ppb/tbd-store/state/constants";
import { ResultType } from "@ppb/tbd-store/clients/blh/bet-live-hypotheticals-response-types";
import { SportsbookRunnerPriceType } from "@ppb/tbd-store/state/entities/sportsbook-runners/SportsbookRunner.types";
import { SportsbookOdds } from "@ppb/tbd-store/state/entities/SportsbookOdds.types";
import { OddsDisplayPreference } from "@ppb/tbd-store";
import { StatusLabelProps, StatusLabelType } from "@ppb/the-wall-common/types";
import { CategoryIcons } from "@ppb/the-wall-icons";
import { Quantifier } from "@ppb/tbd-store/state/betting/obb-betting/ObbBetting.types";

import { formatRunnerName } from "../formatters/runner-formatters";
import { TranslationKey } from "../translations/keys";
import { i18n } from "./i18n";
import { formatStartDateWithTodayOrTomorrow, isPast } from "./dates";

const FORECAST_LEG_TYPES = [LegType.SF, LegType.RF, LegType.CF, LegType.TC, LegType.CT];
const FORECAST_SELECTIONS_SEPARATOR = " / ";
const SELECTION_SEPARATOR = " | ";

export const isForecastLegType = (type: LegType): boolean => FORECAST_LEG_TYPES.includes(type);

export const isMultipleBetType = (betType: BetType): boolean => betType !== BetType.SGL;

export const isObbMultiple = (leg: BetLeg, product?: BetProduct): boolean =>
  product === BetProduct.OBB && leg.outcomeBasedDetails?.expressionInfo.templateId === "xOfN";

export const isStraightLineOrStraightLineEachWay = (numLines: number, isEachWay: boolean): boolean => {
  if (isEachWay) {
    return numLines === 2;
  }
  return numLines === 1;
};

export const isAccaInsuranceSelected = ({ betType, edges }: SportsbookBet): boolean =>
  isMultipleBetType(betType) && edges.some(({ reason }) => reason === BetEdgeEnum.ACCA_INSURANCE);

export const formatOddsByPriceType = (
  price: SportsbookOdds | null,
  priceType: string | undefined,
  sportsbookOddsDisplay: OddsDisplayPreference,
  isOddsBoosted = false,
  withAtLabel = false,
): string => {
  const isSPBet = priceType === SportsbookRunnerPriceType.Starting;

  if (!price && isSPBet) {
    return i18n({ key: "I18N.HORSE_RACING.SP" });
  }

  const formattedOdds = price ? formatOdds(price, sportsbookOddsDisplay, isOddsBoosted) : "";
  return withAtLabel && formattedOdds ? `@ ${formattedOdds}` : formattedOdds;
};

export const getExpressionInfo = (
  template: ExpressionInfo,
): {
  templateId: string;
  params: ObbTemplateParams | null;
  metadata: ExpressionMetadata | null;
  subExpressionInfos: ExpressionInfo[] | null;
  result?: Result;
} => {
  return {
    templateId: template.templateId,
    params: template.params,
    metadata: template.expressionMetadata,
    result: template.result,
    subExpressionInfos: template.subExpressionInfos,
  };
};

export const getBetTitle = (
  bet: SportsbookBet,
  legs: BetLeg[],
  sportsbookOddsDisplay: OddsDisplayPreference,
): string => {
  const { betType, isSGM, isSGMMulti, numLines, betPrice, isEachWay, product, isLotteries } = bet;

  let title = i18n({ key: `I18N.MY_BETS.SBK.MULTIPLE.${betType}_LINES` as keyof TranslationKey });
  let formattedPrice: string;

  const { outcomeBasedDetails } = legs[0];

  if (product === "OUTCOME_BASED_BETTING" && outcomeBasedDetails) {
    const { price, priceType } = legs[0].parts[0] as LegPart;

    const templateId = outcomeBasedDetails?.expressionInfo.templateId;
    formattedPrice = formatOddsByPriceType(price, priceType, sportsbookOddsDisplay);

    return `${i18n({ key: `I18N.MY_BETS.OBB.BETTYPE.${templateId}` as keyof TranslationKey })} @${formattedPrice}`;
  }

  if (isSGMMulti) {
    title = `${title} - ${i18n({ key: "I18N.BETSLIP.BET_BUILDER_MULTIS" })}`;
  } else if (isSGM) {
    title = `${title} - ${i18n({ key: "I18N.DESCRIPTION.BET_BUILDER" })}`;
  } else if (isLotteries) {
    title = i18n({ key: "I18N.MY_BETS.SBK.MULTIPLE.SINGLE_LINES" });
  }

  if (isAccaInsuranceSelected(bet)) {
    return title;
  }

  if (isEachWay) {
    title = `(${i18n({ key: "I18N.BETSLIP.EACHWAY" })}) ${title}`;
  }

  const isMultiple = isMultipleBetType(betType) && !isLotteries;
  const formattedOddsMultiple = isMultiple && betPrice ? formatOdds(betPrice, sportsbookOddsDisplay, isMultiple) : "";
  const firstLeg = legs[0];
  let formattedOdds: string;

  if (isLotteries) {
    formattedOdds = betPrice ? formatOdds(betPrice, sportsbookOddsDisplay, false) : "";
  } else if (isMultiple) {
    formattedOdds = formattedOddsMultiple;
  } else {
    formattedOdds = formatOddsByPriceType(
      firstLeg?.parts[0]?.price,
      firstLeg?.parts[0]?.priceType,
      sportsbookOddsDisplay,
    );
  }

  // We should show lines instead of Odds when:
  // - the bet is a forecast (US #823231)
  // - when number of lines is bigger than 1 for a multiple bet (US #809186)
  const showNumberOfLines = isForecastLegType(firstLeg?.type) || (numLines > 1 && isMultiple);
  formattedPrice = showNumberOfLines
    ? `${numLines} ${i18n({ key: "I18N.MY_BETS.SBK.MULTIPLE.LINES" })}`
    : formattedOdds;

  return formattedPrice ? `${title} @ ${formattedPrice}` : title;
};

export const getLegsSelectionsName = (legs: BetLeg[]): string[] =>
  legs.map(({ parts }) =>
    parts
      .map(({ handicap, selectionName }) => formatRunnerName(selectionName, handicap, false))
      .join(FORECAST_SELECTIONS_SEPARATOR),
  );

export const getPlayerNameFromMetadata = (metadata: ExpressionMetadata | null, participantId: string): string | null =>
  metadata?.participants?.find((participant) => participant.id === participantId)?.name || null;

export const formatObbParticipants = (metadata: ExpressionMetadata | null, participantIds: string[]): string =>
  participantIds
    .map((participantId) => getPlayerNameFromMetadata(metadata, participantId))
    .filter(Boolean)
    .join(", ")
    .replace(/, ([^,]*)$/, " & $1");

export const getObbSquadBetSupportingText = (
  metadata: ExpressionMetadata | null,
  templateParams: ObbSquadBetParams,
): string | null => formatObbParticipants(metadata, templateParams.participantIds);

export const getObbSquadVsSquadBetSupportingText = (
  metadata: ExpressionMetadata | null,
  templateParams: ObbSquadVsSquadBetParams,
): string | null => {
  const { squadAParticipantIds, squadBParticipantIds, quantifier, outcomeIds } = templateParams;

  const teamA = formatObbParticipants(metadata, squadAParticipantIds);
  const teamB = formatObbParticipants(metadata, squadBParticipantIds);

  const isGreater = quantifier === Quantifier.GREATER_THAN;

  const selectedSquadDescription = isGreater ? teamA : teamB;
  const opposingSquadDescription = isGreater ? teamB : teamA;

  const outcomeDescription = i18n({
    key: "I18N.OBB.DESCRIPTION.BETSLIP.SQUADVSSQUAD",
    interpolationValues: {
      incidentType: outcomeIds[0] ?? "",
      operator: Quantifier.GREATER_THAN,
      playersName: opposingSquadDescription,
      count: 2, // to force plural translation
    },
  });

  return `${selectedSquadDescription} ${outcomeDescription}`;
};

const getObbXOfNBetSupportingText = (subTemplate: ExpressionInfo[] | null): string | undefined => {
  if (!subTemplate || subTemplate.length === 0) {
    return undefined;
  }

  return (subTemplate as ExpressionInfo[])
    .reduce<string[]>((acc: string[], template) => {
      let betSupportingText;

      const { templateId, params, metadata } = getExpressionInfo(template);

      switch (templateId) {
        case ObbLegTemplateIds.PLAYER_VS_PLAYER:
          betSupportingText = getPlayerNameFromMetadata(metadata, (params as ObbPlayerVsPlayerParams).participantIdA);
          break;
        case ObbLegTemplateIds.PARTICIPANTS_COMBINED:
          betSupportingText = getObbSquadBetSupportingText(metadata, params as ObbSquadBetParams);
          break;
        case ObbLegTemplateIds.SQUAD_VS_SQUAD:
          betSupportingText = getObbSquadVsSquadBetSupportingText(metadata, params as ObbSquadVsSquadBetParams);
          break;
        default:
          break;
      }

      if (betSupportingText) {
        acc.push(betSupportingText);
      }

      return acc;
    }, [])
    .join(SELECTION_SEPARATOR);
};

export const getObbBetSubTitle = (leg: BetLeg | null): string | null => {
  if (leg?.outcomeBasedDetails?.expressionInfo) {
    if ("x" in leg.outcomeBasedDetails.expressionInfo.params) {
      return i18n({
        key: "I18N.BETSLIP.OBB.X_OF_N.SELECTIONS_TO_WIN",
        interpolationValues: {
          x: `${leg.outcomeBasedDetails.expressionInfo.params.x}`,
          n: `${leg.outcomeBasedDetails.expressionInfo.subExpressionInfos.length}`,
        },
      });
    }
  }

  return null;
};

export const getObbBetSupportingText = (legs: BetLeg[]): string =>
  legs
    .reduce<string[]>((acc, leg) => {
      if (!leg.outcomeBasedDetails) {
        return acc;
      }

      let betSupportingText;

      const template = leg.outcomeBasedDetails?.expressionInfo;

      if (!template) return acc;

      const { templateId, params, metadata, subExpressionInfos } = getExpressionInfo(template);

      switch (templateId) {
        case ObbLegTemplateIds.PLAYER_VS_PLAYER:
          betSupportingText = getPlayerNameFromMetadata(metadata, (params as ObbPlayerVsPlayerParams).participantIdA);
          break;
        case ObbLegTemplateIds.PARTICIPANTS_COMBINED:
          betSupportingText = getObbSquadBetSupportingText(metadata, params as ObbSquadBetParams);
          break;
        case ObbLegTemplateIds.SQUAD_VS_SQUAD:
          betSupportingText = getObbSquadVsSquadBetSupportingText(metadata, params as ObbSquadVsSquadBetParams);
          break;
        case ObbLegTemplateIds.X_OF_N:
          betSupportingText = getObbXOfNBetSupportingText(subExpressionInfos);
          break;
        default:
          break;
      }

      if (betSupportingText) {
        acc.push(betSupportingText);
      } else {
        const selectionsName = getLegsSelectionsName([leg]);
        if (selectionsName.length > 0) {
          acc.push(selectionsName[0]);
        }
      }

      return acc;
    }, [])
    .join(SELECTION_SEPARATOR);

export const getBetSupportingText = (legs: BetLeg[]): string => {
  if (legs.some((leg) => !!leg.outcomeBasedDetails)) {
    return getObbBetSupportingText(legs);
  }
  return getLegsSelectionsName(legs).join(SELECTION_SEPARATOR);
};

export const getBetSubTitle = (legs: BetLeg[]): string | null => {
  const obbBetLeg = legs.find((leg) => !!leg.outcomeBasedDetails);
  if (obbBetLeg) {
    return getObbBetSubTitle(obbBetLeg);
  }
  return null;
};

export type StatusLabel = {
  text?: StatusLabelProps["text"];
  icon?: CategoryIcons;
  type?: StatusLabelProps["statusLabelType"];
};

type GetBetStatusLabelOptions = {
  locale?: string;
  timezone?: string;
  showWinLoseVoidFeature?: boolean;
  isHeritageView?: boolean;
};

export const getBetStatusLabel = (
  {
    betType,
    result: betResult,
    resultType,
    lowestEventStartTime,
    isSettled,
    numLines,
    isEachWay,
    product,
  }: SportsbookBet,
  legs: BetLeg[],
  { locale, timezone, showWinLoseVoidFeature, isHeritageView }: GetBetStatusLabelOptions = {},
): StatusLabel | undefined => {
  const isCashedOutOrSettledResult = betResult === Result.CASHED_OUT || betResult === Result.SETTLED;
  let result =
    isCashedOutOrSettledResult ||
    isMultipleBetType(betType) ||
    isObbMultiple(legs[0], product) ||
    (resultType && resultType !== ResultType.CONFIRMED) ||
    isHeritageView
      ? betResult
      : legs[0].result;

  if (
    resultType !== ResultType.CONFIRMED &&
    (result === Result.LOSING || result === Result.LOST || result === Result.VOID)
  ) {
    let atLeastOneFrozenLeg = false;
    const unFrozenLostLegs = legs.filter(({ mutations, result: legResult }) => {
      const isFrozen = mutations?.details?.some((detail) => detail?.freezeDetails);

      if (isFrozen) {
        atLeastOneFrozenLeg = true;
        return false;
      }

      return legResult === Result.LOST || legResult === Result.LOSING || legResult === Result.VOID;
    });

    if (atLeastOneFrozenLeg && unFrozenLostLegs.length === 0) {
      result = result === Result.LOSING || result === Result.VOID ? Result.WINNING : result;
      result = result === Result.LOST ? Result.WON : result;
    }
  }

  switch (result) {
    case Result.WON:
      return {
        text: i18n({ key: "I18N.MY_BETS.RESULT.WON" }),
        type: StatusLabelType.WON,
      };
    case Result.LOST:
      return {
        text: i18n({ key: "I18N.MY_BETS.RESULT.LOST" }),
        type: StatusLabelType.LOST,
      };
    case Result.VOID:
      return {
        text: i18n({ key: "I18N.MY_BETS.RESULT.VOID" }),
        type: StatusLabelType.NEUTRAL,
      };
    case Result.PLACED:
      return {
        text: i18n({ key: "I18N.MY_BETS.RESULT.PLACED" }),
        type: StatusLabelType.WON,
      };
    case Result.CASHED_OUT:
      return {
        text: i18n({ key: "I18N.MY_BETS.RESULT.SBK.CASHED_OUT" }),
        type: StatusLabelType.BRANDED,
      };
    case Result.WINNING:
      return {
        text: i18n({ key: "I18N.MYBETS.WINNING" }),
        type: StatusLabelType.WON,
      };
    case Result.LOSING:
      return {
        text: i18n({ key: "I18N.MYBETS.LOSING" }),
        type: StatusLabelType.LOST,
      };
    case Result.SETTLED:
      // placed results come through as settled from BFF so need to check legs to see if placed status should be used
      if (
        isStraightLineOrStraightLineEachWay(numLines, isEachWay) &&
        legs.some((leg) => leg.result === Result.PLACED)
      ) {
        return {
          text: i18n({ key: "I18N.MY_BETS.RESULT.PLACED" }),
          type: StatusLabelType.WON,
        };
      }
      return undefined;
    default:
      if (showWinLoseVoidFeature && lowestEventStartTime && !(isHeritageView && isSettled)) {
        if (isPast(lowestEventStartTime)) {
          return {
            text: i18n({ key: "I18N.MYBETS.IN_PROGRESS" }),
            type: StatusLabelType.BRANDED,
          };
        }

        if (locale && timezone) {
          return {
            text: formatStartDateWithTodayOrTomorrow(lowestEventStartTime, locale, timezone),
            type: StatusLabelType.NEUTRAL,
          };
        }
      }

      return undefined;
  }
};

export const getPlacedReturns = (isSettled: boolean, value: number | undefined): string => {
  if (isSettled || !value) return "";

  if (value <= 2) {
    return i18n({ key: "I18N.MYBETS.PLACED_RETURNS" });
  } else {
    const separator = " - ";
    const toPlaces = value + i18n({ key: `I18N.MYBETS.PLACED_${value === 3 ? "THIRD" : "OTHER"}` });
    return i18n({ key: "I18N.MYBETS.PLACED_RETURNS", interpolationValues: { separator, toPlaces } });
  }
};
