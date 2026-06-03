import { fireEvent, render } from "@testing-library/react-native";
import { NavigationTabLabelState } from "@ppb/the-wall-common/types";
import { NavigationTabLabel } from "@ppb/the-wall-native/components/TabsGroup/NavigationTabLabel/NavigationTabLabel";
import { SportsIconName } from "@ppb/the-wall-icons";
import { navigate } from "@ppb/tbd-router/native";
import GenericViewLinkCard from "./GenericViewLinkCard.native";
import { GENERIC_VIEW_LINK_CARD } from "./GenericViewLinkCard.native.selectors";

jest.mock("@ppb/the-wall-native/components/TabsGroup/NavigationTabLabel/NavigationTabLabel", () => ({
  NavigationTabLabel: jest.fn(() => <navigation-tab-label-mock />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  IconButton: jest.fn(() => <icon-button-mock />),
}));

jest.mock("@ppb/tbd-router/native", () => ({ navigate: jest.fn() }));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  spacings: {},
  colors: { NeutralsBackgroundElevation2: "#232325" },
}));

const dispatchNavigationViewFromFavourites = jest.fn();

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

  describe("when the generic view link card is clicked", () => {
    it("must call navigate with the viewLink", () => {
      const container = renderGenericViewLinkCard({});

      const pressable = container.queryByTestId(GENERIC_VIEW_LINK_CARD);
      fireEvent.press(pressable);

      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith({
        viewUrl: "view/generic:inplay",
        viewUrn: "ppb:tbd:view:generic:inplay",
      });
    });

    it("must dispatch the dispatchNavigationViewFromFavourites action to GTM", () => {
      const container = renderGenericViewLinkCard({});

      const pressable = container.queryByTestId(GENERIC_VIEW_LINK_CARD);
      fireEvent.press(pressable);

      expect(dispatchNavigationViewFromFavourites).toHaveBeenCalledWith("Title", "view/generic:inplay", "ppb:inplay:1");
    });
  });
});
