import { StatusLabelType } from "@ppb/the-wall-common/types";
import { useStatsRaceResultsCardQuery } from "../model/StatsRaceResultsCard.graphql";
import useStatsRaceResultsCardVM from "./StatsRaceResultsCard.viewmodel";

jest.mock("../model/StatsRaceResultsCard.graphql", () => ({
  useStatsRaceResultsCardQuery: jest.fn(),
}));

jest.mock("../../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

const requestMock = {
  call: jest.fn(),
  called: true,
  loading: false,
};

const CARD_URN = "ppb:tbd:stats:card:raceResults:1";

const buildQueryMock = (runners) => ({
  request: requestMock,
  data: {
    card: {
      urn: CARD_URN,
      __typename: "StatsRaceResultsCard",
      raceResultsRunners: runners,
    },
  },
});

const runners = [
  {
    horse: {
      name: "O'BRIEN'S PRIDE",
      performance: { positionOfficial: 1, positionStatusCode: null },
    },
    details: { saddleCloth: "1", silk: "silkUrl1" },
    isBetSelection: false,
  },
  {
    horse: {
      name: "D'ARTAGNAN ROCK 'N ROLL",
      performance: { positionOfficial: 2, positionStatusCode: null },
    },
    details: { saddleCloth: "2", silk: "silkUrl2" },
    isBetSelection: false,
  },
  {
    horse: {
      name: "O'BRIEN'S RUNNER YOU'RE",
      performance: { positionOfficial: 3, positionStatusCode: null },
    },
    details: { saddleCloth: "3", silk: "silkUrl3" },
    isBetSelection: false,
  },
  {
    horse: {
      name: "KNIGHT'S CHOICE JACK O' LANTERN",
      performance: { positionOfficial: 4, positionStatusCode: null },
    },
    details: { saddleCloth: "4", silk: "silkUrl4" },
    isBetSelection: false,
  },
  {
    horse: {
      name: "I'M PLAYER'S DREAM",
      performance: { positionOfficial: 5, positionStatusCode: null },
    },
    details: { saddleCloth: "5", silk: "silkUrl5" },
    isBetSelection: false,
  },
];

describe("useStatsRaceResultsCardVM", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useStatsRaceResultsCardQuery.mockReturnValue({
      request: requestMock,
      data: {
        card: undefined,
      },
    });
  });

  describe("when the 'card' is undefined", () => {
    it("should resolve the VM as null", () => {
      const result = useStatsRaceResultsCardVM(CARD_URN);
      expect(result.vm.data).toBeNull();
    });
  });

  describe("when the 'card' has no runners data", () => {
    it("should return the VM as null", () => {
      useStatsRaceResultsCardQuery.mockReturnValue(buildQueryMock());
      const result = useStatsRaceResultsCardVM(CARD_URN);
      expect(result.vm.data).toBeNull();
    });
  });

  describe("when the 'card' returns an empty array for runners", () => {
    it("should return the VM as null", () => {
      useStatsRaceResultsCardQuery.mockReturnValue(buildQueryMock([]));

      const result = useStatsRaceResultsCardVM(CARD_URN);

      expect(result.vm.data).toBeNull();
    });
  });

  describe("when the 'card' has runners", () => {
    describe("and the selected runner won the race", () => {
      it("should return the VM with the expected data", () => {
        runners[0].isBetSelection = true;
        runners[3].horse.performance.positionStatusCode = "f";

        useStatsRaceResultsCardQuery.mockReturnValue(buildQueryMock(runners));

        const result = useStatsRaceResultsCardVM(CARD_URN);

        expect(result.vm.data).toEqual({
          runners: [
            {
              horse: {
                name: "O'Brien's Pride",
                performance: {
                  positionOfficial: 1,
                  positionStatusCode: null,
                  positionOfficialLabel: "1I18N.MYBETS.PLACED_FIRST",
                  resultStatusLabel: "I18N.MY_BETS.RESULT.WON",
                  resultStatusLabelType: StatusLabelType.WON,
                },
              },
              details: { saddleCloth: "1", silk: "silkUrl1" },
              isBetSelection: true,
            },
            {
              horse: {
                name: "D'Artagnan Rock 'n Roll",
                performance: {
                  positionOfficial: 2,
                  positionStatusCode: null,
                  positionOfficialLabel: "2I18N.MYBETS.PLACED_SECOND",
                  resultStatusLabel: undefined,
                  resultStatusLabelType: undefined,
                },
              },
              details: { saddleCloth: "2", silk: "silkUrl2" },
              isBetSelection: false,
            },
            {
              horse: {
                name: "O'Brien's Runner You're",
                performance: {
                  positionOfficial: 3,
                  positionStatusCode: null,
                  positionOfficialLabel: "3I18N.MYBETS.PLACED_THIRD",
                  resultStatusLabel: undefined,
                  resultStatusLabelType: undefined,
                },
              },
              details: { saddleCloth: "3", silk: "silkUrl3" },
              isBetSelection: false,
            },
            {
              horse: {
                name: "Knight's Choice Jack O' Lantern",
                performance: {
                  positionOfficial: 4,
                  positionStatusCode: "F",
                  positionOfficialLabel: "4I18N.MYBETS.PLACED_OTHER",
                  resultStatusLabel: undefined,
                  resultStatusLabelType: undefined,
                },
              },
              details: { saddleCloth: "4", silk: "silkUrl4" },
              isBetSelection: false,
            },
            {
              horse: {
                name: "I'm Player's Dream",
                performance: {
                  positionOfficial: 5,
                  positionStatusCode: null,
                  positionOfficialLabel: "5I18N.MYBETS.PLACED_OTHER",
                  resultStatusLabel: undefined,
                  resultStatusLabelType: undefined,
                },
              },
              details: { saddleCloth: "5", silk: "silkUrl5" },
              isBetSelection: false,
            },
          ],
        });
      });
    });

    describe("and the selected runner lost the race", () => {
      it("should return that same horse with the status label as lost", () => {
        runners[3].isBetSelection = true;
        runners[3].horse.performance.positionStatusCode = "f";

        useStatsRaceResultsCardQuery.mockReturnValue(buildQueryMock(runners));

        const result = useStatsRaceResultsCardVM(CARD_URN);

        expect(result.vm.data.runners[3].horse.performance.resultStatusLabelType).toBe(StatusLabelType.LOST);
      });
    });
  });
});
