import { render } from "@testing-library/react-native";
import { TooltipProvider } from "../../../ObbSquadVsSquadCard/snowflakes/PlayersTooltip/TooltipContext";
import ConnectedObbCard from "../../../ObbCard";

import { ObbCardsSwimlaneLayout } from "./ObbCardsSwimlaneLayout.native";

jest.useFakeTimers();

jest.mock("../../../ObbCard", () => jest.fn(() => <connected-obb-card data-testid="connected-obb-card" />));
jest.mock("../../../ObbCard/ObbCard.native", () => jest.fn(() => <obb-card-mock data-testid="obb-card" />));
jest.mock("@ppb/the-wall-native", () => ({
  ScrollableSwimlane: jest.fn(({ children }) => <div data-testid="scrollable-swimlane">{children}</div>),
  Text: jest.requireActual("react-native").Text,
}));

const renderWithContext = (children) => render(<TooltipProvider>{children}</TooltipProvider>);

describe("ObbCardsSwimlaneLayout", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should not render the title when the value is not defined", () => {
    const { queryByRole } = renderWithContext(<ObbCardsSwimlaneLayout layout={{ title: undefined, items: [] }} />);

    expect(queryByRole("text")).toBeNull();
  });

  it("should render the items", async () => {
    const mockItems = [
      {
        urn: "urn1",
        typename: "CardA",
      },
      {
        urn: "urn2",
        typename: "CardB",
      },
    ];

    renderWithContext(<ObbCardsSwimlaneLayout layout={{ items: mockItems }} />);

    expect(ConnectedObbCard).toHaveBeenCalledTimes(mockItems.length);
  });
});
