import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SportsIconName } from "@ppb/the-wall-icons";

import { CircularImageSize } from "./CircularImage.types";
import { CircularImage } from "./CircularImage.web";
import { IMAGE_CONTAINER, IMAGE, TEXT } from "./CircularImage.web.selectors";
import styles from "./CircularImage.web.css";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn((props) => <generic-icon-mock {...props} />),
}));

const setup = ({ imageURL, imageAlt, fallbackIcon, text, size } = {}) => {
  const { container } = render(
    <CircularImage imageURL={imageURL} imageAlt={imageAlt} fallbackIcon={fallbackIcon} text={text} size={size} />,
  );

  return {
    imageContainer: container.querySelector(IMAGE_CONTAINER),
    image: container.querySelector(IMAGE),
    text: container.querySelector(TEXT),
  };
};

describe("CircularImage", () => {
  beforeEach(jest.clearAllMocks);

  describe("when image URL is defined", () => {
    const imageURL = "fakeImageURL";
    const imageAlt = "fakeImageAlt";

    it("should render the image container with correct style", () => {
      const { imageContainer } = setup({ imageURL, imageAlt });

      expect(imageContainer).toHaveClass(styles.imageContainer, styles.large);
    });

    it("should render the image with correct src and alt values", () => {
      const { image } = setup({ imageURL, imageAlt });

      expect(image).toHaveAttribute("src", imageURL);
      expect(image).toHaveAttribute("alt", imageAlt);
    });

    describe("and size is small", () => {
      it("should render the image container with small styling", () => {
        const { imageContainer } = setup({ imageURL, imageAlt, size: CircularImageSize.Small });

        expect(imageContainer).toHaveClass(styles.imageContainer, styles.small);
      });
    });
  });

  describe("when image URL is not defined", () => {
    it("should call GenericIcon with the default fallbackIcon", () => {
      setup();

      expect(GenericIcon).toHaveBeenCalledWith(
        {
          name: SportsIconName.COMPETITION,
          color: "var(--neutrals-icon-secondary)",
        },
        undefined,
      );
    });

    describe("and size is small", () => {
      it("should render the image container with small styling", () => {
        const { imageContainer } = setup({ size: CircularImageSize.Small });

        expect(imageContainer).toHaveClass(styles.small);
      });
    });

    describe("and fallbackIcon is defined", () => {
      it("should call GenericIcon with the fallbackIcon", () => {
        setup({ fallbackIcon: SportsIconName.FOOTBALL });

        expect(GenericIcon).toHaveBeenCalledWith(
          {
            name: SportsIconName.FOOTBALL,
            color: "var(--neutrals-icon-secondary)",
          },
          undefined,
        );
      });
    });
  });

  describe("when text is defined", () => {
    it("should have the correct text", () => {
      const { text } = setup({ text: "fakeText" });

      expect(text).toHaveTextContent("fakeText");
    });
  });
});
