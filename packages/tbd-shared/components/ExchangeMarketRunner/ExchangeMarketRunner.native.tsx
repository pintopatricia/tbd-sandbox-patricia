import { Fragment, FunctionComponent, useCallback, useState } from "react";
import { View } from "react-native";

import { ExchangeRunnerStatus } from "@ppb/tbd-store/state/constants";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { HorseRacingRunner } from "@ppb/the-wall-native/components/Runner/HorseRacingRunner/HorseRacingRunner";
import { Runner } from "@ppb/the-wall-native/components/Runner/Runner";
import { NonRunner } from "@ppb/the-wall-native/components/NonRunner/NonRunner";
import { navigate } from "@ppb/tbd-router/native";

import ConnectedExchangeBetButtons from "../ExchangeBetButtons";
import ExchangeBetButtons from "../ExchangeBetButtons/ExchangeBetButtons.native";
import { withInlineBetslip } from "../Betslip/withInlineBetslip/withInlineBetslip.native";
import { EXCHANGE_MARKET_RUNNER } from "./ExchangeMarketRunner.native.selectors";
import styles from "./ExchangeMarketRunner.native.styles";
import { ComponentProps } from "./props";
import type {
  ExchangeMarketRunner,
  ExchangeRaceMarketRunner,
} from "../ExchangeMarket/snowflakes/ExchangeMarket/ExchangeMarket.types";

const isRaceRunner = (isRace: boolean, excRunner: ExchangeMarketRunner): excRunner is ExchangeRaceMarketRunner =>
  isRace && !!excRunner;

const ExchangeMarketRunnerComponent: FunctionComponent<ComponentProps> = ({
  cardURN,
  marketURN,
  marketName,
  marketStatus,
  runner,
  runnerIdx = 0,
  runnersLength = 0,
  isRaceMarket,
  i18nLabels,
  isMarketDepthActive,
  isRunnerExpandable,
  hasDefaultSilk,
  eventViewLink,
  renderBetslip,
  horseRacingRunneri18nLabels,
  onMarketGraphButtonTap,
  dispatchExpandRunnerData,
  dispatchToggleRunnerInfo,
  dispatchToggleRecentRaces,
  dispatchToggleRaceReplays,
  dispatchRaceReplaysMediaPlayerLoaded,
}) => {
  "use no memo";

  const betslip = renderBetslip ? renderBetslip(runner.urn) : null;
  const isBetslipOpen = betslip !== null;

  const buttonsContainerStyles = [
    styles.buttonContainer,
    runnerIdx === 0 && styles.topCap,
    runnerIdx === runnersLength - 1 && !isBetslipOpen && styles.bottomCap,
    styles.overflownHidden,
    isMarketDepthActive && styles.marketDepthButtonsContainer,
  ];

  const racingButtonsContainerStyles = [
    styles.buttonContainerRacingRunner,
    styles.overflownHidden,
    isMarketDepthActive && styles.marketDepthButtonsContainerRacingRunner,
  ];

  const fullBorderRadiusStyles = !isMarketDepthActive ? styles.buttonColumnContainer : null;

  const betButtonsSpacingStyles = !isMarketDepthActive ? styles.spacingDiv : null;

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
        navigate(eventViewLink);
      }
    },
    [
      dispatchExpandRunnerData,
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
    <Fragment key={runner.urn}>
      <View
        {...getTestProps(EXCHANGE_MARKET_RUNNER, false)}
        style={[styles.runnerMargin, isRaceMarket ? styles.horseRacingRunnersList : null]}
      >
        {isRaceRunner(isRaceMarket, runner) ? (
          <HorseRacingRunner
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
            hasGraphsLink
            hasDefaultSilk={hasDefaultSilk}
            onMarketGraphsButtonClick={onMarketGraphButtonTap}
            onRunnerClick={onRunnerClick}
            onRecentRaceClick={onRecentRaceClick}
            horsePastPerformances={runner.horsePastPerformances}
            isPotentialBet={isPotentialBet}
            i18nLabels={horseRacingRunneri18nLabels}
            onRaceReplaysClick={onRaceReplaysClick}
            onRaceReplaysLoaded={onRaceReplaysLoaded}
            rightColumn={
              runner.status === ExchangeRunnerStatus.REMOVED ? (
                <View style={styles.nonRunner}>
                  <NonRunner
                    title={i18nLabels.nonRunnerTitle}
                    reduction={runner.reduction}
                    date={runner.date}
                    marketStatus={marketStatus}
                  />
                </View>
              ) : (
                <View style={fullBorderRadiusStyles}>
                  <View style={racingButtonsContainerStyles}>
                    <ConnectedExchangeBetButtons
                      component={ExchangeBetButtons}
                      cardURN={cardURN}
                      marketURN={marketURN}
                      runnerURN={runner.urn}
                      displayBestOdds={!isMarketDepthActive}
                      onBetButtonClick={onBetButtonClick}
                    />
                  </View>
                  <View style={betButtonsSpacingStyles}></View>
                </View>
              )
            }
          />
        ) : (
          <Runner
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
            <View style={buttonsContainerStyles}>
              <ConnectedExchangeBetButtons
                component={ExchangeBetButtons}
                cardURN={cardURN}
                marketURN={marketURN}
                runnerURN={runner.urn}
                displayBestOdds={!isMarketDepthActive}
              />
            </View>
          </Runner>
        )}
      </View>
      {isBetslipOpen && betslip}
    </Fragment>
  );
};

export default withInlineBetslip(ExchangeMarketRunnerComponent);
