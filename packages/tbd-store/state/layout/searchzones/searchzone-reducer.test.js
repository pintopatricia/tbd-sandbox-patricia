import { PUSH } from "../../../actions";
import searchzonereducer from "./searchzone-reducer";

const cardgroupMock = {
  urn: "ppb:tbd:gaming:masterConfigElement:search/0",
  type: "VIEW_ZONE",
  items: ["ppb:tbd:card:searchBar:search", "ppb:tbd:gaming:masterConfigElement:curated:8"],
};

const stateMock = {
  "ppb:tbd:gaming:masterConfigElement:search/0": cardgroupMock,
};

describe('"searchzoneReducer" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = searchzonereducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('must return the new state with "searchzone"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            SearchZone: [cardgroupMock],
          },
        },
      };
      const state = searchzonereducer(undefined, action);
      expect(state).toEqual(stateMock);
    });
  });

  describe('when action type is "ROUTER/PUSH"', () => {
    it("must return the empty state", () => {
      const action = {
        type: PUSH,
        payload: {
          layouts: {
            searchzone: [cardgroupMock],
          },
        },
      };
      const state = searchzonereducer(undefined, action);
      expect(state).toEqual({});
    });
  });

  describe("when action type is DELETE_LAYOUT", () => {
    it("should return an empty object", () => {
      const state = searchzonereducer(
        { layout: {} },
        {
          type: "DELETE_LAYOUT",
        },
      );

      expect(state).toEqual({});
    });
  });
});
