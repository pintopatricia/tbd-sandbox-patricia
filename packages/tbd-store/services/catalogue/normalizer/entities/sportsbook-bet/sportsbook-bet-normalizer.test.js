import { BetProduct } from "../../../../../state/betting/sportsbook-bets/SportsbookBet.types";
import { BetType, ResultType } from "../../../../../state/constants";
import { ResultEnum } from "../../../../../clients/catalogue/catalogue-response-types";
import normalizeSportsbookBetFragmentIntoSportsbookBet from "./sportsbook-bet-normalizer";

const BET_PRICE_MOCK = {
  decimal: 2.3,
  fractional: {
    numerator: 9,
    denominator: 1,
  },
};

const ORIGINAL_BET_PRICE_MOCK = {
  decimal: 2.3,
  fractional: {
    numerator: 9,
    denominator: 1,
  },
};

const GHOST_LEG_TOKEN_MOCK = {
  tokenId: "TOKEN_123",
  repricedDecimalOdds: 3.5,
  payout: 50.25,
};

const BET_MOCK = {
  urn: "ppb:tbd:sbkBet:1",
  betReceiptId: "1/O 123",
  betId: "1",
  isSettled: true,
  betType: "SGL",
  isSGM: true,
  isSGMMulti: false,
  isEachWay: false,
  has90MinBet: true,
  currentSize: 12.1,
  profitAndLoss: 312,
  originalPotentialWin: 311,
  potentialWinForPlace: 123,
  isOddsBoosted: true,
  isPBM: false,
  isPBS: false,
  isAccaInsuranceReward: false,
  ghostLegToken: GHOST_LEG_TOKEN_MOCK,
  numLines: 1,
  betPrice: BET_PRICE_MOCK,
  originalBetPrice: ORIGINAL_BET_PRICE_MOCK,
  result: ResultEnum.CashedOut,
  resultType: ResultType.POTENTIAL,
  bonus: 1,
  product: BetProduct.SPORTSBOOK,
  lowestEventStartTime: "lowestEventStartTimeMock",
  edges: [{ reason: "ACCA_INSURANCE", status: "ACTIVE" }],
  isLotteries: false,
};

const BET_CASHOUT_MOCK = {
  cashoutQuote: {
    urn: "ppb:sbkCashoutQuote:1020152481",
    betUrn: "ppb:sbkBet:1",
    cashOutToken: "6Nad6hGVSatAz4jPfBnZTmR0o9GN3WHpfAJPXcG",
    quote: 2,
    refreshRate: 10,
    stake: 2,
    betDelay: 0,
    status: "AVAILABLE",
  },
};

const buildBffResponse = ({ betId, ...betMock }, quoteMock) => ({
  ...betMock,
  id: betId,
  ...quoteMock,
  legs: [
    {
      urn: "urn:leg",
    },
  ],
});

describe("Sportsbook bets normalizer", () => {
  describe("normalizeSportsbookBetFragmentIntoSportsbookBet Data", () => {
    describe("When all fields are filled", () => {
      it("should return mapped sportsbook bet", () => {
        const BFF_RESPONSE = buildBffResponse(BET_MOCK, BET_CASHOUT_MOCK);
        expect(normalizeSportsbookBetFragmentIntoSportsbookBet(BFF_RESPONSE).data).toEqual({
          ...BET_MOCK,
          betType: BetType.SGL,
          isSGM: true,
          isPBM: false,
          isPBS: false,
          isAccaInsuranceReward: false,
          legs: ["urn:leg"],
          cashoutQuoteURN: "ppb:sbkCashoutQuote:1020152481",
        });
      });
    });

    describe("When all optional fields aren't filled", () => {
      it("should return mapped sportsbook bet", () => {
        const BFF_RESPONSE = buildBffResponse({
          ...BET_MOCK,
          result: null,
          resultType: null,
          profitAndLoss: null,
          originalPotentialWin: null,
          potentialWinForPlace: null,
          betPrice: null,
          originalBetPrice: null,
          bonus: null,
          regulatorBetId: null,
          settledDate: null,
          lowestEventStartTime: null,
          ghostLegToken: null,
        });
        expect(normalizeSportsbookBetFragmentIntoSportsbookBet(BFF_RESPONSE).data).toEqual({
          ...BET_MOCK,
          betPrice: undefined,
          originalBetPrice: undefined,
          result: undefined,
          resultType: undefined,
          betType: BetType.SGL,
          profitAndLoss: undefined,
          originalPotentialWin: undefined,
          potentialWinForPlace: undefined,
          ghostLegToken: null,
          legs: ["urn:leg"],
          cashoutQuoteURN: undefined,
          bonus: undefined,
          lowestEventStartTime: undefined,
        });
      });
    });

    describe("When there are no fractional odds", () => {
      it("should return mapped sportsbook bet", () => {
        const BFF_RESPONSE = buildBffResponse(
          {
            ...BET_MOCK,
            betPrice: { ...BET_PRICE_MOCK, fractional: null },
            originalBetPrice: { ...ORIGINAL_BET_PRICE_MOCK, fractional: null },
          },
          undefined,
        );
        expect(normalizeSportsbookBetFragmentIntoSportsbookBet(BFF_RESPONSE).data).toEqual({
          ...BET_MOCK,
          betType: BetType.SGL,
          betPrice: { ...BET_PRICE_MOCK, fractional: undefined },
          originalBetPrice: { ...ORIGINAL_BET_PRICE_MOCK, fractional: undefined },
          legs: ["urn:leg"],
          cashoutQuoteURN: undefined,
        });
      });
    });
  });
});
