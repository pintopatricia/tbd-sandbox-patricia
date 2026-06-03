import { maintenanceReducer } from "./maintenance-view-reducer";

describe("maintenanceReducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = maintenanceReducer(undefined, {
        type: "OTHER_ACTION",
      });

      expect(state).toEqual({});
    });
  });

  describe("when no state is provided", () => {
    it("should return initial state", () => {
      const state = maintenanceReducer(undefined, {});

      expect(state).toEqual({});
    });
  });

  describe("when action is FETCH_CATALOGUE_SUCCESS", () => {
    it("should override state views with payload views", () => {
      const result = maintenanceReducer(
        {},
        {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              MaintenanceView: [
                {
                  urn: "urn:1",
                  items: [
                    {
                      urn: "urn:card:2",
                      prop: "value",
                    },
                  ],
                },
              ],
            },
          },
        },
      );

      expect(result).toEqual({
        "urn:1": {
          urn: "urn:1",
          items: [{ urn: "urn:card:2", prop: "value" }],
        },
      });
    });
  });
});
