import { FETCH_CARDS } from "@ppb/tbd-store/actions/catalogue";
import {
  createGetHydratedExpandableMarketCardByURNSelector,
  createPartialExpandableMarketCardByURNSelector,
} from "@ppb/tbd-store/state/layout/cards/expandable-market/expandable-market-selectors";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const stateMock = {
  layouts: {
    cards: {
      expandablemarkets: "expandablemarkets",
    },
  },
};

const HYDRATED_MOCK = {
  title: "hydrated title",
  urn: "expandableMarketCardUrn",
  marketCardURN: "marketCardURN",
};

const PARTIAL_MOCK = {
  title: "partial title",
  urn: "expandableMarketCardUrn",
};

const getHydratedExpandableMarketCardByURN = jest.fn();
const getPartialExpandableMarketCard = jest.fn();

jest.mock("@ppb/tbd-store/state/layout/cards/expandable-market/expandable-market-selectors", () => ({
  createGetHydratedExpandableMarketCardByURNSelector: jest.fn(() => getHydratedExpandableMarketCardByURN),
  createPartialExpandableMarketCardByURNSelector: jest.fn(() => getPartialExpandableMarketCard),
}));

describe("mapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should create all selectors", () => {
    makeMapStateToProps();

    expect(createGetHydratedExpandableMarketCardByURNSelector).toHaveBeenCalledTimes(1);
    expect(createPartialExpandableMarketCardByURNSelector).toHaveBeenCalledTimes(1);
  });

  describe("getHydratedExpandableMarketCardByURN", () => {
    it("should call getHydratedExpandableMarketCardByURN with the correct arguments", () => {
      makeMapStateToProps()(stateMock, { urn: "expandableMarketCardUrn" });

      expect(getHydratedExpandableMarketCardByURN).toHaveBeenCalledWith("expandablemarkets", "expandableMarketCardUrn");
    });

    describe("when getHydratedExpandableMarketCardByURN returns null", () => {
      it("should return an empty object", () => {
        getHydratedExpandableMarketCardByURN.mockReturnValueOnce(undefined);

        const result = makeMapStateToProps()(stateMock, { urn: "expandableMarketCardUrn" });

        expect(result).toEqual({});
      });
    });

    describe("when getHydratedExpandableMarketCardByURN returns a card", () => {
      it("should return the card title, marketCardURN and its own urn", () => {
        getHydratedExpandableMarketCardByURN.mockReturnValueOnce(HYDRATED_MOCK);
        const result = makeMapStateToProps()(stateMock, { urn: "expandableMarketCardUrn" });

        expect(result).toEqual({
          isShell: false,
          title: HYDRATED_MOCK.title,
          marketCardURN: "marketCardURN",
          urn: "expandableMarketCardUrn",
        });
      });
    });
  });

  describe("getPartialExpandableMarketCard", () => {
    it("should call getPartialExpandableMarketCard with the correct arguments", () => {
      makeMapStateToProps()(stateMock, { urn: "expandableMarketCardUrn" });

      expect(getPartialExpandableMarketCard).toHaveBeenCalledWith("expandablemarkets", "expandableMarketCardUrn");
    });

    describe("when getPartialExpandableMarketCard returns null", () => {
      it("should return an empty object", () => {
        getPartialExpandableMarketCard.mockReturnValueOnce(undefined);

        const result = makeMapStateToProps()(stateMock, { urn: "expandableMarketCardUrn" });

        expect(result).toEqual({});
      });
    });

    describe("when title is not defined", () => {
      it("should return an empty object", () => {
        getPartialExpandableMarketCard.mockReturnValueOnce({ urn: "expandableMarketCardUrn" });
        const result = makeMapStateToProps()(stateMock, { urn: "expandableMarketCardUrn" });

        expect(result).toEqual({});
      });
    });

    describe("when getPartialExpandableMarketCard returns a card", () => {
      it("should return the card title, marketCardURN and its own urn", () => {
        getPartialExpandableMarketCard.mockReturnValueOnce(PARTIAL_MOCK);
        const result = makeMapStateToProps()(stateMock, { urn: "expandableMarketCardUrn" });

        expect(result).toEqual({
          isShell: true,
          title: PARTIAL_MOCK.title,
        });
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("dispatchFetchFullCardAction", () => {
    it("should dispatch the fetch full card action with the given URN", () => {
      const { dispatchFetchFullCardAction } = mapDispatchToProps;

      expect(dispatchFetchFullCardAction("urn:fake")).toEqual({
        payload: {
          urns: ["urn:fake"],
        },
        type: FETCH_CARDS,
      });
    });
  });
});
