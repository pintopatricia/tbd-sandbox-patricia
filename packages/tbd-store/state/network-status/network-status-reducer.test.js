import { FETCH_CATALOGUE_IN_PROGRESS, PAGE_LOAD_SUCCESS } from "../../actions/catalogue";
import { NETWORK_STATUS__UPDATE } from "../../actions/network-status";
import networkStatusReducer from "./network-status-reducer";

describe("networkStatusReducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the default state", () => {
      const state = networkStatusReducer({ networkStatus: "OFFLINE" }, {});
      expect(state).toEqual({ networkStatus: "OFFLINE" });
    });
  });

  describe("when no state is provided", () => {
    it("should return initial state", () => {
      const state = networkStatusReducer(undefined, {});
      expect(state).toEqual({ networkStatus: "ONLINE", isFetchCatalogueViewSuccess: true });
    });
  });

  describe('when action type is "NETWORK_STATUS/UPDATE"', () => {
    it("must return the new state with networkStatus ONLINE", () => {
      const action = {
        type: NETWORK_STATUS__UPDATE,
        payload: {
          networkStatus: "ONLINE",
        },
      };

      const state = networkStatusReducer({ networkStatus: "OFFLINE" }, action);
      expect(state).toEqual({ networkStatus: "ONLINE" });
    });
  });

  describe('when action type is "PAGE_LOAD_SUCCESS"', () => {
    it("must return the new state with isFetchCatalogueViewSuccess as true", () => {
      const action = {
        type: PAGE_LOAD_SUCCESS,
      };

      const state = networkStatusReducer({}, action);
      expect(state).toEqual({ isFetchCatalogueViewSuccess: true });
    });
  });

  describe('when action type is "FETCH_CATALOGUE_IN_PROGRESS"', () => {
    it("must return the new state with isFetchCatalogueViewSuccess as false", () => {
      const action = {
        type: FETCH_CATALOGUE_IN_PROGRESS,
      };

      const state = networkStatusReducer({}, action);
      expect(state).toEqual({ isFetchCatalogueViewSuccess: false });
    });
  });
});
