import { RacingSport } from "@ppb/tbd-store/state/entities/sports/Sport.types";
import { VirtualSport, RaceStatus } from "@ppb/tbd-store/state/constants";
import { FallbackIconType } from "@ppb/the-wall-common/types";

const isRaceRunningStatus = (status: RaceStatus | undefined): boolean =>
  !!status && [RaceStatus.UNDER_ORDERS, RaceStatus.OFF, RaceStatus.RESULT].includes(status);

export const getSilkFallbackType = (sportId: number): FallbackIconType | undefined => {
  switch (sportId) {
    case VirtualSport.HorsesFlat:
    case VirtualSport.HorsesJumps:
    case VirtualSport.HorsesSprint:
    case RacingSport.HORSE_RACING:
      return FallbackIconType.HorseRacing;
    default:
      return undefined;
  }
};

export const getRaceSport = (sportId: number): RacingSport | undefined => {
  switch (sportId) {
    case RacingSport.HORSE_RACING:
    case RacingSport.GREYHOUND_RACING:
      return sportId;
    default:
      return undefined;
  }
};

export { isRaceRunningStatus };
