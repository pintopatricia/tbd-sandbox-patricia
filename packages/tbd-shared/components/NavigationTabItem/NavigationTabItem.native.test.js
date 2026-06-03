import { render } from "@testing-library/react-native";

import ConnectedCardGroup from "../CardGroup";
import ConnectedViewZone from "../ViewZone";
import ConnectedSegmentedCardGroup from "../SegmentedCardGroup";
import ConnectedMarketBlurb from "../MarketBlurb";

import SegmentedCardGroupPlaceholder from "../SegmentedCardGroup/SegmentedCardGroupPlaceholder.native";
import SelectableItemsCardGroupPlaceholder from "../SelectableItemsCardGroup/SelectableItemsCardGroupPlaceholder.native";

import { NavigationTabItem } from "./NavigationTabItem.native";

jest.mock("@ppb/the-wall-native", () => ({
  withStyle: jest.fn(() => "some-placeholder"),
}));

jest.mock("../CardGroup", () => jest.fn(() => <mock testID="card-group" />));
jest.mock("../ViewZone", () => jest.fn(() => <mock testID="view-zone" />));
jest.mock("../SegmentedCardGroup", () => jest.fn(() => <mock testID="segmented-cardgroup" />));
jest.mock("../MarketBlurb", () => jest.fn(() => <mock testID="market-blurb" />));

jest.mock("../CardGroup/CardGroup.native", () => "card-group-component");
jest.mock("../ViewZone/ViewZone.native", () => "view-zone-component");
jest.mock("../SegmentedCardGroup/SegmentedCardGroup.native", () => "segmented-cardgroup-component");
jest.mock("../MarketBlurb/MarketBlurb.native", () => "market-blurb-component");

jest.mock("../SegmentedCardGroup/SegmentedCardGroupPlaceholder.native", () =>
  jest.fn(() => <mock testID="segmented-cardgroup-placeholder" />),
);
jest.mock("../SelectableItemsCardGroup/SelectableItemsCardGroupPlaceholder.native", () =>
  jest.fn(() => <mock testID="selectable-items-cardgroup-placeholder" />),
);

jest.mock("../ErrorBoundary/ErrorBoundary", () => ({
  ErrorBoundary: jest.fn(({ children }) => <>{children}</>),
}));

function renderNavigationTabItem(typename) {
  return render(<NavigationTabItem urn="urn" typename={typename} />);
}

describe("NavigationTabItem", () => {
  const testCases = [
    {
      typename: "ViewZone",
      Component: ConnectedViewZone,
      componentProp: "view-zone-component",
      testId: "view-zone",
      placeholder: undefined,
      visible: undefined,
    },
    {
      typename: "SegmentedCardGroup",
      Component: ConnectedSegmentedCardGroup,
      componentProp: "segmented-cardgroup-component",
      testId: "segmented-cardgroup",
      placeholder: SegmentedCardGroupPlaceholder,
      visible: undefined,
    },
    {
      typename: "BlurbCard",
      Component: ConnectedMarketBlurb,
      componentProp: "market-blurb-component",
      testId: "market-blurb",
      placeholder: undefined,
      variant: "general",
      marketPromoVariant: "info",
    },
  ];

  testCases.forEach(({ typename, Component, componentProp, testId, placeholder, variant, visible }) => {
    describe(`when rendering a navigation tab item of type ${typename}`, () => {
      it(`should render the connected ${typename} component`, async () => {
        const { queryByTestId } = render(<NavigationTabItem urn="urn" typename={typename} />);

        const result = await queryByTestId(testId);

        expect(result).toBeDefined();
        expect(Component).toHaveBeenCalledWith(
          {
            urn: "urn",
            component: componentProp,
            placeholder,
            ...(variant ? { variant } : { visible }),
            ...(typename === "BlurbCard" && { marketPromoVariant: "info" }),
          },
          undefined,
        );
      });
    });
  });

  describe("When the typename matches SelectableItemsCardGroup", () => {
    it("should render the Connected Card Group", async () => {
      const { queryByTestId } = render(<NavigationTabItem urn="urn" typename="SelectableItemsCardGroup" />);
      const result = await queryByTestId("card-group");

      expect(result).toBeDefined();
      expect(ConnectedCardGroup).toHaveBeenCalledWith(
        {
          urn: "urn",
          typename: "SelectableItemsCardGroup",
          component: "card-group-component",
          placeholder: SelectableItemsCardGroupPlaceholder,
          visible: undefined,
        },
        undefined,
      );
    });
  });

  describe("when the typename doesn't match any connected components", () => {
    it("should render the connected card group", () => {
      const { queryByTestId } = renderNavigationTabItem("OtherCardGroup");

      const result = queryByTestId("card-group-component");

      expect(result).toBeDefined();
      expect(ConnectedCardGroup).toHaveBeenCalledWith(
        { urn: "urn", typename: "OtherCardGroup", component: "card-group-component" },
        undefined,
      );
    });
  });
});
