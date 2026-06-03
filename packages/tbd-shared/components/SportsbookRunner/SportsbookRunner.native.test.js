import { render, act } from "@testing-library/react-native";
import { HorseRacingRunner, NonRunner, Runner, RacingRunner } from "@ppb/the-wall-native";
import { navigate } from "@ppb/tbd-router/native";
import SportsbookRunner from "./SportsbookRunner.native";
import ConnectedSportsbookBetButton from "../SportsbookBetButton";
import SportsbookBetButton from "../SportsbookBetButton/SportsbookBetButton.native";
import ConnectedPriceHistory from "../PriceHistory";
import PriceHistory from "../PriceHistory/PriceHistory.native";

jest.mock("../SportsbookBetButton", () => ({
  __esModule: true,
  default: jest.fn((props) => <connected-sportsbook-bet-button-mock {...props} />),
}));

jest.mock("../SportsbookBetButton/SportsbookBetButton.native", () => ({
  __esModule: true,
  default: jest.fn((props) => <sportsbook-bet-button-mock {...props} />),
}));

jest.mock("../PriceHistory", () => ({
  __esModule: true,
  default: jest.fn((props) => <connected-price-history-mock {...props} />),
}));

jest.mock("../PriceHistory/PriceHistory.native", () => ({
  __esModule: true,
  default: jest.fn((props) => <price-history-mock {...props} />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  __esModule: true,
  NonRunner: jest.fn((props) => <non-runner-mock {...props} />),
  HorseRacingRunner: jest.fn((props) => (
    <hr-runner-mock {...props}>
      {props.leftColumn}
      {props.middleColumn}
      {props.rightColumn}
      {props.children}
    </hr-runner-mock>
  )),
  RacingRunner: jest.fn((props) => (
    <racing-runner-mock {...props}>
      {props.leftColumn}
      {props.middleColumn}
      {props.rightColumn}
      {props.children}
    </racing-runner-mock>
  )),
  TrapWrapper: jest.fn((props) => <trap-wrapper-mock {...props} />),
  Runner: jest.fn((props) => <runner-mock {...props}>{props.children}</runner-mock>),
}));

jest.mock("@ppb/tbd-router/native", () => ({
  __esModule: true,
  navigate: jest.fn(() => {}),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  __esModule: true,
  gutters: {},
  spacings: {},
  heights: {},
  tokens: {
    HorseRacingRunnerVerticalGap: 8,
  },
}));

const dispatchFetchCatalogue = jest.fn();
const dispatchToggleRunnerInfo = jest.fn();
const dispatchExpandRunnerData = jest.fn();
const dispatchToggleRecentRacesSpy = jest.fn();
const dispatchNavigateToView = jest.fn();
const dispatchToggleRaceReplaysSpy = jest.fn();
const dispatchRaceReplaysMediaPlayerLoadedSpy = jest.fn();

const lastProps = (mockFn) => mockFn.mock.calls[mockFn.mock.calls.length - 1]?.[0];

function renderSportsbookRunner({
  runner,
  isRaceMarket,
  runnerViewLink = {
    viewUrn: "viewUrn",
    viewUrl: "viewUrl",
  },
  horsePastPerformances = [
    { course: "course 1", pos: "3" },
    { course: "course 2", pos: "7" },
    { course: "course 3", pos: "1" },
  ],
  horseRacingRunneri18nLabels = {
    age: "age",
    weight: "weight",
    officialRating: "OR",
    pedigree: "pedigree",
    comment: "comment",
    equipment: "equipment",
    bred: "bred",
    graph: "graph",
    date: "date",
    course: "course",
    distance: "distance",
    going: "going",
    position: "position",
    type: "type",
  },
  isRunnerExpandable = false,
  isOddsboostMarketType = false,
  hasDefaultSilk = false,
  eventViewLink,
  showTrapIcon = true,
}) {
  return render(
    <SportsbookRunner
      cardUrn={"cardUrn"}
      runner={runner}
      marketUrn={"marketUrn"}
      marketName={"marketName"}
      isRaceMarket={isRaceMarket}
      runnerIdx={0}
      numberOfRunners={1}
      nonRunnerTitle={"Non Runner"}
      isMarketInplay={false}
      isOddsboostMarketType={isOddsboostMarketType}
      hasDefaultSilk={hasDefaultSilk}
      runnerViewLink={runnerViewLink}
      eventViewLink={eventViewLink}
      dispatchFetchCatalogue={dispatchFetchCatalogue}
      dispatchToggleRunnerInfo={dispatchToggleRunnerInfo}
      dispatchExpandRunnerData={dispatchExpandRunnerData}
      dispatchToggleRecentRaces={dispatchToggleRecentRacesSpy}
      dispatchToggleRaceReplays={dispatchToggleRaceReplaysSpy}
      dispatchRaceReplaysMediaPlayerLoaded={dispatchRaceReplaysMediaPlayerLoadedSpy}
      isRunnerExpandable={isRunnerExpandable}
      horsePastPerformances={horsePastPerformances}
      horseRacingRunneri18nLabels={horseRacingRunneri18nLabels}
      dispatchNavigateToView={dispatchNavigateToView}
      showTrapIcon={showTrapIcon}
    />,
  );
}

describe("SportsbookRunner", () => {
  beforeEach(jest.clearAllMocks);

  describe("when is an horse racing runner", () => {
    const isRaceMarket = true;
    const runner = {
      urn: "urn",
      name: "Lydford",
      raceRunnerDetails: {
        type: "HORSE",
        raceRunner: {
          details: {
            saddleCloth: 5,
            draw: 8,
            jockeyName: "Page Fuller",
            trainerName: "David Weston",
            weight: { stones: "10-12" },
            equipmentDescription: "helmet",
          },
          horse: {
            age: 4,
            damName: "SHIROCCO",
            sireName: "GILT",
            bred: "IRE",
          },
          rating: 1,
          comments: "dummy comments",
          form: "2257",
          apprenticeClaim: 3,
          crsDisWinFavText: "C",
        },
      },
    };

    describe("when runner status is ACTIVE", () => {
      it(
        "should call HorseRacingRunner, ConnectedSportsbookBetButton and ConnectedPriceHistory components " +
          "and not call the Runner neither the NonRunner component",
        () => {
          renderSportsbookRunner({
            runner: { ...runner, status: "ACTIVE" },
            isRaceMarket,
          });

          expect(HorseRacingRunner).toHaveBeenCalledTimes(1);
          expect(lastProps(HorseRacingRunner)).toEqual(
            expect.objectContaining({
              horseName: "Lydford",
              jockeyName: "Page Fuller",
              trainerName: "David Weston",
              saddleCloth: 5,
              drawNumber: 8,
              form: "2257",
              apprenticeClaim: 3,
              crsDisWinFavText: "C",
              hasGraphsLink: true,
              hasDefaultSilk: false,
              weight: "10-12",
              rating: 1,
              comments: "dummy comments",
              equipment: "helmet",
              horseAge: 4,
              horseDamName: "SHIROCCO",
              horseSireName: "GILT",
              horseBred: "IRE",
              showChevron: false,
              onRunnerClick: expect.any(Function),
              horsePastPerformances: [
                { course: "course 1", pos: "3" },
                { course: "course 2", pos: "7" },
                { course: "course 3", pos: "1" },
              ],
              isPotentialBet: false,
              i18nLabels: {
                age: "age",
                weight: "weight",
                officialRating: "OR",
                pedigree: "pedigree",
                comment: "comment",
                equipment: "equipment",
                bred: "bred",
                graph: "graph",
                date: "date",
                course: "course",
                distance: "distance",
                going: "going",
                position: "position",
                type: "type",
              },
              onRecentRaceClick: expect.any(Function),
              onRaceReplaysClick: expect.any(Function),
              onRaceReplaysLoaded: expect.any(Function),
              rightColumn: expect.anything(),
            }),
          );

          expect(ConnectedSportsbookBetButton).toHaveBeenCalledTimes(1);
          expect(lastProps(ConnectedSportsbookBetButton)).toEqual(
            expect.objectContaining({
              marketUrn: "marketUrn",
              runnerUrn: "urn",
              cardUrn: "cardUrn",
              component: SportsbookBetButton,
              onPotentialBetChange: expect.any(Function),
              tall: true,
            }),
          );

          expect(ConnectedPriceHistory).toHaveBeenCalledTimes(1);
          expect(lastProps(ConnectedPriceHistory)).toEqual(
            expect.objectContaining({
              runnerUrn: "urn",
              isMarketInplay: false,
              component: PriceHistory,
            }),
          );

          expect(NonRunner).not.toHaveBeenCalled();
          expect(Runner).not.toHaveBeenCalled();
        },
      );

      describe("when ConnectedSportsbookBetButton onPotentialBetChange cb is called", () => {
        it(
          "should update IsPotentialBet local state and update HorseRacingRunner with isPotentialBet as true " +
            "if isPotentialBetVal is true and betslip is not collapsed",
          () => {
            renderSportsbookRunner({
              runner: { ...runner, status: "ACTIVE" },
              isRaceMarket: true,
            });

            expect(lastProps(HorseRacingRunner).isPotentialBet).toBe(false);

            act(() => {
              lastProps(ConnectedSportsbookBetButton).onPotentialBetChange(true, false);
            });

            expect(lastProps(HorseRacingRunner).isPotentialBet).toBe(true);
          },
        );

        it(
          "should not update IsPotentialBet local state and not update HorseRacingRunner " +
            "if isPotentialBetVal is false",
          () => {
            renderSportsbookRunner({
              runner: { ...runner, status: "ACTIVE" },
              isRaceMarket: true,
            });

            act(() => {
              lastProps(ConnectedSportsbookBetButton).onPotentialBetChange(false, true);
            });

            expect(HorseRacingRunner.mock.calls.some((c) => c[0]?.isPotentialBet === true)).toBe(false);
          },
        );
      });
    });

    describe("when runner status is REMOVED", () => {
      it("should call NonRunner component and call HorseRacingRunner (with rightColumn containing NonRunner)", () => {
        renderSportsbookRunner({
          runner: { ...runner, status: "REMOVED" },
          isRaceMarket,
        });

        expect(HorseRacingRunner).toHaveBeenCalledTimes(1);

        expect(NonRunner).toHaveBeenCalledTimes(1);
        expect(lastProps(NonRunner)).toEqual(
          expect.objectContaining({
            title: "Non Runner",
          }),
        );

        expect(ConnectedSportsbookBetButton).not.toHaveBeenCalled();
        expect(ConnectedPriceHistory).not.toHaveBeenCalled();
      });
    });

    describe("when the market is an oddsboost market type", () => {
      it("should not call Price History component", () => {
        renderSportsbookRunner({
          runner: { ...runner },
          isOddsboostMarketType: true,
        });

        expect(ConnectedPriceHistory).not.toHaveBeenCalled();
      });
    });

    describe("when onRunnerClick is executed", () => {
      describe("when isRunnerExpandable is true", () => {
        beforeEach(() => {
          HorseRacingRunner.mockClear();
        });

        it("should call the dispatchExpandRunnerData if called with expanded as true", async () => {
          renderSportsbookRunner({
            runner: {
              ...runner,
              raceRunnerDetails: {
                type: "HORSE",
                raceRunner: {
                  ...runner.raceRunnerDetails.raceRunner,
                  urn: "raceRunnerUrn",
                },
              },
            },
            isRunnerExpandable: true,
            isRaceMarket,
          });

          act(() => {
            const { onRunnerClick } = HorseRacingRunner.mock.calls[0][0];
            onRunnerClick(true);
          });

          expect(dispatchExpandRunnerData).toHaveBeenCalledWith(["raceRunnerUrn"]);
          expect(dispatchToggleRunnerInfo).toHaveBeenCalledWith("marketName", "Lydford", true);
        });

        it("should collapse runner data accordion", async () => {
          renderSportsbookRunner({
            runner: {
              ...runner,
              raceRunner: {
                ...runner.raceRunner,
                urn: "raceRunnerUrn",
              },
            },
            isRunnerExpandable: true,
            isRaceMarket,
          });

          act(() => {
            const { onRunnerClick } = HorseRacingRunner.mock.calls[0][0];
            onRunnerClick(false);
          });

          expect(dispatchExpandRunnerData).not.toHaveBeenCalled();
          expect(dispatchToggleRunnerInfo).toHaveBeenCalledWith("marketName", "Lydford", false);
        });
      });

      describe("when a recent race is clicked", () => {
        beforeEach(() => {
          HorseRacingRunner.mockClear();
        });

        it("should expand the recent race info", async () => {
          renderSportsbookRunner({
            runner: {
              ...runner,
              raceRunner: {
                ...runner.raceRunner,
                urn: "raceRunnerUrn",
              },
            },
            isRunnerExpandable: true,
            isRaceMarket,
          });

          act(() => {
            const { onRecentRaceClick } = HorseRacingRunner.mock.calls[0][0];
            onRecentRaceClick(true);
          });

          expect(dispatchToggleRecentRacesSpy).toHaveBeenCalledWith("Lydford", "cardUrn", true);
        });

        it("should collapse recent race info", async () => {
          renderSportsbookRunner({
            runner: {
              ...runner,
              raceRunner: {
                ...runner.raceRunner,
                urn: "raceRunnerUrn",
              },
            },
            isRunnerExpandable: true,
            isRaceMarket,
          });

          act(() => {
            const { onRecentRaceClick } = HorseRacingRunner.mock.calls[0][0];
            onRecentRaceClick(false);
          });

          expect(dispatchToggleRecentRacesSpy).toHaveBeenCalledWith("Lydford", "cardUrn", false);
        });

        it("should call the dispatchExpandRunnerData if called with expanded as false", async () => {
          renderSportsbookRunner({
            runner: {
              ...runner,
              raceRunner: {
                ...runner.raceRunner,
                urn: "raceRunnerUrn",
              },
            },
            isRunnerExpandable: true,
            isRaceMarket,
          });

          act(() => {
            const { onRunnerClick } = HorseRacingRunner.mock.calls[0][0];
            onRunnerClick(false);
          });

          expect(dispatchExpandRunnerData).not.toHaveBeenCalled();
        });
      });

      describe("when isRunnerExpandable is false", () => {
        it("should call the navigate with eventViewLink if eventViewLink exists", async () => {
          const eventViewLink = { viewUrn: "viewUrn", viewUrl: "viewUrl" };

          renderSportsbookRunner({
            runner: {
              ...runner,
              raceRunner: {
                ...runner.raceRunner,
                urn: "raceRunnerUrn",
              },
            },
            isRunnerExpandable: false,
            runnerViewLink: undefined,
            eventViewLink,
            isRaceMarket,
          });

          act(() => {
            const { onRunnerClick } = HorseRacingRunner.mock.calls[0][0];
            onRunnerClick();
          });

          expect(dispatchNavigateToView).toHaveBeenCalledWith("viewUrl", "cardUrn", "Lydford");
          expect(navigate).toHaveBeenCalledWith(eventViewLink);
        });

        it("should navigate with runnerViewLink if eventViewLink is undefined and it has runnerViewLink", async () => {
          const runnerViewLink = { viewUrn: "fakeRunnerViewURN" };

          renderSportsbookRunner({
            runner: {
              ...runner,
              raceRunner: {
                ...runner.raceRunner,
                urn: "raceRunnerUrn",
              },
            },
            isRunnerExpandable: false,
            eventViewLink: undefined,
            runnerViewLink,
            isRaceMarket,
          });

          act(() => {
            const { onRunnerClick } = HorseRacingRunner.mock.calls[0][0];
            onRunnerClick();
          });

          expect(navigate).toHaveBeenCalledWith(runnerViewLink);
        });
      });
    });

    describe("when onRaceReplaysClick executes", () => {
      beforeEach(() => {
        HorseRacingRunner.mockClear();
      });

      it("should call the dispatchToggleRaceReplays", async () => {
        renderSportsbookRunner({
          runner: {
            ...runner,
            raceRunner: {
              ...runner.raceRunner,
              urn: "raceRunnerUrn",
            },
          },
          isRunnerExpandable: true,
          isRaceMarket,
        });

        act(() => {
          const { onRaceReplaysClick } = HorseRacingRunner.mock.calls[0][0];
          onRaceReplaysClick(true);
        });

        expect(dispatchToggleRaceReplaysSpy).toHaveBeenCalledWith("Lydford", true, "cardUrn");
      });
    });

    describe("when onRaceReplaysLoaded executes", () => {
      beforeEach(() => {
        HorseRacingRunner.mockClear();
      });

      it("should call the dispatchRaceReplaysMediaPlayerLoaded", async () => {
        renderSportsbookRunner({
          runner: {
            ...runner,
            raceRunner: {
              ...runner.raceRunner,
              urn: "raceRunnerUrn",
            },
          },
          isRunnerExpandable: true,
          isRaceMarket,
        });

        act(() => {
          const { onRaceReplaysLoaded } = HorseRacingRunner.mock.calls[0][0];
          onRaceReplaysLoaded();
        });

        expect(dispatchRaceReplaysMediaPlayerLoadedSpy).toHaveBeenCalledWith("marketUrn");
      });
    });
  });

  describe("when is an greyhound racing runner", () => {
    const isRaceMarket = true;
    const runner = {
      urn: "urn",
      name: "Lydford Grey",
      raceRunnerDetails: {
        type: "GREYHOUND",
        raceRunner: {
          trap: 5,
          meetingCountry: "GB",
          urn: "tbd:greyhoundracerunner:urn:1",
        },
      },
    };

    describe("when runner status is ACTIVE", () => {
      it(
        "should call RacingRunner, ConnectedSportsbookBetButton and ConnectedPriceHistory components " +
          "and not call the Runner neither the NonRunner component",
        () => {
          renderSportsbookRunner({
            runner: { ...runner, status: "ACTIVE" },
            isRaceMarket,
            showTrapIcon: true,
          });

          expect(RacingRunner).toHaveBeenCalledTimes(1);
          expect(lastProps(RacingRunner)).toEqual(
            expect.objectContaining({
              title: "Lydford Grey",
              leftColumn: expect.anything(),
              rightColumn: expect.anything(),
              onClick: expect.any(Function),
            }),
          );

          expect(ConnectedSportsbookBetButton).toHaveBeenCalledTimes(1);
          expect(lastProps(ConnectedSportsbookBetButton)).toEqual(
            expect.objectContaining({
              marketUrn: "marketUrn",
              runnerUrn: "urn",
              cardUrn: "cardUrn",
              component: SportsbookBetButton,
              onPotentialBetChange: expect.any(Function),
              tall: true,
            }),
          );

          expect(ConnectedPriceHistory).toHaveBeenCalledTimes(1);
          expect(lastProps(ConnectedPriceHistory)).toEqual(
            expect.objectContaining({
              runnerUrn: "urn",
              isMarketInplay: false,
              component: PriceHistory,
            }),
          );

          expect(NonRunner).not.toHaveBeenCalled();
        },
      );
    });

    describe("when runner status is REMOVED", () => {
      it("should call NonRunner component (rendered via rightColumn) and not call the bet button/price history", () => {
        renderSportsbookRunner({
          runner: { ...runner, status: "REMOVED" },
          isRaceMarket,
          showTrapIcon: true,
        });

        expect(RacingRunner).toHaveBeenCalledTimes(1);

        expect(NonRunner).toHaveBeenCalledTimes(1);
        expect(lastProps(NonRunner)).toEqual(
          expect.objectContaining({
            title: "Non Runner",
          }),
        );

        expect(ConnectedSportsbookBetButton).not.toHaveBeenCalled();
        expect(ConnectedPriceHistory).not.toHaveBeenCalled();
      });
    });

    describe("when the market is an oddsboost market type", () => {
      it("should not call Price History component", () => {
        renderSportsbookRunner({
          runner: { ...runner },
          isOddsboostMarketType: true,
        });

        expect(ConnectedPriceHistory).not.toHaveBeenCalled();
      });
    });
  });

  describe("when is not an horse racing runner", () => {
    const isRaceMarket = false;
    const runner = {
      urn: "urn",
      name: "Benfica",
    };

    it("should call Runner and ConnectedSportsbookBetButton components and not call the HorseRacingRunner component", () => {
      renderSportsbookRunner({
        runner,
        isRaceMarket,
      });

      expect(Runner).toHaveBeenCalledTimes(1);
      expect(lastProps(Runner)).toEqual(
        expect.objectContaining({
          name: "Benfica",
          onClick: expect.any(Function),
        }),
      );

      expect(ConnectedSportsbookBetButton).toHaveBeenCalledTimes(1);
      expect(lastProps(ConnectedSportsbookBetButton)).toEqual(
        expect.objectContaining({
          marketUrn: "marketUrn",
          runnerUrn: "urn",
          cardUrn: "cardUrn",
          component: SportsbookBetButton,
          rounded: false,
          tall: true,
        }),
      );

      expect(HorseRacingRunner).not.toHaveBeenCalled();
    });
  });

  describe("when runnerViewLinks is defined", () => {
    describe("and the onRunnerClick callback is called", () => {
      it("should call dispatchToggleRunnerInfo and dispatchFetchCatalogue with runner view urn", async () => {
        renderSportsbookRunner({
          runner: { urn: "urn", name: "runnerName", status: "ACTIVE" },
        });

        act(() => {
          const { onClick } = Runner.mock.calls[0][0];
          onClick();
        });

        expect(dispatchToggleRunnerInfo).toHaveBeenCalledWith("marketName", "runnerName", true);
        expect(dispatchFetchCatalogue).toHaveBeenCalledWith("viewUrn");
      });
    });
  });

  describe("when runnerViewLinks is not defined", () => {
    describe("and the onRunnerClick callback is called", () => {
      it("should not call dispatchToggleRunnerInfo neither dispatchFetchCatalogue", async () => {
        renderSportsbookRunner({
          runner: { urn: "urn", name: "runnerName", status: "ACTIVE" },
          runnerViewLink: null,
        });

        act(() => {
          const { onClick } = Runner.mock.calls[0][0];
          onClick();
        });

        expect(dispatchToggleRunnerInfo).not.toHaveBeenCalled();
        expect(dispatchFetchCatalogue).not.toHaveBeenCalled();
      });
    });
  });
});
