import { createExchangeMarketSelector } from "@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors";
import { createMeetingByURNSelector } from "@ppb/tbd-store/state/entities/meetings/meeting-selectors";
import { createSportEventByURNSelector } from "@ppb/tbd-store/state/entities/sport-events/sport-event-selectors";
import { isRaceHierarchy } from "@ppb/tbd-store/helpers/markets";

import { makeMapStateToProps, makeMapDispatchToProps } from "./map-to-props-factory";

import { i18n } from "../../helpers/i18n";

jest.mock("@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors", () => ({
  createExchangeMarketSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/meetings/meeting-selectors", () => ({
  createMeetingByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/sport-events/sport-event-selectors", () => ({
  createSportEventByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/helpers/markets", () => ({
  isRaceHierarchy: jest.fn(),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../../config/endpoints", () => ({
  getEndpoint: jest.fn(() => "https://ega.endpoint/"),
}));

const MARKET_MOCK = {
  urn: "ppb:excMarket:1.251837837",
  marketId: "1.251837837",
  name: "Market Name",
};

const RUNNER_MOCK = {
  urn: "ppb:excRunner:1.251837837/56323/0",
  selectionId: 56323,
  handicap: 0,
};

const MEETING_MOCK = {
  urn: "ppb:meeting:35136118",
  entityName: "Meeting Name",
};

const SPORT_EVENT_MOCK = {
  urn: "ppb:event:35136118",
  name: "Event Name",
};

const STATE_MOCK = {
  entities: {
    exchangemarkets: { "ppb:excMarket:1.251837837": MARKET_MOCK },
    exchangerunners: { "ppb:excRunner:1.251837837/56323/0": RUNNER_MOCK },
    meetings: { "ppb:meeting:35136118": MEETING_MOCK },
    sportevents: { "ppb:event:35136118": SPORT_EVENT_MOCK },
  },
};

beforeEach(jest.clearAllMocks);

describe("mapStateToProps", () => {
  const getExchangeMarketByURNSelector = jest.fn();
  const getMeetingByURN = jest.fn();
  const getSportEventByURN = jest.fn();

  const setupMapStateToProps = ({
    marketExists = true,
    runnerExists = true,
    isRace = true,
    sportEventExists = true,
  } = {}) => {
    isRaceHierarchy.mockImplementation(() => isRace);
    createExchangeMarketSelector.mockImplementation(() =>
      getExchangeMarketByURNSelector.mockImplementation(() =>
        marketExists
          ? {
              ...MARKET_MOCK,
              runners: runnerExists ? [RUNNER_MOCK] : [],
              hierarchy: {
                [isRace ? "meeting" : "sportevent"]: `ppb:${isRace ? "meeting" : "event"}:35136118`,
              },
            }
          : undefined,
      ),
    );
    createMeetingByURNSelector.mockImplementation(() => getMeetingByURN.mockImplementation(() => MEETING_MOCK));
    createSportEventByURNSelector.mockImplementation(() =>
      getSportEventByURN.mockImplementation(() => (sportEventExists ? SPORT_EVENT_MOCK : undefined)),
    );

    return makeMapStateToProps()(STATE_MOCK, {
      market: "ppb:excMarket:1.251837837",
      runner: "ppb:excRunner:1.251837837/56323/0",
      onMarketGraphDismiss: jest.fn(),
    });
  };

  it("should call i18n", () => {
    setupMapStateToProps();

    expect(i18n).toHaveBeenCalledTimes(1);
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.MARKET_GRAPHS" });
  });

  it("should create entity selectors", () => {
    setupMapStateToProps();

    expect(createExchangeMarketSelector).toHaveBeenCalledTimes(1);
    expect(createMeetingByURNSelector).toHaveBeenCalledTimes(1);
    expect(createSportEventByURNSelector).toHaveBeenCalledTimes(1);
  });

  it("should call getExchangeMarketByURNSelector", () => {
    setupMapStateToProps();

    expect(getExchangeMarketByURNSelector).toHaveBeenCalledTimes(1);
    expect(getExchangeMarketByURNSelector).toHaveBeenCalledWith(
      STATE_MOCK.entities.exchangemarkets,
      "ppb:excMarket:1.251837837",
    );
  });

  describe("when exchange market exists", () => {
    describe("when exchange runner exists", () => {
      describe("when it is a race market", () => {
        it("should call getMeetingByURN", () => {
          setupMapStateToProps();

          expect(getMeetingByURN).toHaveBeenCalledTimes(1);
          expect(getMeetingByURN).toHaveBeenCalledWith(STATE_MOCK.entities.meetings, "ppb:meeting:35136118");
        });

        it("should return mapped props with meeting name", () => {
          const state = setupMapStateToProps();
          expect(state).toStrictEqual({
            title: "I18N.MARKET_GRAPHS",
            eventName: "Meeting Name",
            marketName: "Market Name",
            baseUrl: "https://ega.endpoint/1.251837837/56323/0",
          });
        });
      });

      describe("when it is not a race market", () => {
        it("should call getSportEventByURN", () => {
          setupMapStateToProps({ isRace: false });

          expect(getSportEventByURN).toHaveBeenCalledTimes(1);
          expect(getSportEventByURN).toHaveBeenCalledWith(STATE_MOCK.entities.sportevents, "ppb:event:35136118");
        });

        describe("when getSportEventByURN returns an event", () => {
          it("should return mapped props with event name", () => {
            const state = setupMapStateToProps({ isRace: false });
            expect(state).toStrictEqual({
              title: "I18N.MARKET_GRAPHS",
              eventName: "Event Name",
              marketName: "Market Name",
              baseUrl: "https://ega.endpoint/1.251837837/56323/0",
            });
          });
        });

        describe("when getSportEventByURN does not return an event", () => {
          it("should return the base props", () => {
            const state = setupMapStateToProps({ isRace: false, sportEventExists: false });
            expect(state).toStrictEqual({ title: "I18N.MARKET_GRAPHS" });
          });
        });
      });
    });

    describe("when runner does not exist", () => {
      it("should return the base props", () => {
        const state = setupMapStateToProps({ runnerExists: false });
        expect(state).toStrictEqual({ title: "I18N.MARKET_GRAPHS" });
      });
    });
  });

  describe("when exchange market does not exist", () => {
    it("should return the base props", () => {
      const state = setupMapStateToProps({ marketExists: false });
      expect(state).toStrictEqual({ title: "I18N.MARKET_GRAPHS" });
    });
  });
});

describe("mapDispatchToProps", () => {
  it("should return an empty object", () => {
    expect(makeMapDispatchToProps()).toStrictEqual({});
  });
});
