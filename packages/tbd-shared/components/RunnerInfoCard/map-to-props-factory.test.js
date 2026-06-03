import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createRaceRunnerByURNSelector } from "@ppb/tbd-store/state/entities/race-runners/race-runners-selectors";
import { makeMapStateToProps } from "./map-to-props-factory";

const getRunnerInfoCardByURN = jest.fn(() => ({
  typename: "RunnerInfoCard",
  urn: "ppb:tbd:card:runnerInfo:30458338.1200/36179752",
  title: "RunnerInfoCard",
  raceRunner: "ppb:tbd:racerunner:30458338.1200/36179752",
}));

const raceRunner = {
  __typename: "RaceRunner",
  urn: "ppb:tbd:racerunner:30458338.1200/36179752",
  raceURN: "ppb:race:30458338.1200",
  rating123: 2,
  ratingStars: 4,
  selectionId: 35686775,
  form: "35-5",
  rating: 71,
  comments:
    "Promising type. Fifth of 6 in novice event at Lingfield (10f, AW, 22/1) 39 days ago, emphasis on speed not playing to strengths. Stiffer test here will suit and remains with potential for handicaps.",
  horse: {
    name: "BAILEYS DERBYDAY",
    sireName: "NEW APPROACH (IRE)",
    damName: "POSTERITAS (USA)",
    damSireName: "LEAR FAN (USA)",
    age: 3,
    color: "BAY",
    sex: "COLT",
    bred: "IRE",
  },
  details: {
    jockeyName: "Oisin Murphy",
    trainerName: "Mark Johnston",
    saddleCloth: "2",
    weight: {
      stones: "9-8",
    },
    equipmentDescription: null,
    silk: "https://content.betfair.com/feeds_images/Horses/SilkColours/c20210427yar/00000211.png",
    draw: 4,
  },
};

const getRaceRunnerByURN = jest.fn(() => raceRunner);

jest.mock("@ppb/tbd-store/state/entities/race-runners/race-runners-selectors", () => ({
  createRaceRunnerByURNSelector: jest.fn(() => getRaceRunnerByURN),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getRunnerInfoCardByURN),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

const state = {
  layouts: {
    cards: {
      racerunners: ["ppb:card"],
    },
  },
  entities: { races: {} },
};

const setupMapStateToProps = (urn) => {
  const containerProps = {
    urn,
  };
  return makeMapStateToProps()(state, containerProps);
};

describe("RunnerInfoCard", () => {
  beforeEach(jest.clearAllMocks);

  describe("makeMapStateToProps", () => {
    it("should create the selectors", () => {
      makeMapStateToProps();
      expect(createCardByURNSelector).toHaveBeenCalledTimes(1);
      expect(createRaceRunnerByURNSelector).toHaveBeenCalledTimes(1);
    });

    describe("mapStateToProps", () => {
      it("should get data from state and return the correct props", () => {
        const stateProps = setupMapStateToProps("fakeRunnerInfoCardUrn");

        expect(getRunnerInfoCardByURN).toHaveBeenCalledWith(state.layouts.cards.runnerinfos, "fakeRunnerInfoCardUrn");
        expect(getRaceRunnerByURN).toHaveBeenCalledWith(
          state.entities.raceRunners,
          "ppb:tbd:racerunner:30458338.1200/36179752",
        );
        expect(stateProps).toEqual({
          silkURL: "https://content.betfair.com/feeds_images/Horses/SilkColours/c20210427yar/00000211.png",
          silkAlt: "I18N.RACE_RUNNER.SILK_ALT",
          runnerName: "BAILEYS DERBYDAY",
          runnerNumber: "2",
          jockeyLabel: "I18N.RACE_RUNNER.JOCKEY",
          jockey: "Oisin Murphy",
          trainerLabel: "I18N.RACE_RUNNER.TRAINER",
          trainer: "Mark Johnston",
        });
      });
    });
  });
});
