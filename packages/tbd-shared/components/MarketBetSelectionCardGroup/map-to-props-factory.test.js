import { makeMapStateToProps, makeMapDispatchToProps } from "./map-to-props-factory";

const getCardGroupByURN = jest.fn();

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: () => getCardGroupByURN,
}));

const marketBetSelectionCardGroup = {
  urn: "market-bet-selection-card-group-urn-mock",
  typename: "MarketBetSelectionCardGroup",
  marketBetCardGroupURN: "marketBetCardGroupURN",
  items: [
    {
      typename: "MarketBetSelectionCard",
      urn: "market-bet-selection-card-urn-mock",
    },
  ],
};

const DEFAULT_STATE = {
  layouts: {
    cardgroups: {
      marketbetselectioncardgroups: "marketbetselectioncardgroups",
    },
  },
};

describe("makeMapStateToProps", () => {
  function setup() {
    return makeMapStateToProps()(DEFAULT_STATE, { urn: "URN" });
  }

  beforeEach(jest.clearAllMocks);

  describe("when getCardGroupByURN does not return a market bet selection card group", () => {
    it("should return an empty object", () => {
      getCardGroupByURN.mockReturnValueOnce(undefined);

      expect(setup()).toEqual({});
    });
  });

  describe("when there's an MarketBetSelectionCardGroup available", () => {
    it("should return the correct state props", () => {
      getCardGroupByURN.mockReturnValueOnce(marketBetSelectionCardGroup);

      expect(setup()).toEqual({
        items: marketBetSelectionCardGroup.items,
      });
    });
  });
});

describe("makeMapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should be an empty object", () => {
    expect(makeMapDispatchToProps()).toEqual({});
  });
});
