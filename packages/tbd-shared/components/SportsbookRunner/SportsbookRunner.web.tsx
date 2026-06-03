import { FullScreenModal, HorseRacingRunner, NonRunner, RacingRunner, Runner, TrapWrapper } from "@ppb/the-wall-web";
import classnames from "classnames";
import { lazy, FunctionComponent, Suspense, useCallback, useMemo, useState } from "react";
import ConnectedGenericView from "../GenericView";
import { GenericView, GenericViewPlaceholder } from "../GenericView/GenericView.web";
import styles from "./SportsbookRunner.web.css";
import { ComponentProps } from "./props";

import { resolveTrapIconVM } from "../../helpers/greyhound-trap-icon-helper";
import ConnectedSportsbookBetButton from "../SportsbookBetButton";
import SportsbookBetButton from "../SportsbookBetButton/SportsbookBetButton.web";
import FootballRunner from "../FootballRunner/FootballRunner.web";

const ConnectedPriceHistory = lazy(() => import(/* webpackChunkName: "PriceHistory" */ "../PriceHistory"));

const PriceHistory = lazy(() => import(/* webpackChunkName: "PriceHistory" */ "../PriceHistory/PriceHistory.web"));

type EnhancedRaceRunnerProps = {
  onPotentialBetChange: (isPotentialBetVal: boolean, isBetSlipCollapsed: boolean) => void;
  onRunnerClick: (expanded: boolean) => void;
  onSimpleRunnerClick: () => void;
  onRecentRaceClick: (expanded: boolean) => void;
  onRaceReplaysClick: (isClosed: boolean) => void;
  onRaceReplaysLoaded: () => void;
  isPotentialBet: boolean;
};
type RaceRunnerProps = Pick<
  ComponentProps,
  | "marketName"
  | "marketStatus"
  | "isMarketInplay"
  | "marketUrn"
  | "isOddsboostMarketType"
  | "runner"
  | "cardUrn"
  | "nonRunnerTitle"
  | "runnerViewLink"
  | "hasDefaultSilk"
  | "isRunnerExpandable"
  | "horsePastPerformances"
  | "horseRacingRunneri18nLabels"
  | "showTrapIcon"
> &
  EnhancedRaceRunnerProps;

const RaceRunner: FunctionComponent<RaceRunnerProps> = ({
  marketUrn,
  isMarketInplay,
  isOddsboostMarketType,
  marketStatus,
  cardUrn,
  runner,
  nonRunnerTitle,
  runnerViewLink,
  isRunnerExpandable,
  hasDefaultSilk,
  horsePastPerformances,
  horseRacingRunneri18nLabels,
  isPotentialBet,
  showTrapIcon,
  onRaceReplaysClick,
  onPotentialBetChange,
  onRaceReplaysLoaded,
  onRecentRaceClick,
  onRunnerClick,
  onSimpleRunnerClick,
}) => {
  const { raceRunnerDetails } = runner;

  const children = useMemo(
    () =>
      runner.status === "REMOVED" ? (
        <div className={styles.nonRunnerContainer}>
          <NonRunner title={nonRunnerTitle} marketStatus={marketStatus} />
        </div>
      ) : (
        <div className={classnames(styles.runner, styles.horseRacingRunner)}>
          <div className={styles.buttonAndPriceHistoryContainer}>
            <div className={styles.sportsbookButtonsContainer}>
              <ConnectedSportsbookBetButton
                marketUrn={marketUrn}
                runnerUrn={runner.urn}
                component={SportsbookBetButton}
                cardUrn={cardUrn}
                onPotentialBetChange={onPotentialBetChange}
                rounded={false}
                tall
              />
            </div>
            {!isOddsboostMarketType && (
              <div className={styles.priceHistoryContainer}>
                <Suspense fallback={<></>}>
                  <ConnectedPriceHistory
                    runnerUrn={runner.urn}
                    isMarketInplay={isMarketInplay}
                    component={PriceHistory}
                  />
                </Suspense>
              </div>
            )}
          </div>
        </div>
      ),
    [
      cardUrn,
      isMarketInplay,
      isOddsboostMarketType,
      marketStatus,
      marketUrn,
      nonRunnerTitle,
      onPotentialBetChange,
      runner.status,
      runner.urn,
    ],
  );
  const IconComponent = useMemo(() => {
    if (raceRunnerDetails?.type === "GREYHOUND" && showTrapIcon) {
      const trapVm = resolveTrapIconVM(
        raceRunnerDetails?.raceRunner?.meetingCountry,
        raceRunnerDetails?.raceRunner?.trap,
        "medium",
      );

      return <TrapWrapper {...trapVm} />;
    }

    return undefined;
  }, [raceRunnerDetails, showTrapIcon]);

  if (raceRunnerDetails?.type === "HORSE")
    return (
      <HorseRacingRunner
        className={styles.runner}
        horseName={runner.name}
        saddleCloth={raceRunnerDetails?.raceRunner?.details.saddleCloth || ""}
        drawNumber={raceRunnerDetails?.raceRunner?.details.draw}
        jockeyName={raceRunnerDetails?.raceRunner?.details.jockeyName}
        trainerName={raceRunnerDetails?.raceRunner?.details.trainerName}
        silkUrl={raceRunnerDetails?.raceRunner?.details.silk}
        form={raceRunnerDetails?.raceRunner?.form}
        apprenticeClaim={raceRunnerDetails?.raceRunner?.apprenticeClaim}
        crsDisWinFavText={raceRunnerDetails?.raceRunner?.crsDisWinFavText}
        weight={raceRunnerDetails?.raceRunner?.details.weight?.stones}
        rating={raceRunnerDetails?.raceRunner?.rating}
        comments={raceRunnerDetails?.raceRunner?.comments}
        equipment={raceRunnerDetails?.raceRunner?.details.equipmentDescription}
        horseAge={raceRunnerDetails?.raceRunner?.horse.age}
        horseDamName={raceRunnerDetails?.raceRunner?.horse.damName}
        horseSireName={raceRunnerDetails?.raceRunner?.horse.sireName}
        horseBred={raceRunnerDetails?.raceRunner?.horse.bred}
        showChevron={!!isRunnerExpandable && !!raceRunnerDetails?.raceRunner?.horse.age}
        hasGraphsLink={!!runnerViewLink}
        hasDefaultSilk={hasDefaultSilk}
        onRunnerClick={onRunnerClick}
        onRecentRaceClick={onRecentRaceClick}
        horsePastPerformances={horsePastPerformances}
        isPotentialBet={isPotentialBet}
        i18nLabels={horseRacingRunneri18nLabels}
        onRaceReplaysClick={onRaceReplaysClick}
        onRaceReplaysLoaded={onRaceReplaysLoaded}
        rightColumn={children}
      />
    );

  if (raceRunnerDetails?.type === "GREYHOUND") {
    return (
      <RacingRunner
        title={runner.name}
        leftColumn={IconComponent}
        onClick={onSimpleRunnerClick}
        rightColumn={children}
      />
    );
  }
  return <></>;
};

const SportsbookRunner: FunctionComponent<ComponentProps> = ({
  cardUrn,
  marketUrn,
  runner,
  hasJerseys,
  hasStats,
  marketName,
  marketStatus,
  isRaceMarket,
  isMarketInplay,
  nonRunnerTitle,
  runnerViewLink,
  runnerViewTitle,
  eventViewLink,
  isRunnerExpandable,
  horsePastPerformances,
  horseRacingRunneri18nLabels,
  isOddsboostMarketType,
  hasDefaultSilk,
  showTrapIcon,
  dispatchFetchCatalogue,
  dispatchDeleteView,
  dispatchToggleRunnerInfo,
  dispatchExpandRunnerData,
  dispatchPushAction,
  dispatchToggleRecentRaces,
  dispatchNavigateToView,
  dispatchToggleRaceReplays,
  dispatchRaceReplaysMediaPlayerLoaded,
}) => {
  const [runnerViewLinkUrn, setRunnerViewLinkUrn] = useState<string | null>(null);

  const displayRunnerView = useCallback(() => {
    const { viewUrn } = runnerViewLink || {};

    if (viewUrn) {
      dispatchToggleRunnerInfo(marketName, runner.name, true);
      dispatchFetchCatalogue(viewUrn);
      setRunnerViewLinkUrn(viewUrn);
    }
  }, [runnerViewLink, dispatchToggleRunnerInfo, marketName, runner, dispatchFetchCatalogue]);

  const onRunnerViewDismiss = useCallback(() => {
    dispatchToggleRunnerInfo(marketName, runner.name, false);
    if (runnerViewLink?.viewUrn) {
      dispatchDeleteView(runnerViewLink.viewUrn);
    }
    setRunnerViewLinkUrn(null);
  }, [dispatchDeleteView, dispatchToggleRunnerInfo, marketName, runner.name, runnerViewLink]);

  // expandRunnerData was only being applied to Horse racerunners. To prevent adding behaviour, we check by type here.
  // that's a TEMPORARY solution until we're sure that isRunnerExpandable is never configured to GREYHOUND Market Cards
  // or in the case that it is, to add the corresponding behaviour.
  const onRunnerClick = useCallback(
    (expanded: boolean) => {
      if (isRunnerExpandable) {
        if (runner.raceRunnerDetails?.type === "HORSE" && runner.raceRunnerDetails?.raceRunner?.urn && expanded) {
          dispatchExpandRunnerData([runner.raceRunnerDetails?.raceRunner?.urn]);
          // GTM open runner details
          dispatchToggleRunnerInfo(marketName, runner.name, true);
        }

        // GTM close runner details
        if (!expanded) {
          dispatchToggleRunnerInfo(marketName, runner.name, false);
        }
      } else if (isRaceMarket && eventViewLink) {
        dispatchNavigateToView(eventViewLink.viewUrl, cardUrn, runner.name);
        dispatchPushAction(eventViewLink);
      } else {
        displayRunnerView();
      }
    },
    [
      isRunnerExpandable,
      runner,
      eventViewLink,
      isRaceMarket,
      cardUrn,
      dispatchNavigateToView,
      dispatchExpandRunnerData,
      dispatchToggleRunnerInfo,
      dispatchPushAction,
      marketName,
      displayRunnerView,
    ],
  );

  const onSimpleRunnerClick = useCallback(() => {
    if (isRaceMarket && eventViewLink) {
      dispatchNavigateToView(eventViewLink.viewUrl, cardUrn, runner.name);
      dispatchPushAction(eventViewLink);
    } else {
      displayRunnerView();
    }
  }, [runner, eventViewLink, isRaceMarket, cardUrn, dispatchNavigateToView, dispatchPushAction, displayRunnerView]);

  const onRecentRaceClick = useCallback(
    (expanded: boolean) => {
      dispatchToggleRecentRaces(runner.name, cardUrn, expanded);
    },
    [dispatchToggleRecentRaces, runner.name, cardUrn],
  );

  const onRaceReplaysClick = useCallback(
    (isClosed: boolean) => {
      dispatchToggleRaceReplays(runner.name, isClosed, cardUrn);
    },
    [dispatchToggleRaceReplays, runner.name, cardUrn],
  );

  const onRaceReplaysLoaded = useCallback((): void => {
    dispatchRaceReplaysMediaPlayerLoaded(marketUrn);
  }, [dispatchRaceReplaysMediaPlayerLoaded, marketUrn]);

  const [isPotentialBet, setIsPotentialBet] = useState(false);
  const onPotentialBetChange = useCallback((isPotentialBetVal: boolean, isBetSlipCollapsed: boolean) => {
    setIsPotentialBet(isPotentialBetVal && !isBetSlipCollapsed);
  }, []);

  let runnerView = <></>;
  if (isRaceMarket) {
    runnerView = (
      <RaceRunner
        marketStatus={marketStatus}
        horseRacingRunneri18nLabels={horseRacingRunneri18nLabels}
        showTrapIcon={showTrapIcon}
        isOddsboostMarketType={isOddsboostMarketType}
        runner={runner}
        marketName={marketName}
        marketUrn={marketUrn}
        cardUrn={cardUrn}
        runnerViewLink={runnerViewLink}
        hasDefaultSilk={hasDefaultSilk}
        onRunnerClick={onRunnerClick}
        onSimpleRunnerClick={onSimpleRunnerClick}
        onRecentRaceClick={onRecentRaceClick}
        horsePastPerformances={horsePastPerformances}
        isPotentialBet={isPotentialBet}
        isMarketInplay={isMarketInplay}
        nonRunnerTitle={nonRunnerTitle}
        onRaceReplaysClick={onRaceReplaysClick}
        onRaceReplaysLoaded={onRaceReplaysLoaded}
        onPotentialBetChange={onPotentialBetChange}
        isRunnerExpandable={isRunnerExpandable}
      />
    );
  } else if (hasJerseys || hasStats) {
    runnerView = (
      <FootballRunner
        runnerName={runner.name}
        jersey={runner.jersey}
        useFallbackJersey={runner.useFallbackJersey}
        statValue={runner.statValue}
        statValueInterpolation={runner.statValueInterpolation}
        statLabel={runner.statLabel}
        shouldRenderJerseySpace={hasJerseys}
        rightColumn={
          <div className={styles.sportsbookButtonsContainer}>
            <ConnectedSportsbookBetButton
              runnerUrn={runner.urn}
              marketUrn={marketUrn}
              component={SportsbookBetButton}
              cardUrn={cardUrn}
              rounded={false}
              tall
            />
          </div>
        }
      />
    );
  } else {
    runnerView = (
      <Runner className={styles.runner} name={runner.name} onClick={displayRunnerView}>
        <div className={styles.sportsbookButtonsContainer}>
          <ConnectedSportsbookBetButton
            runnerUrn={runner.urn}
            marketUrn={marketUrn}
            component={SportsbookBetButton}
            cardUrn={cardUrn}
            rounded={false}
            tall
          />
        </div>
      </Runner>
    );
  }

  return (
    <>
      {runnerView}
      {runnerViewLinkUrn && (
        <FullScreenModal title={runnerViewTitle || ""} onDismiss={onRunnerViewDismiss}>
          {/*
 // @ts-expect-error TODO Universal integration with placeholders still break on ts-jest */}
          <ConnectedGenericView urn={runnerViewLinkUrn} component={GenericView} placeholder={GenericViewPlaceholder} />
        </FullScreenModal>
      )}
    </>
  );
};

export default SportsbookRunner;
