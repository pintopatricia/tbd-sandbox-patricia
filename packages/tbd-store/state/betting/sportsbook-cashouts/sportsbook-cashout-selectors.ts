import { createSelector, createSelectorCreator, defaultMemoize } from "reselect";
import { SportsbookCashoutQuote, SportsbookCashouts } from "./SportsbookCashouts.types";
import URN from "../../layout/URN";
import { CashoutStep } from "../../constants";

/**
 * For a given cashout URN, returns the corresponding quote or undefined if there's none
 */
export const getQuoteByBetURN = (
  sportsbookcashouts: SportsbookCashouts,
  urn: URN,
): SportsbookCashoutQuote | undefined =>
  Object.values(sportsbookcashouts).find((quote: SportsbookCashoutQuote) => quote.betUrn === urn);

const isQuoteEqual: (previous: SportsbookCashoutQuote, current: SportsbookCashoutQuote) => boolean = (
  previous,
  current,
) =>
  previous?.status === current?.status &&
  previous?.quote === current?.quote &&
  previous?.stake === current?.stake &&
  previous?.cashOutToken === current?.cashOutToken &&
  previous?.step === current?.step;

export const createIsSportsbookCashoutQuoteDisplayedSelector = () =>
  createSelector(
    [(sportsbookCashouts: SportsbookCashouts) => sportsbookCashouts, (_: SportsbookCashouts, urn: URN) => urn],
    (sportsbookCashouts, urn): boolean =>
      !!sportsbookCashouts[urn] && sportsbookCashouts[urn].step !== CashoutStep.HIDE,
  );

export const createSportsbookCashoutQuoteSelector = () =>
  createSelectorCreator(defaultMemoize, isQuoteEqual)(
    (sportsbookcashouts: SportsbookCashouts, urn: URN): SportsbookCashoutQuote | undefined => sportsbookcashouts[urn],
    (exchangeCashoutQuote: SportsbookCashoutQuote | undefined) => exchangeCashoutQuote,
  );
