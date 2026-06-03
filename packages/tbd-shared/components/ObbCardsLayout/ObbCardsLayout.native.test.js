import { render } from "@testing-library/react-native";
import { ObbCardsLayout } from "./ObbCardsLayout.native";
import { ObbCardsStackedLayout } from "./snowflakes/ObbStacked/ObbCardsStackedLayout.native";
import { ObbCardsSwimlaneLayout } from "./snowflakes/ObbSwimlane/ObbCardsSwimlaneLayout.native";

jest.mock("./snowflakes/ObbStacked/ObbCardsStackedLayout.native", () => ({
  ObbCardsStackedLayout: jest.fn(() => <obb-cards-stack-layout-mock data-testid="obb-cards-stacked-layout" />),
}));

jest.mock("./snowflakes/ObbSwimlane/ObbCardsSwimlaneLayout.native", () => ({
  ObbCardsSwimlaneLayout: jest.fn(() => <obb-cards-swimlane-layout-mock data-testid="obb-cards-swimlane-layout" />),
}));

describe("ObbCardsLayout", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders ObbCardsStackedLayout when typename is 'ObbCardsStackedLayout'", () => {
    const mockLayout = { typename: "ObbCardsStackedLayout" };

    render(<ObbCardsLayout typename="ObbCardsStackedLayout" layout={mockLayout} />);

    expect(ObbCardsStackedLayout).toHaveBeenCalled();
  });

  it("renders ObbCardsSwimlaneLayout when typename is 'ObbCardsSwimlaneLayout'", () => {
    const mockLayout = { typename: "ObbCardsSwimlaneLayout" };
    render(<ObbCardsLayout typename="ObbCardsSwimlaneLayout" layout={mockLayout} />);
    expect(ObbCardsSwimlaneLayout).toHaveBeenCalled();
  });

  it("does not render anything for an unsupported typename", () => {
    const mockLayout = { typename: "UnsupportedLayout" };

    const { root } = render(<ObbCardsLayout typename="UnsupportedLayout" layout={mockLayout} />);

    expect(root).toBeUndefined();
  });
});
