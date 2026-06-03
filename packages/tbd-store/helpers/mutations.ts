import { codecs } from "@ppb/tbd-urn-codecs";
import { BetLegs } from "../state";

export function getLegUrnForBMELeg(state: BetLegs, betId: string, legRef: number) {
  return Object.keys(state)
    .filter((legUrnKey) => {
      const id = codecs.sportsbookBetLeg.decode(legUrnKey);
      const betIdFromState = id?.split("/")[0];
      return betIdFromState === betId;
    })
    .find((key) => state[key].legNumber === legRef);
}
