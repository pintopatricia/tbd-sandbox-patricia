import React from "react";
import { render } from "@testing-library/react";
import { SportsbookPlacePanelContentLayout } from "./SportsbookPlacePanel.types";
import { SportsbookPlacePanelOrchestrator } from "./SportsbookPlacePanelOrchestrator.web";
import { SportsbookPlacePanel } from "./SportsbookPlacePanel.web";
import { SportsbookPlaceTabsPanel } from "./TabsView/SportsbookPlaceTabsPanel.web";
import { useTabsExperimentVariant } from "./useTabsExperimentVariant";

jest.mock("./SportsbookPlacePanel.web", () => ({
  SportsbookPlacePanel: jest.fn(() => <place-panel--mock />),
}));

jest.mock("./TabsView/SportsbookPlaceTabsPanel.web", () => ({
  SportsbookPlaceTabsPanel: jest.fn(() => <place-tabs-panel--mock />),
}));

jest.mock("./useTabsExperimentVariant", () => ({
  useTabsExperimentVariant: jest.fn(),
}));

const REF_MOCK = {
  ref: "mock",
};

function renderSportsbookPlacePanelOrchestrator({
  ref = REF_MOCK,
  tabsExperimentVariant,
  isDesktopLayout = false,
  hasOnlyOneSingle = false,
  contentLayout = SportsbookPlacePanelContentLayout.ACCORDION,
} = {}) {
  useTabsExperimentVariant.mockReturnValue(tabsExperimentVariant);
  return render(
    <SportsbookPlacePanelOrchestrator
      ref={ref}
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
          tabsExperimentVariant: "with-all",
          isDesktopLayout: true,
        });
        expect(SportsbookPlacePanel).toHaveBeenCalledWith(
          expect.objectContaining({
            ref: REF_MOCK,
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
          ref: REF_MOCK,
          contentLayout: SportsbookPlacePanelContentLayout.ACCORDION,
          isDesktopLayout: false,
          hasOnlyOneSingle: false,
        },
        undefined,
      );
    });
  });
});
