import { createSelector, OutputParametricSelector } from "reselect";
import i18n from "i18next";
import { ApplicationState, BetLeg, Entities, Fixture, LegPart, UserPreferences } from "@ppb/tbd-store";
import { Result, ObbLegTemplateIds } from "@ppb/tbd-store/state/constants";
import {
  ExpressionComponents,
  ExpressionMetadata,
  ObbPlayerVsPlayerParams,
  ObbSquadBetParams,
  ObbSquadVsSquadBetParams,
  OutcomeDefinitionExp,
  SportsbookRunnerPriceType,
} from "@ppb/tbd-store/state";
import { createIsBrandSettingEnabledSelector } from "@ppb/tbd-store/state/entities/brand-settings/brand-settings-selectors";
import { createFixtureBySportEventURNSelector } from "@ppb/tbd-store/state/entities/entities-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { createRaceByURNSelector } from "@ppb/tbd-store/state/entities/races/race-selectors";
import { createMeetingByURNSelector } from "@ppb/tbd-store/state/entities/meetings/meeting-selectors";
import { NavigationLink } from "@ppb/tbd-store/state/layout/cards/Card.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import {
  BetSelectionDetailsCommonProps,
  StatusLabelProps,
  StatusLabelSizeType,
  StatusLabelType,
} from "@ppb/the-wall-common/types";
import { ValueIconName } from "@ppb/the-wall-icons";
import { Quantifier } from "@ppb/tbd-store/state/betting/obb-betting/ObbBetting.types";

import { formatRunnerName } from "../formatters/runner-formatters";
import {
  formatObbParticipants,
  formatOddsByPriceType,
  getExpressionInfo,
  getLegsSelectionsName,
  getObbSquadBetSupportingText,
  getPlayerNameFromMetadata,
  isForecastLegType,
} from "../helpers/my-bets";
import { getSelectionTypeIcon } from "../helpers/selection-type";

type ResultToStatusLabelMap = { [key in Result]?: Omit<StatusLabelProps, "statusLabelSize"> };

const getMapResultToStatusLabel = (): ResultToStatusLabelMap => ({
  [Result.WON]: {
    statusLabelType: StatusLabelType.WON,
    text: i18n.t("I18N.MY_BETS.RESULT.WON"),
  },
  [Result.LOST]: {
    statusLabelType: StatusLabelType.LOST,
    text: i18n.t("I18N.MY_BETS.RESULT.LOST"),
  },
  [Result.VOID]: {
    statusLabelType: StatusLabelType.NEUTRAL,
    text: i18n.t("I18N.MY_BETS.RESULT.VOID"),
  },
  [Result.PLACED]: {
    statusLabelType: StatusLabelType.WON,
    text: i18n.t("I18N.MY_BETS.RESULT.PLACED"),
  },
  [Result.FROZEN]: {
    statusLabelType: StatusLabelType.BRANDED,
    text: i18n.t("I18N.MY_BETS.BET_LEG.FROZEN_LABEL"),
    iconName: ValueIconName.ACCA_FREEZE,
  },
});

export type BetLegPart = {
  fixtureURN?: URN;
  fixtureTypename?: string;
  participantId?: string;
  previousTitle: BetSelectionDetailsCommonProps["previousTitle"];
  title: BetSelectionDetailsCommonProps["title"];
  subtitle: BetSelectionDetailsCommonProps["subtitle"];
  selectionTypeIcon?: BetSelectionDetailsCommonProps["selectionTypeIcon"];
  tertiaryTitle?: BetSelectionDetailsCommonProps["tertiaryTitle"];
  statusLabel: BetSelectionDetailsCommonProps["statusLabel"];
  racingLabel: BetSelectionDetailsCommonProps["racingLabel"];
  odd: BetSelectionDetailsCommonProps["odd"];
  previousOdd: BetSelectionDetailsCommonProps["previousOdd"];
  navigationViewLink: BetSelectionDetailsCommonProps["navigationViewLink"];
  is90Min: BetSelectionDetailsCommonProps["is90Min"];
  isSuperSub: LegPart["isSuperSub"];
  eventUrn: LegPart["eventUrn"];
  outcomeDefinitionExp: LegPart["outcomeDefinitionExp"];
  sportId: LegPart["sportId"];
  silkUrl: LegPart["silkUrl"];
  trap: number | undefined;
  meetingCountry: string | undefined;
  betLegPartType?: string;
  isLotteries?: boolean;
  expressionComponents?: LegPart["expressionComponents"];
  expressionMetadata?: LegPart["expressionMetadata"];
  result?: Result;
};

const getSubPlayerName = (fixture: Fixture, participantId: string): string | undefined => {
  if (fixture && "players" in fixture) {
    const player = fixture.players?.find(({ id }): boolean => id === participantId);
    const lastSub = player?.substitutions?.at(-1);

    return lastSub?.player.name;
  }

  return undefined;
};

const buildStatusLabel = (
  result: Result | undefined,
  statusLabelSize: StatusLabelSizeType = StatusLabelSizeType.SMALL,
): StatusLabelProps | undefined => {
  const statusLabelPartial = result ? getMapResultToStatusLabel()[result] : undefined;
  return statusLabelPartial
    ? {
        ...statusLabelPartial,
        statusLabelSize,
      }
    : undefined;
};

const buildObbLegPart = (
  templateId: string,
  templateParams: ObbPlayerVsPlayerParams | ObbSquadBetParams | ObbSquadVsSquadBetParams,
  metadata: ExpressionMetadata | null,
  selectionName: string,
  navigationLinks: NavigationLink,
  marketBetUrn: string,
  eventUrn: string | undefined,
  outcomeDefinitionExp: OutcomeDefinitionExp | undefined,
  isSuperSub: boolean,
  silkUrl: string | undefined,
  trap: number | undefined,
  meetingCountry: string | undefined,
  expressionComponents?: ExpressionComponents | undefined,
  expressionMetadata?: ExpressionMetadata | undefined,
  betLegPartType?: string,
  expressionResult?: Result,
  betResult?: Result,
): BetLegPart => {
  let title: string | null;
  let subtitle: string | undefined;

  switch (templateId) {
    case ObbLegTemplateIds.PLAYER_VS_PLAYER: {
      const { participantIdA, participantIdB, outcomeId, timePeriodId } = templateParams as ObbPlayerVsPlayerParams;

      const playerName = getPlayerNameFromMetadata(metadata, participantIdB);

      title = getPlayerNameFromMetadata(metadata, participantIdA);

      if (!title) {
        subtitle = selectionName;
      } else {
        subtitle = i18n.t("I18N.OBB.DESCRIPTION.BETSLIP.PVP", {
          incidentType: outcomeId,
          operator: "MORE",
          playerName,
          period: timePeriodId,
          count: 2, // to force plural translation
        });
      }
      break;
    }
    case ObbLegTemplateIds.PARTICIPANTS_COMBINED: {
      const { outcomeIds, value } = templateParams as ObbSquadBetParams;

      title = getObbSquadBetSupportingText(metadata, templateParams as ObbSquadBetParams);

      if (!title) {
        subtitle = selectionName;
      } else {
        subtitle = `${value}+ ${i18n.t("I18N.OBB.DESCRIPTION.BETSLIP.SQUADBET", {
          incidentType: outcomeIds[0],
          count: 2, // to force plural translation
        })}`;
      }
      break;
    }
    case ObbLegTemplateIds.SQUAD_VS_SQUAD: {
      const { squadAParticipantIds, squadBParticipantIds, quantifier, outcomeIds } =
        templateParams as ObbSquadVsSquadBetParams;

      const squadAParticipantsDescription = formatObbParticipants(metadata, squadAParticipantIds);

      const squadBParticipantsDescription = formatObbParticipants(metadata, squadBParticipantIds);

      const isGreater = quantifier === Quantifier.GREATER_THAN;
      const selectedSquadDescription = isGreater ? squadAParticipantsDescription : squadBParticipantsDescription;
      const opposingSquadDescription = isGreater ? squadBParticipantsDescription : squadAParticipantsDescription;

      const formattedSelectionName = selectionName.replace(/, ([^,]*)$/, " & $1");

      title = selectedSquadDescription;

      if (!title) {
        subtitle = formattedSelectionName;
      } else {
        subtitle = i18n.t("I18N.OBB.DESCRIPTION.BETSLIP.SQUADVSSQUAD", {
          incidentType: outcomeIds[0] ?? "",
          operator: Quantifier.GREATER_THAN,
          playersName: opposingSquadDescription,
          count: 2, // to force plural translation
        });
      }
      break;
    }
    default:
      title = null;
      break;
  }

  // If a multiple is voided, we do not show status label regardless of the OBB result
  const statusLabel =
    betLegPartType === "xOfN" && betResult === Result.VOID
      ? undefined
      : buildStatusLabel(expressionResult, StatusLabelSizeType.SMALL);

  const result = betResult === Result.VOID ? betResult : expressionResult;

  return {
    previousTitle: undefined,
    title: title || "",
    subtitle,
    is90Min: false,
    odd: undefined,
    previousOdd: undefined,
    statusLabel,
    racingLabel: undefined,
    navigationViewLink: navigationLinks?.[marketBetUrn],
    eventUrn,
    sportId: undefined,
    outcomeDefinitionExp,
    isSuperSub,
    silkUrl,
    trap,
    meetingCountry,
    expressionComponents,
    expressionMetadata,
    betLegPartType,
    result,
  };
};

export const createBuildBetLegPartsVM = (
  navigationLinks: NavigationLink,
  isSGM: boolean,
  isSGMMulti: boolean,
  isOddsBoosted: boolean,
  isLotteries = false,
  betResult?: Result,
): OutputParametricSelector<
  ApplicationState,
  BetLeg[],
  BetLegPart[],
  (
    entities: Entities,
    preferences: UserPreferences,
    legs: BetLeg[],
    isSelectionTypeIconEnabled: boolean,
  ) => BetLegPart[]
> => {
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();
  const isBrandSettingEnabled = createIsBrandSettingEnabledSelector();
  const getFixtureBySportEventURN = createFixtureBySportEventURNSelector();
  const getRaceByURN = createRaceByURNSelector();
  const getMeetingByURN = createMeetingByURNSelector();

  return createSelector(
    [
      (state: ApplicationState) => state.entities,
      (state: ApplicationState) => getUserPreferencesWithProductSwitcher(state.entities.preferences),
      (_: ApplicationState, legs: BetLeg[]) => legs,
      (state: ApplicationState) => isBrandSettingEnabled(state, "SHOW_SELECTION_TYPE_ICON"),
    ],
    (entities, { sportsbookOddsDisplay }, legs, isSelectionTypeIconEnabled) =>
      legs
        .map((leg): BetLegPart[] => {
          const {
            parts: [
              {
                marketBetUrn = "",
                eventUrn,
                sportId,
                eventMarketDescription,
                selectionName,
                originalPrice,
                price,
                priceType,
                handicap,
                eachwayFactor,
                eachwayPlaces,
                rule4Deductions,
                marketType,
                outcomeDefinitionExp,
                participants,
                isSuperSub,
                silkUrl,
                raceRunnerKindUrn,
              },
            ],
            result,
            type,
            outcomeBasedDetails,
          } = leg;

          let statusLabel: StatusLabelProps | undefined;

          const isTrapThrottleActive = entities.throttles.SHOW_TRAP_ICON?.isActive;
          const raceKindRunner =
            isTrapThrottleActive && raceRunnerKindUrn ? entities.greyhoundracerunners[raceRunnerKindUrn] : undefined;
          const race = raceKindRunner && getRaceByURN(entities.races, raceKindRunner.raceURN);
          const meeting = race && getMeetingByURN(entities.meetings, race.meeting);
          const meetingCountry = meeting?.country;
          const trap = raceKindRunner?.trap;
          const odd = formatOddsByPriceType(price, priceType, sportsbookOddsDisplay, isOddsBoosted, true);

          if (outcomeBasedDetails) {
            const legParts: BetLegPart[] = [];

            const template = outcomeBasedDetails?.expressionInfo;

            if (!template) return legParts;

            const {
              templateId,
              params,
              metadata,
              result: expressionResult,
              subExpressionInfos,
            } = getExpressionInfo(template);
            let expressionComponents = outcomeBasedDetails?.expressionInfo.expressionComponents || undefined;
            let expressionMetadata = outcomeBasedDetails?.expressionInfo.expressionMetadata || undefined;

            switch (templateId) {
              case ObbLegTemplateIds.PLAYER_VS_PLAYER:
              case ObbLegTemplateIds.PARTICIPANTS_COMBINED:
              case ObbLegTemplateIds.SQUAD_VS_SQUAD:
                legParts.push(
                  buildObbLegPart(
                    templateId,
                    params as ObbPlayerVsPlayerParams,
                    metadata,
                    selectionName,
                    navigationLinks,
                    marketBetUrn,
                    eventUrn,
                    outcomeDefinitionExp,
                    isSuperSub,
                    silkUrl,
                    trap,
                    meetingCountry,
                    expressionComponents,
                    expressionMetadata,
                    templateId,
                    expressionResult,
                    betResult,
                  ),
                );
                break;
              case ObbLegTemplateIds.X_OF_N: {
                subExpressionInfos?.forEach((subTemplate) => {
                  const {
                    templateId: subTemplateId,
                    params: subParams,
                    metadata: subMetadata,
                    result: subExpressionResult,
                  } = getExpressionInfo(subTemplate);

                  expressionComponents =
                    "expressionComponents" in subTemplate ? subTemplate.expressionComponents || undefined : undefined;

                  expressionMetadata =
                    "expressionMetadata" in subTemplate ? subTemplate.expressionMetadata || undefined : undefined;

                  legParts.push(
                    buildObbLegPart(
                      subTemplateId,
                      subParams as ObbPlayerVsPlayerParams,
                      subMetadata,
                      selectionName,
                      navigationLinks,
                      marketBetUrn,
                      eventUrn,
                      outcomeDefinitionExp,
                      isSuperSub,
                      silkUrl,
                      trap,
                      meetingCountry,
                      expressionComponents,
                      expressionMetadata,
                      templateId as ObbLegTemplateIds,
                      subExpressionResult,
                      betResult,
                    ),
                  );
                });
                break;
              }
              default:
                break;
            }

            return legParts;
          }

          if (result) {
            statusLabel = buildStatusLabel(result, StatusLabelSizeType.SMALL);
          }

          const tertiaryTitleParts = [];

          if (eachwayFactor && eachwayPlaces) {
            tertiaryTitleParts.push(
              i18n.t("I18N.LABELS.EW_TERMS", {
                numerator: eachwayFactor.numerator,
                denominator: eachwayFactor.denominator,
                places: eachwayPlaces,
              }),
            );
          }

          if (rule4Deductions) {
            tertiaryTitleParts.push(i18n.t("I18N.MYBETS.RULE4", { rule4percentage: `${rule4Deductions}%` }));
          }

          const isForecast = isForecastLegType(type);
          const title = isForecast ? getLegsSelectionsName([leg])[0] : formatRunnerName(selectionName, handicap, false);
          let subtitle = isForecast ? i18n.t(`I18N.BETSLIP.SBK.CAST.${type}`) : eventMarketDescription;

          const participantId = participants?.[0]?.participantId;
          const fixture = eventUrn ? getFixtureBySportEventURN(entities, eventUrn) : undefined;
          let subPlayerName;

          if (isSuperSub) {
            subtitle = subtitle && i18n.t("I18N.MYBETS.SUPER_SUB.BET_LEG", { betLegDescription: subtitle });
            subPlayerName = participantId && getSubPlayerName(fixture, participantId);
          }

          return [
            {
              fixtureURN: fixture?.urn,
              fixtureTypename: fixture?.typename,
              participantId,
              previousTitle: subPlayerName ? title : undefined,
              title: subPlayerName ?? title,
              subtitle,
              selectionTypeIcon: isSelectionTypeIconEnabled ? getSelectionTypeIcon(marketType, isSuperSub) : undefined,
              is90Min: marketType === "MATCH_ODDS_90",
              isLotteries,
              odd: isSGM || isSGMMulti ? "" : odd,
              previousOdd:
                price?.decimal !== originalPrice?.decimal && !isLotteries
                  ? formatOddsByPriceType(originalPrice, priceType, sportsbookOddsDisplay)
                  : undefined,
              statusLabel,
              racingLabel:
                priceType === SportsbookRunnerPriceType.Guaranteed
                  ? i18n.t("I18N.LABELS.BEST_ODDS_GUARANTEED_REDUCED")
                  : undefined,
              ...(tertiaryTitleParts.length && {
                tertiaryTitle: tertiaryTitleParts.join(" | "),
              }),
              navigationViewLink: navigationLinks?.[marketBetUrn],
              eventUrn,
              sportId,
              outcomeDefinitionExp,
              isSuperSub,
              silkUrl,
              trap,
              meetingCountry,
              result: leg.result,
            },
          ];
        })
        .flat(),
  );
};
