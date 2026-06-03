import { FetchCombinationsArguments, SportsbookImplyBetsService, ImplyBetsOpts } from "@ppb/platform-services";
import { ImplyBetsResult } from "@flutter-global/uki-channels-http-clients/src/clients/SportsbookImplyBets/SportsbookImplyBets";
import { createClientFactory } from "./client-factory";
import { SportsbookImplyError } from "../actions/betslip";

// creating two different factories
// because createClientFactory returns the same instance when called with different TLAs
const getSportsbookImplyBetsClient = createClientFactory(SportsbookImplyBetsService).bind(null, "SIB");

export type SportsbookImplyBetsSuccess = ImplyBetsResult;

export enum PricePolicy {
  NORMAL = "NORMAL",
  SUGGESTED = "SUGGESTED",
}

const GENERAL_ERROR: SportsbookImplyError = "GENERAL";

export const fetchCombinations = async (
  options: FetchCombinationsArguments,
  opts?: ImplyBetsOpts,
): Promise<SportsbookImplyBetsSuccess[]> => {
  if (options.betLegs && options.betLegs.length === 0) {
    return []; // Return empty array if no bet legs are provided
  }

  const client = getSportsbookImplyBetsClient();
  const implyAttempts = await client.implyBets(options, opts);

  if (implyAttempts.find((imply) => imply.respCode !== "SUCCESS")) {
    throw GENERAL_ERROR;
  }

  return implyAttempts;
};
