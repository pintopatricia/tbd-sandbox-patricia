import { BettingState } from "@ppb/betslip-core";
import { RunnersMetadata } from "@ppb/tbd-store/state/betting/sportsbook-betting/SportsbookBetting.types";
import { SportsbookOdds } from "@ppb/tbd-store/state/entities/SportsbookOdds.types";
import { hasAnyMarketClosedFailure, hasAnyMarketSuspendedFailure } from "@ppb/tbd-store/helpers/sportsbook-betting";
import { HintType } from "@ppb/the-wall-common/types";
import { i18n } from "../../../helpers/i18n";
import { TranslationKey } from "../../../translations/keys";

type SingleLegExtraDetails = {
  previousOdds?: SportsbookOdds;
  hasFailure: boolean;
  eachWaySubtitle?: string;
  hintType?: HintType;
  hintMessage?: string;
};

const getMarketFailureCode = (runnerFailures: BettingState.ImplyRunnerFailure[]): string | undefined => {
  if (hasAnyMarketClosedFailure(runnerFailures)) {
    return "CLOSED";
  }

  if (hasAnyMarketSuspendedFailure(runnerFailures)) {
    return "SUSPENDED";
  }

  return undefined;
};

export const buildSingleLegExtraDetails = (
  combination: BettingState.Combination,
  legs: BettingState.LegsMap,
  failures: BettingState.ImplyFailureGroup,
  metadata: RunnersMetadata,
): SingleLegExtraDetails => {
  const [legId] = combination.legs;
  const [runnerId] = legs[legId].runners;
  const runnerMetadata = metadata[runnerId];
  const [firstPreviousOdds] = runnerMetadata?.previousOdds || [];
  const runnerFailure = failures.runners[runnerId];
  const failureCode = getMarketFailureCode(runnerFailure || []);
  const hasFailure = !!failureCode;

  return {
    previousOdds: firstPreviousOdds,
    hasFailure,
    eachWaySubtitle: combination.isEachWayAvailable
      ? i18n({
          key: "I18N.BETSLIP.EACHWAY_ODDS_PLACES",
          interpolationValues: {
            numerator: combination.eachWayPlacesFraction?.numerator || "",
            denominator: combination.eachWayPlacesFraction?.denominator || "",
            places: combination.eachWayPlaces || "",
          },
        })
      : undefined,
    hintType: hasFailure ? HintType.Warning : undefined,
    hintMessage: hasFailure ? i18n({ key: `I18N.MARKET.${failureCode}` as keyof TranslationKey }) : undefined,
  };
};
