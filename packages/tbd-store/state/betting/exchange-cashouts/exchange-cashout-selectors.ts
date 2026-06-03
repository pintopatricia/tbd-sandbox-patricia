import { createSelectorCreator, defaultMemoize } from "reselect";
import { ExchangeCashoutQuote, ExchangeCashouts } from "./ExchangeCashouts.types";
import URN from "../../layout/URN";
import { CashoutStep } from "../../constants";

const isQuoteEqual: (previous: ExchangeCashoutQuote, current: ExchangeCashoutQuote) => boolean = (previous, current) =>
  previous?.status === current?.status &&
  previous?.value === current?.value &&
  previous?.profit === current?.profit &&
  previous?.currentLiability === current?.currentLiability &&
  previous?.step === current?.step;

export const createExchangeCashoutQuoteSelector = () =>
  createSelectorCreator(defaultMemoize, isQuoteEqual)(
    (exchangecashouts: ExchangeCashouts, urn: URN): ExchangeCashoutQuote | undefined => exchangecashouts[urn],
    (exchangeCashoutQuote: ExchangeCashoutQuote | undefined) => exchangeCashoutQuote,
  );

const isQuotesSameSteps: (previous: ExchangeCashouts, current: ExchangeCashouts) => boolean = (previous, current) =>
  Object.values(previous).length === Object.values(current).length &&
  Object.values(previous).every((prevQuote) => prevQuote.step === current[prevQuote.urn].step);

export const createGetAllExchangeCashoutQuotesDisplayStatusSelector = () =>
  createSelectorCreator(defaultMemoize, isQuotesSameSteps)(
    (exchangecashouts: ExchangeCashouts): ExchangeCashouts => exchangecashouts,
    (exchangeCashouts: ExchangeCashouts) => ({
      ...Object.values(exchangeCashouts).reduce(
        (acc, quote) => ({
          ...acc,
          [quote.urn]: quote.step !== CashoutStep.HIDE,
        }),
        {} as Record<string, boolean>,
      ),
    }),
  );
