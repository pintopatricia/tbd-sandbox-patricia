import { createSelector } from "reselect";
import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import { SportsbookOdds } from "@ppb/tbd-store/state/entities/SportsbookOdds.types";
import { OddsDisplayPreference } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";

export const createFormatedOddForPopularBetBuilderSelectionOddVm = () =>
  createSelector(
    [({ odd }: { odd: SportsbookOdds }) => odd, ({ format }: { format: OddsDisplayPreference }) => format],
    (odd, format) => formatOdds(odd, format),
  );
