import {
  ObbQuoteSuccessFragment,
  ObbQuoteErrorFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { NormalizedObbQuote } from "./ObbQuotes.types";

const normalizeObbQuoteFragmentIntoObbQuote = (
  obbQuote: ObbQuoteSuccessFragment | ObbQuoteErrorFragment,
): NormalizedObbQuote => {
  // eslint-disable-next-line no-underscore-dangle
  if (obbQuote.__typename === "ObbQuoteSuccess") {
    return {
      // eslint-disable-next-line no-underscore-dangle
      typename: "ObbQuoteSuccess",
      price: {
        // eslint-disable-next-line no-underscore-dangle
        typename: obbQuote.price.__typename,
        decimal: obbQuote.price.decimal,
        fractional: {
          // eslint-disable-next-line no-underscore-dangle
          typename: obbQuote.price.fractional.__typename,
          numerator: obbQuote.price.fractional.numerator,
          denominator: obbQuote.price.fractional.denominator,
        },
      },
    };
  }

  return {
    // eslint-disable-next-line no-underscore-dangle
    typename: "ObbQuoteError",
    errorCode: obbQuote.errorCode,
    errorDetails: obbQuote.errorDetails,
  };
};

export default normalizeObbQuoteFragmentIntoObbQuote;
