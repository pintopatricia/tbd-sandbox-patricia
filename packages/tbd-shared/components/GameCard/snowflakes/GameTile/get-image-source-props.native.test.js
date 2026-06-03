import { getImageSourceProps } from "./get-image-source-props.native";

describe("getImageSourceProps", () => {
  let imageSourceProps;
  const background = {
    small: {
      url: "url_small",
      width: 250,
      height: 250,
    },
    medium: {
      url: "url_medium",
      width: 450,
      height: 450,
    },
    large: {
      url: "url_large",
      width: 900,
      height: 900,
    },
    alt: "Background image",
  };

  describe("when the background is provided", () => {
    beforeEach(() => {
      imageSourceProps = getImageSourceProps(background);
    });

    it("should return array of images with small, medium and large pics with proper uri, heights and widths", () => {
      expect(imageSourceProps).toEqual([
        {
          uri: "url_small",
          width: 250,
          height: 250,
        },
        {
          uri: "url_medium",
          width: 450,
          height: 450,
        },
        {
          uri: "url_large",
          width: 900,
          height: 900,
        },
      ]);
    });
  });
});
