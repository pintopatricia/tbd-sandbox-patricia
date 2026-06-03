import { EXTERNAL_PUSH_BLANK } from "@ppb/tbd-store";
import { UI__MARKET_BLURB_LINK_CLICK } from "@ppb/tbd-store/actions/navigation";
import { UI__PROMO_DESCRIPTION_TOGGLE } from "@ppb/tbd-store/actions/interface";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { MarketPromoIcon } from "@ppb/the-wall-common/types";

import { getExternalLink } from "../../helpers/external-links";
import { i18n } from "../../helpers/i18n";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const USER_DETAILS_MOCK = {
  localeCode: "locale",
  jurisdiction: {
    jurisdiction: "INTERNATIONAL",
  },
};

const getUserDetails = jest.fn(() => USER_DETAILS_MOCK);

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));

const EXTERNAL_LINK_MOCK = "www.some-url.com";
const EXTERNAL_LINK_TYPE_MOCK = "EXTERNAL_LINK_TYPE";

jest.mock("../../helpers/external-links", () => ({
  getExternalLink: jest.fn(() => EXTERNAL_LINK_MOCK),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

const STATE_MOCK = {
  entities: {
    sportsbookmarkets: {},
    userDetails: {
      jurisdiction: {
        jurisdiction: "GB",
      },
      localeCode: "en-GB",
    },
  },
  layouts: {
    cards: {
      blurb: {
        "ppb:tbd:card:blurb:test": {
          blurb: {
            title: "Test Title",
            description: "Test Description",
            isExpanded: true,
            link: {
              text: "Test Link Text",
              url: "test-url",
            },
          },
        },
      },
    },
  },
};

const setup = ({ state = STATE_MOCK, containerProps = {} } = {}) => makeMapStateToProps()(state, containerProps);

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should create bottom bar view model", () => {
    makeMapStateToProps();

    expect(createGetCountryLocalCurrencyCodeSelector).toHaveBeenCalledTimes(1);
    expect(createGetCountryLocalCurrencyCodeSelector).toHaveBeenCalledWith();
  });

  it("should call i18n with correct key", () => {
    makeMapStateToProps();

    expect(i18n).toHaveBeenCalledTimes(1);
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.MARKET_PROMO.T&C" });
  });

  it("should call getUserDetails with the correct props", () => {
    setup();

    expect(getUserDetails).toHaveBeenCalledTimes(1);
    expect(getUserDetails).toHaveBeenCalledWith(STATE_MOCK);
  });

  it("should return title and description", () => {
    const { title, description } = setup({
      containerProps: {
        titleKey: "TITLE_KEY",
        descriptionKey: "DESCRIPTION_KEY",
      },
    });

    expect(i18n).toHaveBeenCalledWith({ key: "TITLE_KEY" });
    expect(i18n).toHaveBeenCalledWith({ key: "DESCRIPTION_KEY" });

    expect(title).toEqual("TITLE_KEY");
    expect(description).toEqual("DESCRIPTION_KEY");
  });

  it("should return i18nLabels", () => {
    const { i18nLabels } = setup();

    expect(i18nLabels).toEqual({
      termsConditions: "I18N.MARKET_PROMO.T&C",
    });
  });

  it("should call getExternalLink with the correct props and return termsAndConditionsURL", () => {
    const { termsAndConditionsURL } = setup({
      containerProps: {
        titleKey: "TITLE_KEY",
        descriptionKey: "DESCRIPTION_KEY",
        externalLinkType: EXTERNAL_LINK_TYPE_MOCK,
      },
    });

    expect(getExternalLink).toHaveBeenCalledTimes(1);
    expect(getExternalLink).toHaveBeenCalledWith(
      EXTERNAL_LINK_TYPE_MOCK,
      USER_DETAILS_MOCK.jurisdiction.jurisdiction,
      USER_DETAILS_MOCK.localeCode,
    );
    expect(termsAndConditionsURL).toEqual(EXTERNAL_LINK_MOCK);
  });

  describe("when urn is provided", () => {
    it("should return blurb card data when available", () => {
      const result = setup({
        containerProps: {
          urn: "ppb:tbd:card:blurb:test",
        },
      });

      expect(result).toEqual({
        title: "Test Title",
        description: "Test Description",
        isExpanded: true,
        signposting: MarketPromoIcon.MarketRules,
        i18nLabels: {
          termsConditions: "Test Link Text",
        },
        termsAndConditionsURL: "test-url",
      });
    });

    it("should return empty state when blurb card is not found", () => {
      const result = setup({
        containerProps: {
          urn: "ppb:tbd:card:blurb:not-found",
        },
      });

      expect(result).toEqual({
        title: "",
        description: "",
        signposting: MarketPromoIcon.MarketRules,
        i18nLabels: {
          termsConditions: expect.any(String),
        },
        termsAndConditionsURL: "",
      });
    });
  });

  describe("when titleKey and descriptionKey are provided", () => {
    it("should return i18n data", () => {
      const result = setup({
        containerProps: {
          titleKey: "TEST_TITLE",
          descriptionKey: "TEST_DESCRIPTION",
          externalLinkType: "TEST_LINK",
        },
      });

      expect(result).toEqual({
        title: expect.any(String),
        description: expect.any(String),
        signposting: MarketPromoIcon.NinetyMinPayout,
        i18nLabels: {
          termsConditions: expect.any(String),
        },
        termsAndConditionsURL: expect.any(String),
      });
    });
  });

  describe("when no data is available", () => {
    it("should return empty state", () => {
      const result = setup({
        containerProps: {},
      });

      expect(result).toEqual({
        title: "",
        description: "",
        signposting: MarketPromoIcon.MarketRules,
        i18nLabels: {
          termsConditions: expect.any(String),
        },
        termsAndConditionsURL: "",
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  describe("dispatchExternalPushAction", () => {
    it("dispatchExternalPushAction should dispatch EXTERNAL_PUSH_BLANK with the correct payload", () => {
      const { dispatchExternalPushAction } = mapDispatchToProps;
      expect(dispatchExternalPushAction("url")).toEqual({
        type: EXTERNAL_PUSH_BLANK,
        payload: { viewUrn: "", viewUrl: "url" },
      });
    });
  });

  describe("dispatchMarketBlurbLinkClick", () => {
    it("should dispatch UI__MARKET_BLURB_LINK_CLICK with the correct payload", () => {
      const { dispatchMarketBlurbLinkClick } = mapDispatchToProps;

      expect(dispatchMarketBlurbLinkClick("url", "title", "variant")).toEqual({
        type: UI__MARKET_BLURB_LINK_CLICK,
        payload: {
          destinationUrl: "url",
          elementText: "title",
          variant: "variant",
        },
      });
    });
  });

  describe("dispatchToggleDescriptionBlurbCard", () => {
    it("should dispatch UI__PROMO_DESCRIPTION_TOGGLE with the correct payload", () => {
      const { dispatchToggleDescriptionBlurbCard } = mapDispatchToProps;

      expect(dispatchToggleDescriptionBlurbCard("title", true, "general")).toEqual({
        type: UI__PROMO_DESCRIPTION_TOGGLE,
        payload: {
          title: "title",
          isOpen: true,
          variant: "general",
        },
      });
    });
  });
});
