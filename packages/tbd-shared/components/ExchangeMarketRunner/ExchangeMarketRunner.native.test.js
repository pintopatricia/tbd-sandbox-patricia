import { render, act } from "@testing-library/react-native";

import { Runner } from "@ppb/the-wall-native/components/Runner/Runner";
import { HorseRacingRunner } from "@ppb/the-wall-native/components/Runner/HorseRacingRunner/HorseRacingRunner";
import { NonRunner } from "@ppb/the-wall-native/components/NonRunner/NonRunner";
import { navigate } from "@ppb/tbd-router/native";

import ExchangeMarketRunnerComponent from "./ExchangeMarketRunner.native";

import ConnectedExchangeBetButtons from "../ExchangeBetButtons";
import ExchangeBetButtons from "../ExchangeBetButtons/ExchangeBetButtons.native";
import { withInlineBetslip } from "../Betslip/withInlineBetslip/withInlineBetslip.native";

jest.mock("@ppb/the-wall-native/components/Runner/Runner", () => ({
  __esModule: true,
  Runner: jest.fn((props) => <runner-mock {...props}>{props.children}</runner-mock>),
}));

jest.mock("@ppb/the-wall-native/components/Runner/HorseRacingRunner/HorseRacingRunner", () => ({
  __esModule: true,
  HorseRacingRunner: jest.fn((props) => (
    <hr-runner-mock {...props}>
      {props.leftColumn}
      {props.middleColumn}
      {props.rightColumn}
      {props.children}
    </hr-runner-mock>
  )),
}));

jest.mock("@ppb/the-wall-native/components/NonRunner/NonRunner", () => ({
  __esModule: true,
  NonRunner: jest.fn((props) => <non-runner-mock {...props} />),
}));

jest.mock("@ppb/tbd-router/native", () => ({
  __esModule: true,
  navigate: jest.fn(() => {}),
}));

jest.mock("../ExchangeBetButtons", () => ({
  __esModule: true,
  default: jest.fn((props) => (
    <connected-exchange-bet-buttons data-testId="connected-exchange-bet-button" {...props} />
  )),
}));

jest.mock("../ExchangeBetButtons/ExchangeBetButtons.native", () => ({
  __esModule: true,
  default: jest.fn((props) => <exchange-bet-buttons-mock {...props} />),
}));

jest.mock("../Betslip/withInlineBetslip/withInlineBetslip.native", () => ({
  __esModule: true,
  withInlineBetslip: jest.fn((arg) => arg),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  __esModule: true,
  spacings: {},
  heights: {},
}));

const dispatchToggleRunnerInfoSpy = jest.fn();
const dispatchToggleMarketGraphSpy = jest.fn();
const dispatchToggleRecentRacesSpy = jest.fn();
const dispatchToggleRaceReplaysSpy = jest.fn();
const dispatchRaceReplaysMediaPlayerLoadedSpy = jest.fn();

const runnerMock = {
  urn: "ppb:runner:1.123456/10/0",
  name: "runner 1",
  selectionId: "10",
  isRaceRunner: true,
  saddleCloth: "cloth",
  silk: "silk",
  draw: 1,
  trainerName: "trainer 1",
  jockeyName: "jockey 1",
  horseName: "Shakalaka",
  pnl: "pnl",
  rawPnl: 10,
  whatIf: "whatIf",
  rawWhatIf: 1,
  reduction: "reduction",
  date: "10-10-2021",
  status: "ACTIVE",
  form: "form",
  weight: "10-12",
  apprenticeClaim: 3,
  crsDisWinFavText: "C",
  rating: 1,
  comments: "dummy comments",
  equipment: "helmet",
  horseAge: 4,
  horseDamName: "SHIROCCO",
  horseSireName: "GILT",
  horseBred: "IRE",
  horsePastPerformances: [
    { course: "course 1", pos: "3" },
    { course: "course 2", pos: "7" },
    { course: "course 3", pos: "1" },
  ],
};

const defaultRenderProps = {
  cardURN: "ppb:tbd:card:1",
  marketURN: "ppb:market:1.123456",
  marketName: "Market Name",
  runner: runnerMock,
  runnerIdx: 1,
  runnersLength: 1,
  isRaceMarket: true,
  i18nLabels: { nonRunnerTitle: "Non Runner" },
  isMarketDepthActive: true,
  isMarketGraphsActive: false,
  hasDefaultSilk: false,
  horseRacingRunneri18nLabels: {
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
  isRunnerExpandable: false,
  onMarketGraphButtonTap: () => {},
  dispatchToggleRunnerInfo: dispatchToggleRunnerInfoSpy,
  dispatchToggleMarketGraph: dispatchToggleMarketGraphSpy,
  dispatchToggleRecentRaces: dispatchToggleRecentRacesSpy,
  dispatchToggleRaceReplays: dispatchToggleRaceReplaysSpy,
  dispatchRaceReplaysMediaPlayerLoaded: dispatchRaceReplaysMediaPlayerLoadedSpy,
};

const dispatchExpandRunnerData = jest.fn();

const lastProps = (mockFn) => mockFn.mock.calls[mockFn.mock.calls.length - 1]?.[0];

function setupRender(renderProps = defaultRenderProps) {
  return render(
    <ExchangeMarketRunnerComponent
      cardURN={renderProps.cardURN}
      marketURN={renderProps.marketURN}
      marketName={renderProps.marketName}
      marketStatus={renderProps.marketStatus}
      runner={renderProps.runner}
      runnerIdx={renderProps.runnerIdx}
      runnersLength={renderProps.runnersLength}
      isRaceMarket={renderProps.isRaceMarket}
      i18nLabels={renderProps.i18nLabels}
      isMarketDepthActive={renderProps.isMarketDepthActive}
      isMarketGraphsActive={renderProps.isMarketGraphsActive}
      renderBetslip={renderProps.renderBetslip}
      isRunnerExpandable={renderProps.isRunnerExpandable}
      hasDefaultSilk={renderProps.hasDefaultSilk}
      dispatchExpandRunnerData={dispatchExpandRunnerData}
      dispatchToggleRunnerInfo={renderProps.dispatchToggleRunnerInfo}
      dispatchToggleMarketGraph={renderProps.dispatchToggleMarketGraph}
      dispatchToggleRecentRaces={renderProps.dispatchToggleRecentRaces}
      dispatchToggleRaceReplays={renderProps.dispatchToggleRaceReplays}
      dispatchRaceReplaysMediaPlayerLoaded={renderProps.dispatchRaceReplaysMediaPlayerLoaded}
      horseRacingRunneri18nLabels={renderProps.horseRacingRunneri18nLabels}
      isInlineBetslipActive={renderProps.isInlineBetslipActive}
      eventViewLink={renderProps.eventViewLink}
      onMarketGraphButtonTap={renderProps.onMarketGraphButtonTap}
    />,
  );
}

describe("Exchange Market Runner", () => {
  describe("the component is exported withInlineBetslip", () => {
    it("should call withInlineBetslip", () => {
      expect(withInlineBetslip).toHaveBeenCalledTimes(1);
    });

    describe("and if inline betslip is enabled and open", () => {
      it("should set 'noMarginBottom' to true for 'HorseRacingRunner' component", () => {
        setupRender({ ...defaultRenderProps, renderBetslip: () => {} });

        expect(HorseRacingRunner).toHaveBeenCalledWith(
          expect.objectContaining({
            noMarginBottom: true,
          }),
          undefined,
        );
      });
    });
  });

  describe("when is horse runner", () => {
    beforeEach(jest.clearAllMocks);

    describe("when runner status is ACTIVE", () => {
      it("should call HorseRacingRunner and ConnectedExchangeBetButtons with the correct props", () => {
        setupRender();

        expect(HorseRacingRunner).toHaveBeenCalledTimes(1);
        expect(lastProps(HorseRacingRunner)).toEqual(
          expect.objectContaining({
            horseName: "runner 1",
            saddleCloth: "cloth",
            silkUrl: "silk",
            drawNumber: 1,
            trainerName: "trainer 1",
            jockeyName: "jockey 1",
            isMarketDepthActive: true,
            noMarginBottom: false,
            pnlAndWhatIf: {
              pnl: "pnl",
              rawPnl: 10,
              whatIf: "whatIf",
              rawWhatIf: 1,
            },
            form: "form",
            apprenticeClaim: 3,
            crsDisWinFavText: "C",
            showChevron: false,
            onMarketGraphsButtonClick: expect.any(Function),
            hasGraphsLink: true,
            weight: "10-12",
            rating: 1,
            comments: "dummy comments",
            equipment: "helmet",
            horseAge: 4,
            horseDamName: "SHIROCCO",
            horseSireName: "GILT",
            horseBred: "IRE",
            hasDefaultSilk: false,
            onRunnerClick: expect.any(Function),
            horsePastPerformances: runnerMock.horsePastPerformances,
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

        expect(ConnectedExchangeBetButtons).toHaveBeenCalledTimes(1);
        expect(lastProps(ConnectedExchangeBetButtons)).toEqual(
          expect.objectContaining({
            component: ExchangeBetButtons,
            cardURN: "ppb:tbd:card:1",
            marketURN: "ppb:market:1.123456",
            runnerURN: "ppb:runner:1.123456/10/0",
            displayBestOdds: false,
            onBetButtonClick: expect.any(Function),
          }),
        );

        expect(NonRunner).not.toHaveBeenCalled();
        expect(Runner).not.toHaveBeenCalled();
      });

      describe("when ConnectedExchangeBetButtons onBetButtonClick cb is called", () => {
        it(
          "should update IsPotentialBet local state and update HorseRacingRunner with isPotentialBet as true " +
            "if isPotentialBetVal is true ",
          () => {
            setupRender();

            expect(lastProps(HorseRacingRunner).isPotentialBet).toBe(false);

            act(() => {
              lastProps(ConnectedExchangeBetButtons).onBetButtonClick(true);
            });

            expect(lastProps(HorseRacingRunner).isPotentialBet).toBe(true);
          },
        );

        it(
          "should not update IsPotentialBet local state and not update HorseRacingRunner " +
            "if isPotentialBetVal is false",
          () => {
            setupRender(defaultRenderProps);

            act(() => {
              lastProps(ConnectedExchangeBetButtons).onBetButtonClick(false);
            });

            expect(HorseRacingRunner.mock.calls.some((c) => c[0]?.isPotentialBet === true)).toBe(false);
          },
        );
      });
    });

    describe("when runner status is REMOVED", () => {
      it("should call NonRunner component (rendered inside rightColumn) and not call ConnectedExchangeBetButtons", async () => {
        setupRender({
          ...defaultRenderProps,
          runner: {
            ...runnerMock,
            status: "REMOVED",
          },
        });

        expect(HorseRacingRunner).toHaveBeenCalledTimes(1);

        expect(NonRunner).toHaveBeenCalledTimes(1);
        expect(lastProps(NonRunner)).toEqual(
          expect.objectContaining({
            title: "Non Runner",
            reduction: "reduction",
            date: "10-10-2021",
          }),
        );

        expect(ConnectedExchangeBetButtons).not.toHaveBeenCalled();
      });
    });

    describe("when onRunnerClick is executed", () => {
      beforeEach(() => {
        HorseRacingRunner.mockClear();
      });

      describe("when isRunnerExpandable is true", () => {
        it("should call the dispatchExpandRunnerData if called with expanded as true", async () => {
          setupRender({
            ...defaultRenderProps,
            isRunnerExpandable: true,
            runner: {
              ...runnerMock,
              raceRunnerUrn: "ppb:racerunner:1.123456/10/0",
            },
          });

          act(() => {
            const { onRunnerClick } = HorseRacingRunner.mock.calls[0][0];
            onRunnerClick(true);
          });

          expect(dispatchExpandRunnerData).toHaveBeenCalled();
          expect(dispatchToggleRunnerInfoSpy).toHaveBeenCalledWith("Market Name", "runner 1", true);
        });

        it("should not call the dispatchExpandRunnerData if called with expanded as false", async () => {
          setupRender({
            ...defaultRenderProps,
            isRunnerExpandable: true,
            runner: {
              ...runnerMock,
              raceRunnerUrn: "ppb:racerunner:1.123456/10/0",
            },
          });

          act(() => {
            const { onRunnerClick } = HorseRacingRunner.mock.calls[0][0];
            onRunnerClick(false);
          });

          expect(dispatchExpandRunnerData).not.toHaveBeenCalled();
          expect(dispatchToggleRunnerInfoSpy).toHaveBeenCalledWith("Market Name", "runner 1", false);
        });
      });

      describe("when isRunnerExpandable is false", () => {
        it("should call the navigate with eventViewLink if isRaceMarket is true and eventViewLink exists", async () => {
          const eventViewLink = { viewUrl: "viewUrl", viewUrn: "viewUrn" };
          setupRender({
            ...defaultRenderProps,
            isRunnerExpandable: false,
            runner: {
              ...runnerMock,
              raceRunnerUrn: "ppb:racerunner:1.123456/10/0",
            },
            eventViewLink,
          });

          act(() => {
            const { onRunnerClick } = HorseRacingRunner.mock.calls[0][0];
            onRunnerClick();
          });

          expect(navigate).toHaveBeenCalledWith(eventViewLink);
        });
      });
    });

    describe("when onRecentRaceClick is executed", () => {
      beforeEach(() => {
        HorseRacingRunner.mockClear();
      });

      it("should call the dispatchToggleRecentRaces", async () => {
        setupRender({
          ...defaultRenderProps,
          isRunnerExpandable: true,
          runner: {
            ...runnerMock,
            raceRunnerUrn: "ppb:racerunner:1.123456/10/0",
          },
        });

        act(() => {
          const { onRecentRaceClick } = HorseRacingRunner.mock.calls[0][0];
          onRecentRaceClick(true);
        });

        expect(dispatchToggleRecentRacesSpy).toHaveBeenCalledWith("runner 1", "ppb:tbd:card:1", true);
      });
    });
  });

  describe("when is not a horse runner", () => {
    beforeEach(jest.clearAllMocks);

    it("should call Runner and ConnectedExchangeBetButtons with the correct props", () => {
      setupRender({
        ...defaultRenderProps,
        isRaceMarket: false,
        runner: {
          ...runnerMock,
          isRaceRunner: false,
        },
      });

      expect(Runner).toHaveBeenCalledTimes(1);
      expect(lastProps(Runner)).toEqual(
        expect.objectContaining({
          name: "runner 1",
          isMarketDepthActive: true,
          pnlAndWhatIf: {
            pnl: "pnl",
            rawPnl: 10,
            whatIf: "whatIf",
            rawWhatIf: 1,
          },
          onClick: expect.any(Function),
        }),
      );

      expect(ConnectedExchangeBetButtons).toHaveBeenCalledTimes(1);
      expect(lastProps(ConnectedExchangeBetButtons)).toEqual(
        expect.objectContaining({
          component: ExchangeBetButtons,
          cardURN: "ppb:tbd:card:1",
          marketURN: "ppb:market:1.123456",
          runnerURN: "ppb:runner:1.123456/10/0",
          displayBestOdds: false,
        }),
      );

      expect(NonRunner).not.toHaveBeenCalled();
      expect(HorseRacingRunner).not.toHaveBeenCalled();
    });

    describe("and the market depth is inactive", () => {
      it("should call Runner with 'isMarketGraphsActive' set to true", async () => {
        setupRender({
          ...defaultRenderProps,
          isRaceMarket: false,
          isMarketDepthActive: false,
          runner: {
            ...runnerMock,
            isRaceRunner: false,
          },
        });

        expect(Runner).toHaveBeenCalledTimes(1);
        expect(lastProps(Runner)).toEqual(
          expect.objectContaining({
            name: "runner 1",
            isMarketDepthActive: false,
            isMarketGraphsActive: true,
            pnlAndWhatIf: {
              pnl: "pnl",
              rawPnl: 10,
              whatIf: "whatIf",
              rawWhatIf: 1,
            },
            onClick: expect.any(Function),
          }),
        );
      });
    });

    describe("and the market depth is active", () => {
      it("should call Runner with 'isMarketGraphsActive' set to false", async () => {
        setupRender({
          ...defaultRenderProps,
          isRaceMarket: false,
          isMarketDepthActive: true,
          runner: {
            ...runnerMock,
            isRaceRunner: false,
          },
        });

        expect(Runner).toHaveBeenCalledTimes(1);
        expect(lastProps(Runner)).toEqual(
          expect.objectContaining({
            name: "runner 1",
            isMarketDepthActive: true,
            isMarketGraphsActive: false,
            pnlAndWhatIf: {
              pnl: "pnl",
              rawPnl: 10,
              whatIf: "whatIf",
              rawWhatIf: 1,
            },
            onClick: expect.any(Function),
          }),
        );
      });
    });
  });

  describe("when onRaceReplaysClick is executed", () => {
    beforeEach(() => {
      HorseRacingRunner.mockClear();
    });

    it("should call the dispatchToggleRaceReplays", async () => {
      setupRender({
        ...defaultRenderProps,
      });

      act(() => {
        const { onRaceReplaysClick } = HorseRacingRunner.mock.calls[0][0];
        onRaceReplaysClick(true);
      });

      expect(dispatchToggleRaceReplaysSpy).toHaveBeenCalledWith("runner 1", true, "ppb:tbd:card:1");
    });
  });

  describe("when onRaceReplaysLoaded is executed", () => {
    beforeEach(() => {
      HorseRacingRunner.mockClear();
    });

    it("should call the dispatchRaceReplaysMediaPlayerLoaded", async () => {
      setupRender({
        ...defaultRenderProps,
      });

      act(() => {
        const { onRaceReplaysLoaded } = HorseRacingRunner.mock.calls[0][0];
        onRaceReplaysLoaded();
      });

      expect(dispatchRaceReplaysMediaPlayerLoadedSpy).toHaveBeenCalledWith("ppb:market:1.123456");
    });
  });
});
