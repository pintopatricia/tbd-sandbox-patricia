import { PUSH } from "../../../actions/router";
import viewzonereducer from "./viewzone-reducer";

const cardgroupMock = {
  urn: "ppb:tbd:view:zone:multifunctional:module:1",
  type: "VIEW_ZONE",
  items: [
    "ppb:tbd:card:group:curatedGames:1",
    "ppb:tbd:segmented:card:group:ppb|tbd|card|group|curatedGames|1;ppb|tbd|card|group|curatedGames|2",
  ],
};

const stateMock = {
  "ppb:tbd:view:zone:multifunctional:module:1": cardgroupMock,
};

describe('"viewzonesReducer" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = viewzonereducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('must return the new state with "viewzones"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            ViewZone: [cardgroupMock],
          },
        },
      };
      const state = viewzonereducer(undefined, action);
      expect(state).toEqual(stateMock);
    });
  });

  describe('when action type is "ROUTER/PUSH"', () => {
    it("must return the empty state", () => {
      const action = {
        type: PUSH,
        payload: {
          layouts: {
            viewzones: [cardgroupMock],
          },
        },
      };
      const state = viewzonereducer(undefined, action);
      expect(state).toEqual({});
    });
  });

  describe("when action type is DELETE_LAYOUT", () => {
    it("should return an empty object", () => {
      const state = viewzonereducer(
        { layout: {} },
        {
          type: "DELETE_LAYOUT",
        },
      );

      expect(state).toEqual({});
    });
  });
});
