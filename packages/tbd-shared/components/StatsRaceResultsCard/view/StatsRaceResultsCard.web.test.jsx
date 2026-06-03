import { render } from "@testing-library/react";
import { Card, HorseRacingRunner, Divider, StatusLabel } from "@ppb/the-wall-web";
import StatsRaceResultsCard from "./StatsRaceResultsCard.web";
import { StatusLabelSizeType, StatusLabelType } from "@ppb/the-wall-common/types";
import useStatsRaceResultsCardVM from "../viewmodel/StatsRaceResultsCard.viewmodel";
import { CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";

jest.mock("../viewmodel/StatsRaceResultsCard.viewmodel");
jest.mock("@ppb/the-wall-web", () => ({
  Card: jest.fn(({ props, children }) => <card-mock {...props}> {children}</card-mock>),
  HorseRacingRunner: jest.fn((props) => <hr-runner-mock {...props}>{props.rightColumn}</hr-runner-mock>),
  Divider: jest.fn(() => <divider-mock />),
  StatusLabel: jest.fn(({ props }) => <status-label-mock {...props} />),
}));
jest.mock("../../StatsContentCardPlaceholder/StatsContentCardPlaceholder.web", () =>
  jest.fn(() => (
    <stats-content-card-placeholder data-testid="stats-content-card-placeholder">
      StatsContentCardPlaceholder
    </stats-content-card-placeholder>
  )),
);

const urn = "ppb:tbd:stats:card:raceResults:1";

function renderComponent(data = null, loading = false) {
  useStatsRaceResultsCardVM.mockReturnValue({
    loading,
    vm: {
      data,
    },
  });

  return render(<StatsRaceResultsCard urn={urn} />);
}

describe("StatsRaceResultsCard component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when request is loading", () => {
    it("should render StatsContentCardPlaceholder", () => {
      const { getByTestId } = renderComponent(null, true);

      expect(getByTestId("stats-content-card-placeholder")).toBeDefined();
    });
  });

  describe("when data is loaded", () => {
    describe("and data doesn't exist", () => {
      it("should render null", () => {
        const { container } = renderComponent(null, false);

        expect(container.innerHTML).toBe("");
      });
    });

    describe("and data is defined", () => {
      describe("and there are more than 3 runners", () => {
        it("should render items correctly with a divider", () => {
          renderComponent({
            runners: [
              {
                horse: {
                  name: "Runner 1",
                  performance: {
                    positionOfficial: 1,
                    positionStatusCode: null,
                    positionOfficialLabel: "1st",
                    resultStatusLabel: undefined,
                    resultStatusLabelType: undefined,
                  },
                },
                details: { saddleCloth: "1", silk: "silkUrl1" },
                isBetSelection: false,
              },
              {
                horse: {
                  name: "Runner 2",
                  performance: {
                    positionOfficial: null,
                    positionStatusCode: "F",
                    positionOfficialLabel: null,
                    resultStatusLabel: undefined,
                    resultStatusLabelType: undefined,
                  },
                },
                details: { saddleCloth: "2", silk: "silkUrl2" },
                isBetSelection: false,
              },
              {
                horse: {
                  name: "Runner 3",
                  performance: {
                    positionOfficial: null,
                    positionStatusCode: null,
                    positionOfficialLabel: null,
                    resultStatusLabel: undefined,
                    resultStatusLabelType: undefined,
                  },
                },
                details: { saddleCloth: null, silk: null },
                isBetSelection: false,
              },
              {
                horse: {
                  name: "Runner 4",
                  performance: {
                    positionOfficial: 4,
                    positionStatusCode: "F",
                    positionOfficialLabel: "4th",
                    resultStatusLabel: "Lost",
                    resultStatusLabelType: StatusLabelType.LOST,
                  },
                },
                isBetSelection: true,
              },
            ],
          });

          expect(Card).toHaveBeenCalledWith(
            expect.objectContaining({
              theme: CardTheme.TRANSPARENT,
            }),
            undefined,
          );
          expect(HorseRacingRunner).toHaveBeenCalledTimes(4);

          expect(HorseRacingRunner).toHaveBeenNthCalledWith(
            1,
            {
              horseName: "Runner 1",
              saddleCloth: "1st",
              silkUrl: "silkUrl1",
              hasDefaultSilk: true,
              drawNumber: 1,
              rightColumn: undefined,
              showChevron: false,
              isPotentialBet: false,
              hasGraphsLink: false,
              i18nLabels: {
                age: "",
                weight: "",
                officialRating: "",
                pedigree: "",
                comment: "",
                equipment: "",
                bred: "",
                graph: "",
                date: "",
                course: "",
                distance: "",
                going: "",
                position: "",
                type: "",
              },
              onRunnerClick: expect.any(Function),
              onRecentRaceClick: expect.any(Function),
              onRaceReplaysClick: expect.any(Function),
              onRaceReplaysLoaded: expect.any(Function),
            },
            undefined,
          );

          expect(HorseRacingRunner).toHaveBeenNthCalledWith(
            2,
            {
              horseName: "Runner 2",
              saddleCloth: "F",
              silkUrl: "silkUrl2",
              hasDefaultSilk: true,
              drawNumber: 2,
              rightColumn: undefined,
              showChevron: false,
              isPotentialBet: false,
              hasGraphsLink: false,
              i18nLabels: {
                age: "",
                weight: "",
                officialRating: "",
                pedigree: "",
                comment: "",
                equipment: "",
                bred: "",
                graph: "",
                date: "",
                course: "",
                distance: "",
                going: "",
                position: "",
                type: "",
              },
              onRunnerClick: expect.any(Function),
              onRecentRaceClick: expect.any(Function),
              onRaceReplaysClick: expect.any(Function),
              onRaceReplaysLoaded: expect.any(Function),
            },
            undefined,
          );

          expect(HorseRacingRunner).toHaveBeenNthCalledWith(
            3,
            {
              horseName: "Runner 3",
              saddleCloth: "-",
              silkUrl: undefined,
              hasDefaultSilk: true,
              drawNumber: undefined,
              rightColumn: undefined,
              showChevron: false,
              isPotentialBet: false,
              hasGraphsLink: false,
              i18nLabels: {
                age: "",
                weight: "",
                officialRating: "",
                pedigree: "",
                comment: "",
                equipment: "",
                bred: "",
                graph: "",
                date: "",
                course: "",
                distance: "",
                going: "",
                position: "",
                type: "",
              },
              onRunnerClick: expect.any(Function),
              onRecentRaceClick: expect.any(Function),
              onRaceReplaysClick: expect.any(Function),
              onRaceReplaysLoaded: expect.any(Function),
            },
            undefined,
          );

          expect(HorseRacingRunner).toHaveBeenNthCalledWith(
            4,
            {
              horseName: "Runner 4",
              saddleCloth: "4th",
              silkUrl: undefined,
              hasDefaultSilk: true,
              drawNumber: undefined,
              rightColumn: expect.any(Object),
              showChevron: false,
              isPotentialBet: false,
              hasGraphsLink: false,
              i18nLabels: {
                age: "",
                weight: "",
                officialRating: "",
                pedigree: "",
                comment: "",
                equipment: "",
                bred: "",
                graph: "",
                date: "",
                course: "",
                distance: "",
                going: "",
                position: "",
                type: "",
              },
              onRunnerClick: expect.any(Function),
              onRecentRaceClick: expect.any(Function),
              onRaceReplaysClick: expect.any(Function),
              onRaceReplaysLoaded: expect.any(Function),
            },
            undefined,
          );

          expect(StatusLabel).toHaveBeenCalledTimes(1);

          expect(StatusLabel).toHaveBeenCalledWith(
            {
              statusLabelSize: StatusLabelSizeType.SMALL,
              statusLabelType: StatusLabelType.LOST,
              text: "Lost",
            },
            undefined,
          );

          expect(Divider).toHaveBeenCalledTimes(1);
        });
      });
      describe("and there are 3 or less runners", () => {
        it("should render items correctly without divider", () => {
          renderComponent({
            runners: [
              {
                horse: {
                  name: "Runner 1",
                  performance: {
                    positionOfficial: 1,
                    positionStatusCode: null,
                    positionOfficialLabel: "1st",
                    resultStatusLabel: undefined,
                    resultStatusLabelType: undefined,
                  },
                },
                details: { saddleCloth: "1", silk: "silkUrl1" },
                isBetSelection: false,
              },
              {
                horse: {
                  name: "Runner 2",
                  performance: {
                    positionOfficial: null,
                    positionStatusCode: "F",
                    positionOfficialLabel: null,
                    resultStatusLabel: undefined,
                    resultStatusLabelType: undefined,
                  },
                },
                details: { saddleCloth: "2", silk: "silkUrl2" },
                isBetSelection: false,
              },
              {
                horse: {
                  name: "Runner 3",
                  performance: {
                    positionOfficial: null,
                    positionStatusCode: null,
                    positionOfficialLabel: null,
                    resultStatusLabel: undefined,
                    resultStatusLabelType: undefined,
                  },
                },
                details: { saddleCloth: null, silk: null },
                isBetSelection: false,
              },
            ],
          });

          expect(Card).toHaveBeenCalledWith(
            expect.objectContaining({
              theme: CardTheme.TRANSPARENT,
            }),
            undefined,
          );
          expect(HorseRacingRunner).toHaveBeenCalledTimes(3);

          expect(HorseRacingRunner).toHaveBeenNthCalledWith(
            1,
            {
              horseName: "Runner 1",
              saddleCloth: "1st",
              silkUrl: "silkUrl1",
              hasDefaultSilk: true,
              drawNumber: 1,
              rightColumn: undefined,
              showChevron: false,
              isPotentialBet: false,
              hasGraphsLink: false,
              i18nLabels: {
                age: "",
                weight: "",
                officialRating: "",
                pedigree: "",
                comment: "",
                equipment: "",
                bred: "",
                graph: "",
                date: "",
                course: "",
                distance: "",
                going: "",
                position: "",
                type: "",
              },
              onRunnerClick: expect.any(Function),
              onRecentRaceClick: expect.any(Function),
              onRaceReplaysClick: expect.any(Function),
              onRaceReplaysLoaded: expect.any(Function),
            },
            undefined,
          );

          expect(HorseRacingRunner).toHaveBeenNthCalledWith(
            2,
            {
              horseName: "Runner 2",
              saddleCloth: "F",
              silkUrl: "silkUrl2",
              hasDefaultSilk: true,
              drawNumber: 2,
              rightColumn: undefined,
              showChevron: false,
              isPotentialBet: false,
              hasGraphsLink: false,
              i18nLabels: {
                age: "",
                weight: "",
                officialRating: "",
                pedigree: "",
                comment: "",
                equipment: "",
                bred: "",
                graph: "",
                date: "",
                course: "",
                distance: "",
                going: "",
                position: "",
                type: "",
              },
              onRunnerClick: expect.any(Function),
              onRecentRaceClick: expect.any(Function),
              onRaceReplaysClick: expect.any(Function),
              onRaceReplaysLoaded: expect.any(Function),
            },
            undefined,
          );

          expect(HorseRacingRunner).toHaveBeenNthCalledWith(
            3,
            {
              horseName: "Runner 3",
              saddleCloth: "-",
              silkUrl: undefined,
              hasDefaultSilk: true,
              drawNumber: undefined,
              rightColumn: undefined,
              showChevron: false,
              isPotentialBet: false,
              hasGraphsLink: false,
              i18nLabels: {
                age: "",
                weight: "",
                officialRating: "",
                pedigree: "",
                comment: "",
                equipment: "",
                bred: "",
                graph: "",
                date: "",
                course: "",
                distance: "",
                going: "",
                position: "",
                type: "",
              },
              onRunnerClick: expect.any(Function),
              onRecentRaceClick: expect.any(Function),
              onRaceReplaysClick: expect.any(Function),
              onRaceReplaysLoaded: expect.any(Function),
            },
            undefined,
          );

          expect(StatusLabel).not.toHaveBeenCalled();

          expect(Divider).not.toHaveBeenCalled();
        });
      });
    });
  });
});
