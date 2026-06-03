import { render } from "@testing-library/react-native";
import { IconButton } from "@ppb/the-wall-native";
import { CasinoIconName } from "@ppb/the-wall-icons/types";
import { navigate } from "@ppb/tbd-router/native";
import GamingRibbonCard from "./GamingRibbonCard.native";

jest.mock("@ppb/the-wall-native", () => ({
  IconButton: jest.fn(() => <icon-button-mock />),
}));
jest.mock("@ppb/tbd-router/native", () => ({ navigate: jest.fn() }));

const defaultProps = {
  urn: "fakeUrn",
  viewLink: {
    viewUrl: "fakeViewUrl",
    viewUrn: "fakeViewUrn",
  },
  label: "fakeLabel",
  icon: "GAMES",
  dispatchNavigateToGameCategoryViewAction: jest.fn(),
  isGamesRibbonHighlighted: true,
};
function renderComponent(props) {
  return render(<GamingRibbonCard {...defaultProps} {...props} />);
}

describe("GamingRibbonCard", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("when render component", () => {
    it("render icon with correct icon prop", () => {
      renderComponent();
      expect(IconButton).toHaveBeenCalledTimes(1);
      expect(IconButton).toHaveBeenCalledWith(
        {
          icon: CasinoIconName.MY_GAMES,
          text: defaultProps.label,
          isHighlighted: true,
          isLargeIcon: true,
          onPress: expect.any(Function),
        },
        undefined,
      );
    });

    it("defaults to MY_GAMES icon when an invalid icon is provided", () => {
      renderComponent({ icon: "INVALID_ICON" });
      expect(IconButton).toHaveBeenCalledTimes(1);
      expect(IconButton).toHaveBeenCalledWith(
        {
          icon: CasinoIconName.MY_GAMES,
          text: defaultProps.label,
          isHighlighted: true,
          isLargeIcon: true,
          onPress: expect.any(Function),
        },
        undefined,
      );
    });
  });

  describe("when pressable is clicked", () => {
    it("when tapping on card should dispatch UI__NAVIGATE_TO_GAMING_CATEGORY_USING_CATEGORY_LINK_CARD action", () => {
      const spyNavigateToGamingCategoryAction = jest.fn();

      renderComponent({
        dispatchNavigateToGameCategoryViewAction: spyNavigateToGamingCategoryAction,
      });

      IconButton.mock.calls[0][0].onPress();

      expect(spyNavigateToGamingCategoryAction).toHaveBeenCalledWith(
        defaultProps.viewLink,
        defaultProps.urn,
        defaultProps.label,
      );
    });

    it("must call navigate with the viewLink", () => {
      renderComponent();

      IconButton.mock.calls[0][0].onPress();

      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith(defaultProps.viewLink);
    });
  });
});
