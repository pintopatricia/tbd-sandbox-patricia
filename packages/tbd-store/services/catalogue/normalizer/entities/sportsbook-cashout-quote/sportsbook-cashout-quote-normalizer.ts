import { SportsbookCashoutQuoteFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { SportsbookCashoutQuote } from "../../../../../state/betting/sportsbook-cashouts/SportsbookCashouts.types";
import { CashoutStep } from "../../../../../state/constants";

const normalizeSportsbookCashoutQuoteFragmentIntoSportsbookCashoutQuote = (
  sportsbookCashoutQuote: SportsbookCashoutQuoteFragment,
): TransformedFragment<SportsbookCashoutQuote> => {
  const { urn, betUrn, quote, stake, betDelay, cashOutToken, refreshRate, status, __typename } = sportsbookCashoutQuote;

  return {
    data: {
      typename: __typename,
      urn,
      betUrn,
      quote: quote === null ? undefined : quote,
      stake: stake === null ? undefined : stake,
      betDelay: betDelay === null ? undefined : betDelay,
      cashOutToken: cashOutToken === null ? undefined : cashOutToken,
      refreshRate: refreshRate === null ? undefined : refreshRate,
      status,
      step: CashoutStep.DISPLAY,
    },
  };
};

export default normalizeSportsbookCashoutQuoteFragmentIntoSportsbookCashoutQuote;
