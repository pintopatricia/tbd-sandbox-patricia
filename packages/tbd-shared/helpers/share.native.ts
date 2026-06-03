import Share, { ShareOptions } from "react-native-share";

/**
 * IMPORTANT - There's a limitation with most of the target apps that discard either the message or url when
 * trying to share an object that contains both properties.
 * It is advised to only share one property at a time.
 *
 * For more information, check the following spike:
 * https://flutteruki.atlassian.net/l/cp/4ABR7FLA
 *
 *
 * Shares data such as messages and files with other apps
 *
 * @param shareOptions an object containing options passed to Share.open(), for example `title`, `message` and `url`
 * @returns a Promise that resolves with undefined, or rejected with the Exception given below
 * @throws {Error} if an error occurred while sharing
 */
export const share = async (shareOptions: ShareOptions): Promise<void> => {
  try {
    await Share.open(shareOptions);
  } catch (error) {
    throw new Error(`An error occurred while sharing: ${error}`);
  }
};
