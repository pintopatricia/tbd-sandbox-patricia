import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { UI__NAVIGATE_TO_VIEW } from "@ppb/tbd-store/actions/navigation";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { MarketPromoSignposting } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { OddsDisplayPreference } from "@ppb/tbd-store";
import { createSportsbookDisplayOddsPreferencesSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { createRaceByURNSelector } from "@ppb/tbd-store/state/entities/races/race-selectors";
import { createMeetingByURNSelector } from "@ppb/tbd-store/state/entities/meetings/meeting-selectors";
import { getSportByURN } from "@ppb/tbd-store/state/entities/sports/sport-selectors";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { formatTime } from "../../helpers/dates";
import { formatStartingPrice, getFavouriteLabel } from "../../view-model-factories/race-results-card";
import { i18n } from "../../helpers/i18n";

const cardURN = "ppb:tbd:card:byTimeRange:7|30595392.1715";
const raceByTimeRangeCardMock = {
  urn: cardURN,
  typename: "RaceByTimeRangeCard",
  viewLink: {
    viewUrn: "ppb:tbd:view:race:7|30595392.1715",
    viewUrl: "horse-racing/delaware-park-(us)-7th-jun/r-7%7C30595392.1715",
  },
  race: "raceUrn",
  marketPromo: "EXTRA_PLACES",
  startTime: "2021-06-07T17:15:00.000Z",
  winner: "winnerHorse",
  winnerIsp: {
    favourite: true,
    decimal: 2.5,
    fractional: {
      numerator: 3,
      denominator: 1,
    },
  },
};

const getUserDetails = jest.fn(() => ({ localeCodeBcp47: "locale", timezone: "timezone" }));
const getSportsbookDisplayOddsPreferences = jest.fn(() => OddsDisplayPreference.Fractional);
const getCardByURNSelector = jest.fn(() => raceByTimeRangeCardMock);

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));
jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createSportsbookDisplayOddsPreferencesSelector: jest.fn(() => getSportsbookDisplayOddsPreferences),
}));
jest.mock("@ppb/tbd-store/state/entities/meetings/meeting-selectors", () => ({
  createMeetingByURNSelector: jest.fn(() => jest.fn(() => ({ urn: "meetingUrn", sportUrn: "ppb:eventType:7" }))),
}));
jest.mock("../../helpers/dates", () => ({
  formatTime: jest.fn(() => "17:15"),
}));
jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getCardByURNSelector),
}));
jest.mock("@ppb/tbd-store/state/entities/races/race-selectors", () => ({
  createRaceByURNSelector: jest.fn(() =>
    jest.fn(() => ({
      urn: "ppb:race:30595392.1715",
      name: "raceName",
      details: {
        resultType: "QUICK_RESULTS",
        raceClass: "raceClass",
      },
    })),
  ),
}));
jest.mock("../../view-model-factories/race-results-card", () => ({
  formatStartingPrice: jest.fn(() => "3/2"),
  getFavouriteLabel: jest.fn((isFav) => (isFav ? "Fav" : undefined)),
}));
jest.mock("@ppb/tbd-store/state/entities/sports/sport-selectors", () => ({
  getSportByURN: jest.fn(() => ({ sportId: 7 })),
}));
jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

const stateMock = {
  layouts: {
    cards: {
      racebytimerangecards: {
        [cardURN]: raceByTimeRangeCardMock,
      },
    },
  },
  entities: {
    races: {
      "ppb:race:30595392.1715": {
        urn: "ppb:race:30595392.1715",
      },
    },
    sports: {
      "ppb:eventType:7": {
        urn: "ppb:eventType:7",
        name: "Horse Racing",
        sportId: 7,
      },
    },
    preferences: {
      sportsbookOddsDisplay: "FRACTIONAL",
    },
    brandSettings: {
      RACES_BY_TIME_GRID: false,
    },
  },
};

const noStateMock = {
  layouts: {
    cards: {
      racebytimerangecards: {},
    },
  },
};

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should create the selectors", () => {
    makeMapStateToProps();
    expect(createCardByURNSelector).toHaveBeenCalledTimes(1);
    expect(createSportsbookDisplayOddsPreferencesSelector).toHaveBeenCalledTimes(1);
    expect(createRaceByURNSelector).toHaveBeenCalledTimes(1);
    expect(createMeetingByURNSelector).toHaveBeenCalledTimes(1);
    expect(createGetCountryLocalCurrencyCodeSelector).toHaveBeenCalledTimes(1);
  });

  describe("mapStateToProps", () => {
    it("should call the getCardByURNSelector with the right props", () => {
      const mapStateToProps = makeMapStateToProps();

      mapStateToProps(stateMock, { urn: cardURN });
      expect(getCardByURNSelector).toHaveBeenCalledTimes(1);
      expect(getCardByURNSelector).toHaveBeenCalledWith(stateMock.layouts.cards.racebytimerangecards, cardURN);
    });

    it("should call the getUserDetails with the right props", () => {
      const mapStateToProps = makeMapStateToProps();

      mapStateToProps(stateMock, { urn: cardURN });
      expect(getUserDetails).toHaveBeenNthCalledWith(1, stateMock);
    });

    describe("and the range by time range card doesn't exist", () => {
      it("should return an empty object if there is no raceByTimeRangeCard", () => {
        const getCardByURNSelectorNullMock = jest.fn(() => null);
        createCardByURNSelector.mockReturnValueOnce(getCardByURNSelectorNullMock);
        const mapStateToProps = makeMapStateToProps();

        const stateProps = mapStateToProps(noStateMock, { urn: cardURN });
        expect(stateProps).toEqual({});
      });
    });

    describe("and the range by time range card exists", () => {
      describe("and is not horse racing", () => {
        it("should return the expected properties", () => {
          const raceByTimeRangeCardMockNoWinner = {
            ...raceByTimeRangeCardMock,
            winner: undefined,
            winnerIsp: undefined,
          };

          const raceMock = {
            urn: "ppb:race:30595392.1715",
          };
          const getCardByURNSelectorMock = jest.fn(() => raceByTimeRangeCardMockNoWinner);
          const getRaceByURNSelector = jest.fn(() => raceMock);
          const getMeetingByURNSelector = jest.fn(() => ({ urn: "meetingUrn", sportUrn: "ppb:eventType:6" }));
          createRaceByURNSelector.mockReturnValueOnce(getRaceByURNSelector);
          createCardByURNSelector.mockReturnValueOnce(getCardByURNSelectorMock);
          createMeetingByURNSelector.mockReturnValueOnce(getMeetingByURNSelector);
          getSportByURN.mockReturnValueOnce({ sportId: 6 });
          const mapStateToProps = makeMapStateToProps();

          const stateProps = mapStateToProps(stateMock, { urn: cardURN });

          expect(formatTime).toHaveBeenCalledWith(raceByTimeRangeCardMock.startTime, "locale", "timezone");
          expect(formatStartingPrice).toHaveBeenCalledWith(undefined, OddsDisplayPreference.Fractional);
          expect(i18n).not.toHaveBeenCalled();
          expect(getSportByURN).toHaveBeenCalledWith(stateMock.entities.sports, "ppb:eventType:6");
          expect(getFavouriteLabel).not.toHaveBeenCalled();
          expect(stateProps).toEqual({
            title: "17:15",
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30595392.1715",
              viewUrl: "horse-racing/delaware-park-(us)-7th-jun/r-7%7C30595392.1715",
            },
            isRaceClosed: false,
            promotion: MarketPromoSignposting.ExtraPlaces,
            raceName: undefined,
            raceWinner: undefined,
            isHorseRacing: false,
            isGrid: false,
          });
        });
      });

      describe("and is horse racing", () => {
        describe("and has result type", () => {
          describe("and has winner data", () => {
            describe("and winner was the favourite", () => {
              it("should return the expected properties", () => {
                const mapStateToProps = makeMapStateToProps();
                const stateProps = mapStateToProps(stateMock, { urn: cardURN });

                expect(formatTime).toHaveBeenCalledWith(raceByTimeRangeCardMock.startTime, "locale", "timezone");
                expect(formatStartingPrice).toHaveBeenCalledWith(
                  raceByTimeRangeCardMock.winnerIsp,
                  OddsDisplayPreference.Fractional,
                );
                expect(getFavouriteLabel).toHaveBeenCalledWith(raceByTimeRangeCardMock.winnerIsp.favourite);
                expect(i18n).toHaveBeenNthCalledWith(1, { key: "I18N.RECENT_FORM.WINNER" });
                expect(i18n).toHaveBeenNthCalledWith(2, { key: "I18N.LABELS.CLASS" });
                expect(getSportByURN).toHaveBeenCalledWith(stateMock.entities.sports, "ppb:eventType:7");
                expect(getFavouriteLabel).toHaveBeenCalledWith(raceByTimeRangeCardMock.winnerIsp.favourite);
                expect(stateProps).toEqual({
                  title: "17:15",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:race:7|30595392.1715",
                    viewUrl: "horse-racing/delaware-park-(us)-7th-jun/r-7%7C30595392.1715",
                  },
                  isRaceClosed: true,
                  promotion: undefined,
                  subtitle: "I18N.RECENT_FORM.WINNER: winnerhorse @ 3/2 (Fav)",
                  isHorseRacing: true,
                  isGrid: false,
                });
              });
            });

            describe("and winner wasn't the favourite", () => {
              it("should return the expected subtitle", () => {
                const raceByTimeRangeCardMockWinnerNoFavourite = {
                  ...raceByTimeRangeCardMock,
                  winnerIsp: {
                    favourite: false,
                    decimal: 2.5,
                    fractional: {
                      numerator: 3,
                      denominator: 1,
                    },
                  },
                };
                const raceMock = {
                  urn: "ppb:race:30595392.1715",
                  name: "raceName",
                  details: {
                    resultType: "QUICK_RESULTS",
                  },
                };
                const getCardByURNSelectorMock = jest.fn(() => raceByTimeRangeCardMockWinnerNoFavourite);
                const getRaceByURNSelector = jest.fn(() => raceMock);
                createRaceByURNSelector.mockReturnValueOnce(getRaceByURNSelector);
                createCardByURNSelector.mockReturnValueOnce(getCardByURNSelectorMock);

                const mapStateToProps = makeMapStateToProps();
                const stateProps = mapStateToProps(stateMock, { urn: cardURN });

                expect(stateProps.subtitle).toEqual("I18N.RECENT_FORM.WINNER: winnerhorse @ 3/2");
              });

              describe("and RACES_BY_TIME_GRID is enabled", () => {
                it("should set isGrid to true", () => {
                  const stateWithGrid = {
                    ...stateMock,
                    entities: {
                      ...stateMock.entities,
                      brandSettings: { RACES_BY_TIME_GRID: true },
                    },
                  };
                  const mapStateToProps = makeMapStateToProps();
                  const stateProps = mapStateToProps(stateWithGrid, { urn: cardURN });
                  expect(stateProps.isGrid).toBe(true);
                });
              });
            });
          });

          describe("and has no winner data", () => {
            it("should return the expected subtitle", () => {
              const raceByTimeRangeCardMockWinnerNoFavourite = {
                ...raceByTimeRangeCardMock,
                winner: undefined,
                winnerIsp: undefined,
              };
              const raceMock = {
                urn: "ppb:race:30595392.1715",
                name: "raceName",
                details: {
                  resultType: "QUICK_RESULTS",
                },
              };
              const getCardByURNSelectorMock = jest.fn(() => raceByTimeRangeCardMockWinnerNoFavourite);
              const getRaceByURNSelector = jest.fn(() => raceMock);
              createRaceByURNSelector.mockReturnValueOnce(getRaceByURNSelector);
              createCardByURNSelector.mockReturnValueOnce(getCardByURNSelectorMock);

              const mapStateToProps = makeMapStateToProps();
              const stateProps = mapStateToProps(stateMock, { urn: cardURN });

              expect(stateProps.subtitle).toEqual("raceName");
            });
          });
        });

        describe("and has no result type", () => {
          it("should return the expected subtitle", () => {
            const raceByTimeRangeCardMockWinnerNoFavourite = {
              ...raceByTimeRangeCardMock,
              winner: undefined,
              winnerIsp: undefined,
            };

            const raceMock = {
              urn: "ppb:race:30595392.1715",
              name: "raceName",
              details: {
                resultType: undefined,
              },
            };
            const getCardByURNSelectorMock = jest.fn(() => raceByTimeRangeCardMockWinnerNoFavourite);
            const getRaceByURNSelector = jest.fn(() => raceMock);
            createRaceByURNSelector.mockReturnValueOnce(getRaceByURNSelector);
            createCardByURNSelector.mockReturnValueOnce(getCardByURNSelectorMock);

            const mapStateToProps = makeMapStateToProps();
            const stateProps = mapStateToProps(stateMock, { urn: cardURN });

            expect(stateProps.subtitle).toEqual("raceName");
          });

          describe("and has winner data", () => {
            it("should return the expected properties", () => {
              const raceMock = {
                urn: "ppb:race:30595392.1715",
                name: "raceName",
                details: {
                  resultType: undefined,
                },
              };
              const getRaceByURNSelector = jest.fn(() => raceMock);
              createRaceByURNSelector.mockReturnValueOnce(getRaceByURNSelector);
              const mapStateToProps = makeMapStateToProps();
              const stateProps = mapStateToProps(stateMock, { urn: cardURN });

              expect(formatTime).toHaveBeenCalledWith(raceByTimeRangeCardMock.startTime, "locale", "timezone");
              expect(formatStartingPrice).toHaveBeenCalledWith(
                raceByTimeRangeCardMock.winnerIsp,
                OddsDisplayPreference.Fractional,
              );
              expect(getFavouriteLabel).toHaveBeenCalledWith(raceByTimeRangeCardMock.winnerIsp.favourite);
              expect(i18n).toHaveBeenNthCalledWith(1, { key: "I18N.RECENT_FORM.WINNER" });
              expect(getSportByURN).toHaveBeenCalledWith(stateMock.entities.sports, "ppb:eventType:7");
              expect(getFavouriteLabel).toHaveBeenCalledWith(raceByTimeRangeCardMock.winnerIsp.favourite);
              expect(stateProps).toEqual({
                title: "17:15",
                viewLink: {
                  viewUrn: "ppb:tbd:view:race:7|30595392.1715",
                  viewUrl: "horse-racing/delaware-park-(us)-7th-jun/r-7%7C30595392.1715",
                },
                isRaceClosed: true,
                promotion: "EXTRA_PLACES",
                subtitle: "I18N.RECENT_FORM.WINNER: winnerhorse @ 3/2 (Fav)",
                isHorseRacing: true,
                isGrid: false,
              });
            });
          });
        });
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  describe("on dispatchPush trigger", () => {
    it("should dispatch PushAction", () => {
      const { dispatchPush } = mapDispatchToProps;

      expect(dispatchPush("viewLink")).toEqual({
        payload: "viewLink",
        type: PUSH,
      });
    });
  });

  describe("on dispatchClickAction trigger", () => {
    it("should dispatch NavigateToView", () => {
      const { dispatchClickAction } = mapDispatchToProps;

      expect(dispatchClickAction("urn", "url", "label")).toEqual({
        type: UI__NAVIGATE_TO_VIEW,
        payload: {
          cardURN: "urn",
          url: "url",
          module: "secondary swimlane",
          label: "label",
        },
      });
    });
    it("should dispatch NavigateToView when the race is resulted", () => {
      const { dispatchClickAction } = mapDispatchToProps;

      expect(dispatchClickAction("urn", "url", "label", true)).toEqual({
        type: UI__NAVIGATE_TO_VIEW,
        payload: {
          cardURN: "urn",
          url: "url",
          module: "secondary swimlane",
          label: "resulted race time",
        },
      });
    });
  });
});
