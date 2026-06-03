import { ProductExclusion } from "../state/entities";
import setupSagaMocks from "../saga-jest-setup";
import catalogueService from "../services/catalogue/catalogue-service";
import { createFindViewItemByURNSelector } from "../state/layout/views/view-selectors";
import { FILLED_CARDS_PER_CARD_GROUP } from "../config/common-config";
import { isHttpUnauthorizedError } from "../helpers/error-parsing";

const userPreferencesMock = {
  prefA: "someValue",
  prefB: "someValue",
};

const productExclusionsMock = [ProductExclusion.Games];

const experimentsMock = [{ id: "experiment-id", variant: "something-something-variant" }];
const throttleOverridesMock = { throttlesOn: ["1", "2"], throttlesOff: ["3"] };
const routerMock = { currentView: "" };
const firstMock = undefined;
const cursorMock = undefined;
const forceRefreshComponentMock = false;

jest.mock("../state/entities/isomorphic-selectors", () => ({
  createContextForBFFSelector: jest.fn(() =>
    jest.fn(() => ({
      productExclusions: productExclusionsMock,
      userPreferences: userPreferencesMock,
      experiments: experimentsMock,
      throttleOverrides: throttleOverridesMock,
      router: routerMock,
    })),
  ),
}));

jest.mock("../state/layout/cards/Card.types", () => ({
  APOLLO_MIGRATED_CARDS: ["mocked_apollo_migrated_card"],
}));

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ cardsCatalogueSaga: saga } = require("./catalogue-cards-saga"));
  });
  return setupSagaMocks(saga);
}

jest.mock("../services/catalogue/catalogue-service", () => ({
  getCards: jest.fn(() => ({ cards: "cards" })),
  getFullCard: jest.fn(() => "fullCard"),
}));

jest.mock("../state/layout/views/view-selectors", () => {
  const getViewItemByURN = jest.fn(() => null);

  return {
    createFindViewItemByURNSelector: () => getViewItemByURN,
  };
});

jest.mock("../helpers/error-parsing", () => ({
  isHttpUnauthorizedError: jest.fn(() => false),
}));

describe("fetchCardsSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when FETCH_CARDS is dispatched", () => {
    beforeEach(() => {
      createFindViewItemByURNSelector().mockReturnValue(null);
    });

    describe("and has new cards", () => {
      it("should fetch cards", async () => {
        const { putActions, dispatch, stopSaga, getState } = setup();

        getState.mockReturnValue({ layouts: "layouts", entities: { preferences: {} } });

        const action = {
          type: "FETCH_CARDS",
          payload: {
            urns: ["urn1", "urn2", "urn3"],
            first: 3,
            cursor: "cursor",
          },
        };

        await putActions([action]);

        expect(catalogueService.getCards).toHaveBeenCalledWith(
          ["urn1", "urn2", "urn3"],
          FILLED_CARDS_PER_CARD_GROUP,
          userPreferencesMock,
          productExclusionsMock,
          experimentsMock,
          throttleOverridesMock,
          routerMock,
          3,
          "cursor",
        );
        expect(dispatch).toHaveBeenCalledWith({
          payload: {
            cards: "cards",
            forceRefreshComponent: forceRefreshComponentMock,
          },
          type: "FETCH_CATALOGUE_SUCCESS",
        });

        stopSaga();
      });

      describe("when service fails with a HTTP unauthorized error", () => {
        it("should dispatch FetchCatalogueAuthFailureAction", async () => {
          const { putActions, dispatch, stopSaga, getState } = setup();

          getState.mockReturnValue({ layouts: "layouts", entities: { preferences: {} } });

          const action = {
            type: "FETCH_CARDS",
            payload: {
              urns: ["urn1", "urn2", "urn3"],
            },
          };

          isHttpUnauthorizedError.mockReturnValueOnce(true);
          catalogueService.getCards.mockImplementationOnce(() => {
            throw new Error("HTTP unauthorized error");
          });

          await putActions([action]);

          expect(dispatch).toHaveBeenCalledWith({
            type: "FETCH_CATALOGUE_AUTH_FAILURE",
          });

          stopSaga();
        });
      });
    });

    describe("and does not have new cards", () => {
      beforeEach(() => {
        createFindViewItemByURNSelector().mockReturnValue("existingCard");
      });

      it("should not fetch cards", async () => {
        const { putActions, dispatch, stopSaga, getState } = setup();

        getState.mockReturnValue({ layouts: "layouts", entities: { preferences: {} } });

        const action = {
          type: "FETCH_CARDS",
          payload: {
            urns: ["urn1", "urn2", "urn3"],
          },
        };

        await putActions([action]);

        expect(catalogueService.getCards).not.toHaveBeenCalled();
        expect(dispatch).not.toHaveBeenCalled();

        stopSaga();
      });

      it("should fetch cards with forceRefresh", async () => {
        const { putActions, dispatch, stopSaga, getState } = setup();

        getState.mockReturnValue({ layouts: "layouts", entities: { preferences: {} } });

        const action = {
          type: "FETCH_CARDS",
          payload: {
            urns: ["urn1", "urn2", "urn3"],
            forceRefresh: true,
          },
        };

        await putActions([action]);

        expect(catalogueService.getCards).toHaveBeenCalled();
        expect(dispatch).toHaveBeenCalled();

        stopSaga();
      });
    });

    it("should handle errors", async () => {
      const { putActions, dispatch, stopSaga, getState } = setup();

      getState.mockReturnValue({ layouts: "layouts", entities: { preferences: {} } });

      isHttpUnauthorizedError.mockReturnValueOnce(false);
      catalogueService.getCards.mockImplementationOnce(() => {
        throw new Error("Error message");
      });

      const action = {
        type: "FETCH_CARDS",
        payload: {
          urns: ["urn1", "urn2", "urn3"],
        },
      };

      await putActions([action]);

      expect(catalogueService.getCards).toHaveBeenCalledWith(
        ["urn1", "urn2", "urn3"],
        FILLED_CARDS_PER_CARD_GROUP,
        userPreferencesMock,
        productExclusionsMock,
        experimentsMock,
        throttleOverridesMock,
        routerMock,
        firstMock,
        cursorMock,
      );
      expect(dispatch).toHaveBeenCalledWith({
        payload: { error: new Error("Error message") },
        type: "FETCH_CATALOGUE_FAILURE",
      });

      stopSaga();
    });

    it("should trigger clean up", async () => {
      const { putActions, dispatch, stopSaga, getState } = setup();

      getState.mockReturnValue({ layouts: "layouts", entities: { preferences: {} } });

      const action = {
        type: "FETCH_CARDS",
        payload: {
          urns: ["urn1", "urn2", "urn3"],
        },
      };

      await putActions([action]);

      expect(catalogueService.getCards).toHaveBeenCalledWith(
        ["urn1", "urn2", "urn3"],
        FILLED_CARDS_PER_CARD_GROUP,
        userPreferencesMock,
        productExclusionsMock,
        experimentsMock,
        throttleOverridesMock,
        routerMock,
        firstMock,
        cursorMock,
      );
      expect(dispatch).toHaveBeenCalledWith({
        payload: ["urn1", "urn2", "urn3"],
        type: "FETCH_CATALOGUE_CLEAN_UP",
      });

      stopSaga();
    });
  });

  describe("when FETCH_FULL_CARD is dispatched", () => {
    it("should fetch a full card", async () => {
      const { putActions, dispatch, stopSaga, getState } = setup();

      getState.mockReturnValue({ layouts: "layouts", entities: { preferences: {} } });

      const action = {
        type: "FETCH_FULL_CARD",
        payload: "urn1",
      };

      await putActions([action]);

      expect(catalogueService.getFullCard).toHaveBeenCalledWith(
        "urn1",
        userPreferencesMock,
        productExclusionsMock,
        experimentsMock,
        throttleOverridesMock,
        routerMock,
      );
      expect(dispatch).toHaveBeenCalledWith({
        payload: "fullCard",
        type: "FETCH_CATALOGUE_SUCCESS",
      });

      stopSaga();
    });

    it("should handle errors", async () => {
      const { putActions, dispatch, stopSaga, getState } = setup();

      getState.mockReturnValue({ layouts: "layouts", entities: { preferences: {} } });

      catalogueService.getFullCard.mockImplementationOnce(() => {
        throw new Error("Error message");
      });

      const action = {
        type: "FETCH_FULL_CARD",
        payload: "urn1",
      };

      await putActions([action]);

      expect(catalogueService.getFullCard).toHaveBeenCalledWith(
        "urn1",
        userPreferencesMock,
        productExclusionsMock,
        experimentsMock,
        throttleOverridesMock,
        routerMock,
      );
      expect(dispatch).toHaveBeenCalledWith({
        payload: { error: new Error("Error message") },
        type: "FETCH_CATALOGUE_FAILURE",
      });

      stopSaga();
    });

    describe("when service fails with a HTTP unauthorized error", () => {
      it("should dispatch FetchCatalogueAuthFailureAction", async () => {
        const { putActions, dispatch, stopSaga, getState } = setup();

        getState.mockReturnValue({ layouts: "layouts", entities: { preferences: {} } });

        const action = {
          type: "FETCH_FULL_CARD",
          payload: "urn1",
        };

        isHttpUnauthorizedError.mockReturnValueOnce(true);
        catalogueService.getFullCard.mockImplementationOnce(() => {
          throw new Error("HTTP unauthorized error");
        });

        await putActions([action]);

        expect(dispatch).toHaveBeenCalledWith({
          type: "FETCH_CATALOGUE_AUTH_FAILURE",
          urn: "urn1",
        });

        stopSaga();
      });
    });
  });

  describe("when FETCH_CARDS_FROM_LIST is dispatched", () => {
    it("should fetch as many cards as numberOfCards", async () => {
      const { putActions, dispatch, stopSaga, getState } = setup();

      getState.mockReturnValue({ layouts: "layouts", entities: { preferences: {} } });

      const action1 = {
        type: "FETCH_CARDS_FROM_LIST",
        payload: {
          urn: "urn3",
          partials: [
            { urn: "urn1", typename: "Card" },
            { urn: "urn2", typename: "Card" },
            { urn: "urn3", typename: "Card" },
            { urn: "urn4", typename: "Card" },
            { urn: "urn5", typename: "Card" },
            { urn: "urn6", typename: "Card" },
            { urn: "urn7", typename: "Card" },
            { urn: "urn8", typename: "Card" },
            { urn: "urn9", typename: "Card" },
          ],
        },
      };

      const action2 = {
        type: "FETCH_CARDS_FROM_LIST",
        payload: {
          urn: "urn14",
          partials: [
            { urn: "urn10", typename: "Card" },
            { urn: "urn11", typename: "Card" },
            { urn: "urn12", typename: "Card" },
            { urn: "urn13", typename: "Card" },
            { urn: "urn14", typename: "Card" },
            { urn: "urn15", typename: "Card" },
            { urn: "urn16", typename: "Card" },
            { urn: "urn17", typename: "Card" },
            { urn: "urn18", typename: "Card" },
          ],
        },
      };

      await putActions([action1, action2]);

      expect(catalogueService.getCards).toHaveBeenCalledTimes(2);
      expect(catalogueService.getCards).toHaveBeenNthCalledWith(
        1,
        ["urn3", "urn4", "urn5", "urn6"],
        FILLED_CARDS_PER_CARD_GROUP,
        userPreferencesMock,
        productExclusionsMock,
        experimentsMock,
        throttleOverridesMock,
        routerMock,
        firstMock,
        cursorMock,
      );
      expect(catalogueService.getCards).toHaveBeenNthCalledWith(
        2,
        ["urn14", "urn15", "urn16", "urn17"],
        FILLED_CARDS_PER_CARD_GROUP,
        userPreferencesMock,
        productExclusionsMock,
        experimentsMock,
        throttleOverridesMock,
        routerMock,
        firstMock,
        cursorMock,
      );
      expect(dispatch).toHaveBeenCalledWith({
        payload: {
          cards: "cards",
          forceRefreshComponent: forceRefreshComponentMock,
        },
        type: "FETCH_CATALOGUE_SUCCESS",
      });

      stopSaga();
    });

    it("should ignore already fetched cards", async () => {
      const { putActions, stopSaga, getState, advanceTimersByTime } = setup();

      createFindViewItemByURNSelector().mockReturnValueOnce("existingCard").mockReturnValueOnce("existingCard");

      getState.mockReturnValue({ layouts: "layouts", entities: { preferences: {} } });

      const action = {
        type: "FETCH_CARDS_FROM_LIST",
        payload: {
          urn: "urn3",
          partials: ["urn1", "urn2", "urn3", "urn4", "urn5", "urn6", "urn7", "urn8", "urn9"],
        },
      };

      await putActions([action]);

      await advanceTimersByTime(100);

      expect(catalogueService.getCards).not.toHaveBeenCalled();

      stopSaga();
    });

    it("should not ignore already fetched cards if the ignoreFetchedCard flag is false", async () => {
      const { putActions, stopSaga, getState } = setup();

      getState.mockReturnValue({ layouts: "layouts", entities: { preferences: {} } });

      const action = {
        type: "FETCH_CARDS_FROM_LIST",
        payload: {
          urn: "urn3",
          partials: [
            { urn: "urn1", typename: "Card" },
            { urn: "urn2", typename: "Card" },
            { urn: "urn3", typename: "Card" },
            { urn: "urn4", typename: "Card" },
            { urn: "urn5", typename: "Card" },
            { urn: "urn6", typename: "Card" },
            { urn: "urn7", typename: "Card" },
            { urn: "urn8", typename: "Card" },
            { urn: "urn9", typename: "Card" },
          ],
          ignoreFetchedCard: false,
        },
      };

      await putActions([action]);

      expect(catalogueService.getCards).toHaveBeenCalledTimes(1);

      stopSaga();
    });

    it("should ignore Apollo migrated cards", async () => {
      const { putActions, stopSaga, advanceTimersByTime, getState } = setup();

      getState.mockReturnValue({ layouts: "layouts", entities: { preferences: {} } });

      const action1 = {
        type: "FETCH_CARDS_FROM_LIST",
        payload: {
          urn: "urn3",
          partials: [
            { urn: "urn1", typename: "Card" },
            { urn: "urn2", typename: "Card" },
            { urn: "urn3", typename: "mocked_apollo_migrated_card" },
            { urn: "urn4", typename: "Card" },
            { urn: "urn5", typename: "mocked_apollo_migrated_card" },
            { urn: "urn6", typename: "mocked_apollo_migrated_card" },
            { urn: "urn7", typename: "Card" },
            { urn: "urn8", typename: "Card" },
            { urn: "urn9", typename: "Card" },
          ],
        },
      };

      await putActions([action1]);

      await advanceTimersByTime(100);

      expect(catalogueService.getCards).not.toHaveBeenCalled();

      stopSaga();
    });

    it("should ignore Apollo migrated cards partials", async () => {
      const { putActions, dispatch, stopSaga, getState } = setup();

      getState.mockReturnValue({ layouts: "layouts", entities: { preferences: {} } });

      const action1 = {
        type: "FETCH_CARDS_FROM_LIST",
        payload: {
          urn: "urn2",
          partials: [
            { urn: "urn1", typename: "Card" },
            { urn: "urn2", typename: "Card" },
            { urn: "urn3", typename: "mocked_apollo_migrated_card" },
            { urn: "urn4", typename: "Card" },
            { urn: "urn5", typename: "mocked_apollo_migrated_card" },
            { urn: "urn6", typename: "mocked_apollo_migrated_card" },
            { urn: "urn7", typename: "Card" },
            { urn: "urn8", typename: "Card" },
            { urn: "urn9", typename: "Card" },
          ],
        },
      };

      await putActions([action1]);

      expect(catalogueService.getCards).toHaveBeenCalledTimes(1);
      expect(catalogueService.getCards).toHaveBeenNthCalledWith(
        1,
        ["urn2", "urn4", "urn7", "urn8"],
        FILLED_CARDS_PER_CARD_GROUP,
        userPreferencesMock,
        productExclusionsMock,
        experimentsMock,
        throttleOverridesMock,
        routerMock,
        firstMock,
        cursorMock,
      );
      expect(dispatch).toHaveBeenCalledWith({
        payload: {
          cards: "cards",
          forceRefreshComponent: forceRefreshComponentMock,
        },
        type: "FETCH_CATALOGUE_SUCCESS",
      });

      stopSaga();
    });

    it("should not call catalogue when all cards are fetched", async () => {
      const { putActions, dispatch, stopSaga, getState, advanceTimersByTime } = setup();

      createFindViewItemByURNSelector().mockReturnValue("existingCard");

      getState.mockReturnValue({ layouts: "layouts", entities: { preferences: {} } });

      const action = {
        type: "FETCH_CARDS_FROM_LIST",
        payload: {
          urn: "urn3",
          list: ["urn1", "urn2", "urn3", "urn4", "urn5", "urn6", "urn7", "urn8", "urn9"],
        },
      };

      await putActions([action]);

      await advanceTimersByTime(100);

      expect(catalogueService.getCards).not.toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalledWith();

      stopSaga();
    });

    describe("when numberOfCards and ignoreBatchOfCards is set", () => {
      it("should fetch card and following cards", async () => {
        const { putActions, dispatch, stopSaga, getState } = setup();

        createFindViewItemByURNSelector().mockReturnValue(null);

        getState.mockReturnValue({ layouts: "layouts", entities: { preferences: {} } });

        const action = {
          type: "FETCH_CARDS_FROM_LIST",
          payload: {
            urn: "urn3",
            partials: [
              { urn: "urn1", typename: "Card" },
              { urn: "urn2", typename: "Card" },
              { urn: "urn3", typename: "Card" },
              { urn: "urn4", typename: "Card" },
              { urn: "urn5", typename: "Card" },
              { urn: "urn6", typename: "Card" },
              { urn: "urn7", typename: "Card" },
              { urn: "urn8", typename: "Card" },
              { urn: "urn9", typename: "Card" },
            ],
            numberOfCards: 8,
            ignoreBatchOfCards: false,
          },
        };

        await putActions([action]);

        expect(catalogueService.getCards).toHaveBeenCalledTimes(1);

        expect(catalogueService.getCards).toHaveBeenCalledWith(
          ["urn3", "urn4", "urn5", "urn6", "urn7", "urn8", "urn9"],
          FILLED_CARDS_PER_CARD_GROUP,
          userPreferencesMock,
          productExclusionsMock,
          experimentsMock,
          throttleOverridesMock,
          routerMock,
          firstMock,
          cursorMock,
        );
        expect(dispatch).toHaveBeenCalledWith({
          payload: {
            cards: "cards",
            forceRefreshComponent: forceRefreshComponentMock,
          },
          type: "FETCH_CATALOGUE_SUCCESS",
        });

        stopSaga();
      });
    });

    describe("when UI/SWITCH_PRODUCT_PREFERENCE is received after a FETCH_CARDS_FROM_LIST", () => {
      it("should cancel the pending requests", async () => {
        jest.useFakeTimers();
        const { putActions, stopSaga, getState, dispatch, advanceTimersByTime } = setup();

        getState.mockReturnValue({ layouts: "layouts", entities: { preferences: {} } });

        catalogueService.getCards.mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              setTimeout(() => resolve("getCardsMock"), 2);
            }),
        );

        const action1 = {
          type: "FETCH_CARDS_FROM_LIST",
          payload: {
            urn: "urn1",
            partials: [
              { urn: "urn1", typename: "Card" },
              { urn: "urn2", typename: "Card" },
            ],
          },
        };

        const action2 = {
          type: "UI/SWITCH_PRODUCT_PREFERENCE",
        };

        await putActions([action1]);
        await advanceTimersByTime(1);
        await putActions([action2]);

        expect(catalogueService.getCards).toHaveBeenCalledTimes(1);
        expect(catalogueService.getCards).toHaveBeenCalledWith(
          ["urn1", "urn2"],
          FILLED_CARDS_PER_CARD_GROUP,
          userPreferencesMock,
          productExclusionsMock,
          experimentsMock,
          throttleOverridesMock,
          routerMock,
          firstMock,
          cursorMock,
        );

        expect(dispatch).not.toHaveBeenCalled();

        stopSaga();
      });
    });
  });

  describe("when FETCH_CATALOGUE_CLEAN_UP is dispatched", () => {
    it("should clean up urns that were not fetched", async () => {
      const { putActions, dispatch, stopSaga, getState, advanceTimersByTime } = setup();

      createFindViewItemByURNSelector().mockReturnValue(null);
      getState.mockReturnValue({ layouts: "layouts", entities: { preferences: {} } });

      const action = {
        type: "FETCH_CATALOGUE_CLEAN_UP",
        payload: ["urn1", "urn2", "urn3"],
      };

      await putActions([action]);

      await advanceTimersByTime(100);

      expect(dispatch).toHaveBeenCalledWith({
        payload: ["urn1", "urn2", "urn3"],
        type: "DELETE_VIEW_ITEMS",
      });

      stopSaga();
    });
  });
});
