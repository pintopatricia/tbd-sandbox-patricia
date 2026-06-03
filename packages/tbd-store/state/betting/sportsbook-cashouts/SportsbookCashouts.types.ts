import URN from "../../layout/URN";
import { SportsbookCashoutQuoteStatus } from "../../../clients/catalogue/catalogue-response-types";
import { CashoutStep } from "../../constants";

export type SportsbookCashoutQuote = {
  urn: URN;
  typename: "SportsbookCashoutQuote";
  betUrn: URN;
  quote?: number;
  stake?: number;
  betDelay?: number;
  cashOutToken?: string;
  refreshRate?: number;
  status: SportsbookCashoutQuoteStatus;
  step?: CashoutStep;
  cashedOutProfit?: number;
};

export type SportsbookCashouts = {
  [urn: string]: SportsbookCashoutQuote;
};
