import {
  LimitOrder,
  OrderType,
} from "@flutter-global/uki-channels-http-clients/src/clients/ExchangeTransactional/ExchangeTransactional";
import URN from "../state/layout/URN";
import { ExchangePersistenceType } from "../state/entities";
import { ApplicationState } from "../state/ApplicationState.types";
import {
  getExchangeRunnerTree,
  createExcRunnerPotentialBetsByRunnerURNSelector,
} from "../state/entities/entities-selectors";
import { ExchangeSide } from "../state/betting/exchange-bets/ExchangeBet.types";

export type PlaceBetData = {
  marketId: string;
  selectionId: number;
  handicap: number;
  side: ExchangeSide;
  urn: URN;
  orderType: OrderType;
  useAvailableBonus?: boolean;
  limitOrder?: LimitOrder;
} | null;

export type UnmatchedBetData = {
  betId: string;
  marketId: string;
  selectionId: number;
  handicap: number;
  side: ExchangeSide;
  size: number;
  price: number;
  urn: URN;
  orderType: string;
  persistenceType: string;
  newPersistenceType: string;
  newPrice: number;
  newSize: number;
} | null;

const ORDER_TYPE = "LIMIT";
const PERSISTENCE_TYPE: ExchangePersistenceType = "LAPSE";

export const getPlaceBetData = (state: ApplicationState, runner: URN): PlaceBetData => {
  const [potentialBet] = createExcRunnerPotentialBetsByRunnerURNSelector()(state, runner);

  if (!potentialBet || potentialBet.size === undefined || potentialBet.price === undefined) {
    return null;
  }

  const { side, size, price } = potentialBet;
  const runnerTree = getExchangeRunnerTree(state.entities, runner);

  if (!runnerTree) {
    return null;
  }

  const { marketId } = runnerTree.market;
  const { selectionId, handicap } = runnerTree.marketRunner;

  return {
    marketId,
    selectionId,
    handicap,
    side,
    urn: runner,
    orderType: ORDER_TYPE,
    limitOrder: {
      size,
      price,
      persistenceType: PERSISTENCE_TYPE,
    },
  };
};
