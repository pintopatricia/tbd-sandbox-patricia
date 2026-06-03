import { codecs } from "@ppb/tbd-urn-codecs";
import {
  getEntities,
  createBettingRunnersMetadataSelector,
  createRaceWithRunnersByURNSelector,
  createSportsbookRunnerWithOddsAndMarketByURNSelector,
  createGetWalletsAvailabilitySelector,
  createGetExchangeDefaultProductSelector,
  createSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURNSelector,
  createFixtureBySportEventURNSelector,
  createFixtureByURNSelector,
  getExchangeRunnerTree,
  createExcRunnerPotentialBetsByRunnerURNSelector,
  createRichContentExcRunnerByMarketAndRunnerURNSelector,
  createRichContentExcRunnerWithPNLByMarketAndRunnerURNSelector,
  createVirtualBettingRunnersMetadataSelector,
  createGetMarketRunnerURNAssociationSelector,
  createGetVirtualMarketRunnerURNAssociationSelector,
  createGetMarketRunnerIdAssociationSelector,
  createGetVirtualMarketRunnerIdAssociationSelector,
  createGetAddPayloadSelector,
  createGetVirtualAddPayloadSelector,
  createGetAddSelectionsPayloadSelector,
  createGetVirtualAddSelectionsPayloadSelector,
} from "./entities-selectors";

import {
  getExchangeRunnerByURN,
  createExchangeRunnerWithoutOddsByRunnerURNSelector,
} from "./exchange-runners/exchange-runner-selectors";
import {
  createExchangeMarketSelector,
  getExchangeMarketRunnerByURN,
  createExchangeMarketRunnerByMarketAndRunnerURNsSelector,
} from "./exchange-markets/exchange-market-selectors";

import {
  getSportsbookMarketById,
  getSportsbookMarketRunnerById,
  createSportsbookMarketByURNSelector,
  createSportsbookMarketRunnerByRunnerAndMarketURNSelector,
} from "./sportsbook-markets/sportsbook-market-selectors";
import { getSportEventByURN } from "./sport-events/sport-event-selectors";
import { getSportByURN } from "./sports/sport-selectors";
import { createMeetingByURNSelector } from "./meetings/meeting-selectors";
import { createRaceByURNSelector } from "./races/race-selectors";
import {
  createBettingMarketRunnersPositionSelector,
  createMarketPotentialBetsSelector,
} from "../betting/exchange-betting/exchange-betting-selectors";

import { isRaceHierarchy } from "../../helpers/markets";
import { getRacingMetadata } from "../../helpers/sportsbook-betting";

import {
  createSportsbookRunnerByURNSelector,
  createSportsbookRunnerStatusSelector,
} from "./sportsbook-runners/sportsbook-runner-selectors";

import { createRaceRunnersByRaceURNSelector } from "./race-runners/race-runners-selectors";
import {
  createGreyhoundRaceRunnerByRaceAndSelectionIdSelector,
  createGreyhoundRaceRunnersByRaceURNSelector,
} from "./greyhound-race-runners/greyhound-race-runners-selectors";
import { getUserWallets } from "./user-wallets/user-wallets-selectors";
import { createTennisFixtureByURNSelector } from "./tennis-fixture/tennis-fixture-selectors";
import { createBaseballFixtureByURNSelector } from "./baseball-fixture/baseball-fixture-selectors";
import { createBasketballFixtureByURNSelector } from "./basketball-fixture/basketball-fixture-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "./user-preferences/user-preferences-selectors";
import { createCricketFixtureByURNSelector } from "./cricket-fixture/cricket-fixture-selectors";
import { createTableTennisFixtureByURNSelector } from "./table-tennis-fixture/table-tennis-fixture-selectors";
import { createIceHockeyFixtureByURNSelector } from "./ice-hockey-fixture/ice-hockey-fixture-selectors";
import { createRugbyUnionFixtureByURNSelector } from "./rugby-union-fixture/rugby-union-fixture-selectors";
import { createRugbyLeagueFixtureByURNSelector } from "./rugby-league-fixture/rugby-league-fixture-selectors";
import { createSnookerFixtureByURNSelector } from "./snooker-fixture/snooker-fixture-selectors";
import { createVolleyballFixtureByURNSelector } from "./volleyball-fixture/volleyball-fixture-selectors";
import { createAustralianRulesFixtureByURNSelector } from "./australian-rules-fixture/australian-rules-fixture-selectors";
import { createDartsFixtureByURNSelector } from "./darts-fixture/darts-fixture-selectors";
import {
  createVirtualMarketByIdSelector,
  createVirtualMarketByRunnerURNSelector,
} from "./virtual-market/virtual-market-selectors";
import {
  createVirtualRunnerByIdSelector,
  createVirtualRunnerByURNSelector,
} from "./virtual-runner/virtual-runner-selectors";
import { createVirtualSportByURNSelector } from "./virtual-sport/virtual-sport-selectors";
import { createVirtualEventByURNSelector } from "./virtual-event/virtual-event-selectors";

const userWalletsMock = jest.fn();

jest.mock("i18next", () => ({
  t: jest.fn((key) => key),
}));

jest.mock("@ppb/tbd-urn-codecs", () => ({
  codecs: {
    fixture: {
      encode: jest.fn(),
    },
  },
}));

jest.mock("../../helpers/markets", () => ({
  isRaceHierarchy: jest.fn().mockReturnValue(false),
}));

jest.mock("../../helpers/sportsbook-betting", () => ({
  getRacingMetadata: jest.fn(),
  mapSportsbookOddsToOdds: jest.fn().mockReturnValue({ decimalOdds: 1.23 }),
}));
jest.mock("./sportsbook-markets/sportsbook-market-selectors", () => ({
  getSportsbookMarketById: jest.fn(),
  getSportsbookMarketRunnerById: jest.fn(),
  createSportsbookMarketByURNSelector: jest.fn(),
  createSportsbookMarketRunnerByRunnerAndMarketURNSelector: jest.fn(),
}));

jest.mock("./sport-events/sport-event-selectors", () => ({
  getSportEventByURN: jest.fn(),
}));

jest.mock("./sports/sport-selectors");
jest.mock("./sportsbook-runners/sportsbook-runner-selectors", () => ({
  createSportsbookRunnerByURNSelector: jest.fn(),
  createSportsbookRunnerStatusSelector: jest.fn(),
}));
jest.mock("./meetings/meeting-selectors", () => ({
  createMeetingByURNSelector: jest.fn(),
}));
jest.mock("./races/race-selectors", () => ({
  createRaceByURNSelector: jest.fn(),
}));
jest.mock("./race-runners/race-runners-selectors", () => ({
  createRaceRunnersByRaceURNSelector: jest.fn(),
}));
jest.mock("./greyhound-race-runners/greyhound-race-runners-selectors", () => ({
  createGreyhoundRaceRunnerByRaceAndSelectionIdSelector: jest.fn(),
  createGreyhoundRaceRunnersByRaceURNSelector: jest.fn(),
}));
jest.mock("./user-wallets/user-wallets-selectors", () => ({
  getUserWallets: jest.fn(() => userWalletsMock),
}));

jest.mock("./user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest.fn(),
}));

const getTennisFixtureByURN = jest.fn();

jest.mock("./tennis-fixture/tennis-fixture-selectors", () => ({
  createTennisFixtureByURNSelector: jest.fn(() => getTennisFixtureByURN),
}));

const getBaseballFixtureByURN = jest.fn();

jest.mock("./baseball-fixture/baseball-fixture-selectors", () => ({
  createBaseballFixtureByURNSelector: jest.fn(() => getBaseballFixtureByURN),
}));

const getBasketballFixtureByURN = jest.fn();

jest.mock("./basketball-fixture/basketball-fixture-selectors", () => ({
  createBasketballFixtureByURNSelector: jest.fn(() => getBasketballFixtureByURN),
}));

const getCricketFixtureByURN = jest.fn();

jest.mock("./cricket-fixture/cricket-fixture-selectors", () => ({
  createCricketFixtureByURNSelector: jest.fn(() => getCricketFixtureByURN),
}));

const getTableTennisFixtureByURN = jest.fn();

jest.mock("./table-tennis-fixture/table-tennis-fixture-selectors", () => ({
  createTableTennisFixtureByURNSelector: jest.fn(() => getTableTennisFixtureByURN),
}));

const getIceHockeyFixtureByURN = jest.fn();

jest.mock("./ice-hockey-fixture/ice-hockey-fixture-selectors", () => ({
  createIceHockeyFixtureByURNSelector: jest.fn(() => getIceHockeyFixtureByURN),
}));

const getRugbyUnionFixtureByURN = jest.fn();
const getRugbyLeagueFixtureByURN = jest.fn();
const getVolleyballFixtureByURN = jest.fn();

jest.mock("./rugby-union-fixture/rugby-union-fixture-selectors", () => ({
  createRugbyUnionFixtureByURNSelector: jest.fn(() => getRugbyUnionFixtureByURN),
}));

jest.mock("./rugby-league-fixture/rugby-league-fixture-selectors", () => ({
  createRugbyLeagueFixtureByURNSelector: jest.fn(() => getRugbyLeagueFixtureByURN),
}));

const getSnookerFixtureByURN = jest.fn();

jest.mock("./snooker-fixture/snooker-fixture-selectors", () => ({
  createSnookerFixtureByURNSelector: jest.fn(() => getSnookerFixtureByURN),
}));

jest.mock("./volleyball-fixture/volleyball-fixture-selectors", () => ({
  createVolleyballFixtureByURNSelector: jest.fn(() => getVolleyballFixtureByURN),
}));

const getAustralianRulesFixtureByURN = jest.fn();

jest.mock("./australian-rules-fixture/australian-rules-fixture-selectors", () => ({
  createAustralianRulesFixtureByURNSelector: jest.fn(() => getAustralianRulesFixtureByURN),
}));

const getDartsFixtureByURN = jest.fn();

jest.mock("./darts-fixture/darts-fixture-selectors", () => ({
  createDartsFixtureByURNSelector: jest.fn(() => getDartsFixtureByURN),
}));

jest.mock("./exchange-runners/exchange-runner-selectors", () => ({
  getExchangeRunnerByURN: jest.fn(),
  createExchangeRunnerWithoutOddsByRunnerURNSelector: jest.fn(() => jest.fn()),
}));

jest.mock("./exchange-markets/exchange-market-selectors", () => ({
  getExchangeMarketRunnerByURN: jest.fn(),
  createExchangeMarketSelector: jest.fn(() => jest.fn()),
  createExchangeMarketRunnerByMarketAndRunnerURNsSelector: jest.fn(() => jest.fn()),
}));

jest.mock("../betting/exchange-betting/exchange-betting-selectors", () => ({
  createBettingMarketRunnersPositionSelector: jest.fn(() => jest.fn()),
  createMarketPotentialBetsSelector: jest.fn(() => jest.fn()),
}));

jest.mock("./virtual-market/virtual-market-selectors", () => ({
  createVirtualMarketByIdSelector: jest.fn().mockReturnValue(jest.fn()),
  createVirtualMarketByRunnerURNSelector: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock("./virtual-runner/virtual-runner-selectors", () => ({
  createVirtualRunnerByIdSelector: jest.fn().mockReturnValue(jest.fn()),
  createVirtualRunnerByURNSelector: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock("./virtual-event/virtual-event-selectors", () => ({
  createVirtualEventByURNSelector: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock("./virtual-sport/virtual-sport-selectors", () => ({
  createVirtualSportByURNSelector: jest.fn().mockReturnValue(jest.fn()),
}));

const stateMock = {
  betting: {},
  entities: {
    footballfixtures: {
      fakeFixtureUrn: {
        urn: "fakeFixtureUrn",
        sportevent: "fakeSportEventUrn",
      },
    },
    tennisfixtures: {
      fakeFixtureUrn: {
        urn: "fakeFixtureUrn",
        sportevent: "fakeSportEventUrn",
      },
    },
    baseballfixtures: {
      fakeFixtureUrn: {
        urn: "fakeFixtureUrn",
        sportevent: "fakeSportEventUrn",
      },
    },
    basketballfixtures: {
      fakeFixtureUrn: {
        urn: "fakeFixtureUrn",
        sportevent: "fakeSportEventUrn",
      },
    },
    cricketfixtures: {
      fakeFixtureUrn: {
        urn: "fakeFixtureUrn",
        sportevent: "fakeSportEventUrn",
      },
    },
    tabletennisfixtures: {
      fakeFixtureUrn: {
        urn: "fakeFixtureUrn",
        sportevent: "fakeSportEventUrn",
      },
    },
    americanfootballfixtures: {},
    icehockeyfixtures: {},
    rugbyunionfixtures: {},
    rugbyleaguefixtures: {},
    dartsfixtures: {},
    virtualrunners: {
      "runner:urn:1": {
        selectionId: 1,
      },
      "runner:urn:2": {
        selectionId: 2,
      },
    },
    sportevents: {
      fakeSportEventUrn: {
        urn: "fakeSportEventUrn",
        eventId: 29756552,
        competition: "XX",
        name: "A v B",
      },
    },
  },
};

describe("entities selectors", () => {
  beforeEach(jest.clearAllMocks);

  describe("getEntities", () => {
    it("should return entities", () => {
      expect(getEntities(stateMock)).toEqual(stateMock.entities);
    });
  });

  describe("createGetVirtualAddPayloadSelector", () => {
    describe("when there is no market for the payload creation", () => {
      it("should not return the mapped core payload", () => {
        createVirtualRunnerByURNSelector.mockReturnValue(jest.fn(() => ({ selectionId: 1 })));
        createVirtualMarketByRunnerURNSelector.mockReturnValue(jest.fn());

        const getVirtualAddPayload = createGetVirtualAddPayloadSelector();

        expect(getVirtualAddPayload({}, "urn:1")).toEqual(undefined);
      });
    });

    describe("when there is no runner for the payload creation", () => {
      it("should not return the mapped core payload", () => {
        createVirtualRunnerByURNSelector.mockReturnValue(jest.fn());
        createVirtualMarketByRunnerURNSelector.mockReturnValue(jest.fn());

        const getVirtualAddPayload = createGetVirtualAddPayloadSelector();

        expect(getVirtualAddPayload({}, "urn:1")).toEqual(undefined);
      });
    });

    describe("when there is all data present", () => {
      it("should return the mapped core payload", () => {
        createVirtualRunnerByURNSelector.mockReturnValue(jest.fn(() => ({ selectionId: 1, handicap: 3 })));
        createVirtualMarketByRunnerURNSelector.mockReturnValue(
          jest.fn(() => ({ marketId: "924.1", eachWayPlaces: "3", eachWayFraction: 5, hasEachWay: true })),
        );

        const getVirtualAddPayload = createGetVirtualAddPayloadSelector();

        expect(getVirtualAddPayload({}, "urn:1")).toEqual({
          combinationDefaults: {
            eachWayOdds: null,
            eachWayPlaces: "3",
            eachWayPlacesFraction: { numerator: 1, denominator: 5 },
            isEachWayAvailable: true,
            isEachWaySelected: false,
            isSPAvailable: false,
            isSPSelected: false,
            stake: null,
          },
          displayOdds: { decimalOdds: 1.23 },
          legType: "SIMPLE_SELECTION",
          odds: { decimalOdds: 1.23 },
          runners: [{ marketId: "924.1", selectionId: 1 }],
        });
      });
    });
  });

  describe("createGetAddPayloadSelector", () => {
    describe("when there is no market for the payload creation", () => {
      it("should not return the mapped core payload", () => {
        createSportsbookRunnerByURNSelector.mockReturnValue(jest.fn(() => ({ selectionId: 1 })));
        createSportsbookMarketByURNSelector.mockReturnValue(jest.fn());

        const getAddPayload = createGetAddPayloadSelector();

        expect(getAddPayload({}, "urn:1")).toEqual(undefined);
      });
    });

    describe("when there is no runner for the payload creation", () => {
      it("should not return the mapped core payload", () => {
        createSportsbookRunnerByURNSelector.mockReturnValue(jest.fn());
        createSportsbookMarketByURNSelector.mockReturnValue(jest.fn());

        const getAddPayload = createGetAddPayloadSelector();

        expect(getAddPayload({}, "urn:1")).toEqual(undefined);
      });
    });

    describe("when there are is all data", () => {
      it("should return the mapped core payload", () => {
        createSportsbookRunnerByURNSelector.mockReturnValue(jest.fn(() => ({ selectionId: 1, handicap: 3 })));
        createSportsbookMarketByURNSelector.mockReturnValue(
          jest.fn(() => ({
            marketId: "924.1",
            eachWayPlaces: "3",
            eachWayPlaceFraction: "1/5",
            eachWayAvailable: true,
          })),
        );

        const getAddPayload = createGetAddPayloadSelector();

        expect(getAddPayload({}, "urn:1")).toEqual({
          combinationDefaults: {
            eachWayOdds: { decimalOdds: 1.23 },
            eachWayPlaces: "3",
            eachWayPlacesFraction: "1/5",
            isEachWayAvailable: true,
            isEachWaySelected: false,
            isSPAvailable: false,
            isSPSelected: false,
            stake: null,
          },
          displayOdds: { decimalOdds: 1.23 },
          legType: "SIMPLE_SELECTION",
          odds: { decimalOdds: 1.23 },
          groupId: undefined,
          isBoosted: undefined,
          runners: [{ handicap: 3, marketId: "924.1", selectionId: 1 }],
        });
      });
    });

    describe("when there are is all data and boostedIdentification fields", () => {
      it("should return the correct mapped core payload", () => {
        createSportsbookRunnerByURNSelector.mockReturnValue(jest.fn(() => ({ selectionId: 1, handicap: 3 })));
        createSportsbookMarketByURNSelector.mockReturnValue(
          jest.fn(() => ({
            marketId: "924.1",
            eachWayPlaces: "3",
            eachWayPlaceFraction: "1/5",
            eachWayAvailable: true,
          })),
        );

        const getAddPayload = createGetAddPayloadSelector();
        const payload = getAddPayload({}, "urn:1", { isBoostedLeg: true, groupId: "bo-1234" });
        expect(payload).toEqual({
          combinationDefaults: {
            eachWayOdds: { decimalOdds: 1.23 },
            eachWayPlaces: "3",
            eachWayPlacesFraction: "1/5",
            isEachWayAvailable: true,
            isEachWaySelected: false,
            isSPAvailable: false,
            isSPSelected: false,
            stake: null,
          },
          displayOdds: { decimalOdds: 1.23 },
          legType: "SIMPLE_SELECTION",
          odds: { decimalOdds: 1.23 },
          groupId: "bo-1234",
          isBoosted: true,
          runners: [{ handicap: 3, marketId: "924.1", selectionId: 1 }],
        });
      });
    });
  });

  describe("createGetMarketRunnerURNAssociationSelector", () => {
    describe("when there is no market for the id association", () => {
      it("should not return the urn association", () => {
        getSportsbookMarketById.mockReturnValue(undefined);

        const idAssociationMap = [{ marketId: "924.1", selectionId: 1 }];
        const getMarketRunnerURNAssociation = createGetMarketRunnerURNAssociationSelector();

        expect(getMarketRunnerURNAssociation({ sportsbookmarkets: {} }, idAssociationMap)).toEqual([]);
      });
    });

    describe("when there is no runner for the urn association", () => {
      it("should not return the urn association", () => {
        getSportsbookMarketById.mockReturnValue({});
        getSportsbookMarketRunnerById.mockReturnValue(undefined);

        const idAssociationMap = [{ marketId: "924.1", selectionId: 1 }];
        const getMarketRunnerURNAssociation = createGetMarketRunnerURNAssociationSelector();

        expect(getMarketRunnerURNAssociation({ sportsbookmarkets: {} }, idAssociationMap)).toEqual([]);
      });
    });

    describe("when there are all id associations available", () => {
      it("should return the mapped urn association", () => {
        getSportsbookMarketById.mockReturnValue({ urn: "urn:924.1", runners: [{ marketId: "924.1", selectionId: 1 }] });
        getSportsbookMarketRunnerById.mockReturnValue({ urn: "urn:1" });

        const idAssociationMap = [{ marketId: "924.1", selectionId: 1 }];
        const getMarketRunnerURNAssociation = createGetMarketRunnerURNAssociationSelector();

        expect(getMarketRunnerURNAssociation({ sportsbookmarkets: {} }, idAssociationMap)).toEqual([
          { marketUrn: "urn:924.1", runnerUrn: "urn:1" },
        ]);
      });
    });
  });

  describe("createGetVirtualMarketRunnerURNAssociationSelector", () => {
    describe("when there is no market for the id association", () => {
      it("should not return the urn association", () => {
        createVirtualMarketByIdSelector.mockReturnValue(jest.fn());

        const idAssociationMap = [{ marketId: "924.1", selectionId: 1 }];
        const getVirtualMarketRunnerURNAssociation = createGetVirtualMarketRunnerURNAssociationSelector();

        expect(
          getVirtualMarketRunnerURNAssociation({ virtualmarkets: {}, virtualrunners: {} }, idAssociationMap),
        ).toEqual([]);
      });
    });

    describe("when there is no runner for the urn association", () => {
      it("should not return the urn association", () => {
        createVirtualMarketByIdSelector.mockReturnValue(jest.fn(() => ({ runners: ["virtualurn:2"] })));

        const idAssociationMap = [{ marketId: "924.1", selectionId: 1 }];
        const getVirtualMarketRunnerURNAssociation = createGetVirtualMarketRunnerURNAssociationSelector();

        expect(
          getVirtualMarketRunnerURNAssociation(
            { virtualmarkets: {}, virtualrunners: { "virtualurn:2": { urn: "virtualurn:2", selectionId: 2 } } },
            idAssociationMap,
          ),
        ).toEqual([]);
      });
    });

    describe("when there are all id associations available", () => {
      it("should return the mapped urn association", () => {
        createVirtualMarketByIdSelector.mockReturnValue(
          jest.fn(() => ({ urn: "virtualurn:924.1", runners: ["virtualurn:1"] })),
        );

        const idAssociationMap = [{ marketId: "924.1", selectionId: 1 }];
        const getVirtualMarketRunnerURNAssociation = createGetVirtualMarketRunnerURNAssociationSelector();

        expect(
          getVirtualMarketRunnerURNAssociation(
            { virtualmarkets: {}, virtualrunners: { "virtualurn:1": { urn: "virtualurn:1", selectionId: 1 } } },
            idAssociationMap,
          ),
        ).toEqual([{ marketUrn: "virtualurn:924.1", runnerUrn: "virtualurn:1" }]);
      });
    });
  });

  describe("createGetMarketRunnerIdAssociationSelector", () => {
    describe("when there is no market for the id association", () => {
      it("should not return the urn association", () => {
        createSportsbookRunnerByURNSelector.mockReturnValue(jest.fn(() => ({ selectionId: 1 })));
        createSportsbookMarketByURNSelector.mockReturnValue(jest.fn());

        const urnAssociation = [{ marketUrn: "urn:924.1", runnerUrn: "urn:1" }];
        const getMarketRunnerIdAssociation = createGetMarketRunnerIdAssociationSelector();

        expect(getMarketRunnerIdAssociation({ sportsbookmarkets: {} }, urnAssociation)).toEqual(undefined);
      });
    });

    describe("when there is no runner for the urn association", () => {
      it("should not return the urn association", () => {
        createSportsbookRunnerByURNSelector.mockReturnValue(jest.fn());
        createSportsbookMarketByURNSelector.mockReturnValue(jest.fn());

        const urnAssociation = [{ marketUrn: "urn:924.1", runnerUrn: "urn:1" }];
        const getMarketRunnerIdAssociation = createGetMarketRunnerIdAssociationSelector();

        expect(getMarketRunnerIdAssociation({ sportsbookmarkets: {} }, urnAssociation)).toEqual(undefined);
      });
    });

    describe("when there are all id associations available", () => {
      it("should return the mapped urn association", () => {
        createSportsbookRunnerByURNSelector.mockReturnValue(jest.fn(() => ({ selectionId: 1, handicap: 3 })));
        createSportsbookMarketByURNSelector.mockReturnValue(jest.fn(() => ({ marketId: "924.1" })));

        const urnAssociation = [{ marketUrn: "urn:924.1", runnerUrn: "urn:1" }];
        const getMarketRunnerIdAssociation = createGetMarketRunnerIdAssociationSelector();

        expect(getMarketRunnerIdAssociation({ sportsbookmarkets: {} }, urnAssociation)).toEqual({
          marketId: "924.1",
          selectionId: 1,
          handicap: 3,
        });
      });
    });
  });

  describe("createGetVirtualMarketRunnerIdAssociationSelector", () => {
    describe("when there is no market for the id association", () => {
      it("should not return the urn association", () => {
        createVirtualRunnerByURNSelector.mockReturnValue(jest.fn(() => ({ selectionId: 1 })));
        createVirtualMarketByRunnerURNSelector.mockReturnValue(jest.fn());

        const urnAssociation = [{ marketUrn: "urn:924.1", runnerUrn: "urn:1" }];
        const getVirtualMarketRunnerIdAssociation = createGetVirtualMarketRunnerIdAssociationSelector();

        expect(getVirtualMarketRunnerIdAssociation({ sportsbookmarkets: {} }, urnAssociation)).toEqual(undefined);
      });
    });

    describe("when there is no runner for the urn association", () => {
      it("should not return the urn association", () => {
        createVirtualRunnerByURNSelector.mockReturnValue(jest.fn());
        createVirtualMarketByRunnerURNSelector.mockReturnValue(jest.fn());

        const urnAssociation = [{ marketUrn: "urn:924.1", runnerUrn: "urn:1" }];
        const getVirtualMarketRunnerIdAssociation = createGetVirtualMarketRunnerIdAssociationSelector();

        expect(getVirtualMarketRunnerIdAssociation({ sportsbookmarkets: {} }, urnAssociation)).toEqual(undefined);
      });
    });

    describe("when there are all id associations available", () => {
      it("should return the mapped urn association", () => {
        createVirtualRunnerByURNSelector.mockReturnValue(jest.fn(() => ({ selectionId: 1, handicap: 3 })));
        createVirtualMarketByRunnerURNSelector.mockReturnValue(jest.fn(() => ({ marketId: "924.1" })));

        const urnAssociation = [{ marketUrn: "urn:924.1", runnerUrn: "urn:1" }];
        const getVirtualMarketRunnerIdAssociation = createGetVirtualMarketRunnerIdAssociationSelector();

        expect(getVirtualMarketRunnerIdAssociation({ sportsbookmarkets: {} }, urnAssociation)).toEqual({
          marketId: "924.1",
          selectionId: 1,
        });
      });
    });
  });

  describe("createGetAddSelectionsPayloadSelector", () => {
    function setupSimpleResult() {
      getSportsbookMarketById.mockReturnValueOnce({
        marketId: "924.1",
        urn: "market:urn:924.1",
        sportevent: "SPORTEVENT:1",
        runners: [{ selectionId: 1 }],
      });
      getSportsbookMarketById.mockReturnValueOnce({
        marketId: "924.2",
        urn: "market:urn:924.2",
        sportevent: "SPORTEVENT:1",
        runners: [{ selectionId: 2 }],
      });
      getSportsbookMarketRunnerById.mockReturnValueOnce({ urn: "runner:urn:1", selectionId: 1 });
      getSportsbookMarketRunnerById.mockReturnValueOnce({ urn: "runner:urn:2", selectionId: 2 });

      return {
        legs: {
          "LEG:1": {
            groupId: null,
            isBoosted: false,
            runners: ["RUNNER:1"],
          },
          "LEG:2": {
            groupId: null,
            isBoosted: false,
            runners: ["RUNNER:2"],
          },
        },
        runners: {
          "RUNNER:1": {
            marketId: "924.1",
            selectionId: 1,
          },
          "RUNNER:2": {
            marketId: "924.2",
            selectionId: 2,
          },
        },
      };
    }

    function setupBoostedResult() {
      getSportsbookMarketById.mockReturnValueOnce({
        marketId: "924.1",
        urn: "market:urn:924.1",
        sportevent: "SPORTEVENT:1",
        runners: [{ selectionId: 1 }],
      });
      getSportsbookMarketById.mockReturnValueOnce({
        marketId: "924.2",
        urn: "market:urn:924.2",
        sportevent: "SPORTEVENT:1",
        runners: [{ selectionId: 2 }],
      });
      getSportsbookMarketById.mockReturnValueOnce({
        marketId: "924.3",
        urn: "market:urn:924.3",
        sportevent: "SPORTEVENT:1",
        runners: [{ selectionId: 3 }],
      });
      getSportsbookMarketById.mockReturnValueOnce({
        marketId: "924.4",
        urn: "market:urn:924.4",
        sportevent: "SPORTEVENT:1",
        runners: [{ selectionId: 4 }],
      });
      getSportsbookMarketRunnerById.mockReturnValueOnce({ urn: "runner:urn:1", selectionId: 1 });
      getSportsbookMarketRunnerById.mockReturnValueOnce({ urn: "runner:urn:2", selectionId: 2 });
      getSportsbookMarketRunnerById.mockReturnValueOnce({ urn: "runner:urn:3", selectionId: 3 });
      getSportsbookMarketRunnerById.mockReturnValueOnce({ urn: "runner:urn:4", selectionId: 4 });

      return {
        legs: {
          "LEG:1-123": {
            groupId: "123",
            isBoosted: true,
            runners: ["RUNNER:1"],
          },
          "LEG:2-123": {
            groupId: "123",
            isBoosted: true,
            runners: ["RUNNER:2"],
          },
          "LEG:1-321": {
            groupId: "321",
            isBoosted: true,
            runners: ["RUNNER:3"],
          },
          "LEG:2-321": {
            groupId: "321",
            isBoosted: true,
            runners: ["RUNNER:4"],
          },
        },
        runners: {
          "RUNNER:1": {
            marketId: "924.1",
            selectionId: 1,
          },
          "RUNNER:2": {
            marketId: "924.2",
            selectionId: 2,
          },
          "RUNNER:3": {
            marketId: "924.3",
            selectionId: 3,
          },
          "RUNNER:4": {
            marketId: "924.4",
            selectionId: 4,
          },
        },
      };
    }

    describe("when there are simple legs", () => {
      it("should return them all grouped under SIMPLE", () => {
        const getAddSelectionsPayload = createGetAddSelectionsPayloadSelector();
        const result = setupSimpleResult();

        expect(getAddSelectionsPayload(stateMock.entities, result).SIMPLE).toEqual({
          selections: [
            { marketUrn: "market:urn:924.1", runnerUrn: "runner:urn:1" },
            { marketUrn: "market:urn:924.2", runnerUrn: "runner:urn:2" },
          ],
        });
      });
    });

    describe("when there are boosted legs in the result", () => {
      it("should group those legs by groupId", () => {
        const getAddSelectionsPayload = createGetAddSelectionsPayloadSelector();
        const result = setupBoostedResult();

        expect(getAddSelectionsPayload(stateMock.entities, result)["123"]).toBeDefined();
        expect(getAddSelectionsPayload(stateMock.entities, result)["321"]).toBeDefined();
      });

      it("should group the correct selections for each boost group", () => {
        const getAddSelectionsPayload = createGetAddSelectionsPayloadSelector();
        const result = setupBoostedResult();

        expect(getAddSelectionsPayload(stateMock.entities, result)["123"].selections).toEqual([
          { marketUrn: "market:urn:924.1", runnerUrn: "runner:urn:1" },
          { marketUrn: "market:urn:924.2", runnerUrn: "runner:urn:2" },
        ]);
        expect(getAddSelectionsPayload(stateMock.entities, result)["321"].selections).toEqual([
          { marketUrn: "market:urn:924.3", runnerUrn: "runner:urn:3" },
          { marketUrn: "market:urn:924.4", runnerUrn: "runner:urn:4" },
        ]);
      });

      it("should group the correct options for each boost group", () => {
        const getAddSelectionsPayload = createGetAddSelectionsPayloadSelector();
        const result = setupBoostedResult();

        expect(getAddSelectionsPayload(stateMock.entities, result)["123"].options).toEqual({
          groupId: "123",
          isBoostedLeg: true,
        });
        expect(getAddSelectionsPayload(stateMock.entities, result)["321"].options).toEqual({
          groupId: "321",
          isBoostedLeg: true,
        });
      });
    });
  });

  describe("createGetVirtualAddSelectionsPayloadSelector", () => {
    function setupSimpleResult() {
      createVirtualMarketByIdSelector().mockReturnValueOnce({
        marketId: "924.1",
        urn: "market:urn:924.1",
        sportevent: "SPORTEVENT:1",
        runners: ["runner:urn:1"],
      });
      createVirtualMarketByIdSelector().mockReturnValueOnce({
        marketId: "924.2",
        urn: "market:urn:924.2",
        sportevent: "SPORTEVENT:1",
        runners: ["runner:urn:2"],
      });

      return {
        legs: {
          "LEG:1": {
            groupId: null,
            isBoosted: false,
            runners: ["RUNNER:1"],
          },
          "LEG:2": {
            groupId: null,
            isBoosted: false,
            runners: ["RUNNER:2"],
          },
        },
        runners: {
          "RUNNER:1": {
            marketId: "924.1",
            selectionId: 1,
          },
          "RUNNER:2": {
            marketId: "924.2",
            selectionId: 2,
          },
        },
      };
    }

    describe("when there are simple legs", () => {
      it("should return them all grouped under SIMPLE", () => {
        const getVirtualAddSelectionsPayload = createGetVirtualAddSelectionsPayloadSelector();
        const result = setupSimpleResult();

        expect(getVirtualAddSelectionsPayload(stateMock.entities, result).SIMPLE).toEqual({
          selections: [
            { marketUrn: "market:urn:924.1", runnerUrn: "runner:urn:1" },
            { marketUrn: "market:urn:924.2", runnerUrn: "runner:urn:2" },
          ],
        });
      });
    });
  });

  describe("createBettingRunnersMetadataSelector", () => {
    describe("when there is no sportsbook market for the betting runner", () => {
      it("should return the map without the runner", () => {
        const state = {
          betting: {
            sportsbookBetting: { runners: { "RUNNER:1": { marketId: "1.1", selectionId: 1 } } },
          },
          entities: {
            sportsbookmarkets: {},
          },
        };

        getSportsbookMarketById.mockReturnValue(undefined);

        expect(createBettingRunnersMetadataSelector()(state)["RUNNER:1"]).toBeUndefined();
      });
    });

    describe("when there is no sportsbook runner for the betting runner", () => {
      it("should return the map without the runner", () => {
        const state = {
          betting: {
            sportsbookBetting: { runners: { "RUNNER:1": { marketId: "1.1", selectionId: 1 } } },
          },
          entities: {
            sportsbookmarkets: { 1.1: { marketId: "1.1", runners: [] } },
          },
        };

        getSportsbookMarketById.mockReturnValue({ 1.1: { marketId: "1.1", runners: [] } });
        getSportsbookMarketRunnerById.mockReturnValue(undefined);

        expect(createBettingRunnersMetadataSelector()(state)["RUNNER:1"]).toBeUndefined();
      });
    });

    describe("when there is no sportsbook event for the market", () => {
      it("should return the map without the runner", () => {
        const state = {
          betting: {
            sportsbookBetting: { runners: { "RUNNER:1": { marketId: "1.1", selectionId: 1 } } },
          },
          entities: {
            sportsbookmarkets: { 1.1: { marketId: "1.1", sportevent: "SPORTEVENT:1", runners: [{ selectionId: 1 }] } },
          },
        };

        getSportsbookMarketById.mockReturnValue({
          marketId: "1.1",
          sportevent: "SPORTEVENT:1",
          runners: [{ selectionId: 1 }],
        });
        getSportsbookMarketRunnerById.mockReturnValue({ selectionId: 1 });
        getSportEventByURN.mockReturnValue(undefined);

        expect(createBettingRunnersMetadataSelector()(state)["RUNNER:1"]).toBeUndefined();
      });
    });

    describe("when there is no sport for the market", () => {
      it("should return the map without the runner", () => {
        const state = {
          betting: {
            sportsbookBetting: { runners: { "RUNNER:1": { marketId: "1.1", selectionId: 1 } } },
          },
          entities: {
            sportsbookmarkets: {
              1.1: { marketId: "1.1", hierarchy: { sportevent: "SPORTEVENT:1" }, runners: [{ selectionId: 1 }] },
            },
          },
        };

        getSportsbookMarketById.mockReturnValue({
          marketId: "1.1",
          sportevent: "SPORTEVENT:1",
          sport: "SPORT:1",
          runners: [{ selectionId: 1 }],
        });
        getSportsbookMarketRunnerById.mockReturnValue({ selectionId: 1 });
        getSportEventByURN.mockReturnValue({ name: "Event Name" });
        getSportByURN.mockReturnValue(undefined);

        expect(createBettingRunnersMetadataSelector()(state)["RUNNER:1"]).toBeUndefined();
      });
    });

    describe("when there is a race and a meeting", () => {
      it("should return the map with the racing metadata", () => {
        const raceRunner = {
          urn: "ppb:tbd:racerunner:1.14.1200228.1/24550116",
          selectionId: 24550116,
          raceURN: "ppb:race:1.14.1200228.1",
          details: {
            trainerName: "",
            jockeyName: "Brian Hughes",
            saddleCloth: 8,
            silk: "http://tbdui.qa.internal/images/silk.png",
            draw: 0,
          },
          horse: {
            name: "VOLT FACE (FR)",
            sirName: "",
            damName: "",
            damSirName: "",
            age: 4,
            color: "",
            sex: "",
          },
        };

        const greyhoundRunner = {
          urn: "ppb:tbd:greyhoundracerunners:1.14.1200228.1/24550116",
          trap: 1,
        };

        const state = {
          betting: {
            sportsbookBetting: {
              runners: {
                "RUNNER:1": { marketId: "1.1", selectionId: 1 },
                "RUNNER:2": { marketId: "1.2", selectionId: 1 },
              },
            },
          },
          entities: {
            racerunners: {
              "ppb:tbd:racerunner:1.14.1200228.1/24550116": {
                ...raceRunner,
              },
            },
            greyhoundracerunners: {
              "ppb:tbd:greyhoundracerunners:1.14.1200228.1/24550116": {
                ...greyhoundRunner,
              },
            },
            sportsbookmarkets: {
              1.1: {
                marketId: "1.1",
                marketType: "WIN",
                sportevent: "SPORTEVENT:1",
                name: "Market Name 1",
                runners: [{ selectionId: 1, name: "Runner Name 1" }],
              },
              1.2: {
                marketId: "1.2",
                marketType: "MATCH_ODDS_90",
                sportevent: "SPORTEVENT:1",
                name: "Market Name 2",
                runners: [{ selectionId: 1, name: "Runner Name 2" }],
              },
            },
            sports: {
              "SPORT:1": {
                name: "Sport Name",
                sportId: 1,
              },
            },
          },
        };

        getSportsbookMarketById.mockReturnValueOnce({
          marketId: "1.1",
          marketType: "WIN",
          marketTypeName: "Win",
          sport: "SPORT:1",
          hierarchy: {
            meeting: "ppb:tbd:meeting:1",
            race: "ppb:tbd:race:11.11",
          },
          name: "Market Name 1",
          runners: [{ selectionId: 1, name: "Runner Name 1" }],
        });
        getSportsbookMarketById.mockReturnValueOnce({
          marketId: "1.2",
          marketType: "MATCH_ODDS_90",
          marketTypeName: "Match Odds 90",
          sport: "SPORT:1",
          hierarchy: {
            meeting: "ppb:tbd:meeting:1",
            race: "ppb:tbd:race:11.11",
          },
          name: "Market Name 2",
          runners: [{ selectionId: 1, name: "Runner Name 2" }],
        });
        getSportsbookMarketRunnerById.mockReturnValueOnce({
          selectionId: 1,
          name: "Runner Name 1",
          urn: "runner:urn:1",
        });
        getSportsbookMarketRunnerById.mockReturnValueOnce({
          selectionId: 1,
          name: "Runner Name 2",
          urn: "runner:urn:2",
        });
        getSportEventByURN.mockReturnValue({ name: "Event Name" });
        getSportByURN.mockReturnValue({ name: "Sport Name", sportId: 1 });

        const getRaceByURN = jest.fn().mockReturnValue({ race: "race" });
        createRaceByURNSelector.mockReturnValue(getRaceByURN);

        const getRaceRunnerByURN = jest.fn().mockReturnValue(raceRunner);
        createRaceRunnersByRaceURNSelector.mockReturnValue(getRaceRunnerByURN);

        const getMeetingByURN = jest.fn().mockReturnValue({
          meeting: "meeting",
          country: "GB",
        });
        createMeetingByURNSelector.mockReturnValue(getMeetingByURN);

        isRaceHierarchy.mockReturnValue(true);
        getRacingMetadata.mockReturnValue({ racing: "racing", meetingCountry: "GB" });

        createGreyhoundRaceRunnerByRaceAndSelectionIdSelector.mockReturnValue(jest.fn().mockReturnValue({}));

        expect(createBettingRunnersMetadataSelector()(state)).toEqual({
          "RUNNER:1": {
            marketName: "Market Name 1",
            marketType: "WIN",
            runnerName: "Runner Name 1",
            sportId: 1,
            sportName: "Sport Name",
            marketTypeName: "Win",
            racing: { racing: "racing", meetingCountry: "GB" },
            type: "RACING",
            bettingGroup: "REAL",
            runnerUrn: "runner:urn:1",
            is90Min: false,
          },
          "RUNNER:2": {
            marketName: "Market Name 2",
            marketType: "MATCH_ODDS_90",
            runnerName: "Runner Name 2",
            sportId: 1,
            sportName: "Sport Name",
            marketTypeName: "Match Odds 90",
            racing: { racing: "racing", meetingCountry: "GB" },
            type: "RACING",
            bettingGroup: "REAL",
            runnerUrn: "runner:urn:2",
            is90Min: false,
          },
        });
      });
    });

    describe("when there is all data", () => {
      beforeEach(() => {
        getSportsbookMarketById.mockReturnValueOnce({
          marketId: "1.1",
          hierarchy: {
            sportevent: "SPORTEVENT:1",
          },
          marketType: "Market Type",
          isSuperSub: true,
          sport: "SPORT:1",
          name: "Market Name 1",
          runners: [{ selectionId: 1, name: "Runner Name 1" }],
        });
        getSportsbookMarketById.mockReturnValueOnce({
          marketId: "1.2",
          marketType: "MATCH_ODDS_90",
          isSuperSub: false,
          hierarchy: {
            sportevent: "SPORTEVENT:1",
          },
          sport: "SPORT:1",
          name: "Market Name 2",
          runners: [{ selectionId: 1, name: "Runner Name 2" }],
        });
        getSportsbookMarketRunnerById.mockReturnValueOnce({
          selectionId: 1,
          name: "Runner Name 1",
          urn: "runner:urn:1",
        });
        getSportsbookMarketRunnerById.mockReturnValueOnce({
          selectionId: 1,
          name: "Runner Name 2",
          urn: "runner:urn:2",
        });
        getSportEventByURN.mockReturnValue({ name: "Event Name", urn: "event:urn" });
        getSportByURN.mockReturnValue({ name: "Sport Name", sportId: 1 });
        isRaceHierarchy.mockReturnValue(false);
      });

      const state = {
        betting: {
          sportsbookBetting: {
            runners: {
              "RUNNER:1": { marketId: "1.1", selectionId: 1 },
              "RUNNER:2": { marketId: "1.2", selectionId: 1 },
            },
          },
        },
        entities: {
          racerunners: {
            "RUNNER:1": { marketId: "1.1", selectionId: 1 },
            "RUNNER:2": { marketId: "1.2", selectionId: 1 },
          },
          sportsbookmarkets: {
            1.1: {
              marketId: "1.1",
              sportevent: "SPORTEVENT:1",
              name: "Market Name 1",
              runners: [{ selectionId: 1, name: "Runner Name 1" }],
            },
            1.2: {
              marketId: "1.2",
              marketType: "MATCH_ODDS_90",
              sportevent: "SPORTEVENT:1",
              name: "Market Name 2",
              runners: [{ selectionId: 1, name: "Runner Name 2" }],
            },
          },
          sports: {
            "SPORT:1": {
              name: "Sport Name",
              sportId: 1,
            },
          },
        },
      };

      it("should return the map with the runners", () => {
        expect(createBettingRunnersMetadataSelector()(state)).toEqual({
          "RUNNER:1": {
            eventName: "Event Name",
            marketName: "Market Name 1",
            marketType: "Market Type",
            runnerName: "Runner Name 1",
            eventUrn: "event:urn",
            sportId: 1,
            sportName: "Sport Name",
            runnerUrn: "runner:urn:1",
            type: "GENERIC",
            bettingGroup: "REAL",
            is90Min: false,
            isSuperSub: true,
          },
          "RUNNER:2": {
            eventName: "Event Name",
            marketName: "Market Name 2",
            marketType: "MATCH_ODDS_90",
            runnerName: "Runner Name 2",
            eventUrn: "event:urn",
            sportId: 1,
            sportName: "Sport Name",
            runnerUrn: "runner:urn:2",
            type: "GENERIC",
            bettingGroup: "REAL",
            is90Min: true,
            isSuperSub: false,
          },
        });
      });
    });

    describe("when the market is oddsboost", () => {
      describe("when there is no detailed runner information", () => {
        it("should return the map without runners previousOdds", () => {
          const getSportsbookRunner = jest.fn();
          createSportsbookRunnerByURNSelector.mockReturnValue(getSportsbookRunner);
          getSportsbookRunner.mockReturnValue(undefined);

          const state = {
            betting: {
              sportsbookBetting: {
                runners: {
                  "RUNNER:1": { marketId: "1.1", selectionId: 1 },
                },
              },
            },
            entities: {
              sportsbookBetting: {
                runners: {
                  "RUNNER:1": { marketId: "1.1", selectionId: 1 },
                },
              },
              sportsbookmarkets: {
                1.1: {
                  marketId: "1.1",
                  sportevent: "SPORTEVENT:1",
                  name: "Market Name 1",
                  runners: [{ selectionId: 1, name: "Runner Name 1" }],
                },
              },
              sports: {
                "SPORT:1": {
                  name: "Sport Name",
                  sportId: 1,
                },
              },
            },
          };

          getSportsbookMarketById.mockReturnValueOnce({
            marketId: "1.1",
            hierarchy: {
              sportevent: "SPORTEVENT:1",
            },
            sport: "SPORT:1",
            name: "Market Name 1",
            isOddsboostMarketType: true,
            runners: [{ selectionId: 1, name: "Runner Name 1" }],
          });
          getSportsbookMarketRunnerById.mockReturnValueOnce({
            selectionId: 1,
            name: "Runner Name 1",
            urn: "runner:urn:1",
          });
          getSportEventByURN.mockReturnValue({ name: "Event Name", urn: "event:urn" });
          getSportByURN.mockReturnValue({ name: "Sport Name", sportId: 1 });

          expect(createBettingRunnersMetadataSelector()(state)).toEqual({
            "RUNNER:1": {
              eventName: "Event Name",
              marketName: "Market Name 1",
              runnerName: "Runner Name 1",
              eventUrn: "event:urn",
              sportId: 1,
              sportName: "Sport Name",
              runnerUrn: "runner:urn:1",
              previousOdds: undefined,
              isOddsboostMarketType: true,
              type: "GENERIC",
              bettingGroup: "REAL",
              is90Min: false,
            },
          });
        });
      });

      describe("when runner does not have previousOdds", () => {
        it("should return the map without runners previousOdds", () => {
          const getSportsbookRunner = jest.fn();
          createSportsbookRunnerByURNSelector.mockReturnValue(getSportsbookRunner);
          getSportsbookRunner.mockReturnValue({});

          const state = {
            betting: {
              sportsbookBetting: {
                runners: {
                  "RUNNER:1": { marketId: "1.1", selectionId: 1 },
                },
              },
            },
            entities: {
              sportsbookmarkets: {
                1.1: {
                  marketId: "1.1",
                  sportevent: "SPORTEVENT:1",
                  name: "Market Name 1",
                  runners: [{ selectionId: 1, name: "Runner Name 1" }],
                },
              },
              sports: {
                "SPORT:1": {
                  name: "Sport Name",
                  sportId: 1,
                },
              },
            },
          };

          getSportsbookMarketById.mockReturnValueOnce({
            marketId: "1.1",
            hierarchy: {
              sportevent: "SPORTEVENT:1",
            },
            sport: "SPORT:1",
            name: "Market Name 1",
            isOddsboostMarketType: true,
            runners: [{ selectionId: 1, name: "Runner Name 1" }],
          });
          getSportsbookMarketRunnerById.mockReturnValueOnce({
            selectionId: 1,
            name: "Runner Name 1",
            urn: "runner:urn:1",
          });
          getSportEventByURN.mockReturnValue({ name: "Event Name", urn: "event:urn" });
          getSportByURN.mockReturnValue({ name: "Sport Name", sportId: 1 });

          expect(createBettingRunnersMetadataSelector()(state)).toEqual({
            "RUNNER:1": {
              eventName: "Event Name",
              marketName: "Market Name 1",
              runnerName: "Runner Name 1",
              eventUrn: "event:urn",
              sportId: 1,
              sportName: "Sport Name",
              runnerUrn: "runner:urn:1",
              previousOdds: undefined,
              isOddsboostMarketType: true,
              type: "GENERIC",
              bettingGroup: "REAL",
              is90Min: false,
            },
          });
        });
      });

      describe("when runner has previousOdds", () => {
        it("should return the map with runners previousOdds", () => {
          const getSportsbookRunner = jest.fn();
          createSportsbookRunnerByURNSelector.mockReturnValue(getSportsbookRunner);
          getSportsbookRunner.mockReturnValue({
            previousOdds: ["PREVIOUS_ODDS", "ANOTHER_PREVIOUS_ODDS"],
          });

          const state = {
            betting: {
              sportsbookBetting: {
                runners: {
                  "RUNNER:1": { marketId: "1.1", selectionId: 1 },
                },
              },
            },
            entities: {
              sportsbookmarkets: {
                1.1: {
                  marketId: "1.1",
                  sportevent: "SPORTEVENT:1",
                  name: "Market Name 1",
                  runners: [{ selectionId: 1, name: "Runner Name 1" }],
                },
              },
              sports: {
                "SPORT:1": {
                  name: "Sport Name",
                  sportId: 1,
                },
              },
            },
          };

          getSportsbookMarketById.mockReturnValueOnce({
            marketId: "1.1",
            hierarchy: {
              sportevent: "SPORTEVENT:1",
            },
            sport: "SPORT:1",
            name: "Market Name 1",
            isOddsboostMarketType: true,
            runners: [{ selectionId: 1, name: "Runner Name 1" }],
          });
          getSportsbookMarketRunnerById.mockReturnValueOnce({
            selectionId: 1,
            name: "Runner Name 1",
            urn: "runner:urn:1",
          });
          getSportEventByURN.mockReturnValue({ name: "Event Name" });
          getSportByURN.mockReturnValue({ name: "Sport Name", sportId: 1 });

          expect(createBettingRunnersMetadataSelector()(state)).toEqual({
            "RUNNER:1": {
              eventName: "Event Name",
              marketName: "Market Name 1",
              runnerName: "Runner Name 1",
              sportId: 1,
              sportName: "Sport Name",
              runnerUrn: "runner:urn:1",
              previousOdds: ["PREVIOUS_ODDS", "ANOTHER_PREVIOUS_ODDS"],
              isOddsboostMarketType: true,
              type: "GENERIC",
              bettingGroup: "REAL",
              is90Min: false,
            },
          });
        });
      });
    });
  });

  describe("createVirtualBettingRunnersMetadataSelector", () => {
    describe("when there is no virtual market for the betting runner", () => {
      it("should return the map without the runner", () => {
        const state = {
          betting: {
            sportsbookBetting: { runners: { "RUNNER:1": { marketId: "1.1", selectionId: 1 } } },
          },
          entities: {
            virtualmarkets: {},
          },
        };

        createVirtualMarketByIdSelector.mockReturnValue(jest.fn().mockReturnValue(undefined));

        expect(createVirtualBettingRunnersMetadataSelector()(state)["RUNNER:1"]).toBeUndefined();
      });
    });

    describe("when there is no virtual runner for the betting runner", () => {
      it("should return the map without the runner", () => {
        const state = {
          betting: {
            sportsbookBetting: { runners: { "RUNNER:1": { marketId: "1.1", selectionId: 1 } } },
          },
          entities: {
            virtualmarkets: { 1.1: { marketId: "1.1", runners: [] } },
            virtualrunners: {},
          },
        };

        createVirtualMarketByIdSelector.mockReturnValue(jest.fn().mockReturnValue({}));
        createVirtualRunnerByIdSelector.mockReturnValue(jest.fn().mockReturnValue(undefined));
        createVirtualSportByURNSelector.mockReturnValue(jest.fn().mockReturnValue({}));

        expect(createVirtualBettingRunnersMetadataSelector()(state)["RUNNER:1"]).toBeUndefined();
      });
    });

    describe("when there is no virtual sport for the market", () => {
      it("should return the map without the runner", () => {
        const state = {
          betting: {
            sportsbookBetting: { runners: { "RUNNER:1": { marketId: "1.1", selectionId: 1 } } },
          },
          entities: {
            virtualmarkets: { 1.1: { marketId: "1.1", sport: "SPORTEVENT:1", runners: [{ selectionId: 1 }] } },
            virtualrunners: { "virtualRunner:1": { selectionId: 1 } },
          },
        };

        createVirtualMarketByIdSelector.mockReturnValue(jest.fn().mockReturnValue({}));
        createVirtualRunnerByIdSelector.mockReturnValue(jest.fn().mockReturnValue({}));
        createVirtualSportByURNSelector.mockReturnValue(jest.fn().mockReturnValue(undefined));

        expect(createVirtualBettingRunnersMetadataSelector()(state)["RUNNER:1"]).toBeUndefined();
      });
    });

    describe("when there is no event for the market", () => {
      it("should return the map without the runner", () => {
        const state = {
          betting: {
            sportsbookBetting: { runners: { "RUNNER:1": { marketId: "1.1", selectionId: 1 } } },
          },
          entities: {
            virtualmarkets: { 1.1: { marketId: "1.1", sport: "SPORTEVENT:1", runners: [{ selectionId: 1 }] } },
            virtualrunners: { "virtualRunner:1": { selectionId: 1 } },
            virtualsports: { "SPORTEVENT:1": { urn: "SPORTEVENT:1" } },
          },
        };

        createVirtualMarketByIdSelector.mockReturnValue(jest.fn().mockReturnValue({}));
        createVirtualRunnerByIdSelector.mockReturnValue(jest.fn().mockReturnValue({}));
        createVirtualSportByURNSelector.mockReturnValue(jest.fn().mockReturnValue({}));
        createVirtualEventByURNSelector.mockReturnValue(jest.fn().mockReturnValue(undefined));

        expect(createVirtualBettingRunnersMetadataSelector()(state)["RUNNER:1"]).toBeUndefined();
      });
    });

    describe("when the sport kind is RACING", () => {
      it("should return the map with the racing metadata", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              runners: {
                "RUNNER:1": { marketId: "1.1", selectionId: 1 },
              },
            },
          },
          entities: {
            virtualmarkets: { 1.1: { marketId: "1.1", sport: "SPORTEVENT:1", runners: [{ selectionId: 1 }] } },
            virtualrunners: { "virtualRunner:1": { selectionId: 1 } },
            virtualsports: { "SPORTEVENT:1": { urn: "SPORTEVENT:1", name: { translationKey: "I18N.SPORT" } } },
          },
        };

        createVirtualMarketByIdSelector.mockReturnValue(
          jest.fn().mockReturnValue({
            marketId: "1.1",
            name: "Market Name 1",
            sport: "SPORTEVENT:1",
            runners: [{ selectionId: 1 }],
          }),
        );
        createVirtualRunnerByIdSelector.mockReturnValue(
          jest.fn().mockReturnValue({ urn: "runner:urn:1", name: "Runner Name 1", selectionId: 1 }),
        );
        createVirtualSportByURNSelector.mockReturnValue(
          jest.fn().mockReturnValue({
            sportId: 1,
            urn: "SPORTEVENT:1",
            name: { translationKey: "I18N.SPORT" },
            kind: "RACING",
          }),
        );
        createVirtualEventByURNSelector.mockReturnValue(
          jest.fn().mockReturnValue({ urn: "event:urn:1", name: "Event Name", venue: "Event Venue", openDate: "Date" }),
        );

        expect(createVirtualBettingRunnersMetadataSelector()(state)).toEqual({
          "RUNNER:1": {
            marketName: "Market Name 1",
            runnerName: "Runner Name 1",
            eventName: "Event Name",
            eventUrn: "event:urn:1",
            sportId: 1,
            sportName: "virtual:I18N.SPORT",
            marketTypeName: null,
            racing: { urn: "event:urn:1", venue: "Event Venue", time: "Date" },
            type: "RACING",
            runnerUrn: "runner:urn:1",
            bettingGroup: "VIRTUAL",
            is90Min: false,
          },
        });
      });
    });

    describe("when there is all data", () => {
      it("should return the map with the runners", () => {
        const state = {
          betting: {
            sportsbookBetting: {
              runners: {
                "RUNNER:1": { marketId: "1.1", selectionId: 1 },
              },
            },
          },
          entities: {
            virtualmarkets: { 1.1: { marketId: "1.1", sport: "SPORTEVENT:1", runners: [{ selectionId: 1 }] } },
            virtualrunners: { "virtualRunner:1": { selectionId: 1 } },
            virtualsports: { "SPORTEVENT:1": { urn: "SPORTEVENT:1", name: { translationKey: "I18N.SPORT" } } },
          },
        };

        createVirtualMarketByIdSelector.mockReturnValue(
          jest.fn().mockReturnValue({
            marketId: "1.1",
            name: "Market Name 1",
            sport: "SPORTEVENT:1",
            runners: [{ selectionId: 1 }],
          }),
        );
        createVirtualRunnerByIdSelector.mockReturnValue(
          jest.fn().mockReturnValue({ urn: "runner:urn:1", name: "Runner Name 1", selectionId: 1 }),
        );
        createVirtualSportByURNSelector.mockReturnValue(
          jest.fn().mockReturnValue({
            sportId: 1,
            urn: "SPORTEVENT:1",
            name: { translationKey: "I18N.SPORT" },
            kind: "FOOTBALL",
          }),
        );
        createVirtualEventByURNSelector.mockReturnValue(
          jest.fn().mockReturnValue({ urn: "event:urn:1", name: "Event Name", venue: "Event Venue", openDate: "Date" }),
        );

        expect(createVirtualBettingRunnersMetadataSelector()(state)).toEqual({
          "RUNNER:1": {
            marketName: "Market Name 1",
            runnerName: "Runner Name 1",
            eventName: "Event Name",
            eventUrn: "event:urn:1",
            sportId: 1,
            sportName: "virtual:I18N.SPORT",
            marketTypeName: null,
            racing: { urn: "event:urn:1", venue: "Event Venue", time: "Date" },
            type: "GENERIC",
            bettingGroup: "VIRTUAL",
            runnerUrn: "runner:urn:1",
            is90Min: false,
          },
        });
      });
    });
  });

  describe("createRaceWithRunnersByURNSelector", () => {
    const race = {
      urn: "ppb:race:1.14.1200228.1",
      meeting: "ppb:meeting:12290316",
      details: {
        name: "SPORT NOVICES",
        distance: 23.97,
        numberOfRunners: 3,
        scheduledTime: new Date("2020-02-28T14:00:00Z"),
        going: "Track Going",
        status: "GOING DOWN",
      },
      runners: ["ppb:tbd:racerunner:1.14.1200228.1/24550116"],
    };
    const raceRunner = {
      urn: "ppb:tbd:racerunner:1.14.1200228.1/24550116",
      selectionId: 24550116,
      raceURN: "ppb:race:1.14.1200228.1",
      details: {
        trainerName: "",
        jockeyName: "Brian Hughes",
        saddleCloth: 8,
        silk: "http://tbdui.qa.internal/images/silk.png",
        draw: 0,
      },
      horse: {
        name: "VOLT FACE (FR)",
        sirName: "",
        damName: "",
        damSirName: "",
        age: 4,
        color: "",
        sex: "",
      },
    };
    const entitiesMock = {
      races: {
        "ppb:race:1.14.1200228.1": {
          ...race,
        },
      },
      racerunners: {
        "ppb:tbd:racerunner:1.14.1200228.1/24550116": {
          ...raceRunner,
        },
      },
    };

    describe("when the race has race runners", () => {
      it("should retrieve the data object accordingly", () => {
        const getRaceByURN = jest.fn().mockReturnValue(race);
        createRaceByURNSelector.mockReturnValue(getRaceByURN);
        const getRaceRunnerByURN = jest.fn().mockReturnValue(raceRunner);
        createRaceRunnersByRaceURNSelector.mockReturnValue(getRaceRunnerByURN);

        expect(createRaceWithRunnersByURNSelector()(entitiesMock, "ppb:race:1.14.1200228.1")).toEqual({
          race,
          raceRunners: {
            urn: "ppb:tbd:racerunner:1.14.1200228.1/24550116",
            selectionId: 24550116,
            raceURN: "ppb:race:1.14.1200228.1",
            details: {
              trainerName: "",
              jockeyName: "Brian Hughes",
              saddleCloth: 8,
              silk: "http://tbdui.qa.internal/images/silk.png",
              draw: 0,
            },
            horse: {
              name: "VOLT FACE (FR)",
              sirName: "",
              damName: "",
              damSirName: "",
              age: 4,
              color: "",
              sex: "",
            },
          },
        });
      });
    });
  });

  describe("createSportsbookRunnerWithOddsAndMarketByURNSelector", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });
    const entitiesMock = {
      sportsbookmarkets: {
        "market:1": {
          urn: "market:1",
        },
      },
      sportsbookrunners: {
        "runner:1": {
          market: "market:1",
        },
      },
      preferences: {},
    };

    const changedState = {
      sportsbookmarkets: {
        "market:1": {
          urn: "market:2",
        },
      },
      sportsbookrunners: {
        "runner:1": {
          market: "market:2",
        },
      },
      preferences: {},
    };

    describe("when there is no sportsbook runner", () => {
      it("should return undefined", () => {
        createSportsbookRunnerByURNSelector.mockReturnValue(() => null);
        createSportsbookMarketByURNSelector.mockReturnValue(() => null);

        expect(createSportsbookRunnerWithOddsAndMarketByURNSelector()(entitiesMock, "URN")).toEqual(undefined);
      });
    });

    describe("when there is all the information required", () => {
      it("should return the correct sportsbook runner with odds and market", () => {
        createSportsbookRunnerByURNSelector.mockReturnValue(() => entitiesMock.sportsbookrunners["runner:1"]);
        createSportsbookMarketByURNSelector.mockReturnValue(() => entitiesMock.sportsbookmarkets["market:1"]);

        expect(createSportsbookRunnerWithOddsAndMarketByURNSelector()(entitiesMock, "runner:1")).toEqual({
          market: "market:1",
          runnerMarket: {
            urn: "market:1",
          },
        });
      });
    });

    describe("when calling the selector multiple times with the same information", () => {
      it("should return the same reference", () => {
        createSportsbookRunnerByURNSelector.mockReturnValue(() => entitiesMock.sportsbookrunners["runner:1"]);
        createSportsbookMarketByURNSelector.mockReturnValue(() => entitiesMock.sportsbookmarkets["market:1"]);

        const selector = createSportsbookRunnerWithOddsAndMarketByURNSelector();
        const firstCall = selector(entitiesMock, "runner:1");
        const secondCall = selector(entitiesMock, "runner:1");

        expect(firstCall === secondCall).toBe(true);
      });
    });

    describe("when calling the selector multiple times with different information", () => {
      it("should return a new reference", () => {
        const getSportsbookMarketByURN = jest.fn();

        createSportsbookRunnerByURNSelector.mockReturnValue(() => entitiesMock.sportsbookrunners["runner:1"]);

        createSportsbookMarketByURNSelector.mockReturnValue(getSportsbookMarketByURN);

        getSportsbookMarketByURN
          .mockReturnValueOnce(entitiesMock.sportsbookmarkets["market:1"])
          .mockReturnValue(changedState.sportsbookmarkets["market:1"]);

        const selector = createSportsbookRunnerWithOddsAndMarketByURNSelector();
        const firstCall = selector(entitiesMock, "runner:1");
        const secondCall = selector(changedState, "runner:1");

        expect(firstCall === secondCall).toBe(false);
      });
    });
  });

  describe("createGetFreeBetsBonusAmountSelector", () => {
    const stateFreeBetsMock = {
      entities: {
        preferences: {
          products: ["sportsbook", "exchange"],
        },
        wallets: {
          SPORTSBOOK_BONUS: {
            amount: 10.14,
          },
          EXCHANGE_BONUS_CASH: {
            amount: 15.32,
          },
          BOOST_TOKENS: {
            amount: 5,
          },
          ACCA_INSURANCE_TOKENS: {
            amount: 2,
          },
          MONEY_BACK_TOKENS: {
            amount: 3,
          },
        },
      },
    };

    describe("when the user wallet is not defined", () => {
      it("should return null", () => {
        createUserPreferencesWithProductSwitcherSelector.mockReturnValue(jest.fn());
        getUserWallets.mockReturnValue(undefined);
        expect(createGetWalletsAvailabilitySelector()(stateFreeBetsMock)).toEqual({
          freeBetsBalance: 0,
          areGenerosityTokensAvailable: false,
        });
      });
    });

    describe("when the user preferences are not defined", () => {
      it("should return null", () => {
        const getUserPreferencesWithProductSwitcher = jest.fn().mockReturnValue(undefined);
        createUserPreferencesWithProductSwitcherSelector.mockReturnValue(getUserPreferencesWithProductSwitcher);

        expect(createGetWalletsAvailabilitySelector()(stateFreeBetsMock)).toEqual({
          freeBetsBalance: 0,
          areGenerosityTokensAvailable: false,
        });
      });
    });

    describe("when the user product is SBK only", () => {
      it("should return the SBK free bets amount", () => {
        const getUserPreferencesWithProductSwitcher = jest.fn().mockReturnValue({ products: ["sportsbook"] });
        createUserPreferencesWithProductSwitcherSelector.mockReturnValue(getUserPreferencesWithProductSwitcher);
        getUserWallets.mockReturnValue({ SPORTSBOOK_BONUS: { amount: 15.32 }, EXCHANGE_BONUS_CASH: { amount: 10.14 } });

        expect(createGetWalletsAvailabilitySelector()(stateFreeBetsMock)).toEqual({
          freeBetsBalance: 15.32,
          areGenerosityTokensAvailable: false,
        });
      });
    });

    describe("when the user product is EXC only", () => {
      it("should return the EXC free bets amount", () => {
        const getUserPreferencesWithProductSwitcher = jest.fn().mockReturnValue({ products: ["exchange"] });
        createUserPreferencesWithProductSwitcherSelector.mockReturnValue(getUserPreferencesWithProductSwitcher);
        getUserWallets.mockReturnValue({ SPORTSBOOK_BONUS: { amount: 10.14 }, EXCHANGE_BONUS_CASH: { amount: 10.14 } });

        expect(createGetWalletsAvailabilitySelector()(stateFreeBetsMock)).toEqual({
          freeBetsBalance: 10.14,
          areGenerosityTokensAvailable: false,
        });
      });
    });

    describe("when the user has both products SBK/EXC", () => {
      it("should return the total free bets amount", () => {
        const getUserPreferencesWithProductSwitcher = jest
          .fn()
          .mockReturnValue({ products: ["sportsbook", "exchange"] });
        createUserPreferencesWithProductSwitcherSelector.mockReturnValue(getUserPreferencesWithProductSwitcher);
        getUserWallets.mockReturnValue({ EXCHANGE_BONUS_CASH: { amount: 15.32 }, SPORTSBOOK_BONUS: { amount: 10.14 } });

        expect(createGetWalletsAvailabilitySelector()(stateFreeBetsMock)).toEqual({
          freeBetsBalance: 25.46,
          areGenerosityTokensAvailable: false,
        });
      });
    });

    describe("when the user has no free bets but has boost tokens", () => {
      it("should return are generosityTokensAvailable true", () => {
        const getUserPreferencesWithProductSwitcher = jest
          .fn()
          .mockReturnValue({ products: ["sportsbook", "exchange"] });
        createUserPreferencesWithProductSwitcherSelector.mockReturnValue(getUserPreferencesWithProductSwitcher);
        getUserWallets.mockReturnValue({
          BOOST_TOKENS: { amount: 5 },
        });

        expect(createGetWalletsAvailabilitySelector()(stateFreeBetsMock)).toEqual({
          freeBetsBalance: 0,
          areGenerosityTokensAvailable: true,
        });
      });
    });

    describe("when the user has no free bets but has acca insurance tokens", () => {
      it("should return generosityTokensAvailable true", () => {
        const getUserPreferencesWithProductSwitcher = jest
          .fn()
          .mockReturnValue({ products: ["sportsbook", "exchange"] });
        createUserPreferencesWithProductSwitcherSelector.mockReturnValue(getUserPreferencesWithProductSwitcher);
        getUserWallets.mockReturnValue({
          ACCA_INSURANCE_TOKENS: { amount: 10 },
        });

        expect(createGetWalletsAvailabilitySelector()(stateFreeBetsMock)).toEqual({
          freeBetsBalance: 0,
          areGenerosityTokensAvailable: true,
        });
      });
    });

    describe("when the user has no free bets but has money back tokens", () => {
      it("should return generosityTokensAvailable true", () => {
        const getUserPreferencesWithProductSwitcher = jest
          .fn()
          .mockReturnValue({ products: ["sportsbook", "exchange"] });
        createUserPreferencesWithProductSwitcherSelector.mockReturnValue(getUserPreferencesWithProductSwitcher);
        getUserWallets.mockReturnValue({
          MONEY_BACK_TOKENS: { amount: 5 },
        });

        expect(createGetWalletsAvailabilitySelector()(stateFreeBetsMock)).toEqual({
          freeBetsBalance: 0,
          areGenerosityTokensAvailable: true,
        });
      });
    });

    describe("when the user doesnt have any bonus", () => {
      it("should return the total free bets amount", () => {
        const getUserPreferencesWithProductSwitcher = jest
          .fn()
          .mockReturnValue({ products: ["sportsbook", "exchange"] });
        createUserPreferencesWithProductSwitcherSelector.mockReturnValue(getUserPreferencesWithProductSwitcher);
        getUserWallets.mockReturnValue({ EXCHANGE_BONUS_CASH: { amount: 0 }, SPORTSBOOK_BONUS: { amount: 0 } });

        expect(createGetWalletsAvailabilitySelector()(stateFreeBetsMock)).toEqual({
          freeBetsBalance: 0,
          areGenerosityTokensAvailable: false,
        });
      });
    });
  });

  describe("createGetExchangeDefaultProductSelector", () => {
    const preferencesStateMock = {
      entities: {
        preferences: {
          exchangeDefaultProduct: "ems",
        },
      },
    };

    describe("when the user preferences are not defined", () => {
      it("should return null", () => {
        const getUserPreferencesWithProductSwitcher = jest.fn().mockReturnValue(undefined);
        createUserPreferencesWithProductSwitcherSelector.mockReturnValue(getUserPreferencesWithProductSwitcher);

        expect(createGetExchangeDefaultProductSelector()(preferencesStateMock)).toEqual(null);
      });
    });

    describe("when the user preferences are defined", () => {
      it("should return exchangeDefaultProduct value", () => {
        const getUserPreferencesWithProductSwitcher = jest
          .fn()
          .mockReturnValue({ ...preferencesStateMock.entities.preferences });
        createUserPreferencesWithProductSwitcherSelector.mockReturnValue(getUserPreferencesWithProductSwitcher);

        expect(createGetExchangeDefaultProductSelector()(preferencesStateMock)).toEqual("ems");
      });

      describe("when the exchangeDefaultProduct are not defined", () => {
        it("should return the default exchange default value", () => {
          const getUserPreferencesWithProductSwitcher = jest.fn().mockReturnValue(jest.fn());
          createUserPreferencesWithProductSwitcherSelector.mockReturnValue(getUserPreferencesWithProductSwitcher);

          expect(createGetExchangeDefaultProductSelector()(preferencesStateMock)).toEqual("unassigned");
        });
      });
    });
  });

  describe("createSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURNSelector", () => {
    describe("when marketRunnerWithRichContent is not defined", () => {
      it("should return undefined", () => {
        const state = {
          entities: {
            sportsbookmarkets: undefined,
          },
        };

        const getSbkMarket = jest.fn().mockReturnValue(undefined);
        createSportsbookMarketByURNSelector.mockReturnValue(getSbkMarket);
        createSportsbookRunnerStatusSelector.mockReturnValue(jest.fn().mockReturnValue(undefined));
        const getSBKMarketRunnerByMarketAndRunnerURN = jest.fn().mockReturnValue(undefined);
        createSportsbookMarketRunnerByRunnerAndMarketURNSelector.mockReturnValue(
          getSBKMarketRunnerByMarketAndRunnerURN,
        );

        createMeetingByURNSelector.mockReturnValue(jest.fn().mockReturnValue(undefined));
        createGreyhoundRaceRunnersByRaceURNSelector.mockReturnValue(jest.fn().mockReturnValue(undefined));

        expect(createSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURNSelector()(state, "props")).toBeUndefined();
      });
    });
    describe("when marketRunnerWithRichContent is defined and runner is horse", () => {
      it("should return market runner with rich content and runner status", () => {
        const state = {
          entities: {
            sportsbookmarkets: {
              1.1: {
                marketId: "1.1",
                sportevent: "SPORTEVENT:1",
                name: "Market Name 1",
                marketType: "MATCH_ODDS",
                runners: [
                  { urn: "runner:urn:1", selectionId: 1, name: "Runner Name 1" },
                  { urn: "runner:urn:2", selectionId: 2, name: "Runner Name 2" },
                  { urn: "runner:urn:3", selectionId: 3, name: "Runner Name 3" },
                ],
              },
            },
          },
        };
        createMeetingByURNSelector.mockReturnValue(jest.fn().mockReturnValue(undefined));
        createGreyhoundRaceRunnersByRaceURNSelector.mockReturnValue(jest.fn().mockReturnValue(undefined));

        const getSbkMarket = jest.fn().mockReturnValue(state.entities.sportsbookmarkets["1.1"]);
        createSportsbookMarketByURNSelector.mockReturnValue(getSbkMarket);

        const getSBKMarketRunnerByMarketAndRunnerURN = jest.fn().mockReturnValue({
          marketUrn: "market:urn:1.1",
          displayRunnersUrns: ["runner:urn:1", "runner:urn:2", "runner:urn:3"],
          inline: true,
        });
        createSportsbookMarketRunnerByRunnerAndMarketURNSelector.mockReturnValue(
          getSBKMarketRunnerByMarketAndRunnerURN,
        );

        const getSBKRunnerStatusByRunnerURN = jest.fn().mockReturnValue("ACTIVE");
        createSportsbookRunnerStatusSelector.mockReturnValue(getSBKRunnerStatusByRunnerURN);

        expect(
          createSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURNSelector()(state, {
            marketUrn: "market:urn:1.1",
            runnerUrn: "runner:urn:1",
            sportId: 7,
          }),
        ).toEqual({
          displayRunnersUrns: ["runner:urn:1", "runner:urn:2", "runner:urn:3"],
          inline: true,
          marketUrn: "market:urn:1.1",
          status: "ACTIVE",
        });
      });
    });
    describe("when marketRunnerWithRichContent is defined and runner is greyhound", () => {
      it("should return greyhound market runner with rich content and runner status", () => {
        const greyhoundracerunners = {
          "greyhoundRunner:urn:1": {
            urn: "greyhoundRunner:urn:1",
            typename: "GreyhoundRaceRunner",
            trap: 5,
            raceURN: "race:urn:1",
            selectionId: 123456,
          },
        };

        const state = {
          entities: {
            sportsbookmarkets: {
              1.1: {
                marketId: "1.1",
                sportevent: "SPORTEVENT:7",
                name: "Market Name 1",
                marketType: "MATCH_ODDS",
                runners: [
                  { urn: "greyhoundRunner:urn:1", selectionId: 123456, name: "Greyhound Runner Name 1" },
                  { urn: "greyhoundRunner:urn:2", selectionId: 234567, name: "Greyhound Runner Name 2" },
                ],
                hierarchy: {
                  meeting: {
                    country: "GB",
                  },
                },
              },
            },
            greyhoundracerunners: {
              ...greyhoundracerunners,
            },
          },
        };

        const getMeetingByURN = jest.fn().mockReturnValue({
          meeting: "meeting",
          country: "GB",
        });
        createMeetingByURNSelector.mockReturnValue(getMeetingByURN);

        isRaceHierarchy.mockReturnValue(true);

        const getGreyhoundRaceRunnersByRaceURN = jest.fn().mockReturnValue(greyhoundracerunners);
        createGreyhoundRaceRunnersByRaceURNSelector.mockReturnValue(getGreyhoundRaceRunnersByRaceURN);

        const getSbkMarket = jest.fn().mockReturnValue(state.entities.sportsbookmarkets["1.1"]);
        createSportsbookMarketByURNSelector.mockReturnValue(getSbkMarket);

        const getSBKMarketRunnerByMarketAndRunnerURN = jest.fn().mockReturnValue({
          marketUrn: "market:urn:1.1",
          displayRunnersUrns: ["runner:urn:1", "runner:urn:2", "runner:urn:3"],
          inline: true,
          selectionId: 123456,
        });
        createSportsbookMarketRunnerByRunnerAndMarketURNSelector.mockReturnValue(
          getSBKMarketRunnerByMarketAndRunnerURN,
        );

        const getSBKRunnerStatusByRunnerURN = jest.fn().mockReturnValue("ACTIVE");
        createSportsbookRunnerStatusSelector.mockReturnValue(getSBKRunnerStatusByRunnerURN);

        expect(
          createSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURNSelector()(state, {
            marketUrn: "market:urn:1.1",
            runnerUrn: "greyhoundRunner:urn:1",
            sportId: 4339,
          }),
        ).toEqual({
          displayRunnersUrns: ["runner:urn:1", "runner:urn:2", "runner:urn:3"],
          inline: true,
          marketUrn: "market:urn:1.1",
          status: "ACTIVE",
          selectionId: 123456,
          richContent: {
            greyhoundRaceRunner: {
              urn: "greyhoundRunner:urn:1",
              trap: 5,
              meetingCountry: "GB",
            },
          },
        });
      });
    });
    describe("when the selector is called twice with the same input", () => {
      it("should only execute one computation", () => {
        const state = {
          entities: {
            sportsbookmarkets: {
              1.1: {
                marketId: "1.1",
                sportevent: "SPORTEVENT:1",
                name: "Market Name 1",
                marketType: "MATCH_ODDS",
                runners: [
                  { urn: "runner:urn:1", selectionId: 1, name: "Runner Name 1" },
                  { urn: "runner:urn:2", selectionId: 2, name: "Runner Name 2" },
                  { urn: "runner:urn:3", selectionId: 3, name: "Runner Name 3" },
                ],
                hierarchy: {
                  meeting: {
                    country: "GB",
                  },
                },
              },
            },
          },
        };

        const getSbkMarket = jest.fn().mockReturnValue(state.entities.sportsbookmarkets["1.1"]);
        createSportsbookMarketByURNSelector.mockReturnValue(getSbkMarket);
        const getSBKMarketRunnerByMarketAndRunnerURN = jest.fn().mockReturnValue({
          marketUrn: "market:urn:1.1",
          displayRunnersUrns: ["runner:urn:1", "runner:urn:2", "runner:urn:3"],
          inline: true,
        });
        createSportsbookMarketRunnerByRunnerAndMarketURNSelector.mockReturnValue(
          getSBKMarketRunnerByMarketAndRunnerURN,
        );

        createMeetingByURNSelector.mockReturnValue(jest.fn().mockReturnValue(undefined));
        createGreyhoundRaceRunnersByRaceURNSelector.mockReturnValue(jest.fn().mockReturnValue(undefined));

        const getSBKRunnerStatusByRunnerURN = jest.fn().mockReturnValue("ACTIVE");
        createSportsbookRunnerStatusSelector.mockReturnValue(getSBKRunnerStatusByRunnerURN);

        const firstExecution = createSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURNSelector()(state, "props");
        const secondExecution = createSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURNSelector()(state, "props");

        expect(firstExecution).toEqual(secondExecution);
      });
    });
    describe("when the selector is called twice with different inputs", () => {
      it("should execute one computation for each call", () => {
        const state = {
          entities: {
            sportsbookmarkets: {
              1.1: {
                marketId: "1.1",
                sportevent: "SPORTEVENT:1",
                name: "Market Name 1",
                marketType: "MATCH_ODDS",
                runners: [
                  { urn: "runner:urn:1", selectionId: 1, name: "Runner Name 1" },
                  { urn: "runner:urn:2", selectionId: 2, name: "Runner Name 2" },
                  { urn: "runner:urn:3", selectionId: 3, name: "Runner Name 3" },
                ],
                hierarchy: {
                  meeting: {
                    country: "GB",
                  },
                },
              },
            },
          },
        };

        const newState = {
          entities: {
            sportsbookmarkets: {
              1.2: {
                marketId: "1.2",
                sportevent: "SPORTEVENT:2",
                name: "Market Name 2",
                marketType: "MATCH_ODDS",
                runners: [
                  { urn: "runner:urn:4", selectionId: 1, name: "Runner Name 4" },
                  { urn: "runner:urn:5", selectionId: 2, name: "Runner Name 5" },
                  { urn: "runner:urn:6", selectionId: 3, name: "Runner Name 6" },
                ],
                hierarchy: {
                  meeting: {
                    country: "GB",
                  },
                },
              },
            },
          },
        };

        const getSbkMarketOne = jest.fn().mockReturnValue(state.entities.sportsbookmarkets["1.1"]);
        createSportsbookMarketByURNSelector.mockReturnValue(getSbkMarketOne);

        const getSBKMarketRunnerByMarketAndRunnerURNOne = jest.fn().mockReturnValue({
          marketUrn: "market:urn:1.1",
          displayRunnersUrns: ["runner:urn:1", "runner:urn:2", "runner:urn:3"],
          inline: true,
        });
        createSportsbookMarketRunnerByRunnerAndMarketURNSelector.mockReturnValue(
          getSBKMarketRunnerByMarketAndRunnerURNOne,
        );
        const getMeetingByURN = jest.fn().mockReturnValue(undefined);
        createMeetingByURNSelector.mockReturnValue(getMeetingByURN);
        createGreyhoundRaceRunnersByRaceURNSelector.mockReturnValue(jest.fn().mockReturnValue(undefined));

        const getSBKRunnerStatusByRunnerURNOne = jest.fn().mockReturnValue("ACTIVE");
        createSportsbookRunnerStatusSelector.mockReturnValue(getSBKRunnerStatusByRunnerURNOne);

        const firstExecution = createSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURNSelector()(state, "props");

        const getSbkMarketTwo = jest.fn().mockReturnValue(state.entities.sportsbookmarkets["1.2"]);
        createSportsbookMarketByURNSelector.mockReturnValue(getSbkMarketTwo);

        const getSBKMarketRunnerByMarketAndRunnerURNTwo = jest.fn().mockReturnValue({
          marketUrn: "market:urn:1.2",
          displayRunnersUrns: ["runner:urn:4", "runner:urn:5", "runner:urn:6"],
          inline: true,
        });
        createSportsbookMarketRunnerByRunnerAndMarketURNSelector.mockReturnValue(
          getSBKMarketRunnerByMarketAndRunnerURNTwo,
        );

        const getSBKRunnerStatusByRunnerURNTwo = jest.fn().mockReturnValue("REMOVED");
        createSportsbookRunnerStatusSelector.mockReturnValue(getSBKRunnerStatusByRunnerURNTwo);

        const secondExecution = createSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURNSelector()(
          newState,
          "props",
        );
        expect(firstExecution).not.toEqual(secondExecution);
      });
    });
  });

  describe("createFixtureByURNSelector", () => {
    beforeEach(() => {
      createTennisFixtureByURNSelector.mockReturnValueOnce(getTennisFixtureByURN);
      createBaseballFixtureByURNSelector.mockReturnValueOnce(getBaseballFixtureByURN);
      createBasketballFixtureByURNSelector.mockReturnValueOnce(getBasketballFixtureByURN);
      createCricketFixtureByURNSelector.mockReturnValueOnce(getCricketFixtureByURN);
      createTableTennisFixtureByURNSelector.mockReturnValueOnce(getTableTennisFixtureByURN);
      createIceHockeyFixtureByURNSelector.mockReturnValueOnce(getIceHockeyFixtureByURN);
      createRugbyUnionFixtureByURNSelector.mockReturnValueOnce(getRugbyUnionFixtureByURN);
      createRugbyLeagueFixtureByURNSelector.mockReturnValueOnce(getRugbyLeagueFixtureByURN);
      createSnookerFixtureByURNSelector.mockReturnValueOnce(getSnookerFixtureByURN);
      createVolleyballFixtureByURNSelector.mockReturnValueOnce(getVolleyballFixtureByURN);
      createAustralianRulesFixtureByURNSelector.mockReturnValueOnce(getAustralianRulesFixtureByURN);
      createDartsFixtureByURNSelector.mockReturnValueOnce(getDartsFixtureByURN);
    });

    describe("when there are no fixtures", () => {
      it("should return undefined", () => {
        getTennisFixtureByURN.mockReturnValueOnce(undefined);
        getBaseballFixtureByURN.mockReturnValueOnce(undefined);
        getBasketballFixtureByURN.mockReturnValueOnce(undefined);
        getCricketFixtureByURN.mockReturnValueOnce(undefined);
        getTableTennisFixtureByURN.mockReturnValueOnce(undefined);
        getIceHockeyFixtureByURN.mockReturnValueOnce(undefined);
        getRugbyUnionFixtureByURN.mockReturnValueOnce(undefined);
        getRugbyLeagueFixtureByURN.mockReturnValueOnce(undefined);
        getSnookerFixtureByURN.mockReturnValueOnce(undefined);
        getVolleyballFixtureByURN.mockReturnValueOnce(undefined);
        getAustralianRulesFixtureByURN.mockReturnValueOnce(undefined);
        getDartsFixtureByURN.mockReturnValueOnce(undefined);

        expect(createFixtureByURNSelector()(stateMock.entities)).toEqual(undefined);
      });
    });

    describe("when is football fixture", () => {
      it("should return football fixture", () => {
        getTennisFixtureByURN.mockReturnValueOnce(undefined);
        getBaseballFixtureByURN.mockReturnValueOnce(undefined);
        getBasketballFixtureByURN.mockReturnValueOnce(undefined);
        getCricketFixtureByURN.mockReturnValueOnce(undefined);
        getTableTennisFixtureByURN.mockReturnValueOnce(undefined);
        getIceHockeyFixtureByURN.mockReturnValueOnce(undefined);
        getRugbyUnionFixtureByURN.mockReturnValueOnce(undefined);
        getRugbyLeagueFixtureByURN.mockReturnValueOnce(undefined);
        getSnookerFixtureByURN.mockReturnValueOnce(undefined);
        getVolleyballFixtureByURN.mockReturnValueOnce(undefined);
        getAustralianRulesFixtureByURN.mockReturnValueOnce(undefined);
        getDartsFixtureByURN.mockReturnValueOnce(undefined);

        expect(createFixtureByURNSelector()(stateMock.entities, "fakeFixtureUrn")).toEqual(
          stateMock.entities.footballfixtures.fakeFixtureUrn,
        );
      });
    });

    describe("when is tennis fixture", () => {
      it("should return tennis fixture", () => {
        getTennisFixtureByURN.mockReturnValueOnce(stateMock.entities.tennisfixtures);
        getBaseballFixtureByURN.mockReturnValueOnce(undefined);
        getBasketballFixtureByURN.mockReturnValueOnce(undefined);
        getCricketFixtureByURN.mockReturnValueOnce(undefined);
        getTableTennisFixtureByURN.mockReturnValueOnce(undefined);
        getIceHockeyFixtureByURN.mockReturnValueOnce(undefined);
        getRugbyUnionFixtureByURN.mockReturnValueOnce(undefined);
        getRugbyLeagueFixtureByURN.mockReturnValueOnce(undefined);
        getSnookerFixtureByURN.mockReturnValueOnce(undefined);
        getVolleyballFixtureByURN.mockReturnValueOnce(undefined);
        getAustralianRulesFixtureByURN.mockReturnValueOnce(undefined);
        getDartsFixtureByURN.mockReturnValueOnce(undefined);

        expect(createFixtureByURNSelector()(stateMock.entities)).toEqual(stateMock.entities.tennisfixtures);
      });
    });

    describe("when is basketball fixture", () => {
      it("should return basketball fixture", () => {
        getTennisFixtureByURN.mockReturnValueOnce(undefined);
        getBasketballFixtureByURN.mockReturnValueOnce(stateMock.entities.basketballfixtures);
        getBasketballFixtureByURN.mockReturnValueOnce(stateMock.entities.basketballfixtures);
        getCricketFixtureByURN.mockReturnValueOnce(undefined);
        getTableTennisFixtureByURN.mockReturnValueOnce(undefined);
        getIceHockeyFixtureByURN.mockReturnValueOnce(undefined);
        getRugbyUnionFixtureByURN.mockReturnValueOnce(undefined);
        getRugbyLeagueFixtureByURN.mockReturnValueOnce(undefined);
        getSnookerFixtureByURN.mockReturnValueOnce(undefined);
        getVolleyballFixtureByURN.mockReturnValueOnce(undefined);
        getAustralianRulesFixtureByURN.mockReturnValueOnce(undefined);
        getDartsFixtureByURN.mockReturnValueOnce(undefined);

        expect(createFixtureByURNSelector()(stateMock.entities)).toEqual(stateMock.entities.basketballfixtures);
      });
    });

    describe("when is cricket fixture", () => {
      it("should return cricket fixture", () => {
        getTennisFixtureByURN.mockReturnValueOnce(undefined);
        getBaseballFixtureByURN.mockReturnValueOnce(undefined);
        getBasketballFixtureByURN.mockReturnValueOnce(undefined);
        getCricketFixtureByURN.mockReturnValueOnce(stateMock.entities.cricketfixtures);
        getTableTennisFixtureByURN.mockReturnValueOnce(undefined);
        getIceHockeyFixtureByURN.mockReturnValueOnce(undefined);
        getRugbyUnionFixtureByURN.mockReturnValueOnce(undefined);
        getRugbyLeagueFixtureByURN.mockReturnValueOnce(undefined);
        getSnookerFixtureByURN.mockReturnValueOnce(undefined);
        getVolleyballFixtureByURN.mockReturnValueOnce(undefined);
        getAustralianRulesFixtureByURN.mockReturnValueOnce(undefined);
        getDartsFixtureByURN.mockReturnValueOnce(undefined);

        expect(createFixtureByURNSelector()(stateMock.entities)).toEqual(stateMock.entities.cricketfixtures);
      });
    });

    describe("when is table tennis fixture", () => {
      it("should return tabletennis fixture", () => {
        getTennisFixtureByURN.mockReturnValueOnce(undefined);
        getBaseballFixtureByURN.mockReturnValueOnce(undefined);
        getBasketballFixtureByURN.mockReturnValueOnce(undefined);
        getCricketFixtureByURN.mockReturnValueOnce(undefined);
        getTableTennisFixtureByURN.mockReturnValueOnce(stateMock.entities.tabletennisfixtures);
        getIceHockeyFixtureByURN.mockReturnValueOnce(undefined);
        getRugbyUnionFixtureByURN.mockReturnValueOnce(undefined);
        getRugbyLeagueFixtureByURN.mockReturnValueOnce(undefined);
        getSnookerFixtureByURN.mockReturnValueOnce(undefined);
        getVolleyballFixtureByURN.mockReturnValueOnce(undefined);
        getAustralianRulesFixtureByURN.mockReturnValueOnce(undefined);
        getDartsFixtureByURN.mockReturnValueOnce(undefined);

        expect(createFixtureByURNSelector()(stateMock.entities)).toEqual(stateMock.entities.tabletennisfixtures);
      });
    });

    describe("when is ice hockey fixture", () => {
      it("should return icehockey fixture", () => {
        getTennisFixtureByURN.mockReturnValueOnce(undefined);
        getBaseballFixtureByURN.mockReturnValueOnce(undefined);
        getBasketballFixtureByURN.mockReturnValueOnce(undefined);
        getCricketFixtureByURN.mockReturnValueOnce(undefined);
        getTableTennisFixtureByURN.mockReturnValueOnce(undefined);
        getIceHockeyFixtureByURN.mockReturnValueOnce(stateMock.entities.icehockeyfixtures);
        getRugbyUnionFixtureByURN.mockReturnValueOnce(undefined);
        getRugbyLeagueFixtureByURN.mockReturnValueOnce(undefined);
        getSnookerFixtureByURN.mockReturnValueOnce(undefined);
        getVolleyballFixtureByURN.mockReturnValueOnce(undefined);
        getAustralianRulesFixtureByURN.mockReturnValueOnce(undefined);
        getDartsFixtureByURN.mockReturnValueOnce(undefined);

        expect(createFixtureByURNSelector()(stateMock.entities)).toEqual(stateMock.entities.icehockeyfixtures);
      });
    });

    describe("when is rugby union fixture", () => {
      it("should return rugby union fixture", () => {
        getTennisFixtureByURN.mockReturnValueOnce(undefined);
        getBaseballFixtureByURN.mockReturnValueOnce(undefined);
        getBasketballFixtureByURN.mockReturnValueOnce(undefined);
        getCricketFixtureByURN.mockReturnValueOnce(undefined);
        getTableTennisFixtureByURN.mockReturnValueOnce(undefined);
        getIceHockeyFixtureByURN.mockReturnValueOnce(undefined);
        getRugbyUnionFixtureByURN.mockReturnValueOnce(stateMock.entities.rugbyunionfixtures);
        getRugbyLeagueFixtureByURN.mockReturnValueOnce(undefined);
        getSnookerFixtureByURN.mockReturnValueOnce(undefined);
        getVolleyballFixtureByURN.mockReturnValueOnce(undefined);
        getAustralianRulesFixtureByURN.mockReturnValueOnce(undefined);
        getDartsFixtureByURN.mockReturnValueOnce(undefined);

        expect(createFixtureByURNSelector()(stateMock.entities)).toEqual(stateMock.entities.rugbyunionfixtures);
      });
    });

    describe("when is snooker fixture", () => {
      it("should return snooker fixture", () => {
        getTennisFixtureByURN.mockReturnValueOnce(undefined);
        getBaseballFixtureByURN.mockReturnValueOnce(undefined);
        getBasketballFixtureByURN.mockReturnValueOnce(undefined);
        getCricketFixtureByURN.mockReturnValueOnce(undefined);
        getTableTennisFixtureByURN.mockReturnValueOnce(undefined);
        getIceHockeyFixtureByURN.mockReturnValueOnce(undefined);
        getRugbyUnionFixtureByURN.mockReturnValueOnce(undefined);
        getRugbyLeagueFixtureByURN.mockReturnValueOnce(undefined);
        getSnookerFixtureByURN.mockReturnValueOnce(stateMock.entities.snookerfixtures);
        getVolleyballFixtureByURN.mockReturnValueOnce(undefined);
        getAustralianRulesFixtureByURN.mockReturnValueOnce(undefined);
        getDartsFixtureByURN.mockReturnValueOnce(undefined);

        expect(createFixtureByURNSelector()(stateMock.entities)).toEqual(stateMock.entities.snookerfixtures);
      });
    });

    describe("when is baseball fixture", () => {
      it("should return baseball fixture", () => {
        getTennisFixtureByURN.mockReturnValueOnce(undefined);
        getBaseballFixtureByURN.mockReturnValueOnce(stateMock.entities.baseballfixtures);
        getBasketballFixtureByURN.mockReturnValueOnce(undefined);
        getCricketFixtureByURN.mockReturnValueOnce(undefined);
        getTableTennisFixtureByURN.mockReturnValueOnce(undefined);
        getIceHockeyFixtureByURN.mockReturnValueOnce(undefined);
        getRugbyUnionFixtureByURN.mockReturnValueOnce(undefined);
        getRugbyLeagueFixtureByURN.mockReturnValueOnce(undefined);
        getSnookerFixtureByURN.mockReturnValueOnce(undefined);
        getVolleyballFixtureByURN.mockReturnValueOnce(undefined);
        getAustralianRulesFixtureByURN.mockReturnValueOnce(undefined);
        getDartsFixtureByURN.mockReturnValueOnce(undefined);

        expect(createFixtureByURNSelector()(stateMock.entities)).toEqual(stateMock.entities.baseballfixtures);
      });
    });

    describe("when is australian rules fixture", () => {
      it("should return australian rules fixture", () => {
        getTennisFixtureByURN.mockReturnValueOnce(undefined);
        getBaseballFixtureByURN.mockReturnValueOnce(undefined);
        getBasketballFixtureByURN.mockReturnValueOnce(undefined);
        getCricketFixtureByURN.mockReturnValueOnce(undefined);
        getTableTennisFixtureByURN.mockReturnValueOnce(undefined);
        getIceHockeyFixtureByURN.mockReturnValueOnce(undefined);
        getRugbyUnionFixtureByURN.mockReturnValueOnce(undefined);
        getRugbyLeagueFixtureByURN.mockReturnValueOnce(undefined);
        getSnookerFixtureByURN.mockReturnValueOnce(undefined);
        getVolleyballFixtureByURN.mockReturnValueOnce(undefined);
        getAustralianRulesFixtureByURN.mockReturnValueOnce(stateMock.entities.australianrulesfixtures);
        getDartsFixtureByURN.mockReturnValueOnce(undefined);

        expect(createFixtureByURNSelector()(stateMock.entities)).toEqual(stateMock.entities.australianrulesfixtures);
      });
    });

    describe("when is darts fixture", () => {
      it("should return darts fixture", () => {
        getTennisFixtureByURN.mockReturnValueOnce(undefined);
        getBaseballFixtureByURN.mockReturnValueOnce(undefined);
        getBasketballFixtureByURN.mockReturnValueOnce(undefined);
        getCricketFixtureByURN.mockReturnValueOnce(undefined);
        getTableTennisFixtureByURN.mockReturnValueOnce(undefined);
        getIceHockeyFixtureByURN.mockReturnValueOnce(undefined);
        getRugbyUnionFixtureByURN.mockReturnValueOnce(undefined);
        getRugbyLeagueFixtureByURN.mockReturnValueOnce(undefined);
        getSnookerFixtureByURN.mockReturnValueOnce(undefined);
        getVolleyballFixtureByURN.mockReturnValueOnce(undefined);
        getAustralianRulesFixtureByURN.mockReturnValueOnce(undefined);
        getDartsFixtureByURN.mockReturnValueOnce(stateMock.entities.dartsfixtures);

        expect(createFixtureByURNSelector()(stateMock.entities)).toEqual(stateMock.entities.dartsfixtures);
      });
    });
  });

  describe("getExchangeRunnerTree", () => {
    describe("when there is no EXC runner", () => {
      beforeEach(() => {
        getExchangeRunnerByURN.mockReturnValueOnce(undefined);
      });

      it("should return null", () => {
        const appState = { entities: { exchangerunners: "foo" } };
        const runnerURN = "dummy:urn";

        expect(getExchangeRunnerTree(appState.entities, runnerURN)).toBe(null);
        expect(getExchangeRunnerByURN).toHaveBeenCalledWith(appState.entities.exchangerunners, runnerURN);
      });
    });

    describe("when there is no EXC market", () => {
      const getExchangeMarketByURN = jest.fn(() => undefined);

      beforeEach(() => {
        getExchangeRunnerByURN.mockReturnValueOnce({ market: "market:urn" });
        createExchangeMarketSelector.mockReturnValueOnce(getExchangeMarketByURN);
      });

      it("should return null", () => {
        const appState = { entities: { exchangemarkets: "foo" } };
        const runnerURN = "dummy:urn";

        expect(getExchangeRunnerTree(appState.entities, runnerURN)).toBe(null);
        expect(getExchangeMarketByURN).toHaveBeenCalledWith(appState.entities.exchangemarkets, "market:urn");
      });
    });

    describe("when there is no EXC market runner", () => {
      beforeEach(() => {
        getExchangeRunnerByURN.mockReturnValueOnce({ market: "market:urn" });
        createExchangeMarketSelector.mockReturnValueOnce(() => ({ hierarchy: { sportevent: "event:urn" } }));
        getExchangeMarketRunnerByURN.mockReturnValueOnce(undefined);
      });

      it("should return null", () => {
        const appState = { entities: { exchangemarkets: "foo" } };
        const runnerURN = "dummy:urn";

        expect(getExchangeRunnerTree(appState.entities, runnerURN)).toBe(null);
        expect(getExchangeMarketRunnerByURN).toHaveBeenCalledWith(
          { hierarchy: { sportevent: "event:urn" } },
          "dummy:urn",
        );
      });
    });

    describe("when there is no EXC sport event", () => {
      beforeEach(() => {
        getExchangeRunnerByURN.mockReturnValueOnce({ market: "market:urn" });
        createExchangeMarketSelector.mockReturnValueOnce(() => ({ hierarchy: { sportevent: "event:urn" } }));
        getExchangeMarketRunnerByURN.mockReturnValueOnce("market_runner");
        getSportByURN.mockReturnValueOnce("sport");
      });

      it("should return null", () => {
        const appState = { entities: { sportevents: undefined } };
        const runnerURN = "dummy:urn";
        isRaceHierarchy.mockReturnValue(false);

        expect(getExchangeRunnerTree(appState.entities, runnerURN)).toBe(null);
        expect(getSportEventByURN).toHaveBeenCalledWith(appState.entities.sportevents, "event:urn");
      });
    });

    describe("when there is no EXC sport", () => {
      beforeEach(() => {
        getExchangeRunnerByURN.mockReturnValueOnce({ market: "market:urn" });
        createExchangeMarketSelector.mockReturnValueOnce(() => ({
          hierarchy: { sportevent: "event:urn" },
          sport: "sport:urn",
        }));
        getExchangeMarketRunnerByURN.mockReturnValueOnce("market_runner");
      });

      it("should return null", () => {
        const appState = { entities: { sportevents: "foo", sports: "sports" } };
        const runnerURN = "dummy:urn";

        expect(getExchangeRunnerTree(appState.entities, runnerURN)).toBe(null);
        expect(getSportByURN).toHaveBeenCalledWith(appState.entities.sports, "sport:urn");
      });
    });

    describe("when an EXC runner, market, market runner, event and sport is found", () => {
      beforeEach(() => {
        getExchangeRunnerByURN.mockReturnValueOnce("runner");
        createExchangeMarketSelector.mockReturnValueOnce(() => ({
          hierarchy: "some hierarchy",
        }));
        getExchangeMarketRunnerByURN.mockReturnValueOnce("market_runner");
        getSportByURN.mockReturnValueOnce("sport");
        getSportEventByURN.mockReturnValueOnce("sport_event");
      });

      describe("and its not a race hierarchy", () => {
        it("should return a generic runner tree", () => {
          const appState = { entities: "foo" };
          const runnerURN = "dummy:urn";

          isRaceHierarchy.mockReturnValue(false);

          expect(getExchangeRunnerTree(appState.entities, runnerURN)).toEqual({
            type: "GENERIC",
            event: "sport_event",
            market: {
              hierarchy: "some hierarchy",
            },
            marketRunner: "market_runner",
            runner: "runner",
            sport: "sport",
          });
          expect(isRaceHierarchy).toHaveBeenCalledWith("some hierarchy");
        });
      });

      describe("and its a race hierarchy", () => {
        it("should return a generic runner tree", () => {
          const appState = { entities: "foo" };
          const runnerURN = "dummy:urn";

          isRaceHierarchy.mockReturnValue(true);
          createRaceByURNSelector.mockReturnValue(() => ({ urn: "ppb:race:123", runners: [] }));
          createMeetingByURNSelector.mockReturnValue(() => ({ urn: "ppb:meeting:123" }));
          createRaceRunnersByRaceURNSelector.mockReturnValue(jest.fn(() => undefined));

          expect(getExchangeRunnerTree(appState.entities, runnerURN)).toEqual({
            type: "RACING",
            market: {
              hierarchy: "some hierarchy",
            },
            marketRunner: "market_runner",
            runner: "runner",
            sport: "sport",
            meeting: { urn: "ppb:meeting:123" },
            race: { urn: "ppb:race:123", runners: [] },
            raceRunners: undefined,
          });
          expect(isRaceHierarchy).toHaveBeenCalledWith("some hierarchy");
        });
      });
    });
  });

  describe("createExcRunnerPotentialBetsByRunnerURNSelector", () => {
    const urnMock = "some URN";
    const mockedState = {
      entities: {
        exchangerunners: "exchangerunners mock",
        exchangemarkets: "exchangemarkets mock",
      },
      betting: {
        exchangeBetting: {
          "some:market:urn": {
            potentialBets: [
              {
                selectionId: "some selectionId",
                handicap: "some handicap",
                price: 2,
                side: "BACK",
              },
              {
                selectionId: "another selectionId",
                handicap: "another handicap",
                price: 2,
                side: "BACK",
              },
              {
                selectionId: "some selectionId",
                handicap: "some handicap",
                price: 3,
                side: "LAY",
              },
            ],
          },
        },
      },
    };
    const exchangeMarketMock = {
      urn: "some:market:urn",
      sport: "some:sport:urn",
      hierarchy: { sportevent: "event:urn" },
    };
    const exchangeRunnerMock = {
      urn: "some exchangerunner URN",
      market: "some:market:urn",
    };

    describe("when there is no market state for that runner", () => {
      it("should return an empty array", () => {
        const anotherExchangeRunnerMock = { ...exchangeRunnerMock, market: "another:market:urn" };
        const anotherExchangeMarketMock = { ...exchangeMarketMock, urn: "another:market:urn" };
        const getExchangeMarketByURN = jest.fn(() => anotherExchangeMarketMock);

        getExchangeRunnerByURN.mockReturnValue(anotherExchangeRunnerMock);
        createExchangeMarketSelector.mockReturnValue(getExchangeMarketByURN);
        getExchangeMarketRunnerByURN.mockReturnValue({
          selectionId: "some selectionId",
          handicap: "some handicap",
        });
        getSportEventByURN.mockReturnValue({ urn: "sport event:urn" });

        expect(createExcRunnerPotentialBetsByRunnerURNSelector()(mockedState, urnMock)).toEqual([]);

        expect(getExchangeRunnerByURN).toHaveBeenCalledTimes(1);
        expect(getExchangeRunnerByURN).toHaveBeenCalledWith("exchangerunners mock", urnMock);

        expect(getExchangeMarketByURN).toHaveBeenCalledTimes(1);
        expect(getExchangeMarketByURN).toHaveBeenCalledWith("exchangemarkets mock", anotherExchangeRunnerMock.market);

        expect(getExchangeMarketRunnerByURN).toHaveBeenCalledTimes(1);
        expect(getExchangeMarketRunnerByURN).toHaveBeenCalledWith(anotherExchangeMarketMock, "some URN");
      });
    });

    describe("when there is market state for that runner", () => {
      it("should return its potential bets", () => {
        const getExchangeMarketByURN = jest.fn(() => ({
          urn: "some:market:urn",
          hierarchy: { sportevent: "sportevent", sport: "ppb:sport:123" },
        }));
        isRaceHierarchy.mockReturnValue(false);
        getExchangeRunnerByURN.mockReturnValue({
          urn: "some exchangerunner URN",
          market: "some:market:urn",
        });
        createExchangeMarketSelector.mockReturnValue(getExchangeMarketByURN);
        getExchangeMarketRunnerByURN.mockReturnValue({
          selectionId: "some selectionId",
          handicap: "some handicap",
          sport: "sport:urn",
        });
        getSportEventByURN.mockReturnValue({ urn: "sport event:urn" });
        getSportByURN.mockReturnValue({ urn: "sport:urn" });
        createMarketPotentialBetsSelector.mockReturnValue(
          jest.fn(() => [
            {
              selectionId: "some selectionId",
              handicap: "some handicap",
              price: 2,
              side: "BACK",
            },
            {
              selectionId: "some selectionId",
              handicap: "some handicap",
              price: 3,
              side: "LAY",
            },
            {
              selectionId: "some other selectionId",
              handicap: "some handicap",
              price: 3,
              side: "LAY",
            },
          ]),
        );

        expect(createExcRunnerPotentialBetsByRunnerURNSelector()(mockedState, urnMock)).toEqual([
          {
            selectionId: "some selectionId",
            handicap: "some handicap",
            price: 2,
            side: "BACK",
          },
          {
            selectionId: "some selectionId",
            handicap: "some handicap",
            price: 3,
            side: "LAY",
          },
        ]);

        expect(getExchangeRunnerByURN).toHaveBeenCalledTimes(1);
        expect(getExchangeRunnerByURN).toHaveBeenCalledWith("exchangerunners mock", urnMock);

        expect(getExchangeMarketByURN).toHaveBeenCalledTimes(1);
        expect(getExchangeMarketByURN).toHaveBeenCalledWith("exchangemarkets mock", "some:market:urn");

        expect(getExchangeMarketRunnerByURN).toHaveBeenCalledTimes(1);
        expect(getExchangeMarketRunnerByURN).toHaveBeenCalledWith(
          {
            urn: "some:market:urn",
            hierarchy: { sportevent: "sportevent", sport: "ppb:sport:123" },
          },
          "some URN",
        );
      });
    });
  });

  describe("createRichContentExcRunnerByMarketAndRunnerURNSelector", () => {
    const marketRunner123 = {
      urn: "ppb:excmarket:123",
      selectionId: 123,
    };
    const excMarket123 = {
      urn: "ppb:excmarket:123",
      hierarchy: {
        race: "ppb:race:123",
        meeting: {},
      },
      runners: {
        "ppb:marketrunner:123": marketRunner123,
      },
    };
    const race = {
      urn: "ppb:race:123",
      runners: ["ppb:racerunner:123"],
    };

    let state = {
      entities: {
        exchangemarkets: {
          "ppb:excmarket:123": excMarket123,
        },
        exchangerunners: {
          "ppb:excrunner:123": {},
        },
        races: {
          "ppb:race:123": race,
        },
        racerunners: {
          "ppb:racerunner:123": {
            urn: "ppb:racerunner:123",
            selectionId: 123,
            horse: {},
            details: {},
          },
        },
      },
    };
    let getExchangeMarketRunnerWithRichContentByMarketAndRunnerURN;

    describe("when given an URN for a non-existing market or non-existing runner", () => {
      beforeEach(() => {
        createExchangeMarketSelector.mockReturnValue(jest.fn(() => undefined));
        createExchangeMarketRunnerByMarketAndRunnerURNsSelector.mockReturnValue(jest.fn(() => undefined));
        createRaceByURNSelector.mockReturnValue(jest.fn(() => undefined));
        createRaceRunnersByRaceURNSelector.mockReturnValue(jest.fn(() => undefined));

        getExchangeMarketRunnerWithRichContentByMarketAndRunnerURN =
          createRichContentExcRunnerByMarketAndRunnerURNSelector();
      });

      it("should return undefined", () => {
        const runner1 = getExchangeMarketRunnerWithRichContentByMarketAndRunnerURN(state.entities, {
          marketURN: "non-existing-urn",
          runnerURN: "ppb:excrunner:123",
        });
        const runner2 = getExchangeMarketRunnerWithRichContentByMarketAndRunnerURN(state.entities, {
          marketURN: "ppb:excmarket:123",
          runnerURN: "non-existing-urn",
        });
        expect(runner1).toBe(undefined);
        expect(runner2).toBe(undefined);
      });
    });

    describe("when given an URN for an existing market and an existing runner", () => {
      beforeEach(() => {
        createExchangeMarketSelector.mockReturnValue(jest.fn(() => excMarket123));
        createExchangeMarketRunnerByMarketAndRunnerURNsSelector.mockReturnValue(jest.fn(() => marketRunner123));

        getExchangeMarketRunnerWithRichContentByMarketAndRunnerURN =
          createRichContentExcRunnerByMarketAndRunnerURNSelector();
      });

      it("should return the corresponding market runner", () => {
        const runner = getExchangeMarketRunnerWithRichContentByMarketAndRunnerURN(state.entities, {
          marketURN: "ppb:excmarket:123",
          runnerURN: "ppb:excrunner:123",
        });
        expect(runner).toEqual({
          urn: "ppb:excmarket:123",
          selectionId: 123,
        });
      });

      describe("and there's Horse Racing (rich) content for that runner", () => {
        beforeEach(() => {
          createRaceByURNSelector.mockReturnValue(jest.fn(() => state.entities.races["ppb:race:123"]));
          createRaceRunnersByRaceURNSelector.mockReturnValue(
            jest.fn(() => state.entities.racerunners["ppb:racerunner:123"]),
          );
          isRaceHierarchy.mockReturnValue(true);
          getExchangeMarketRunnerWithRichContentByMarketAndRunnerURN =
            createRichContentExcRunnerByMarketAndRunnerURNSelector();
        });

        it("should return the corresponding market runner along with its rich content", () => {
          const runner = getExchangeMarketRunnerWithRichContentByMarketAndRunnerURN(state.entities, {
            marketURN: "ppb:excmarket:123",
            runnerURN: "ppb:excrunner:123",
          });
          expect(runner).toEqual({
            urn: "ppb:excmarket:123",
            selectionId: 123,
          });
        });
      });

      describe("and the selector is called multiple times", () => {
        beforeEach(() => {
          createRaceByURNSelector.mockReturnValue(jest.fn(() => state.entities.races["ppb:race:123"]));
          createRaceRunnersByRaceURNSelector.mockReturnValue(
            jest.fn(() => state.entities.racerunners["ppb:racerunner:123"]),
          );
          isRaceHierarchy.mockReturnValue(true);
          getExchangeMarketRunnerWithRichContentByMarketAndRunnerURN =
            createRichContentExcRunnerByMarketAndRunnerURNSelector();
        });

        describe("with the same inputs", () => {
          it("should keep the same object reference (memoization)", () => {
            const runner1 = getExchangeMarketRunnerWithRichContentByMarketAndRunnerURN(state.entities, {
              marketURN: "ppb:excmarket:123",
              runnerURN: "ppb:excrunner:123",
            });
            state = {
              ...state,
              entities: {
                ...state.entities,
                exchangerunners: { ...state.entities.exchangerunners },
              },
            };
            const runner2 = getExchangeMarketRunnerWithRichContentByMarketAndRunnerURN(state.entities, {
              marketURN: "ppb:excmarket:123",
              runnerURN: "ppb:excrunner:123",
            });
            expect(runner1).toBe(runner2);
          });
        });
      });
    });
  });

  describe("createRichContentExcRunnerWithPNLByMarketAndRunnerURNSelector", () => {
    const marketRunner123 = {
      urn: "ppb:excmarket:123",
      selectionId: 123,
      handicap: 1,
    };
    const excMarket123 = {
      urn: "ppb:excmarket:123",
      hierarchy: {
        race: "ppb:race:123",
        meeting: {},
      },
      runners: {
        "ppb:marketrunner:123": marketRunner123,
      },
    };
    const race = {
      urn: "ppb:race:123",
      runners: ["ppb:racerunner:123"],
    };

    const state = {
      betting: {},
      entities: {
        exchangemarkets: {
          "ppb:excmarket:123": excMarket123,
        },
        exchangerunners: {
          "ppb:excrunner:123": {},
        },
        races: {
          "ppb:race:123": race,
        },
        racerunners: {
          "ppb:racerunner:123": {
            urn: "ppb:racerunner:123",
            selectionId: 123,
            horse: {},
            details: {},
          },
        },
      },
    };
    let getRichContentExcRunnerWithPNLByMarketAndRunnerURNs;

    describe("when given a runner with Horse Racing (rich) content", () => {
      beforeEach(() => {
        createExchangeMarketSelector.mockReturnValue(jest.fn(() => excMarket123));
        createExchangeMarketRunnerByMarketAndRunnerURNsSelector.mockReturnValue(jest.fn(() => marketRunner123));
        createRaceByURNSelector.mockReturnValue(jest.fn(() => undefined));
        createRaceRunnersByRaceURNSelector.mockReturnValue(jest.fn(() => undefined));
        createRaceByURNSelector.mockReturnValue(jest.fn(() => state.entities.races["ppb:race:123"]));
        createRaceRunnersByRaceURNSelector.mockReturnValue(
          jest.fn(() => state.entities.racerunners["ppb:racerunner:123"]),
        );
        isRaceHierarchy.mockReturnValue(true);
        createBettingMarketRunnersPositionSelector.mockReturnValue(jest.fn(() => undefined));
        createExchangeRunnerWithoutOddsByRunnerURNSelector.mockReturnValue(jest.fn(() => undefined));

        getRichContentExcRunnerWithPNLByMarketAndRunnerURNs =
          createRichContentExcRunnerWithPNLByMarketAndRunnerURNSelector();
      });

      describe("and there is no live data (prices, status, etc) for that runner", () => {
        it("should return the corresponding market runner along with its rich content", () => {
          const runner = getRichContentExcRunnerWithPNLByMarketAndRunnerURNs(state, {
            marketURN: "ppb:excmarket:123",
            runnerURN: "ppb:excrunner:123",
          });
          expect(runner).toEqual({
            urn: "ppb:excmarket:123",
            selectionId: 123,
            handicap: 1,
          });
        });
      });

      describe("and there's' live data (prices, status, etc) for that runner", () => {
        beforeEach(() => {
          createExchangeRunnerWithoutOddsByRunnerURNSelector.mockReturnValue(
            jest.fn(() => ({
              urn: "ppb:excrunner:123",
              status: "ACTIVE",
              date: "fakeDate",
              reduction: 1.2,
            })),
          );

          getRichContentExcRunnerWithPNLByMarketAndRunnerURNs =
            createRichContentExcRunnerWithPNLByMarketAndRunnerURNSelector();
        });

        it("should return the corresponding market runner along with its rich content", () => {
          const runner = getRichContentExcRunnerWithPNLByMarketAndRunnerURNs(state, {
            marketURN: "ppb:excmarket:123",
            runnerURN: "ppb:excrunner:123",
          });
          expect(runner).toEqual({
            urn: "ppb:excmarket:123",
            selectionId: 123,
            handicap: 1,
            status: "ACTIVE",
            date: "fakeDate",
            reduction: 1.2,
          });
        });
      });

      describe("and there are potential bets for that runner", () => {
        beforeEach(() => {
          createExchangeRunnerWithoutOddsByRunnerURNSelector.mockReturnValue(
            jest.fn(() => ({
              urn: "ppb:excrunner:123",
              status: "ACTIVE",
              date: "fakeDate",
              reduction: 1.2,
            })),
          );

          createBettingMarketRunnersPositionSelector.mockReturnValue(
            jest.fn(() => [
              {
                selectionId: 123,
                handicap: 1,
                potentialPnl: {
                  win: 1,
                  lose: 1,
                },
                whatIf: {
                  win: 1,
                  lose: 1,
                },
              },
            ]),
          );

          getRichContentExcRunnerWithPNLByMarketAndRunnerURNs =
            createRichContentExcRunnerWithPNLByMarketAndRunnerURNSelector();
        });

        it("should return the corresponding potential bet info (PNL and WhatIf", () => {
          const runner = getRichContentExcRunnerWithPNLByMarketAndRunnerURNs(state, {
            marketURN: "ppb:excmarket:123",
            runnerURN: "ppb:excrunner:123",
          });
          expect(runner).toEqual({
            urn: "ppb:excmarket:123",
            selectionId: 123,
            handicap: 1,
            status: "ACTIVE",
            date: "fakeDate",
            reduction: 1.2,
            runnerPosition: {
              handicap: 1,
              potentialPnl: {
                lose: 1,
                win: 1,
              },
              selectionId: 123,
              whatIf: {
                lose: 1,
                win: 1,
              },
            },
          });
        });
      });
    });
  });

  describe("createFixtureBySportEventURNSelector", () => {
    const URN_MOCK = "sport:event:urn:1";
    const ENTITIES_MOCK = {
      footballfixtures: {
        "football:fixture:urn:123": {
          urn: "football:fixture:urn:123",
        },
      },
      tennisfixtures: {},
      basketballfixtures: {},
      baseballfixtures: {},
      cricketfixtures: {},
      tabletennisfixtures: {},
      americanfootballfixtures: {},
      icehockeyfixtures: {},
      rugbyunionfixtures: {},
      rugbyleaguefixtures: {},
      australianrulesfixtures: {},
      dartsfixtures: {},
      sportevents: {
        "sport:event:urn:no:event:id": {
          urn: "sport:event:urn:no:event:id",
        },
        "sport:event:urn:no:fixture": {
          urn: "sport:event:urn:no:fixture",
          eventId: 123456789,
        },
        [URN_MOCK]: {
          urn: URN_MOCK,
          eventId: 123,
        },
      },
    };

    beforeEach(() => {
      createTennisFixtureByURNSelector.mockReturnValueOnce(getTennisFixtureByURN);
      createBaseballFixtureByURNSelector.mockReturnValueOnce(getBaseballFixtureByURN);
      createBasketballFixtureByURNSelector.mockReturnValueOnce(getBasketballFixtureByURN);
      createCricketFixtureByURNSelector.mockReturnValueOnce(getCricketFixtureByURN);
      createTableTennisFixtureByURNSelector.mockReturnValueOnce(getTableTennisFixtureByURN);
      createIceHockeyFixtureByURNSelector.mockReturnValueOnce(getIceHockeyFixtureByURN);
      createRugbyUnionFixtureByURNSelector.mockReturnValueOnce(getRugbyUnionFixtureByURN);
      createRugbyLeagueFixtureByURNSelector.mockReturnValueOnce(getRugbyLeagueFixtureByURN);
      createSnookerFixtureByURNSelector.mockReturnValueOnce(getSnookerFixtureByURN);
      createVolleyballFixtureByURNSelector.mockReturnValueOnce(getVolleyballFixtureByURN);
      createAustralianRulesFixtureByURNSelector.mockReturnValueOnce(getAustralianRulesFixtureByURN);
      createDartsFixtureByURNSelector.mockReturnValueOnce(getDartsFixtureByURN);
    });

    it("should return undefined when sportEvent does not exist", () => {
      getSportEventByURN.mockReturnValueOnce(undefined);

      const getFixtureBySportEventURN = createFixtureBySportEventURNSelector();
      const result = getFixtureBySportEventURN(ENTITIES_MOCK, "invalid:urn");

      expect(result).toBeUndefined();

      expect(getSportEventByURN).toHaveBeenCalledWith(ENTITIES_MOCK.sportevents, "invalid:urn");
      expect(codecs.fixture.encode).not.toHaveBeenCalled();
    });

    it("should return undefined when sportEvent exists but eventId is missing", () => {
      getSportEventByURN.mockReturnValueOnce(ENTITIES_MOCK.sportevents["sport:event:urn:no:event:id"]);

      const getFixtureBySportEventURN = createFixtureBySportEventURNSelector();
      const result = getFixtureBySportEventURN(ENTITIES_MOCK, "sport:event:urn:no:event:id");

      expect(result).toBeUndefined();

      expect(getSportEventByURN).toHaveBeenCalledWith(ENTITIES_MOCK.sportevents, "sport:event:urn:no:event:id");
      expect(codecs.fixture.encode).not.toHaveBeenCalled();
    });

    it("should return undefined when fixture does not exist for the encoded fixture URN", () => {
      getSportEventByURN.mockReturnValue(ENTITIES_MOCK.sportevents["sport:event:urn:no:fixture"]);
      codecs.fixture.encode.mockReturnValueOnce({ uid: "football:fixture:urn:123456789" });

      const getFixtureBySportEventURN = createFixtureBySportEventURNSelector();
      const result = getFixtureBySportEventURN(ENTITIES_MOCK, "sport:event:urn:no:fixture");

      expect(result).toBeUndefined();

      expect(getSportEventByURN).toHaveBeenCalledWith(ENTITIES_MOCK.sportevents, "sport:event:urn:no:fixture");
      expect(codecs.fixture.encode).toHaveBeenCalledWith("123456789");
    });

    it("should return the fixture when sportEvent and fixture exist", () => {
      getSportEventByURN.mockReturnValueOnce(ENTITIES_MOCK.sportevents[URN_MOCK]);
      codecs.fixture.encode.mockReturnValueOnce({ uid: "football:fixture:urn:123" });

      const getFixtureBySportEventURN = createFixtureBySportEventURNSelector();
      const result = getFixtureBySportEventURN(ENTITIES_MOCK, URN_MOCK);

      expect(result).toEqual(ENTITIES_MOCK.footballfixtures["football:fixture:urn:123"]);

      expect(getSportEventByURN).toHaveBeenCalledWith(ENTITIES_MOCK.sportevents, URN_MOCK);
      expect(codecs.fixture.encode).toHaveBeenCalledWith("123");
    });
  });
});
