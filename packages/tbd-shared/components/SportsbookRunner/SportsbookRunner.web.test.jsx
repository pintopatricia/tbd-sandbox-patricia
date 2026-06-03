import { act, getByTestId, render, waitFor } from "@testing-library/react";
import "jest-dom/extend-expect";
import {
  FullScreenModal as FullScreenModalComponent,
  HorseRacingRunner,
  NonRunner,
  RacingRunner,
  Runner,
} from "@ppb/the-wall-web";
import SportsbookRunner from "./SportsbookRunner.web";
import ConnectedSportsbookBetButton from "../SportsbookBetButton";
import ConnectedPriceHistory from "../PriceHistory";
import ConnectedGenericView from "../GenericView";
import { GenericView, GenericViewPlaceholder } from "../GenericView/GenericView.web";

jest.mock("../SportsbookBetButton", () => ({
  __esModule: true,
  default: jest.fn((props) => (
    <connected-sportsbook-bet-button-mock data-testid="connected-sportsbook-bet-button" {...props} />
  )),
}));

jest.mock("../SportsbookBetButton/SportsbookBetButton.web", () => ({
  __esModule: true,
  default: jest.fn((props) => <sportsbook-bet-button-mock {...props} />),
}));

jest.mock("../PriceHistory", () => ({
  __esModule: true,
  default: jest.fn((props) => <connected-price-history-mock data-testid="connected-price-history" {...props} />),
}));

jest.mock("../PriceHistory/PriceHistory.web", () => ({
  __esModule: true,
  default: jest.fn((props) => <price-history-mock {...props} />),
}));

jest.mock("../GenericView", () => ({
  __esModule: true,
  default: jest.fn(() => <connected-generic-view-mock data-testid="generic-page" />),
}));

jest.mock("@ppb/the-wall-web", () => ({
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
  Runner: jest.fn((props) => <runner-mock {...props}>{props.children}</runner-mock>),
  TrapWrapper: jest.fn((props) => <trap-wrapper-mock {...props} />),
  FullScreenModal: jest.fn(({ children, ...props }) => (
    <full-screen-modal data-testid="full-screen-modal" {...props}>
      {children}
    </full-screen-modal>
  )),
}));

const dispatchToggleRunnerInfo = jest.fn();
const dispatchFetchCatalogue = jest.fn();
const dispatchDeleteView = jest.fn();
const dispatchExpandRunnerData = jest.fn();
const dispatchPushAction = jest.fn();
const dispatchToggleRecentRacesSpy = jest.fn();
const dispatchNavigateToView = jest.fn();
const dispatchToggleRaceReplaysSpy = jest.fn();
const dispatchRaceReplaysMediaPlayerLoadedSpy = jest.fn();

const lastProps = (mockFn) => mockFn.mock.calls[mockFn.mock.calls.length - 1]?.[0];

function renderSportsbookRunner({
  runner,
  onRunnerClick = () => {},
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
  eventViewLink,
  isOddsboostMarketType = false,
  hasDefaultSilk = false,
  showTrapIcon = true,
}) {
  return render(
    <SportsbookRunner
      runner={runner}
      onRunnerClick={onRunnerClick}
      cardUrn={"cardUrn"}
      marketUrn={"marketUrn"}
      marketName={"marketName"}
      isRaceMarket={isRaceMarket}
      nonRunnerTitle={"Non Runner"}
      isMarketInplay={false}
      isOddsboostMarketType={isOddsboostMarketType}
      runnerViewLink={runnerViewLink}
      dispatchToggleRunnerInfo={dispatchToggleRunnerInfo}
      dispatchFetchCatalogue={dispatchFetchCatalogue}
      dispatchDeleteView={dispatchDeleteView}
      dispatchToggleRecentRaces={dispatchToggleRecentRacesSpy}
      dispatchToggleRaceReplays={dispatchToggleRaceReplaysSpy}
      dispatchRaceReplaysMediaPlayerLoaded={dispatchRaceReplaysMediaPlayerLoadedSpy}
      isRunnerExpandable={isRunnerExpandable}
      hasDefaultSilk={hasDefaultSilk}
      horsePastPerformances={horsePastPerformances}
      dispatchExpandRunnerData={dispatchExpandRunnerData}
      horseRacingRunneri18nLabels={horseRacingRunneri18nLabels}
      dispatchPushAction={dispatchPushAction}
      dispatchNavigateToView={dispatchNavigateToView}
      eventViewLink={eventViewLink}
      showTrapIcon={showTrapIcon}
    />,
  );
}

describe("SportsbookRunner", () => {
  beforeEach(jest.clearAllMocks);

  describe("when is an horse racing runner", () => {
    const isRaceMarket = true;
    const runner = {
      raceRunnerDetails: {
        type: "HORSE",
        raceRunner: {
          form: "2257",
          apprenticeClaim: 3,
          crsDisWinFavText: "C",
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
        },
      },
      name: "Lydford",
      urn: "urn",
      runnerViewLink: { viewUrn: "viewUrn", viewUrl: "viewUrl" },
    };

    describe("when runner status is ACTIVE", () => {
      it(
        "should call HorseRacingRunner, ConnectedSportsbookBetButton and ConnectedPriceHistory components " +
          "and not call the Runner neither the NonRunner component",
        async () => {
          const { container } = renderSportsbookRunner({
            runner: { ...runner, status: "ACTIVE" },
            isRaceMarket: true,
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
              i18nLabels: expect.any(Object),
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
              component: expect.anything(),
              onPotentialBetChange: expect.any(Function),
              rounded: false,
              tall: true,
            }),
          );

          await waitFor(() => getByTestId(container, "connected-price-history"));
          expect(ConnectedPriceHistory).toHaveBeenCalledTimes(1);
          expect(lastProps(ConnectedPriceHistory)).toEqual(
            expect.objectContaining({
              runnerUrn: "urn",
              isMarketInplay: false,
              component: expect.any(Object),
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
        it("should call the dispatchPushAction and dispatchNavigateToView if eventViewLink exists", async () => {
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
            eventViewLink: { viewUrl: "viewUrl", viewUrn: "viewUrn" },
            isRaceMarket,
          });

          act(() => {
            const { onRunnerClick } = HorseRacingRunner.mock.calls[0][0];
            onRunnerClick();
          });

          expect(dispatchPushAction).toHaveBeenCalled();
          expect(dispatchNavigateToView).toHaveBeenCalledWith("viewUrl", "cardUrn", "Lydford");
        });

        it(
          "should not call the dispatchPushAction and call dispatchToggleRunnerInfo and dispatchFetchCatalogue" +
            " if eventViewLink is undefined and it has runerViewLink",
          async () => {
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
              runnerViewLink: { viewUrn: "fakeRunnerViewURN" },
              isRaceMarket,
            });

            act(() => {
              const { onRunnerClick } = HorseRacingRunner.mock.calls[0][0];
              onRunnerClick();
            });

            expect(dispatchPushAction).not.toHaveBeenCalled();
            expect(dispatchToggleRunnerInfo).toHaveBeenCalled();
          },
        );
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
      raceRunnerDetails: {
        type: "GREYHOUND",
        raceRunner: {
          trap: 5,
          meetingCountry: "GB",
          urn: "greyhound:urn",
        },
      },
      name: "Lydford Grey",
      urn: "urn",
      runnerViewLink: { viewUrn: "viewUrn", viewUrl: "viewUrl" },
    };

    describe("when runner status is ACTIVE", () => {
      it("should call RacingRunner with left and right columns (and render bet button + price history)", async () => {
        const { container } = renderSportsbookRunner({
          runner: { ...runner, status: "ACTIVE" },
          isRaceMarket: true,
          showTrapIcon: true,
        });

        expect(RacingRunner).toHaveBeenCalledTimes(1);
        expect(lastProps(RacingRunner)).toEqual(
          expect.objectContaining({
            title: "Lydford Grey",
            onClick: expect.any(Function),
            leftColumn: expect.anything(),
            rightColumn: expect.anything(),
          }),
        );

        expect(ConnectedSportsbookBetButton).toHaveBeenCalledTimes(1);

        await waitFor(() => getByTestId(container, "connected-price-history"));
        expect(ConnectedPriceHistory).toHaveBeenCalledTimes(1);

        expect(NonRunner).not.toHaveBeenCalled();
        expect(Runner).not.toHaveBeenCalled();
      });
    });

    describe("when runner status is REMOVED", () => {
      it("should call RacingRunner with NonRunner rendered inside rightColumn", () => {
        renderSportsbookRunner({
          runner: { ...runner, status: "REMOVED" },
          isRaceMarket,
          showTrapIcon: true,
        });

        expect(RacingRunner).toHaveBeenCalledTimes(1);
        expect(lastProps(RacingRunner)).toEqual(
          expect.objectContaining({
            title: "Lydford Grey",
            rightColumn: expect.anything(),
          }),
        );

        expect(NonRunner).toHaveBeenCalledTimes(1);
        expect(lastProps(NonRunner)).toEqual(expect.objectContaining({ title: "Non Runner" }));

        expect(ConnectedSportsbookBetButton).not.toHaveBeenCalled();
        expect(ConnectedPriceHistory).not.toHaveBeenCalled();
      });
    });

    describe("when the market is an oddsboost market type", () => {
      it("should not call Price History component", () => {
        renderSportsbookRunner({
          runner: { ...runner },
          isOddsboostMarketType: true,
          showTrapIcon: true,
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

    it("should call Runner and ConnectedSportsbookBetButton components and not call the HorseRacingRunner component", async () => {
      renderSportsbookRunner({
        runner,
        isRaceMarket,
      });

      expect(Runner).toHaveBeenCalledTimes(1);
      expect(lastProps(Runner)).toEqual(
        expect.objectContaining({
          name: "Benfica",
          className: expect.anything(),
          onClick: expect.any(Function),
        }),
      );

      expect(ConnectedSportsbookBetButton).toHaveBeenCalledTimes(1);
      expect(lastProps(ConnectedSportsbookBetButton)).toEqual(
        expect.objectContaining({
          marketUrn: "marketUrn",
          runnerUrn: "urn",
          cardUrn: "cardUrn",
          component: expect.anything(),
          rounded: false,
          tall: true,
        }),
      );

      expect(HorseRacingRunner).not.toHaveBeenCalled();
    });
  });

  describe("when runnerViewLinks is defined", () => {
    describe("and the onRunnerClick callback is called", () => {
      it("should call the ConnectedRunnerPage with the correct props", async () => {
        renderSportsbookRunner({
          runner: { urn: "urn", name: "Benfica" },
          dispatchToggleRunnerInfo,
          dispatchFetchCatalogue,
          dispatchDeleteView,
        });

        act(() => {
          const { onClick } = Runner.mock.calls[0][0];
          onClick();
        });

        expect(dispatchToggleRunnerInfo).toHaveBeenCalledWith("marketName", "Benfica", true);
        expect(dispatchFetchCatalogue).toHaveBeenCalledWith("viewUrn");

        expect(ConnectedGenericView).toHaveBeenCalledWith(
          {
            urn: "viewUrn",
            component: GenericView,
            placeholder: GenericViewPlaceholder,
          },
          undefined,
        );
      });
    });
  });

  describe("when runnerViewLink is not defined", () => {
    describe("and the onRunnerClick callback is called", () => {
      it("should not call the ConnectedRunnerPage", async () => {
        renderSportsbookRunner({
          runner: { urn: "urn", name: "Benfica" },
          runnerViewLink: null,
          dispatchToggleRunnerInfo,
          dispatchFetchCatalogue,
          dispatchDeleteView,
        });

        act(() => {
          const { onClick } = Runner.mock.calls[0][0];
          onClick();
        });

        expect(dispatchToggleRunnerInfo).not.toHaveBeenCalled();
        expect(dispatchFetchCatalogue).not.toHaveBeenCalled();

        expect(ConnectedGenericView).not.toHaveBeenCalled();
      });
    });
  });

  describe("when the runner view is dismissed", () => {
    it("should dispatch an action to clean the view", async () => {
      const { container } = renderSportsbookRunner({
        runner: { urn: "urn", name: "Benfica" },
        dispatchToggleRunnerInfo,
        dispatchFetchCatalogue,
        dispatchDeleteView,
      });

      act(() => {
        const { onClick } = Runner.mock.calls[0][0];
        onClick();
      });

      await waitFor(() => getByTestId(container, "full-screen-modal"));

      expect(FullScreenModalComponent).toHaveBeenCalled();

      act(() => {
        FullScreenModalComponent.mock.calls[0][0].onDismiss();
      });

      expect(dispatchDeleteView).toHaveBeenCalledWith("viewUrn");
    });
  });
});
