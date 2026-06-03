import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { IconButton } from "@ppb/the-wall-web";
import { SportsIconName } from "@ppb/the-wall-icons";
import SportViewLinkCard from "./SportViewLinkCard.web";

jest.mock("@ppb/the-wall-web", () => ({
  IconButton: jest.fn(() => <icon-button-mock />),
}));

const sportViewLinkMock = {
  urn: "ppb:urn:1",
  sportId: 1,
  sportName: "Football",
  sportViewLink: {
    viewUrl: "viewUrl",
    viewUrn: "viewUrn",
  },
};

const dispatchRouterPushAction = jest.fn();
const dispatchNavigationViewFromFavourites = jest.fn();

function renderSportViewLink({ urn, sportId, sportName, sportViewLink } = {}) {
  const props = {
    urn,
    sportId,
    sportName,
    sportViewLink,
    dispatchRouterPushAction,
    dispatchNavigationViewFromFavourites,
  };

  return render(<SportViewLinkCard {...props} />);
}

describe("SportViewLink", () => {
  beforeEach(jest.clearAllMocks);

  it("should render the IconButton component", () => {
    renderSportViewLink(sportViewLinkMock);

    expect(IconButton).toHaveBeenCalledTimes(1);
    expect(IconButton).toHaveBeenCalledWith(
      {
        icon: SportsIconName.FOOTBALL,
        text: "Football",
        isLargeIcon: true,
        onPress: expect.any(Function),
      },
      undefined,
    );
  });

  describe("when clicked in the sport view link card", () => {
    const eventMock = {
      preventDefault: jest.fn(),
    };

    it("should prevent the default event", () => {
      renderSportViewLink(sportViewLinkMock);

      IconButton.mock.calls[0][0].onPress(eventMock);

      expect(eventMock.preventDefault).toHaveBeenCalledTimes(1);
      expect(eventMock.preventDefault).toHaveBeenCalled();
    });

    it("must dispatch the click action", () => {
      renderSportViewLink(sportViewLinkMock);

      IconButton.mock.calls[0][0].onPress(eventMock);

      expect(dispatchRouterPushAction).toHaveBeenCalledWith({ viewUrl: "viewUrl", viewUrn: "viewUrn" });
    });

    it("must dispatch the GTM action", () => {
      renderSportViewLink(sportViewLinkMock);

      IconButton.mock.calls[0][0].onPress(eventMock);

      expect(dispatchNavigationViewFromFavourites).toHaveBeenCalledWith("ppb:urn:1", "Football", "viewUrl");
    });
  });
});
