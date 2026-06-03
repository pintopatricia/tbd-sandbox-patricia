export const canShare = (): boolean => !!navigator.canShare;

/**
 * IMPORTANT - There's a limitation with most of the target apps that discard either the text/url or the files when
 * trying to share an object that contains both properties.
 * It is advised to only share one property at a time.
 *
 * For more information, check the following spike:
 * https://flutteruki.atlassian.net/l/cp/4ABR7FLA
 *
 *
 * Invokes the native sharing mechanism of the device to share data such as text, URLs, or files.
 * The available share targets depend on the device, but might include the clipboard, contacts and email applications,
 * websites, Bluetooth, etc.
 *
 * Make sure you have the Web Share feature enabled at: chrome://flags/#web-share
 *
 * @param shareData an object containing data to share, which must include at least one of the following properties:
 * `url`, `text`, `title` or `files`.
 * @returns a Promise that resolves with undefined, or rejected with one of the Exceptions given below
 * @throws {Error} if the Web Share API is not supported by the browser, if there's something wrong with the data being
 * shared, or if an error occurred while sharing
 */
export const share = async (shareData: ShareData): Promise<void> => {
  if (!canShare()) {
    throw new Error("Your browser doesn't support the Web Share API");
  }

  if (!navigator.canShare(shareData)) {
    throw new Error("Your system doesn't support sharing these files");
  }

  try {
    await navigator.share(shareData);
  } catch (error) {
    throw new Error(`An error occurred while sharing: ${error}`);
  }
};
