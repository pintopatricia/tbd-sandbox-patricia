import { render, waitFor } from "@testing-library/react";
import "jest-dom/extend-expect";
import ViewZone from "./ViewZone.web";
import { TEST_ID, TITLE, CHILDREN } from "./ViewZone.web.selectors";
import QuicklinksGridCardGroup from "@ppb/tbd-components-navigation/components/QuicklinksGridCardGroup/view/QuicklinksGridCardGroup.web";
import ConnectedSwimlaneCardGroup from "../SwimlaneCardGroup";
import ConnectedRacingSwimlaneCardGroup from "../RacingSwimlaneCardGroup";
import ConnectedPopularSwimlaneCardGroup from "../PopularSwimlaneCardGroup";
import ConnectedGamingCardGroup from "../GamingCardGroup";
import ConnectedSportRibbonCardGroup from "../SportRibbonCardGroup";
import ConnectedSegmentedCardGroup from "../SegmentedCardGroup";
import ConnectedPebbleCardGroup from "../PebbleCardGroup";
import ConnectedExpandableCardGroup from "../ExpandableCardGroup";
import ConnectedFilteredCouponCardGroup from "../FilteredCouponCardGroup";
import ConnectedSelectableItemsCardGroup from "../SelectableItemsCardGroup";
import ConnectedBetCardGroup from "../BetCardGroup";
import ConnectedSportsbookBetLegCardGroup from "../SportsbookBetLegCardGroup";
import ConnectedSportsbookExpandableLegCardGroup from "../SportsbookExpandableLegCardGroup";
import ConnectedMarketBetCardGroup from "../MarketBetCardGroup";
import ConnectedMarketBetSelectionCardGroup from "../MarketBetSelectionCardGroup";
import ConnectedMarketBetExpandableCardGroup from "../MarketBetExpandableCardGroup";
import ConnectedCard from "../Card";

jest.mock("../PebbleCardGroup/PebbleCardGroupPlaceholder.web", () => "pebble-card-group-placeholder-mock");
jest.mock("../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.web", () => "swimlane-card-group-placeholder-mock");
jest.mock(
  "../RacingSwimlaneCardGroup/RacingSwimlaneCardGroupPlaceholder.web",
  () => "racing-swimlane-card-group-placeholder-mock",
);
jest.mock(
  "../PopularSwimlaneCardGroup/PopularSwimlaneCardGroupPlaceholder.web",
  () => "popular-swimlane-card-group-placeholder-mock",
);
jest.mock(
  "../SportRibbonCardGroup/SportRibbonCardGroupPlaceholder.web",
  () => "sport-ribbon-card-group-placeholder-mock",
);
jest.mock("../SegmentedCardGroup/SegmentedCardGroupPlaceholder.web", () => "segmented-card-group-placeholder-mock");

jest.mock("../SwimlaneCardGroup", () => jest.fn(() => <connected-swimlane-card-group-mock />));
jest.mock(
  "../SwimlaneCardGroup/SwimlaneCardGroup.web",
  jest.fn(() => <swimlane-card-group-mock />),
);
jest.mock("../RacingSwimlaneCardGroup", () => jest.fn(() => <connected-racing-swimlane-card-group-mock />));
jest.mock(
  "../RacingSwimlaneCardGroup/RacingSwimlaneCardGroup.web",
  jest.fn(() => <racing-swimlane-card-group-mock />),
);

jest.mock("../PopularSwimlaneCardGroup", () => jest.fn(() => <connected-popular-swimlane-card-group-mock />));
jest.mock(
  "../PopularSwimlaneCardGroup/PopularSwimlaneCardGroup.web",
  jest.fn(() => <popular-swimlane-card-group-mock />),
);

jest.mock("../GamingCardGroup", () => jest.fn(() => <connected-gaming-card-group-mock />));
jest.mock(
  "../GamingCardGroup/GamingCardGroup.web",
  jest.fn(() => <gaming-card-group-mock />),
);

jest.mock("../SportRibbonCardGroup", () => jest.fn(() => <connected-sport-ribbon-card-group-mock />));
jest.mock(
  "../SportRibbonCardGroup/SportRibbonCardGroup.web",
  jest.fn(() => <sport-ribbon-card-group-mock />),
);

jest.mock("../SegmentedCardGroup", () => jest.fn(() => <connected-segmented-card-group-mock />));
jest.mock(
  "../SegmentedCardGroup/SegmentedCardGroup.web",
  jest.fn(() => <segmented-card-group-mock />),
);

jest.mock("../PebbleCardGroup", () => jest.fn(() => <connected-pebble-card-group-mock />));
jest.mock(
  "../PebbleCardGroup/PebbleCardGroup.web",
  jest.fn(() => <pebble-card-group-mock />),
);

jest.mock("../ExpandableCardGroup", () => jest.fn(() => <connected-expandable-card-group-mock />));
jest.mock(
  "../ExpandableCardGroup/ExpandableCardGroup.web",
  jest.fn(() => <expandable-card-group-mock />),
);

jest.mock("../FilteredCouponCardGroup", () => jest.fn(() => <connected-filtered-coupon-card-group-mock />));
jest.mock(
  "../FilteredCouponCardGroup/FilteredCouponCardGroup.web",
  jest.fn(() => <filtered-coupon-card-group-mock />),
);

jest.mock("../SelectableItemsCardGroup", () => jest.fn(() => <connected-selectable-items-card-group-mock />));
jest.mock(
  "../SelectableItemsCardGroup/SelectableItemsCardGroup.web",
  jest.fn(() => <selectable-items-card-group-mock />),
);

jest.mock("../BetCardGroup", () => jest.fn(() => <connected-bet-card-group-mock />));
jest.mock(
  "../BetCardGroup/BetCardGroup.web",
  jest.fn(() => <bet-card-group-mock />),
);

jest.mock("../SportsbookBetLegCardGroup", () => jest.fn(() => <connected-sportsbook-bet-leg-card-group-mock />));
jest.mock(
  "../SportsbookBetLegCardGroup/SportsbookBetLegCardGroup.web",
  jest.fn(() => <sportsbook-bet-leg-card-group-mock />),
);

jest.mock("../SportsbookExpandableLegCardGroup", () =>
  jest.fn(() => <connected-sportsbook-expandable-leg-card-group-mock />),
);
jest.mock(
  "../SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.web",
  jest.fn(() => <sportsbook-expandable-leg-card-group-mock />),
);

jest.mock("@ppb/tbd-components-navigation/components/QuicklinksGridCardGroup/view/QuicklinksGridCardGroup.web", () =>
  jest.fn(() => <quicklinks-grid-card-group-mock />),
);

jest.mock("../MarketBetCardGroup", () => jest.fn(() => <connected-market-bet-card-group-mock />));
jest.mock(
  "../MarketBetCardGroup/MarketBetCardGroup.web",
  jest.fn(() => <market-bet-card-group-mock />),
);

jest.mock("../MarketBetSelectionCardGroup", () => jest.fn(() => <connected-market-bet-selection-card-group-mock />));
jest.mock(
  "../MarketBetSelectionCardGroup/MarketBetSelectionCardGroup.web",
  jest.fn(() => <market-bet-selection-card-group-mock />),
);

jest.mock("../MarketBetExpandableCardGroup", () => jest.fn(() => <connected-market-bet-expandable-card-group-mock />));
jest.mock(
  "../MarketBetExpandableCardGroup/MarketBetExpandableCardGroup.web",
  jest.fn(() => <market-bet-expandable-card-group-mock />),
);

jest.mock("../Card", () => jest.fn(() => <connected-card-mock />));
jest.mock(
  "../Card/Card.web",
  jest.fn(() => <card-mock />),
);

jest.mock("../ErrorBoundary/ErrorBoundary", () => ({
  ErrorBoundary: jest.fn(({ children }) => <>{children}</>),
}));

function renderViewZone({ title = "Fake Title", items = [] }) {
  return render(<ViewZone title={title} items={items} />);
}
describe("View Zone", () => {
  beforeEach(jest.clearAllMocks);

  describe("when there are no items", () => {
    it("should not render ViewZone", () => {
      const { container } = renderViewZone({ items: [] });
      const viewZone = container.querySelector(TEST_ID);

      expect(viewZone).toBeNull();
    });
  });

  describe("when there are items", () => {
    it("should render title", () => {
      const { container } = renderViewZone({ items: [{ urn: "some:urn", typename: "SomeType" }] });
      const title = container.querySelector(TITLE);

      expect(title.textContent).toEqual("Fake Title");
    });

    describe.each([
      ["SwimlaneCardGroup", ConnectedSwimlaneCardGroup, "swimlane-card-group-placeholder-mock"],
      ["SwimlaneIndexedCardGroup", ConnectedSwimlaneCardGroup, "swimlane-card-group-placeholder-mock"],
      ["RacingSwimlaneCardGroup", ConnectedRacingSwimlaneCardGroup, "racing-swimlane-card-group-placeholder-mock"],
      ["PopularSwimlaneCardGroup", ConnectedPopularSwimlaneCardGroup, "popular-swimlane-card-group-placeholder-mock"],
      ["GamingCardGroup", ConnectedGamingCardGroup, "swimlane-card-group-placeholder-mock"],
      ["SportRibbonCardGroup", ConnectedSportRibbonCardGroup, "sport-ribbon-card-group-placeholder-mock"],
      ["SegmentedCardGroup", ConnectedSegmentedCardGroup, "segmented-card-group-placeholder-mock"],
      ["PebbleCardGroup", ConnectedPebbleCardGroup, "pebble-card-group-placeholder-mock"],
      ["ExpandableCardGroup", ConnectedExpandableCardGroup, undefined],
      ["FilteredCouponCardGroup", ConnectedFilteredCouponCardGroup, undefined],
      ["RacesByTimeRangeCardGroup", ConnectedFilteredCouponCardGroup, undefined],
      ["RacesByTimeRangeCardGroup", ConnectedFilteredCouponCardGroup, undefined],
      ["SelectableItemsCardGroup", ConnectedSelectableItemsCardGroup, "pebble-card-group-placeholder-mock"],
      ["BetCardGroup", ConnectedBetCardGroup, undefined],
      ["SportsbookBetLegCardGroup", ConnectedSportsbookBetLegCardGroup, undefined],
      ["SportsbookExpandableLegCardGroup", ConnectedSportsbookExpandableLegCardGroup, undefined],
      ["MarketBetCardGroup", ConnectedMarketBetCardGroup, undefined],
      ["MarketBetSelectionCardGroup", ConnectedMarketBetSelectionCardGroup, undefined],
      ["MarketBetExpandableCardGroup", ConnectedMarketBetExpandableCardGroup, undefined],
    ])("when an item has the type `%s`", (typename, connected, placeholder) => {
      it(`should render the connected ${typename} component`, async () => {
        const { container } = renderViewZone({ items: [{ urn: "some:urn", typename }] });

        await waitFor(() => container.querySelector(CHILDREN));

        expect(connected).toHaveBeenCalledWith(
          { urn: "some:urn", component: expect.any(Object), placeholder, visible: true },
          undefined,
        );
      });
    });

    describe("migrated view items", () => {
      describe("when the view item is of type QuicklinksGridCardGroup", () => {
        it("should lazy load and render the connected QuicklinksGridCardGroup component", async () => {
          renderViewZone({ items: [{ urn: "urn", typename: "QuicklinksGridCardGroup" }] });

          await waitFor(() => {
            expect(QuicklinksGridCardGroup).toHaveBeenCalledWith({ urn: "urn", visible: true }, undefined);
          });

          expect(QuicklinksGridCardGroup).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("when the typename doesn't match any card group", () => {
      it("should render the connected card", async () => {
        const { container } = renderViewZone({ items: [{ urn: "some:urn", typename: "AlienCard" }] });

        await waitFor(() => container.querySelector(CHILDREN));

        expect(ConnectedCard).toHaveBeenCalledWith(
          { urn: "some:urn", component: expect.any(Object), typename: "AlienCard", visible: true },
          undefined,
        );
      });
    });
  });
});
