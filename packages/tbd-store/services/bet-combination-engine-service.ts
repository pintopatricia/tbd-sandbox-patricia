import BetCombinationEngineService, {
  BetType,
  CombinationResult,
} from "@flutter-global/uki-channels-http-clients/src/clients/BetCombinationEngineService/BetCombinationEngineService";
import { BCERequest } from "@ppb/betslip-core";
import { createClientFactory } from "./client-factory";

const betCombinationEngineClientFactory = createClientFactory(BetCombinationEngineService);

export const getCombinationsList = async (payload: BCERequest.CombinationsPayload): Promise<CombinationResult> => {
  const betCombinationEngineClient = betCombinationEngineClientFactory("BCE");

  const response = await betCombinationEngineClient.getCombinations(payload.betType as BetType, payload.selections, {
    numberOfCombinations: payload.numberOfCombinations,
  });

  if (response.status !== "SUCCESS") {
    throw new Error(`BCE request ${response.status} ${response.statusDescription}`);
  }

  return response;
};
