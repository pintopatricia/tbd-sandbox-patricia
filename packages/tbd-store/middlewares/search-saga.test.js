import { ProductExclusion } from "../state/entities";
import setupSagaMocks from "../saga-jest-setup";
import catalogueService from "../services/catalogue/catalogue-service";
import gamingGlobalSearch from "../services/gaming-global-search";
import { createPartialCardsBySearchCardGroupSelector } from "../state/layout/views/browse-view/browse-view-selectors";
import { getUserDetails } from "../state/entities/user-details/user-details-selectors";
import { FILLED_CARDS_PER_CARD_GROUP } from "../config/common-config";

const productExclusionsMock = [ProductExclusion.Games];

const userPreferencesMock = {
  prefA: "someValue",
  prefB: "someValue",
};

const EXPERIMENTS = [{ id: "experiment-id", variant: "something-something-variant" }];
const throttleOverridesMock = { throttlesOn: ["1", "2"], throttlesOff: ["3"] };
const routerMock = { currentView: "" };

jest.mock("../state/entities/isomorphic-selectors", () => ({
  createContextForBFFSelector: jest.fn(() =>
    jest.fn(() => ({
      productExclusions: productExclusionsMock,
      userPreferences: userPreferencesMock,
      experiments: EXPERIMENTS,
      throttleOverrides: throttleOverridesMock,
      router: routerMock,
    })),
  ),
}));

jest.mock("../state/entities/throttles/throttles-selectors", () => ({
  getOverridenThrottles: jest.fn(() => throttleOverridesMock),
}));

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ fetchSearchResultsSaga: saga } = require("./search-saga"));
  });
  return setupSagaMocks(saga);
}

jest.mock("../state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({
    localeCode: "en",
    jurisdiction: { jurisdiction: "INTERNATIONAL" },
  })),
}));

jest.mock("../state/layout/views/browse-view/browse-view-selectors", () => {
  const getPartialCardsByCardGroup = jest.fn(() => null);

  return {
    createPartialCardsBySearchCardGroupSelector: () => getPartialCardsByCardGroup,
  };
});

jest.mock("../services/catalogue/catalogue-service", () => ({
  getCards: jest.fn(() => "cards"),
  getSearchResults: jest.fn(() => "results"),
}));

jest.mock("../services/gaming-global-search", () => ({
  getGamingSearchResults: jest.fn().mockReturnValue([
    {
      query: "",
      pageSize: 3,
      startIndex: 1,
      didYouMean: "sda",
      items: [
        {
          urn: "URN",
          url: "",
          name: "mockedGame",
          type: "GAME_SEARCH_RESULT_ITEM",
        },
      ],
    },
  ]),
}));

describe("searchSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const sportsInitialAction = {
    type: "UI__SEARCH_INPUT_CHANGE",
    payload: {
      text: "query",
      urn: "ppb:tbd:view:browse:sports",
    },
  };

  const desktopInitialAction = {
    type: "UI__SEARCH_INPUT_CHANGE",
    payload: {
      text: "query",
    },
  };

  const gamingInitialAction = {
    type: "UI__SEARCH_INPUT_CHANGE",
    payload: {
      text: "roulette",
      urn: "ppb:tbd:view:browse:gaming",
    },
  };

  const fetchMoreInitialAction = {
    type: "UI__FETCH_MORE_SEARCH_RESULTS",
    payload: {
      urn: "ppb:tbd:view:browse:gaming",
    },
  };

  const mockValue = {
    query: "",
    startIndex: 0,
    pageSize: 0,
    items: [
      {
        url: "",
        urn: "ppb:tbd:card:game:roulette-deluxe-cptn",
        type: "GAME_SEARCH_RESULT_ITEM",
        name: "Roulette Deluxe",
      },
    ],
  };

  const card = {
    urn: "ppb:tbd:card:game:BF_BP_Windfall",
    type: "GAME_CARD",
    game: "ppb:game:BF_BP_Windfall",
  };

  describe("when UI__SEARCH_INPUT_CHANGE is dispatched", () => {
    describe("and the text does not trigger search", () => {
      it("should not fetch search results", async () => {
        const { putActions, dispatch, stopSaga, getState } = setup();
        getState.mockReturnValue({ entities: { preferences: {} }, router: routerMock });

        const action = {
          type: "UI__SEARCH_INPUT_CHANGE",
          payload: {
            text: "o",
            urn: "ppb:tbd:view:browse:sports",
          },
        };

        await putActions([action], 400);

        expect(catalogueService.getSearchResults).not.toHaveBeenCalled();
        expect(dispatch).not.toHaveBeenCalled();
        stopSaga();
      });
    });

    describe("and when urn is sports", () => {
      describe("and text does trigger search", () => {
        it("should fetch search results", async () => {
          const { putActions, dispatch, stopSaga, getState } = setup();
          getState.mockReturnValue({ entities: { preferences: {} }, router: routerMock });

          await putActions([sportsInitialAction], 400);

          expect(catalogueService.getSearchResults).toHaveBeenCalledWith(
            "query",
            userPreferencesMock,
            productExclusionsMock,
            EXPERIMENTS,
            throttleOverridesMock,
          );
          expect(dispatch).toHaveBeenCalledWith({
            payload: {
              results: "results",
              urn: "ppb:tbd:view:browse:sports",
            },
            type: "NETWORK__FETCH_SEARCH_RESULTS_SUCCESS",
          });
          stopSaga();
        });

        it("should handle error", async () => {
          const { putActions, stopSaga, getState } = setup();
          getState.mockReturnValue({ entities: { preferences: {} }, router: routerMock });
          const error = "newError";
          jest.spyOn(global.console, "warn").mockReturnValue(1);

          catalogueService.getSearchResults.mockImplementationOnce(() => {
            throw error;
          });

          await putActions([sportsInitialAction], 400);

          expect(global.console.warn).toHaveBeenCalledWith(error);

          stopSaga();
        });
      });
    });

    describe("and when payload is urn = undefined", () => {
      describe("and text does trigger search", () => {
        it("should fetch search results", async () => {
          const { putActions, dispatch, stopSaga, getState } = setup();
          getState.mockReturnValue({ entities: { preferences: {} }, router: routerMock });

          await putActions([desktopInitialAction], 400);

          expect(catalogueService.getSearchResults).toHaveBeenCalledWith(
            "query",
            userPreferencesMock,
            productExclusionsMock,
            EXPERIMENTS,
            throttleOverridesMock,
          );
          expect(dispatch).toHaveBeenCalledWith({
            payload: {
              results: "results",
            },
            type: "NETWORK__FETCH_SEARCH_RESULTS_SUCCESS",
          });
          stopSaga();
        });

        it("should handle error", async () => {
          const { putActions, stopSaga, getState } = setup();
          getState.mockReturnValue({ entities: { preferences: {} }, router: routerMock });
          const error = "newError";
          jest.spyOn(global.console, "warn").mockReturnValue(1);

          catalogueService.getSearchResults.mockImplementationOnce(() => {
            throw error;
          });

          await putActions([sportsInitialAction], 400);

          expect(global.console.warn).toHaveBeenCalledWith(error);

          stopSaga();
        });
      });
    });

    describe("and when urn is gaming", () => {
      describe("and text does trigger search", () => {
        it("should fetch search results", async () => {
          const { putActions, dispatch, stopSaga, getState } = setup();
          getState.mockReturnValue({ entities: { preferences: {} }, router: routerMock });

          await putActions([gamingInitialAction], 400);

          expect(getUserDetails).toHaveBeenCalledTimes(1);
          expect(gamingGlobalSearch.getGamingSearchResults).toHaveBeenCalledWith("roulette", "en", "INTERNATIONAL");
          expect(dispatch).toHaveBeenCalledWith({
            payload: {
              results: [
                {
                  query: "",
                  pageSize: 3,
                  startIndex: 1,
                  didYouMean: "sda",
                  items: [
                    {
                      urn: "URN",
                      url: "",
                      name: "mockedGame",
                      type: "GAME_SEARCH_RESULT_ITEM",
                    },
                  ],
                },
              ],
              urn: "ppb:tbd:view:browse:gaming",
            },
            type: "NETWORK__FETCH_SEARCH_RESULTS_SUCCESS",
          });

          stopSaga();
        });

        describe("and fetch catalogue is successful", () => {
          it("should dispatch 'FETCH_CATALOGUE_SUCCESS'", async () => {
            gamingGlobalSearch.getGamingSearchResults.mockReturnValue(mockValue);
            catalogueService.getCards.mockReturnValue(card);
            const { putActions, dispatch, stopSaga, getState } = setup();
            getState.mockReturnValue({ entities: { preferences: {} }, router: routerMock });

            await putActions([gamingInitialAction], 400);

            expect(gamingGlobalSearch.getGamingSearchResults).toHaveBeenCalledWith("roulette", "en", "INTERNATIONAL");
            expect(catalogueService.getCards).toHaveBeenCalledWith(
              ["ppb:tbd:card:game:roulette-deluxe-cptn"],
              FILLED_CARDS_PER_CARD_GROUP,
              undefined,
              undefined,
              undefined,
              throttleOverridesMock,
              routerMock,
              undefined,
              undefined,
            );
            expect(dispatch).toHaveBeenCalledWith({
              payload: {
                game: "ppb:game:BF_BP_Windfall",
                type: "GAME_CARD",
                urn: "ppb:tbd:card:game:BF_BP_Windfall",
              },
              type: "FETCH_CATALOGUE_SUCCESS",
            });

            stopSaga();
          });
        });

        describe("and fetch catalogue throws an error", () => {
          it("should dispatch 'FETCH_CATALOGUE_FAILURE'", async () => {
            const { putActions, dispatch, stopSaga, getState } = setup();
            getState.mockReturnValue({ entities: { preferences: {} }, router: routerMock });

            catalogueService.getCards.mockImplementationOnce(() => {
              throw new Error("Error message");
            });

            await putActions([gamingInitialAction], 400);

            expect(catalogueService.getCards).toHaveBeenCalledWith(
              ["ppb:tbd:card:game:roulette-deluxe-cptn"],
              FILLED_CARDS_PER_CARD_GROUP,
              undefined,
              undefined,
              undefined,
              throttleOverridesMock,
              routerMock,
              undefined,
              undefined,
            );
            expect(dispatch).toHaveBeenCalledWith({
              payload: { error: new Error("Error message") },
              type: "FETCH_CATALOGUE_FAILURE",
            });

            stopSaga();
          });
        });
      });
    });
  });

  describe("when UI__FETCH_MORE_SEARCH_RESULTS is dispatched", () => {
    describe("and there are not partial urns", () => {
      it("should not dispatch any action", async () => {
        const { putActions, dispatch, stopSaga, getState } = setup();
        getState.mockReturnValue({ entities: { preferences: {} }, router: routerMock });

        createPartialCardsBySearchCardGroupSelector().mockReturnValue([]);

        await putActions([fetchMoreInitialAction]);
        expect(dispatch).not.toHaveBeenCalled();

        stopSaga();
      });
    });

    describe("and there are partial urns", () => {
      it("should dispatch a FETCH_CATALOGUE_SUCCESS action with the correct urns", async () => {
        const { putActions, dispatch, stopSaga, getState } = setup();
        getState.mockReturnValue({ entities: { preferences: {} }, router: routerMock });

        catalogueService.getCards.mockReturnValue({
          data: {
            Game: [
              {
                urn: "ppb:tbd:card:gaming:game:uid/spread-bet-roulette-cptn",
              },
              {
                urn: "ppb:tbd:card:gaming:game:uid/live-speed-roulette-cptl",
              },
            ],
          },
        });

        createPartialCardsBySearchCardGroupSelector().mockReturnValue([
          "ppb:tbd:card:gaming:game:uid/spread-bet-roulette-cptn",
          "ppb:tbd:card:gaming:game:uid/live-speed-roulette-cptl",
        ]);

        await putActions([fetchMoreInitialAction]);

        expect(catalogueService.getCards).toHaveBeenCalledWith(
          [
            "ppb:tbd:card:gaming:game:uid/spread-bet-roulette-cptn",
            "ppb:tbd:card:gaming:game:uid/live-speed-roulette-cptl",
          ],
          FILLED_CARDS_PER_CARD_GROUP,
          userPreferencesMock,
          productExclusionsMock,
          EXPERIMENTS,
          throttleOverridesMock,
          routerMock,
          undefined,
          undefined,
        );
        expect(dispatch).toHaveBeenCalledWith({
          payload: {
            data: {
              Game: [
                {
                  urn: "ppb:tbd:card:gaming:game:uid/spread-bet-roulette-cptn",
                },
                {
                  urn: "ppb:tbd:card:gaming:game:uid/live-speed-roulette-cptl",
                },
              ],
            },
          },
          type: "FETCH_CATALOGUE_SUCCESS",
        });

        stopSaga();
      });

      describe("and when urns are not returned", () => {
        it("should dispatch UI__DELETE_ITEMS_FROM_SEARCH_RESULTS", async () => {
          const { putActions, dispatch, stopSaga, getState } = setup();
          getState.mockReturnValue({ entities: { preferences: {} }, router: routerMock });

          createPartialCardsBySearchCardGroupSelector().mockReturnValue([
            "ppb:tbd:card:gaming:game:uid/superman-roulette-cptn",
            "ppb:tbd:card:gaming:game:uid/spread-bet-roulette-cptn",
            "ppb:tbd:card:gaming:game:uid/live-speed-roulette-cptl",
            "ppb:tbd:card:gaming:game:uid/diamond-bet-roulette-cptn",
          ]);

          catalogueService.getCards.mockReturnValue({
            data: {
              Game: [
                {
                  urn: "ppb:tbd:card:gaming:game:uid/superman-roulette-cptn",
                },
              ],
            },
          });

          await putActions([fetchMoreInitialAction]);

          expect(catalogueService.getCards).toHaveBeenCalledWith(
            [
              "ppb:tbd:card:gaming:game:uid/superman-roulette-cptn",
              "ppb:tbd:card:gaming:game:uid/spread-bet-roulette-cptn",
              "ppb:tbd:card:gaming:game:uid/live-speed-roulette-cptl",
              "ppb:tbd:card:gaming:game:uid/diamond-bet-roulette-cptn",
            ],
            FILLED_CARDS_PER_CARD_GROUP,
            userPreferencesMock,
            productExclusionsMock,
            EXPERIMENTS,
            throttleOverridesMock,
            routerMock,
            undefined,
            undefined,
          );

          expect(dispatch).toHaveBeenCalledWith({
            payload: {
              urn: "ppb:tbd:view:browse:gaming",
              itemsUrnsToDelete: [
                "ppb:tbd:card:gaming:game:uid/spread-bet-roulette-cptn",
                "ppb:tbd:card:gaming:game:uid/live-speed-roulette-cptl",
                "ppb:tbd:card:gaming:game:uid/diamond-bet-roulette-cptn",
              ],
            },
            type: "UI__DELETE_ITEMS_FROM_SEARCH_RESULTS",
          });

          stopSaga();
        });
      });

      describe("and when the returned urns are less than 2", () => {
        it("should dispatch UI__FETCH_MORE_SEARCH_RESULTS", async () => {
          const { putActions, dispatch, stopSaga, getState } = setup();
          getState.mockReturnValue({ entities: { preferences: {} }, router: routerMock });

          catalogueService.getCards.mockReturnValue({
            data: {
              Game: [
                {
                  urn: "ppb:tbd:card:gaming:game:uid/spread-bet-roulette-cptn",
                },
              ],
            },
          });

          createPartialCardsBySearchCardGroupSelector().mockReturnValue([
            "ppb:tbd:card:gaming:game:uid/spread-bet-roulette-cptn",
          ]);

          await putActions([fetchMoreInitialAction]);

          expect(catalogueService.getCards).toHaveBeenCalledWith(
            ["ppb:tbd:card:gaming:game:uid/spread-bet-roulette-cptn"],
            FILLED_CARDS_PER_CARD_GROUP,
            userPreferencesMock,
            productExclusionsMock,
            EXPERIMENTS,
            throttleOverridesMock,
            routerMock,
            undefined,
            undefined,
          );

          expect(dispatch).toHaveBeenCalledWith({
            payload: {
              urn: "ppb:tbd:view:browse:gaming",
            },
            type: "UI__FETCH_MORE_SEARCH_RESULTS",
          });

          stopSaga();
        });
      });
    });

    describe("and an error is thrown", () => {
      it("should dispatch 'FETCH_CATALOGUE_FAILURE'", async () => {
        const { putActions, dispatch, stopSaga, getState } = setup();
        getState.mockReturnValue({ entities: { preferences: {} }, router: routerMock });

        catalogueService.getCards.mockImplementationOnce(() => {
          throw new Error("Error message");
        });

        await putActions([fetchMoreInitialAction]);

        expect(catalogueService.getCards).toHaveBeenCalledWith(
          ["ppb:tbd:card:gaming:game:uid/spread-bet-roulette-cptn"],
          FILLED_CARDS_PER_CARD_GROUP,
          userPreferencesMock,
          productExclusionsMock,
          EXPERIMENTS,
          throttleOverridesMock,
          routerMock,
          undefined,
          undefined,
        );
        expect(dispatch).toHaveBeenCalledWith({
          payload: { error: new Error("Error message") },
          type: "FETCH_CATALOGUE_FAILURE",
        });

        stopSaga();
      });
    });
  });
});
