import { TrackingBarStatus } from "@ppb/the-wall-common/types";
import { AssetsIconName } from "@ppb/the-wall-icons";

export type SkyBetClubTrackerProps = {
  /**
   *  The current value of the tracking bar
   */
  current: number;

  /**
   * The goal value of the tracking bar
   */
  target: number;

  /**
   * The status of the tracking bar, uses the TrackingBarStatus enum
   */
  sbcStatus: TrackingBarStatus | "ERROR";

  /**
   * Whether the tracking bar is fulfilled
   */
  fulfilled: boolean;

  /**
   * The label for the counter
   */
  counterLabel: string;

  /**
   * The function to call when the primary button is tapped
   */
  onPrimaryButtonTap?: () => void;

  /**
   * The internationalisation object, should take lokalised strings
   */
  i18n: {
    /**
     * The first line
     */
    firstLine: string;

    /**
     * The second line
     */
    secondLine?: string;

    /**
     * The number of days left to qualify or choose a reward
     */
    infoLabelDays?: string;

    /**
     * The primary button label
     */
    primaryButtonLabel: string;

    /**
     * The supporting text, basically the T&Cs
     */
    supportingText?: string;
  };

  /**
   * The logo
   */
  logo: AssetsIconName | null;
};
