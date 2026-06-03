import URN from "../../layout/URN";
import { ExchangeCashoutQuoteStatus } from "../../../clients/catalogue/catalogue-response-types";
import { CashoutStep } from "../../constants";

export type ExchangeCashoutQuote = {
  urn: URN;
  typename: "ExchangeCashoutQuote";
  marketURN: URN;
  marketBetURN: URN;
  value?: number;
  profit?: number;
  status: ExchangeCashoutQuoteStatus;
  step?: CashoutStep;
  currentLiability?: number;
  cashedOutProfit?: number;
};

export type ExchangeCashouts = {
  [urn: string]: ExchangeCashoutQuote;
};
