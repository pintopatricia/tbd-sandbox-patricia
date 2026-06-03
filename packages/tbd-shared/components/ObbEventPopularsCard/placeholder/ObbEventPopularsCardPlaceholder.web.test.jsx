import React from "react";
import { render } from "@testing-library/react";
import ObbEventPopularsCardPlaceholder from "./ObbEventPopularsCardPlaceholder.web";
import { ConfigContext } from "../../Config/ConfigContext";
import { Divider, Placeholder } from "@ppb/the-wall-web";

// Mock dependencies
jest.mock("@ppb/the-wall-web", () => ({
  ScrollableSwimlane: jest.fn(({ children, title, isDesktopLayout }) => (
    <div data-testid="scrollable-swimlane" data-desktop={isDesktopLayout} data-title={title}>
      {children}
    </div>
  )),
  Placeholder: jest.fn(() => <placeholder-mock data-testid="placeholder-mock" />),
  Divider: jest.fn(() => <divider-mock data-testid="divider-mock" />),
}));

describe("ObbEventPopularsCardPlaceholder", () => {
  const mockConfigContext = {
    isDesktopLayout: false,
  };

  const renderWithContext = (isDesktopLayout = false) => {
    return render(
      <ConfigContext.Provider value={{ ...mockConfigContext, isDesktopLayout }}>
        <ObbEventPopularsCardPlaceholder />
      </ConfigContext.Provider>,
    );
  };

  fit("renders ScrollableSwimlane component", () => {
    const { container } = renderWithContext();

    const bettingOpportunities = container.getElementsByClassName("bettingOpportunitiesContainer");
    const footer = container.getElementsByClassName("footer");

    expect(bettingOpportunities).toBeTruthy();
    expect(footer).toBeTruthy();

    expect(Divider).toHaveBeenCalledTimes(2);
    expect(Placeholder).toHaveBeenCalledTimes(9);
  });
});
