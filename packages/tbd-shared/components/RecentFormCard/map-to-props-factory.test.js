import { FixtureTeamSide, FixtureOutcome } from "@ppb/tbd-store/state/entities/football-fixture/FootballFixture.types";
import { RecentFormCaptionContentType } from "@ppb/the-wall-common/types";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { makeMapStateToProps } from "./map-to-props-factory";
import { formatFullDate } from "../../helpers/dates";
import { i18n } from "../../helpers/i18n";
import { RecentFormResultAlignment } from "./snowflakes/RecentFormResult/RecentFormResult.types";

const DATE_FORMAT_MOCK = "DATE FORMAT";

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(),
}));
jest.mock("../../view-model-factories/scoreboard");
jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));
jest.mock("../../helpers/dates", () => ({
  formatFullDate: jest.fn(() => DATE_FORMAT_MOCK),
}));

const getCountryLocalCurrencyCodeSelector = jest.fn(() => ({
  localeCodeBcp47: "locale",
  timezone: "timezone",
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getCountryLocalCurrencyCodeSelector),
}));

const i18nMock = {
  recentFormResultI18n: {
    [FixtureOutcome.WIN]: "I18N.RECENT_FORM.W",
    [FixtureOutcome.DRAW]: "I18N.RECENT_FORM.D",
    [FixtureOutcome.LOSE]: "I18N.RECENT_FORM.L",
    [RecentFormCaptionContentType.PEN]: "I18N.RECENT_FORM.PEN",
    [RecentFormCaptionContentType.AET]: "I18N.RECENT_FORM.AET",
    [FixtureTeamSide.HOME]: "I18N.RECENT_FORM.H",
    [FixtureTeamSide.AWAY]: "I18N.RECENT_FORM.A",
  },
  captionI18n: {
    A: {
      leftLabel: "I18N.RECENT_FORM.A",
      rightLabel: "I18N.RECENT_FORM.AWAY",
    },
    AET: {
      leftLabel: "I18N.RECENT_FORM.AET",
      rightLabel: "I18N.RECENT_FORM.AFTER_EXTRA_TIME",
    },
    D: {
      leftLabel: "I18N.RECENT_FORM.D",
      rightLabel: "I18N.RECENT_FORM.DRAW",
    },
    H: {
      leftLabel: "I18N.RECENT_FORM.H",
      rightLabel: "I18N.RECENT_FORM.HOME",
    },
    L: {
      leftLabel: "I18N.RECENT_FORM.L",
      rightLabel: "I18N.RECENT_FORM.LOSS",
    },
    PEN: {
      leftLabel: "I18N.RECENT_FORM.PEN",
      rightLabel: "I18N.RECENT_FORM.PENALTIES",
    },
    W: {
      leftLabel: "I18N.RECENT_FORM.W",
      rightLabel: "I18N.RECENT_FORM.WINNER",
    },
  },
};

describe("makeMapStateToProps", () => {
  const stateMock = {
    layouts: {
      cards: {
        recentforms: {
          "urn:tbd:card:1": {
            urn: "urn:tbd:card:1",
            fixture: "ppb:footballfixture:29601422",
            typename: "TeamFormCard",
            title: "Title",
          },
          "urn:tbd:card:2": {
            urn: "urn:tbd:card:2",
            typename: "TeamFormCard",
          },
          "urn:tbd:card:3": {
            urn: "urn:tbd:card:3",
            fixture: "ppb:footballfixture:3",
            typename: "TeamFormCard",
            title: "Title",
          },
          "urn:tbd:card:4": {
            urn: "urn:tbd:card:4",
            fixture: "ppb:footballfixture:4",
            typename: "TeamFormCard",
          },
        },
      },
    },
    entities: {
      footballfixtures: {
        "ppb:footballfixture:29601422": {
          urn: "ppb:footballfixture:29601422",
          scheduledAt: new Date("2019-12-23T15:15:00Z"),
          home: {
            name: "Aston Villa",
            color: "#1B458F",
            crest: {
              vector: "http://sca.qa.internal/Assets/Team%20Logo/English%20Premier%20League/Aston%20Villa.svg",
              small: "http://sca.qa.internal/Assets/logo/small/40.png",
              medium: "http://sca.qa.internal/Assets/logo/medium/40.png",
              large: "http://sca.qa.internal/Assets/logo/big/40.png",
            },
          },
          away: {
            name: "Leeds",
            color: "#DA291C",
            crest: {
              small: "http://sca.qa.internal/Assets/logo/small/34.png",
              medium: "http://sca.qa.internal/Assets/logo/medium/34.png",
              large: "http://sca.qa.internal/Assets/logo/big/34.png",
            },
          },
          recentForm: {
            home: [
              {
                opponent: "Liverpool",
                score: {
                  home: 2,
                  away: 1,
                },
                extraTimeScore: {
                  home: 2,
                  away: 1,
                },
                penaltyShootoutScore: {
                  home: 5,
                  away: 4,
                },
                outcome: "WIN",
                startAt: new Date("2019-12-23T15:15:00Z"),
                side: "HOME",
              },
            ],
            away: [
              {
                opponent: "Liverpool",
                score: {
                  home: 2,
                  away: 1,
                },
                extraTimeScore: {
                  home: 2,
                  away: 1,
                },
                penaltyShootoutScore: {
                  home: 5,
                  away: 4,
                },
                outcome: "WIN",
                startAt: new Date("2019-12-23T15:15:00Z"),
                side: "HOME",
              },
            ],
          },
        },
        "ppb:footballfixture:2": {
          home: {
            name: "Home",
          },
          away: {
            name: "Away",
          },
        },
        "ppb:footballfixture:3": {
          urn: "ppb:footballfixture:3",
          scheduledAt: new Date("2019-12-23T15:15:00Z"),
          home: {
            name: "Crystal Palace",
            color: "#1B458F",
          },
          away: {
            name: "Chelsea",
            color: "#DA291C",
          },
          recentForm: {
            home: [
              {
                opponent: "Liverpool",
                score: {
                  home: 2,
                  away: 1,
                },
                extraTimeScore: undefined,
                penaltyShootoutScore: null,
                outcome: "WIN",
                startAt: new Date("2019-12-23T15:15:00Z"),
                side: "HOME",
              },
            ],
            away: [
              {
                opponent: "Liverpool",
                score: {
                  home: 2,
                  away: 1,
                },
                extraTimeScore: undefined,
                penaltyShootoutScore: null,
                outcome: "WIN",
                startAt: new Date("2019-12-23T15:15:00Z"),
                side: "HOME",
              },
            ],
          },
        },
        "ppb:footballfixture:4": {
          urn: "ppb:footballfixture:4",
          home: {},
          away: {},
          recentForm: {
            home: [],
            away: [],
          },
        },
      },
    },
  };
  const getRecentFormCardByURN = jest.fn();
  const getFootballFixture = jest.fn();

  function setupMapStateToProps(cardMock, footballFixtureMock) {
    createCardByURNSelector.mockImplementation(() => getRecentFormCardByURN);
    getRecentFormCardByURN.mockImplementation(() => cardMock);
    getFootballFixture.mockImplementation(() => footballFixtureMock);

    return makeMapStateToProps()(stateMock, { urn: "urn:tbd:card:1" });
  }

  describe("when there is a card for provided URN", () => {
    it("should getRecentFormCardByURN from state", () => {
      setupMapStateToProps(
        stateMock.layouts.cards.recentforms["urn:tbd:card:1"],
        stateMock.entities.footballfixtures["ppb:footballfixture:29601422"],
      );

      expect(getRecentFormCardByURN).toHaveBeenCalledWith(stateMock.layouts.cards.recentforms, "urn:tbd:card:1");
    });

    it("should return card with title when title exist", () => {
      const card = setupMapStateToProps(
        stateMock.layouts.cards.recentforms["urn:tbd:card:1"],
        stateMock.entities.footballfixtures["ppb:footballfixture:29601422"],
      );
      expect(formatFullDate).toHaveBeenCalledWith(new Date("2019-12-23T15:15:00.000Z"), "locale", "timezone");

      expect(card).toEqual({
        home: {
          detailed: [
            {
              score: {
                home: 2,
                away: 1,
              },
              isExtraTimeScore: true,
              penaltyScore: {
                home: 5,
                away: 4,
              },
              opponent: "Liverpool",
              date: "DATE FORMAT",
              side: FixtureTeamSide.HOME,
              outcome: FixtureOutcome.WIN,
              alignment: RecentFormResultAlignment.RIGHT,
              translations: i18nMock.recentFormResultI18n,
            },
          ],
        },
        away: {
          detailed: [
            {
              score: {
                home: 2,
                away: 1,
              },
              isExtraTimeScore: true,
              penaltyScore: {
                home: 5,
                away: 4,
              },
              opponent: "Liverpool",
              date: "DATE FORMAT",
              side: FixtureTeamSide.HOME,
              outcome: FixtureOutcome.WIN,
              alignment: RecentFormResultAlignment.LEFT,
              translations: i18nMock.recentFormResultI18n,
            },
          ],
        },
        translations: {
          recentFormDetailedTranslations: i18nMock,
        },
      });
    });

    it("should return card without penaltyShootoutScore and extraTimeScore", () => {
      const card = setupMapStateToProps(
        stateMock.layouts.cards.recentforms["urn:tbd:card:3"],
        stateMock.entities.footballfixtures["ppb:footballfixture:3"],
      );

      expect(formatFullDate).toHaveBeenCalledWith(new Date("2019-12-23T15:15:00.000Z"), "locale", "timezone");
      expect(card).toEqual({
        home: {
          detailed: [
            {
              score: {
                home: 2,
                away: 1,
              },
              isExtraTimeScore: false,
              penaltyScore: undefined,
              opponent: "Liverpool",
              date: "DATE FORMAT",
              side: FixtureTeamSide.HOME,
              outcome: FixtureOutcome.WIN,
              alignment: RecentFormResultAlignment.RIGHT,
              translations: i18nMock.recentFormResultI18n,
            },
          ],
        },
        away: {
          detailed: [
            {
              score: {
                home: 2,
                away: 1,
              },
              isExtraTimeScore: false,
              penaltyScore: undefined,
              opponent: "Liverpool",
              date: "DATE FORMAT",
              side: FixtureTeamSide.HOME,
              outcome: FixtureOutcome.WIN,
              alignment: RecentFormResultAlignment.LEFT,
              translations: i18nMock.recentFormResultI18n,
            },
          ],
        },
        translations: {
          recentFormDetailedTranslations: i18nMock,
        },
      });
    });
  });

  describe("when there is no card for provided URN", () => {
    it("should getRecentFormCardByURN from state", () => {
      setupMapStateToProps(
        stateMock.layouts.cards.recentforms["urn:tbd:card:1"],
        stateMock.entities.footballfixtures["ppb:footballfixture:29601422"],
      );

      expect(getRecentFormCardByURN).toHaveBeenCalledWith(stateMock.layouts.cards.recentforms, "urn:tbd:card:1");
    });

    it("should return empty object", () => {
      const card = setupMapStateToProps(null);

      expect(card).toEqual({});
    });
  });

  describe("when recent form data is empty", () => {
    it("should return null", () => {
      const card = setupMapStateToProps(
        stateMock.layouts.cards.recentforms["urn:tbd:card:2"],
        stateMock.entities.footballfixtures["ppb:footballfixture:2"],
      );
      expect(card).toEqual({});
    });
  });

  describe("when recent form home or away exists but is empty", () => {
    it("should return null", () => {
      const card = setupMapStateToProps(
        stateMock.layouts.cards.recentforms["urn:tbd:card:4"],
        stateMock.entities.footballfixtures["ppb:footballfixture:4"],
      );
      expect(card).toEqual({});
    });
  });

  describe("when get translations", () => {
    beforeEach(() => {
      createCardByURNSelector.mockImplementation(() => getRecentFormCardByURN);
      getRecentFormCardByURN.mockImplementation(() => stateMock.layouts.cards.recentforms["urn:tbd:card:3"]);
      getFootballFixture.mockImplementation(() => stateMock.entities.footballfixtures["ppb:footballfixture:3"]);
    });

    describe("when locale code is the same", () => {
      it("should call i18n only once for each key", () => {
        jest.clearAllMocks();
        getCountryLocalCurrencyCodeSelector.mockReturnValue({ localeCode: "pt" });

        const mapStateToProps = makeMapStateToProps();
        mapStateToProps(stateMock, { urn: "urn:tbd:card:1" });
        mapStateToProps(stateMock, { urn: "urn:tbd:card:1" });

        expect(i18n).toHaveBeenCalledTimes(21);
      });
    });

    describe("when locale code is not the same", () => {
      it("should call i18n twice for each key", () => {
        jest.clearAllMocks();
        getCountryLocalCurrencyCodeSelector.mockReturnValue({ localeCode: "pt" });

        const mapStateToProps = makeMapStateToProps();
        mapStateToProps(stateMock, { urn: "urn:tbd:card:1" });

        getCountryLocalCurrencyCodeSelector.mockReturnValue({ localeCode: "de" });

        mapStateToProps(stateMock, { urn: "urn:tbd:card:1" });

        expect(i18n).toHaveBeenCalledTimes(42);
      });
    });
  });
});
