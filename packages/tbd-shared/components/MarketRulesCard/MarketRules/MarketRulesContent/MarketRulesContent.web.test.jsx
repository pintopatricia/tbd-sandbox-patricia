import "jest-dom/extend-expect";
import { buildMarketRulesContent } from "./MarketRulesContent.web";
import styles from "./MarketRulesContent.web.css";
import { formatFullDateAndTime } from "../../../../helpers/dates";

jest.mock("@ppb/the-wall-web", () => ({
  Link: jest.fn(() => <link />),
}));

jest.mock("../../../../helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

jest.mock("../../../../helpers/dates", () => ({
  formatFullDateAndTime: jest.fn(() => "date"),
}));

const mockBuildMarketRulesContent = (
  discountAllowed = true,
  eventStartTime = "2020-01-02T12:15:00Z",
  sections = [
    {
      name: "Title",
      content: "Content",
    },
  ],
  footer = "footer",
) => {
  const marketRulesMock = {
    type: "MARKET_RULES_CARD",
    marketName: "Market Name",
    wallet: "Wallet",
    clarifications: "Clarifications",
    marketBaseRate: "10",
    discountAllowed,
    eventStartTime,
    sections,
    footer,
  };

  return buildMarketRulesContent(marketRulesMock, "locale", "timezone", "discountRateUrl", expect.any(Function))[0];
};

describe("MarketRulesContent", () => {
  describe("when marketRules have all values needed", () => {
    const MarketRulesContent = mockBuildMarketRulesContent();
    const MarketRulesSections = MarketRulesContent.content.props.children;
    it("should return proper id and title", () => {
      expect(MarketRulesContent.id).toEqual("exchange");
    });

    describe("Title Section", () => {
      it("should return Market Rules Title Section with proper style and children", () => {
        const titleSectionProps = MarketRulesSections[0].props;

        expect(titleSectionProps.className).toContain(styles.title);
        expect(titleSectionProps.children).toEqual("I18N.MARKET_RULES.TITLE");
      });
    });

    describe("Comission Section", () => {
      const comissionSectionProps = MarketRulesSections[1].props;
      it("should return Market Rules Commission Section with proper style", () => {
        expect(comissionSectionProps.name).toEqual("I18N.MARKET_RULES.COMMISSION");
      });

      it("should return Discount Rate first with proper style and children", () => {
        const discountRateProps = comissionSectionProps.children[0].props;

        expect(discountRateProps.className).toEqual(styles.labelSpacing);
        expect(discountRateProps.children).toEqual("10% I18N.MARKET_RULES.DISCOUNT_RATE");
      });

      it("should return Minus your Discount second with proper style and children", () => {
        const minusYourDiscountProps = comissionSectionProps.children[1].props;

        expect(minusYourDiscountProps.children).toEqual("I18N.MARKET_RULES.MINUS_YOUR_DISCOUNT");
      });

      it("should return Discount Rate Explained third with proper style and children", () => {
        const discountRateExplainedProps = comissionSectionProps.children[2].props;

        expect(discountRateExplainedProps.children).toEqual("I18N.MARKET_RULES.DISCOUNT_RATE_EXPLAINED");
      });
    });

    describe("EventStartTime Section", () => {
      it("should return EventStartTime Section with expected props", () => {
        const eventStartTimeSectionProps = MarketRulesSections[2].props;

        expect(eventStartTimeSectionProps.name).toEqual("I18N.MARKET_RULES.EVENT_START_TIME");
      });

      it("should call formatFullDateAndTime", () => {
        expect(formatFullDateAndTime).toHaveBeenCalledWith(expect.any(Date), "locale", "timezone");
      });
    });

    describe("Sections Section", () => {
      const sectionsSectionProps = MarketRulesSections[3][0].props;

      it("should return Sections Section with expected props", () => {
        expect(sectionsSectionProps.name).toEqual("Title");
      });

      it("should have expected content", () => {
        const contentProps = sectionsSectionProps.children.props;

        expect(contentProps.dangerouslySetInnerHTML).toEqual({ __html: "Content" });
      });
    });

    describe("Footer Section", () => {
      it("should return Footer Section with expected props", () => {
        const footerSectionProps = MarketRulesSections[4].props;

        expect(footerSectionProps.className).toContain(styles.footer);
        expect(footerSectionProps.dangerouslySetInnerHTML).toEqual({ __html: "footer" });
      });
    });
  });
  describe("when there are no marketRules", () => {
    it("should not return any content", () => {
      const MarketRulesContent = buildMarketRulesContent(undefined, expect.any(Function));

      expect(MarketRulesContent.content).toBe(undefined);
    });
  });
  describe("when there is no discountAllowed", () => {
    const noDiscountAllowed = mockBuildMarketRulesContent(false);
    const MarketRulesSections = noDiscountAllowed.content.props.children;

    it("should not return Minus your Discount", () => {
      const comissionSectionProps = MarketRulesSections[1].props;
      const minusYourDiscountProps = comissionSectionProps.children[1];

      expect(minusYourDiscountProps).not.toEqual("I18N.MARKET_RULES.MINUS_YOUR_DISCOUNT");
    });
  });
  describe("when there is no eventStartTime", () => {
    const noEventStartTime = mockBuildMarketRulesContent(true, null);
    const MarketRulesSections = noEventStartTime.content.props.children;

    it("should return second child  content as undefined", () => {
      const eventStartTimeSection = MarketRulesSections[2];

      expect(eventStartTimeSection).toBe(null);
    });
  });
  describe("when there are no sections", () => {
    const noSections = mockBuildMarketRulesContent(true, "2020-01-02T12:15:00Z", null);
    const MarketRulesSections = noSections.content.props.children;

    it("should return third child  content as null", () => {
      const sectionsSection = MarketRulesSections[3];

      expect(sectionsSection).not.toBeDefined();
    });
  });
  describe("when there is no footer", () => {
    const noFooter = mockBuildMarketRulesContent(
      true,
      "2020-01-02T12:15:00Z",
      [
        {
          name: "Title",
          content: "Content",
        },
      ],
      null,
    );
    const MarketRulesSections = noFooter.content.props.children;

    it("should return last child of content as null", () => {
      const footerSection = MarketRulesSections[4];

      expect(footerSection).toBe(null);
    });
  });
});
