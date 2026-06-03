import { render } from "@testing-library/react";
import ObbCardsLayout from "./ObbCardsLayout.web";
import { ObbCardsStackedLayout } from "./snowflakes/ObbStacked/ObbCardsStackedLayout.web";
import { ObbCardsSwimlaneLayout } from "./snowflakes/ObbSwimlane/ObbCardsSwimlaneLayout.web";

jest.mock("./snowflakes/ObbStacked/ObbCardsStackedLayout.web", () => ({
  ObbCardsStackedLayout: jest.fn(() => <div data-testid="obb-cards-stacked-layout" />),
}));

jest.mock("./snowflakes/ObbSwimlane/ObbCardsSwimlaneLayout.web", () => ({
  ObbCardsSwimlaneLayout: jest.fn(() => <div data-testid="obb-cards-swimlane-layout" />),
}));

describe("ObbCardsLayout", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders ObbCardsStackedLayout when typename is 'ObbCardsStackedLayout'", () => {
    const mockLayout = { typename: "ObbCardsStackedLayout" };
    render(<ObbCardsLayout layout={mockLayout} />);
    expect(ObbCardsStackedLayout).toHaveBeenCalled();
  });

  it("renders ObbCardsSwimlaneLayout when typename is 'ObbCardsSwimlaneLayout'", () => {
    const mockLayout = { typename: "ObbCardsSwimlaneLayout" };
    render(<ObbCardsLayout layout={mockLayout} />);
    expect(ObbCardsSwimlaneLayout).toHaveBeenCalled();
  });

  it("does not render anything for an unsupported typename", () => {
    const mockLayout = { typename: "UnsupportedLayout" };
    const { container } = render(<ObbCardsLayout layout={mockLayout} />);
    expect(container.firstChild).toBeNull();
  });
});
