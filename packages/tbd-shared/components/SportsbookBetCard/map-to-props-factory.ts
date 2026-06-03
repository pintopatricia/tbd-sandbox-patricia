import { MapStateToPropsFactory } from "react-redux";
import { createSelector } from "reselect";

import URN from "@ppb/tbd-store/state/layout/URN";
import {
  MY_BETS_SUBSCRIBE_CARD_UPDATES,
  MY_BETS_UNSUBSCRIBE_CARD_UPDATES,
  MyBetsAccaFreezeClosedAction,
  MyBetsAccaFreezeOpenedAction,
  MyBetsBetSharingPreviewTapAction,
  MyBetsHeritageInfoLabelClick,
  MyBetsSubscribeCardUpdatesAction,
  MyBetsUnsubscribeCardUpdatesAction,
  SUBSCRIBE_BET_MUTATION_ELIGIBILITY,
  SUBSCRIBE_BET_RESULT,
  SubscribeBetMutationEligibilityAction,
  SubscribeBetResultAction,
  UI__MY_BETS_ACCA_FREEZE_CLOSED,
  UI__MY_BETS_ACCA_FREEZE_OPENED,
  UI__MY_BETS_BET_SHARING_PREVIEW_TAP,
  UI__MY_BETS_HERITAGE_INFO_LABEL_CLICK,
  UNSUBSCRIBE_BET_MUTATION_ELIGIBILITY,
  UNSUBSCRIBE_BET_RESULT,
  UnsubscribeBetMutationEligibilityAction,
  UnsubscribeBetResultAction,
} from "@ppb/tbd-store/actions/my-bets";
import {
  EXTERNAL_PUSH,
  EXTERNAL_PUSH_BLANK,
  ExternalPushAction,
  ExternalPushBlankAction,
} from "@ppb/tbd-store/actions/router";
import { DELETE_VIEW, DeleteViewAction, FETCH_CATALOGUE, FetchCatalogueAction } from "@ppb/tbd-store/actions/catalogue";
import {
  createIsAccaFreezeEligibleSelector,
  createSportsbookBetSelector,
} from "@ppb/tbd-store/state/betting/sportsbook-bets/sportsbook-bets-selectors";
import {
  createAccaFreezeEligibleLegsSelector,
  createIsBetFrozenSelector,
  createSportsbookBetLegsSelector,
} from "@ppb/tbd-store/state/entities/sportsbook-bet-legs/sportsbook-bet-legs-selectors";
import { createIsSportsbookCashoutQuoteDisplayedSelector } from "@ppb/tbd-store/state/betting/sportsbook-cashouts/sportsbook-cashout-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { BetLeg, LegPart, SportsbookBet } from "@ppb/tbd-store/state/betting/sportsbook-bets/SportsbookBet.types";
import { Result } from "@ppb/tbd-store/state/constants";
import { SportsbookRunnerPriceType } from "@ppb/tbd-store/state/entities/sportsbook-runners/SportsbookRunner.types";
import { SportsbookBetCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { createGetMyBetsFiltersStateSelector } from "@ppb/tbd-store/state/layout/cards/my-bets/my-bets-selectors";
import {
  isOnlineUserDetails,
  OfflineUserDetails,
  UserDetails,
} from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { AlertType, AlertViewModel, BetSegmentInfo, InfoLabelProps, InfoLabelType } from "@ppb/the-wall-common/types";
import { Icons, IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName, ValueIconName } from "@ppb/the-wall-icons";
import { DisplayMode, ViewLink } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { SportsbookOdds } from "@ppb/tbd-store/state/entities/SportsbookOdds.types";

import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import { i18n } from "../../helpers/i18n";
import {
  formatOddsByPriceType,
  getBetStatusLabel,
  getBetSubTitle,
  getBetSupportingText,
  getBetTitle,
  getPlacedReturns,
  isAccaInsuranceSelected,
  isMultipleBetType,
  StatusLabel,
} from "../../helpers/my-bets";
import { buildFreeBetsLabel } from "../Betslip/betslip-formatters";
import { ContainerProps as CashoutContainerProps } from "../Cashout/map-to-props-factory";
import { getExternalLink } from "../../helpers/external-links";
import { BoostedMarketTypeMap, getBoostedInfo } from "../../helpers/boosted-info";
import { SportsbookBetPanelProps } from "../SportsbookBetPanel/SportsbookBetPanel.types";

export type ContainerProps = {
  urn: URN;
};

export type heritageInfoLabel = {
  label: string;
  icon: Icons;
};

type Labels = {
  guaranteedPriceLabel: NonNullable<SportsbookBetPanelProps["guaranteedPriceLabel"]>;
  stake: NonNullable<NonNullable<SportsbookBetPanelProps["segmentData"]>["midLabel"]>;
  returns: NonNullable<NonNullable<SportsbookBetPanelProps["segmentData"]>["rightLabel"]>;
  placedReturns: NonNullable<NonNullable<SportsbookBetPanelProps["segmentData"]>["rightLabel"]>;
  freeBetsBonus: string;
  oddsBoost: string;
  priceBoost: NonNullable<InfoLabelProps["label"]>;
  heritageInfoLabel: NonNullable<heritageInfoLabel>;
  moneyBackAcca: NonNullable<InfoLabelProps["label"]>;
  moneyBack: NonNullable<InfoLabelProps["label"]>;
  ghostLeg: NonNullable<InfoLabelProps["label"]>;
};

export type CardProps = {
  urn: URN;
  isSettled: boolean;
  title: NonNullable<SportsbookBetPanelProps["title"]>;
  supportingText?: SportsbookBetPanelProps["supportingText"];
  subTitle?: SportsbookBetPanelProps["subTitle"];
  statusLabelText?: SportsbookBetPanelProps["statusLabelText"];
  statusLabelIcon?: SportsbookBetPanelProps["statusLabelIcon"];
  statusLabelType?: SportsbookBetPanelProps["statusLabelType"];
  isMultiple: boolean;
  isGuaranteedPriceSelected: boolean;
  labels: Labels;
  stake: NonNullable<NonNullable<SportsbookBetPanelProps["segmentData"]>["midValue"]>;
  stakeDetail?: NonNullable<SportsbookBetPanelProps["segmentData"]>["midValueDetail"];
  originalReturns?: NonNullable<SportsbookBetPanelProps["segmentData"]>["rightPreviousValue"];
  returns: NonNullable<NonNullable<SportsbookBetPanelProps["segmentData"]>["rightValue"]>;
  placedReturns?: NonNullable<NonNullable<SportsbookBetPanelProps["segmentData"]>["rightValue"]>;
  betSegmentInfos?: SportsbookBetPanelProps["betSegmentInfos"];
  showOddsBoostSignposting: boolean;
  isPBM: boolean;
  statusLabelBoostedInfo?: BoostedMarketTypeMap;
  isPBS: boolean;
  isAccaFreezeEligible: boolean;
  cashoutQuoteURN?: CashoutContainerProps["cashoutURN"];
  hasQuote: boolean;
  shouldSubscribe?: boolean;
  betSharingViewUrn?: URN;
  shouldShowHeritageInfoLabel?: boolean;
  heritageInfoLabelViewLink: ViewLink;
  isMutationEligible: boolean;
  numberOfAccaFreezeEligibleLegs: number;
  numberOfBetLegs: number;
  freezeDetails: string;
  shouldShowFreezeSelectionButton: boolean;
  isAccaFreezeBrandSetting: boolean | undefined;
  alert?: AlertViewModel;
  superSubIcon?: Icons;
};

export type StateProps = CardProps | Record<string, never>;

const heritageInfoLabelViewLink: ViewLink = {
  viewUrn: EntityType.ExternalView,
  viewUrl: "https://support.skybet.com/app/answers/detail/why-cant-i-cash-out-my-older-bets",
  viewDisplayMode: DisplayMode.BlankWebview,
};

const buildAccaSegmentResult = (bet: SportsbookBet, legs: BetLeg[]): BetSegmentInfo | null => {
  const { betType, isSettled } = bet;

  if (!isMultipleBetType(betType) || !isAccaInsuranceSelected(bet)) {
    return null;
  }

  const hasVoidedLegs = legs.some(({ result }) => result === Result.VOID);

  if (hasVoidedLegs) {
    return null;
  }

  if (!isSettled) {
    return {
      label: i18n({ key: "I18N.MY_BETS.ACCA_INSURANCE_APPLIED" }),
      icon: ValueIconName.ACCA_INSURANCE,
    };
  }

  const numLegsLost = legs.filter(({ result }) => result === Result.LOST).length;

  let label;

  switch (numLegsLost) {
    case 0:
      label = i18n({ key: "I18N.MY_BETS.ACCA_INSURANCE_APPLIED" });
      break;
    case 1:
      label = i18n({ key: "I18N.MY_BETS.ACCA_INSURANCE_STAKE_BACK" });
      break;
    default:
      label = i18n({ key: "I18N.MY_BETS.ACCA_INSURANCE" });
      break;
  }

  return {
    label,
    icon: ValueIconName.ACCA_INSURANCE,
  };
};

const buildExternalInfoSegment = (label: string, externalUrl: string): BetSegmentInfo => ({
  label,
  icon: SystemIconName.EXTERNAL_LINK,
  iconPosition: "right",
  infoLabelType: InfoLabelType.INFO,
  externalUrl,
});

const createGetStaticLabels = () =>
  createSelector(
    [
      (localeCode: string, isSettled: boolean, eachwayPlaces: number | undefined) => ({
        localeCode,
        isSettled,
        eachwayPlaces,
      }),
    ],
    ({ isSettled, eachwayPlaces }): Labels => ({
      guaranteedPriceLabel: i18n({ key: "I18N.LABELS.BEST_ODDS_GUARANTEED_REDUCED" }),
      stake: i18n({ key: "I18N.BETSLIP.STAKE" }),
      returns: isSettled ? i18n({ key: "I18N.MY_BET.SETTLED_RETURNS" }) : i18n({ key: "I18N.BETSLIP.RETURNS" }),
      placedReturns: getPlacedReturns(isSettled, eachwayPlaces),
      freeBetsBonus: "",
      oddsBoost: i18n({ key: "I18N.BOOST_APPLIED" }),
      heritageInfoLabel: { label: i18n({ key: "I18N.HERITAGE.INFO_LABEL" }), icon: SystemIconName.EXTERNAL_LINK },
      priceBoost: i18n({ key: "I18N.MYBETS.PRICE_BOOST.SIGNPOST" }),
      moneyBackAcca: i18n({ key: "I18N.MONEY_BACK_ACCA_APPLIED" }),
      moneyBack: i18n({ key: "I18N.MONEY_BACK_ACCA_APPLIED" }),
      ghostLeg: i18n({ key: "I18N.GHOST_LEG_APPLIED" }),
    }),
  );

const createAlertSelector = () =>
  createSelector(
    [
      (freezeDetailsString: string) => freezeDetailsString,
      (_: string, isSettled: boolean) => isSettled,
      (_: string, __: boolean, isAccaFreezeBrandSetting: boolean | undefined) => isAccaFreezeBrandSetting,
      (_: string, __: boolean, ___: boolean | undefined, betStatusLabel: StatusLabel | undefined) => betStatusLabel,
      (_: string, __: boolean, ___: boolean | undefined, ____: StatusLabel | undefined, returns: string) => returns,
      (
        _: string,
        __: boolean,
        ___: boolean | undefined,
        ____: StatusLabel | undefined,
        _____: string,
        profitAndLoss: number | undefined,
      ) => profitAndLoss,
      (
        _: string,
        __: boolean,
        ___: boolean | undefined,
        ____: StatusLabel | undefined,
        _____: string,
        ______: number | undefined,
        currentSize: number,
      ) => currentSize,
      (
        _: string,
        __: boolean,
        ___: boolean | undefined,
        ____: StatusLabel | undefined,
        _____: string,
        ______: number | undefined,
        ________: number | undefined,
        ghostLegPayout: string | undefined,
      ) => ghostLegPayout,
    ],
    (
      freezeDetailsString,
      isSettled,
      isAccaFreezeBrandSetting,
      betStatusLabel,
      returns,
      profitAndLoss,
      currentSize,
      ghostLegPayout,
    ) => {
      if (freezeDetailsString.length > 0 && !isSettled) {
        return {
          type: AlertType.Info,
          message: i18n({ key: "I18N.MY_BETS.ACCA_FREEZE_SUCCESS" }),
          detail: freezeDetailsString,
          iconOverload: SystemIconName.NOTIFICATION_SUCCESS,
        };
      }

      if (isAccaFreezeBrandSetting && isSettled && betStatusLabel?.text === i18n({ key: "I18N.MY_BETS.RESULT.WON" })) {
        return {
          type: AlertType.Success,
          message: i18n({ key: "I18N.WON_SETTLED_BET", interpolationValues: { winnings: returns } }),
        };
      }

      if (
        isAccaFreezeBrandSetting &&
        isSettled &&
        betStatusLabel?.text === i18n({ key: "I18N.MY_BETS.RESULT.PLACED" })
      ) {
        if (profitAndLoss !== undefined && profitAndLoss <= currentSize) {
          return {
            type: AlertType.Success,
            message: i18n({ key: "I18N.MY_BETS.PLACED_SETTLED_BET", interpolationValues: { winnings: returns } }),
            detail: i18n({ key: "I18N.MY_BETS.PLACED_BET_RETURN_DETAIL" }),
          };
        }

        return {
          type: AlertType.Success,
          message: i18n({ key: "I18N.WON_SETTLED_BET", interpolationValues: { winnings: returns } }),
        };
      }

      if (ghostLegPayout) {
        return {
          type: AlertType.Success,
          message: i18n({ key: "I18N.GHOST_LEG_VALUE_WON", interpolationValues: { return: ghostLegPayout } }),
        };
      }

      return undefined;
    },
  );

const isDeadHeatPart = (part: LegPart) => !!part.deadHeatWinDeductions || !!part.deadHeatEachwayDeductions;

const createBetLegInfosSelector = () =>
  createSelector(
    [
      (betLegs: BetLeg[]) => betLegs,
      (_: BetLeg[], bet: SportsbookBet) => bet,
      (_: BetLeg[], __: SportsbookBet, jurisdiction: string) => jurisdiction,
      (_: BetLeg[], __: SportsbookBet, ___: string, localeCode: string) => localeCode,
      (_: BetLeg[], __: SportsbookBet, ___: string, ____: string, isMultiple: boolean) => isMultiple,
      (_: BetLeg[], __: SportsbookBet, ___: string, ____: string, _____: boolean, firstPart: LegPart) => firstPart,
      (_: BetLeg[], __: SportsbookBet, ___: string, ____: string, _____: boolean, ______: LegPart, labels: Labels) =>
        labels,
      (
        _: BetLeg[],
        __: SportsbookBet,
        ___: string,
        ____: string,
        _____: boolean,
        ______: LegPart,
        _______: Labels,
        myOddsBoostBetPrice: string | undefined,
      ) => myOddsBoostBetPrice,
      (
        _: BetLeg[],
        __: SportsbookBet,
        ___: string,
        ____: string,
        _____: boolean,
        ______: LegPart,
        _______: Labels,
        ________: string | undefined,
        myOddsBoostBetOriginalPrice: string | undefined,
      ) => myOddsBoostBetOriginalPrice,
      (
        _: BetLeg[],
        __: SportsbookBet,
        ___: string,
        ____: string,
        _____: boolean,
        ______: LegPart,
        _______: Labels,
        ________: string | undefined,
        _________: string | undefined,
        isAccaInsuranceReward: boolean,
      ) => isAccaInsuranceReward,
      (
        _: BetLeg[],
        __: SportsbookBet,
        ___: string,
        ____: string,
        _____: boolean,
        ______: LegPart,
        _______: Labels,
        ________: string | undefined,
        _________: string | undefined,
        __________: boolean,
        isMoneyBackReward: boolean,
      ) => isMoneyBackReward,
      (
        _: BetLeg[],
        __: SportsbookBet,
        ___: string,
        ____: string,
        _____: boolean,
        ______: LegPart,
        _______: Labels,
        ________: string | undefined,
        _________: string | undefined,
        __________: boolean,
        ___________: boolean,
        ghostLegOddsFormatted: string | undefined,
      ) => ghostLegOddsFormatted,
    ],
    (
      betLegs,
      bet,
      jurisdiction,
      localeCode,
      isMultiple,
      firstPart,
      labels,
      myOddsBoostBetPrice,
      myOddsBoostBetOriginalPrice,
      isAccaInsuranceReward,
      isMoneyBackReward,
      ghostLegOddsFormatted,
    ) => {
      const { has90MinBet, result, isOddsBoosted, isPBM, ghostLegToken } = bet;

      const betSegmentInfos: BetSegmentInfo[] = [];

      if (has90MinBet && result === Result.WON) {
        betSegmentInfos.push({
          label: i18n({ key: "I18N.NINETY_MINUTE.MY_BETS_LABEL" }),
          infoLabelType: InfoLabelType.BRANDED,
        });
      }

      if (isMultiple) {
        const hasRule4Deductions = betLegs.some(({ parts }) =>
          parts.some((betLegPart) => !!betLegPart.rule4Deductions),
        );
        const hasDeadHeat = betLegs.some(({ parts }) => parts.some((part) => isDeadHeatPart(part)));

        const buildAccaSegment = buildAccaSegmentResult(bet, betLegs);
        if (buildAccaSegment) {
          betSegmentInfos.push(buildAccaSegment);
        }

        if (hasRule4Deductions) {
          betSegmentInfos.push(
            buildExternalInfoSegment(
              i18n({ key: "I18N.MYBETS.RULE4_MULTIPLES" }),
              getExternalLink("RULE4", jurisdiction, localeCode),
            ),
          );
        }

        if (hasDeadHeat) {
          betSegmentInfos.push(
            buildExternalInfoSegment(
              i18n({ key: "I18N.MYBETS.DEAD_HEAT" }),
              getExternalLink("DEAD_HEAT", jurisdiction, localeCode),
            ),
          );
        }
      } else {
        const hasRule4Deductions = !!firstPart?.rule4Deductions;
        const hasDeadHeat = isDeadHeatPart(firstPart);

        if (hasRule4Deductions) {
          const rule4Label = i18n({
            key: "I18N.MYBETS.RULE4",
            interpolationValues: { rule4percentage: `${firstPart?.rule4Deductions}%` },
          });
          const externalUrl = getExternalLink("RULE4", jurisdiction, localeCode);
          betSegmentInfos.push(buildExternalInfoSegment(rule4Label, externalUrl));
        }

        if (hasDeadHeat) {
          betSegmentInfos.push(
            buildExternalInfoSegment(
              i18n({ key: "I18N.MYBETS.DEAD_HEAT" }),
              getExternalLink("DEAD_HEAT", jurisdiction, localeCode),
            ),
          );
        }
      }

      if (isOddsBoosted && !isPBM && !!labels.oddsBoost) {
        betSegmentInfos.push({
          label: labels.oddsBoost,
          icon: ValueIconName.BOOSTER,
          oddsValue: myOddsBoostBetPrice,
          previousOddsValue: myOddsBoostBetOriginalPrice,
          infoLabelType: InfoLabelType.GENEROSITY,
        });
      }
      if (labels.freeBetsBonus) {
        betSegmentInfos.push({
          label: labels.freeBetsBonus,
          icon: ValueIconName.FREE_BET,
          infoLabelType: InfoLabelType.GENEROSITY,
        });
      }

      if (isAccaInsuranceReward) {
        betSegmentInfos.push({
          label: labels.moneyBackAcca,
          icon: ValueIconName.MONEY_BACK,
          infoLabelType: InfoLabelType.GENEROSITY,
        });
      }

      if (isMoneyBackReward) {
        betSegmentInfos.push({
          label: labels.moneyBack,
          icon: ValueIconName.MONEY_BACK,
          infoLabelType: InfoLabelType.GENEROSITY,
        });
      }

      if (ghostLegToken?.tokenId) {
        betSegmentInfos.push({
          label: labels.ghostLeg,
          oddsValue: ghostLegOddsFormatted,
          icon: ValueIconName.GHOST_LEG,
          infoLabelType: InfoLabelType.GENEROSITY,
        });
      }

      return betSegmentInfos;
    },
  );

const buildStatusLabelBoostedInfo = (marketType: string | undefined, isPBM: boolean, isPBS: boolean) => {
  if (!marketType) return undefined;

  if (isPBM) {
    return {
      iconName: ValueIconName.BOOSTER,
      label: i18n({ key: "I18N.MYBETS.PRICE_BOOST.SIGNPOST" }),
    };
  }

  if (isPBS) {
    return getBoostedInfo(marketType);
  }

  return undefined;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportsbookBetCardByURN = createCardByURNSelector<SportsbookBetCards, URN>();
  const getSportsbookBetByURN = createSportsbookBetSelector();
  const getSportsbookBetLegsByURN = createSportsbookBetLegsSelector();
  const getIsCashoutQuoteDisplayedByURN = createIsSportsbookCashoutQuoteDisplayedSelector();
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getStaticLabels = createGetStaticLabels();
  const getThrottle = createGetThrottleSelector();
  const getMyBetsFiltersState = createGetMyBetsFiltersStateSelector();
  const getIsAccaFreezeEligible = createIsAccaFreezeEligibleSelector();
  const getAccaFreezeEligibleLegs = createAccaFreezeEligibleLegsSelector();
  const getIsBetFrozen = createIsBetFrozenSelector();
  const getBetSegmentInfos = createBetLegInfosSelector();
  const getAlert = createAlertSelector();

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    let userOnlineOrOffline: UserDetails | OfflineUserDetails;
    try {
      userOnlineOrOffline = getUserDetailsSelector(state);
    } catch (e) {
      console.error(e);
      return {};
    }
    if (!isOnlineUserDetails(userOnlineOrOffline)) return {};

    const userDetails = userOnlineOrOffline;

    const isWinLoseVoidActive = getThrottle(state.entities.throttles, "MY_BETS_WIN_LOSE_VOID")?.isActive;

    const isAccaFreezeBrandSetting = state.entities.brandSettings?.ACCA_FREEZE;

    const { isHeritageView } = getMyBetsFiltersState(state, state.layouts.views.mybets);

    const betCard = getSportsbookBetCardByURN(state.layouts.cards.sportsbookbets, urn);

    if (!betCard) {
      return {};
    }

    const bet = getSportsbookBetByURN(state.betting.sportsbookbets, betCard.betURN);
    if (!bet) {
      return {};
    }

    const {
      betType,
      legs,
      profitAndLoss,
      currentSize,
      isSettled,
      urn: betUrn,
      cashoutQuoteURN,
      bonus,
      isOddsBoosted,
      isPBM,
      isPBS,
      originalPotentialWin,
      betPrice,
      originalBetPrice,
      numLines,
      currentSizePerLine,
      mutations,
      isAccaInsuranceReward,
      isMoneyBackReward,
      potentialWinForPlace,
      ghostLegToken,
    } = bet;

    const betLegs = getSportsbookBetLegsByURN(state.entities.sportsbookbetlegs, legs);
    const firstPart = betLegs[0].parts[0];
    const eachwayPlaces = firstPart.eachwayPlaces;

    const hasSuperSub = betLegs.some((leg) => leg.parts.some((part) => part.isSuperSub === true));

    const labels = getStaticLabels(userDetails.localeCode, isSettled, eachwayPlaces);
    const { sportsbookOddsDisplay } = getUserPreferencesWithProductSwitcher(state.entities.preferences);

    const showStatusLabel = !isHeritageView || isSettled;
    const betStatusLabel = getBetStatusLabel(bet, betLegs, {
      locale: userDetails.localeCodeBcp47,
      timezone: userDetails.timezone,
      showWinLoseVoidFeature: !!isWinLoseVoidActive,
      isHeritageView,
    });
    const isMultiple = isMultipleBetType(betType);
    const shouldSubscribe = !isHeritageView && !isSettled;
    const shouldShowHeritageInfoLabel = isHeritageView && !isSettled;
    const numberOfAccaFreezeEligibleLegs = getAccaFreezeEligibleLegs(state.entities.sportsbookbetlegs, legs).length;
    const shouldDisplaySupportingText =
      (state.entities.brandSettings?.MYBETS_BET_PANEL_SUBTITLE ||
        state.entities.brandSettings?.MYBETS_BET_PANEL_SUPPORTING_TEXT) ??
      true;
    let frozenLegMutationIndex = -1;
    const frozenBetLeg = betLegs.find((bl) => {
      if (!bl.mutations?.details) return false;

      frozenLegMutationIndex = bl.mutations.details.findIndex((m) => m?.freezeDetails !== undefined);

      return frozenLegMutationIndex >= 0;
    });

    const legPrice = frozenBetLeg
      ? formatOddsByPriceType(
          frozenBetLeg.parts[0].price ?? null,
          frozenBetLeg.parts[0].priceType,
          sportsbookOddsDisplay,
        )
      : undefined;

    const freezeDetails =
      frozenBetLeg?.mutations?.details && frozenLegMutationIndex >= 0
        ? frozenBetLeg.mutations.details[frozenLegMutationIndex]?.freezeDetails
        : undefined;

    const isAccaFreezeEligible = getIsAccaFreezeEligible(state.betting.sportsbookbets, betCard.betURN);

    const shouldShowFreezeSelectionButton =
      isAccaFreezeEligible && !getIsBetFrozen(state.entities.sportsbookbetlegs, legs);

    const freezeDetailsString = freezeDetails
      ? `${freezeDetails.homeTeamName} ${freezeDetails.homeTeamScore}-${freezeDetails.awayTeamScore} ${freezeDetails.awayTeamName} (${freezeDetails.minute}') @ ${legPrice}`
      : "";

    if (bonus) {
      labels.freeBetsBonus = buildFreeBetsLabel("I18N.USED_FREEBET", userDetails, bonus);
    }

    const price = (isMultiple ? betPrice : firstPart?.price) ?? null;
    const originalPrice = isMultiple ? originalBetPrice ?? null : firstPart?.originalPrice;
    const priceType = isMultiple ? undefined : firstPart?.priceType;
    const ghostLegOdds: SportsbookOdds | null = ghostLegToken?.repricedDecimalOdds
      ? { decimal: ghostLegToken.repricedDecimalOdds }
      : null;
    const ghostLegOddsFormatted = ghostLegOdds
      ? formatOddsByPriceType(ghostLegOdds, undefined, sportsbookOddsDisplay, true, true)
      : undefined;

    const stake = currencyFormatWithDecimalPlaces({
      ...userDetails,
      value: currentSize,
      decimalPlaces: 2,
    });

    const returns =
      profitAndLoss !== undefined
        ? currencyFormatWithDecimalPlaces({
            ...userDetails,
            value: profitAndLoss,
            decimalPlaces: 2,
          })
        : i18n({ key: "I18N.BETSLIP.TBD" });

    const placedReturns =
      !isMultiple && profitAndLoss !== undefined && potentialWinForPlace !== undefined
        ? currencyFormatWithDecimalPlaces({
            ...userDetails,
            value: potentialWinForPlace,
            decimalPlaces: 2,
          })
        : undefined;

    const myOddsBoostBetPrice =
      (isOddsBoosted && formatOddsByPriceType(price, priceType, sportsbookOddsDisplay, isOddsBoosted)) || undefined;
    const myOddsBoostBetOriginalPrice =
      (isOddsBoosted && formatOddsByPriceType(originalPrice, priceType, sportsbookOddsDisplay, isOddsBoosted)) ||
      undefined;
    const betSegmentInfos = getBetSegmentInfos(
      betLegs,
      bet,
      userDetails.jurisdiction?.jurisdiction,
      userDetails.localeCode,
      isMultiple,
      firstPart,
      labels,
      myOddsBoostBetPrice,
      myOddsBoostBetOriginalPrice,
      isAccaInsuranceReward,
      isMoneyBackReward,
      ghostLegOddsFormatted,
    );
    const isSuperSubWithLabel = getThrottle(state.entities.throttles, "SUPER_SUB_SIGNPOSTING")?.isActive;

    const ghostLegTokenPayout = ghostLegToken?.payout
      ? currencyFormatWithDecimalPlaces({
          ...userDetails,
          value: ghostLegToken.payout,
          decimalPlaces: 2,
        })
      : undefined;

    const alert = getAlert(
      freezeDetailsString,
      isSettled,
      isAccaFreezeBrandSetting,
      betStatusLabel,
      returns,
      profitAndLoss,
      currentSize,
      ghostLegTokenPayout,
    );

    const stakeDetail =
      numLines > 1
        ? `(${numLines} x ${currencyFormatWithDecimalPlaces({
            currencyCode: userDetails.currencyCode,
            localeCodeBcp47: userDetails.localeCodeBcp47,
            value: currentSizePerLine,
            decimalPlaces: 2,
          })})`
        : undefined;

    const betSubtitle = getBetSubTitle(betLegs);

    return {
      urn: betUrn,
      isSettled,
      title: getBetTitle(bet, betLegs, sportsbookOddsDisplay),
      supportingText: shouldDisplaySupportingText ? getBetSupportingText(betLegs) : undefined,
      subTitle: betSubtitle ?? undefined,
      statusLabelText: showStatusLabel ? betStatusLabel?.text : undefined,
      statusLabelIcon: showStatusLabel ? betStatusLabel?.icon : undefined,
      statusLabelType: showStatusLabel ? betStatusLabel?.type : undefined,
      isMultiple,
      isGuaranteedPriceSelected: !isMultiple && firstPart?.priceType === SportsbookRunnerPriceType.Guaranteed,
      labels,
      stake,
      stakeDetail,
      originalReturns:
        !isPBM && !isSettled && isOddsBoosted && !!originalPotentialWin
          ? currencyFormatWithDecimalPlaces({
              ...userDetails,
              value: originalPotentialWin,
              decimalPlaces: 2,
            })
          : undefined,
      returns,
      placedReturns,
      betSegmentInfos,
      showOddsBoostSignposting: isOddsBoosted && !isPBM,
      isPBM,
      isPBS,
      statusLabelBoostedInfo: buildStatusLabelBoostedInfo(firstPart?.marketType, isPBM, isPBS),
      isAccaFreezeEligible,
      cashoutQuoteURN,
      hasQuote: getIsCashoutQuoteDisplayedByURN(state.betting.sportsbookcashouts, cashoutQuoteURN || ""),
      shouldSubscribe,
      // Temporary as Bet Sharing is out of scope for OBB MVP
      betSharingViewUrn: bet.product !== "OUTCOME_BASED_BETTING" ? betCard.betSharingViewLink?.viewUrn : undefined,
      shouldShowHeritageInfoLabel,
      heritageInfoLabelViewLink,
      isMutationEligible: !!mutations?.eligibility?.length,
      numberOfAccaFreezeEligibleLegs,
      numberOfBetLegs: betLegs.length,
      freezeDetails: freezeDetailsString,
      shouldShowFreezeSelectionButton,
      isAccaFreezeBrandSetting,
      alert,
      superSubIcon: isSuperSubWithLabel && hasSuperSub ? IconsList.SUPER_SUB_WITH_LABEL : undefined,
    };
  };
};

const dispatchSubscribeCardUpdatesAction = (urn: URN): MyBetsSubscribeCardUpdatesAction => ({
  type: MY_BETS_SUBSCRIBE_CARD_UPDATES,
  payload: { urn },
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

const dispatchUnsubscribeCardUpdatesAction = (urn: URN): MyBetsUnsubscribeCardUpdatesAction => ({
  type: MY_BETS_UNSUBSCRIBE_CARD_UPDATES,
  payload: { urn },
});

const dispatchShareIconTap = (): MyBetsBetSharingPreviewTapAction => ({
  type: UI__MY_BETS_BET_SHARING_PREVIEW_TAP,
});

const dispatchSubscribeBlhResult = (urn: URN): SubscribeBetResultAction => ({
  type: SUBSCRIBE_BET_RESULT,
  payload: { urn },
});

const dispatchUnsubscribeBlhResult = (urn: URN): UnsubscribeBetResultAction => ({
  type: UNSUBSCRIBE_BET_RESULT,
  payload: { urn },
});

const dispatchSubscribeBmeResult = (urn: URN): SubscribeBetMutationEligibilityAction => ({
  type: SUBSCRIBE_BET_MUTATION_ELIGIBILITY,
  payload: { urn },
});

const dispatchUnsubscribeBmeResult = (urn: URN): UnsubscribeBetMutationEligibilityAction => ({
  type: UNSUBSCRIBE_BET_MUTATION_ELIGIBILITY,
  payload: { urn },
});

const dispatchExternalPushAction = (url: string): ExternalPushAction => ({
  type: EXTERNAL_PUSH,
  payload: {
    viewUrn: "",
    viewUrl: url,
    gtmData: {
      label: "help & support",
      moduleName: "mybets",
    },
  },
});

const dispatchExternalPushBlankAction = (viewLink: ViewLink): ExternalPushBlankAction => ({
  type: EXTERNAL_PUSH_BLANK,
  payload: viewLink,
});

const dispatchHeritageInfoLabelClick = (viewLink: ViewLink, label: string): MyBetsHeritageInfoLabelClick => ({
  type: UI__MY_BETS_HERITAGE_INFO_LABEL_CLICK,
  payload: {
    viewLink,
    label,
  },
});

const dispatchAccaFreezeOpenedAction = (): MyBetsAccaFreezeOpenedAction => ({
  type: UI__MY_BETS_ACCA_FREEZE_OPENED,
});

const dispatchAccaFreezeClosedAction = (): MyBetsAccaFreezeClosedAction => ({
  type: UI__MY_BETS_ACCA_FREEZE_CLOSED,
});

export type DispatchProps = {
  dispatchSubscribeCardUpdatesAction: typeof dispatchSubscribeCardUpdatesAction;
  dispatchUnsubscribeCardUpdatesAction: typeof dispatchUnsubscribeCardUpdatesAction;
  dispatchFetchCatalogue: typeof dispatchFetchCatalogue;
  dispatchDeleteView: typeof dispatchDeleteView;
  dispatchShareIconTap: typeof dispatchShareIconTap;
  dispatchSubscribeBlhResult: typeof dispatchSubscribeBlhResult;
  dispatchUnsubscribeBlhResult: typeof dispatchUnsubscribeBlhResult;
  dispatchSubscribeBmeResult: typeof dispatchSubscribeBmeResult;
  dispatchUnsubscribeBmeResult: typeof dispatchUnsubscribeBmeResult;
  dispatchExternalPushAction: typeof dispatchExternalPushAction;
  dispatchExternalPushBlankAction: typeof dispatchExternalPushBlankAction;
  dispatchHeritageInfoLabelClick: typeof dispatchHeritageInfoLabelClick;
  dispatchAccaFreezeOpenedAction: typeof dispatchAccaFreezeOpenedAction;
  dispatchAccaFreezeClosedAction: typeof dispatchAccaFreezeClosedAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchSubscribeCardUpdatesAction,
  dispatchUnsubscribeCardUpdatesAction,
  dispatchFetchCatalogue,
  dispatchDeleteView,
  dispatchShareIconTap,
  dispatchSubscribeBlhResult,
  dispatchUnsubscribeBlhResult,
  dispatchSubscribeBmeResult,
  dispatchUnsubscribeBmeResult,
  dispatchExternalPushAction,
  dispatchExternalPushBlankAction,
  dispatchHeritageInfoLabelClick,
  dispatchAccaFreezeOpenedAction,
  dispatchAccaFreezeClosedAction,
};
