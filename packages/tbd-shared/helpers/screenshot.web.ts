import * as htmlToImage from "html-to-image";
import { Options } from "html-to-image/src/types";

/**
 * Takes a screenshot of an element even if not entirely visible on the screen
 *
 * @param ref the ref of the element to be captured
 * @param options the options object to be passed to htmlToImage.toBlob(), with the `type` property for example
 * @param fileName the name of the image file
 * @returns a Promise that resolves with the image File, or rejected with the Exception given below
 * @throws {Error} if an error occurred while capturing the ref or while converting to Blob
 */
export const takeElementScreenshot = async (
  ref: HTMLElement,
  options?: Options,
  fileName = "betfair",
): Promise<File> => {
  let blob;

  try {
    blob = await htmlToImage.toBlob(ref, {
      ...options,
      type: options?.type || "image/png",
      /** We are removing the <img> elements from the captured screenshot as it was throwing an error
       * when taking screenshot when the RaceDetailsCard included the countryFlag
       */
      filter: (node) => !(node instanceof HTMLImageElement),
    });
  } catch (error) {
    throw new Error(`An error occurred while taking the screenshot: ${error}`);
  }

  if (!blob) {
    throw new Error("The element could not be converted to a blob");
  }

  return new File([blob], `${fileName}.png`, { type: blob.type });
};
