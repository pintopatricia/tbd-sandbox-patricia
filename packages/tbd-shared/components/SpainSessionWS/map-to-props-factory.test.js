import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";

import { makeMapStateToProps } from "./map-to-props-factory";

jest.spyOn(global.console, "error").mockImplementation();

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(),
}));

jest.mock("../../formatters/currency-formatters", () => ({
  getCurrencySymbol: jest.fn(() => "$"),
}));

const DEFAULT_STATE = {
  userDetails: {
    loggedIn: false,
    jurisdiction: { jurisdiction: Jurisdiction.SPAIN },
  },
};

const setupMapStateToProps = ({ state = DEFAULT_STATE } = {}) => makeMapStateToProps()(state);

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("when the getUserDetails throws an error", () => {
    const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

    it("should log the error and return an empty object", () => {
      getUserDetails.mockImplementationOnce(() => {
        throw new Error(GET_USER_DETAILS_ERROR);
      });

      const props = setupMapStateToProps();

      expect(global.console.error).toHaveBeenCalledTimes(1);
      expect(global.console.error).toHaveBeenCalledWith(new Error(GET_USER_DETAILS_ERROR));

      expect(props).toEqual({});
    });
  });

  describe("when the getUserDetailsSelector is successfully returning the userDetails", () => {
    describe("and the jurisdiction is SPAIN, and the user is not logged in", () => {
      it("should set the `shouldOpenWebSocket` prop as false", () => {
        getUserDetails.mockReturnValueOnce({
          loggedIn: false,
          jurisdiction: {
            jurisdiction: Jurisdiction.SPAIN,
          },
        });

        const props = setupMapStateToProps();

        expect(props).toEqual({
          shouldOpenWebSocket: false,
          currencySymbol: "$",
        });
      });
    });

    describe("and the jurisdiction is not SPAIN, and the user is logged in", () => {
      it("should set the `shouldOpenWebSocket` prop as false", () => {
        getUserDetails.mockReturnValueOnce({
          loggedIn: true,
          jurisdiction: {
            jurisdiction: Jurisdiction.ITALY,
          },
        });

        const props = setupMapStateToProps();

        expect(props).toEqual({
          shouldOpenWebSocket: false,
          currencySymbol: "$",
        });
      });
    });

    describe("and the jurisdiction is SPAIN, and the user is logged in", () => {
      it("should set the `shouldOpenWebSocket` prop as true", () => {
        getUserDetails.mockReturnValueOnce({
          loggedIn: true,
          jurisdiction: {
            jurisdiction: Jurisdiction.SPAIN,
          },
        });

        const props = setupMapStateToProps();

        expect(props).toEqual({
          shouldOpenWebSocket: true,
          currencySymbol: "$",
        });
      });
    });
  });
});
