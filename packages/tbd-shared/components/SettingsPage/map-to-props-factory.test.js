import { createFindViewByURNSelector, createViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import { createMyAccountInterfaceStateSelector } from "@ppb/tbd-store/state/layout/cards/my-account/my-account-selectors";
import { makeMapStateToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/views/view-selectors", () => ({
  createViewByURNSelector: jest.fn(),
  createFindViewByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/my-account/my-account-selectors", () => ({
  createMyAccountInterfaceStateSelector: jest.fn(),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

const SETTINGS_URN = "ppb:view:settings:settings";

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("mapStateToProps", () => {
    const STATE = {
      entities: {
        userdetails: {
          firstName: "Sebastian",
          jurisdiction: {
            jurisdiction: "INTERNATIONAL",
          },
        },
      },
      layouts: {
        cards: {
          myaccount: {
            isOpen: false,
          },
        },
        views: {
          settings: {},
        },
      },
    };

    describe("when view exists on the state", () => {
      it("should return the object with the view", () => {
        const getSettingsViewByURN = jest.fn(() => ({
          items: ["1", "2"],
          sportEvent: "1",
          urn: SETTINGS_URN,
        }));
        const getMyAccountInterfaceState = jest.fn(() => ({
          jurisdiction: "INTERNATIONAL",
        }));

        createViewByURNSelector.mockReturnValue(getSettingsViewByURN);
        createFindViewByURNSelector.mockReturnValue(getSettingsViewByURN);
        createMyAccountInterfaceStateSelector.mockReturnValue(getMyAccountInterfaceState);

        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps(STATE, { urn: SETTINGS_URN });
        expect(props).toEqual({
          view: {
            items: ["1", "2"],
            sportEvent: "1",
            urn: SETTINGS_URN,
          },
          jurisdiction: "INTERNATIONAL",
        });
        expect(getSettingsViewByURN).toHaveBeenCalledWith({ settings: STATE.layouts.views.settings }, SETTINGS_URN);
        expect(getMyAccountInterfaceState).toHaveBeenCalled();
      });
    });

    describe("when view does not exist on the state", () => {
      it("should return the object without the view", () => {
        const getSettingsViewByURN = jest.fn(() => undefined);
        const getMyAccountInterfaceState = jest.fn(() => ({
          jurisdiction: "INTERNATIONAL",
        }));

        createViewByURNSelector.mockReturnValue(getSettingsViewByURN);
        createFindViewByURNSelector.mockReturnValue(getSettingsViewByURN);
        createMyAccountInterfaceStateSelector.mockReturnValue(getMyAccountInterfaceState);

        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps(STATE, { urn: SETTINGS_URN });

        expect(props).toEqual({
          view: null,
          jurisdiction: "INTERNATIONAL",
        });

        expect(getSettingsViewByURN).toHaveBeenCalledWith({ settings: STATE.layouts.views.settings }, SETTINGS_URN);
      });
    });
  });
});
