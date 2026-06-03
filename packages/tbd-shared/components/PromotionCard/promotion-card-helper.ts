import { PromotionBackgroundImage } from "@ppb/tbd-store/state/layout/cards/Card.types";

/**
 * Return the current image if current image is bigger that device ratio
 *
 * @param deviceWidth Device width
 * @param previousImage The previous selected image
 * @param currentImage The new victim image
 * @returns The current image if fits under the device ratio, previous image otherwise
 */
const getSelectedImage = (
  deviceWidth: number,
  previousImage: PromotionBackgroundImage,
  currentImage: PromotionBackgroundImage,
): PromotionBackgroundImage => {
  // The promotion card will have 88% of the screen width
  const cardPercentageScreenWidth = 0.88;

  return currentImage.width && currentImage.width >= deviceWidth * cardPercentageScreenWidth
    ? currentImage
    : previousImage;
};

/**
 * Sort the list of images by size
 *
 * @param backgroundImages The background image list
 * @param isPlayNewPromo PlayNewPromo flag
 *
 * @returns The ordered list
 */
const getSortedBackgroundImages = (
  backgroundImages: (PromotionBackgroundImage | null)[],
  isPlayNewPromo?: boolean | undefined,
): PromotionBackgroundImage[] => {
  const nonNullBackgroundImages = backgroundImages.filter((image): image is PromotionBackgroundImage => image !== null);
  const sortedPlayNewImages = nonNullBackgroundImages.filter((image) => image?.tag === "carousel");
  const sortedBackgroundImages = isPlayNewPromo ? sortedPlayNewImages : nonNullBackgroundImages;

  return sortedBackgroundImages.sort((a: PromotionBackgroundImage, b: PromotionBackgroundImage) =>
    a.width && b.width ? b.width - a.width : 0,
  );
};

/**
 * Determines the best image from the list to display on this device viewport
 *
 * @param backgroundImages The background image list
 * @param deviceWidth The device with
 * @param isPlayNewPromo PlayNewPromo flag
 * @returns The best fitted image to display
 */
export const getBackgroundImage = (
  backgroundImages: (PromotionBackgroundImage | null)[],
  deviceWidth: number,
  isPlayNewPromo?: boolean | undefined,
): PromotionBackgroundImage | undefined => {
  const sortedImages = getSortedBackgroundImages(backgroundImages, isPlayNewPromo);

  const finalImage: PromotionBackgroundImage | null = sortedImages.reduce(
    (previousImage, currentImage) => getSelectedImage(deviceWidth, previousImage, currentImage),
    sortedImages[0],
  );

  if (!finalImage) {
    return undefined;
  }

  return finalImage;
};

export const getImsPromoUrlWithReturnUrl = (
  promoUrl: string,
  url: string,
  currentUrl?: string,
  currentUrn?: string,
): string | undefined => {
  let imsPromoWithReturnUrl;
  if (currentUrn && currentUrl) {
    const baseUrl = url.replace(currentUrl, "");
    const newUrl = new URL(baseUrl + promoUrl);
    newUrl.searchParams.set("urn", currentUrn);
    newUrl.searchParams.set("url", currentUrl);
    imsPromoWithReturnUrl = newUrl.toString().replace(baseUrl, "");
  }
  return imsPromoWithReturnUrl;
};
