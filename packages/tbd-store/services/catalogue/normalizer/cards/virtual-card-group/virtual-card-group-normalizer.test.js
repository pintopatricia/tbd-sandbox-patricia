import normalizeVirtualCardGroupFragmentIntoVirtualCardGroup from "./virtual-card-group-normalizer";

const BFF_RESPONSE = {
  __typename: "VirtualCardGroup",
  urn: "ppb:tbd:card:virtualcardgroup:1",
  items: {
    edges: [
      {
        node: {
          __typename: "VirtualEventDetailsCard",
          urn: "ppb:tbd:card:virtualeventdetailscard:1",
        },
      },
    ],
  },
};

describe("Virtual card group normalizer", () => {
  describe("normalizeVirtualCardGroupFragmentIntoVirtualCardGroup", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeVirtualCardGroupFragmentIntoVirtualCardGroup(BFF_RESPONSE);

      expect(data).toStrictEqual({
        typename: "VirtualCardGroup",
        urn: "ppb:tbd:card:virtualcardgroup:1",
        items: [
          {
            typename: "VirtualEventDetailsCard",
            urn: "ppb:tbd:card:virtualeventdetailscard:1",
          },
        ],
      });
    });
  });
});
