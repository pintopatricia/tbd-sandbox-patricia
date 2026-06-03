import { Fragment, FunctionComponent, useState, useCallback } from "react";
import classnames from "classnames";

import { HorseRacingRunner, Runner, NonRunner } from "@ppb/the-wall-web";
import { ExchangeRunnerStatus } from "@ppb/tbd-store/state/constants";

import ConnectedExchangeBetButtons from "../ExchangeBetButtons";
import ExchangeBetButtons from "../ExchangeBetButtons/ExchangeBetButtons.web";
import type {
  ExchangeMarketRunner,
  ExchangeRaceMarketRunner,
} from "../ExchangeMarket/snowflakes/ExchangeMarket/ExchangeMarket.types";
import { withInlineBetslip } from "../Betslip/withInlineBetslip/withInlineBetslip.web";

import { ComponentProps } from "./props";
import styles from "./ExchangeMarketRunner.web.css";

const isRaceRunner = (isRace: boolean, excRunner: ExchangeMarketRunner): excRunner is ExchangeRaceMarketRunner =>
  isRace && !!excRunner;

const ExchangeMarketRunnerComponent: FunctionComponent<ComponentProps> = ({
  cardURN,
  marketURN,
  marketName,
  marketStatus,
  runner,
  isRaceMarket,
  i18nLabels,
  isMarketDepthActive,
  eventViewLink,
  renderBetslip,
  isRunnerExpandable,
  hasDefaultSilk,
  horseRacingRunneri18nLabels,
  dispatchToggleRunnerInfo,
  dispatchExpandRunnerData,
  dispatchPushAction,
  dispatchToggleRecentRaces,
  dispatchToggleRaceReplays,
  dispatchRaceReplaysMediaPlayerLoaded,
  onMarketGraphButtonTap,
}) => {
  const betslip = renderBetslip ? renderBetslip(runner.urn) : null;
  const isBetslipOpen = betslip !== null;
  const betButtonsClassName = classnames({
    [styles.marketDepthButtonsContainer]: isMarketDepthActive,
    [styles.exchangeButtonsContainer]: !isMarketDepthActive,
    [styles.racingRunner]: isRaceMarket,
  });
  const fullBorderRadiusClassName = classnames({
    [styles.buttonColumnContainer]: !isMarketDepthActive,
  });

  const betButtonsSpacingClassName = classnames({
    [styles.spacingDiv]: !isMarketDepthActive,
  });

  const onRunnerClick = useCallback(
    (expanded: boolean) => {
      if (isRunnerExpandable) {
        if (runner.raceRunnerUrn && expanded) {
          dispatchExpandRunnerData([runner.raceRunnerUrn]);
          // GTM show runner details accordion
          dispatchToggleRunnerInfo(marketName, runner.name, true);
        }

        // GTM close runner details accordion
        if (!expanded) {
          dispatchToggleRunnerInfo(marketName, runner.name, false);
        }
      } else if (isRaceMarket && eventViewLink) {
        dispatchPushAction(eventViewLink);
      }
    },
    [
      dispatchExpandRunnerData,
      dispatchPushAction,
      dispatchToggleRunnerInfo,
      eventViewLink,
      isRaceMarket,
      isRunnerExpandable,
      marketName,
      runner,
    ],
  );

  const onRecentRaceClick = useCallback(
    (expanded: boolean) => {
      dispatchToggleRecentRaces(runner.name, cardURN, expanded);
    },
    [dispatchToggleRecentRaces, runner.name, cardURN],
  );

  const onRaceReplaysClick = useCallback(
    (isClosed: boolean) => {
      dispatchToggleRaceReplays(runner.name, isClosed, cardURN);
    },
    [dispatchToggleRaceReplays, runner.name, cardURN],
  );

  const onRaceReplaysLoaded = useCallback((): void => {
    dispatchRaceReplaysMediaPlayerLoaded(marketURN);
  }, [dispatchRaceReplaysMediaPlayerLoaded, marketURN]);

  const [isPotentialBet, setIsPotentialBet] = useState(false);
  const onBetButtonClick = useCallback((isPotentialBetVal: boolean) => {
    setIsPotentialBet(isPotentialBetVal);
  }, []);

  return (
    <Fragment>
      {isRaceRunner(isRaceMarket, runner) ? (
        <HorseRacingRunner
          className={classnames(styles.runnerBase, styles.horseRacingRunner)}
          horseName={runner.name}
          saddleCloth={runner.saddleCloth}
          drawNumber={runner.draw}
          jockeyName={runner.jockeyName}
          trainerName={runner.trainerName}
          silkUrl={runner.silk}
          isMarketDepthActive={isMarketDepthActive}
          noMarginBottom={isBetslipOpen}
          pnlAndWhatIf={{
            pnl: runner.pnl,
            rawPnl: runner.rawPnl,
            whatIf: runner.whatIf,
            rawWhatIf: runner.rawWhatIf,
          }}
          form={runner.form}
          apprenticeClaim={runner.apprenticeClaim}
          crsDisWinFavText={runner.crsDisWinFavText}
          weight={runner.weight}
          rating={runner.rating}
          comments={runner.comments}
          equipment={runner.equipment}
          horseAge={runner.horseAge}
          horseDamName={runner.horseDamName}
          horseSireName={runner.horseSireName}
          horseBred={runner.horseBred}
          showChevron={!isPotentialBet && !!isRunnerExpandable && !!runner.horseAge}
          hasGraphsLink={false}
          hasDefaultSilk={hasDefaultSilk}
          onRunnerClick={onRunnerClick}
          onRecentRaceClick={onRecentRaceClick}
          horsePastPerformances={runner.horsePastPerformances}
          isPotentialBet={isPotentialBet}
          i18nLabels={horseRacingRunneri18nLabels}
          onRaceReplaysClick={onRaceReplaysClick}
          onRaceReplaysLoaded={onRaceReplaysLoaded}
          rightColumn={
            runner.status === ExchangeRunnerStatus.REMOVED ? (
              <div className={styles.nonRunnerContainer}>
                <NonRunner
                  title={i18nLabels.nonRunnerTitle}
                  reduction={runner.reduction}
                  date={runner.date}
                  marketStatus={marketStatus}
                />
              </div>
            ) : (
              <div className={fullBorderRadiusClassName}>
                <div className={betButtonsClassName}>
                  <ConnectedExchangeBetButtons
                    component={ExchangeBetButtons}
                    cardURN={cardURN}
                    marketURN={marketURN}
                    runnerURN={runner.urn}
                    displayBestOdds={!isMarketDepthActive}
                    onBetButtonClick={onBetButtonClick}
                  />
                </div>
                <div className={betButtonsSpacingClassName}></div>
              </div>
            )
          }
        />
      ) : (
        <Runner
          className={classnames(styles.runnerBase, styles.runner)}
          name={runner.name}
          isMarketDepthActive={isMarketDepthActive}
          isMarketGraphsActive={!isMarketDepthActive}
          pnlAndWhatIf={{
            pnl: runner.pnl,
            rawPnl: runner.rawPnl,
            whatIf: runner.whatIf,
            rawWhatIf: runner.rawWhatIf,
          }}
          onClick={onMarketGraphButtonTap}
        >
          <div className={betButtonsClassName}>
            <ConnectedExchangeBetButtons
              component={ExchangeBetButtons}
              cardURN={cardURN}
              marketURN={marketURN}
              runnerURN={runner.urn}
              displayBestOdds={!isMarketDepthActive}
            />
          </div>
        </Runner>
      )}
      {isBetslipOpen && betslip}
    </Fragment>
  );
};

export default withInlineBetslip(ExchangeMarketRunnerComponent);
