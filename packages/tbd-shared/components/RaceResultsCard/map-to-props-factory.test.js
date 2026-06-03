import { OddsDisplayPreference } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { SUBSCRIBE_RACE_UPDATES, UNSUBSCRIBE_RACE_UPDATES } from "@ppb/tbd-store/actions/race";
import { makeMapStateToProps } from "./map-to-props-factory";
import { mapDispatchToProps } from "../RaceDetailsCard/map-to-props-factory";

const getRaceResultsCardByURN = jest.fn(() => ({
  urn: "ppb:tbd:card:raceresults:1.14.1200228.1",
  typename: "RaceResultsCard",
  race: "ppb:race:1.14.1200228.1",
}));

const getRaceWithRunnersByURN = jest.fn(() => ({
  raceRunners: {
    "raceRunnerUrn:1": {
      urn: "raceRunnerUrn:1",
    },
  },
  race: {
    urn: "ppb:race:1.14.1200228.1",
    winningTime: 250,
    details: {
      resultType: "FULL_RESULT",
    },
  },
}));

const getSportsbookDisplayOddsPreferences = jest.fn(() => OddsDisplayPreference.Decimal);

const getRaceResultsViewModel = jest.fn(() => ({
  title: "Full Results",
  resultRunners: [
    {
      position: 1,
      distance: "nk",
      saddleCloth: "7",
      horseName: "Camilo Anderson",
      silk: "silk url",
      draw: 1,
      jockeyName: "John Stepehnson",
      startingPrice: "100/10",
      bspAdvantage: 20,
    },
  ],
  ranNumber: 5,
  dnfCodes: { PU: "Pulled up" },
  winningTime: "3m 2s",
  bspAdvantage: "20%",
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getRaceResultsCardByURN),
}));

jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => ({
  createRaceWithRunnersByURNSelector: jest.fn(() => getRaceWithRunnersByURN),
}));

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createSportsbookDisplayOddsPreferencesSelector: jest.fn(() => getSportsbookDisplayOddsPreferences),
}));

jest.mock("../../view-model-factories/race-results-card", () => ({
  createRaceResultsViewModel: jest.fn(() => getRaceResultsViewModel),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

const state = {
  layouts: {
    cards: {
      raceresults: ["ppb:card"],
    },
  },
  entities: { races: {}, meetings: {}, racerunners: {}, preferences: {} },
};

const setupMapStateToProps = (urn) => {
  const containerProps = {
    urn,
  };
  return makeMapStateToProps()(state, containerProps);
};

describe("makeMapStateToProps", () => {
  it("should get data from state and build correct view model", () => {
    const stateProps = setupMapStateToProps("fakeRaceResultsCardUrn");

    expect(getRaceResultsCardByURN).toHaveBeenCalledWith(state.layouts.cards.raceresults, "fakeRaceResultsCardUrn");
    expect(getRaceWithRunnersByURN).toHaveBeenCalledWith(state.entities, "ppb:race:1.14.1200228.1");
    expect(getSportsbookDisplayOddsPreferences).toHaveBeenCalledWith(state.entities.preferences);
    expect(getRaceResultsViewModel).toHaveBeenCalledWith({
      raceRunners: {
        "raceRunnerUrn:1": {
          urn: "raceRunnerUrn:1",
        },
      },
      race: {
        urn: "ppb:race:1.14.1200228.1",
        winningTime: 250,
        details: {
          resultType: "FULL_RESULT",
        },
      },
      sportsbookOddsDisplay: OddsDisplayPreference.Decimal,
    });

    expect(stateProps).toEqual({
      raceUrn: "ppb:race:1.14.1200228.1",
      title: "Full Results",
      resultType: "FULL_RESULT",
      labels: {
        positionLabel: "I18N.RACING.POSITION_REDUCED",
        distanceLabel: "I18N.RACING.DISTANCE_REDUCED",
        horseLabel: "I18N.RACING.HORSE",
        startingPriceLabel: "I18N.HORSE_RACING.SP",
        ranLabel: "I18N.RACING.RAN_LABEL",
      },
      resultLabels: {
        fullResultsToFollowLabel: "I18N.RACING.REFRESH_FOR_RESULTS",
        winningAndBspAdvantageLabel: "I18N.RACING.WINNING_AND_BSP_ADVANTAGE",
        winningTimeLabel: "I18N.RACING.WINNING_TIME",
        bspAdvantageLabel: "I18N.RACING.BSP_ADVANTAGE",
      },
      runners: [
        {
          position: 1,
          distance: "nk",
          saddleCloth: "7",
          horseName: "Camilo Anderson",
          silk: "silk url",
          draw: 1,
          jockeyName: "John Stepehnson",
          startingPrice: "100/10",
          bspAdvantage: 20,
        },
      ],
      ranNumber: 5,
      dnfCodes: {
        PU: "Pulled up",
      },
      winningTime: "3m 2s",
      bspAdvantage: "20%",
      statusAlert: undefined,
    });
  });

  it("should return empty props if the race results card is not found", () => {
    getRaceResultsCardByURN.mockReturnValueOnce(undefined);
    const stateProps = setupMapStateToProps("fakeRaceResultsCardUrn");

    expect(stateProps).toEqual({});
  });

  it("should fallback to decimal odds if the preference is undefined", () => {
    getSportsbookDisplayOddsPreferences.mockReturnValueOnce(undefined);
    const stateProps = setupMapStateToProps("fakeRaceResultsCardUrn");

    expect(getRaceResultsViewModel).toHaveBeenCalledWith({
      raceRunners: {
        "raceRunnerUrn:1": {
          urn: "raceRunnerUrn:1",
        },
      },
      race: {
        urn: "ppb:race:1.14.1200228.1",
        winningTime: 250,
        details: {
          resultType: "FULL_RESULT",
        },
      },
      sportsbookOddsDisplay: OddsDisplayPreference.Decimal,
    });

    expect(stateProps).toEqual({
      raceUrn: "ppb:race:1.14.1200228.1",
      title: "Full Results",
      resultType: "FULL_RESULT",
      labels: {
        positionLabel: "I18N.RACING.POSITION_REDUCED",
        distanceLabel: "I18N.RACING.DISTANCE_REDUCED",
        horseLabel: "I18N.RACING.HORSE",
        startingPriceLabel: "I18N.HORSE_RACING.SP",
        ranLabel: "I18N.RACING.RAN_LABEL",
      },
      resultLabels: {
        fullResultsToFollowLabel: "I18N.RACING.REFRESH_FOR_RESULTS",
        winningAndBspAdvantageLabel: "I18N.RACING.WINNING_AND_BSP_ADVANTAGE",
        winningTimeLabel: "I18N.RACING.WINNING_TIME",
        bspAdvantageLabel: "I18N.RACING.BSP_ADVANTAGE",
      },
      runners: [
        {
          position: 1,
          distance: "nk",
          saddleCloth: "7",
          horseName: "Camilo Anderson",
          silk: "silk url",
          draw: 1,
          jockeyName: "John Stepehnson",
          startingPrice: "100/10",
          bspAdvantage: 20,
        },
      ],
      ranNumber: 5,
      dnfCodes: {
        PU: "Pulled up",
      },
      winningTime: "3m 2s",
      bspAdvantage: "20%",
      statusAlert: undefined,
    });
  });

  describe("when resultType is undefined", () => {
    it("should give a status alert message of no results if scheduledTime is longer than 30 mins ago", () => {
      getRaceWithRunnersByURN.mockReturnValue({
        raceRunners: {
          "raceRunnerUrn:1": {
            urn: "raceRunnerUrn:1",
          },
        },
        race: {
          urn: "ppb:race:1.14.1200228.1",
          winningTime: 250,
          details: {
            resultType: undefined,
            status: undefined,
            scheduledTime: new Date().getTime() - 1000 * 60 * 60,
          },
        },
      });
      getSportsbookDisplayOddsPreferences.mockReturnValueOnce(undefined);
      const stateProps = setupMapStateToProps("fakeRaceResultsCardUrn");

      expect(stateProps.statusAlert.message).toEqual("I18N.HORSE_RACING_STATUS_MESSAGING");
      expect(stateProps.statusAlert.detail).toEqual("I18N.HORSE_RACING_STATUS_MESSAGING_PT2");
      expect(stateProps.statusAlert.extraDetailInfo).toEqual("I18N.MY_BETS.TITLE");
    });

    it("should give a status alert message of results due if scheduled time is within 30 mins", () => {
      getRaceWithRunnersByURN.mockReturnValue({
        raceRunners: {
          "raceRunnerUrn:1": {
            urn: "raceRunnerUrn:1",
          },
        },
        race: {
          urn: "ppb:race:1.14.1200228.1",
          winningTime: 250,
          details: {
            resultType: undefined,
            status: "TEST",
            scheduledTime: new Date(),
          },
        },
      });
      getSportsbookDisplayOddsPreferences.mockReturnValueOnce(undefined);
      const stateProps = setupMapStateToProps("fakeRaceResultsCardUrn");

      expect(stateProps.statusAlert.message).toEqual("I18N.HORSE_RACING_STATUS_RESULTS_DUE");
    });
  });
});

describe("mapDispatchToProps", () => {
  describe("dispatchSubscribeRaceUpdates", () => {
    it("should dispatch SUBSCRIBE_RACE_UPDATES action", () => {
      const { dispatchSubscribeRaceUpdates } = mapDispatchToProps;
      const urn = "urn:fake:race:1";

      expect(dispatchSubscribeRaceUpdates(urn)).toEqual({
        payload: { urn },
        type: SUBSCRIBE_RACE_UPDATES,
      });
    });
  });

  describe("dispatchUnsubscribeRaceUpdates", () => {
    it("should dispatch UNSUBSCRIBE_RACE_UPDATES action", () => {
      const { dispatchUnsubscribeRaceUpdates } = mapDispatchToProps;
      const urn = "urn:fake:race:1";

      expect(dispatchUnsubscribeRaceUpdates(urn)).toEqual({
        payload: { urn },
        type: UNSUBSCRIBE_RACE_UPDATES,
      });
    });
  });
});
