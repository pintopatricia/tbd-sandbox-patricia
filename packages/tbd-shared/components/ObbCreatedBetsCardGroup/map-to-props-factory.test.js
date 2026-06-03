import { OddsDisplayPreference } from "@ppb/tbd-store";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const DEFAULT_STATE = {
  layouts: {
    cards: {
      obbcards: {
        defaultLegs: [
          "5d4d6e2f368d2478",
          "1438b2bb77a2c3d0",
          "7fcb7dcf89d0a2f8",
          "3d3131a72f25f328",
          "a8b075031fa274b4",
        ],
      },
    },
    cardgroups: {
      obbcardgroups: {
        "cardgroup-1": {},
      },
    },
  },
  entities: {
    preferences: {
      exchangeOddsDisplay: OddsDisplayPreference.Decimal,
    },
    experiments: {},
  },
};

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: jest.fn(),
}));

const getObbCreatedBetsCardByURN = jest.fn();

describe("makeMapStateToProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when the card group is not defined", () => {
    it("should return an empty object", () => {
      createCardGroupByURNSelector.mockReturnValue(getObbCreatedBetsCardByURN);
      getObbCreatedBetsCardByURN.mockReturnValueOnce(undefined);

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, { urn: "urn" });

      expect(stateToProps).toEqual({});
    });
  });

  describe("when the card group is defined", () => {
    it("should map state to props correctly", () => {
      createCardGroupByURNSelector.mockReturnValue(getObbCreatedBetsCardByURN);
      getObbCreatedBetsCardByURN.mockReturnValueOnce({
        typename: "ObbCreatedBetsCardGroup",
        title: "ObbCreatedBetsCardGroup Title",
        headerBadgeLabel: "Label",
        headerViewLink: {
          viewUrl: "/headerViewLink/url",
          viewUrn: "headerViewLink:urn:1",
        },
        items: [
          { urn: "createdBetsCard:urn:1", otherProp: "value1" },
          { urn: "createdBetsCard:urn:2", otherProp: "value2" },
        ],
      });

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, { urn: "urn" });
      expect(stateToProps).toEqual({
        urn: "urn",
        title: "ObbCreatedBetsCardGroup Title",
        headerBadgeLabel: "Label",
        headerViewLinkLabel: "I18N.OBB.SQUADBET.ALL_MATCHES",
        headerViewLink: {
          viewUrl: "/headerViewLink/url",
          viewUrn: "headerViewLink:urn:1",
        },
        cards: [{ urn: "createdBetsCard:urn:1" }, { urn: "createdBetsCard:urn:2" }],
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should dispatch UI__OBB_CREATED_BETS_LINK_CLICKED when dispatchLinkClick is called", () => {
    const { dispatchLinkClick } = mapDispatchToProps(dispatch);
    const mockViewLink = {
      viewUrn: "urn:view:test",
      viewUrl: "/test",
    };

    dispatchLinkClick(mockViewLink, "urn", "label", "eventName", 4);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      type: "UI__OBB_CREATED_BETS_LINK_CLICKED",
      payload: {
        urn: "urn",
        label: "label",
        viewUrl: mockViewLink.viewUrl,
      },
    });
  });

  it("should dispatch PUSH when dispatchPushAction is called", () => {
    const { dispatchPushAction } = mapDispatchToProps(dispatch);

    dispatchPushAction({
      viewUrl: "/headerViewLink/url",
      viewUrn: "headerViewLink:urn:1",
    });

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      type: "Router/push",
      payload: {
        viewUrl: "/headerViewLink/url",
        viewUrn: "headerViewLink:urn:1",
      },
    });
  });
});
