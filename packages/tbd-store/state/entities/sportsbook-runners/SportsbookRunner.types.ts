import { Runner } from "../Runner.types";
import { EachWayOdds, SportsbookOdds } from "../SportsbookOdds.types";

/**
 * Enum that references PryceTypeEnum of FBR searchBets
 * https://flutteruki.atlassian.net/wiki/spaces/SportsbookPlatform/pages/97377518/FBR+-+Interface+Definitions+IDD
 */
// eslint-disable-next-line no-restricted-syntax
export enum SportsbookRunnerPriceType {
  Live = "LIVE",
  Starting = "STARTING",
  Guaranteed = "GUARANTEED",
  Dividend = "DIVIDEND",
}
/**
 * Runner status enum
 * A Sportsbook Runner may have one of three status: ACTIVE, SUSPENDED and REMOVED
 *
 * https://flutteruki.atlassian.net/wiki/spaces/SportsbookPlatform/pages/97269123/IDD+-+getMarketPrices
 */
export type SportsbookRunnerStatus = "ACTIVE" | "SUSPENDED" | "REMOVED";

/**
 * Data model that represent a merge between common market runner attributes and specific sportsbook runner attributes.
 */
export type SportsbookRunner = {
  /** Odds available to bet and displayed for the user */
  odds?: SportsbookOdds;
  /** Odds available to bet with precision not displayed to the user */
  trueOdds?: SportsbookOdds;
  /** Previous Win Runner Odds (price history) */
  previousOdds?: SportsbookOdds[];
  /** Runner status */
  status: SportsbookRunnerStatus;
  /** EachWay Odds */
  eachWayOdds?: EachWayOdds;
} & Runner;

/**
 * Data model holding key-value structure where the key is a unique identifier (runner URN in this case) stored on the
 * value too
 *
 * @example
 *  {
 *    "myUniqueId": {
 *      id: "myUniqueId",
 *      name: "",
 *      ...
 *    }
 *  }
 */
export type SportsbookRunners = {
  [runner: string]: SportsbookRunner;
};
