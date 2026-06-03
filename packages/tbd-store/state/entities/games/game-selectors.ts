import URN from "../../layout/URN";
import { Game, Games } from "../index";

/**
 * For a given game card URN, returns the corresponding Game or undefined if there's none
 */
export const getGameByURN = (state: Games, urn: URN): Game | undefined => state[urn];
