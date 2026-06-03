import normalizeVirtualSportFragmentIntoVirtualSport from "./virtual-sport-normalizer";
import { VirtualSportKind } from "../../../../../clients/catalogue/catalogue-response-types";

const BFF_RESPONSE = {
  __typename: "VirtualSport",
  sportId: 1,
  urn: "ppb:virtualSport:1",
  name: "Sport Name",
  kind: "OTHER",
};

describe("VirtualSport normalizer", () => {
  describe("normalizeVirtualSportFragmentIntoVirtualSport", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeVirtualSportFragmentIntoVirtualSport(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "VirtualSport",
        sportId: 1,
        urn: "ppb:virtualSport:1",
        name: "Sport Name",
        kind: "OTHER",
      });
    });

    describe("kind", () => {
      describe("when football", () => {
        it("should correctly return kind property", () => {
          const { data } = normalizeVirtualSportFragmentIntoVirtualSport({
            ...BFF_RESPONSE,
            kind: VirtualSportKind.Football,
          });

          expect(data.kind).toBe("FOOTBALL");
        });
      });
      describe("when racing", () => {
        it("should correctly return kind property", () => {
          const { data } = normalizeVirtualSportFragmentIntoVirtualSport({
            ...BFF_RESPONSE,
            kind: VirtualSportKind.Racing,
          });

          expect(data.kind).toBe("RACING");
        });
        describe("when other", () => {
          it("should correctly return kind property", () => {
            const { data } = normalizeVirtualSportFragmentIntoVirtualSport({
              ...BFF_RESPONSE,
              kind: VirtualSportKind.Other,
            });

            expect(data.kind).toBe("OTHER");
          });
        });
      });
    });
  });
});
