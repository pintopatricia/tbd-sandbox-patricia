import normalizeCouponHeaderCardFragmentIntoCouponHeaderCard from "./coupon-header-card-normalizer";

const BFF_RESPONSE = {
  __typename: "CouponHeaderCard",
  urn: "ppb:tbd:card:couponheader:mockedCouponHeader",
  competition: {
    urn: "ppb:competition:123",
    name: "Thai League Cup",
  },
  competitionViewLink: {
    viewUrn: "ppb:competition:123",
    viewUrl: "/football/thai-league-cup/c-123",
  },
  columns: ["1", "X", "2"],
};

describe("Coupon header card normalizer", () => {
  describe("normalizeCouponHeaderCardFragmentIntoCouponHeaderCard", () => {
    it("should correctly transform and return the data object when columns array is null", () => {
      const { data } = normalizeCouponHeaderCardFragmentIntoCouponHeaderCard({ ...BFF_RESPONSE, columns: null });

      expect(data).toEqual({
        typename: "CouponHeaderCard",
        urn: "ppb:tbd:card:couponheader:mockedCouponHeader",
        competition: "ppb:competition:123",
        competitionViewLink: {
          viewUrn: "ppb:competition:123",
          viewUrl: "/football/thai-league-cup/c-123",
        },
        columns: [],
      });
    });

    it("should correctly transform and return the data object when columns array has data", () => {
      const { data } = normalizeCouponHeaderCardFragmentIntoCouponHeaderCard(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "CouponHeaderCard",
        urn: "ppb:tbd:card:couponheader:mockedCouponHeader",
        competition: "ppb:competition:123",
        competitionViewLink: {
          viewUrn: "ppb:competition:123",
          viewUrl: "/football/thai-league-cup/c-123",
        },
        columns: ["1", "X", "2"],
      });
    });

    it("should correctly transform and return the data object when columns array has data and has stats", () => {
      const { data } = normalizeCouponHeaderCardFragmentIntoCouponHeaderCard({ ...BFF_RESPONSE, hasStats: true });

      expect(data).toEqual({
        typename: "CouponHeaderCard",
        urn: "ppb:tbd:card:couponheader:mockedCouponHeader",
        competition: "ppb:competition:123",
        competitionViewLink: {
          viewUrn: "ppb:competition:123",
          viewUrl: "/football/thai-league-cup/c-123",
        },
        columns: ["1", "X", "2"],
        hasStats: true,
      });
    });
  });
});
