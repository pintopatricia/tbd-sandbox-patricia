import { ExchangeSide } from "../../../../../state/constants";
import normalizeMarketBetSelectionCardFragmentIntoMarketBetSelectionCard from "./market-bet-selection-card-normalizer";

describe("normalizeMarketBetSelectionCardFragmentIntoMarketBetSelectionCard", () => {
  const fragmentMock = {
    __typename: "typename",
    urn: "URN",
    id: "id",
    handicap: "handicap",
    placedDate: "placedDate",
    settledDate: "settledDate",
    matchedDate: "matchedDate",
    price: "price",
    runnerDesc: "runnerDesc",
    side: ExchangeSide.BACK,
    isCashout: "isCashout",
    size: "size",
    profit: "profit",
    result: "result",
    isBsp: "isBsp",
    bspLiability: "bspLiability",
    liability: "liability",
    editViewLink: "editViewLink",
    marketBetCardGroupURN: "marketBetCardGroupURN",
    isUnmatched: "isUnmatched",
  };

  const onlyMandatoryFragmentMock = {
    __typename: "typename",
    urn: "URN",
    id: "id",
    handicap: "handicap",
    placedDate: "placedDate",
    settledDate: null,
    matchedDate: null,
    price: "price",
    runnerDesc: "runnerDesc",
    side: null,
    isCashout: null,
    size: null,
    profit: null,
    result: null,
    editViewLink: null,
    isBsp: null,
    bspLiability: null,
    liability: null,
    marketBetCardGroupURN: "marketBetCardGroupURN",
    isUnmatched: "isUnmatched",
  };

  it("should correctly normalize the card", () => {
    expect(normalizeMarketBetSelectionCardFragmentIntoMarketBetSelectionCard(fragmentMock)).toEqual({
      data: {
        typename: "typename",
        urn: "URN",
        id: "id",
        handicap: "handicap",
        placedDate: "placedDate",
        settledDate: "settledDate",
        matchedDate: "matchedDate",
        price: "price",
        runnerDesc: "runnerDesc",
        side: ExchangeSide.BACK,
        isCashout: "isCashout",
        size: "size",
        profit: "profit",
        result: "result",
        editViewLink: "editViewLink",
        marketBetCardGroupURN: "marketBetCardGroupURN",
        isUnmatched: "isUnmatched",
        bspLiability: "bspLiability",
        liability: "liability",
        isBsp: "isBsp",
      },
    });
  });

  it("should correctly normalize the card when only the mandatory fields are available", () => {
    expect(normalizeMarketBetSelectionCardFragmentIntoMarketBetSelectionCard(onlyMandatoryFragmentMock)).toEqual({
      data: {
        typename: "typename",
        urn: "URN",
        id: "id",
        handicap: "handicap",
        placedDate: "placedDate",
        price: "price",
        runnerDesc: "runnerDesc",
        isCashout: false,
        marketBetCardGroupURN: "marketBetCardGroupURN",
        isUnmatched: "isUnmatched",
      },
    });
  });
});
