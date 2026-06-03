import fixtureCardsReducer from "./fixture-cards-reducer";

const fixtureCardURN = "ppb:tbd:card:fixture:29914606|0|market";

const fixtureCardMock = {
  typename: "FixtureCard",
  urn: fixtureCardURN,
  fixture: "ppb:fixture:29914606",
  fixtureEventViewLink: "link",
  sportevent: "ppb:event:29914606",
};

describe('"fixture card" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = fixtureCardsReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe("when action type is FETCH_CATALOGUE_SUCCESS", () => {
    it('must return the new state with "fixtures"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            FixtureCard: [fixtureCardMock],
          },
        },
      };
      const state = fixtureCardsReducer(undefined, action);
      expect(state).toEqual({ [fixtureCardURN]: fixtureCardMock });
    });
  });

  describe('when action type is "FETCH_MAIN_MARKETS_UPDATES_SUCCESS"', () => {
    it("must return the new state with new data merged with previous state", () => {
      const previousState = { [fixtureCardURN]: fixtureCardMock };

      const action = {
        type: "FETCH_MAIN_MARKETS_UPDATES_SUCCESS",
        payload: {
          data: {
            FixtureCard: [fixtureCardMock],
          },
        },
      };
      const state = fixtureCardsReducer(previousState, action);
      expect(state).toEqual({
        ...previousState,
        [fixtureCardURN]: {
          ...fixtureCardMock,
        },
      });
    });
  });

  describe("when action type is DELETE_LAYOUT", () => {
    it("should return an empty object", () => {
      const state = fixtureCardsReducer(
        { layout: {} },
        {
          type: "DELETE_LAYOUT",
        },
      );

      expect(state).toEqual({});
    });
  });
});
