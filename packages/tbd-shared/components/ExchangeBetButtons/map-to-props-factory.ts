import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";
import { createSelector, ParametricSelector } from "reselect";

import URN from "@ppb/tbd-store/state/layout/URN";
import { ExchangeBetAvailability } from "@ppb/tbd-store/state/entities/ExchangeBetAvailability.types";
import { ExchangeMarketStatus } from "@ppb/tbd-store/state/entities/exchange-markets/ExchangeMarket.types";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  BETTING__ADD_POTENTIAL_BET_ACTION,
  BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
  UI__MARKET_EXC_BET_BUTTON_CLICK,
  AddPotentialBetAction,
  MarketExchangeBetButtonClickAction,
  RemoveAllPotentialBetsAction,
} from "@ppb/tbd-store/actions/betting";
import {
  createExchangeRunnerOddsWithPotentialBetsByURNSelector,
  ExchangeRunnerOddsWithPotentialBets,
} from "@ppb/tbd-store/state/application-state-selectors";
import { createExchangeMarketSelector } from "@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { ExchangeSide } from "@ppb/tbd-store/state/constants";
import { ExchangeSide as ExchangeSideType } from "@ppb/tbd-store/state/betting/exchange-bets/ExchangeBet.types";
import {
  BetslipExcRemovePotentialSelectionAction,
  BetslipOpenAction,
  UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION,
  UI__BETSLIP_OPEN,
} from "@ppb/tbd-store/actions/betslip";
import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { currencyFormatWithoutDecimalPlaces } from "../../formatters/currency-formatters";
import type { ExchangeMarketPrices } from "../ExchangeMarket/snowflakes/ExchangeMarket/ExchangeMarket.types";
import { BetButtonSize } from "./snowflakes/BetButton/BetButton.types";

export type ContainerProps = {
  cardURN: URN;
  marketURN: URN;
  runnerURN: URN;
  displayBestOdds: boolean;
  side?: ExchangeSideType; // if defined, renders only the best odd for the provided side
  onBetButtonClick?: (isPotentialBet: boolean) => void;
};

export type CardProps = {
  cardURN: URN;
  marketURN: URN;
  runnerURN: URN;
  marketId: string;
  prices: ExchangeMarketPrices[];
  displayBestOdds: boolean;
  betBtnSize: BetButtonSize;
};

export type StateProps = CardProps | Record<string, never>;

const createBuildExcBetButtonsVM = (): ParametricSelector<
  { marketStatus: ExchangeMarketStatus; runnerWithOdds: ExchangeRunnerOddsWithPotentialBets | undefined },
  { localeCodeBcp47: string; currencyCode: string; isMarketDepthActive: boolean; side?: ExchangeSideType },
  ExchangeMarketPrices[]
> => {
  const mapExchangePrice = (
    side: ExchangeSideType,
    price: ExchangeBetAvailability & {
      isPotentialBet: boolean;
    },
    marketStatus: ExchangeMarketStatus,
    localeCodeBcp47: string,
    currencyCode: string,
  ): ExchangeMarketPrices => ({
    side,
    marketDepth: price.marketDepth || 0,
    price: price.price,
    liquidity: price.liquidity
      ? currencyFormatWithoutDecimalPlaces({
          localeCodeBcp47,
          currencyCode,
          value: price.liquidity,
          // STSIER-872 - apply custom currency format due to lack of space in bet buttons
          useCustomCurrencyFormat: true,
        })
      : undefined,
    isSelected: price.isPotentialBet,
    disabled: marketStatus !== ExchangeMarketStatus.Open,
  });

  return createSelector(
    [
      ({ runnerWithOdds }: { runnerWithOdds: ExchangeRunnerOddsWithPotentialBets | undefined }) => runnerWithOdds,
      ({ marketStatus }: { marketStatus: ExchangeMarketStatus }) => marketStatus,
      (_, { localeCodeBcp47 }: { localeCodeBcp47: string }) => localeCodeBcp47,
      (_, { currencyCode }: { currencyCode: string }) => currencyCode,
      (_, { isMarketDepthActive }: { isMarketDepthActive: boolean }) => isMarketDepthActive,
      (_, { side }: { side?: ExchangeSideType }) => side,
    ],
    (runnerWithOdds, marketStatus, localeCodeBcp47, currencyCode, isMarketDepthActive, side) => {
      if (!runnerWithOdds) {
        const placeholderVM = (excSide: ExchangeSideType): ExchangeMarketPrices => ({
          side: excSide,
          marketDepth: 0,
          liquidity: "",
          isSelected: false,
          disabled: false,
        });

        if (isMarketDepthActive) {
          return [
            placeholderVM("BACK"),
            placeholderVM("BACK"),
            placeholderVM("BACK"),
            placeholderVM("LAY"),
            placeholderVM("LAY"),
            placeholderVM("LAY"),
          ];
        }
        if (side) {
          return [placeholderVM(side)];
        }

        return [placeholderVM("BACK"), placeholderVM("LAY")];
      }

      const backVM = runnerWithOdds.back?.map(
        (backPrice): ExchangeMarketPrices =>
          mapExchangePrice(ExchangeSide.BACK, backPrice, marketStatus, localeCodeBcp47, currencyCode),
      );
      const layVM = runnerWithOdds.lay?.map(
        (layPrice): ExchangeMarketPrices =>
          mapExchangePrice(ExchangeSide.LAY, layPrice, marketStatus, localeCodeBcp47, currencyCode),
      );

      const selector = [];

      if (backVM) {
        selector.push(...backVM.reverse());
      }

      if (layVM) {
        selector.push(...layVM);
      }

      return selector;
    },
  );
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getExchangeMarketByURN = createExchangeMarketSelector();
  const getExchangeRunnerOddsWithPotentialBetsByURN = createExchangeRunnerOddsWithPotentialBetsByURNSelector();
  const buildExcBetButtonsVM = createBuildExcBetButtonsVM();

  return function mapStateToProps(state: ApplicationState, props: ContainerProps): StateProps {
    const market = getExchangeMarketByURN(state.entities.exchangemarkets, props.marketURN);

    const { userdetails } = state.entities;
    if (!market || !userdetails) {
      return {};
    }
    const { currencyCode, localeCodeBcp47 } = <UserDetails>userdetails;

    const runnerWithOdds = getExchangeRunnerOddsWithPotentialBetsByURN(state, {
      marketURN: props.marketURN,
      runnerURN: props.runnerURN,
      bestOdds: props.displayBestOdds,
      side: props.side,
    });

    const prices = buildExcBetButtonsVM(
      { runnerWithOdds, marketStatus: market.status },
      {
        currencyCode,
        localeCodeBcp47,
        isMarketDepthActive: !props.displayBestOdds,
        side: props.side,
      },
    );

    return {
      cardURN: props.cardURN,
      marketURN: market.urn,
      marketId: market.marketId,
      runnerURN: props.runnerURN,
      prices,
      betBtnSize: !props.displayBestOdds ? BetButtonSize.Small : BetButtonSize.Regular,
      displayBestOdds: props.displayBestOdds,
    };
  };
};

type PlacingBet = {
  marketURN: URN;
  urn: URN;
  price?: number;
  side: ExchangeSideType;
  isSelected: boolean;
  marketDepth: number;
};

type PlacingBetMetadata = {
  cardURN: URN;
  betOriginURL: string;
  marketId?: string;
};

export type DispatchProps = {
  dispatchBetPlacement: (bet: PlacingBet, metadata: PlacingBetMetadata) => void;
};

export const makeMapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchBetPlacement: (bet, metadata) => {
    dispatch<BetslipOpenAction>({
      type: UI__BETSLIP_OPEN,
      payload: {
        product: Product.Exchange,
      },
    });

    dispatch<BetslipExcRemovePotentialSelectionAction>({
      type: UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION,
    });

    dispatch<MarketExchangeBetButtonClickAction>({
      type: UI__MARKET_EXC_BET_BUTTON_CLICK,
      payload: {
        urn: bet.urn,
        marketURN: bet.marketURN,
        price: bet.price,
        side: bet.side,
        betOriginURL: metadata.betOriginURL,
        cardUrn: metadata.cardURN,
        marketId: metadata.marketId,
        uniqueId: "",
      },
    });

    dispatch<RemoveAllPotentialBetsAction>({
      type: BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
    });

    if (!bet.isSelected) {
      dispatch<AddPotentialBetAction>({
        type: BETTING__ADD_POTENTIAL_BET_ACTION,
        payload: {
          marketDepth: bet.marketDepth,
          marketURN: bet.marketURN,
          price: bet.price,
          runner: bet.urn,
          side: bet.side,
        },
      });
    }
  },
});
