import { createSelector } from "reselect";
import URN from "../URN";
import { BettableCard, Card, Cards } from "./Card.types";
import { createGetHydratedExpandableMarketCardByURNSelector } from "./expandable-market/expandable-market-selectors";

export function createCardByURNSelector<S, K extends keyof S>() {
  return createSelector(
    [(stateSlice: S) => stateSlice, (_: S, urn: K) => urn],
    (cards, urn): S[K] | null => cards?.[urn] ?? null,
  );
}

const expandableMarketCardByURNSelector = createGetHydratedExpandableMarketCardByURNSelector();

// Why created this like? Reason:
// https://github.com/reduxjs/reselect#q-i-am-seeing-a-typescript-error-type-instantiation-is-excessively-deep-and-possibly-infinite
const allCardSelectors: ((cards: Cards, urn: URN) => Card)[] = [
  (cards: Cards, urn: URN) => cards.markets[urn],
  (cards: Cards, urn: URN) => cards.racemarkets[urn],
  (cards: Cards, urn: URN) => cards.marketsextended[urn],
  (cards: Cards, urn: URN) => cards.eventmarkets[urn],
  (cards: Cards, urn: URN) => cards.fixtures[urn],
  (cards: Cards, urn: URN) => cards.headtoheads[urn],
  (cards: Cards, urn: URN) => cards.recentforms[urn],
  (cards: Cards, urn: URN) => cards.eventviewlinks[urn],
  (cards: Cards, urn: URN) => cards.marketviewlinks[urn],
  (cards: Cards, urn: URN) => cards.matchtimelines[urn],
  (cards: Cards, urn: URN) => cards.matchstats[urn],
  (cards: Cards, urn: URN) => cards.matchstatselections[urn],
  (cards: Cards, urn: URN) => cards.marketrules[urn],
  (cards: Cards, urn: URN) => cards.competitionviewlinks[urn],
  (cards: Cards, urn: URN) => cards.quicklinks[urn],
  (cards: Cards, urn: URN) => cards.games[urn],
  (cards: Cards, urn: URN) => cards.gameinfos[urn],
  (cards: Cards, urn: URN) => cards.gaminglinks[urn],
  (cards: Cards, urn: URN) => cards.links[urn],
  (cards: Cards, urn: URN) => cards.balance[urn],
  (cards: Cards, urn: URN) => cards.rewards[urn],
  (cards: Cards, urn: URN) => cards.accountBanners[urn],
  (cards: Cards, urn: URN) => cards.sportsbookbets[urn],
  (cards: Cards, urn: URN) => cards.marketgraphs[urn],
  (cards: Cards, urn: URN) => cards.highlightedselections[urn],
  (cards: Cards, urn: URN) => cards.promotions[urn],
  (cards: Cards, urn: URN) => cards.racedetails[urn],
  (cards: Cards, urn: URN) => cards.raceviewlinks[urn],
  (cards: Cards, urn: URN) => cards.contentsummary[urn],
  (cards: Cards, urn: URN) => cards.gamingjackpots[urn],
  (cards: Cards, urn: URN) => cards.gamingplaynews[urn],
  (cards: Cards, urn: URN) => cards.raceviewlink[urn],
  (cards: Cards, urn: URN) => cards.broadcasts[urn],
  (cards: Cards, urn: URN) => cards.broadcastsandstatistics[urn],
  (cards: Cards, urn: URN) => cards.imspromotiondetails[urn],
  (cards: Cards, urn: URN) => cards.imspromotiontermsandconditions[urn],
  (cards: Cards, urn: URN) => cards.imspromotionstate[urn],
  (cards: Cards, urn: URN) => cards.runnerinfos[urn],
  (cards: Cards, urn: URN) => cards.imspromotionerror[urn],
  (cards: Cards, urn: URN) => cards.regulatory[urn],
  (cards: Cards, urn: URN) => cards.sportviewlinks[urn],
  (cards: Cards, urn: URN) => cards.preferencesinglechoices[urn],
  (cards: Cards, urn: URN) => cards.racebytimerangecards[urn],
  (cards: Cards, urn: URN) => cards.forbiddencontent[urn],
  (cards: Cards, urn: URN) => cards.genericviewlinks[urn],
  (cards: Cards, urn: URN) => cards.competitionregions[urn],
  (cards: Cards, urn: URN) => cards.budgetLimits[urn],
  (cards: Cards, urn: URN) => cards.couponheaders[urn],
  (cards: Cards, urn: URN) => cards.raceresults[urn],
  (cards: Cards, urn: URN) => cards.timeformbroadcasts[urn],
  (cards: Cards, urn: URN) => cards.grids[urn],
  (cards: Cards, urn: URN) => expandableMarketCardByURNSelector(cards.expandablemarkets, urn) as Card,
  (cards: Cards, urn: URN) => cards.virtualeventdetails[urn],
  (cards: Cards, urn: URN) => cards.virtualmarket[urn],
  (cards: Cards, urn: URN) => cards.popularbetbuilders[urn],
  (cards: Cards, urn: URN) => cards.packagedcreatedbets[urn],
  (cards: Cards, urn: URN) => cards.priceboostmultislistcards[urn],
  (cards: Cards, urn: URN) => cards.popularmultiplesbetbuilders[urn],
  (cards: Cards, urn: URN) => cards.correctscorecards[urn],
  (cards: Cards, urn: URN) => cards.outrightmarketlistcards[urn],
  (cards: Cards, urn: URN) => cards.eventheader[urn],
  (cards: Cards, urn: URN) => cards.eventstats[urn],
  (cards: Cards, urn: URN) => cards.betlegs[urn],
  (cards: Cards, urn: URN) => cards.sportsbookbetinfos[urn],
  (cards: Cards, urn: URN) => cards.marketbetcard[urn],
  (cards: Cards, urn: URN) => cards.marketbetselectioncard[urn],
  (cards: Cards, urn: URN) => cards.embeddedcontents[urn],
  (cards: Cards, urn: URN) => cards.searchBar[urn],
  (cards: Cards, urn: URN) => cards.extrawallet[urn],
  (cards: Cards, urn: URN) => cards.priceboostmulticards[urn],
  (cards: Cards, urn: URN) => cards.obbcards[urn],
  (cards: Cards, urn: URN) => cards.blurb[urn],
  (cards: Cards, urn: URN) => cards.matchstatselections[urn],
  (cards: Cards, urn: URN) => cards.obbcreatedbetscards[urn],
  (cards: Cards, urn: URN) => cards.obbeventpopularscards[urn],
];

export const createFindCardbyURNSelector = () =>
  createSelector([...allCardSelectors], (...cards) => cards.find((card) => !!card) || null);

/**
 * For a given card URN, card must be bettable (has bet buttons), returns the
 * corresponding card or null if there's none
 */
export const createBettableCardByURNSelector = () =>
  createSelector(
    [
      (cards: Cards, urn: URN) => cards.markets[urn],
      (cards: Cards, urn: URN) => cards.virtualmarket[urn],
      (cards: Cards, urn: URN) => cards.marketsextended[urn],
      (cards: Cards, urn: URN) => cards.eventmarkets[urn],
      (cards: Cards, urn: URN) => cards.racemarkets[urn],
      (cards: Cards, urn: URN) => cards.highlightedselections[urn],
      (cards: Cards, urn: URN) => cards.matchstatselections[urn],
      (cards: Cards, urn: URN) => cards.fixtures[urn],
      (cards: Cards, urn: URN) => cards.promotions[urn],
      (cards: Cards, urn: URN) => cards.grids[urn],
      (cards: Cards, urn: URN) => cards.correctscorecards[urn],
      (cards: Cards, urn: URN) => cards.outrightmarketlistcards[urn],
      (cards: Cards, urn: URN) => cards.extrawallet[urn],
    ],
    (
      marketCard,
      virtualMarketCard,
      marketExtendedCard,
      eventMarketCard,
      raceMarketCard,
      highlightedSelectionCard,
      fixtureCard,
      promotionCard,
      gridCard,
      correctScoreCard,
      outrightMarketListCard,
      extraWalletCard,
      matchStatSelectionCard,
    ): BettableCard | null =>
      marketCard ||
      virtualMarketCard ||
      marketExtendedCard ||
      eventMarketCard ||
      raceMarketCard ||
      highlightedSelectionCard ||
      fixtureCard ||
      promotionCard ||
      gridCard ||
      correctScoreCard ||
      outrightMarketListCard ||
      extraWalletCard ||
      matchStatSelectionCard ||
      null,
  );
