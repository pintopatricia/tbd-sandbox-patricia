import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { NavigationTabLabelState } from "@ppb/the-wall-common/types";
import { NavigationTabLabel } from "@ppb/the-wall-web";
import { SportsIconName } from "@ppb/the-wall-icons";
import GenericViewLinkCard from "./GenericViewLinkCard.web";
import { TEST_ID } from "./GenericViewLinkCard.web.selectors";

jest.mock("@ppb/the-wall-web", () => ({
  NavigationTabLabel: jest.fn(() => <navigation-tab-label-mock />),
  IconButton: jest.fn(() => <icon-button-mock />),
}));

function renderGenericViewLinkCard({
  urn = "ppb:inplay:1",
  viewLink = {
    viewUrl: "view/generic:inplay",
    viewUrn: "ppb:tbd:view:generic:inplay",
  },
  icon = SportsIconName.BADMINTON,
  title = "Title",
  inPlay = false,
  isLargeIcon = false,
  dispatchRouterPushAction = () => {},
  dispatchNavigationViewFromFavourites = () => {},
}) {
  return render(
    <GenericViewLinkCard
      urn={urn}
      viewLink={viewLink}
      icon={icon}
      inPlay={inPlay}
      isLargeIcon={isLargeIcon}
      title={title}
      dispatchRouterPushAction={dispatchRouterPushAction}
      dispatchNavigationViewFromFavourites={dispatchNavigationViewFromFavourites}
    />,
  );
}

describe("GenericViewLinkCard", () => {
  beforeEach(jest.clearAllMocks);

  it("should render the NavigationTabLabel component", () => {
    renderGenericViewLinkCard({ inPlay: false });

    expect(NavigationTabLabel).toHaveBeenCalledTimes(1);
    expect(NavigationTabLabel).toHaveBeenCalledWith(
      {
        icon: SportsIconName.BADMINTON,
        id: "1",
        state: NavigationTabLabelState.Active,
        text: "Title",
        inPlay: false,
      },
      undefined,
    );
  });

  describe("when the generic view link is clicked", () => {
    it("must dispatch the dispatchRouterPushAction action", () => {
      const dispatchRouterPushAction = jest.fn();
      const { container } = renderGenericViewLinkCard({ dispatchRouterPushAction });
      container.querySelector(TEST_ID).click();

      expect(dispatchRouterPushAction).toHaveBeenCalledWith({
        viewUrl: "view/generic:inplay",
        viewUrn: "ppb:tbd:view:generic:inplay",
      });
    });

    it("must dispatch the dispatchNavigationViewFromFavourites action", () => {
      const dispatchNavigationViewFromFavourites = jest.fn();
      const { container } = renderGenericViewLinkCard({ dispatchNavigationViewFromFavourites });
      container.querySelector(TEST_ID).click();

      expect(dispatchNavigationViewFromFavourites).toHaveBeenCalledWith("Title", "view/generic:inplay", "ppb:inplay:1");
    });
  });
});
