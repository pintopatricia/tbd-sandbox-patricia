import gameReducer from "./games-reducer";
import { reduceEntities } from "../create-entity-reducer";

jest.mock("../create-entity-reducer", () => ({
  reduceEntities: jest.fn(() => "reduce-entities-result"),
}));

const stateMock = {
  "ppb:game:29605500": {
    urn: {
      referenceId: "Wo2GNSkAAB5gzRYY",
      type: "game",
      uid: "age-of-the-gods-god-of-storms-cptn",
    },
    displayName: "Age of the Gods: God of Storms",
    rgsCodeMobile: "aeolus",
    feedsCode: "mrj-4",
    jackpotLogo: "None",
    customBackgroundColor: "#744943",
    label: "JACKPOT",
    provider: "pt-ngm",
    mainProduct: "casino",
    feedData: {},
  },
};

const stateWithFeedDataMock = {
  "ppb:game:29605500": {
    urn: {
      referenceId: "Wo2GNSkAAB5gzRYY",
      type: "game",
      uid: "age-of-the-gods-god-of-storms-cptn",
    },
    displayName: "Age of the Gods: God of Storms",
    rgsCodeMobile: "aeolus",
    feedsCode: "mrj-4",
    jackpotLogo: "None",
    customBackgroundColor: "#744943",
    label: "JACKPOT",
    provider: "pt-ngm",
    mainProduct: "casino",
    feedData: {
      lastNumbers: [
        { color: "red", number: 7 },
        { color: "black", number: 24 },
      ],
    },
  },
};

describe('"game" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = gameReducer(undefined, {});

      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('must return the new state with "games"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          entities: { games: stateMock },
        },
      };

      const state = gameReducer(undefined, action);

      expect(reduceEntities).toHaveBeenCalledWith({}, action.payload, "Game");
      expect(state).toEqual("reduce-entities-result");
    });
  });

  describe('when action type is "UPDATE_LAST_NUMBERS"', () => {
    it('must return the new state with "games"', () => {
      const action = {
        type: "UPDATE_LAST_NUMBERS",
        payload: {
          urn: "ppb:game:29605500",
          data: {
            lastNumbers: [
              {
                number: 7,
                color: "red",
              },
              {
                number: 24,
                color: "black",
              },
            ],
          },
        },
      };
      const state = gameReducer(stateMock, action);
      expect(state).toEqual(stateWithFeedDataMock);
    });
  });
});
