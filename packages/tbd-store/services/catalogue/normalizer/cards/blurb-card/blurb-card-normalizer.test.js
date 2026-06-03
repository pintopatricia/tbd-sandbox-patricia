import { DisplayMode } from "../../../../../clients/catalogue/catalogue-response-types";
import normalizeBlurbCardFragmentIntoBlurbCard from "./blurb-card-normalizer";

const BFF_RESPONSE_1 = {
  urn: "a cool urn",
  __typename: "BlurbCard",
  blurb: {
    isCollapsed: true,
    title: {
      __typename: "DisplayNameTitle",
      name: "header Name",
    },
    description: {
      __typename: "DisplayNameTitle",
      name: "body Name",
    },
    supplementaryInfo: {
      label: {
        __typename: "DisplayNameTitle",
        name: "link label",
      },
      viewLink: {
        viewUrn: "view urn",
        viewUrl: "view url",
        viewDisplayMode: DisplayMode.SelfBrowser,
      },
    },
  },
};

const BFF_RESPONSE_2 = {
  urn: "a cool urn",
  __typename: "BlurbCard",
  blurb: {
    isCollapsed: null,
    title: {
      __typename: "DisplayNameTitle",
      name: "header Name",
    },
    description: null,
    supplementaryInfo: {
      label: {
        __typename: "DisplayNameTitle",
        name: "link label",
      },
      viewLink: null,
    },
  },
};

const BFF_RESPONSE_3 = {
  urn: "a cool urn",
  __typename: "BlurbCard",
  blurb: {
    isCollapsed: true,
    title: {
      __typename: "DisplayNameTitle",
      name: "header Name",
    },
    description: null,
    supplementaryInfo: null,
  },
};

describe("Blurb card normalizer", () => {
  describe("normalizeBlurbCardFragmentIntoBlurbCard", () => {
    it("should correctly transform and return the data object (BFF_RESPONSE_1)", () => {
      const result = normalizeBlurbCardFragmentIntoBlurbCard(BFF_RESPONSE_1);

      expect(result).toEqual({
        data: {
          urn: "a cool urn",
          typename: "BlurbCard",
          blurb: {
            title: "header Name",
            description: "body Name",
            isExpanded: false,
            link: {
              text: "link label",
              url: "view url",
              displayMode: DisplayMode.SelfBrowser,
            },
            signposting: "MARKET_RULES",
          },
        },
      });
    });

    it("should correctly transform and return the data object (BFF_RESPONSE_2)", () => {
      const result = normalizeBlurbCardFragmentIntoBlurbCard(BFF_RESPONSE_2);

      expect(result).toEqual({
        data: {
          urn: "a cool urn",
          typename: "BlurbCard",
          blurb: {
            title: "header Name",
            description: undefined,
            isExpanded: true,
            link: undefined,
            signposting: "MARKET_RULES",
          },
        },
      });
    });

    it("should correctly transform and return the data object (BFF_RESPONSE_3)", () => {
      const result = normalizeBlurbCardFragmentIntoBlurbCard(BFF_RESPONSE_3);

      expect(result).toEqual({
        data: {
          urn: "a cool urn",
          typename: "BlurbCard",
          blurb: {
            title: "header Name",
            description: undefined,
            isExpanded: false,
            link: undefined,
            signposting: "MARKET_RULES",
          },
        },
      });
    });
  });
});
