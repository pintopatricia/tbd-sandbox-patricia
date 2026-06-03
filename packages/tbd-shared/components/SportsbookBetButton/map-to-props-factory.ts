import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";

import URN from "@ppb/tbd-store/state/layout/URN";
import { MarketRunner } from "@ppb/tbd-store/state/entities/Market.types";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { SportsbookOdds } from "@ppb/tbd-store/state/entities/SportsbookOdds.types";
import { SportsbookMarketStatus } from "@ppb/tbd-store";
import { SportsbookRunnerStatus } from "@ppb/tbd-store/state/entities/sportsbook-runners/SportsbookRunner.types";
import { createSportsbookMarketByURNSelector } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createSportsbookRunnerWithBettingLegStateByURNSelector } from "@ppb/tbd-store/state/entities/sportsbook-runners/sportsbook-runner-selectors";
import {
  MarketSportsbookBetButtonClickAction,
  BettingSportsbookToggleLegAction,
  RemoveAllPotentialBetsAction,
  UI__MARKET_SBK_BET_BUTTON_CLICK,
  BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
  BETTING__SBK_TOGGLE_LEG_ACTION,
  PlacingBetPayload,
} from "@ppb/tbd-store/actions/betting";
import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import { OddsDisplayPreference, Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { SportsbookBetButtonProps, SportsbookBetButtonStatus } from "@ppb/the-wall-common/types";
import {
  ClosedSbkBetButtonCLickAction,
  SuspendedSbkBetButtonCLickAction,
  UI__CLOSED_SBK_CLICK,
  UI__SUSPENDED_SBK_CLICK,
} from "@ppb/tbd-store/actions/sportsbook-markets";
import { PlacingBetMetadata } from "@ppb/tbd-store/middlewares/tagging-resolvers/Betting.types";
import {
  BetslipExcRemovePotentialSelectionAction,
  BetslipOpenAction,
  BetslipSbkRemovePotentialSelectionAction,
  UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION,
  UI__BETSLIP_OPEN,
  UI__BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION,
} from "@ppb/tbd-store/actions/betslip";
import { i18n } from "../../helpers/i18n";
import { TranslationKey } from "../../translations/keys";

enum ToastMessageStatus {
  SUSPENDED = "SUSPENDED",
  CLOSED = "CLOSED",
}

export type ContainerProps = {
  cardUrn: URN;
  marketUrn: URN;
  runnerUrn: URN;
  displayPreviousOdd?: boolean;
  isSecondaryLabelRunnerName?: boolean;
  isSecondaryLabelUppercase?: boolean;
  isSecondaryLabelAllCaps?: boolean;
  handicapLabel?: string;
  rounded?: boolean;
  tall?: boolean;
  accessibilityLabel?: string;
  onPotentialBetChange?: (isPotentialBet: boolean, isBetSlipCollapsed: boolean) => void;
  onPromoClickCallback?: () => void;
};

type ComponentProps = Omit<SportsbookBetButtonProps, "onClick">;

type LoadingComponentProps = ComponentProps & {
  odds?: never;
  isBetslipCollapsed?: never;
  toastMessageStatus?: never;
};

export type CardProps = {
  odds: SportsbookOdds | undefined;
  isBetslipCollapsed: boolean;
  toastMessageStatus?: ToastMessageStatus;
} & ComponentProps;

const buildBetButtonLabel = (
  isStartingPrice: boolean,
  odds?: SportsbookOdds,
  sportsbookDisplayOddsPreferences?: OddsDisplayPreference,
  marketStatus?: SportsbookMarketStatus,
  runnerStatus?: SportsbookRunnerStatus,
): string => {
  if (
    marketStatus === "SUSPENDED" ||
    marketStatus === "CLOSED" ||
    runnerStatus === "SUSPENDED" ||
    runnerStatus === "REMOVED"
  ) {
    return "-";
  }
  if (odds && sportsbookDisplayOddsPreferences) {
    return formatOdds(odds, sportsbookDisplayOddsPreferences);
  }
  if (isStartingPrice) {
    return i18n({ key: "I18N.HORSE_RACING.SP" });
  }

  return "-";
};

const buildButtonStatus = (
  isPotentialBet: boolean,
  marketStatus?: SportsbookMarketStatus,
  runnerStatus?: SportsbookRunnerStatus,
): SportsbookBetButtonStatus => {
  if (isPotentialBet) return "selected";

  if (marketStatus === "CLOSED" || runnerStatus === "REMOVED") {
    return "closed";
  }

  return "default";
};

const buildNameLabel = (runnerName?: string): string | undefined => runnerName ?? undefined;

const buildOddsLabel = (
  displayPreviousOdd: boolean,
  runnerPreviousOdds?: SportsbookOdds[],
  sportsbookDisplayOddsPreferences?: OddsDisplayPreference,
): string | undefined => {
  if (!displayPreviousOdd || !runnerPreviousOdds?.length || !sportsbookDisplayOddsPreferences) {
    return undefined;
  }

  return formatOdds(runnerPreviousOdds[0], sportsbookDisplayOddsPreferences);
};

const buildToastMessageStatus = (
  hasRunnerOdds: boolean,
  isBspMarket: boolean,
  isStartingPrice: boolean,
  marketStatus?: SportsbookMarketStatus,
  runnerStatus?: SportsbookRunnerStatus,
): ToastMessageStatus | undefined => {
  if (marketStatus === "CLOSED" || runnerStatus === "REMOVED") {
    return ToastMessageStatus.CLOSED;
  }

  if (
    marketStatus === "SUSPENDED" ||
    runnerStatus === "SUSPENDED" ||
    (runnerStatus === "ACTIVE" && !hasRunnerOdds && !isBspMarket && !isStartingPrice)
  ) {
    return ToastMessageStatus.SUSPENDED;
  }
  return undefined;
};

export type StateProps = CardProps | LoadingComponentProps;

const buildAccessibilityLabel = (
  isOddsboostMarketType: boolean | undefined,
  treatedSecondaryLabel: string | undefined,
  label: string,
  status: string | undefined,
  isSecondaryLabelRunnerName: boolean | undefined,
  runnerName: string | undefined,
) => {
  if (status === "CLOSED" || status === "SUSPENDED") {
    const statusAccessibilityMap: Partial<Record<"CLOSED" | "SUSPENDED", keyof TranslationKey>> = {
      CLOSED: "I18N.ACCESSIBILITY.BET_BUTTON_CLOSED",
      SUSPENDED: "I18N.ACCESSIBILITY.BET_BUTTON_SUSPENDED",
    };
    const statusAccessibilityKey = statusAccessibilityMap[status];

    if (statusAccessibilityKey) {
      return i18n({ key: statusAccessibilityKey });
    }
  }

  if (isOddsboostMarketType && treatedSecondaryLabel) {
    return i18n({
      key: "I18N.ACCESSIBILITY.BET_BUTTON_ODDSBOOST",
      interpolationValues: {
        previousOdds: treatedSecondaryLabel,
        currentOdds: label,
      },
    });
  }

  if (treatedSecondaryLabel) {
    return `${treatedSecondaryLabel}, ${i18n({
      key: "I18N.ACCESSIBILITY.BET_BUTTON_DEFAULT",
      interpolationValues: { odds: label },
    })}`;
  }

  if (!isSecondaryLabelRunnerName) {
    if (runnerName?.trim().toLowerCase() === "draw") {
      return i18n({
        key: "I18N.ACCESSIBILITY.DRAW",
        interpolationValues: { odds: label },
      });
    }

    return i18n({
      key: "I18N.ACCESSIBILITY.TEAM_TO_WIN",
      interpolationValues: { team: runnerName as string, odds: label },
    });
  }

  return i18n({
    key: "I18N.ACCESSIBILITY.BET_BUTTON_DEFAULT",
    interpolationValues: { odds: label },
  });
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportsbookMarketByURN = createSportsbookMarketByURNSelector();
  const getSportsbookRunnerWithBettingLegStateByURN = createSportsbookRunnerWithBettingLegStateByURNSelector();

  return function mapStateToProps(
    state: ApplicationState,
    {
      marketUrn,
      runnerUrn,
      displayPreviousOdd = true,
      isSecondaryLabelRunnerName,
      isSecondaryLabelUppercase,
      handicapLabel,
      accessibilityLabel,
    }: ContainerProps,
  ): StateProps {
    const animated = state.entities.brandSettings?.SPORTSBOOK_BET_BUTTON_ANIMATION ?? true;

    const market = getSportsbookMarketByURN(state.entities.sportsbookmarkets, marketUrn);

    if (!market) {
      return { animated, label: "" };
    }

    const runner = getSportsbookRunnerWithBettingLegStateByURN(state, { marketUrn, runnerUrn });

    if (!runner) {
      return { animated, label: "" };
    }

    const { sportsbookOddsDisplay } = state.entities.preferences;

    const { status, isOddsboostMarketType, runners } = market;
    const { name: runnerName } = runners.find((runnerInfo: MarketRunner) => runnerInfo.urn === runnerUrn) || {
      name: undefined,
    };

    // When displayPreviousOdd comes false from the parent we should keep it
    // Otherwise, if it comes truthy or undefined we should check if is a ODDSBOOST MarketType
    const showPreviousOdd = displayPreviousOdd && !!isOddsboostMarketType;

    const secondaryLabel = isSecondaryLabelRunnerName
      ? buildNameLabel(runnerName)
      : buildOddsLabel(showPreviousOdd, runner?.previousOdds, sportsbookOddsDisplay);

    const label = buildBetButtonLabel(
      runner.isStartingPrice,
      runner.odds,
      sportsbookOddsDisplay,
      status,
      runner?.status,
    );
    const treatedSecondaryLabel = isSecondaryLabelUppercase ? secondaryLabel?.toUpperCase() : secondaryLabel;
    const isInactive = status === "SUSPENDED" || status === "CLOSED";
    const accessibilityHints = {
      selected: i18n({ key: "I18N.ACCESSIBILITY.REMOVE_FROM_BETSLIP_HINT" }),
      default: i18n({ key: "I18N.ACCESSIBILITY.ADD_TO_BETSLIP_HINT" }),
    };

    return {
      label,
      secondaryLabel: treatedSecondaryLabel,
      oddsboost: isOddsboostMarketType,
      odds: runner?.odds,
      isBetslipCollapsed: state.betslip?.isCollapsed || false,
      struckThrough: !isSecondaryLabelRunnerName,
      animated,
      status: buildButtonStatus(runner.isPotentialBet, status, runner?.status),
      toastMessageStatus: buildToastMessageStatus(
        !!runner.odds,
        !!market.bspMarket,
        runner.isStartingPrice,
        status,
        runner?.status,
      ),
      handicapLabel,
      accessibilityHints: isInactive ? undefined : accessibilityHints,
      accessibilityLabel:
        accessibilityLabel ??
        buildAccessibilityLabel(
          isOddsboostMarketType,
          treatedSecondaryLabel,
          label,
          status,
          isSecondaryLabelRunnerName,
          runnerName,
        ),
    };
  };
};

export type DispatchProps = {
  dispatchBetPlacement: (bet: PlacingBetPayload, metadata: PlacingBetMetadata) => void;
  dispatchInactiveBetButtonClickAction: (status: ToastMessageStatus) => void;
};

export const makeMapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchBetPlacement(bet, metadata) {
    dispatch<BetslipOpenAction>({
      type: UI__BETSLIP_OPEN,
      payload: {
        product: Product.Sportsbook,
      },
    });
    dispatch<BetslipSbkRemovePotentialSelectionAction>({
      type: UI__BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION,
      payload: {
        urn: bet.urn,
      },
    });
    dispatch<BetslipExcRemovePotentialSelectionAction>({
      type: UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION,
    });
    dispatch<MarketSportsbookBetButtonClickAction>({
      type: UI__MARKET_SBK_BET_BUTTON_CLICK,
      payload: { ...bet, ...metadata, uniqueId: "", group: "REAL" },
    });
    dispatch<RemoveAllPotentialBetsAction>({
      type: BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
    });
    dispatch<BettingSportsbookToggleLegAction>({
      type: BETTING__SBK_TOGGLE_LEG_ACTION,
      payload: { ...bet, metadata, group: "REAL" },
    });
  },
  dispatchInactiveBetButtonClickAction(status) {
    dispatch<SuspendedSbkBetButtonCLickAction | ClosedSbkBetButtonCLickAction>({
      type: status === ToastMessageStatus.CLOSED ? UI__CLOSED_SBK_CLICK : UI__SUSPENDED_SBK_CLICK,
    });
  },
});
