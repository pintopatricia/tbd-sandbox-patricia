import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { FETCH_CARDS_FROM_LIST } from "@ppb/tbd-store/actions/catalogue";
import { BETTING__REMOVE_POTENTIAL_BET_ACTION } from "@ppb/tbd-store/actions/betting";
import { ExchangeSide } from "@ppb/tbd-store/state/constants";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipExchangeContext: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: jest.fn(),
}));

const getHalfTimeSpecialsSwimlaneCardGroupByURN = jest.fn();

const stateMock = {
  layouts: {
    cardgroups: {
      halftimespecialsswimlanecardgroups: {
        mockCardGroupUrn: {
          urn: "mockCardGroupUrn",
        },
      },
    },
  },
  modules: {
    excBetting: false,
  },
};

describe("makeMapStateToProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    createCardGroupByURNSelector.mockImplementation(() => getHalfTimeSpecialsSwimlaneCardGroupByURN);
  });

  it("should call getSwimlaneCardGroupByURN with params", () => {
    const mapStateToProps = makeMapStateToProps();
    mapStateToProps(stateMock, { urn: "mockCardGroupUrn" });

    expect(getHalfTimeSpecialsSwimlaneCardGroupByURN).toHaveBeenCalledWith(
      {
        mockCardGroupUrn: {
          urn: "mockCardGroupUrn",
        },
      },
      "mockCardGroupUrn",
    );
  });

  it("should return all CardProps fields when cardgroup is present", () => {
    getHalfTimeSpecialsSwimlaneCardGroupByURN.mockReturnValue({
      displayMode: "fakeDisplayMode",
      items: [{ urn: "urn:1" }, { urn: "urn:2" }],
      title: "fakeTitle",
      subtitle: "fakeSubtitle",
      titleImage: "ODDSBOOST",
      isDecorated: true,
      isIconSupportingTitle: true,
      urn: "mockCardGroupUrn",
    });

    const mapStateToProps = makeMapStateToProps();
    const result = mapStateToProps(stateMock, {
      urn: "mockCardGroupUrn",
      segmentedCardGroupUrn: "segmentedCardGroupURN",
    });

    expect(result).toEqual({
      title: "fakeTitle",
      subtitle: "fakeSubtitle",
      titleImage: "ODDSBOOST",
      items: [{ urn: "urn:1" }, { urn: "urn:2" }],
      cardgroupURN: "mockCardGroupUrn",
      segmentedCardGroupUrn: "segmentedCardGroupURN",
      displayMode: "fakeDisplayMode",
      currentRunner: undefined,
      currentSide: undefined,
      isDecorated: true,
      isIconSupportingTitle: true,
      isHighlighted: false,
    });
  });

  it("should return the title when isTitleHidden is false", () => {
    getHalfTimeSpecialsSwimlaneCardGroupByURN.mockReturnValue({
      displayMode: "fakeDisplayMode",
      items: [{ urn: "urn:1" }, { urn: "urn:2" }],
      title: "fakeTitle",
      subtitle: "fakeSubtitle",
      urn: "mockCardGroupUrn",
    });

    const mapStateToProps = makeMapStateToProps();
    const result = mapStateToProps(stateMock, { urn: "mockCardGroupUrn", isTitleHidden: false });

    expect(result).toEqual({
      title: "fakeTitle",
      subtitle: "fakeSubtitle",
      titleImage: undefined,
      items: [{ urn: "urn:1" }, { urn: "urn:2" }],
      cardgroupURN: "mockCardGroupUrn",
      segmentedCardGroupUrn: "",
      displayMode: "fakeDisplayMode",
      currentRunner: undefined,
      currentSide: undefined,
      isDecorated: undefined,
      isIconSupportingTitle: undefined,
      isHighlighted: false,
    });
  });

  it("should return isHighlighted as true when theme is HIGHLIGHTED", () => {
    getHalfTimeSpecialsSwimlaneCardGroupByURN.mockReturnValue({
      displayMode: "fakeDisplayMode",
      items: [{ urn: "urn:1" }, { urn: "urn:2" }],
      title: "fakeTitle",
      subtitle: "fakeSubtitle",
      urn: "mockCardGroupUrn",
    });

    const mapStateToProps = makeMapStateToProps();
    const result = mapStateToProps(stateMock, { urn: "mockCardGroupUrn", isTitleHidden: false, theme: "HIGHLIGHTED" });

    expect(result).toEqual(
      expect.objectContaining({
        isHighlighted: true,
      }),
    );
  });

  it("should return empty title and subtitle when isTitleHidden is true", () => {
    getHalfTimeSpecialsSwimlaneCardGroupByURN.mockReturnValue({
      displayMode: "fakeDisplayMode",
      items: [{ urn: "urn:1" }, { urn: "urn:2" }],
      title: "fakeTitle",
      subtitle: "fakeSubtitle",
      urn: "mockCardGroupUrn",
    });

    const mapStateToProps = makeMapStateToProps();
    const result = mapStateToProps(stateMock, { urn: "mockCardGroupUrn", isTitleHidden: true });

    expect(result).toEqual({
      title: "",
      subtitle: "",
      titleImage: undefined,
      items: [{ urn: "urn:1" }, { urn: "urn:2" }],
      cardgroupURN: "mockCardGroupUrn",
      segmentedCardGroupUrn: "",
      displayMode: "fakeDisplayMode",
      currentRunner: undefined,
      currentSide: undefined,
      isDecorated: undefined,
      isIconSupportingTitle: undefined,
      isHighlighted: false,
    });
  });

  it("should return empty object when cardgroup is not found", () => {
    getHalfTimeSpecialsSwimlaneCardGroupByURN.mockReturnValue(null);

    const mapStateToProps = makeMapStateToProps();
    const result = mapStateToProps(stateMock, { urn: "mockCardGroupUrn" });

    expect(result).toEqual({});
  });
});

describe("mapDispatchToProps", () => {
  it("dispatchFetchCards should create correct action", () => {
    const { dispatchFetchCards } = mapDispatchToProps;
    expect(dispatchFetchCards("URN", [{ urn: "item1" }])).toEqual({
      type: FETCH_CARDS_FROM_LIST,
      payload: {
        urn: "URN",
        partials: [{ urn: "item1" }],
      },
    });
  });

  it("dispatchPushAction should create correct action", () => {
    const { dispatchPushAction } = mapDispatchToProps;
    expect(dispatchPushAction({})).toEqual({
      type: PUSH,
      payload: {},
    });
  });

  it("dispatchClearBetting should create correct action", () => {
    const { dispatchClearBetting } = mapDispatchToProps;
    expect(dispatchClearBetting("runnerURN", ExchangeSide.BACK)).toEqual({
      type: BETTING__REMOVE_POTENTIAL_BET_ACTION,
      payload: { runner: "runnerURN", side: ExchangeSide.BACK },
    });
  });
});
