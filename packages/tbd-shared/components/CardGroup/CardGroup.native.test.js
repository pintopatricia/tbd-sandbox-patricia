import { render } from "@testing-library/react-native";
import CardGroup from "./CardGroup.native";

import ConnectedCard from "../Card";
import ConnectedGamingCardGroup from "../GamingCardGroup";
import ConnectedSwimlaneCardGroup from "../SwimlaneCardGroup";
import ConnectedByTimeRangeMeetingCardGroup from "../ByTimeRangeMeetingCardGroup";
import ConnectedHalfTimeSpecialsSwimlaneCardGroup from "../HalfTimeSpecialsSwimlaneCardGroup";
import ConnectedSportRibbonCardGroup from "../SportRibbonCardGroup";
import ConnectedExpandableCardGroup from "../ExpandableCardGroup";
import ConnectedPebbleCardGroup from "../PebbleCardGroup";
import ConnectedFilteredCouponCardGroup from "../FilteredCouponCardGroup";
import ConnectedSelectableItemsCardGroup from "../SelectableItemsCardGroup";
import ConnectedBetCardGroup from "../BetCardGroup";
import ConnectedBetSharingCardGroup from "../BetSharingCardGroup";
import ConnectedSportsbookBetLegCardGroup from "../SportsbookBetLegCardGroup";
import ConnectedSportsbookExpandableLegCardGroup from "../SportsbookExpandableLegCardGroup";
import QuicklinksGridCardGroup from "../QuicklinksGridCardGroup/QuicklinksGridCardGroup.native";
import ConnectedMarketBetCardGroup from "../MarketBetCardGroup";
import ConnectedMarketBetExpandableCardGroup from "../MarketBetExpandableCardGroup";
import ConnectedMarketBetSelectionCardGroup from "../MarketBetSelectionCardGroup";
import ConnectedVirtualCardGroup from "../VirtualCardGroup";
import ConnectedExtraWalletCardGroup from "../ExtraWalletCardGroup";
import ConnectedRacingSwimlaneCardGroup from "../RacingSwimlaneCardGroup";
import ConnectedPopularSwimlaneCardGroup from "../PopularSwimlaneCardGroup";
import PromotionsCardGroup from "../Promos/PromotionsCardGroup.native";
import PromotionsHubCardGroup from "../PromotionsHub/PromotionsHubCardGroup.native";

/* Placeholders */
import SportRibbonCardGroupPlaceholder from "../SportRibbonCardGroup/SportRibbonCardGroupPlaceholder.native";
import { FilteredCouponCardGroupPlaceholder, DefaultPlaceholder } from "./CardGroupPlaceholders.native";
import PebbleCardGroupPlaceholder from "../PebbleCardGroup/PebbleCardGroupPlaceholder.native";
import SportsbookExpandableLegCardGroupPlaceholder from "../SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroupPlaceholder.native";
import SportsbookBetLegCardGroupPlaceholder from "../SportsbookBetLegCardGroup/SportsbookBetLegCardGroupPlaceholder.native";

/* Connected Components */
jest.mock("../Card", () => jest.fn(() => <mock testID="card" />));
jest.mock("../GamingCardGroup", () => jest.fn(() => <mock testID="gaming-card-group" />));
jest.mock("../SwimlaneCardGroup", () => jest.fn(() => <mock testID="swimlane-card-group" />));
jest.mock("../RacingSwimlaneCardGroup", () => jest.fn(() => <mock testID="racing-swimlane-card-group" />));
jest.mock("../PopularSwimlaneCardGroup", () => jest.fn(() => <mock testID="popular-swimlane-card-group" />));
jest.mock("../ByTimeRangeMeetingCardGroup", () => jest.fn(() => <mock testID="by-time-range-meeting-card-group" />));
jest.mock("../HalfTimeSpecialsSwimlaneCardGroup", () =>
  jest.fn(() => <mock testID="half-time-specials-swimlane-card-group" />),
);
jest.mock("../SportRibbonCardGroup", () => jest.fn(() => <mock testID="sport-ribbon-card-group" />));
jest.mock("../ExpandableCardGroup", () => jest.fn(() => <mock testID="expandable-card-group" />));
jest.mock("../PebbleCardGroup", () => jest.fn(() => <mock testID="pebble-card-group" />));
jest.mock("../FilteredCouponCardGroup", () => jest.fn(() => <mock testID="filtered-coupon-card-group" />));
jest.mock("../SelectableItemsCardGroup", () => jest.fn(() => <mock testID="selectable-items-card-group" />));
jest.mock("../BetCardGroup", () => jest.fn(() => <mock testID="bet-card-group" />));
jest.mock("../BetSharingCardGroup", () => jest.fn(() => <mock testID="bet-sharing-card-group" />));
jest.mock("../SportsbookBetLegCardGroup", () => jest.fn(() => <mock testID="sportsbook-bet-leg-card-group" />));
jest.mock("../SportsbookExpandableLegCardGroup", () =>
  jest.fn(() => <mock testID="sportsbook-expandable-bet-leg-card-group" />),
);
jest.mock("../MarketBetCardGroup", () => jest.fn(() => <mock testID="market-bet-card-group" />));
jest.mock("../MarketBetExpandableCardGroup", () => jest.fn(() => <mock testID="market-bet-expandable-card-group" />));
jest.mock("../MarketBetSelectionCardGroup", () => jest.fn(() => <mock testID="market-bet-selection-card-group" />));
jest.mock("../VirtualCardGroup", () => jest.fn(() => <mock testID="virtual-card-group" />));
jest.mock("../ExtraWalletCardGroup", () => jest.fn(() => <mock testID="extra-wallet-card-group" />));

/* Components */
jest.mock("../Card/Card.native", () => "card-native");
jest.mock("../GamingCardGroup/GamingCardGroup.native", () => "gaming-card-group-native");
jest.mock("../SwimlaneCardGroup/SwimlaneCardGroup.native", () => "swimlane-card-group-native");
jest.mock(
  "../ByTimeRangeMeetingCardGroup/ByTimeRangeMeetingCardGroup.native",
  () => "by-time-range-meeting-card-group-native",
);
jest.mock(
  "../HalfTimeSpecialsSwimlaneCardGroup/HalfTimeSpecialsSwimlaneCardGroup.native",
  () => "half-time-specials-swimlane-card-group-native",
);
jest.mock("../SportRibbonCardGroup/SportRibbonCardGroup.native", () => "sport-ribbon-card-group-native");
jest.mock("../ExpandableCardGroup/ExpandableCardGroup.native", () => "expandable-card-group-native");
jest.mock("../PebbleCardGroup/PebbleCardGroup.native", () => "pebble-card-group-native");
jest.mock("../FilteredCouponCardGroup/FilteredCouponCardGroup.native", () => "filtered-coupon-card-group-native");
jest.mock("../SelectableItemsCardGroup/SelectableItemsCardGroup.native", () => "selectable-items-card-group-native");
jest.mock("../BetCardGroup/BetCardGroup.native", () => "bet-card-group-native");
jest.mock("../BetSharingCardGroup/BetSharingCardGroup.native", () => "bet-sharing-card-group-native");
jest.mock(
  "../SportsbookBetLegCardGroup/SportsbookBetLegCardGroup.native",
  () => "sportsbook-bet-leg-card-group-native",
);
jest.mock(
  "../SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.native",
  () => "sportsbook-expandable-bet-leg-card-group-native",
);

jest.mock("../QuicklinksGridCardGroup/QuicklinksGridCardGroup.native", () =>
  jest.fn(() => <mock testID="quicklinks-grid-card-group" />),
);

jest.mock("../MarketBetCardGroup/MarketBetCardGroup.native", () => "market-bet-card-group-native");
jest.mock(
  "../MarketBetExpandableCardGroup/MarketBetExpandableCardGroup.native",
  () => "market-bet-expandable-card-group-native",
);
jest.mock(
  "../MarketBetSelectionCardGroup/MarketBetSelectionCardGroup.native",
  () => "market-bet-selection-card-group-native",
);
jest.mock("../VirtualCardGroup/VirtualCardGroup.native", () => "virtual-card-group-native");
jest.mock("../ExtraWalletCardGroup/ExtraWalletCardGroup.native", () => "extra-wallet-card-group-native");
jest.mock("../RacingSwimlaneCardGroup/RacingSwimlaneCardGroup.native", () => "racing-swimlane-card-group-native");
jest.mock("../PopularSwimlaneCardGroup/PopularSwimlaneCardGroup.native", () => "popular-swimlane-card-group-native");

jest.spyOn(global.console, "warn").mockReturnValue("warning");

/* Placeholders */
jest.mock("../SportRibbonCardGroup/SportRibbonCardGroupPlaceholder.native", () =>
  jest.fn(() => <mock testID="sport-ribbon-card-group-placeholder" />),
);
jest.mock("./CardGroupPlaceholders.native", () => ({
  FilteredCouponCardGroupPlaceholder: jest.fn(() => <mock testID="filtered-coupon-card-group-placeholder" />),
  DefaultPlaceholder: jest.fn(() => <mock testID="default-placeholder" />),
}));
jest.mock("../PebbleCardGroup/PebbleCardGroupPlaceholder.native", () =>
  jest.fn(() => <mock testID="pebble-card-group-placeholder" />),
);
jest.mock("../SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroupPlaceholder.native", () =>
  jest.fn(() => <mock testID="sportsbook-expandable-leg-card-group-placeholder" />),
);
jest.mock("../SportsbookBetLegCardGroup/SportsbookBetLegCardGroupPlaceholder.native", () =>
  jest.fn(() => <mock testID="sportsbook-bet-leg-card-group-placeholder" />),
);
jest.mock("../Promos/PromotionsCardGroup.native", () => jest.fn(() => <mock testID="promotions-card-group" />));
jest.mock("../PromotionsHub/PromotionsHubCardGroup.native", () =>
  jest.fn(() => <mock testID="promotions-hub-card-group" />),
);

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
  heights: {},
  widths: { "swimlane-item-container-width-percentage": 1 },
  tokens: {
    QuickLinkCardTitleGap: {},
    QuickLinkCardGap: {},
    QuickLinkCardTitleTypography: {},
  },
}));

jest.mock("@ppb/the-wall-native", () => ({
  TBDImage: jest.fn(() => <image-mock />),
}));

jest.mock("../ErrorBoundary/ErrorBoundary", () => ({
  ErrorBoundary: jest.fn(({ children }) => <>{children}</>),
}));

describe("CardGroup Native", () => {
  beforeEach(jest.clearAllMocks);

  describe.each([
    [
      "SwimlaneCardGroup",
      ConnectedSwimlaneCardGroup,
      "swimlane-card-group-native",
      "swimlane-card-group",
      "SwimlaneCardGroup",
      DefaultPlaceholder,
    ],
    [
      "RacingSwimlaneCardGroup",
      ConnectedRacingSwimlaneCardGroup,
      "racing-swimlane-card-group-native",
      "racing-swimlane-card-group",
      "RacingSwimlaneCardGroup",
      DefaultPlaceholder,
    ],
    [
      "PopularSwimlaneCardGroup",
      ConnectedPopularSwimlaneCardGroup,
      "popular-swimlane-card-group-native",
      "popular-swimlane-card-group",
      "PopularSwimlaneCardGroup",
      DefaultPlaceholder,
    ],
    [
      "ByTimeRangeMeetingCardGroup",
      ConnectedByTimeRangeMeetingCardGroup,
      "by-time-range-meeting-card-group-native",
      "by-time-range-meeting-card-group",
      "ByTimeRangeMeetingCardGroup",
      DefaultPlaceholder,
    ],
    [
      "SwimlaneIndexedCardGroup",
      ConnectedSwimlaneCardGroup,
      "swimlane-card-group-native",
      "swimlane-card-group",
      "SwimlaneCardGroup",
      DefaultPlaceholder,
    ],
    [
      "HalfTimeSpecialsSwimlaneCardGroup",
      ConnectedHalfTimeSpecialsSwimlaneCardGroup,
      "half-time-specials-swimlane-card-group-native",
      "half-time-specials-swimlane-card-group",
      "HalfTimeSpecialsSwimlaneCardGroup",
      DefaultPlaceholder,
    ],
    [
      "BetCardGroup",
      ConnectedBetCardGroup,
      "bet-card-group-native",
      "bet-card-group",
      "BetCardGroup",
      DefaultPlaceholder,
    ],
    [
      "BetSharingCardGroup",
      ConnectedBetSharingCardGroup,
      "bet-sharing-card-group-native",
      "bet-sharing-card-group",
      "BetSharingCardGroup",
    ],
    [
      "PebbleCardGroup",
      ConnectedPebbleCardGroup,
      "pebble-card-group-native",
      "pebble-card-group",
      "PebbleCardGroup",
      PebbleCardGroupPlaceholder,
    ],
    [
      "SportsbookBetLegCardGroup",
      ConnectedSportsbookBetLegCardGroup,
      "sportsbook-bet-leg-card-group-native",
      "sportsbook-bet-leg-card-group",
      "SportsbookBetLegCardGroup",
      SportsbookBetLegCardGroupPlaceholder,
    ],
    [
      "SportsbookExpandableLegCardGroup",
      ConnectedSportsbookExpandableLegCardGroup,
      "sportsbook-expandable-bet-leg-card-group-native",
      "sportsbook-expandable-bet-leg-card-group",
      "SportsbookExpandableLegCardGroup",
      SportsbookExpandableLegCardGroupPlaceholder,
    ],
    [
      "ExpandableCardGroup",
      ConnectedExpandableCardGroup,
      "expandable-card-group-native",
      "expandable-card-group",
      "ExpandableCardGroup",
      DefaultPlaceholder,
    ],
    [
      "SportRibbonCardGroup",
      ConnectedSportRibbonCardGroup,
      "sport-ribbon-card-group-native",
      "sport-ribbon-card-group",
      "SportRibbonCardGroup",
      SportRibbonCardGroupPlaceholder,
    ],
    [
      "SelectableItemsCardGroup",
      ConnectedSelectableItemsCardGroup,
      "selectable-items-card-group-native",
      "selectable-items-card-group",
      "SelectableItemsCardGroup",
      DefaultPlaceholder,
    ],
    [
      "FilteredCouponCardGroup",
      ConnectedFilteredCouponCardGroup,
      "filtered-coupon-card-group-native",
      "filtered-coupon-card-group",
      "FilteredCouponCardGroup",
      FilteredCouponCardGroupPlaceholder,
    ],
    [
      "FutureRacingCardGroup",
      ConnectedFilteredCouponCardGroup,
      "filtered-coupon-card-group-native",
      "filtered-coupon-card-group",
      "FutureRacingCardGroup",
      DefaultPlaceholder,
    ],
    [
      "RacesByTimeRangeCardGroup",
      ConnectedFilteredCouponCardGroup,
      "filtered-coupon-card-group-native",
      "filtered-coupon-card-group",
      "RacesByTimeRangeCardGroup",
      DefaultPlaceholder,
    ],
    [
      "GamingCardGroup",
      ConnectedGamingCardGroup,
      "gaming-card-group-native",
      "gaming-card-group",
      "GamingCardGroup",
      DefaultPlaceholder,
    ],
    [
      "MarketBetCardGroup",
      ConnectedMarketBetCardGroup,
      "market-bet-card-group-native",
      "market-bet-card-group",
      "MarketBetCardGroup",
      undefined,
    ],
    [
      "MarketBetExpandableCardGroup",
      ConnectedMarketBetExpandableCardGroup,
      "market-bet-expandable-card-group-native",
      "market-bet-expandable-card-group",
      "MarketBetExpandableCardGroup",
      undefined,
    ],
    [
      "MarketBetSelectionCardGroup",
      ConnectedMarketBetSelectionCardGroup,
      "market-bet-selection-card-group-native",
      "market-bet-selection-card-group",
      "MarketBetSelectionCardGroup",
      undefined,
    ],
    [
      "VirtualCardGroup",
      ConnectedVirtualCardGroup,
      "virtual-card-group-native",
      "virtual-card-group",
      "VirtualCardGroup",
      DefaultPlaceholder,
    ],
  ])("when the card group type is `%s`", (componentName, connected, component, testId, typename, placeholder) => {
    it(`should lazy load and render the connected ${componentName} component`, async () => {
      const { queryByTestId } = render(<CardGroup urn={"urn"} typename={typename} placeholder={placeholder} />);

      const result = await queryByTestId(testId);

      expect(result).toBeDefined();
      expect(connected).toHaveBeenCalledWith({ urn: "urn", component, placeholder, visible: undefined }, undefined);
    });
  });

  describe("when the card group type is ExtraWalletCardGroup", () => {
    it(`should lazy load and render the connected ExtraWalletCardGroup component without urn`, async () => {
      const { queryByTestId } = render(
        <CardGroup typename={"ExtraWalletCardGroup"} placeholder={DefaultPlaceholder} />,
      );

      const result = await queryByTestId("extra-wallet-card-group");

      expect(result).toBeDefined();
      expect(ConnectedExtraWalletCardGroup).toHaveBeenCalledWith(
        { component: "extra-wallet-card-group-native", placeholder: DefaultPlaceholder },
        undefined,
      );
    });
  });

  describe("when the typename doesn't match any card group", () => {
    it("should render the connected card", () => {
      const { queryByTestId } = render(<CardGroup typename="OTHER_CARD" urn="urn" />);

      const result = queryByTestId("card-native");

      expect(result).toBeDefined();
      expect(ConnectedCard).toHaveBeenCalledWith(
        { urn: "urn", typename: "OTHER_CARD", component: "card-native", placeholder: DefaultPlaceholder },
        undefined,
      );
    });
  });

  describe("when the typename is PromotionsCardGroup", () => {
    it("should render the PromotionsCardGroup component", () => {
      const { queryByTestId } = render(<CardGroup typename="PromotionsCardGroup" urn="urn" visible={true} />);

      const result = queryByTestId("promotions-card-group-placeholder");

      expect(result).toBeDefined();
      expect(PromotionsCardGroup).toHaveBeenCalledWith({ urn: "urn", visible: true }, undefined);
    });
  });

  describe("when the typename is QuicklinksGridCardGroup", () => {
    it("should render the QuicklinksGridCardGroup component", () => {
      const { queryByTestId } = render(<CardGroup typename="QuicklinksGridCardGroup" urn="urn" visible={true} />);

      const result = queryByTestId("quicklinks-grid-card-group");

      expect(result).toBeDefined();
      expect(QuicklinksGridCardGroup).toHaveBeenCalledWith({ urn: "urn", visible: true }, undefined);
    });
  });

  describe("when the typename is PromotionsHubCardGroup", () => {
    it("should render the PromotionsHubCardGroup component", () => {
      const { queryByTestId } = render(<CardGroup typename="PromotionsHubCardGroup" urn="urn" visible={true} />);

      const result = queryByTestId("promotions-hub-card-group");

      expect(result).toBeDefined();
      expect(PromotionsHubCardGroup).toHaveBeenCalledWith({ urn: "urn", visible: true }, undefined);
    });
  });
});
