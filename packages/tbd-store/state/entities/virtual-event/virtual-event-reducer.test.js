import { FETCH_CATALOGUE_SUCCESS, NETWORK__SBK_MARKETS_SUCCESS } from "../../../actions/catalogue";
import { reduceEntities } from "../create-entity-reducer";
import virtualEventReducer from "./virtual-event-reducer";

jest.mock("../create-entity-reducer", () => ({
  reduceEntities: jest.fn((state) => state),
}));

const stateMock = {
  "v:e:1": {
    typename: "VirtualEvent",
    urn: "v:e:1",
    isExpired: false,
  },
};

describe('"virtualevents" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = virtualEventReducer(undefined, {});

      expect(state).toEqual({});
    });
  });

  describe.each([NETWORK__SBK_MARKETS_SUCCESS, FETCH_CATALOGUE_SUCCESS])("when action type is %s", (type) => {
    it("should call entity reducer", () => {
      const action = {
        type,
        payload: {
          data: {},
        },
      };

      virtualEventReducer(stateMock, action);

      expect(reduceEntities).toHaveBeenCalledWith(stateMock, action.payload, "VirtualEvent");
    });
  });
});
