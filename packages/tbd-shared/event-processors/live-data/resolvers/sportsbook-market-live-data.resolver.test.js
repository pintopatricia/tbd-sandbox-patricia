import { getApolloClient } from "../../../apollo-client/client";
import { updateMarketLiveData } from "./sportsbook-market-live-data-resolver";

jest.mock("@ppb/tbd-store/middlewares/sportsbook-market-prices-observable", () => ({
  getInstance: jest.fn().mockReturnValue({
    subscribe: jest.fn(),
    addMarket: jest.fn(),
    removeMarket: jest.fn(),
  }),
}));

jest.mock("../../../apollo-client/client", () => {
  const modify = jest.fn();

  return {
    getApolloClient: jest.fn(() => ({
      cache: {
        modify,
        identify: jest.fn(() => "SportsbookMarket:ppb:sbkMarket:1"),
      },
    })),
  };
});

describe("sportsbook-market-live-data-resolver", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("updateMarketLiveData", () => {
    const setup = ({ payload }) => {
      updateMarketLiveData(payload);
    };

    describe("when the payload is empty", () => {
      it("should not call cache.modify", () => {
        setup({ payload: { markets: [] } });
        expect(getApolloClient().cache.modify).not.toHaveBeenCalled();
      });
    });

    describe("when the payload has something new", () => {
      it("should call cache.modify with every fields", () => {
        const payload = {
          markets: [{ urn: "ppb:sbkMarket:930.331454682", status: "OPEN" }],
        };

        setup({ payload });

        expect(getApolloClient().cache.modify).toHaveBeenCalledWith({
          fields: {
            sportsbookMarketStatus: expect.any(Function),
          },
          id: "SportsbookMarket:ppb:sbkMarket:1",
        });
      });
    });

    describe("when is an update on sportsbookMarketStatus field", () => {
      it("should update the sportsbookMarketStatus field in cache", () => {
        const payload = {
          markets: [{ urn: "ppb:sbkMarket:930.331454682", status: "SUSPENDED" }],
        };

        setup({ payload });

        const mockCacheModify = getApolloClient().cache.modify;
        const sportsbookMarketStatusModifier = mockCacheModify.mock.calls[0][0].fields.sportsbookMarketStatus;
        const cachedValue = {
          sportsbookMarketStatus: "OPEN",
        };
        const result = sportsbookMarketStatusModifier(cachedValue);

        expect(result).toEqual("SUSPENDED");
      });
    });
  });
});
