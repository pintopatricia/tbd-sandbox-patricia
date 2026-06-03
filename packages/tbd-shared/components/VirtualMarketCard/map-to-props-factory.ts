import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { VirtualMarketCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { VirtualRunner } from "@ppb/tbd-store/state/entities/virtual-runner/VirtualRunner.types";
import { VirtualMarket } from "@ppb/tbd-store/state/entities/virtual-market/VirtualMarket.types";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createVirtualMarketByURNSelector } from "@ppb/tbd-store/state/entities/virtual-market/virtual-market-selectors";
import { createVirtualRunnerByURNSelector } from "@ppb/tbd-store/state/entities/virtual-runner/virtual-runner-selectors";
import { createVirtualEventByURNSelector } from "@ppb/tbd-store/state/entities/virtual-event/virtual-event-selectors";
import { createVirtualSportByURNSelector } from "@ppb/tbd-store/state/entities/virtual-sport/virtual-sport-selectors";
import URN from "@ppb/tbd-store/state/layout/URN";
import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import {
  MarketPromoIcon,
  SportsbookMarketBlurbInfoProps,
  SportsbookMarketI18N,
  SportsbookMarketProps,
  SportsbookMarketStatus,
  ViewLink,
} from "@ppb/the-wall-common/types";
import { VirtualSport as VirtualSportEnum } from "@ppb/tbd-store/state/constants";
import { createSelector, ParametricSelector } from "reselect";
import { SportsbookOdds } from "@ppb/tbd-store/state/entities/SportsbookOdds.types";
import { Product, OddsDisplayPreference } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import {
  BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
  BETTING__SBK_TOGGLE_LEG_ACTION,
  BettingSportsbookToggleLegAction,
  MarketSportsbookBetButtonClickAction,
  PlacingBetPayload,
  RemoveAllPotentialBetsAction,
  UI__MARKET_SBK_BET_BUTTON_CLICK,
} from "@ppb/tbd-store/actions/betting";
import { convertEntityTupleToLegId, isLegInState } from "@ppb/tbd-store/helpers/sportsbook-betting";
import {
  ClosedSbkBetButtonCLickAction,
  UI__CLOSED_SBK_CLICK,
  InPlaySbkBetButtonClickAction,
  UI__VIRTUAL_SUSPENDED_SBK_CLICK,
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
import { VirtualSport } from "@ppb/tbd-store";
import { VirtualSportKind } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { i18n } from "../../helpers/i18n";
import { BetButtonTheme } from "../ExchangeBetButtons/snowflakes/BetButton/BetButton.types";

export enum ToastMessageStatus {
  SUSPENDED = "SUSPENDED",
  CLOSED = "CLOSED",
}

export type ContainerProps = { urn: string };

export type VirtualMarketCardI18N = {
  tabsLabel: string;
  gameRules: string;
} & SportsbookMarketI18N;

export type VirtualMarketCardRunner = {
  label: string;
  name: string;
  description?: string;
  number?: number;
  sportId: number;
  showSilk: boolean;
  humanTexture: string;
  isSelected: boolean;
  theme: BetButtonTheme;
  toastMessageStatus?: ToastMessageStatus;
} & Pick<VirtualRunner, "urn" | "name" | "odds">;

export type CardProps = Omit<SportsbookMarketProps, "children"> & {
  kind: VirtualSport["kind"];
  marketUrn: URN;
  title: string;
  i18n: VirtualMarketCardI18N;
  infoBlurbs: SportsbookMarketBlurbInfoProps[];
  runners: VirtualMarketCardRunner[];
  gameRulesViewLink: ViewLink;
  animated: boolean;
};

export type StateProps = CardProps | Record<string, never>;

const buildVirtualMarketCardRunnerInformationProps = (
  virtualSport: VirtualSport,
  virtualRunner: VirtualRunner,
): Pick<VirtualMarketCardRunner, "description" | "number"> => {
  const { humanName, racerIndex } = virtualRunner;

  if (virtualSport.kind === VirtualSportKind.Football) {
    return {};
  }

  if (virtualSport.sportId === VirtualSportEnum.MotorRacing) {
    return {
      number: racerIndex,
    };
  }

  return {
    number: racerIndex,
    description: humanName,
  };
};

const buildToastMessageStatus = (
  hasRunnerOdds: boolean,
  marketStatus?: SportsbookMarketStatus,
): ToastMessageStatus | undefined => {
  if (marketStatus === "CLOSED") {
    return ToastMessageStatus.CLOSED;
  }

  if (marketStatus === "SUSPENDED" || !hasRunnerOdds) {
    return ToastMessageStatus.SUSPENDED;
  }
  return undefined;
};

const buildBetButtonLabel = (
  odds?: SportsbookOdds,
  sportsbookDisplayOddsPreferences?: OddsDisplayPreference,
  marketStatus?: SportsbookMarketStatus,
): string => {
  if (marketStatus === "SUSPENDED" || marketStatus === "CLOSED") {
    return "-";
  }
  if (odds && sportsbookDisplayOddsPreferences) {
    return formatOdds(odds, sportsbookDisplayOddsPreferences);
  }

  return "-";
};

const buildBetButtonTheme = (marketStatus?: SportsbookMarketStatus): BetButtonTheme => {
  if (marketStatus === "CLOSED") {
    return BetButtonTheme.DARK;
  }

  return BetButtonTheme.REGULAR;
};

const createBuildVirtualMarketCardRunnersByVirtualMarketURNSelector = (): ParametricSelector<
  ApplicationState,
  URN,
  VirtualMarketCardRunner[] | undefined
> => {
  const getVirtualMarketByURN = createVirtualMarketByURNSelector();
  const getVirtualRunnerByURN = createVirtualRunnerByURNSelector();
  const getVirtualEventByURN = createVirtualEventByURNSelector();
  const getVirtualSportByURN = createVirtualSportByURNSelector();

  return createSelector(
    [
      ({ entities }: ApplicationState, marketUrn: URN) => getVirtualMarketByURN(entities.virtualmarkets, marketUrn),
      ({ entities }) => entities.virtualsports,
      ({ entities }) => entities.virtualevents,
      ({ entities }) => entities.virtualrunners,
      ({ entities }) => entities.preferences,
      ({ betting }) => betting.sportsbookBetting.legs,
    ],
    (
      virtualMarket,
      virtualSports,
      virtualEvents,
      virtualRunners,
      preferences,
      legs,
    ): VirtualMarketCardRunner[] | undefined => {
      const sportsbookOddsDisplay = preferences?.sportsbookOddsDisplay ?? true;

      return virtualMarket?.runners.reduce((acc: VirtualMarketCardRunner[], runnerUrn) => {
        const virtualRunner = getVirtualRunnerByURN(virtualRunners, runnerUrn);

        if (!virtualRunner) {
          return acc;
        }

        const virtualEvent = getVirtualEventByURN(virtualEvents, virtualMarket.event);
        if (!virtualEvent) {
          return acc;
        }

        const virtualSport = getVirtualSportByURN(virtualSports, virtualEvent.sport);
        if (!virtualSport) {
          return acc;
        }

        const { urn, name } = virtualRunner;

        const legId = convertEntityTupleToLegId(virtualMarket.marketId, virtualRunner.selectionId);

        const marketHasSilks = ["WIN", "MATCH_ODDS"].includes(virtualMarket.marketType);

        acc.push({
          urn,
          name,
          label: buildBetButtonLabel(virtualRunner.odds, sportsbookOddsDisplay, virtualMarket.status),
          odds: virtualRunner.odds,
          isSelected: isLegInState(legId, legs),
          sportId: virtualSport.sportId,
          showSilk: marketHasSilks,
          humanTexture: virtualRunner.humanTexture,
          theme: buildBetButtonTheme(virtualMarket.status),
          ...buildVirtualMarketCardRunnerInformationProps(virtualSport, virtualRunner),
          toastMessageStatus: buildToastMessageStatus(!!virtualRunner.odds, virtualMarket.status),
        });

        return acc;
      }, []);
    },
  );
};

type EachWayTermsLabel = Pick<VirtualMarket, "hasEachWay" | "eachWayPlaces" | "eachWayFraction">;

const getEachWayTermsLabel = ({ hasEachWay, eachWayPlaces, eachWayFraction }: EachWayTermsLabel): string => {
  if (!hasEachWay || !eachWayPlaces || !eachWayFraction) {
    return "";
  }

  return i18n({
    key: "I18N.LABELS.EW_TERMS",
    interpolationValues: {
      numerator: 1,
      denominator: eachWayFraction,
      places: eachWayPlaces,
    },
  });
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getVirtualMarketCardByURN = createCardByURNSelector<VirtualMarketCards, URN>();
  const getVirtualEventByURN = createVirtualEventByURNSelector();
  const getVirtualMarketByURN = createVirtualMarketByURNSelector();
  const getVirtualSportByURN = createVirtualSportByURNSelector();
  const buildVirtualMarketCardRunnersByVirtualMarketURNSelector =
    createBuildVirtualMarketCardRunnersByVirtualMarketURNSelector();
  const labels: VirtualMarketCardI18N = {
    tabsLabel: i18n({ key: "I18N.LABELS.MARKET_TABS" }),
    suspended: i18n({ key: "I18N.MARKET.SUSPENDED" }),
    closed: i18n({ key: "I18N.MARKET.CLOSED" }),
    bog: "",
    nonRunnerTitle: "",
    azSwitcher: "",
    gameRules: i18n({ key: "I18N.VIRTUALS.GAME_RULES" }),
  };

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const virtualMarketCard = getVirtualMarketCardByURN(state.layouts.cards.virtualmarket, urn);

    if (!virtualMarketCard) {
      return {};
    }

    const { title, market: marketUrn, event: eventUrn, gameRulesViewLink: gameRules } = virtualMarketCard;
    const virtualEvent = getVirtualEventByURN(state.entities.virtualevents, eventUrn);

    if (!virtualEvent) {
      return {};
    }

    const virtualSport = getVirtualSportByURN(state.entities.virtualsports, virtualEvent.sport);

    if (!virtualSport) {
      return {};
    }

    const runners = buildVirtualMarketCardRunnersByVirtualMarketURNSelector(state, marketUrn);

    if (!runners) {
      return {};
    }

    const market = getVirtualMarketByURN(state.entities.virtualmarkets, marketUrn);

    if (!market) {
      return {};
    }

    const eachWayTermsLabel = getEachWayTermsLabel(market);

    const infoBlurbsWithEachWayTerms = eachWayTermsLabel
      ? [{ title: eachWayTermsLabel, signposting: "MARKET_RULES" as MarketPromoIcon.MarketRules }]
      : [];

    const status = virtualEvent.isExpired ? "SUSPENDED" : market.status;
    const animated = state.entities.brandSettings?.SPORTSBOOK_BET_BUTTON_ANIMATION ?? true;

    return {
      kind: virtualSport.kind,
      marketUrn,
      title,
      status,
      infoBlurbs: infoBlurbsWithEachWayTerms,
      guaranteedPriceAvailable: false,
      i18n: labels,
      runners,
      gameRulesViewLink: gameRules,
      animated,
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
      payload: { ...bet, ...metadata, uniqueId: "", group: "VIRTUAL" },
    });
    dispatch<RemoveAllPotentialBetsAction>({
      type: BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
    });
    dispatch<BettingSportsbookToggleLegAction>({
      type: BETTING__SBK_TOGGLE_LEG_ACTION,
      payload: { ...bet, group: "VIRTUAL" },
    });
  },
  dispatchInactiveBetButtonClickAction(status) {
    dispatch<InPlaySbkBetButtonClickAction | ClosedSbkBetButtonCLickAction>({
      type: status === ToastMessageStatus.CLOSED ? UI__CLOSED_SBK_CLICK : UI__VIRTUAL_SUSPENDED_SBK_CLICK,
    });
  },
});
