import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { ScrollableSwimlane, ActionLink } from "@ppb/the-wall-web";
import { GamingCategoryLink } from "./snowflakes/GamingCategoryLink/GamingCategoryLink.web";
import ConnectedGameCard from "../GameCard";
import GameCard from "../GameCard/GameCard.web";
import GamesCardGroup from "./GamesCardGroup.web";
import GameCardPlaceholder from "../GameCard/GameCardPlaceholder.web";

const mockTaggingService = {
  hasFired: jest.fn(() => false),
  markFired: jest.fn(),
  clear: jest.fn(),
};

const PARENTS = ["ppb:tab:1", "ppb:cardgroup:1"];
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => PARENTS),
}));

jest.mock("@ppb/the-wall-web", () => ({
  ScrollableSwimlane: jest.fn(({ props, children }) => (
    <scrollable-swimlane {...props}>{children}</scrollable-swimlane>
  )),
  ActionLink: jest.fn((props) => <container-mock {...props} />),
  Link: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock("./snowflakes/GameTileContainer/GameTileContainer.web", () => ({
  GameTileContainer: jest.fn((props) => <game-tile-container-mock {...props} />),
}));

jest.mock("../GameCard", () => ({
  __esModule: true,
  default: jest.fn((props) => <connected-game-card {...props} />),
  ConnectedGameCardLayout: {
    SQUARE: "SQUARE",
    RECTANGLE: "RECTANGLE",
  },
}));

jest.mock("../GameCard/GameCardPlaceholder.web", () => jest.fn(() => <game-card-placeholder />));

jest.mock("./snowflakes/GamingCategoryLink/GamingCategoryLink.web", () => ({
  GamingCategoryLink: jest.fn(() => <gaming-category-link-mock-svg />),
}));

jest.mock("../../hooks/useVisibilityObserver.web", () => ({
  useVisibilityObserver: jest.fn(() => ({
    observe: jest.fn(),
    visibility: {},
  })),
}));

jest.mock("../../config/endpoints", () => ({
  ENDPOINTS: {
    GAME_LAUNCHER: "http://localhost/betting/launcher/",
  },
}));

const gamingCategoryLinkMock = {
  viewLink: { viewUrn: "the:urn", viewUrl: "http://www.betfair.com" },
  label: "Daily Jackpots",
  cardIcon: "SLOTS",
  buttonText: "See All",
};

function renderGamesCardGroup(
  urn = "fakeURN",
  items = [],
  title = "fakeTitle",
  cardGroupUrn = "fakeCardgroupURN",
  layout = "CARD_LIST",
  viewAll = null,
  gamingCategoryLink = null,
  parentUrn = "parentURN",
  viewZoneTitle = "title",
  dispatchNavigateToCategoryUsingSeeAllButton = jest.fn(),
  dispatchPushAction = jest.fn(),
  dispatchFetchCards = jest.fn(),
  dispatchLaunchCategory = jest.fn(),
  dispatchLoadedContent = jest.fn(),
  taggingService = mockTaggingService,
) {
  return render(
    <GamesCardGroup
      urn={urn}
      items={items}
      title={title}
      layout={layout}
      cardGroupUrn={cardGroupUrn}
      parentUrn={parentUrn}
      viewZoneTitle={viewZoneTitle}
      totalItems={items?.length}
      viewAll={viewAll}
      gamingCategoryLink={gamingCategoryLink}
      dispatchNavigateToCategoryUsingSeeAllButton={dispatchNavigateToCategoryUsingSeeAllButton}
      dispatchPushAction={dispatchPushAction}
      dispatchFetchCards={dispatchFetchCards}
      dispatchLaunchCategory={dispatchLaunchCategory}
      dispatchLoadedContent={dispatchLoadedContent}
      taggingService={taggingService}
    />,
  );
}

describe("Connected GameList", () => {
  beforeEach(jest.clearAllMocks);
  beforeEach(() => {
    jest.mock("../../config/endpoints", () => ({
      getBasePath: jest.fn().mockReturnValue("http://localhost"),
      BASE_PATH: "http://localhost",
    }));
  });

  describe("grid four columns", () => {
    it("should not render the swimlane and render round tile", () => {
      renderGamesCardGroup(
        "fakeURN",
        [{ urn: "fakeGame", typename: "SwimlaneCardGroup" }],
        "fakeTitle",
        "fakeCardGroupURN",
        "GRID_FOUR_COLUMNS",
      );
      expect(ActionLink).toHaveBeenCalledTimes(0);
      expect(ConnectedGameCard).toHaveBeenCalledTimes(1);
      expect(ConnectedGameCard).toHaveBeenCalledWith(
        {
          urn: "fakeGame",
          isRoundGameTile: true,
          component: GameCard,
          placeholder: GameCardPlaceholder,
          visible: false,
        },
        undefined,
      );
    });
  });

  describe("grid two columns", () => {
    it("should not render the swimlane and render first item with layout rectangle", () => {
      renderGamesCardGroup(
        "fakeURN",
        [{ urn: "fakeGame" }, { urn: "fakeGame1" }, { urn: "fakeGame2" }],
        "fakeTitle",
        "fakeCardGroupURN",
        "GRID_TWO_COLUMNS",
      );
      expect(ScrollableSwimlane).toHaveBeenCalledTimes(0);

      expect(ConnectedGameCard).toHaveBeenCalledTimes(3);
      expect(ConnectedGameCard).toHaveBeenNthCalledWith(
        1,
        {
          urn: "fakeGame",
          isRoundGameTile: false,
          component: GameCard,
          placeholder: GameCardPlaceholder,
          visible: false,
        },
        undefined,
      );
      expect(ConnectedGameCard).toHaveBeenNthCalledWith(
        2,
        {
          urn: "fakeGame1",
          isRoundGameTile: false,
          component: GameCard,
          placeholder: GameCardPlaceholder,
          visible: false,
        },
        undefined,
      );
      expect(ConnectedGameCard).toHaveBeenNthCalledWith(
        3,
        {
          urn: "fakeGame2",
          isRoundGameTile: false,
          component: GameCard,
          placeholder: GameCardPlaceholder,
          visible: false,
        },
        undefined,
      );
    });

    it("should render the link component", () => {
      renderGamesCardGroup("fakeURN", [{ urn: "fakeGame" }], "fakeTitle", "fakeCardGroupURN", "GRID_TWO_COLUMNS", {
        label: "test",
        viewLink: { viewUrn: "fakeUrn", viewUrl: "fakeUrl" },
      });

      expect(ScrollableSwimlane).toHaveBeenCalledTimes(0);
      expect(ActionLink).toHaveBeenCalledTimes(1);

      expect(ConnectedGameCard).toHaveBeenCalledTimes(1);
      expect(ConnectedGameCard).toHaveBeenCalledWith(
        {
          urn: "fakeGame",
          isRoundGameTile: false,
          component: GameCard,
          placeholder: GameCardPlaceholder,
          visible: false,
        },
        undefined,
      );
    });
  });

  describe("segmented card group", () => {
    it("should render the segmented card group as gaming zone with no gaming category link", () => {
      renderGamesCardGroup(
        "fakeURN",
        [{ urn: "fakeGame" }, { urn: "fakeGame1" }, { urn: "fakeGame2" }],
        "fakeTitle",
        "fakeCardGroupURN",
        "CARD_LIST",
      );

      expect(ConnectedGameCard).toHaveBeenCalledTimes(3);
      expect(GamingCategoryLink).not.toHaveBeenCalled();
      expect(ConnectedGameCard).toHaveBeenNthCalledWith(
        1,
        {
          urn: "fakeGame",
          isRoundGameTile: false,
          component: GameCard,
          placeholder: GameCardPlaceholder,
          visible: false,
        },
        undefined,
      );
      expect(ConnectedGameCard).toHaveBeenNthCalledWith(
        2,
        {
          urn: "fakeGame1",
          isRoundGameTile: false,
          component: GameCard,
          placeholder: GameCardPlaceholder,
          visible: false,
        },
        undefined,
      );
      expect(ConnectedGameCard).toHaveBeenNthCalledWith(
        3,
        {
          urn: "fakeGame2",
          isRoundGameTile: false,
          component: GameCard,
          placeholder: GameCardPlaceholder,
          visible: false,
        },
        undefined,
      );
    });

    it("should render the segmented card group with gaming category link", () => {
      renderGamesCardGroup(
        "fakeURN",
        [{ urn: "fakeGame" }],
        "fakeTitle",
        "fakeCardGroupURN",
        "SQUARE",
        null,
        gamingCategoryLinkMock,
      );

      expect(ConnectedGameCard).toHaveBeenCalledTimes(1);
      expect(GamingCategoryLink).toHaveBeenCalled();
      expect(GamingCategoryLink).toHaveBeenCalledWith(
        {
          buttonText: "See All",
          cardIcon: "SLOTS",
          gamingZoneTitle: "fakeTitle",
          label: "Daily Jackpots",
          onClick: expect.any(Function),
          viewLink: { viewUrl: "http://www.betfair.com", viewUrn: "the:urn" },
        },
        undefined,
      );
    });

    describe("when there are no items", () => {
      it("should not render", () => {
        renderGamesCardGroup("fakeURN", [], "fakeTitle", "fakeCardGroupURN", "SQUARE", null, gamingCategoryLinkMock);

        expect(ConnectedGameCard).not.toHaveBeenCalled();
      });
    });
  });

  describe("when see all is clicked", () => {
    it("must dispatch the click action", () => {
      const dispatchClickMock = jest.fn();
      const dispatchPushMock = jest.fn();
      renderGamesCardGroup(
        "fakeURN",
        ["fakeGame"],
        "fakeTitle",
        "fakeCardGroupURN",
        "GRID_TWO_COLUMNS",
        {
          label: "test",
          viewLink: { viewUrn: "fakeUrn", viewUrl: "fakeUrl" },
        },
        null,
        "parentURN",
        "title",
        dispatchClickMock,
        dispatchPushMock,
      );

      ActionLink.mock.calls[0][0].onClick();
      expect(dispatchPushMock).toHaveBeenCalledTimes(1);
      expect(dispatchClickMock).toHaveBeenCalledTimes(1);
    });
  });
});
