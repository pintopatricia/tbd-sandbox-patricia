import { getBackgroundImage, getImsPromoUrlWithReturnUrl } from "./promotion-card-helper";

jest.mock("../../config/endpoints", () => ({
  getCloudflareWhitelistDomains: jest.fn().mockReturnValue([".*pma-s3.betfair.com", ".*cdnppb.net"]),
}));

describe("getBackgroundImage", () => {
  const BACKGROUND_IMAGE_1 = {
    url: "https://kpo.nxt.internal/media/english_uk/images/cpp/commons/artwork-1200x1200.jpg",
    width: 1200,
    height: 1200,
    tag: "square",
  };

  const BACKGROUND_IMAGE_2 = {
    url: "https://kpo.nxt.internal/media/english_uk/images/cpp/commons/artwork-900x900.jpg",
    width: 900,
    height: 900,
    tag: "square",
  };
  const BACKGROUND_IMAGE_3 = {
    url: "https://kpo.nxt.internal/media/english_uk/images/cpp/commons/artwork-450x450.jpg",
    width: 450,
    height: 450,
    tag: "square",
  };
  const BACKGROUND_IMAGE_4 = {
    url: "https://kpo.nxt.internal/media/english_uk/images/cpp/commons/artwork-225x225.jpg",
    width: 225,
    height: 225,
    tag: "square",
  };
  const BACKGROUND_IMAGE_5 = null;
  const BACKGROUND_IMAGE_6 = {
    url: "https://kpo.nxt.internal/media/english_uk/images/cpp/commons/artwork-225x225.jpg",
    width: 563,
    height: 563,
    tag: "carousel",
  };

  const BACKGROUND_IMAGE_7 = {
    url: "https://kpo.nxt.internal/media/english_uk/images/cpp/commons/artwork-225x225.jpg",
    width: 281,
    height: 281,
    tag: "carousel",
  };

  const DEVICE_WIDTH = 375;
  const TABLET_DEVICE_WIDTH = 768;
  const SMALL_MOBILE_DEVICE_WIDTH = 280;

  describe("when only one image is provided", () => {
    it("should return the only background image object available", () => {
      const result = getBackgroundImage([BACKGROUND_IMAGE_1], DEVICE_WIDTH);

      expect(result).toEqual(BACKGROUND_IMAGE_1);
    });
  });

  describe("when more than one image is provided", () => {
    describe("and the images are sorted", () => {
      it("should return background image with width higher and closer to the device window width", () => {
        const result = getBackgroundImage(
          [BACKGROUND_IMAGE_1, BACKGROUND_IMAGE_2, BACKGROUND_IMAGE_3, BACKGROUND_IMAGE_4],
          DEVICE_WIDTH,
          false,
        );

        expect(result).toEqual(BACKGROUND_IMAGE_3);
      });
    });

    describe("and there is a play new promo", () => {
      it("should return carousel image with width higher and closer to the device window width", () => {
        const result = getBackgroundImage(
          [
            BACKGROUND_IMAGE_1,
            BACKGROUND_IMAGE_2,
            BACKGROUND_IMAGE_3,
            BACKGROUND_IMAGE_4,
            BACKGROUND_IMAGE_6,
            BACKGROUND_IMAGE_7,
          ],
          SMALL_MOBILE_DEVICE_WIDTH,
          true,
        );

        expect(result).toEqual(BACKGROUND_IMAGE_7);
      });

      it("should return carousel image with width higher when the device width is larger than mobile", () => {
        const result = getBackgroundImage(
          [
            BACKGROUND_IMAGE_1,
            BACKGROUND_IMAGE_2,
            BACKGROUND_IMAGE_3,
            BACKGROUND_IMAGE_4,
            BACKGROUND_IMAGE_6,
            BACKGROUND_IMAGE_7,
          ],
          TABLET_DEVICE_WIDTH,
          true,
        );
        expect(result).toEqual(BACKGROUND_IMAGE_6);
      });
    });

    describe("and the images are NOT sorted", () => {
      it("should return background image with width higher and closer to the device window width", () => {
        const result = getBackgroundImage(
          [BACKGROUND_IMAGE_3, BACKGROUND_IMAGE_2, BACKGROUND_IMAGE_4, BACKGROUND_IMAGE_1],
          DEVICE_WIDTH,
        );

        expect(result).toEqual(BACKGROUND_IMAGE_3);
      });
    });

    describe("and the images don't have width property", () => {
      it("should return background image with width higher and closer to the device window width", () => {
        const result = getBackgroundImage(
          [{ ...BACKGROUND_IMAGE_3, width: undefined }, BACKGROUND_IMAGE_2, BACKGROUND_IMAGE_4, BACKGROUND_IMAGE_1],
          DEVICE_WIDTH,
        );

        expect(result).toEqual(BACKGROUND_IMAGE_2);
      });
    });

    describe("and one of the images is null", () => {
      it("should return background image with width higher and closer to the device window width", () => {
        const result = getBackgroundImage(
          [BACKGROUND_IMAGE_5, BACKGROUND_IMAGE_3, BACKGROUND_IMAGE_2, BACKGROUND_IMAGE_4, BACKGROUND_IMAGE_1],
          DEVICE_WIDTH,
        );

        expect(result).toEqual(BACKGROUND_IMAGE_3);
      });
    });

    describe("and the images are null", () => {
      it("should return undefined", () => {
        const result = getBackgroundImage(
          [BACKGROUND_IMAGE_5, BACKGROUND_IMAGE_5, BACKGROUND_IMAGE_5, BACKGROUND_IMAGE_5, BACKGROUND_IMAGE_5],
          DEVICE_WIDTH,
        );

        expect(result).toEqual(undefined);
      });
    });

    describe("and the images array is empty", () => {
      it("should return undefined", () => {
        const result = getBackgroundImage([], DEVICE_WIDTH);

        expect(result).toEqual(undefined);
      });
    });
  });
});

describe("getImsPromoUrlWithReturnUrl", () => {
  it("should return correct url when there is a currentUrl and currentUrn", () => {
    const url = "https://localhost.betfair.com/betting";
    const currentUrn = "ppb:tbd:view:generic:home";
    const currentUrl = "casino/gm-1";
    const promoUrl =
      "casino/promotions/gaming-claim-now-intervals-decimals-en_en/imsPromotion:gaming-claim-now-intervals-decimals-en_en";
    const newUrl =
      "casino/promotions/gaming-claim-now-intervals-decimals-en_en/imsPromotion:gaming-claim-now-intervals-decimals-en_en?urn=ppb%3Atbd%3Aview%3Ageneric%3Ahome&url=casino%2Fgm-1";

    expect(getImsPromoUrlWithReturnUrl(promoUrl, url, currentUrl, currentUrn)).toEqual(newUrl);
  });

  it("should return undefined when there is a no currentUrl and currentUrn", () => {
    const url = "https://localhost.betfair.com/betting";
    const promoUrl =
      "casino/promotions/gaming-claim-now-intervals-decimals-en_en/imsPromotion:gaming-claim-now-intervals-decimals-en_en";

    expect(getImsPromoUrlWithReturnUrl(promoUrl, url, undefined, undefined)).toEqual(undefined);
  });
});
