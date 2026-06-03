import { render } from "@testing-library/react-native";
import ConnectedCardGroup from "../CardGroup";
import CardGroup from "../CardGroup/CardGroup.native";
import ConnectedNavigationTabsList from "../NavigationTabsList";
import NavigationTabsList from "../NavigationTabsList/NavigationTabsList.native";
import ConnectedViewZone from "../ViewZone";
import ViewZone from "../ViewZone/ViewZone.native";
import ConnectedSegmentedCardGroup from "../SegmentedCardGroup";
import SegmentedCardGroup from "../SegmentedCardGroup/SegmentedCardGroup.native";
import SegmentedCardGroupPlaceholder from "../SegmentedCardGroup/SegmentedCardGroupPlaceholder.native";
import ConnectedGamingSearchZone from "../GamingSearchZone";
import GamingSearchZone from "../GamingSearchZone/GamingSearchZone.native";
import NavigationTabsListPlaceholder from "../NavigationTabsList/NavigationTabsListPlaceholder.native";
import { ViewItem } from "./ViewItem.native";
import StatsContentCardGroup from "../StatsContentCardGroup/view/StatsContentCardGroup.native";
import StatsPebbleCardGroup from "../StatsPebbleCardGroup/view/StatsPebbleCardGroup.native";
import IncidentsCard from "@ppb/tbd-components-rich-data/components/IncidentsCard/view/IncidentsCard.native";
import ConnectedMarketBlurb from "../MarketBlurb";
import MarketBlurb from "../MarketBlurb/MarketBlurb.native";

jest.mock("../NavigationTabsList/NavigationTabsListPlaceholder.native", () => ({
  NavigationTabsListPlaceholder: "some-placeholder",
}));
jest.mock("../CardGroup", () => jest.fn(() => <card-group />));
jest.mock("../CardGroup/CardGroup.native", () => jest.fn(() => <card-group-component />));
jest.mock("../NavigationTabsList", () => jest.fn(() => <navigation-tabs />));
jest.mock("../NavigationTabsList/NavigationTabsList.native", () => jest.fn(() => <navigation-tabs-component />));
jest.mock("../ViewZone", () => jest.fn(() => <viewzone />));
jest.mock("../ViewZone/ViewZone.native", () => jest.fn(() => <viewzone-component />));
jest.mock("../SegmentedCardGroup", () => jest.fn(() => <segmented-card-group />));
jest.mock("../SegmentedCardGroup/SegmentedCardGroup.native", () => jest.fn(() => <segmented-card-group-component />));
jest.mock("../SegmentedCardGroup/SegmentedCardGroupPlaceholder.native", () => "some-placeholder");
jest.mock("../StatsPebbleCardGroup/view/StatsPebbleCardGroup.native", () =>
  jest.fn(() => <stats-pebble-card-group-mock />),
);
jest.mock("../GamingSearchZone", () => jest.fn(() => <gaming-search-zone />));
jest.mock("../GamingSearchZone/GamingSearchZone.native", () => jest.fn(() => <gaming-search-zone-component />));

jest.mock("../GamingPrizeMachineCardWithRefetch/GamingPrizeMachineCardWithRefetch.native", () =>
  jest.fn(() => <gaming-prize-machine-card />),
);

jest.mock("../StatsContentCardGroup/view/StatsContentCardGroup.native", () =>
  jest.fn(() => <stats-content-card-group-mock />),
);

jest.mock("@ppb/tbd-components-rich-data/components/IncidentsCard/view/IncidentsCard.native", () =>
  jest.fn(() => <incidents-card-mock />),
);

jest.mock("../MarketBlurb", () => jest.fn(() => <market-blurb />));
jest.mock("../MarketBlurb/MarketBlurb.native", () => jest.fn(() => <market-blurb-component />));

jest.mock("../ErrorBoundary/ErrorBoundary", () => ({
  ErrorBoundary: jest.fn(({ children }) => <>{children}</>),
}));

function renderViewItem(typename, theme, visible = true) {
  return render(<ViewItem urn="urn" typename={typename} theme={theme} visible={visible} />);
}
describe("View Item", () => {
  beforeEach(jest.clearAllMocks);
  describe("when the typename matches a whitelisted connected component", () => {
    describe.each`
      typename                | connected                      | component             | placeholder
      ${"NavigationTabsList"} | ${ConnectedNavigationTabsList} | ${NavigationTabsList} | ${NavigationTabsListPlaceholder}
      ${"ViewZone"}           | ${ConnectedViewZone}           | ${ViewZone}           | ${undefined}
      ${"SegmentedCardGroup"} | ${ConnectedSegmentedCardGroup} | ${SegmentedCardGroup} | ${SegmentedCardGroupPlaceholder}
      ${"SearchZone"}         | ${ConnectedGamingSearchZone}   | ${GamingSearchZone}   | ${undefined}
      ${"BlurbCard"}          | ${ConnectedMarketBlurb}        | ${MarketBlurb}        | ${undefined}
    `("when the typename is $typename", ({ typename, connected, component, placeholder }) => {
      it("must render the connected component", () => {
        renderViewItem(typename);

        const expectedProps = {
          urn: "urn",
          component,
          ...(placeholder && { placeholder }),
          ...(typename === "BlurbCard" ? { variant: "general", marketPromoVariant: "info" } : { visible: true }),
        };

        expect(connected).toHaveBeenCalledWith(expectedProps, undefined);
        expect(connected).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe.each`
    typename                   | component                | expectVisible
    ${"StatsPebbleCardGroup"}  | ${StatsPebbleCardGroup}  | ${true}
    ${"StatsContentCardGroup"} | ${StatsContentCardGroup} | ${true}
    ${"IncidentsCard"}         | ${IncidentsCard}         | ${false}
  `("when the view item is migrated to apollo and is $typename", ({ typename, component, expectVisible }) => {
    it(`should render the ${typename} component`, async () => {
      renderViewItem(typename);

      const expectedProps = expectVisible ? { urn: "urn", visible: true } : { urn: "urn" };
      expect(component).toHaveBeenCalledWith(expectedProps, undefined);
      expect(component).toHaveBeenCalledTimes(1);
    });
  });

  describe("when the typename doesn't match any view item", () => {
    it("should render the connected card group", () => {
      renderViewItem("SomeCardGroup", "HIGHLIGHTED");
      expect(ConnectedCardGroup).toHaveBeenCalledWith(
        {
          urn: "urn",
          typename: "SomeCardGroup",
          component: CardGroup,
          visible: true,
          theme: "HIGHLIGHTED",
        },
        undefined,
      );
    });
  });
});
