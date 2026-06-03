import { fireEvent, render } from "@testing-library/react-native";

import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import FavouriteIcon from "./FavouriteIcon.native";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
  IconsList: {
    FAVOURITE_FILLED: "mock-filled",
    FAVOURITE_OUTLINE: "mock-outline",
  },
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    FavouriteIconSelectedColour: "mock-selected",
    FavouriteIconUnselectedColour: "mock-unselected",
  },
}));

const DEFAULT_PROPS = {
  urn: "urn:mock",
  contentSectionURN: "contentSectionURN:mock",
  isPressBlocked: false,
  isFavourite: false,
  dispatchToggleFavouriteAction: jest.fn(),
};

const renderFavouriteIcon = (props = {}) => render(<FavouriteIcon {...DEFAULT_PROPS} {...props} />);

describe("FavouriteIcon Native", () => {
  beforeEach(jest.clearAllMocks);

  describe("when it is not favourite", () => {
    it("should call GenericIcon with the correct props", () => {
      renderFavouriteIcon();

      expect(GenericIcon).toHaveBeenCalledWith(
        {
          color: "mock-unselected",
          name: "mock-outline",
        },
        undefined,
      );
    });
  });

  describe("when it is favourite", () => {
    renderFavouriteIcon({ isFavourite: true });

    expect(GenericIcon).toHaveBeenCalledWith(
      {
        color: "mock-selected",
        name: "mock-filled",
      },
      undefined,
    );
  });

  describe("when isFavourite is not provided", () => {
    it("should not call the IconButton component", () => {
      renderFavouriteIcon({ isFavourite: undefined });

      expect(GenericIcon).not.toHaveBeenCalled();
    });
  });

  describe("when the icon button is pressed", () => {
    describe("and isPressBlocked is true", () => {
      it("should not dispatch any action", () => {
        const selectors = renderFavouriteIcon({ isPressBlocked: true });
        const pressable = selectors.queryByTestId("favourite-icon-pressable");

        const mockEvent = {
          stopPropagation: jest.fn(),
        };

        fireEvent(pressable, "onPress", mockEvent);

        expect(mockEvent.stopPropagation).toHaveBeenCalled();
        expect(DEFAULT_PROPS.dispatchToggleFavouriteAction).not.toHaveBeenCalled();
      });
    });

    describe("and isPressBlocked is false", () => {
      it("should call dispatchToggleFavouriteAction", () => {
        const selectors = renderFavouriteIcon({ isPressBlocked: false });

        const pressable = selectors.queryByTestId("favourite-icon-pressable");

        const mockEvent = {
          stopPropagation: jest.fn(),
        };

        fireEvent(pressable, "onPress", mockEvent);

        expect(mockEvent.stopPropagation).toHaveBeenCalled();
        expect(DEFAULT_PROPS.dispatchToggleFavouriteAction).toHaveBeenCalledTimes(1);
        expect(DEFAULT_PROPS.dispatchToggleFavouriteAction).toHaveBeenCalledWith(
          DEFAULT_PROPS.contentSectionURN,
          !DEFAULT_PROPS.isFavourite,
          DEFAULT_PROPS.urn,
        );
      });
    });
  });
});
