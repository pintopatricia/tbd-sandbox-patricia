import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { makeMapStateToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => {
  const selectorMock = jest.fn();
  return {
    createCardByURNSelector: jest.fn(() => selectorMock),
  };
});

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => {
  const selectorMock = jest.fn();
  return {
    createGetCountryLocalCurrencyCodeSelector: jest.fn(() => selectorMock),
  };
});

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn((key) => key),
}));

const CARD_MOCK = {
  urn: "ppb:tbd:card:headtoheads:12345",
  typename: "HeadToHeadCard",
  fixture: "ppb:fixture:12345",
};

const COUNTRY_LOCAL_CURRENCY_MOCK = {
  localeCodeBcp47: "PT",
  timezone: "PT",
};

const STATE_MOCK = {
  layouts: {
    cards: {
      headtoheads: {
        "ppb:tbd:card:headtoheads:12345": CARD_MOCK,
      },
    },
  },
  entities: {
    footballfixtures: {
      "ppb:fixture:12345": {
        typename: "FootballFixture",
        urn: "ppb:fixture:12345",
        head2head: {
          home: [
            {
              score: { home: 3, away: 0 },
            },
          ],
          away: [
            {
              score: { home: 3, away: 0 },
            },
          ],
        },
        home: { name: "FCP" },
        away: { name: "SCP" },
      },
    },
  },
};

function setup(cardMock = CARD_MOCK) {
  createCardByURNSelector().mockReturnValue(cardMock);
  createGetCountryLocalCurrencyCodeSelector().mockReturnValue(COUNTRY_LOCAL_CURRENCY_MOCK);

  return makeMapStateToProps();
}

describe("mapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should return props when card exist", () => {
    const mapStateToProps = setup();

    const result = mapStateToProps(STATE_MOCK, { urn: "ppb:tbd:card:teamlineupcard:12345" });

    expect(createCardByURNSelector()).toHaveBeenCalledWith(
      STATE_MOCK.layouts.cards.headtoheads,
      "ppb:tbd:card:teamlineupcard:12345",
    );
    expect(createGetCountryLocalCurrencyCodeSelector()).toHaveBeenCalledWith(STATE_MOCK);

    expect(result).toEqual({
      captionTranslations: {
        A: {
          leftLabel: {
            key: "I18N.CAPTION.A",
          },
          rightLabel: {
            key: "I18N.CAPTION.AWAY",
          },
        },
        AET: {
          leftLabel: {
            key: "I18N.CAPTION.AET",
          },
          rightLabel: {
            key: "I18N.CAPTION.AFTER_EXTRA_TIME",
          },
        },
        D: {
          leftLabel: {
            key: "I18N.CAPTION.D",
          },
          rightLabel: {
            key: "I18N.CAPTION.DRAW",
          },
        },
        H: {
          leftLabel: {
            key: "I18N.CAPTION.H",
          },
          rightLabel: {
            key: "I18N.CAPTION.HOME",
          },
        },
        L: {
          leftLabel: {
            key: "I18N.CAPTION.L",
          },
          rightLabel: {
            key: "I18N.CAPTION.LOSE",
          },
        },
        PEN: {
          leftLabel: {
            key: "I18N.CAPTION.P",
          },
          rightLabel: {
            key: "I18N.CAPTION.PENALTIES",
          },
        },
        W: {
          leftLabel: {
            key: "I18N.CAPTION.W",
          },
          rightLabel: {
            key: "I18N.CAPTION.WIN",
          },
        },
      },
      headToHeadProps: [
        {
          afterExtraTime: false,
          awayTeamCrest: undefined,
          awayTeamName: "FCP",
          homeTeamCrest: undefined,
          homeTeamName: "SCP",
          i18n: {
            aet: {
              key: "I18N.HEAD_TO_HEAD.AFTER_EXTRA_TIME",
            },
            penalties: {
              key: "I18N.HEAD_TO_HEAD.PENALTIES",
            },
          },
          score: "3 - 0",
          viewMode: "EXTENDED",
        },
      ],
    });
  });

  it("should return empty when card does not exist", () => {
    const mapStateToProps = setup(null);

    const result = mapStateToProps(STATE_MOCK, { urn: "ppb:tbd:card:matchstats:12345" });

    expect(result).toEqual({});
  });

  it("should return empty when fixture does not exist", () => {
    const mapStateToProps = setup();

    const result = mapStateToProps(
      { layouts: { cards: { headtoheads: {} } }, entities: { footballfixtures: {} } },
      { urn: "ppb:tbd:card:matchstats:12345" },
    );

    expect(result).toEqual({});
  });
});
