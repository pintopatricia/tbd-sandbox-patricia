export type NormalizedObbQuote = NormalizedObbQuoteSuccess | NormalizedObbQuoteError;

export type NormalizedObbQuoteSuccess = {
  typename: "ObbQuoteSuccess";
  price: NormalizedObbSportsbookOdds;
};

export type NormalizedObbQuoteError = {
  typename: "ObbQuoteError";
  errorCode: string;
  errorDetails: string | null;
};

export type NormalizedObbSportsbookOdds = {
  typename: "ObbOdds";
  fractional: {
    typename: "FractionalOdds";
    numerator: number;
    denominator: number;
  };
  decimal: number;
};
