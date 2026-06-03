import URN from "@ppb/tbd-store/state/layout/URN";
import { SportsbookOdds } from "@ppb/tbd-store/state/entities/SportsbookOdds.types";
import { SportsbookBettingState } from "@ppb/tbd-store/state/betting/sportsbook-betting/SportsbookBetting.types";
import { OddsDisplayPreference } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import { isLegInState } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { SportsbookMarket } from "@ppb/tbd-store/state/entities/sportsbook-markets/SportsbookMarket.types";
import { SportsbookRunner } from "@ppb/tbd-store/state/entities/sportsbook-runners/SportsbookRunner.types";
import { isRaceHierarchy } from "@ppb/tbd-store/helpers/markets";
import { BetButtonStatus } from "../components/ExchangeBetButtons/snowflakes/BetButton/BetButton.types";
import { i18n } from "./i18n";

export const buildBetButtonLabel = (
  sportsbookRunner?: SportsbookRunner,
  sportsbookMarket?: SportsbookMarket,
  sportsbookDisplayOddsPreferences?: OddsDisplayPreference,
): string => {
  if (sportsbookRunner?.odds && sportsbookDisplayOddsPreferences) {
    return formatOdds(sportsbookRunner.odds, sportsbookDisplayOddsPreferences);
  }

  if (sportsbookMarket) {
    const { hierarchy, bspMarket } = sportsbookMarket;
    const isRaceMarket = isRaceHierarchy(hierarchy);
    const isStartingPriceRunner = isRaceMarket && sportsbookRunner?.status === "ACTIVE";

    if (isStartingPriceRunner && bspMarket) {
      return i18n({ key: "I18N.HORSE_RACING.SP" });
    }
  }
  return "";
};

export const buildBetButtonSecondaryLabel = (
  displayPreviousOdd: boolean,
  runnerPreviousOdds?: SportsbookOdds[],
  sportsbookDisplayOddsPreferences?: OddsDisplayPreference,
): string | undefined =>
  displayPreviousOdd && runnerPreviousOdds?.length && sportsbookDisplayOddsPreferences
    ? formatOdds(runnerPreviousOdds[0], sportsbookDisplayOddsPreferences)
    : undefined;

export const buildBetButtonStatus = (
  marketUrn: URN,
  selectionId?: number,
  sportsbookBetting?: SportsbookBettingState,
): BetButtonStatus => {
  const isSelected = selectionId && sportsbookBetting ? isLegInState(marketUrn, selectionId, sportsbookBetting) : false;

  return isSelected ? BetButtonStatus.Selected : BetButtonStatus.Normal;
};
