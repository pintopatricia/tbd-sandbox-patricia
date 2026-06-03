import { EXTERNAL_PUSH, GENERIC_PUSH, PUSH } from "../actions";
import { renderRedirectMetaElements } from "./seo/seo-common-renderer";
import { urlMiddleware } from "./url-middleware";

const nextMock = jest.fn();
const dispatchMock = jest.fn();
const historyPushMock = jest.fn();
const historyReplaceMock = jest.fn();

const createHistoryMock = ({ stateOverrides = {}, pathname } = {}) => ({
  push: historyPushMock,
  replace: historyReplaceMock,
  location: {
    ...(pathname ? { pathname } : {}),
    state: {
      viewUrl: "viewUrl",
      viewUrn: "viewUrn",
      ...stateOverrides,
    },
  },
});

jest.mock("./seo/seo-common-renderer", () => ({
  renderRedirectMetaElements: jest.fn(),
}));

const setup = ({ history = createHistoryMock(), dispatch = dispatchMock, next = nextMock, action } = {}) =>
  urlMiddleware(history)({ dispatch })(next)(action);

describe("urlMiddleware", () => {
  afterEach(jest.clearAllMocks);

  it("should intercept PUSH actions with external view urn payload and dispatch EXTERNAL_PUSH action", () => {
    const action = {
      type: PUSH,
      payload: {
        viewUrn: "ppb:tbd:view:external:external",
        viewUrl: "viewUrl",
      },
    };

    setup({ action });

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith({
      type: EXTERNAL_PUSH,
      payload: {
        viewUrn: "ppb:tbd:view:external:external",
        viewUrl: "viewUrl",
      },
    });
    expect(historyPushMock).not.toHaveBeenCalled();
    expect(historyReplaceMock).not.toHaveBeenCalled();
    expect(renderRedirectMetaElements).not.toHaveBeenCalled();
  });

  it("should intercept PUSH actions with product query param and update URL", () => {
    const action = {
      type: PUSH,
      payload: {
        viewUrl: "football/s-1",
        viewUrn: "ppb:tbd:view:sport:1",
      },
    };

    Object.defineProperties(window, {
      location: {
        get() {
          return {
            pathname: "/betting/football/s-1",
            href: "https://www.betfair.com/betting/football/s-1?product=EXC",
          };
        },
      },
    });

    setup({ action });

    expect(historyReplaceMock).not.toHaveBeenCalled();
    expect(historyPushMock).toHaveBeenCalledWith("football/s-1", {
      viewUrl: "football/s-1",
      viewUrn: "ppb:tbd:view:sport:1",
    });
  });

  it("should intercept PUSH actions with exc query param and update URL", () => {
    const action = {
      type: PUSH,
      payload: {
        viewUrl: "football/s-1",
        viewUrn: "ppb:tbd:view:sport:1",
      },
    };

    Object.defineProperties(window, {
      location: {
        get() {
          return {
            pathname: "/betting/football/s-1",
            href: "https://www.betfair.com/betting/football/s-1?exc=true",
          };
        },
      },
    });

    setup({ action });

    expect(historyReplaceMock).not.toHaveBeenCalled();
    expect(historyPushMock).toHaveBeenCalledWith("football/s-1", {
      viewUrl: "football/s-1",
      viewUrn: "ppb:tbd:view:sport:1",
    });
  });

  it("should intercept PUSH actions with internal view urn payload and update history", () => {
    const action = {
      type: PUSH,
      payload: {
        viewUrn: "viewUrn",
        viewUrl: "viewUrl",
      },
    };

    Object.defineProperties(window, {
      location: {
        get() {
          return {
            pathname: "oldViewUrl",
          };
        },
      },
    });

    setup({ action });

    expect(historyPushMock).toHaveBeenCalledWith("viewUrl", { viewUrl: "viewUrl", viewUrn: "viewUrn" });

    expect(renderRedirectMetaElements).not.toHaveBeenCalled();
  });

  it("should ignore PUSH actions for same URL", () => {
    const action = {
      type: PUSH,
      payload: {
        viewUrn: "viewUrn",
        viewUrl: "viewUrl",
      },
    };

    Object.defineProperties(window, {
      location: {
        get() {
          return {
            pathname: "viewUrl",
            search: "",
            hash: "",
          };
        },
      },
    });

    setup({ action });

    expect(historyPushMock).not.toHaveBeenCalled();
    expect(historyReplaceMock).not.toHaveBeenCalled();
  });

  it("should intercept FETCH_CATALOGUE_SUCCESS actions and update history if new view is different then the old one", () => {
    const firstAction = {
      type: "FETCH_CATALOGUE_SUCCESS",
      payload: {
        router: {
          currentUrn: "oldViewUrn",
          currentUrl: "oldViewUrl",
        },
      },
      requestedUrns: ["anotherUrn"],
    };

    const secondAction = {
      type: "FETCH_CATALOGUE_SUCCESS",
      payload: {
        router: {
          currentUrn: "newViewUrn",
          currentUrl: "newViewUrl",
        },
      },
      requestedUrns: ["anotherUrn"],
    };

    Object.defineProperties(window, {
      location: {
        get() {
          return {
            pathname: "newUrl",
          };
        },
      },
    });

    setup({ action: firstAction });

    jest.clearAllMocks();

    setup({ action: secondAction });

    expect(historyReplaceMock).toHaveBeenCalledWith("newViewUrl", {
      viewUrl: "newViewUrl",
      viewUrn: "newViewUrn",
    });

    expect(renderRedirectMetaElements).toHaveBeenCalledWith("", "newViewUrl");
  });

  it("should intercept FETCH_CATALOGUE_SUCCESS actions and update history with empty relative url for old home view and new non empty url", () => {
    const action = {
      type: "FETCH_CATALOGUE_SUCCESS",
      payload: {
        router: {
          currentUrn: "ppb:tbd:view:generic:home",
          currentUrl: "/",
        },
      },
      requestedUrns: ["ppb:tbd:view:generic:home"],
    };

    setup({
      action,
      history: createHistoryMock({
        pathname: "/betting/",
        stateOverrides: {
          viewUrl: "",
          viewUrn: "ppb:tbd:view:generic:home",
        },
      }),
    });

    expect(historyPushMock).not.toHaveBeenCalledWith();
    expect(historyReplaceMock).toHaveBeenCalledWith("/", {
      viewUrl: "/",
      viewUrn: "ppb:tbd:view:generic:home",
    });

    expect(renderRedirectMetaElements).not.toHaveBeenCalled();
  });

  it("should ignore PUSH actions if the new view is the same as the old one", () => {
    const action = {
      type: "PUSH",
      payload: {
        currentUrn: "viewUrn",
        currentUrl: "viewUrl",
      },
    };

    Object.defineProperties(window, {
      location: {
        get() {
          return {
            pathname: "viewUrl",
            search: "",
            hash: "",
          };
        },
      },
    });

    setup({ action });

    expect(historyPushMock).not.toHaveBeenCalled();
    expect(historyReplaceMock).not.toHaveBeenCalled();

    expect(renderRedirectMetaElements).not.toHaveBeenCalled();
  });

  it("should ignore FETCH_CATALOGUE_SUCCESS actions for settings view", () => {
    const action = {
      type: "FETCH_CATALOGUE_SUCCESS",
      payload: {
        router: {
          currentUrn: "ppb:tbd:view:settings:settings",
          currentUrl: "viewUrl",
        },
      },
      requestedUrns: ["ppb:tbd:view:settings:settings"],
    };

    Object.defineProperties(window, {
      location: {
        get() {
          return {
            pathname: "",
          };
        },
      },
    });

    setup({ action });

    expect(historyPushMock).not.toHaveBeenCalled();
    expect(historyReplaceMock).not.toHaveBeenCalled();
  });

  it("should ignore FETCH_CATALOGUE_SUCCESS actions for category view equal to 'MODAL'", () => {
    const action = {
      type: "FETCH_CATALOGUE_SUCCESS",
      payload: {
        router: {
          currentUrn: "ppb:tbd:view:test:test",
          currentUrl: "viewUrl",
          category: "MODAL",
        },
      },
      requestedUrns: ["ppb:tbd:view:test:test"],
    };

    Object.defineProperties(window, {
      location: {
        get() {
          return {
            pathname: "",
          };
        },
      },
    });

    setup({ action });

    expect(historyPushMock).not.toHaveBeenCalled();
    expect(historyReplaceMock).not.toHaveBeenCalled();
  });

  it("should intercept GENERIC_PUSH actions with internal view urn payload and dispatch PUSH action", () => {
    const action = {
      type: GENERIC_PUSH,
      payload: {
        viewUrn: "viewUrn",
        viewUrl: "viewUrl",
      },
    };

    setup({ action });

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith({
      type: PUSH,
      payload: {
        viewUrn: "viewUrn",
        viewUrl: "viewUrl",
      },
    });
  });

  it("should intercept GENERIC_PUSH actions with external view urn payload and dispatch EXTERNAL_PUSH action", () => {
    const action = {
      type: GENERIC_PUSH,
      payload: {
        viewUrn: "ppb:tbd:view:external:external",
        viewUrl: "viewUrl",
      },
    };

    setup({ action });

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith({
      type: EXTERNAL_PUSH,
      payload: {
        viewUrn: "ppb:tbd:view:external:external",
        viewUrl: "viewUrl",
      },
    });
  });

  it("should intercept EXTERNAL_PUSH actions and update URL", () => {
    const action = {
      type: EXTERNAL_PUSH,
      payload: {
        viewUrn: "viewUrn",
        viewUrl: "viewUrl",
      },
    };

    const assignMock = jest.fn();
    Object.defineProperties(window, {
      location: {
        get() {
          return {
            assign: assignMock,
          };
        },
      },
    });

    setup({ action });

    expect(assignMock).toHaveBeenCalledWith("viewUrl");
  });

  it("should intercept EXTERNAL_PUSH_BLANK actions and open the URL in a new tab", () => {
    const action = {
      type: "ROUTER/EXTERNAL_PUSH_BLANK",
      payload: {
        viewUrn: "viewUrn",
        viewUrl: "viewUrl",
      },
    };

    const assignMock = jest.fn();
    Object.defineProperties(window, {
      open: {
        get() {
          return assignMock;
        },
      },
    });

    setup({ action });

    expect(assignMock).toHaveBeenCalledWith("viewUrl", "_blank");
  });

  describe("TAB_ROUTE_UPDATE", () => {
    it("should intercept TAB_ROUTE_UPDATE actions and update URL", () => {
      const action = {
        type: "Router/tabRouteUpdate",
        payload: {
          viewLink: {
            viewUrn: "viewUrn",
            viewUrl: "viewUrl",
          },
        },
      };

      setup({
        action,
        history: createHistoryMock({
          pathname: "newUrl",
          stateOverrides: {
            viewUrl: "oldViewUrl",
            viewUrn: "oldViewUrn",
          },
        }),
      });

      expect(historyReplaceMock).toHaveBeenCalledWith("viewUrl", {
        viewUrl: "viewUrl",
        viewUrn: "viewUrn",
      });

      expect(renderRedirectMetaElements).toHaveBeenCalledWith("", "viewUrl");
    });

    it("should ignore TAB_ROUTE_UPDATE actions without viewLink", () => {
      const action = {
        type: "Router/tabRouteUpdate",
        payload: {},
      };

      setup({ action });

      expect(historyPushMock).not.toHaveBeenCalled();
      expect(historyReplaceMock).not.toHaveBeenCalled();
    });

    describe("BUG1240316 - when viewUrl is encoded with diacritics or special characters", () => {
      const setupEncodedViewUrl = ({ historyViewUrl = "viewUrl", actionViewUrl = "viewUrl" } = {}) => {
        const action = {
          type: "Router/tabRouteUpdate",
          payload: {
            viewLink: { viewUrl: actionViewUrl, viewUrn: "viewUrn" },
          },
        };

        setup({
          action,
          history: createHistoryMock({
            stateOverrides: {
              viewUrl: historyViewUrl,
              viewUrn: "viewUrn",
            },
          }),
        });
      };

      it("should not call renderRedirectMetaElements when viewUrl is encoded with diacritics", () => {
        setupEncodedViewUrl({
          actionViewUrl: "cota%C3%A7%C3%B5es/total-de-cart%C3%B5es/cpn-Y1kUnhEAAGUBtC65%2Fs%2F1?d=Y0ALUREAAB0ARl1L",
          historyViewUrl: "cotações/total-de-cartões/cpn-Y1kUnhEAAGUBtC65%2Fs%2F1?d=Y0ALUREAAB0ARl1L",
        });

        expect(renderRedirectMetaElements).not.toHaveBeenCalled();
      });

      it("should not call renderRedirectMetaElements when viewUrl is encoded with '@'", () => {
        setupEncodedViewUrl({
          actionViewUrl: "futebol-americano/ncaaf-partidas/washington-%40-michigan/e-32863719",
          historyViewUrl: "futebol-americano/ncaaf-partidas/washington-@-michigan/e-32863719",
        });

        expect(renderRedirectMetaElements).not.toHaveBeenCalled();
      });

      it("should not call renderRedirectMetaElements when viewUrl is encoded with ':' (semi-colon)", () => {
        setupEncodedViewUrl({
          actionViewUrl: "corrida-de-galgos/antepost%3A-aposta-antecipada/arc-classic/ap-924.382185913",
          historyViewUrl: "corrida-de-galgos/antepost:-aposta-antecipada/arc-classic/ap-924.382185913",
        });

        expect(renderRedirectMetaElements).not.toHaveBeenCalled();
      });
    });
  });
});
