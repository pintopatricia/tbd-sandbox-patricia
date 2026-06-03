import normalizeImsPromotionViewFragmentIntoImsPromotionView from "./ims-promotion-view-normalizer";

const IMS_PROMOTION_VIEW_URN = "ppb:tbd:view:imspromotion:1";
const URL = "/";

const BFF_RESPONSE = {
  __typename: "ImsPromotionView",
  urn: IMS_PROMOTION_VIEW_URN,
  url: URL,
  title: "fakeTitle",
  items: {
    edges: [
      {
        node: {
          __typename: "ImsPromotionStateCard",
          urn: "ppb:tbd:card:imsPromotionState:uid/gaming-win-up-to-180-free-spins-bonus",
        },
      },
      {
        node: {
          __typename: "ImsPromotionDetailsCard",
          urn: "ppb:tbd:card:imsPromotionDetails:uid/gaming-win-up-to-180-free-spins-bonus",
          imsTitle: "Details",
          promotion: {
            urn: "ppb:gaming:promotion:uid/gaming-win-up-to-180-free-spins-bonus",
            details: [],
          },
        },
      },
      {
        node: {
          __typename: "ImsPromotionTermsAndConditionsCard",
          urn: "ppb:tbd:card:imsPromotionTerms:uid/gaming-win-up-to-180-free-spins-bonus",
          imsTitle: "Terms",
          promotion: {
            urn: "ppb:gaming:promotion:uid/gaming-win-up-to-180-free-spins-bonus",
            details: [],
          },
        },
      },
      null,
    ],
  },
  partialItems: {
    edges: [
      {
        node: {
          __typename: "ImsPromotionStateCard",
          urn: "ppb:tbd:card:imsPromotionState:uid/gaming-win-up-to-180-free-spins-bonus",
        },
      },
      {
        node: {
          __typename: "ImsPromotionDetailsCard",
          urn: "ppb:tbd:card:imsPromotionDetails:uid/gaming-win-up-to-180-free-spins-bonus",
        },
      },
      {
        node: {
          __typename: "ImsPromotionTermsAndConditionsCard",
          urn: "ppb:tbd:card:imsPromotionTerms:uid/gaming-win-up-to-180-free-spins-bonus",
        },
      },
      null,
    ],
  },
  bottomBar: {
    tiles: [],
  },
  regulatoryData: {
    sections: [],
  },
};

const BFF_RESPONSE_WITH_DUPLICATES = {
  __typename: "ImsPromotionView",
  urn: IMS_PROMOTION_VIEW_URN,
  url: URL,
  title: "fakeTitle",
  items: {
    edges: [
      {
        node: {
          __typename: "ImsPromotionStateCard",
          urn: "ppb:tbd:card:imsPromotionState:uid/gaming-win-up-to-180-free-spins-bonus",
        },
      },
      {
        node: {
          __typename: "ImsPromotionDetailsCard",
          urn: "ppb:tbd:card:imsPromotionDetails:uid/gaming-win-up-to-180-free-spins-bonus",
          imsTitle: "Details",
          promotion: {
            urn: "ppb:gaming:promotion:uid/gaming-win-up-to-180-free-spins-bonus",
            details: [],
          },
        },
      },
      {
        node: {
          __typename: "ImsPromotionTermsAndConditionsCard",
          urn: "ppb:tbd:card:imsPromotionTerms:uid/gaming-win-up-to-180-free-spins-bonus",
          imsTitle: "Terms",
          promotion: {
            urn: "ppb:gaming:promotion:uid/gaming-win-up-to-180-free-spins-bonus",
            details: [],
          },
        },
      },
      {
        node: {
          __typename: "ImsPromotionStateCard",
          urn: "ppb:tbd:card:imsPromotionState:uid/gaming-win-up-to-180-free-spins-bonus",
        },
      },
      null,
    ],
  },
  partialItems: {
    edges: [
      {
        node: {
          __typename: "ImsPromotionStateCard",
          urn: "ppb:tbd:card:imsPromotionState:uid/gaming-win-up-to-180-free-spins-bonus",
        },
      },
      {
        node: {
          __typename: "ImsPromotionDetailsCard",
          urn: "ppb:tbd:card:imsPromotionDetails:uid/gaming-win-up-to-180-free-spins-bonus",
        },
      },
      {
        node: {
          __typename: "ImsPromotionTermsAndConditionsCard",
          urn: "ppb:tbd:card:imsPromotionTerms:uid/gaming-win-up-to-180-free-spins-bonus",
        },
      },
      {
        node: {
          __typename: "ImsPromotionStateCard",
          urn: "ppb:tbd:card:imsPromotionState:uid/gaming-win-up-to-180-free-spins-bonus",
        },
      },
      null,
    ],
  },
};

describe("normalizeImsPromotionViewFragmentIntoImsPromotionView", () => {
  describe("and edges have valid nodes", () => {
    const { data } = normalizeImsPromotionViewFragmentIntoImsPromotionView(BFF_RESPONSE);

    it("should correctly transform and return the data object with the valid items", () => {
      expect(data).toEqual({
        items: [
          {
            typename: "ImsPromotionStateCard",
            urn: "ppb:tbd:card:imsPromotionState:uid/gaming-win-up-to-180-free-spins-bonus",
          },
          {
            typename: "ImsPromotionDetailsCard",
            urn: "ppb:tbd:card:imsPromotionDetails:uid/gaming-win-up-to-180-free-spins-bonus",
          },
          {
            typename: "ImsPromotionTermsAndConditionsCard",
            urn: "ppb:tbd:card:imsPromotionTerms:uid/gaming-win-up-to-180-free-spins-bonus",
          },
        ],
        typename: "ImsPromotionView",
        title: "fakeTitle",
        url: URL,
        urn: IMS_PROMOTION_VIEW_URN,
      });
    });
  });

  describe("and edges have valid nodes with no duplicate items", () => {
    const { data } = normalizeImsPromotionViewFragmentIntoImsPromotionView(BFF_RESPONSE_WITH_DUPLICATES);

    it("should correctly transform and return the data object with the valid items", () => {
      expect(data).toEqual({
        items: [
          {
            typename: "ImsPromotionStateCard",
            urn: "ppb:tbd:card:imsPromotionState:uid/gaming-win-up-to-180-free-spins-bonus",
          },
          {
            typename: "ImsPromotionDetailsCard",
            urn: "ppb:tbd:card:imsPromotionDetails:uid/gaming-win-up-to-180-free-spins-bonus",
          },
          {
            typename: "ImsPromotionTermsAndConditionsCard",
            urn: "ppb:tbd:card:imsPromotionTerms:uid/gaming-win-up-to-180-free-spins-bonus",
          },
        ],
        typename: "ImsPromotionView",
        title: "fakeTitle",
        url: URL,
        urn: IMS_PROMOTION_VIEW_URN,
      });
    });
  });

  describe("and edges has no valid nodes", () => {
    const { data } = normalizeImsPromotionViewFragmentIntoImsPromotionView({
      ...BFF_RESPONSE,
      items: { edges: [null, null] },
      partialItems: { edges: [null] },
    });

    it("should correctly transform and return the data object with an empty array of items", () => {
      expect(data).toEqual({
        items: [],
        typename: "ImsPromotionView",
        title: "fakeTitle",
        url: URL,
        urn: IMS_PROMOTION_VIEW_URN,
      });
    });
  });
});
