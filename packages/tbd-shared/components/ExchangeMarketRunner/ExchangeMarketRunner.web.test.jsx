import "jest-dom/extend-expect";
import { act, getByTestId, render, waitFor } from "@testing-library/react";
import classnames from "classnames";

import { HorseRacingRunner, NonRunner, Runner } from "@ppb/the-wall-web";

import styles from "./ExchangeMarketRunner.web.css";
import ExchangeMarketRunnerComponent from "./ExchangeMarketRunner.web";

import ConnectedExchangeBetButtons from "../ExchangeBetButtons";
import ConnectedMarketGraph from "../MarketGraph";
import { withInlineBetslip } from "../Betslip/withInlineBetslip/withInlineBetslip.web";

jest.mock("@ppb/the-wall-web", () => ({
  __esModule: true,
  HorseRacingRunner: jest.fn((props) => (
    <hr-runner-mock {...props}>
      {props.leftColumn}
      {props.middleColumn}
      {props.rightColumn}
      {props.children}
    </hr-runner-mock>
  )),
  Runner: jest.fn((props) => <runner-mock {...props}>{props.children}</runner-mock>),
  NonRunner: jest.fn((props) => <non-runner-mock {...props} />),
}));

jest.mock("../ExchangeBetButtons", () => ({
  __esModule: true,
  default: jest.fn(({ props }) => (
    <connected-exchange-bet-buttons data-testId="connected-exchange-bet-button" {...props} />
  )),
}));
jest.mock("../ExchangeBetButtons/ExchangeBetButtons.web", () => ({
  __esModule: true,
  default: jest.fn(({ props }) => <exchange-bet-buttons-mock {...props} />),
}));

jest.mock("../MarketGraph", () => ({
  __esModule: true,
  default: jest.fn(({ props }) => <connected-market-graphs data-testId="connected-market-graphs" {...props} />),
}));
jest.mock("../MarketGraph/MarketGraph.web", () => ({
  __esModule: true,
  default: jest.fn(({ props }) => <market-graphs-mock {...props} />),
}));

jest.mock("../Betslip/withInlineBetslip/withInlineBetslip.web", () => ({
  __esModule: true,
  withInlineBetslip: jest.fn((arg) => arg),
}));

const dispatchToggleRunnerInfoSpy = jest.fn();
const dispatchToggleMarketGraphSpy = jest.fn();
const dispatchToggleRecentRacesSpy = jest.fn();
const dispatchToggleRaceReplaysSpy = jest.fn();
const dispatchRaceReplaysMediaPlayerLoadedSpy = jest.fn();
const dispatchExpandRunnerData = jest.fn();
const dispatchPushAction = jest.fn();

const RUNNER_MOCK = {
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
  apprenticeClaim: 3,
  crsDisWinFavText: "C",
  weight: "10-12",
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

const DEFAULT_PROPS = {
  cardURN: "ppb:tbd:card:1",
  marketURN: "ppb:market:1.123456",
  marketName: "Market Name",
  runner: RUNNER_MOCK,
  isRaceMarket: true,
  i18nLabels: { nonRunnerTitle: "Non Runner" },
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
  isMarketDepthActive: true,
  isMarketGraphsActive: false,
  renderBetslip: undefined,
  isRunnerExpandable: false,
  hasDefaultSilk: false,
  onMarketGraphButtonTap: () => {},
  dispatchToggleRunnerInfo: dispatchToggleRunnerInfoSpy,
  dispatchToggleMarketGraph: dispatchToggleMarketGraphSpy,
  dispatchToggleRecentRaces: dispatchToggleRecentRacesSpy,
  dispatchToggleRaceReplays: dispatchToggleRaceReplaysSpy,
  dispatchRaceReplaysMediaPlayerLoaded: dispatchRaceReplaysMediaPlayerLoadedSpy,
};

const lastProps = (mockFn) => mockFn.mock.calls[mockFn.mock.calls.length - 1]?.[0];

function setupRender(renderProps = DEFAULT_PROPS) {
  return render(
    <ExchangeMarketRunnerComponent
      cardURN={renderProps.cardURN}
      marketURN={renderProps.marketURN}
      marketName={renderProps.marketName}
      runner={renderProps.runner}
      isRaceMarket={renderProps.isRaceMarket}
      i18nLabels={renderProps.i18nLabels}
      isMarketDepthActive={renderProps.isMarketDepthActive}
      isMarketGraphsActive={renderProps.isMarketGraphsActive}
      hasDefaultSilk={renderProps.hasDefaultSilk}
      renderBetslip={renderProps.renderBetslip}
      dispatchToggleRunnerInfo={renderProps.dispatchToggleRunnerInfo}
      dispatchToggleMarketGraph={renderProps.dispatchToggleMarketGraph}
      dispatchToggleRecentRaces={renderProps.dispatchToggleRecentRaces}
      dispatchToggleRaceReplays={renderProps.dispatchToggleRaceReplays}
      dispatchRaceReplaysMediaPlayerLoaded={renderProps.dispatchRaceReplaysMediaPlayerLoaded}
      isRunnerExpandable={renderProps.isRunnerExpandable}
      dispatchExpandRunnerData={dispatchExpandRunnerData}
      horseRacingRunneri18nLabels={renderProps.horseRacingRunneri18nLabels}
      dispatchPushAction={dispatchPushAction}
      eventViewLink={renderProps.eventViewLink}
      marketStatus={renderProps.marketStatus}
      onMarketGraphButtonTap={renderProps.onMarketGraphButtonTap}
    />,
  );
}

afterEach(jest.clearAllMocks);

describe("Exchange Market Runner", () => {
  describe("the component is exported withInlineBetslip", () => {
    it("should call withInlineBetslip", () => {
      setupRender();

      expect(withInlineBetslip).toHaveBeenCalledTimes(1);
    });

    describe("and if inline betslip is enabled and open", () => {
      it("should set 'noMarginBottom' to true for 'HorseRacingRunner' component", () => {
        setupRender({ ...DEFAULT_PROPS, renderBetslip: () => {} });

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
    describe("when runner status is ACTIVE", () => {
      it("should call HorseRacingRunner and ConnectedExchangeBetButtons with the correct props", async () => {
        const { container } = setupRender();

        expect(HorseRacingRunner).toHaveBeenCalledTimes(1);
        expect(lastProps(HorseRacingRunner)).toEqual(
          expect.objectContaining({
            className: classnames(styles.runnerBase, styles.horseRacingRunner),
            horseName: "runner 1",
            saddleCloth: "cloth",
            silkUrl: "silk",
            drawNumber: 1,
            trainerName: "trainer 1",
            jockeyName: "jockey 1",
            isMarketDepthActive: true,
            noMarginBottom: false,
            hasDefaultSilk: false,
            pnlAndWhatIf: {
              pnl: "pnl",
              rawPnl: 10,
              whatIf: "whatIf",
              rawWhatIf: 1,
            },
            form: "form",
            apprenticeClaim: 3,
            crsDisWinFavText: "C",
            hasGraphsLink: false,
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
            horsePastPerformances: RUNNER_MOCK.horsePastPerformances,
            isPotentialBet: false,
            i18nLabels: DEFAULT_PROPS.horseRacingRunneri18nLabels,
            onRecentRaceClick: expect.any(Function),
            onRaceReplaysClick: expect.any(Function),
            onRaceReplaysLoaded: expect.any(Function),
            rightColumn: expect.anything(),
          }),
        );

        await waitFor(() => getByTestId(container, "connected-exchange-bet-button"));
        expect(ConnectedExchangeBetButtons).toHaveBeenCalledTimes(1);
        expect(lastProps(ConnectedExchangeBetButtons)).toEqual(
          expect.objectContaining({
            component: expect.any(Function),
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
            "if isPotentialBetVal is true",
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
            setupRender(DEFAULT_PROPS);

            act(() => {
              lastProps(ConnectedExchangeBetButtons).onBetButtonClick(false);
            });

            expect(HorseRacingRunner.mock.calls.some((c) => c[0]?.isPotentialBet === true)).toBe(false);
          },
        );
      });
    });

    describe("when runner status is REMOVED", () => {
      it("should call NonRunner component and still call HorseRacingRunner (with rightColumn containing NonRunner)", async () => {
        setupRender({
          ...DEFAULT_PROPS,
          runner: {
            ...RUNNER_MOCK,
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
            marketStatus: undefined,
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
            ...DEFAULT_PROPS,
            isRunnerExpandable: true,
            runner: {
              ...RUNNER_MOCK,
              raceRunnerUrn: "ppb:racerunner:1.123456/10/0",
            },
          });

          act(() => {
            const { onRunnerClick } = HorseRacingRunner.mock.calls[0][0];
            onRunnerClick(true);
          });

          expect(dispatchExpandRunnerData).toHaveBeenCalled();
        });

        it("should not call the dispatchExpandRunnerData if called with expanded as false", async () => {
          setupRender({
            ...DEFAULT_PROPS,
            isRunnerExpandable: true,
            runner: {
              ...RUNNER_MOCK,
              raceRunnerUrn: "ppb:racerunner:1.123456/10/0",
            },
          });

          act(() => {
            const { onRunnerClick } = HorseRacingRunner.mock.calls[0][0];
            onRunnerClick(false);
          });

          expect(dispatchExpandRunnerData).not.toHaveBeenCalled();
        });
      });

      describe("when isRunnerExpandable is false", () => {
        it("should call the dispatchPushAction if isRaceMarket is true and eventViewLink exists", async () => {
          setupRender({
            ...DEFAULT_PROPS,
            isRunnerExpandable: false,
            runner: {
              ...RUNNER_MOCK,
              raceRunnerUrn: "ppb:racerunner:1.123456/10/0",
            },
            eventViewLink: { viewUrl: "viewUrl", viewUrn: "viewUrn" },
          });

          act(() => {
            const { onRunnerClick } = HorseRacingRunner.mock.calls[0][0];
            onRunnerClick();
          });

          expect(dispatchPushAction).toHaveBeenCalled();
        });
      });
    });
  });

  describe("when is not a horse runner", () => {
    it("should call Runner and ConnectedExchangeBetButtons with the correct props", async () => {
      const { container } = setupRender({
        ...DEFAULT_PROPS,
        isRaceMarket: false,
        runner: {
          ...RUNNER_MOCK,
          isRaceRunner: false,
        },
      });

      expect(Runner).toHaveBeenCalledTimes(1);
      expect(lastProps(Runner)).toEqual(
        expect.objectContaining({
          className: classnames(styles.runnerBase, styles.runner),
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

      await waitFor(() => getByTestId(container, "connected-exchange-bet-button"));
      expect(ConnectedExchangeBetButtons).toHaveBeenCalledTimes(1);
      expect(lastProps(ConnectedExchangeBetButtons)).toEqual(
        expect.objectContaining({
          component: expect.any(Function),
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
          ...DEFAULT_PROPS,
          isRaceMarket: false,
          isMarketDepthActive: false,
          runner: {
            ...RUNNER_MOCK,
            isRaceRunner: false,
          },
        });

        expect(Runner).toHaveBeenCalledTimes(1);
        expect(lastProps(Runner)).toEqual(
          expect.objectContaining({
            className: classnames(styles.runnerBase, styles.runner),
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
          ...DEFAULT_PROPS,
          isRaceMarket: false,
          isMarketDepthActive: true,
          runner: {
            ...RUNNER_MOCK,
            isRaceRunner: false,
          },
        });

        expect(Runner).toHaveBeenCalledTimes(1);
        expect(lastProps(Runner)).toEqual(
          expect.objectContaining({
            className: classnames(styles.runnerBase, styles.runner),
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

  describe("when onRecentRaceClick is executed", () => {
    beforeEach(() => {
      HorseRacingRunner.mockClear();
    });

    it("should call the dispatchToggleRecentRaces", async () => {
      setupRender({
        ...DEFAULT_PROPS,
        isRunnerExpandable: true,
        runner: {
          ...RUNNER_MOCK,
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

  describe("when onRaceReplaysClick is executed", () => {
    beforeEach(() => {
      HorseRacingRunner.mockClear();
    });

    it("should call the dispatchToggleRaceReplays", async () => {
      setupRender({
        ...DEFAULT_PROPS,
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
        ...DEFAULT_PROPS,
      });

      act(() => {
        const { onRaceReplaysLoaded } = HorseRacingRunner.mock.calls[0][0];
        onRaceReplaysLoaded();
      });

      expect(dispatchRaceReplaysMediaPlayerLoadedSpy).toHaveBeenCalledWith("ppb:market:1.123456");
    });
  });
});
