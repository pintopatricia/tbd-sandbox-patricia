import preferenceSingleChoiceReducer from "./preference-single-choice-cards-reducer";

// Define mock data
const urnMock = "ppb:tbd:card:embeddedView:personalDetails";

const embeddedViewMock = {
  urn: urnMock,
  type: "PREFERENCE_SINGLE_CHOICE",
};

const stateMock = {
  [urnMock]: embeddedViewMock,
};

describe("`preferencesinglechoice` reducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = preferenceSingleChoiceReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe("when don't have any action type", () => {
    it("must return the same state", () => {
      const state = preferenceSingleChoiceReducer({ state: stateMock }, {});
      expect(state).toEqual({ state: stateMock });
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('must return the new state with "preferencesinglechoice"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            PreferenceSingleChoiceCard: [embeddedViewMock],
          },
        },
      };
      const state = preferenceSingleChoiceReducer(undefined, action);
      expect(state).toEqual(stateMock);
    });
  });
});
