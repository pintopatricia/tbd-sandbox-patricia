import { createSelector } from "reselect";
import { ExchangeMarketBet } from "./ExchangeMarketBet.types";
import { ApplicationState } from "../../ApplicationState.types";
import URN from "../../layout/URN";

export type EnhancedExchangeMarketBet = ExchangeMarketBet & {
  betCardGroupURN?: URN;
  marketBetCardGroupURN?: URN[];
};

export const createExchangeMarketBetSelector = () =>
  createSelector(
    [
      (state: ApplicationState) => state.layouts.cardgroups.betcardgroups,
      (state: ApplicationState) => state.layouts.cardgroups.marketbetcardgroups,
      (state: ApplicationState) => state.layouts.cards.marketbetcard,
      (state: ApplicationState) => state.betting.exchangemarketbets,
      (_: ApplicationState, exchangeMarketBetURN: URN) => exchangeMarketBetURN,
    ],
    (
      betCardGroupsState,
      marketBetCardGroupsState,
      marketBetCardsState,
      exchangeMarketBetsState,
      exchangeMarketBetURN,
    ): EnhancedExchangeMarketBet | undefined => {
      const marketBet = exchangeMarketBetsState[exchangeMarketBetURN];

      if (!marketBet) {
        return undefined;
      }

      // Try to reverse search for all cards that contain this market bet
      const marketBetCards = Object.values(marketBetCardsState).filter((card) => card.marketBetURN === marketBet.urn);
      const marketBetCardUrns = marketBetCards.reduce((acc, value) => {
        acc.push(value.urn);
        return acc;
      }, [] as string[]);

      // Try to reverve search for all market bet card groups
      const marketBetCardGroupUrns = [] as string[];
      Object.values(marketBetCardGroupsState).forEach((cardgroup) =>
        cardgroup.items.forEach((item) => {
          if (marketBetCardUrns.includes(item.urn)) {
            marketBetCardGroupUrns.push(cardgroup.urn);
          }
        }),
      );

      // Finally, try to reverse search for the bet card groups
      let betCardGroupUrn;

      Object.values(betCardGroupsState).forEach((cardgroup) => {
        cardgroup.items.forEach((item) => {
          if (marketBetCardGroupUrns.includes(item.urn)) {
            betCardGroupUrn = cardgroup.urn;
          }
        });
      });

      return {
        ...marketBet,
        betCardGroupURN: betCardGroupUrn,
        marketBetCardGroupURN: marketBetCardGroupUrns,
      };
    },
  );
