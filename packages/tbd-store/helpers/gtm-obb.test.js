import { generateBetDetailsFromState } from "./gtm-obb";

jest.mock("i18next", () => ({ t: jest.fn((t) => t) }));

jest.mock("./betting", () => ({
  getUniqueId: jest.fn().mockReturnValue(9999),
}));

const metadataMock = {
  pebbleCardGroupTitle: "pebbleCardGroup",
  tabName: "tab",
  horizontalPosition: 1,
  verticalPosition: 2,
  cardGroupTitle: "Group",
  cardLayoutTitle: "Layout",
  title: "title",
};

jest.mock("../state/layout-snapshot", () => ({
  getLayoutMetadata: jest.fn(() => metadataMock),
}));

describe("generateBetDetailsFromState", () => {
  const mockState = {
    entities: {
      obbLegs: {
        "urn:leg1": { event: { urn: "urn:event1" } },
      },
      sportevents: {
        "urn:event1": { eventId: "123", competition: "urn:competition1" },
      },
      competitions: {
        "urn:competition1": { competitionId: "456", name: "Premier League", sport: "urn:sport1" },
      },
      sports: {
        "urn:sport1": { sportId: "789", name: "Football" },
      },
    },
    layouts: {
      cards: {
        obbcards: {},
      },
    },
  };

  describe("when state is undefined", () => {
    it("should return undefined", () => {
      const result = generateBetDetailsFromState("urn:leg1", undefined);
      expect(result).toBeUndefined();
    });
  });

  describe("when state is provided", () => {
    describe("and the leg exists in obbLegs", () => {
      it("should return the correct details", () => {
        const result = generateBetDetailsFromState("urn:leg1", mockState);
        expect(result).toEqual({
          eventId: "123",
          competitionId: "456",
          sportId: "789",
          competition: "Premier League",
          sport: "Football",
          uniqueId: 9999,
        });
      });

      describe("and the Obb card provided legId in defaultLegs", () => {
        it("should return the correct details", () => {
          const result = generateBetDetailsFromState("urn:leg1", {
            ...mockState,
            layouts: {
              cards: {
                obbcards: {
                  "urn:card:123": {
                    defaultLegs: ["urn:leg1"],
                    urn: "urn:card:123",
                  },
                },
              },
            },
          });

          expect(result).toEqual({
            eventId: "123",
            competitionId: "456",
            sportId: "789",
            competition: "Premier League",
            sport: "Football",
            uniqueId: 9999,
            group: "Group",
            layout: "Layout",
            tabName: "tab",
          });
        });
      });

      describe("and the Obb card provided legId in selectedLegs", () => {
        it("should return the correct details", () => {
          const result = generateBetDetailsFromState("urn:leg1", {
            ...mockState,
            layouts: {
              cards: {
                obbcards: {
                  "urn:card:123": {
                    selectedLegs: ["urn:leg1"],
                    urn: "urn:card:123",
                  },
                },
              },
            },
          });

          expect(result).toEqual({
            eventId: "123",
            competitionId: "456",
            sportId: "789",
            competition: "Premier League",
            sport: "Football",
            uniqueId: 9999,
            group: "Group",
            layout: "Layout",
            tabName: "tab",
          });
        });
      });

      describe("and the Obb card provided legId not exist on selectedLegs neither defaultLegs", () => {
        it("should return the correct details", () => {
          const result = generateBetDetailsFromState("urn:leg1", {
            ...mockState,
            layouts: {
              cards: {
                obbcards: {
                  "urn:card:123": {
                    urn: "urn:card:123",
                  },
                },
              },
            },
          });

          expect(result).toEqual({
            eventId: "123",
            competitionId: "456",
            sportId: "789",
            competition: "Premier League",
            sport: "Football",
            uniqueId: 9999,
          });
        });
      });
    });

    describe("and the leg does not exist in obbLegs", () => {
      it("should return details with null values", () => {
        const result = generateBetDetailsFromState("urn:nonexistent", mockState);
        expect(result).toEqual({
          eventId: "",
          competitionId: "",
          sportId: "",
          competition: "",
          sport: "",
          uniqueId: 9999,
        });
      });
    });
  });
});
