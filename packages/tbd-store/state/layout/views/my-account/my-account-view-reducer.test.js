import { PUSH } from "../../../../actions/router";
import myAccountViewReducer from "./my-account-view-reducer";

const urn = "ppb:tbd:view:myAccountView:90";

const stateMock = [
  {
    urn,
    items: ["urn:tbd:card:1", "urn:tbd:card:2"],
  },
];

const secondUpdateMock = [
  {
    urn,
    items: ["urn:tbd:fixture:3", "urn:tbd:card:4"],
  },
];

describe('"my account view" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = myAccountViewReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('must return the new state with "my account view"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: { MyAccountView: stateMock },
        },
      };
      const secondFetchAction = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: { MyAccountView: secondUpdateMock },
        },
      };

      const state = myAccountViewReducer(undefined, action);
      expect(state).toEqual({
        "ppb:tbd:view:myAccountView:90": {
          items: ["urn:tbd:card:1", "urn:tbd:card:2"],
          urn: "ppb:tbd:view:myAccountView:90",
        },
      });

      const newState = myAccountViewReducer(state, secondFetchAction);
      expect(newState).toEqual({
        [urn]: {
          urn,
          items: ["urn:tbd:fixture:3", "urn:tbd:card:4"],
        },
      });
    });
  });

  describe('when action type is "ROUTER/PUSH"', () => {
    it("must return the initial state", () => {
      const action = {
        type: PUSH,
      };

      const state = myAccountViewReducer(undefined, action);
      expect(state).toEqual({});
    });
  });
});
