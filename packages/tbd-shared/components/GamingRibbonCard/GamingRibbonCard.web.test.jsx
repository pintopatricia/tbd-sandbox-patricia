import { render } from "@testing-library/react";
import { CasinoIconName, SystemIconName } from "@ppb/the-wall-icons/types";
import { IconButton } from "@ppb/the-wall-web";
import GamingRibbonCard from "./GamingRibbonCard.web";
import { getStoredNewestReleasedGames, initNewReleases } from "../../helpers/gaming-new-releases.web";
import {
  getFavouritesNotificationCount,
  clearFavouritesNotifications,
} from "../../helpers/gaming-favourites-notifications.web";

jest.mock("@ppb/the-wall-web", () => ({
  IconButton: jest.fn(() => <icon-button-mock />),
}));

jest.mock("../../helpers/gaming-new-releases.web", () => ({
  initNewReleases: jest.fn(() => ({ new: [], seen: [] })),
  getStoredNewestReleasedGames: jest.fn(() => []),
}));

jest.mock("../../helpers/gaming-favourites-notifications.web", () => ({
  getFavouritesNotificationCount: jest.fn(() => 0),
  clearFavouritesNotifications: jest.fn(),
}));

const mockDispatchPushAction = jest.fn();
const mockDispatchNavigateToGameCategoryViewAction = jest.fn();

const defaultProps = {
  urn: "test-urn",
  label: "Test Label",
  icon: "SLOTS",
  viewLink: { viewUrl: "viewUrl" },
  dispatchPushAction: mockDispatchPushAction,
  dispatchNavigateToGameCategoryViewAction: mockDispatchNavigateToGameCategoryViewAction,
  games: [],
  isGamesRibbonHighlighted: true,
};

describe("GamingRibbonCard", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component with the correct props", () => {
    render(<GamingRibbonCard {...defaultProps} />);

    expect(IconButton).toHaveBeenCalledWith(
      {
        icon: CasinoIconName.SLOTS,
        text: "Test Label",
        isLargeIcon: true,
        isHighlighted: true,
        notificationCount: undefined,
        onPress: expect.any(Function),
      },
      undefined,
    );
  });

  it("calls dispatchPushAction and dispatchNavigateToGameCategoryViewAction on click", () => {
    const eventMock = {
      preventDefault: jest.fn(),
    };

    render(<GamingRibbonCard {...defaultProps} />);

    IconButton.mock.calls[0][0].onPress(eventMock);

    expect(eventMock.preventDefault).toHaveBeenCalled();
    expect(mockDispatchPushAction).toHaveBeenCalledWith(defaultProps.viewLink);
    expect(mockDispatchNavigateToGameCategoryViewAction).toHaveBeenCalledWith(
      defaultProps.viewLink,
      defaultProps.urn,
      defaultProps.label,
    );
  });

  it("defaults to MY_GAMES icon when an invalid icon is provided", () => {
    render(<GamingRibbonCard {...defaultProps} icon="INVALID_ICON" />);

    expect(IconButton).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: CasinoIconName.MY_GAMES,
      }),
      undefined,
    );
  });

  describe("NEW icon type", () => {
    it("should call initNewReleases with an empty array when there are no new games", () => {
      getStoredNewestReleasedGames.mockReturnValue(["test1"]);

      render(<GamingRibbonCard {...defaultProps} icon="NEW" games={[]} />);

      expect(initNewReleases).toHaveBeenCalledWith([]);
    });

    it("should call initNewReleases with an array containing the new games", () => {
      initNewReleases.mockReturnValue({ new: ["test"], seen: [] });

      render(<GamingRibbonCard {...defaultProps} icon="NEW" games={["test"]} />);

      expect(initNewReleases).toHaveBeenCalledWith(["test"]);
    });

    it("should display notification count for new games", () => {
      initNewReleases.mockReturnValue({ new: ["game1", "game2", "game3"], seen: [] });

      render(<GamingRibbonCard {...defaultProps} icon="NEW" games={["game1", "game2", "game3"]} />);

      expect(IconButton).toHaveBeenCalledWith(
        expect.objectContaining({
          notificationCount: 3,
        }),
        undefined,
      );
    });
  });

  describe("FAVOURITES icon type", () => {
    it("should render with heart outline icon", () => {
      render(<GamingRibbonCard {...defaultProps} icon="FAVOURITES" />);

      expect(IconButton).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: SystemIconName.HEART_OUTLINE,
        }),
        undefined,
      );
    });

    it("should display notification count when there are unseen favourites", () => {
      getFavouritesNotificationCount.mockReturnValue(5);

      render(<GamingRibbonCard {...defaultProps} icon="FAVOURITES" />);

      expect(IconButton).toHaveBeenCalledWith(
        expect.objectContaining({
          notificationCount: 5,
        }),
        undefined,
      );
    });

    it("should not display notification count when count is zero", () => {
      getFavouritesNotificationCount.mockReturnValue(0);

      render(<GamingRibbonCard {...defaultProps} icon="FAVOURITES" />);

      expect(IconButton).toHaveBeenCalledWith(
        expect.objectContaining({
          notificationCount: undefined,
        }),
        undefined,
      );
    });

    it("should clear notifications when clicking on FAVOURITES tab", () => {
      const eventMock = {
        preventDefault: jest.fn(),
      };

      render(<GamingRibbonCard {...defaultProps} icon="FAVOURITES" />);

      IconButton.mock.calls[0][0].onPress(eventMock);

      expect(clearFavouritesNotifications).toHaveBeenCalled();
      expect(mockDispatchPushAction).toHaveBeenCalledWith(defaultProps.viewLink);
    });

    it("should not clear notifications when clicking on other tabs", () => {
      const eventMock = {
        preventDefault: jest.fn(),
      };

      render(<GamingRibbonCard {...defaultProps} icon="SLOTS" />);

      IconButton.mock.calls[0][0].onPress(eventMock);

      expect(clearFavouritesNotifications).not.toHaveBeenCalled();
    });
  });
});
