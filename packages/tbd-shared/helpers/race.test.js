import { VirtualSport } from "@ppb/tbd-store/state/constants";
import { RacingSport } from "@ppb/tbd-store/state/entities/sports/Sport.types";
import { FallbackIconType } from "@ppb/the-wall-common/types";
import { getSilkFallbackType, isRaceRunningStatus, getRaceSport } from "./race";

describe("Race helper", () => {
  describe("isRaceRunningStatus", () => {
    it.each`
      statusLabel         | status            | expected
      ${`"UNDER_ORDERS"`} | ${"UNDER_ORDERS"} | ${true}
      ${`"RESULT"`}       | ${"RESULT"}       | ${true}
      ${`"OFF"`}          | ${"OFF"}          | ${true}
      ${"other"}          | ${"DORMANT"}      | ${false}
    `('should return "$expected" for $statusLabel status', async ({ status, expected }) => {
      expect(isRaceRunningStatus(status)).toBe(expected);
    });

    it("should return false for falsy race status", () => {
      expect(isRaceRunningStatus(null)).toBe(false);
    });
  });

  describe("getSilkFallbackType", () => {
    describe.each`
      sport                        | iconType
      ${VirtualSport.HorsesSprint} | ${FallbackIconType.HorseRacing}
      ${VirtualSport.HorsesJumps}  | ${FallbackIconType.HorseRacing}
      ${RacingSport.HORSE_RACING}  | ${FallbackIconType.HorseRacing}
      ${1231231}                   | ${undefined}
    `("when sportId is $sport", ({ sport, iconType }) => {
      it(`should return ${iconType}`, () => {
        expect(getSilkFallbackType(sport)).toEqual(iconType);
      });
    });
  });

  describe("getRaceSport", () => {
    describe.each`
      sport                           | expected
      ${RacingSport.HORSE_RACING}     | ${RacingSport.HORSE_RACING}
      ${RacingSport.GREYHOUND_RACING} | ${RacingSport.GREYHOUND_RACING}
      ${1231231}                      | ${undefined}
    `("when sportId is $sport", ({ sport, expected }) => {
      it(`should return ${expected}`, () => {
        expect(getRaceSport(sport)).toEqual(expected);
      });
    });
  });
});
