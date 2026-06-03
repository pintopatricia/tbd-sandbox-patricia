import { ForbiddenContentType } from "../../../../../state/constants";
import normalizeForbiddenContentCardFragmentIntoForbiddenContentCard from "./forbidden-content-card-normalizer";

const BFF_RESPONSE = {
  __typename: "ForbiddenContentCard",
  urn: "ppb:tbd:card:forbiddenContent:MY_BETS",
  forbiddenCardType: "MY_BETS",
};

describe("ForbiddenContentCard normalizer", () => {
  describe("normalizeForbiddenContentCardFragmentIntoForbiddenContentCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeForbiddenContentCardFragmentIntoForbiddenContentCard(BFF_RESPONSE);

      expect(data).toEqual({
        urn: "ppb:tbd:card:forbiddenContent:MY_BETS",
        typename: "ForbiddenContentCard",
        forbiddenCardType: ForbiddenContentType.MY_BETS,
      });
    });
  });
});
