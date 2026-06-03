import { ExchangeCashoutQuoteFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { ExchangeCashoutQuote } from "../../../../../state/betting/exchange-cashouts/ExchangeCashouts.types";
import { CashoutStep } from "../../../../../state/constants";

const normalizeExchangeCashoutQuoteFragmentIntoExchangeCashoutQuote = (
  exchangeCashoutQuote: ExchangeCashoutQuoteFragment,
): TransformedFragment<ExchangeCashoutQuote> => {
  const { urn, marketURN, marketBetURN, value, profit, currentLiability, status, __typename } = exchangeCashoutQuote;

  return {
    data: {
      typename: __typename,
      urn,
      marketURN,
      marketBetURN,
      value: value === null ? undefined : value,
      profit: profit === null ? undefined : profit,
      currentLiability: currentLiability === null ? undefined : currentLiability,
      status,
      step: CashoutStep.DISPLAY,
    },
  };
};

export default normalizeExchangeCashoutQuoteFragmentIntoExchangeCashoutQuote;
