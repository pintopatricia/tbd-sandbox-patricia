import { Runner } from "../Runner.types";
import { ExchangeBetAvailability } from "../ExchangeBetAvailability.types";
import { ExchangeRunnerStatus } from "../../constants";

/**
 * Data model that represent a merge between common market runner attributes and specific exchange runner attributes.
 */
export type ExchangeRunner = {
  /** A set of odds available for back bets - bets in favour of the runner we are betting */
  back?: ExchangeBetAvailability[];
  /** A set of odds available for lay bets - bets against the runner we are betting */
  lay?: ExchangeBetAvailability[];
  /** The non-runner deduction percentage */
  reduction: number | null;
  /** The non-runner removal date */
  date: string | null;
  /** The runner status */
  status?: ExchangeRunnerStatus;
} & Runner;

/**
 * A key-value structure where the key is a unique identifier (runner URN in this case) stored on the value too
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
export type ExchangeRunners = {
  [urn: string]: ExchangeRunner;
};
