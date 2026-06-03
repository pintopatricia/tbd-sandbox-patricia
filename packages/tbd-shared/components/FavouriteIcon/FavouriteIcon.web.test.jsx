import { render } from "@testing-library/react";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import FavouriteIcon from "./FavouriteIcon.web";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
  IconsList: {
    FAVOURITE_FILLED: "mock-filled",
    FAVOURITE_OUTLINE: "mock-outline",
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

describe("FavouriteIcon Web", () => {
  beforeEach(jest.clearAllMocks);

  describe("when it is not favourite", () => {
    it("should call GenericIcon with the correct props", () => {
      renderFavouriteIcon();

      expect(GenericIcon).toHaveBeenCalledWith(
        {
          color: "var(--favourite-icon-unselected-colour)",
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
        color: "var(--favourite-icon-selected-colour)",
        name: "mock-filled",
      },
      undefined,
    );
  });

  describe("when isFavourite is not provided", () => {
    it("should not call the GenericIcon component", () => {
      renderFavouriteIcon({ isFavourite: undefined });

      expect(GenericIcon).not.toHaveBeenCalled();
    });
  });

  describe("when the icon button is pressed", () => {
    describe("and isPressBlocked is true", () => {
      it("should not dispatch any action", () => {
        const { getByTestId } = renderFavouriteIcon({ isPressBlocked: true });
        const button = getByTestId("favourite-icon-button");

        const event = new MouseEvent("click", { bubbles: true });
        jest.spyOn(event, "stopPropagation");

        button.dispatchEvent(event);

        expect(event.stopPropagation).toHaveBeenCalled();
        expect(DEFAULT_PROPS.dispatchToggleFavouriteAction).not.toHaveBeenCalled();
      });
    });

    describe("and isPressBlocked is false", () => {
      it("should call dispatchToggleFavouriteAction", () => {
        const { getByTestId } = renderFavouriteIcon({ isPressBlocked: false });
        const button = getByTestId("favourite-icon-button");

        const event = new MouseEvent("click", { bubbles: true });
        jest.spyOn(event, "stopPropagation");

        button.dispatchEvent(event);

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
