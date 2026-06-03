import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import {
  UI__MARKET_SBK_BET_BUTTON_CLICK,
  BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
  BETTING__SBK_TOGGLE_LEG_ACTION,
} from "@ppb/tbd-store/actions/betting";

import { UI__CLOSED_SBK_CLICK } from "@ppb/tbd-store/actions/sportsbook-markets";

import { getEntities } from "@ppb/tbd-store/state/entities/entities-selectors";
import { VirtualSportKind } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { VirtualSport } from "@ppb/tbd-store/state/constants";
import { SportsbookMarketStatus } from "@ppb/the-wall-common/constants";
import { isLegInState, convertEntityTupleToLegId } from "@ppb/tbd-store/helpers/sportsbook-betting";
import {
  UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION,
  UI__BETSLIP_OPEN,
  UI__BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION,
} from "@ppb/tbd-store/actions/betslip";
import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { makeMapStateToProps, makeMapDispatchToProps, ToastMessageStatus } from "./map-to-props-factory";

const eachWayFraction = 5;
const eachWayPlaces = 3;

const entities = {
  virtualsports: {
    "ppb:virtualSport:1": {
      typename: "VirtualSport",
      urn: "ppb:virtualSport:1",
    },
  },
  virtualmarkets: {
    "ppb:virtualMarket:1": {
      typename: "VirtualMarket",
      urn: "ppb:virtualMarket:1",
      marketType: "WIN",
      runners: ["ppb:virtualRunner:1"],
      hasEachWay: true,
      eachWayPlaces,
      eachWayFraction,
      status: SportsbookMarketStatus.SUSPENDED,
    },
    "ppb:virtualMarket:3": {
      typename: "VirtualMarket",
      urn: "ppb:virtualMarket:3",
      marketType: "CORRECT_SCORE",
      runners: ["ppb:virtualRunner:1"],
    },
    "ppb:virtualMarket:2": {
      typename: "VirtualMarket",
      urn: "ppb:virtualMarket:2",
      marketType: "MATCH_ODDS",
      runners: ["ppb:virtualRunner:2"],
      hasEachWay: false,
    },
  },
  virtualevents: {
    "ppb:virtualEvent:1": {
      typename: "VirtualEvent",
      urn: "ppb:virtualEvent:1",
      isExpired: false,
    },
  },
  virtualrunners: {
    "ppb:virtualRunner:1": {
      typename: "VirtualRunner",
      urn: "ppb:virtualRunner:1",
      name: "Runner 1 name",
      odds: "Runner 1 odds",
      humanTexture: "some texture",
    },
  },
  preferences: {
    sportsbookOddsDisplay: true,
  },
  brandSettings: { SPORTSBOOK_BET_BUTTON_ANIMATION: false },
};

const state = {
  layouts: { cards: { virtualmarket: ["ppb:card"] } },
  betting: {
    sportsbookBetting: {
      legs: {},
    },
  },
  entities: {
    brandSettings: { SPORTSBOOK_BET_BUTTON_ANIMATION: false },
  },
};

const getVirtualMarketCardByURN = jest.fn(() => ({
  typename: "VirtualMarketCard",
  urn: "ppb:tbd:card:virtualMarket:112233",
  title: "market title",
  event: "ppb:virtualEvent:111",
  market: "ppb:virtualMarket:222",
  status: SportsbookMarketStatus.OPEN,
}));

const getVirtualMarketByURN = jest.fn(() => entities.virtualmarkets["ppb:virtualMarket:1"]);
const getVirtualRunnerByURN = jest.fn(() => entities.virtualrunners["ppb:virtualRunner:1"]);
const getVirtualEventByURN = jest.fn(() => entities.virtualevents["ppb:virtualEvent:1"]);
const getVirtualSportByURN = jest.fn(() => entities.virtualsports["ppb:virtualSport:1"]);

jest.mock("@ppb/tbd-store/state/entities/virtual-market/virtual-market-selectors", () => ({
  createVirtualMarketByURNSelector: jest.fn(() => getVirtualMarketByURN),
}));

jest.mock("@ppb/tbd-store/state/entities/virtual-runner/virtual-runner-selectors", () => ({
  createVirtualRunnerByURNSelector: jest.fn(() => getVirtualRunnerByURN),
}));

jest.mock("@ppb/tbd-store/state/entities/virtual-event/virtual-event-selectors", () => ({
  createVirtualEventByURNSelector: jest.fn(() => getVirtualEventByURN),
}));

jest.mock("@ppb/tbd-store/state/entities/virtual-sport/virtual-sport-selectors", () => ({
  createVirtualSportByURNSelector: jest.fn(() => getVirtualSportByURN),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getVirtualMarketCardByURN),
}));

jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => ({
  getEntities: jest.fn(() => entities),
}));

jest.mock("@ppb/tbd-store/helpers/sportsbook-betting", () => ({
  isLegInState: jest.fn(() => true),
  convertEntityTupleToLegId: jest.fn(() => "legID"),
}));

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));
jest.mock("@ppb/tbd-store/helpers/formatters", () => ({
  formatOdds: jest.fn(() => "formatOdds mock"),
}));
jest.mock("@ppb/tbd-store/state/entities/entities-selectors");

const setupMapStateToProps = (urn) => {
  const containerProps = { urn };
  return makeMapStateToProps()(state, containerProps);
};

describe("makeMapStateToProps", () => {
  afterEach(jest.clearAllMocks);

  it("should return empty object if the VirtualMarketCard doesn't exist", () => {
    getVirtualMarketCardByURN.mockReturnValueOnce(undefined);
    const stateProps = setupMapStateToProps("fakeVirtualMarketCardUrn");

    expect(stateProps).toEqual({});
  });

  it("should return empty object if the VirtualEvent doesn't exist", () => {
    getVirtualEventByURN.mockReturnValueOnce(undefined);
    const stateProps = setupMapStateToProps("fakeVirtualMarketCardUrn");

    expect(stateProps).toEqual({});
  });

  it("should return empty object if the VirtualSport doesn't exist", () => {
    getVirtualSportByURN.mockReturnValueOnce(undefined);
    const stateProps = setupMapStateToProps("fakeVirtualMarketCardUrn");

    expect(stateProps).toEqual({});
  });

  it("should return marketUrn", () => {
    const stateProps = setupMapStateToProps("fakeVirtualMarketCardUrn");

    expect(stateProps.marketUrn).toEqual("ppb:virtualMarket:222");
  });

  it("should return title", () => {
    const stateProps = setupMapStateToProps("fakeVirtualMarketCardUrn");

    expect(stateProps.title).toEqual("market title");
  });

  it("should return animated flag", () => {
    const stateProps = setupMapStateToProps("fakeVirtualMarketCardUrn");

    expect(stateProps.animated).toEqual(false);
  });

  it("should return guaranteedPriceAvailable", () => {
    const stateProps = setupMapStateToProps("fakeVirtualMarketCardUrn");

    expect(stateProps.guaranteedPriceAvailable).toEqual(false);
  });

  it("should return i18n labels", () => {
    const stateProps = setupMapStateToProps("fakeVirtualMarketCardUrn");

    expect(stateProps).toEqual(
      expect.objectContaining({
        i18n: {
          tabsLabel: "I18N.LABELS.MARKET_TABS",
          suspended: "I18N.MARKET.SUSPENDED",
          closed: "I18N.MARKET.CLOSED",
          bog: "",
          nonRunnerTitle: "",
          azSwitcher: "",
          gameRules: "I18N.VIRTUALS.GAME_RULES",
        },
      }),
    );
  });

  describe("status", () => {
    describe("when virtual event is expired", () => {
      it("should return SUSPENDED", () => {
        getVirtualEventByURN.mockReturnValueOnce({
          typename: "VirtualEvent",
          urn: "ppb:virtualEvent:1",
          isExpired: true,
        });

        const stateProps = setupMapStateToProps("fakeVirtualMarketCardUrn");

        expect(stateProps.status).toEqual(SportsbookMarketStatus.SUSPENDED);
      });
    });

    describe("when virtual event is NOT expired", () => {
      it("should return OPEN", () => {
        getVirtualEventByURN.mockReturnValueOnce({
          typename: "VirtualEvent",
          urn: "ppb:virtualEvent:1",
          isExpired: false,
        });

        const stateProps = setupMapStateToProps("fakeVirtualMarketCardUrn");

        expect(stateProps.status).toEqual(SportsbookMarketStatus.SUSPENDED);
      });
    });
  });

  describe("runners", () => {
    it("should return urn", () => {
      const stateProps = setupMapStateToProps("fakeVirtualMarketCardUrn");

      expect(stateProps.runners[0]).toEqual(expect.objectContaining({ urn: "ppb:virtualRunner:1" }));
    });

    it("should return name", () => {
      const stateProps = setupMapStateToProps("fakeVirtualMarketCardUrn");

      expect(stateProps.runners[0]).toEqual(expect.objectContaining({ name: "Runner 1 name" }));
    });

    it("should return label with formatted runner odds", () => {
      getEntities.mockReturnValueOnce({
        ...entities,
        preferences: {
          sportsbookOddsDisplay: true,
        },
      });
      getVirtualMarketByURN.mockReturnValue({
        typename: "VirtualMarket",
        urn: "ppb:virtualMarket:1",
        runners: ["ppb:virtualRunner:1"],
        hasEachWay: true,
        eachWayPlaces,
        eachWayFraction,
        status: SportsbookMarketStatus.OPEN,
      });

      const stateProps = setupMapStateToProps("fakeVirtualMarketCardUrn");

      expect(formatOdds).toHaveBeenCalledTimes(1);
      expect(formatOdds).toHaveBeenNthCalledWith(1, "Runner 1 odds", true);

      expect(stateProps.runners[0]).toEqual(expect.objectContaining({ label: "formatOdds mock" }));
    });

    it("should return odds", () => {
      getEntities.mockReturnValueOnce({
        ...entities,
        preferences: {
          sportsbookOddsDisplay: true,
        },
      });
      getVirtualMarketByURN.mockReturnValue({
        typename: "VirtualMarket",
        urn: "ppb:virtualMarket:1",
        runners: ["ppb:virtualRunner:1"],
        hasEachWay: true,
        eachWayPlaces,
        eachWayFraction,
        status: SportsbookMarketStatus.OPEN,
      });

      const stateProps = setupMapStateToProps("fakeVirtualMarketCardUrn");

      expect(formatOdds).toHaveBeenCalledTimes(1);
      expect(formatOdds).toHaveBeenNthCalledWith(1, "Runner 1 odds", true);

      expect(stateProps.runners[0]).toEqual(expect.objectContaining({ odds: "Runner 1 odds" }));
    });

    it("should return humanTexture", () => {
      const stateProps = setupMapStateToProps();

      expect(stateProps.runners[0].humanTexture).toEqual("some texture");
    });

    describe.each`
      marketType         | marketUrn                | showSilk
      ${"WIN"}           | ${"ppb:virtualMarket:1"} | ${true}
      ${"MATCH_ODDS"}    | ${"ppb:virtualMarket:2"} | ${true}
      ${"CORRECT_SCORE"} | ${"ppb:virtualMarket:3"} | ${false}
    `("when market is $marketType", ({ marketUrn, showSilk }) => {
      it(`should return showSilk as ${showSilk}`, () => {
        getVirtualMarketByURN.mockReturnValueOnce(entities.virtualmarkets[marketUrn]);
        const stateProps = setupMapStateToProps();

        expect(stateProps.runners[0].showSilk).toEqual(showSilk);
      });
    });

    describe("when racing", () => {
      function setupRacing() {
        getVirtualSportByURN.mockReturnValueOnce({
          ...entities.virtualsports["ppb:virtualSport:1"],
          kind: VirtualSportKind.Racing,
        });
        getVirtualRunnerByURN.mockReturnValueOnce({
          ...entities.virtualrunners["ppb:virtualRunner:1"],
          humanName: "some human name",
          racerIndex: 7,
        });
        return setupMapStateToProps("fakeVirtualMarketCardUrn");
      }

      it("should return description", () => {
        const stateProps = setupRacing();

        expect(stateProps.runners[0]).toEqual(expect.objectContaining({ description: "some human name" }));
      });

      it("should return number", () => {
        const stateProps = setupRacing();

        expect(stateProps.runners[0]).toEqual(expect.objectContaining({ number: 7 }));
      });
    });

    describe("when motor racing", () => {
      function setupMotorRacing() {
        getVirtualSportByURN.mockReturnValueOnce({
          ...entities.virtualsports["ppb:virtualSport:1"],
          kind: VirtualSportKind.Racing,
          sportId: VirtualSport.MotorRacing,
        });
        getVirtualRunnerByURN.mockReturnValueOnce({
          ...entities.virtualrunners["ppb:virtualRunner:1"],
          racerIndex: 7,
        });
        return setupMapStateToProps("fakeVirtualMarketCardUrn");
      }
      it("should return number", () => {
        const stateProps = setupMotorRacing();

        expect(stateProps.runners[0]).toEqual(expect.objectContaining({ number: 7 }));
      });
    });

    describe("isSelected", () => {
      describe("when there is a leg in the state", () => {
        it("should set isSelected to true", () => {
          convertEntityTupleToLegId.mockReturnValue("The leg ID");
          isLegInState.mockReturnValue(true);
          getEntities.mockReturnValueOnce({
            ...entities,
            preferences: {
              sportsbookOddsDisplay: true,
            },
          });
          getVirtualMarketByURN.mockReturnValue({
            typename: "VirtualMarket",
            urn: "ppb:virtualMarket:1",
            runners: ["ppb:virtualRunner:1"],
            hasEachWay: true,
            eachWayPlaces,
            eachWayFraction,
            status: SportsbookMarketStatus.OPEN,
          });

          const stateProps = setupMapStateToProps("fakeVirtualMarketCardUrn");

          expect(formatOdds).toHaveBeenCalledTimes(1);
          expect(formatOdds).toHaveBeenNthCalledWith(1, "Runner 1 odds", true);
          expect(isLegInState).toHaveBeenCalledWith("The leg ID", {});
          expect(stateProps.runners[0]).toEqual(expect.objectContaining({ isSelected: true }));
        });
      });

      describe("when there is no leg in the state", () => {
        it("should set isSelected to false", () => {
          convertEntityTupleToLegId.mockReturnValue("The other leg ID");
          isLegInState.mockReturnValue(false);
          getEntities.mockReturnValueOnce({
            ...entities,
            preferences: {
              sportsbookOddsDisplay: true,
            },
          });
          getVirtualMarketByURN.mockReturnValue({
            typename: "VirtualMarket",
            urn: "ppb:virtualMarket:1",
            runners: ["ppb:virtualRunner:1"],
            hasEachWay: true,
            eachWayPlaces,
            eachWayFraction,
            status: SportsbookMarketStatus.OPEN,
          });

          const stateProps = setupMapStateToProps("fakeVirtualMarketCardUrn");

          expect(formatOdds).toHaveBeenCalledTimes(1);
          expect(formatOdds).toHaveBeenNthCalledWith(1, "Runner 1 odds", true);

          expect(isLegInState).toHaveBeenCalledWith("The other leg ID", {});
          expect(stateProps.runners[0]).toEqual(expect.objectContaining({ isSelected: false }));
        });
      });
    });

    describe("when VirtualRunner doesn't exist", () => {
      it("should not map it", () => {
        getVirtualRunnerByURN.mockReturnValueOnce(undefined);

        const stateProps = setupMapStateToProps("fakeVirtualMarketCardUrn");

        expect(stateProps.runners).toEqual([]);
      });
    });

    describe("toastMessageStatus", () => {
      describe("and market status is OPEN", () => {
        it("should return undefined", () => {
          getEntities.mockReturnValueOnce({
            ...entities,
            preferences: {
              sportsbookOddsDisplay: true,
            },
          });
          getVirtualMarketByURN.mockReturnValue({
            typename: "VirtualMarket",
            urn: "ppb:virtualMarket:1",
            runners: ["ppb:virtualRunner:1"],
            hasEachWay: true,
            eachWayPlaces,
            eachWayFraction,
            status: SportsbookMarketStatus.OPEN,
          });

          const stateProps = setupMapStateToProps("fakeVirtualMarketCardUrn");

          expect(stateProps.runners[0]).toEqual(expect.objectContaining({ toastMessageStatus: undefined }));
        });
      });

      describe("and market status is CLOSED", () => {
        it("should return CLOSED", () => {
          getEntities.mockReturnValueOnce({
            ...entities,
            preferences: {
              sportsbookOddsDisplay: true,
            },
          });
          getVirtualMarketByURN.mockReturnValue({
            typename: "VirtualMarket",
            urn: "ppb:virtualMarket:1",
            runners: ["ppb:virtualRunner:1"],
            hasEachWay: true,
            eachWayPlaces,
            eachWayFraction,
            status: SportsbookMarketStatus.CLOSED,
          });

          const stateProps = setupMapStateToProps("fakeVirtualMarketCardUrn");

          expect(stateProps.runners[0]).toEqual(expect.objectContaining({ toastMessageStatus: "CLOSED" }));
        });
      });

      describe("and market status is SUSPENDED", () => {
        it("should return SUSPENDED", () => {
          getEntities.mockReturnValueOnce({
            ...entities,
            preferences: {
              sportsbookOddsDisplay: true,
            },
          });
          getVirtualMarketByURN.mockReturnValue({
            typename: "VirtualMarket",
            urn: "ppb:virtualMarket:1",
            runners: ["ppb:virtualRunner:1"],
            hasEachWay: true,
            eachWayPlaces,
            eachWayFraction,
            status: SportsbookMarketStatus.SUSPENDED,
          });

          const stateProps = setupMapStateToProps("fakeVirtualMarketCardUrn");

          expect(stateProps.runners[0]).toEqual(expect.objectContaining({ toastMessageStatus: "SUSPENDED" }));
        });
      });
    });
  });

  describe("each way", () => {
    describe("when each way is available", () => {
      it("should return infoBlurbs with translation", () => {
        const stateProps = setupMapStateToProps("fakeVirtualMarketCardUrn");

        expect(stateProps).toEqual(
          expect.objectContaining({
            infoBlurbs: [
              {
                title: "I18N.LABELS.EW_TERMS",
                signposting: "MARKET_RULES",
              },
            ],
          }),
        );
      });
    });
  });
});

describe("makeMapDispatchToProps", () => {
  it("should return the expected dispatchers", () => {
    const dispatchers = makeMapDispatchToProps();
    expect(Object.keys(dispatchers)).toEqual(["dispatchBetPlacement", "dispatchInactiveBetButtonClickAction"]);
  });

  describe("dispatchBetPlacement", () => {
    it("should dispatch UI__BETSLIP_OPEN", () => {
      const dispatchMock = jest.fn();
      const { dispatchBetPlacement } = makeMapDispatchToProps(dispatchMock);
      dispatchBetPlacement({ urn: "urn" }, { uniqueId: "" });
      expect(dispatchMock).toHaveBeenNthCalledWith(1, {
        type: UI__BETSLIP_OPEN,
        payload: {
          product: Product.Sportsbook,
        },
      });
    });

    it("should dispatch UI__BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION", () => {
      const dispatchMock = jest.fn();
      const { dispatchBetPlacement } = makeMapDispatchToProps(dispatchMock);
      dispatchBetPlacement({ urn: "urn" }, { uniqueId: "" });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, {
        type: UI__BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION,
        payload: {
          urn: "urn",
        },
      });
    });

    it("should dispatch UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION", () => {
      const dispatchMock = jest.fn();
      const { dispatchBetPlacement } = makeMapDispatchToProps(dispatchMock);
      dispatchBetPlacement({ urn: "urn" }, { uniqueId: "" });
      expect(dispatchMock).toHaveBeenNthCalledWith(3, {
        type: UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION,
      });
    });

    it("should dispatch UI__MARKET_SBK_BET_BUTTON_CLICK", () => {
      const dispatchMock = jest.fn();
      const { dispatchBetPlacement } = makeMapDispatchToProps(dispatchMock);
      dispatchBetPlacement({ urn: "urn" }, { uniqueId: "" });
      expect(dispatchMock).toHaveBeenNthCalledWith(4, {
        type: UI__MARKET_SBK_BET_BUTTON_CLICK,
        payload: {
          urn: "urn",
          uniqueId: "",
          group: "VIRTUAL",
        },
      });
    });

    it("should dispatch BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION", () => {
      const dispatchMock = jest.fn();
      const { dispatchBetPlacement } = makeMapDispatchToProps(dispatchMock);
      dispatchBetPlacement({ urn: "urn" }, { uniqueId: "" });
      expect(dispatchMock).toHaveBeenNthCalledWith(5, {
        type: BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
      });
    });

    it("should dispatch BETTING__SBK_TOGGLE_LEG_ACTION", () => {
      const dispatchMock = jest.fn();
      const { dispatchBetPlacement } = makeMapDispatchToProps(dispatchMock);
      dispatchBetPlacement({ urn: "urn" }, { uniqueId: "" });
      expect(dispatchMock).toHaveBeenNthCalledWith(6, {
        type: BETTING__SBK_TOGGLE_LEG_ACTION,
        payload: {
          urn: "urn",
          group: "VIRTUAL",
        },
      });
    });
  });

  describe("dispatchInactiveBetButtonClickAction", () => {
    it("should dispatch ClosedSbkBetButtonCLickAction", () => {
      const dispatchMock = jest.fn();
      const { dispatchInactiveBetButtonClickAction } = makeMapDispatchToProps(dispatchMock);
      dispatchInactiveBetButtonClickAction(ToastMessageStatus.CLOSED);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, {
        type: UI__CLOSED_SBK_CLICK,
      });
    });
  });
});
