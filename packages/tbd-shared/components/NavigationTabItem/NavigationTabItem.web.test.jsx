import { render, waitFor } from "@testing-library/react";
import "jest-dom/extend-expect";
import QuicklinksGridCardGroup from "@ppb/tbd-components-navigation/components/QuicklinksGridCardGroup/view/QuicklinksGridCardGroup.web";
import { NavigationTabItem } from "./NavigationTabItem.web";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import ConnectedSwimlaneCardGroup from "../SwimlaneCardGroup";
import SwimlaneCardGroup from "../SwimlaneCardGroup/SwimlaneCardGroup.web";
import ConnectedRacingSwimlaneCardGroup from "../RacingSwimlaneCardGroup";
import RacingSwimlaneCardGroup from "../RacingSwimlaneCardGroup/RacingSwimlaneCardGroup.web";
import GamingCardGroup from "../GamingCardGroup/GamingCardGroup.web";
import ConnectedGamingCardGroup from "../GamingCardGroup";
import ConnectedPebbleCardGroup from "../PebbleCardGroup";
import ConnectedSelectableItemsCardGroup from "../SelectableItemsCardGroup";
import ConnectedViewZone from "../ViewZone";
import ConnectedMarketBlurb from "../MarketBlurb";
import MarketBlurb from "../MarketBlurb/MarketBlurb.web";

jest.mock("../PebbleCardGroup/PebbleCardGroupPlaceholder.web", () => "pebble-card-group-placeholder");
jest.mock(
  "../SelectableItemsCardGroup/SelectableItemsCardGroupPlaceholder.web",
  () => "selectable-card-group-placeholder",
);
jest.mock("../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.web", () => "swimlane-card-group-placeholder");
jest.mock(
  "../RacingSwimlaneCardGroup/RacingSwimlaneCardGroupPlaceholder.web",
  () => "racing-swimlane-card-group-placeholder",
);
jest.mock("../SportRibbonCardGroup/SportRibbonCardGroupPlaceholder.web", () => "sport-ribbon-card-group-placeholder");

jest.mock("../Card", () => jest.fn(() => <card-item />));
jest.mock("../Card/Card.web", () => jest.fn(() => <card-web-item />));

jest.mock("../SwimlaneCardGroup", () => jest.fn(() => <connected-swimlane-card-group />));
jest.mock("../SwimlaneCardGroup/SwimlaneCardGroup.web", () => jest.fn(() => <swimlane-card-group />));
jest.mock("../RacingSwimlaneCardGroup", () => jest.fn(() => <connected-racing-swimlane-card-group />));
jest.mock("../RacingSwimlaneCardGroup/RacingSwimlaneCardGroup.web", () =>
  jest.fn(() => <racing-swimlane-card-group />),
);

jest.mock("../GamingCardGroup", () => jest.fn(() => <connected-gaming-card-group />));
jest.mock("../GamingCardGroup/GamingCardGroup.web", () => jest.fn(() => <gaming-card-group />));

jest.mock("../PebbleCardGroup", () => jest.fn(() => <connected-pebble-card-group />));
jest.mock("../PebbleCardGroup/PebbleCardGroup.web", () => jest.fn(() => <pebble-card-group />));

jest.mock("../FilteredCouponCardGroup", () => jest.fn(() => <connected-filtered-coupon-card-group />));
jest.mock("../FilteredCouponCardGroup/FilteredCouponCardGroup.web", () =>
  jest.fn(() => <filtered-coupon-card-group />),
);

jest.mock("../SelectableItemsCardGroup", () => jest.fn(() => <connected-selectableitems-card-group />));
jest.mock("../SelectableItemsCardGroup/SelectableItemsCardGroup.web", () =>
  jest.fn(() => <selectableitems-card-group />),
);

jest.mock("@ppb/tbd-components-navigation/components/QuicklinksGridCardGroup/view/QuicklinksGridCardGroup.web", () =>
  jest.fn(() => <quicklinks-grid-card-group />),
);

jest.mock("../SportRibbonCardGroup", () => jest.fn(() => <connected-sport-ribbon-card-group />));
jest.mock("../SportRibbonCardGroup/SportRibbonCardGroup.web", () => jest.fn(() => <sport-ribbon-card-group />));

jest.mock("../ViewZone", () => jest.fn(() => <connected-view-zone />));
jest.mock("../ViewZone/ViewZone.web", () => jest.fn(() => <view-zone />));

jest.mock("../MarketBlurb", () => jest.fn(() => <connected-market-blurb />));
jest.mock("../MarketBlurb/MarketBlurb.web", () => jest.fn(() => <market-blurb />));

jest.mock("../ErrorBoundary/ErrorBoundary", () => ({
  ErrorBoundary: jest.fn(({ children }) => <>{children}</>),
}));

function renderNavigationTabItem(typename) {
  return render(<NavigationTabItem urn="urn" typename={typename} />);
}

describe("NavigationTabItem", () => {
  beforeEach(jest.clearAllMocks);

  describe("when rendering the view component", () => {
    beforeEach(jest.clearAllMocks);

    describe("when the view item is of type SwimlaneCardGroup", () => {
      it("must render the connected SwimlaneCardGroup component", () => {
        renderNavigationTabItem("SwimlaneCardGroup");

        expect(ConnectedSwimlaneCardGroup).toHaveBeenCalledWith(
          { urn: "urn", component: SwimlaneCardGroup, placeholder: "swimlane-card-group-placeholder" },
          undefined,
        );
      });
    });

    describe("when the view item is of type RacingSwimlaneCardGroup", () => {
      it("must render the connected RacingSwimlaneCardGroup component", () => {
        renderNavigationTabItem("RacingSwimlaneCardGroup");

        expect(ConnectedRacingSwimlaneCardGroup).toHaveBeenCalledWith(
          {
            urn: "urn",
            component: RacingSwimlaneCardGroup,
            placeholder: "racing-swimlane-card-group-placeholder",
          },
          undefined,
        );
      });
    });

    describe("when the view item is of type GamingCardGroup", () => {
      it("must render the connected GamingCardGroup component", () => {
        renderNavigationTabItem("GamingCardGroup");

        expect(ConnectedGamingCardGroup).toHaveBeenCalledWith(
          { urn: "urn", component: GamingCardGroup, placeholder: "swimlane-card-group-placeholder" },
          undefined,
        );
      });
    });

    describe("when the view item is of type BlurbCard", () => {
      it("must render the connected MarketBlurb component", () => {
        renderNavigationTabItem("BlurbCard");

        expect(ConnectedMarketBlurb).toHaveBeenCalledWith(
          {
            urn: "urn",
            component: MarketBlurb,
            variant: "general",
            marketPromoVariant: "info",
          },
          undefined,
        );
      });
    });

    describe("when the view item is of type QuicklinksGridCardGroup", () => {
      it("should lazy load and render the connected QuicklinksGridCardGroup component", async () => {
        renderNavigationTabItem("QuicklinksGridCardGroup");

        await waitFor(() => {
          expect(QuicklinksGridCardGroup).toHaveBeenCalledWith({ urn: "urn" }, undefined);
        });

        expect(QuicklinksGridCardGroup).toHaveBeenCalledTimes(1);
      });
    });

    describe.each([
      ["PebbleCardGroup", ConnectedPebbleCardGroup, "pebble-card-group-placeholder"],
      ["SelectableItemsCardGroup", ConnectedSelectableItemsCardGroup, "selectable-card-group-placeholder"],
      ["ViewZone", ConnectedViewZone, "swimlane-card-group-placeholder"],
    ])("when the NavigationTabItem is of type %s", (typename, connected, placeholder) => {
      it(`should lazy load and render the connected ${typename} component`, async () => {
        renderNavigationTabItem(typename);

        await waitFor(() => {
          expect(connected).toHaveBeenCalledWith({ urn: "urn", component: expect.any(Object), placeholder }, undefined);
        });

        expect(connected).toHaveBeenCalledTimes(1);
      });
    });

    describe("when the view item is of any other type", () => {
      it("must render the connected Card component", () => {
        renderNavigationTabItem("Other");

        expect(ConnectedCard).toHaveBeenCalledWith({ urn: "urn", component: Card, typename: "Other" }, undefined);
      });
    });
  });
});
