import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { GAME_LAUNCH } from "@ppb/tbd-store/actions/game-feeds";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getGameInfoViewbyURN = jest.fn();

jest.mock("@ppb/tbd-store/state/layout/views/view-selectors", () => ({
  createViewByURNSelector: jest.fn(() => getGameInfoViewbyURN),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({
    loggedIn: true,
    jurisdiction: {
      jurisdiction: "INTERNATIONAL",
    },
  })),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

describe("makeMapStateToProps", () => {
  const GAME_VIEWS = {
    layouts: {
      views: {
        game: {
          fakeGameViewUrn: {
            urn: "fakeGameViewUrn",
            url: "casino/game/fakeGameViewUrn/game:fakeGameViewUrn",
            typename: "GameView",
            items: ["ppb:tbd:card:game:ted-abp"],
          },
        },
      },
    },
    entities: {
      userdetails: {
        jurisdiction: {
          jurisdiction: "INTERNATIONAL",
        },
      },
    },
  };

  function setup(state, urn) {
    getGameInfoViewbyURN.mockImplementation((views) => views[urn] || null);

    return makeMapStateToProps()(state, { urn });
  }

  beforeEach(jest.clearAllMocks);

  describe("when there is layout for provided URN", () => {
    it("should getGameInfoViewbyURN from state", () => {
      setup(GAME_VIEWS, "fakeGameViewUrn");
      expect(getGameInfoViewbyURN).toHaveBeenCalledWith(GAME_VIEWS.layouts.views.game, "fakeGameViewUrn");
    });

    it("should return page layout", () => {
      const { view } = setup(GAME_VIEWS, "fakeGameViewUrn");
      expect(view).toEqual({
        urn: "fakeGameViewUrn",
        items: ["ppb:tbd:card:game:ted-abp"],
        typename: "GameView",
        url: "casino/game/fakeGameViewUrn/game:fakeGameViewUrn",
      });
    });
  });

  describe("when `getUserDetails` throws", () => {
    const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

    beforeEach(() => {
      getUserDetails.mockImplementationOnce(() => {
        throw new Error(GET_USER_DETAILS_ERROR);
      });
    });

    it("should call console.error with the error thrown by `getUserDetails`", () => {
      setup(GAME_VIEWS, "fakeGameViewUrn");

      expect(global.console.error).toHaveBeenCalledWith(new Error(GET_USER_DETAILS_ERROR));
    });

    it("should return an empty object", () => {
      expect(setup(GAME_VIEWS, "fakeGameViewUrn")).toEqual({});
    });
  });

  describe("when there is no layout for provided URN", () => {
    it("should getGameInfoViewbyURN from state", () => {
      setup(
        {
          layouts: {
            views: {
              game: {},
            },
          },
        },
        "fakeGameViewUrn",
      );
      expect(getGameInfoViewbyURN).toHaveBeenCalledWith({}, "fakeGameViewUrn");
    });

    it("should not return any page layout", () => {
      const { view } = setup(
        {
          layouts: {
            views: {
              game: {},
            },
          },
        },
        "fakeGameViewsdfUrn",
      );
      expect(view).toEqual(null);
    });
  });

  describe("dispatchGameLaunchRefresh", () => {
    it("should dispatch game launch to refresh the recently played games list", () => {
      const { dispatchGameLaunchRefresh } = mapDispatchToProps;
      const gameUrnMock = "fakeGameUrn";
      expect(dispatchGameLaunchRefresh({ urn: gameUrnMock, typename: "GameCard" })).toEqual({
        type: GAME_LAUNCH,
        payload: { urn: gameUrnMock, typename: "GameCard" },
      });
    });
  });
});
