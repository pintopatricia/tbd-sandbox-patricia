import setupSagaMocks from "../../saga-jest-setup";

import { FETCH_CATALOGUE_SUCCESS } from "../../actions/catalogue";
import { SUBSCRIBE_VIRTUALS_CARD, UNSUBSCRIBE_VIRTUALS_CARD } from "../../actions/virtuals";
import catalogueService from "../../services/catalogue/catalogue-service";
import { PUSH } from "../../actions/router";

const experimentsMock = [{ id: "experiment-id", variant: "something-something-variant" }];

jest.mock("../../services/catalogue/catalogue-service", () => ({
  getCards: jest.fn(),
}));

const throttleOverridesMock = { throttlesOn: ["1", "2"], throttlesOff: ["3"] };

jest.mock("../../state/entities/isomorphic-selectors", () => ({
  createContextForBFFSelector: jest.fn(() =>
    jest.fn(() => ({
      productExclusions: "productExclusionsMock",
      userPreferences: "userPreferencesMock",
      experiments: experimentsMock,
      throttleOverrides: throttleOverridesMock,
    })),
  ),
}));

function setup() {
  let saga;

  jest.isolateModules(() => {
    ({ virtualsSaga: saga } = require("./virtuals-saga"));
  });

  return setupSagaMocks(saga);
}

describe.each([{ type: SUBSCRIBE_VIRTUALS_CARD, payload: { urn: "ppb:virtualcardgroup:1" } }])(
  "virtuals saga subscribe on $type",
  (action) => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    async function setupVirtualsSaga({ selectableitemscardgroups = {} } = {}) {
      const sagaSetup = setup();

      sagaSetup.getState.mockReturnValue({
        entities: {},
        layouts: {
          cardgroups: {
            selectableitemscardgroups,
          },
        },
      });

      await sagaSetup.putActions([action]);
      await sagaSetup.advanceTimersByTime(0);

      return {
        saga: sagaSetup,
      };
    }

    describe("when there is no selectable items card group", () => {
      it("should not update card", async () => {
        const { saga } = await setupVirtualsSaga({ selectableitemscardgroups: {} });

        expect(saga.dispatch).not.toHaveBeenCalled();
        saga.stopSaga();
      });
    });

    describe("when there is a selectable items card group", () => {
      describe("when it doesn't contain the child item", () => {
        it("should not update card", async () => {
          const { saga } = await setupVirtualsSaga({
            selectableitemscardgroups: {
              "ppb:sig:1": {
                items: [{ urn: "ppb:virtualcardgroup:2" }],
              },
            },
          });

          expect(saga.dispatch).not.toHaveBeenCalled();
          saga.stopSaga();
        });
      });

      describe("when there is no response", () => {
        it("should not update card", async () => {
          catalogueService.getCards.mockResolvedValue(null);
          const { saga } = await setupVirtualsSaga({
            selectableitemscardgroups: {
              "ppb:sig:1": {
                items: [{ urn: "ppb:virtualcardgroup:1" }],
              },
            },
          });

          expect(saga.dispatch).not.toHaveBeenCalled();
          saga.stopSaga();
        });
      });

      describe("when there is a response", () => {
        it("should dispatch FETCH_CATALOGUE_SUCCESS", async () => {
          const response = {
            data: { SelectableItemsCardGroup: {} },
          };

          catalogueService.getCards.mockResolvedValue(response);
          const { saga } = await setupVirtualsSaga({
            selectableitemscardgroups: {
              "ppb:sig:1": {
                items: [{ urn: "ppb:virtualcardgroup:1" }],
              },
            },
          });

          expect(saga.dispatch).toHaveBeenCalledWith({ type: FETCH_CATALOGUE_SUCCESS, payload: response });
          saga.stopSaga();
        });
      });
    });
  },
);

describe.each([PUSH, UNSUBSCRIBE_VIRTUALS_CARD])("virtuals saga unsubscribe on `%s`", (type) => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  async function setupSubUnsubSaga({ selectableitemscardgroups = {} } = {}) {
    const sagaSetup = setup();

    sagaSetup.getState.mockReturnValue({
      entities: {},
      layouts: {
        cardgroups: {
          selectableitemscardgroups,
        },
      },
    });

    await sagaSetup.putActions([{ type: SUBSCRIBE_VIRTUALS_CARD, payload: { urn: "ppb:virtualcardgroup:1" } }]);
    await sagaSetup.putActions([{ type }]);
    await sagaSetup.advanceTimersByTime(5000);
    await sagaSetup.advanceTimersByTime(5000);
    await sagaSetup.advanceTimersByTime(5000);
    await sagaSetup.advanceTimersByTime(5000);
    await sagaSetup.advanceTimersByTime(5000);

    return {
      saga: sagaSetup,
    };
  }

  it("should no longer dispatch after unsubscribing", async () => {
    const response = {
      data: { SelectableItemsCardGroup: {} },
    };

    catalogueService.getCards.mockResolvedValue(response);

    const { saga } = await setupSubUnsubSaga({
      selectableitemscardgroups: {
        "ppb:sig:1": {
          items: [{ urn: "ppb:virtualcardgroup:1" }],
        },
      },
    });

    expect(saga.dispatch).toHaveBeenCalledTimes(1);
    saga.stopSaga();
  });
});
