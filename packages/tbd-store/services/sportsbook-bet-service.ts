import { FixedOddsTransactional } from "@flutter-global/uki-channels-http-clients";
import {
  BetDefinition,
  PlaceBetResp,
  WalletAllocationTypeEnum,
} from "@flutter-global/uki-channels-http-clients/src/clients/SportsbookPlaceBet/FixedOddsTransactional";
import type { buildBetPlacement } from "@ppb/betslip-core";
import { createClientFactory } from "./client-factory";

const fixedOddsTransactionalClientFactory = createClientFactory(FixedOddsTransactional);

type PlaceSportsbookBetFailure = {
  definitions: SportsbookFailedPlaceDefinitions;
  combinations: SportsbookFailedPlaceCombinations;
  operation: SportsbookFailedPlaceResponse;
};

export class SportsbookTransactionalError extends Error {
  public definitions: SportsbookFailedPlaceDefinitions;

  public combinations: SportsbookFailedPlaceCombinations;

  public operation: PlaceBetResp;

  public constructor(failure: PlaceSportsbookBetFailure, ...params: any[]) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SportsbookTransactionalError);
    }

    this.name = "SportsbookTransactionalError";
    this.definitions = failure.definitions;
    this.combinations = failure.combinations;
    this.operation = failure.operation;
  }
}

export type SportsbookFailedPlaceCombinations = ReturnType<typeof buildBetPlacement>["combinations"];
export type SportsbookFailedPlaceDefinitions = BetDefinition[];
export type SportsbookFailedPlaceResponse = PlaceBetResp;
export type SportsbookTransactionalSuccess = PlaceBetResp;
export type PlaceOptions = {
  acceptLowerOdds: boolean;
  useAvailableBonus: boolean;
  dryRun: boolean;
  customerRef: string;
  walletAllocationType?: WalletAllocationTypeEnum;
};

export const placeBets = async (
  placement: ReturnType<typeof buildBetPlacement>,
  options: PlaceOptions,
): Promise<SportsbookTransactionalError | SportsbookTransactionalSuccess> => {
  const fixedOddsTransactionalClient = fixedOddsTransactionalClientFactory("SPB");
  const { acceptLowerOdds, useAvailableBonus, dryRun, customerRef, walletAllocationType } = options;
  const { definitions: placeDefinitions, combinations } = placement;
  const definitions = placeDefinitions as BetDefinition[];
  const placeResponse = await fixedOddsTransactionalClient.placeBet(definitions, {
    customerRef,
    acceptLowerOdds,
    useAvailableBonus,
    dryRun,
    walletAllocationType,
  });

  if (placeResponse.respCode !== "SUCCESS") {
    throw new SportsbookTransactionalError({
      definitions,
      combinations,
      operation: placeResponse,
    });
  }

  return placeResponse;
};
