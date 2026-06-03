import { render } from "@testing-library/react-native";
import { SportsIconName } from "@ppb/the-wall-icons";
import { IconButton } from "@ppb/the-wall-native";

import { navigate } from "@ppb/tbd-router/native";
import SportViewLinkCard from "./SportViewLinkCard.native";

jest.mock("@ppb/the-wall-native", () => ({
  IconButton: jest.fn(() => <icon-button-mock />),
}));

jest.mock("@ppb/tbd-router/native", () => ({ navigate: jest.fn() }));

const SPORT_VIEW_LINK = {
  viewUrn: "ppb:tbd:view:sport:7",
  viewUrl: "horse-racing/s-7",
};

const sportViewLinkMock = {
  urn: "ppb:tbd:view:sport:7",
  sportId: 7,
  sportName: "Horse Racing",
  sportViewLink: SPORT_VIEW_LINK,
};

const dispatchNavigationViewFromFavourites = jest.fn();

function renderSportViewLink({ urn, sportId, sportName, sportViewLink } = {}) {
  const props = {
    urn,
    sportId,
    sportName,
    sportViewLink,
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
        icon: SportsIconName.HORSE_RACING,
        text: "Horse Racing",
        isLargeIcon: true,
        onPress: expect.any(Function),
      },
      undefined,
    );
  });

  describe("when clicked in the sport view link card", () => {
    it("must dispatch a navigation onPress action", () => {
      renderSportViewLink(sportViewLinkMock);

      IconButton.mock.calls[0][0].onPress();

      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith(SPORT_VIEW_LINK);
    });

    it("must dispatch the dispatchNavigationViewFromFavourites action to GTM", () => {
      renderSportViewLink(sportViewLinkMock);

      IconButton.mock.calls[0][0].onPress();

      expect(dispatchNavigationViewFromFavourites).toHaveBeenCalledWith(
        "ppb:tbd:view:sport:7",
        "Horse Racing",
        "horse-racing/s-7",
      );
    });
  });
});
