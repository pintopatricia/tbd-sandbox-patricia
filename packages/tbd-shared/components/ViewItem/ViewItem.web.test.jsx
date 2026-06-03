import { render, waitFor } from "@testing-library/react";
import "jest-dom/extend-expect";
import QuicklinksGridCardGroup from "@ppb/tbd-components-navigation/components/QuicklinksGridCardGroup/view/QuicklinksGridCardGroup.web";
import { ViewItem } from "./ViewItem.web";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import ConnectedSwimlaneCardGroup from "../SwimlaneCardGroup";
import SwimlaneCardGroup from "../SwimlaneCardGroup/SwimlaneCardGroup.web";
import SwimlaneCardGroupPlaceholder from "../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.web";
import ConnectedRacingSwimlaneCardGroup from "../RacingSwimlaneCardGroup";
import RacingSwimlaneCardGroup from "../RacingSwimlaneCardGroup/RacingSwimlaneCardGroup.web";
import RacingSwimlaneCardGroupPlaceholder from "../RacingSwimlaneCardGroup/RacingSwimlaneCardGroupPlaceholder.web";
import ConnectedPopularSwimlaneCardGroup from "../PopularSwimlaneCardGroup";
import PopularSwimlaneCardGroup from "../PopularSwimlaneCardGroup/PopularSwimlaneCardGroup.web";
import PopularSwimlaneCardGroupPlaceholder from "../PopularSwimlaneCardGroup/PopularSwimlaneCardGroupPlaceholder.web";
import FilteredCouponCardGroupPlaceholder from "../FilteredCouponCardGroup/FilteredCouponCardGroupPlaceholder.web";
import PebbleCardGroupPlaceholder from "../PebbleCardGroup/PebbleCardGroupPlaceholder.web";
import SportRibbonCardGroupPlaceholder from "../SportRibbonCardGroup/SportRibbonCardGroupPlaceholder.web";
import NavigationTabsListPlaceholder from "../NavigationTabsList/NavigationTabsListPlaceholder.web";
import GamingSearchZonePlaceholder from "../GamingSearchZone/GamingSearchZonePlaceholder.web";
import ConnectedPebbleCardGroup from "../PebbleCardGroup";
import ConnectedFilteredCouponCardGroup from "../FilteredCouponCardGroup";
import ConnectedNavigationTabsList from "../NavigationTabsList";
import ConnectedSelectableItemsCardGroup from "../SelectableItemsCardGroup";
import ConnectedSportRibbonCardGroup from "../SportRibbonCardGroup";
import ConnectedViewZone from "../ViewZone";
import ConnectedGamingSearchZone from "../GamingSearchZone";
import ConnectedGamingCardGroup from "../GamingCardGroup";
import StatsContentCardGroup from "../StatsContentCardGroup/view/StatsContentCardGroup.web";
import StatsPebbleCardGroup from "../StatsPebbleCardGroup/view/StatsPebbleCardGroup.web";
import ConnectedMarketBlurb from "../MarketBlurb";
import MarketBlurb from "../MarketBlurb/MarketBlurb.web";

jest.mock("../Card", () => jest.fn(() => <card-item />));
jest.mock("../Card/Card.web", () => jest.fn(() => <card-web-item />));
jest.mock("../GamingCardGroup", () => jest.fn(() => <connected-gaming-card-group data-testid="gaming-card-group" />));
jest.mock("../GamingCardGroup/GamingCardGroup.web", () => jest.fn(() => <gaming-card-group />));
jest.mock("../SwimlaneCardGroup", () =>
  jest.fn(() => <connected-swimlane-cardgroup data-testid="swimlane-card-group" />),
);
jest.mock("../SwimlaneCardGroup/SwimlaneCardGroup.web", () => jest.fn(() => <swimlane-cardgroup />));
jest.mock("../RacingSwimlaneCardGroup", () =>
  jest.fn(() => <connected-racing-swimlane-cardgroup data-testid="racing-swimlane-card-group" />),
);
jest.mock("../RacingSwimlaneCardGroup/RacingSwimlaneCardGroup.web", () =>
  jest.fn(() => <racing-swimlane-card-group />),
);
jest.mock("../RacingSwimlaneCardGroup/RacingSwimlaneCardGroupPlaceholder.web", () =>
  jest.fn(() => <racing-swimlane-card-group-placeholder />),
);
jest.mock("../PopularSwimlaneCardGroup", () =>
  jest.fn(() => <connected-popular-swimlane-cardgroup data-testid="popular-swimlane-card-group" />),
);
jest.mock("../PopularSwimlaneCardGroup/PopularSwimlaneCardGroup.web", () =>
  jest.fn(() => <popular-swimlane-card-group />),
);
jest.mock("../PopularSwimlaneCardGroup/PopularSwimlaneCardGroupPlaceholder.web", () =>
  jest.fn(() => <popular-swimlane-card-group-placeholder />),
);
jest.mock("../PebbleCardGroup", () =>
  jest.fn((props) => <connected-pebble-card-group-mock {...props} data-testid="pebble-card-group" />),
);
jest.mock("../PebbleCardGroup/PebbleCardGroup.web", () => jest.fn(() => <pebble-card-group-mock />));

jest.mock("../StatsPebbleCardGroup/view/StatsPebbleCardGroup.web", () =>
  jest.fn(() => <stats-pebble-card-group-mock data-testid="stats-pebble-card-group" />),
);

jest.mock("../StatsContentCardGroup/view/StatsContentCardGroup.web", () =>
  jest.fn(() => <stats-content-card-group-mock data-testid="stats-content-card-group" />),
);

jest.mock("../FilteredCouponCardGroup", () =>
  jest.fn(() => <connected-filtered-coupon-card-group data-testid="filtered-coupon-card-group" />),
);
jest.mock("../FilteredCouponCardGroup/FilteredCouponCardGroup.web", () =>
  jest.fn(() => <filtered-coupon-card-group />),
);
jest.mock("../NavigationTabsList", () =>
  jest.fn(() => <connected-navigation-tabs-list data-testid="navigation-tabs-list" />),
);
jest.mock("../NavigationTabsList/NavigationTabsList.web", () => jest.fn(() => <navigation-tabs-list />));
jest.mock("../SelectableItemsCardGroup", () =>
  jest.fn(() => <connected-selectableitems-card-group-mock data-testid="timeline-card-group" />),
);
jest.mock("../SelectableItemsCardGroup/SelectableItemsCardGroup.web", () =>
  jest.fn(() => <selectableitems-card-group-mock />),
);
jest.mock("@ppb/tbd-components-navigation/components/QuicklinksGridCardGroup/view/QuicklinksGridCardGroup.web", () =>
  jest.fn(() => <quicklinks-grid-card-group />),
);
jest.mock("../SportRibbonCardGroup", () =>
  jest.fn(() => <connected-sport-ribbon-card-group data-testid="sport-ribbon-card-group" />),
);
jest.mock("../SportRibbonCardGroup/SportRibbonCardGroup.web", () => jest.fn(() => <sport-ribbon-card-group />));
jest.mock("../ViewZone", () => jest.fn(() => <connected-view-zone data-testid="view-zone" />));
jest.mock("../ViewZone/ViewZone.web", () => jest.fn(() => <view-zone />));

jest.mock("../GamingSearchZone", () =>
  jest.fn(() => <connected-gaming-search-zone data-testid="gaming-search-zone" />),
);
jest.mock("../GamingSearchZone/GamingSearchZone.web", () => jest.fn(() => <gaming-search-zone />));

jest.mock("../GamingCardGroup", () => jest.fn(() => <connected-gaming-card-group data-testid="gaming-card-group" />));
jest.mock("../GamingCardGroup/GamingCardGroup.web", () => jest.fn(() => <gaming-card-group />));

jest.mock("../SwimlaneCardGroup", () =>
  jest.fn(() => <connected-swimlane-card-group data-testid="swimlane-card-group" />),
);
jest.mock("../SwimlaneCardGroup/SwimlaneCardGroup.web", () => jest.fn(() => <swimlane-card-group />));

jest.mock("../MarketBlurb", () => jest.fn(() => <connected-market-blurb data-testid="market-blurb" />));
jest.mock("../MarketBlurb/MarketBlurb.web", () => jest.fn(() => <market-blurb />));

jest.mock("../ErrorBoundary/ErrorBoundary", () => ({
  ErrorBoundary: jest.fn(({ children }) => <>{children}</>),
}));

function renderViewItem(typename, visible = true, theme) {
  return render(<ViewItem urn="urn" typename={typename} visible={visible} theme={theme} />);
}

describe("ViewItem", () => {
  beforeEach(jest.clearAllMocks);

  describe("not lazily imported", () => {
    describe.each`
      typename                      | connected                            | placeholder                            | component                   | variant
      ${"SwimlaneIndexedCardGroup"} | ${ConnectedSwimlaneCardGroup}        | ${SwimlaneCardGroupPlaceholder}        | ${SwimlaneCardGroup}        | ${undefined}
      ${"SwimlaneCardGroup"}        | ${ConnectedSwimlaneCardGroup}        | ${SwimlaneCardGroupPlaceholder}        | ${SwimlaneCardGroup}        | ${undefined}
      ${"RacingSwimlaneCardGroup"}  | ${ConnectedRacingSwimlaneCardGroup}  | ${RacingSwimlaneCardGroupPlaceholder}  | ${RacingSwimlaneCardGroup}  | ${undefined}
      ${"PopularSwimlaneCardGroup"} | ${ConnectedPopularSwimlaneCardGroup} | ${PopularSwimlaneCardGroupPlaceholder} | ${PopularSwimlaneCardGroup} | ${undefined}
      ${"BlurbCard"}                | ${ConnectedMarketBlurb}              | ${undefined}                           | ${MarketBlurb}              | ${"promotion"}
    `("when the view items is $typename", ({ typename, connected, placeholder, component, variant }) => {
      it(`should render the connected ${typename} component`, async () => {
        renderViewItem(typename, false);
        expect(connected).toHaveBeenCalledWith(
          {
            urn: "urn",
            component,
            variant,
            ...(typename !== "BlurbCard" && { visible: false }),
            ...(typename === "BlurbCard" && { variant: "general" }),
            ...(typename === "BlurbCard" && { marketPromoVariant: "info" }),
            placeholder,
          },
          undefined,
        );
      });
    });
  });

  describe("lazily imported", () => {
    describe.each`
      typename                       | connected                            | placeholder                           | testId
      ${"PebbleCardGroup"}           | ${ConnectedPebbleCardGroup}          | ${PebbleCardGroupPlaceholder}         | ${"pebble-card-group"}
      ${"FilteredCouponCardGroup"}   | ${ConnectedFilteredCouponCardGroup}  | ${FilteredCouponCardGroupPlaceholder} | ${"filtered-coupon-card-group"}
      ${"FutureRacingCardGroup"}     | ${ConnectedFilteredCouponCardGroup}  | ${FilteredCouponCardGroupPlaceholder} | ${"filtered-coupon-card-group"}
      ${"RacesByTimeRangeCardGroup"} | ${ConnectedFilteredCouponCardGroup}  | ${FilteredCouponCardGroupPlaceholder} | ${"filtered-coupon-card-group"}
      ${"SelectableItemsCardGroup"}  | ${ConnectedSelectableItemsCardGroup} | ${PebbleCardGroupPlaceholder}         | ${"timeline-card-group"}
      ${"NavigationTabsList"}        | ${ConnectedNavigationTabsList}       | ${NavigationTabsListPlaceholder}      | ${"navigation-tabs-list"}
      ${"SportRibbonCardGroup"}      | ${ConnectedSportRibbonCardGroup}     | ${SportRibbonCardGroupPlaceholder}    | ${"sport-ribbon-card-group"}
      ${"ViewZone"}                  | ${ConnectedViewZone}                 | ${SwimlaneCardGroupPlaceholder}       | ${"view-zone"}
      ${"SearchZone"}                | ${ConnectedGamingSearchZone}         | ${GamingSearchZonePlaceholder}        | ${"gaming-search-zone"}
      ${"GamingCardGroup"}           | ${ConnectedGamingCardGroup}          | ${SwimlaneCardGroupPlaceholder}       | ${"gaming-card-group"}
    `("when the view item is $typename", ({ typename, connected, placeholder, testId }) => {
      it(`should render the connected ${typename} component`, async () => {
        const { getByTestId } = renderViewItem(typename);
        await waitFor(() => getByTestId(testId));
        expect(connected).toHaveBeenCalledWith(
          { urn: "urn", component: expect.any(Object), placeholder, visible: true },
          undefined,
        );
        expect(connected).toHaveBeenCalledTimes(1);
      });
    });

    describe.each`
      typename                   | component                | testId
      ${"StatsPebbleCardGroup"}  | ${StatsPebbleCardGroup}  | ${"stats-pebble-card-group"}
      ${"StatsContentCardGroup"} | ${StatsContentCardGroup} | ${"stats-content-card-group"}
    `("when the view item is migrated and is $typename", ({ typename, component, testId }) => {
      it(`should render the ${typename} component`, async () => {
        const { getByTestId } = renderViewItem(typename);

        await waitFor(() => getByTestId(testId));

        expect(component).toHaveBeenCalledWith({ urn: "urn", visible: true }, undefined);
        expect(component).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("migrated view items", () => {
    describe("when the view item is of type QuicklinksGridCardGroup", () => {
      it("should lazy load and render the connected QuicklinksGridCardGroup component", async () => {
        renderViewItem("QuicklinksGridCardGroup");

        await waitFor(() => {
          expect(QuicklinksGridCardGroup).toHaveBeenCalledWith({ urn: "urn", visible: true }, undefined);
        });

        expect(QuicklinksGridCardGroup).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when the view item is of any other type", () => {
    it("must render the connected Card component", () => {
      renderViewItem("Other", true, "HIGHLIGHTED");
      expect(ConnectedCard).toHaveBeenCalledWith(
        { urn: "urn", component: Card, typename: "Other", visible: true, theme: "HIGHLIGHTED" },
        undefined,
      );
    });
  });
});
