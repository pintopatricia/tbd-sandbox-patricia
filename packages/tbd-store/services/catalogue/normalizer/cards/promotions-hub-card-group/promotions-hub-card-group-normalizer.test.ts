import { PromotionsHubCardGroupFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import normalizePromotionsHubCardGroupFragmentIntoPromotionsHubCardGroup from "./promotions-hub-card-group-normalizer";

const BFF_RESPONSE: PromotionsHubCardGroupFragment = {
  __typename: "PromotionsHubCardGroup",
  urn: "ppb:tbd:card:promotionsHub:promotionsHub",
  emptyState: false,
  filterOptions: null,
};

describe("normalizePromotionsHubCardGroupFragmentIntoPromotionsHubCardGroup", () => {
  it("should correctly transform and return the data object", () => {
    const { data } = normalizePromotionsHubCardGroupFragmentIntoPromotionsHubCardGroup(BFF_RESPONSE);

    expect(data).toEqual({
      typename: "PromotionsHubCardGroup",
      urn: "ppb:tbd:card:promotionsHub:promotionsHub",
      items: [],
    });
  });
});
