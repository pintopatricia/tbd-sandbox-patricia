import { SportsbookMarketStatus } from "../../constants";
import { FETCH_CATALOGUE_SUCCESS, NETWORK__SBK_MARKETS_SUCCESS } from "../../../actions/catalogue";
import { reduceEntities } from "../create-entity-reducer";
import virtualMarketReducer from "./virtual-market-reducer";

jest.mock("../create-entity-reducer", () => ({
  reduceEntities: jest.fn((state) => state),
}));

const stateMock = {
  "v:m:1": {
    typename: "VirtualMarket",
    urn: "v:m:1",
    status: SportsbookMarketStatus.OPEN,
  },
  "v:m:2": {
    typename: "VirtualMarket",
    urn: "v:m:2",
    status: SportsbookMarketStatus.CLOSED,
  },
  "v:m:3": {
    typename: "VirtualMarket",
    urn: "v:m:3",
    status: SportsbookMarketStatus.OPEN,
  },
};

describe('"virtualmarkets" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = virtualMarketReducer(undefined, {});

      expect(state).toEqual({});
    });
  });

  describe.each([NETWORK__SBK_MARKETS_SUCCESS, FETCH_CATALOGUE_SUCCESS])("when action type is %s", (type) => {
    it("should call entity reducer", () => {
      const action = {
        type,
        payload: {
          entities: {},
          data: {},
        },
      };

      virtualMarketReducer(stateMock, action);

      expect(reduceEntities).toHaveBeenCalledWith(stateMock, action.payload, "VirtualMarket");
    });
  });
});
