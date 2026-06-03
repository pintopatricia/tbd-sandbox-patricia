import { createSelectorCreator, defaultMemoize } from "reselect";
import { RaceViewLinkHydrated, RaceViewLinksCardHydrated } from "@ppb/tbd-store/state/application-state-selectors";
import { RaceSelectableItem } from "@ppb/the-wall-common/types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { formatTime } from "../helpers/dates";

function isRaceViewLinksCardHydratedEqual(
  previous: RaceViewLinksCardHydrated,
  current: RaceViewLinksCardHydrated,
): boolean {
  return JSON.stringify(previous) === JSON.stringify(current);
}

const createRaceViewLinksViewModelSelector = createSelectorCreator(defaultMemoize, isRaceViewLinksCardHydratedEqual);

export const createRaceViewLinksViewModel = () =>
  createRaceViewLinksViewModelSelector(
    [
      (raceSelectorCard: RaceViewLinksCardHydrated) => raceSelectorCard,
      (_: RaceViewLinksCardHydrated, userDetails: UserDetails) => userDetails,
    ],
    (
      raceSelectorCard: RaceViewLinksCardHydrated,
      userDetails: UserDetails,
    ): {
      raceItems: RaceSelectableItem[];
      defaultRaceIndex?: number;
    } => {
      const { localeCodeBcp47, timezone } = userDetails;

      return (
        raceSelectorCard?.raceViewLinks?.reduce<{ raceItems: RaceSelectableItem[]; defaultRaceIndex?: number }>(
          (acc, { viewLink, race, marketPromo }: RaceViewLinkHydrated, idx) => {
            // race can be `Race | undefined`
            if (!race) {
              return acc;
            }

            acc.raceItems.push({
              viewLink,
              raceTime: formatTime(race.startTime, localeCodeBcp47, timezone),
              isRaceClosed: !!race.details?.resultType,
              ...(!race.details?.resultType && marketPromo && { marketPromo }),
            });

            if (raceSelectorCard.race.urn === race.urn) {
              acc.defaultRaceIndex = idx;
            }

            return acc;
          },
          { raceItems: [], defaultRaceIndex: undefined },
        ) || {}
      );
    },
  );
