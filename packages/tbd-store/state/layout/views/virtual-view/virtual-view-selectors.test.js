import { codecs } from "@ppb/tbd-urn-codecs";
import { createSelectedVirtualNavigationTabSelector } from "./virtual-view-selectors";

jest.mock("@ppb/tbd-urn-codecs", () => ({
  __esModule: true,
  codecs: {
    parse: jest.fn(() => null),
    genericView: {
      virtuals: {
        isValid: jest.fn(() => false),
      },
    },
    card: {
      virtualNavigationTabsList: {
        extract: jest.fn(() => ({ sportId: 1337 })),
      },
    },
  },
}));

jest.mock("../view-selectors", () => ({
  createFindViewByURNSelector: jest.fn(() =>
    jest.fn((_, urn) => {
      const otherItem = {
        urn: "urn:Other:0",
        typename: "Other",
      };
      const navigationTabsListItem = {
        urn: "urn:NavigationTabsList:1",
        typename: "NavigationTabsList",
      };

      if (urn === "urn:view:withnavigationtab") {
        return {
          items: [otherItem, navigationTabsListItem],
        };
      }

      return {
        items: [otherItem],
      };
    }),
  ),
}));

jest.mock("../../../entities/virtual-sport/virtual-sport-selectors", () => ({
  createVirtualSportByIdSelector: jest.fn(() => jest.fn((virtualsports, sportId) => `some:virtualsport:${sportId}`)),
}));

jest.mock("../../../layout/navigation-tabs-list/navigation-tabs-list-selectors", () => ({
  createNavigationTabsListByURNSelector: jest.fn(() =>
    jest.fn(() => ({
      selectedTabUrn: "urn:selectedTab",
    })),
  ),
}));

jest.mock("../../navigation-tabs/navigation-tabs-selectors", () => ({
  createNavigationTabByURNSelector: jest.fn(() =>
    jest.fn((_, navigationTabUrn) => `some:navigationtab:${navigationTabUrn}`),
  ),
}));

describe("createSelectedVirtualNavigationTabSelector", () => {
  function setupCreateSelectedVirtualNavigationTabSelector(
    { views, router } = {
      views: null,
      navigationtabslists: null,
      router: null,
    },
  ) {
    return createSelectedVirtualNavigationTabSelector()({
      layouts: {
        views,
      },
      router,
    });
  }

  describe("when currentViewUrn is null", () => {
    it("should return undefined", () => {
      const virtualNavigationTab = setupCreateSelectedVirtualNavigationTabSelector({
        router: {
          currentUrn: null,
        },
      });

      expect(virtualNavigationTab).toBe(undefined);
    });
  });

  describe("when currentViewUrn is defined", () => {
    describe("and is not a virtuals view", () => {
      it("should return undefined", () => {
        codecs.parse.mockReturnValue("parsed:view:urn");
        codecs.genericView.virtuals.isValid.mockReturnValue(false);

        const virtualNavigationTab = setupCreateSelectedVirtualNavigationTabSelector({
          router: {
            currentUrn: "some:view:urn",
          },
        });

        expect(virtualNavigationTab).toBe(undefined);
      });
    });

    describe("and is a virtuals view", () => {
      describe("when there is not a selected tab", () => {
        it("should return undefined", () => {
          codecs.parse.mockReturnValue("parsed:view:urn");
          codecs.genericView.virtuals.isValid.mockReturnValue(true);

          const virtualNavigationTab = setupCreateSelectedVirtualNavigationTabSelector({
            router: {
              currentUrn: "some:view:urn",
            },
          });

          expect(virtualNavigationTab).toBe(undefined);
        });
      });

      describe("when there is a selected tab", () => {
        it("should return virtual sport of selected tab", () => {
          codecs.parse.mockReturnValue("parsed:view:urn");
          codecs.genericView.virtuals.isValid.mockReturnValue(true);

          const virtualNavigationTab = setupCreateSelectedVirtualNavigationTabSelector({
            router: {
              currentUrn: "urn:view:withnavigationtab",
            },
          });

          expect(virtualNavigationTab).toBe("some:navigationtab:urn:selectedTab");
        });
      });
    });
  });
});
