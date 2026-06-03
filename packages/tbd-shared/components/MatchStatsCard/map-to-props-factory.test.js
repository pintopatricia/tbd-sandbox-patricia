import { createHydratedMatchStatsCardByURNSelector } from "@ppb/tbd-store/state/application-state-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createGetMatchStatsVM } from "../../view-model-factories/match-stats-card";
import { makeMapStateToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/application-state-selectors", () => {
  const selectorMock = jest.fn();
  return {
    createHydratedMatchStatsCardByURNSelector: jest.fn(() => selectorMock),
  };
});

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => {
  const selectorMock = jest.fn();
  return {
    createGetCountryLocalCurrencyCodeSelector: jest.fn(() => selectorMock),
  };
});

jest.mock("../../view-model-factories/match-stats-card", () => {
  const selectorMock = jest.fn();
  return {
    createGetMatchStatsVM: jest.fn(() => selectorMock),
  };
});

const HYDRATED_CARD_MOCK = {
  fixture: "ppb:fixture:12345",
  home: { stats: [] },
  away: { stats: [] },
};

const COUNTRY_LOCAL_CURRENCY_MOCK = {
  localeCode: "PT",
};

const MATCH_STATS_MOCK = {
  matchStats: {
    barStats: ["anything"],
  },
};

const STATE_MOCK = {
  entities: {
    footballfixtures: {
      "ppb:fixture:12345": {
        typename: "FootballFixture",
        urn: "ppb:fixture:12345",
      },
    },
  },
};

function setup(hydratedCardMock = HYDRATED_CARD_MOCK, matchStatsMock = MATCH_STATS_MOCK) {
  createHydratedMatchStatsCardByURNSelector().mockReturnValue(hydratedCardMock);
  createGetCountryLocalCurrencyCodeSelector().mockReturnValue(COUNTRY_LOCAL_CURRENCY_MOCK);
  createGetMatchStatsVM().mockReturnValue(matchStatsMock);

  return makeMapStateToProps();
}

describe("mapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should return props when card exist", () => {
    const mapStateToProps = setup();

    const result = mapStateToProps(STATE_MOCK, { urn: "ppb:tbd:card:matchstats:12345" });

    expect(createHydratedMatchStatsCardByURNSelector()).toHaveBeenCalledWith(
      STATE_MOCK,
      "ppb:tbd:card:matchstats:12345",
    );
    expect(createGetCountryLocalCurrencyCodeSelector()).toHaveBeenCalledWith(STATE_MOCK);
    expect(createGetMatchStatsVM()).toHaveBeenCalledWith(HYDRATED_CARD_MOCK, "PT");
    expect(result).toEqual({
      fixtureURN: "ppb:fixture:12345",
      matchStats: {
        barStats: ["anything"],
      },
      typename: "FootballFixture",
    });
  });

  it("should return empty when card does not exist", () => {
    const mapStateToProps = setup(null);

    const result = mapStateToProps(STATE_MOCK, { urn: "ppb:tbd:card:matchstats:12345" });

    expect(result).toEqual({});
  });

  it("should return empty when fixture does not exist", () => {
    const mapStateToProps = setup();

    const result = mapStateToProps({ entities: { footballfixtures: {} } }, { urn: "ppb:tbd:card:matchstats:12345" });

    expect(result).toEqual({});
  });

  it("should return empty when stats are empty", () => {
    const mapStateToProps = setup(HYDRATED_CARD_MOCK, {
      matchStats: {
        barStats: [],
      },
    });

    const result = mapStateToProps(STATE_MOCK, { urn: "ppb:tbd:card:matchstats:12345" });

    expect(result).toEqual({});
  });
});
