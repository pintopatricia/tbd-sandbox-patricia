import { ApplicationState } from "../../ApplicationState.types";
import { ExchangeSide } from "../../constants";
import { ExchangeSide as ExchangeSideType } from "../exchange-bets/ExchangeBet.types";
import { PotentialBetState } from "./ExchangeBettingPotential.types";

export const getExchangePotentialState = (
  state: ApplicationState,
  runner: string,
  side: ExchangeSideType,
): PotentialBetState | null => {
  const runnerPotentialBets = state.betting.exchangeBettingPotential[runner];
  const potentialBet = side === ExchangeSide.BACK ? runnerPotentialBets?.back : runnerPotentialBets?.lay;
  return potentialBet || null;
};
