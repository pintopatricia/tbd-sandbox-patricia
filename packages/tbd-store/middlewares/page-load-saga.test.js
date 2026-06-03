import setupSagaMocks from "../saga-jest-setup";
import { FETCH_CATALOGUE_SUCCESS, PAGE_LOAD_SUCCESS } from "../actions/catalogue";
import { PUSH } from "../actions/router";
import { createFindViewByURNSelector } from "../state/layout/views/view-selectors";
import { generateLayoutSnapshot } from "../state/layout-snapshot";

jest.mock("../state/layout/views/view-selectors", () => {
  const selector = jest.fn();
  return {
    createFindViewByURNSelector: jest.fn(() => selector),
  };
});

jest.mock("../state/layout-snapshot", () => ({
  generateLayoutSnapshot: jest.fn(),
}));

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ pageLoadSaga: saga } = require("./page-load-saga"));
  });
  return setupSagaMocks(saga);
}

describe("pageLoadSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const pushAction = {
    type: PUSH,
    payload: {
      viewUrn: "viewUrn",
      viewUrl: "viewUrl",
    },
  };
  const fetchCatalogueSuccessViewAction = {
    type: FETCH_CATALOGUE_SUCCESS,
    payload: {
      data: {},
      router: { currentUrn: "viewUrn" },
    },
  };

  const fetchCatalogueSuccessCardAction = {
    type: FETCH_CATALOGUE_SUCCESS,
    payload: {
      data: {},
    },
  };

  it("should ignore action if store is empty", async () => {
    const { putActions, getState, dispatch, stopSaga } = setup();

    const viewMock = {
      layouts: {
        views: {},
      },
      router: {
        currentUrn: "viewUrn",
      },
    };

    getState.mockReturnValue(viewMock);
    createFindViewByURNSelector().mockReturnValue(undefined);

    await putActions([pushAction]);

    expect(createFindViewByURNSelector()).toHaveBeenCalledWith(viewMock.layouts.views, "viewUrn");
    expect(dispatch).not.toHaveBeenCalled();

    stopSaga();
  });

  it("should ignore non-view queries", async () => {
    const { putActions, getState, dispatch, stopSaga } = setup();

    const viewMock = {
      layouts: {
        views: {
          generic: {
            viewUrn: {
              urn: "viewUrn",
            },
          },
        },
      },
      router: {
        currentUrn: "viewUrn",
      },
    };

    getState.mockReturnValue(viewMock);
    createFindViewByURNSelector().mockReturnValue(viewMock.layouts.views.generic.viewUrn);

    await putActions([fetchCatalogueSuccessCardAction]);

    expect(dispatch).not.toHaveBeenCalled();

    stopSaga();
  });

  describe.each([
    [FETCH_CATALOGUE_SUCCESS, fetchCatalogueSuccessViewAction],
    [PUSH, pushAction],
  ])("when action is `%s`", (_, action) => {
    it("should dispatch a 'PAGE_LOAD_SUCCESS' action", async () => {
      const { putActions, getState, dispatch, stopSaga } = setup();

      const viewMock = {
        layouts: {
          views: {
            generic: {
              viewUrn: {
                urn: "viewUrn",
              },
            },
          },
        },
        router: {
          currentUrn: "viewUrn",
        },
      };

      getState.mockReturnValue(viewMock);
      createFindViewByURNSelector().mockReturnValue(viewMock.layouts.views.generic.viewUrn);

      await putActions([action]);

      expect(createFindViewByURNSelector()).toHaveBeenCalledWith(viewMock.layouts.views, "viewUrn");
      expect(dispatch).toHaveBeenCalledWith({
        type: PAGE_LOAD_SUCCESS,
        payload: "viewUrn",
      });

      stopSaga();
    });
  });

  describe("when action is FETCH_CATALOGUE_SUCCESS", () => {
    it("should call generateLayoutSnapshot with the current urn", async () => {
      const { putActions, getState, stopSaga } = setup();

      const viewMock = {
        layouts: {
          views: {
            generic: {
              viewUrn: {
                urn: "viewUrn",
              },
            },
          },
        },
        router: {
          currentUrn: "viewUrn",
        },
      };

      getState.mockReturnValue(viewMock);

      await putActions([fetchCatalogueSuccessViewAction]);

      expect(generateLayoutSnapshot).toHaveBeenCalledWith(
        fetchCatalogueSuccessViewAction.payload,
        viewMock.router.currentUrn,
      );

      stopSaga();
    });
  });
});
