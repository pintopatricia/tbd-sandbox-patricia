import {
  shouldRenderRecentFormCard,
  isExchangeMarket,
  isSportsbookMarket,
  isGoalIncident,
  isCardIncident,
  isSubstitutionIncident,
  isPenaltyIncident,
  isPenaltyShootoutIncident,
  isPeriodIncident,
  isShotIncident,
  isSetPieceIncident,
  isFoulIncident,
  isAttackIncident,
} from "./catalogue-types";

describe("CatalogueTypes", () => {
  describe("isExchangeMarket", () => {
    it("should indicate if a market is Exchange type", () => {
      expect(
        isExchangeMarket({
          __typename: "ExchangeMarket",
        }),
      ).toBe(true);
      expect(
        isExchangeMarket({
          __typename: "SportsbookMarket",
        }),
      ).toBe(false);
    });
  });

  describe("isSportsbookMarket", () => {
    it("should indicate if a market is Sportsbook type", () => {
      expect(
        isSportsbookMarket({
          __typename: "SportsbookMarket",
        }),
      ).toBe(true);
      expect(
        isSportsbookMarket({
          __typename: "NONSportsbookMarket",
        }),
      ).toBe(false);
    });
  });

  describe("shouldRenderRecentFormCard", () => {
    it("should return true when RecentForm is not empty for home and away", () => {
      const result = shouldRenderRecentFormCard({
        footballFixture: {
          recentForm: {
            home: [1, 2, 3],
            away: [1, 2, 3],
          },
        },
      });

      expect(result).toBe(true);
    });

    it("should return false when a RecentForm is emtpy for both sides", () => {
      const result = shouldRenderRecentFormCard({
        footballFixture: {
          recentForm: {
            home: [],
            away: [],
          },
        },
      });

      expect(result).toBe(false);
    });
  });

  describe("isGoalIncident", () => {
    it("should indicate if incident is GoalIncident", () => {
      expect(
        isGoalIncident({
          __typename: "GoalIncident",
        }),
      ).toBe(true);
      expect(
        isGoalIncident({
          __typename: "CardIncident",
        }),
      ).toBe(false);
    });
  });

  describe("isCardIncident", () => {
    it("should indicate if incident is CardIncident", () => {
      expect(
        isCardIncident({
          __typename: "CardIncident",
        }),
      ).toBe(true);
      expect(
        isCardIncident({
          __typename: "GoalIncident",
        }),
      ).toBe(false);
    });
  });

  describe("isSubstitutionIncident", () => {
    it("should indicate if incident is SubstitutionIncident", () => {
      expect(
        isSubstitutionIncident({
          __typename: "SubstitutionIncident",
        }),
      ).toBe(true);
      expect(
        isSubstitutionIncident({
          __typename: "GoalIncident",
        }),
      ).toBe(false);
    });
  });

  describe("isPenaltyIncident", () => {
    it("should indicate if incident is PenaltyIncident", () => {
      expect(
        isPenaltyIncident({
          __typename: "PenaltyIncident",
        }),
      ).toBe(true);
      expect(
        isPenaltyIncident({
          __typename: "GoalIncident",
        }),
      ).toBe(false);
    });
  });
  describe("isPenaltyShootoutIncident", () => {
    it("should indicate if incident is PenaltyShootoutIncident", () => {
      expect(
        isPenaltyShootoutIncident({
          __typename: "PenaltyShootoutIncident",
        }),
      ).toBe(true);
      expect(
        isPenaltyShootoutIncident({
          __typename: "GoalIncident",
        }),
      ).toBe(false);
    });
  });
  describe("isPeriodIncident", () => {
    it("should indicate if incident is PeriodIncident", () => {
      expect(
        isPeriodIncident({
          __typename: "PeriodIncident",
        }),
      ).toBe(true);
      expect(
        isPeriodIncident({
          __typename: "GoalIncident",
        }),
      ).toBe(false);
    });
  });
  describe("isShotIncident", () => {
    it("should indicate if incident is ShotIncident", () => {
      expect(
        isShotIncident({
          __typename: "ShotIncident",
        }),
      ).toBe(true);
      expect(
        isShotIncident({
          __typename: "GoalIncident",
        }),
      ).toBe(false);
    });
  });
  describe("isSetPieceIncident", () => {
    it("should indicate if incident is SetPieceIncident", () => {
      expect(
        isSetPieceIncident({
          __typename: "SetPieceIncident",
        }),
      ).toBe(true);
      expect(
        isSetPieceIncident({
          __typename: "GoalIncident",
        }),
      ).toBe(false);
    });
  });
  describe("isFoulIncident", () => {
    it("should indicate if incident is FoulIncident", () => {
      expect(
        isFoulIncident({
          __typename: "FoulIncident",
        }),
      ).toBe(true);
      expect(
        isFoulIncident({
          __typename: "GoalIncident",
        }),
      ).toBe(false);
    });
  });
  describe("isAttackIncident", () => {
    it("should indicate if incident isAttackIncident", () => {
      expect(
        isAttackIncident({
          __typename: "AttackIncident",
        }),
      ).toBe(true);
      expect(
        isAttackIncident({
          __typename: "GoalIncident",
        }),
      ).toBe(false);
    });
  });
});
