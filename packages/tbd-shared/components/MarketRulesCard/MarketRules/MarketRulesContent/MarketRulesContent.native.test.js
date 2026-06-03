import { formatFullDateAndTime } from "../../../../helpers/dates";
import { buildMarketRulesContent } from "./MarketRulesContent.native";
import styles from "./MarketRulesContent.native.styles";

jest.mock("@ppb/the-wall-native", () => ({
  ActionLink: jest.fn(() => <action-link />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("react-native-webview", () => jest.fn((props) => <webview-mock {...props} />));

jest.mock("../../../../helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

jest.mock("../../../../helpers/dates", () => ({
  formatFullDateAndTime: jest.fn(() => "formattedDate"),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
  tokens: {
    MarketRulesSectionContainerPadding: {},
  },
}));

const mockBuildMarketRulesContent = ({
  discountAllowed = true,
  eventStartTime = "2020-01-02T12:15:00Z",
  sections = [
    {
      name: "Title",
      content: "Content",
    },
  ],
  footer = "footer",
  onDiscountRateLinkClick = () => {},
}) => {
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

  return buildMarketRulesContent(marketRulesMock, "locale", "timezone", "discountRateUrl", onDiscountRateLinkClick)[0];
};

describe("MarketRulesContent", () => {
  describe("when marketRules have all values needed", () => {
    const onDiscountRateLinkClick = jest.fn();
    const MarketRulesContent = mockBuildMarketRulesContent({ onDiscountRateLinkClick });
    const MarketRulesSections = MarketRulesContent.content.props.children;

    it("should return proper id and title", () => {
      expect(MarketRulesContent.id).toEqual("exchange");
    });

    describe("Title Section", () => {
      it("should return Market Rules Title Section with proper style and children", () => {
        const titleSectionProps = MarketRulesSections[0].props;

        expect(titleSectionProps.style).toEqual(styles.title);
        expect(titleSectionProps.children).toEqual("I18N.MARKET_RULES.TITLE");
      });
    });

    describe("Comission Section", () => {
      const comissionSectionProps = MarketRulesSections[1].props;

      it("should return Market Rules Commission Section with expected props", () => {
        expect(comissionSectionProps.name).toEqual("I18N.MARKET_RULES.COMMISSION");
      });

      it("should return Discount Rate first with proper style and children", () => {
        const discountRateProps = comissionSectionProps.children[0].props;

        expect(discountRateProps.style).toEqual(styles.text);
        expect(discountRateProps.children).toEqual("10% I18N.MARKET_RULES.DISCOUNT_RATE");
      });

      it("should return Minus your Discount second with proper style and children", () => {
        const minusYourDiscountProps = comissionSectionProps.children[1].props;

        expect(minusYourDiscountProps.style).toEqual(styles.text);
        expect(minusYourDiscountProps.children).toEqual("I18N.MARKET_RULES.MINUS_YOUR_DISCOUNT");
      });

      describe("Discount Rate", () => {
        const pressableProps = comissionSectionProps.children[2].props;

        it("should return ActionLink component with expected props", () => {
          expect(pressableProps.onClick).toEqual(expect.any(Function));
        });

        it("should behave correctly when pressed", () => {
          pressableProps.onClick();

          expect(onDiscountRateLinkClick).toHaveBeenCalledWith(
            "I18N.MARKET_RULES.DISCOUNT_RATE_EXPLAINED",
            "discountRateUrl",
          );
        });

        it("should return Discount Rate Explained third with proper text content", () => {
          expect(pressableProps.text).toBe("I18N.MARKET_RULES.DISCOUNT_RATE_EXPLAINED");
        });
      });
    });

    describe("EventStartTime Section", () => {
      const eventStartTimeSectionProps = MarketRulesSections[2].props;
      const eventStartTimeProps = eventStartTimeSectionProps.children.props;

      it("should return EventStartTime Section with expected props", () => {
        expect(eventStartTimeSectionProps.name).toEqual("I18N.MARKET_RULES.EVENT_START_TIME");
      });

      it("should return the EventStartTime with expected props and children", () => {
        expect(eventStartTimeProps.style).toEqual(styles.text);

        expect(eventStartTimeProps.children).toEqual("formattedDate");
      });

      it("should call formatFullDateAndTime with the correct parameters", () => {
        expect(formatFullDateAndTime).toHaveBeenCalledWith(expect.any(Date), "locale", "timezone");
      });
    });

    describe("Sections Section", () => {
      it("should return Sections Section with expected props", () => {
        const sectionsSectionProps = MarketRulesSections[3][0].props;
        const htmlViewProps = sectionsSectionProps.children.props.children.props;

        expect(sectionsSectionProps.name).toEqual("Title");
        expect(htmlViewProps.html).toEqual("Content");
      });
    });

    describe("Footer Section", () => {
      it("should return Footer Section with expected props", () => {
        const footerSectionProps = MarketRulesSections[4].props.children.props;

        expect(footerSectionProps.containerStyle).toEqual(styles.footer);
        expect(footerSectionProps.html).toEqual("footer");
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
    const noDiscountAllowed = mockBuildMarketRulesContent({ discountAllowed: false });
    const MarketRulesSections = noDiscountAllowed.content.props.children;

    it("should not return Minus your Discount", () => {
      const comissionSectionProps = MarketRulesSections[1].props;
      const minusYourDiscountProps = comissionSectionProps.children[1];

      expect(minusYourDiscountProps).not.toEqual("I18N.MARKET_RULES.MINUS_YOUR_DISCOUNT");
    });
  });

  describe("when there is no eventStartTime", () => {
    const noEventStartTime = mockBuildMarketRulesContent({ eventStartTime: null });
    const MarketRulesSections = noEventStartTime.content.props.children;

    it("should return second child  content as undefined", () => {
      const eventStartTimeSection = MarketRulesSections[2];

      expect(eventStartTimeSection).toBe(null);
    });
  });

  describe("when there are no sections", () => {
    const noSections = mockBuildMarketRulesContent({ sections: null });
    const MarketRulesSections = noSections.content.props.children;

    it("should return third child  content as null", () => {
      const sectionsSection = MarketRulesSections[3];

      expect(sectionsSection).not.toBeDefined();
    });
  });

  describe("when there is no footer", () => {
    const noFooter = mockBuildMarketRulesContent({
      footer: null,
    });
    const MarketRulesSections = noFooter.content.props.children;

    it("should return last child of content as null", () => {
      const footerSection = MarketRulesSections[4];

      expect(footerSection).toBe(null);
    });
  });
});
