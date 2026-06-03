import { RefObject } from "react";
import { CaptureOptions, captureRef } from "react-native-view-shot";

/**
 * Takes a screenshot of an element even if not entirely visible on the screen
 *
 * @param ref the ref of the element to be captured
 * @param options the options object passed to captureRef(), with the `format` property for example
 * @returns a Promise that resolves with the image URI, or rejected with the Exception given below
 * @throws {Error} if an error occurred while capturing the ref
 */
export const takeElementScreenshot = async (
  ref: RefObject<null>,
  options?: CaptureOptions,
): Promise<string | undefined> => {
  try {
    return await captureRef(ref, {
      ...options,
      format: options?.format || "png",
    });
  } catch (error) {
    throw new Error(`An error occurred while taking the screenshot: ${error}`);
  }
};
