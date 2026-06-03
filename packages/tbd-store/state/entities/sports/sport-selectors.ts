import URN from "../../layout/URN";
import { Sport, Sports } from "./Sport.types";

/**
 * For a given sport event URN, returns the corresponding event or undefined if there's none
 */
export const getSportByURN = (state: Sports, urn: URN): Sport | undefined => state[urn];
