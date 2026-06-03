import { UI__TOGGLE_SHOW_MORE_RUNNERS } from "@ppb/tbd-store/actions/interface";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const outrightMarketListCardMock = {
  urn: "ppb:tbd:card:outrightmarketlistcard:1",
  typename: "OutrightMarketListCard",
  title: "some title",
  numberOfRowsToDisplay: 2,
  markets: ["ppb:market:123", "ppb:market:456", "ppb:market:789"],
  favouriteMarketsStateURN: "ppb:tbd:favouriteMarkets:state:YaC9ThIAACAAN6LQ/e/34773107",
};

const EXPECTED_OUTRIGHT_MARKET_1 = {
  marketName: "market name 1",
  marketUrn: "ppb:market:123",
  runnersUrns: ["ppb:runner:123", "ppb:runner:456", "ppb:runner:789"],
};

const EXPECTED_OUTRIGHT_MARKET_2 = {
  marketName: "market name 2",
  marketUrn: "ppb:market:456",
  runnersUrns: ["ppb:runner:123", "ppb:runner:456", "ppb:runner:789"],
};

const EXPECTED_OUTRIGHT_MARKET_3 = {
  marketName: "market name 3",
  marketUrn: "ppb:market:789",
  runnersUrns: ["ppb:runner:123", "ppb:runner:456", "ppb:runner:789"],
};

const getOutrightMarketListCardbyURN = jest.fn(() => outrightMarketListCardMock);
const getOutrightMarketListViewModel = jest.fn(() => [
  EXPECTED_OUTRIGHT_MARKET_1,
  EXPECTED_OUTRIGHT_MARKET_2,
  EXPECTED_OUTRIGHT_MARKET_3,
]);

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getOutrightMarketListCardbyURN),
}));

jest.mock("../../view-model-factories/outright-market-list", () => ({
  createOutrightMarketListViewModel: jest.fn(() => getOutrightMarketListViewModel),
}));

const state = {
  layouts: {
    cards: {
      outrightmarketlistcards: ["ppb:card"],
    },
  },
  entities: {
    sportsbookmarkets: {
      "ppb:market:123": { urn: "ppb:market:123" },
    },
  },
};

const setupMapStateToProps = (urn) => makeMapStateToProps()(state, { urn });

describe("makeMapStateToProps", () => {
  let stateProps;
  beforeEach(jest.clearAllMocks);

  describe("when the card doesn't exist", () => {
    beforeEach(() => {
      getOutrightMarketListCardbyURN.mockReturnValue(null);
      getOutrightMarketListViewModel.mockReturnValue(null);

      stateProps = setupMapStateToProps("fakeOutrightMarketListCardUrn");
    });

    it("should call getOutrightMarketListCardbyURN with the outright market list cards state and the expected urn", () => {
      expect(getOutrightMarketListCardbyURN).toHaveBeenCalledWith(
        state.layouts.cards.outrightmarketlistcards,
        "fakeOutrightMarketListCardUrn",
      );
    });

    it("should not call getOutrightMarketListViewModel", () => {
      expect(getOutrightMarketListViewModel).not.toHaveBeenCalled();
    });

    it("should return an empty object", () => {
      expect(stateProps).toEqual({});
    });
  });

  describe("when the card exists", () => {
    beforeEach(() => {
      getOutrightMarketListCardbyURN.mockReturnValue(outrightMarketListCardMock);
      getOutrightMarketListViewModel.mockReturnValue([
        EXPECTED_OUTRIGHT_MARKET_1,
        EXPECTED_OUTRIGHT_MARKET_2,
        EXPECTED_OUTRIGHT_MARKET_3,
      ]);

      stateProps = setupMapStateToProps("ppb:tbd:card:outrightmarketlistcard:1");
    });

    it("should call getOutrightMarketListCardbyURN with the outright market list cards state and the expected urn", () => {
      expect(getOutrightMarketListCardbyURN).toHaveBeenCalledWith(
        state.layouts.cards.outrightmarketlistcards,
        "ppb:tbd:card:outrightmarketlistcard:1",
      );
    });

    it("should call getOutrightMarketListViewModel with state and expected markets", () => {
      expect(getOutrightMarketListViewModel).toHaveBeenCalledWith(state, outrightMarketListCardMock.markets);
    });

    it("should return the expected props", () => {
      expect(stateProps).toEqual({
        cardUrn: "ppb:tbd:card:outrightmarketlistcard:1",
        numberOfRowsToDisplay: 2,
        title: "some title",
        outrightMarkets: [EXPECTED_OUTRIGHT_MARKET_1, EXPECTED_OUTRIGHT_MARKET_2, EXPECTED_OUTRIGHT_MARKET_3],
        favouriteMarketsStateURN: "ppb:tbd:favouriteMarkets:state:YaC9ThIAACAAN6LQ/e/34773107",
      });
    });

    describe("when getOutrightMarketListViewModel returns an empty array of markets", () => {
      beforeEach(() => {
        getOutrightMarketListCardbyURN.mockReturnValue(outrightMarketListCardMock);
        getOutrightMarketListViewModel.mockReturnValue([]);

        stateProps = setupMapStateToProps("ppb:tbd:card:outrightmarketlistcard:1");
      });

      it("should return an empty object", () => {
        expect(stateProps).toEqual({});
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  describe("dispatchToggleShowMoreRunners", () => {
    it("should dispatch toggle show more runners action", () => {
      const { dispatchToggleShowMoreRunners } = mapDispatchToProps;

      const cardUrn = "some:card:urn";
      const showMore = true;

      expect(dispatchToggleShowMoreRunners(cardUrn, showMore)).toEqual({
        payload: { cardUrn, showMore },
        type: UI__TOGGLE_SHOW_MORE_RUNNERS,
      });
    });
  });

  describe("dispatchRefreshCard", () => {
    it("should return action creator to start refresh", () => {
      const { dispatchRefreshCard } = mapDispatchToProps;

      expect(dispatchRefreshCard("cardURN", true)).toEqual({
        payload: "cardURN",
        type: "START_REFRESH_CARD",
      });
    });
    it("should return action creator to stop refresh", () => {
      const { dispatchRefreshCard } = mapDispatchToProps;

      expect(dispatchRefreshCard("cardURN", false)).toEqual({
        payload: "cardURN",
        type: "STOP_REFRESH_CARD",
      });
    });
  });
});
