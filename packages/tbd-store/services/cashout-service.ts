/**
 * @file Manages cashout services.
 */
import {
  exchangeCashoutQuoteCodec,
  exchangeMarketCodec,
  marketBetCodec,
  sportsbookCashoutQuoteCodec,
  sportsbookBetCodec,
} from "@ppb/tbd-urn-codecs";
import {
  CashoutReadOnly,
  CashoutTransactional,
  FixedOddsCashoutQuote,
  SportsbookCashoutOperation,
} from "@flutter-global/uki-channels-http-clients";
import { Quote } from "@flutter-global/uki-channels-http-clients/src/clients/Cashout/CashoutReadOnly/CashoutReadOnly";
import { GetQuoteResult } from "@flutter-global/uki-channels-http-clients/src/clients/FixedOddsCashoutQuote/FixedOddsCashoutQuote";
import { CashoutBetResp } from "@flutter-global/uki-channels-http-clients/src/clients/SportsbookCashoutOperation/FixedOddsTransactional";
import { CashoutResult } from "../state/entities";

import { createClientFactory } from "./client-factory";
import { ExchangeCashoutQuote, ExchangeCashouts } from "../state/betting/exchange-cashouts/ExchangeCashouts.types";
import {
  SportsbookCashoutQuote,
  SportsbookCashouts,
} from "../state/betting/sportsbook-cashouts/SportsbookCashouts.types";
import {
  ExchangeCashoutQuoteStatus,
  SportsbookCashoutQuoteStatus,
} from "../clients/catalogue/catalogue-response-types";

const cashoutReadOnlyClientFactory = createClientFactory(CashoutReadOnly);
const cashoutTransactionalClientFactory = createClientFactory(CashoutTransactional);
const sportsbookCashoutOperationFactory = createClientFactory(SportsbookCashoutOperation);
const fixedOddsCashoutQuoteFactory = createClientFactory(FixedOddsCashoutQuote);

function mapCosQuoteToExchangeQuote(quote: Quote): ExchangeCashoutQuote {
  const { marketId, handicap = 0, value, profit, status, currentLiability } = quote;
  const urn = exchangeCashoutQuoteCodec.encode(marketId, handicap).uid;
  const marketURN = exchangeMarketCodec.encode(marketId).uid;
  const marketBetURN = marketBetCodec.encode(marketId).uid;

  return {
    typename: "ExchangeCashoutQuote",
    urn,
    marketURN,
    marketBetURN,
    value,
    profit,
    currentLiability,
    status: status as ExchangeCashoutQuoteStatus,
  };
}

function mapFcqQuoteToSportsbookCashoutQuote(fcqQuote: GetQuoteResult): SportsbookCashoutQuote {
  const { quote, stake, betDelay, cashOutToken, refreshRate, quoteStatus, betId } = fcqQuote;

  let urn = "";
  let betUrn = "";
  if (betId != null) {
    urn = sportsbookCashoutQuoteCodec.encode(betId).uid;
    betUrn = sportsbookBetCodec.encode(betId).uid;
  }

  return {
    typename: "SportsbookCashoutQuote",
    urn,
    betUrn,
    quote,
    stake,
    betDelay,
    cashOutToken,
    refreshRate,
    status: quoteStatus as SportsbookCashoutQuoteStatus,
  };
}
/**
 * Cashout Service interface
 */
export default {
  /**
   * Retrieve requested markets cashout quotes from COS.
   *
   * @param currencyCode The currency code.
   * @param marketIds List of exchange market ids.
   *
   * @return Returns a object with all mapped quotes.
   */
  async quote(currencyCode: string, marketIds: string[]): Promise<ExchangeCashouts | Record<string, never>> {
    const cashoutReadOnly = cashoutReadOnlyClientFactory("COS_READONLY");
    const quotes: Quote[] = await cashoutReadOnly.quote(currencyCode, marketIds);

    return quotes.reduce((acc, quote) => {
      const exchangeQuote = mapCosQuoteToExchangeQuote(quote);
      return {
        ...acc,
        [exchangeQuote.urn]: { ...exchangeQuote },
      };
    }, {});
  },

  /**
   * Retrieve requested bets cashout quotes from FCQ.
   *
   * @param betIds List of sportsbook bet ids.
   *
   * @return Returns a object with all mapped quotes.
   */
  async betQuotes(betIds: string[]): Promise<SportsbookCashouts | Record<string, never>> {
    const fixedOddsCashoutQuote = fixedOddsCashoutQuoteFactory("FCQ");

    const betQuotes: Record<string, GetQuoteResult> = await fixedOddsCashoutQuote.getBetQuotes(betIds);

    return Object.values(betQuotes).reduce<SportsbookCashouts | Record<string, never>>((acc, betQuote) => {
      const sportsbookQuote = mapFcqQuoteToSportsbookCashoutQuote(betQuote);
      return {
        ...acc,
        [sportsbookQuote.urn]: { ...sportsbookQuote },
      };
    }, {});
  },

  /**
   * Sends EXC take cashout request to the COS service
   *
   * @param currencyCode The currency code
   * @param marketId The id of the market that we pretend to cashout
   * @param quoteValue The quote value
   * @param customerRef The customerRef
   * @param [handicap] The selection handicap
   * @param [quotePercentage] The quote percentage
   * @param [selectionId] The selection Id (to be used with the complementary handicap field)
   */
  async takeEXC(
    currencyCode: string,
    marketId: string,
    quoteValue: number,
    customerRef?: string,
    handicap?: number,
    quotePercentage?: number,
    selectionId?: number,
  ): Promise<CashoutResult | undefined> {
    const cashoutTransactional = cashoutTransactionalClientFactory("COS_TRANSACTIONAL");
    const response: CashoutResult = await cashoutTransactional.cashout(currencyCode, marketId, quoteValue, {
      customerRef,
      quotePercentage: quotePercentage || 100,
      selectionId,
      handicap,
    });

    return response;
  },

  /**
   * Perform the cashout for the provided SBK bet
   * Sends SBK take cashout request to the SCO service
   *
   * @param betDelay The time interval between the moment the user issues a cashout operation and the moment that operation will actually be executed; This is for validation purposes only, it will only verify if this value is truthful
   * @param betId The bet id whose cashout is being requested
   * @param cashOutToken The cash out token generated for a specific quote; Will become mandatory when bet id and quote attributes are removed
   * @param quote The cashout value requested by the user
   */
  async takeSBK(
    betDelay: number,
    betId: string,
    cashOutToken: string,
    quote: number,
  ): Promise<CashoutBetResp | undefined> {
    const sportsbookCashoutOperation = sportsbookCashoutOperationFactory("SCO");
    const response: CashoutBetResp = await sportsbookCashoutOperation.cashoutBet(betDelay, {
      betId,
      cashOutToken,
      quote,
    });

    return response;
  },
};
