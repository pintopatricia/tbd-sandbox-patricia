import { cleanLayoutMiddleware } from "./clean-layout";
import { PUSH } from "../actions/router";

function setup({
  dispatchSpy = jest.fn(),
  nextSpy = jest.fn(),
  state = {
    entities: {
      throttles: {},
    },
  },
  action = { type: "some action", payload: "some payload" },
} = {}) {
  return cleanLayoutMiddleware({
    getState: () => state,
    dispatch: dispatchSpy,
  })(nextSpy)(action);
}

describe("Clean Layout Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should forward action to next middlewares", () => {
    const actionMock = {
      type: "some action",
      payload: "some payload",
    };
    const nextSpy = jest.fn();
    setup({ nextSpy, action: actionMock });
    expect(nextSpy).toHaveBeenCalledWith(actionMock);
    expect(nextSpy).toHaveBeenCalledTimes(1);
  });

  describe("when action is PUSH", () => {
    describe("and PRESERVE_LAYOUT throttle is disabled", () => {
      it("should bypass DeleteViewAction", () => {
        const dispatchSpy = jest.fn();

        setup({
          action: {
            type: PUSH,
            payload: {
              viewUrn: "some viewUrn",
              viewUrl: "some viewUrl",
            },
          },
          dispatchSpy,
        });

        expect(dispatchSpy).toHaveBeenCalledWith({ payload: "some viewUrn", type: "DELETE_VIEW" });
      });
    });

    describe("and PRESERVE_LAYOUT throttle is enabled", () => {
      it("should dispatch DeleteViewAction to clean the view", () => {
        const dispatchSpy = jest.fn();

        setup({
          action: {
            type: PUSH,
            payload: {
              viewUrn: "some viewUrn",
              viewUrl: "some viewUrl",
            },
          },
          dispatchSpy,
          state: {
            entities: {
              throttles: {
                PRESERVE_LAYOUT: { isActive: true },
              },
            },
          },
        });

        expect(dispatchSpy).not.toHaveBeenCalled();
      });
    });

    describe("when there is a favourite games card in gaming category views", () => {
      it("should dispatch DeleteViewAction for the favourite games category view", () => {
        const dispatchSpy = jest.fn();
        const favouriteGamesViewUrn = "ppb:tbd:view:gamingCategory:favourite-games";

        setup({
          action: {
            type: PUSH,
            payload: {
              viewUrn: "some other viewUrn",
              viewUrl: "some viewUrl",
            },
          },
          dispatchSpy,
          state: {
            entities: {
              throttles: {
                PRESERVE_LAYOUT: { isActive: true },
              },
            },
            layouts: {
              views: {
                gamingcategory: {
                  [favouriteGamesViewUrn]: {
                    items: [
                      { urn: "ppb:tbd:card:group:gaming:favouriteGames" },
                      { urn: "ppb:tbd:card:group:gaming:other" },
                    ],
                  },
                },
              },
            },
          },
        });

        expect(dispatchSpy).toHaveBeenCalledWith({
          payload: favouriteGamesViewUrn,
          type: "DELETE_VIEW",
        });
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
      });

      it("should not dispatch DeleteViewAction when no favourite games card exists", () => {
        const dispatchSpy = jest.fn();

        setup({
          action: {
            type: PUSH,
            payload: {
              viewUrn: "some viewUrn",
              viewUrl: "some viewUrl",
            },
          },
          dispatchSpy,
          state: {
            entities: {
              throttles: {
                PRESERVE_LAYOUT: { isActive: true },
              },
            },
            layouts: {
              views: {
                gamingcategory: {
                  "ppb:tbd:view:gamingCategory:other": {
                    items: [{ urn: "ppb:tbd:card:group:gaming:other" }],
                  },
                },
              },
            },
          },
        });

        expect(dispatchSpy).toHaveBeenCalledTimes(0);
      });

      it("should not dispatch DeleteViewAction when gaming category views are empty", () => {
        const dispatchSpy = jest.fn();

        setup({
          action: {
            type: PUSH,
            payload: {
              viewUrn: "some viewUrn",
              viewUrl: "some viewUrl",
            },
          },
          dispatchSpy,
          state: {
            entities: {
              throttles: {
                PRESERVE_LAYOUT: { isActive: true },
              },
            },
            layouts: {
              views: {},
            },
          },
        });

        expect(dispatchSpy).toHaveBeenCalledTimes(0);
      });

      it("should find favourite games card with URN pattern match", () => {
        const dispatchSpy = jest.fn();
        const favouriteGamesViewUrn = "ppb:tbd:view:gamingCategory:my-favs";

        setup({
          action: {
            type: PUSH,
            payload: {
              viewUrn: "some viewUrn",
              viewUrl: "some viewUrl",
            },
          },
          dispatchSpy,
          state: {
            entities: {
              throttles: {
                PRESERVE_LAYOUT: { isActive: true },
              },
            },
            layouts: {
              views: {
                gamingcategory: {
                  [favouriteGamesViewUrn]: {
                    items: [{ urn: "ppb:tbd:card:group:gaming:favouriteGames:extra" }, { urn: "ppb:tbd:card:other" }],
                  },
                },
              },
            },
          },
        });

        expect(dispatchSpy).toHaveBeenCalledWith({
          payload: favouriteGamesViewUrn,
          type: "DELETE_VIEW",
        });
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
