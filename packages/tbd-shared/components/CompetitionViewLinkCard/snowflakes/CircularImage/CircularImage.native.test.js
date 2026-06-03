import { render } from "@testing-library/react-native";

import { tokens } from "@ppb/the-wall-common/base-theme";
import { SportsIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { TBDImage } from "@ppb/the-wall-native";

import { CircularImageSize } from "./CircularImage.types";
import { CircularImage } from "./CircularImage.native";
import { CIRCULAR_IMAGE, CIRCULAR_IMAGE_CONTAINER, CIRCULAR_IMAGE_TEXT } from "./CircularImage.native.selectors";
import styles from "./CircularImage.native.styles";

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-native", () => ({
  TBDImage: jest.fn((props) => <tbd-image-mock {...props} />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn((props) => <generic-icon-mock {...props} />),
}));

const renderCircularImage = ({ imageURL, fallbackIcon, text, size } = {}) => {
  const container = render(<CircularImage imageURL={imageURL} fallbackIcon={fallbackIcon} text={text} size={size} />);

  return {
    container: container.queryByTestId(CIRCULAR_IMAGE),
    imageContainer: container.queryByTestId(CIRCULAR_IMAGE_CONTAINER),
    imageText: container.queryByTestId(CIRCULAR_IMAGE_TEXT),
  };
};

describe("CircularImage", () => {
  beforeEach(jest.clearAllMocks);

  describe("when image URL is defined", () => {
    it("should render the image container with correct style", () => {
      const { imageContainer } = renderCircularImage({ imageURL: "fakeImageUrl" });

      expect(imageContainer).not.toBeNull();
      expect(imageContainer).toHaveStyle(styles.large);
    });

    it("should render the image with the correct src values", () => {
      renderCircularImage({ imageURL: "fakeImageUrl" });

      expect(TBDImage).toHaveBeenCalledWith(
        {
          source: "fakeImageUrl",
          style: styles.image,
        },
        undefined,
      );
    });

    describe("and size is small", () => {
      it("should render the image container with small styling", () => {
        const { imageContainer } = renderCircularImage({ imageURL: "fakeImageUrl", size: CircularImageSize.Small });

        expect(imageContainer).toHaveStyle(styles.small);
      });
    });
  });

  describe("when image url is not defined", () => {
    it("should call GenericIcon with the correct props", () => {
      renderCircularImage();

      expect(GenericIcon).toHaveBeenCalledWith(
        {
          name: SportsIconName.COMPETITION,
          color: tokens.NeutralsIconSecondary,
        },
        undefined,
      );
    });

    describe("and size is small", () => {
      it("should render the image default container with small styling", () => {
        const { imageContainer } = renderCircularImage({ size: CircularImageSize.Small });

        expect(imageContainer).toHaveStyle(styles.small);
      });
    });

    describe("and fallbackIcon is defined", () => {
      it("should call GenericIcon with the fallbackIcon", () => {
        renderCircularImage({ fallbackIcon: SportsIconName.FOOTBALL });

        expect(GenericIcon).toHaveBeenCalledWith(
          {
            name: SportsIconName.FOOTBALL,
            color: tokens.NeutralsIconSecondary,
          },
          undefined,
        );
      });
    });
  });

  describe("when text is defined", () => {
    it("should have the correct text", () => {
      const { imageText } = renderCircularImage({ text: "fake Competition Text" });

      expect(imageText).toHaveTextContent("fake Competition Text");
    });
  });
});
