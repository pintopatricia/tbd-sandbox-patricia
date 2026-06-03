import React from "react";
import { render } from "@testing-library/react-native";
import { SportsbookPlacePanelContentLayout } from "./SportsbookPlacePanel.types";
import { SportsbookPlacePanelOrchestrator } from "./SportsbookPlacePanelOrchestrator.native";
import { SportsbookPlacePanel } from "./SportsbookPlacePanel.native";
import { SportsbookPlaceTabsPanel } from "./TabsView/SportsbookPlaceTabsPanel.native";
import { useTabsExperimentVariant } from "./useTabsExperimentVariant";

jest.mock("./SportsbookPlacePanel.native", () => ({
  SportsbookPlacePanel: jest.fn(() => <place-panel--mock />),
}));

jest.mock("./TabsView/SportsbookPlaceTabsPanel.native", () => ({
  SportsbookPlaceTabsPanel: jest.fn(() => <place-tabs-panel--mock />),
}));

jest.mock("./useTabsExperimentVariant", () => ({
  useTabsExperimentVariant: jest.fn(),
}));

function renderSportsbookPlacePanelOrchestrator({
  tabsExperimentVariant,
  isDesktopLayout = false,
  hasOnlyOneSingle = false,
  contentLayout = SportsbookPlacePanelContentLayout.ACCORDION,
} = {}) {
  useTabsExperimentVariant.mockReturnValue(tabsExperimentVariant);
  return render(
    <SportsbookPlacePanelOrchestrator
      isDesktopLayout={isDesktopLayout}
      hasOnlyOneSingle={hasOnlyOneSingle}
      contentLayout={contentLayout}
    />,
  );
}

describe("SportsbookPlace", () => {
  afterEach(jest.clearAllMocks);

  describe("when is TABS layout", () => {
    describe("and is desktop layout", () => {
      it("should delegate to SportsbookPlacePanel", () => {
        renderSportsbookPlacePanelOrchestrator({
          contentLayout: SportsbookPlacePanelContentLayout.TABS,
          tabsExperimentVariant: "with-all",
          isDesktopLayout: true,
        });
        expect(SportsbookPlacePanel).toHaveBeenCalledWith(
          expect.objectContaining({
            contentLayout: SportsbookPlacePanelContentLayout.TABS,
            isDesktopLayout: true,
            hasOnlyOneSingle: false,
          }),
          undefined,
        );
      });
    });

    describe("and is not desktop layout", () => {
      it("should delegate to SportsbookPlaceTabsPanel", () => {
        renderSportsbookPlacePanelOrchestrator({
          contentLayout: SportsbookPlacePanelContentLayout.TABS,
          tabsExperimentVariant: "with-all",
          isDesktopLayout: false,
          hasOnlyOneSingle: false,
        });
        expect(SportsbookPlaceTabsPanel).toHaveBeenCalledWith(
          {
            contentLayout: SportsbookPlacePanelContentLayout.TABS,
            experimentVariant: "with-all",
            isDesktopLayout: false,
            hasOnlyOneSingle: false,
          },
          undefined,
        );
      });
    });
  });

  describe("when is ACCORDION layout", () => {
    it("should delegate to SportsbookPlacePanel", () => {
      renderSportsbookPlacePanelOrchestrator({
        contentLayout: SportsbookPlacePanelContentLayout.ACCORDION,
      });
      expect(SportsbookPlacePanel).toHaveBeenCalledWith(
        {
          contentLayout: SportsbookPlacePanelContentLayout.ACCORDION,
          isDesktopLayout: false,
          hasOnlyOneSingle: false,
        },
        undefined,
      );
    });
  });
});
