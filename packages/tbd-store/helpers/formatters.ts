import { BettingState } from "@ppb/betslip-core";
import { OddsDisplayPreference } from "../state/entities";
import { SportsbookOdds } from "../state/entities/SportsbookOdds.types";
import { ObbSportsbookOdds } from "../state/entities/obb-legs/ObbLegs.types";

type FractionLike = {
  numerator: number;
  denominator: number;
};

export const roundUp = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

export const roundDown = (value: number): number => Math.floor(value * 100) / 100;

function isBettingStateOdds(odds: SportsbookOdds | BettingState.Odds | ObbSportsbookOdds): odds is BettingState.Odds {
  return (odds as BettingState.Odds).decimalOdds !== undefined;
}

function buildFractionalOdds<T extends FractionLike>(fraction: T): string {
  return `${fraction.numerator}/${fraction.denominator}`;
}

function buildInferredFractionalOdds(decimal: number): string {
  return `${roundUp(decimal - 1)}/1`;
}

function buildInferredAmericanOdds(decimal: number): number {
  if (decimal >= 2) {
    return Math.round((decimal - 1) * 100);
  }

  // prevent division by zero
  const denominator = decimal - 1 || 0.01;

  return Math.round(-100 / denominator);
}

function calculateDecimalFromFractionalOdds(fractionalOdds: FractionLike): number {
  return fractionalOdds.numerator / fractionalOdds.denominator + 1;
}

function formatOdds(
  odds: SportsbookOdds | BettingState.Odds | ObbSportsbookOdds,
  format: OddsDisplayPreference,
  applyAdjustedCalculation = false,
): string {
  const isBettingState = isBettingStateOdds(odds);
  const decimalOdds = isBettingState ? odds.decimalOdds : odds.decimal;
  const fractionalOdds = isBettingState ? odds.fractionalOdds : odds.fractional;

  if (format === OddsDisplayPreference.Fractional) {
    if (applyAdjustedCalculation && decimalOdds) {
      return buildInferredFractionalOdds(
        fractionalOdds ? calculateDecimalFromFractionalOdds(fractionalOdds) : decimalOdds,
      );
    }
    if (fractionalOdds) {
      return buildFractionalOdds(fractionalOdds);
    }
    if (decimalOdds) {
      return buildInferredFractionalOdds(decimalOdds);
    }
  }

  if (format === OddsDisplayPreference.American) {
    let americanOdds;

    if ("american" in odds && typeof odds.american === "number") {
      americanOdds = odds.american;
    } else if ("americanOdds" in odds && typeof odds.americanOdds === "number") {
      americanOdds = odds.americanOdds;
    } else {
      americanOdds = buildInferredAmericanOdds(decimalOdds);
    }

    return americanOdds < 0 ? `${americanOdds}` : `+${americanOdds}`;
  }

  return decimalOdds ? decimalOdds.toString() : "";
}

export { formatOdds };
