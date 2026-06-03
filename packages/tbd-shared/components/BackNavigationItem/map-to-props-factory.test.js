import { UI__GAMING_BACK_BUTTON_CLICK } from "@ppb/tbd-store/actions/navigation";
import { makeMapStateToProps, makeMapDispatchToProps } from "./map-to-props-factory";

describe("map-to-props-factory", () => {
  describe("makeMapStateToProps", () => {
    it("should return the correct props when view is a game view", () => {
      const stateMock = {
        router: { showBackButton: false },
        layouts: {
          views: {
            game: { "ppb:tbd:view:game:mockGame": { navigationItem: { title: "Game View Title" } } },
            gamingcategory: {},
          },
        },
      };

      const urn = "ppb:tbd:view:game:mockGame";
      const mapStateToProps = makeMapStateToProps();
      const props = mapStateToProps(stateMock, { urn });

      expect(props).toEqual({
        title: "Game View Title",
        returnToHomepage: true,
      });
    });

    it("should return the correct props when view is a gaming category view", () => {
      const stateMock = {
        router: { showBackButton: true },
        layouts: {
          views: {
            game: {},
            gamingcategory: {
              "ppb:tbd:view:gamingCategory:slots": { navigationItem: { title: "Gaming Category View Title" } },
            },
          },
        },
      };

      const urn = "ppb:tbd:view:gamingCategory:slots";
      const mapStateToProps = makeMapStateToProps();
      const props = mapStateToProps(stateMock, { urn });

      expect(props).toEqual({
        title: "Gaming Category View Title",
        returnToHomepage: false,
      });
    });
  });
});

describe("makeMapDispatchToProps", () => {
  it("should dispatch the correct action on dispatchGamingBackButtonClickAction", () => {
    const { dispatchGamingBackButtonClickAction } = makeMapDispatchToProps;

    expect(dispatchGamingBackButtonClickAction()).toEqual({
      type: UI__GAMING_BACK_BUTTON_CLICK,
    });
  });
});
