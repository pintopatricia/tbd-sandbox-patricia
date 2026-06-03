import { render, act } from "@testing-library/react";
import "jest-dom/extend-expect";
import { TooltipProvider } from "../../../ObbSquadVsSquadCard/snowflakes/PlayersTooltip/TooltipContext";
import { ObbCardsSwimlaneLayout } from "./ObbCardsSwimlaneLayout.web";
import ConnectedObbCard from "../../../ObbCard";

jest.mock("../../../ObbCard", () => jest.fn(() => <connected-obb-card data-testid="connected-obb-card" />));
jest.mock("../../../ObbCard/ObbCard.web", () => jest.fn(() => <obb-card-mock data-testid="obb-card" />));
jest.mock("@ppb/the-wall-web", () => ({
  ScrollableSwimlane: jest.fn(({ children }) => <div data-testid="scrollable-swimlane">{children}</div>),
}));

const renderWithContext = (children) => render(<TooltipProvider>{children}</TooltipProvider>);

describe("ObbCardsSwimlaneLayout", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should not render the title when the value is not defined", () => {
    const { queryByRole } = renderWithContext(<ObbCardsSwimlaneLayout layout={{ title: undefined, items: [] }} />);
    expect(queryByRole("heading")).not.toBeInTheDocument();
  });

  it("should render the items with layoutUrn and itemIndex", async () => {
    const mockItems = [
      { urn: "urn1", typename: "CardA" },
      { urn: "urn2", typename: "CardB" },
    ];
    const layoutUrn = "layoutUrn";
    await act(async () => {
      renderWithContext(<ObbCardsSwimlaneLayout layout={{ items: mockItems, urn: layoutUrn }} />);
    });
    expect(ConnectedObbCard).toHaveBeenCalledTimes(mockItems.length);
    expect(ConnectedObbCard).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        urn: "urn1",
        typename: "CardA",
        layoutUrn,
        itemIndex: 0,
      }),
      undefined,
    );
    expect(ConnectedObbCard).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        urn: "urn2",
        typename: "CardB",
        layoutUrn,
        itemIndex: 1,
      }),
      undefined,
    );
  });
});
