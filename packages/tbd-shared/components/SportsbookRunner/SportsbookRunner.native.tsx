import { FunctionComponent, useCallback, useMemo, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { HorseRacingRunner, NonRunner, RacingRunner, Runner, TrapWrapper } from "@ppb/the-wall-native";
import { navigate } from "@ppb/tbd-router/native";
import styles from "./SportsbookRunner.native.styles";
import ConnectedSportsbookBetButton from "../SportsbookBetButton";
import SportsbookBetButton from "../SportsbookBetButton/SportsbookBetButton.native";
import { ComponentProps } from "./props";
import ConnectedPriceHistory from "../PriceHistory";
import PriceHistory from "../PriceHistory/PriceHistory.native";
import { resolveTrapIconVM } from "../../helpers/greyhound-trap-icon-helper";
import FootballRunner from "../FootballRunner/FootballRunner.native";

const buttonStyles = (i: number, last: number): StyleProp<ViewStyle>[] => [
  i === 0 && styles.topRadius,
  last - 1 === i && styles.bottomRadius,
  styles.overflownHidden,
];

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
        <View style={styles.nonRunner}>
          <NonRunner title={nonRunnerTitle} marketStatus={marketStatus} />
        </View>
      ) : (
        <View style={styles.buttonAndPriceHistoryContainer}>
          <View style={[styles.button, styles.hrSbkButton]}>
            <ConnectedSportsbookBetButton
              marketUrn={marketUrn}
              runnerUrn={runner.urn}
              component={SportsbookBetButton}
              cardUrn={cardUrn}
              onPotentialBetChange={onPotentialBetChange}
              tall
            />
          </View>
          {!isOddsboostMarketType && (
            <View style={styles.priceHistoryContainer}>
              <ConnectedPriceHistory runnerUrn={runner.urn} isMarketInplay={isMarketInplay} component={PriceHistory} />
            </View>
          )}
        </View>
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
  eventViewLink,
  runnerIdx,
  numberOfRunners,
  isRunnerExpandable,
  horseRacingRunneri18nLabels,
  isOddsboostMarketType,
  horsePastPerformances,
  hasDefaultSilk,
  showTrapIcon,
  dispatchFetchCatalogue,
  dispatchToggleRunnerInfo,
  dispatchExpandRunnerData,
  dispatchToggleRecentRaces,
  dispatchNavigateToView,
  dispatchToggleRaceReplays,
  dispatchRaceReplaysMediaPlayerLoaded,
}) => {
  const displayRunnerView = useCallback(() => {
    const { viewUrn } = runnerViewLink || {};

    if (viewUrn) {
      dispatchToggleRunnerInfo(marketName, runner.name, true);
      dispatchFetchCatalogue(viewUrn);
      navigate({ viewUrn });
    }
  }, [dispatchFetchCatalogue, dispatchToggleRunnerInfo, runnerViewLink, marketName, runner]);

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
        navigate(eventViewLink);
      } else {
        displayRunnerView();
      }
    },
    [
      dispatchExpandRunnerData,
      dispatchToggleRunnerInfo,
      displayRunnerView,
      eventViewLink,
      isRaceMarket,
      isRunnerExpandable,
      marketName,
      runner,
      cardUrn,
      dispatchNavigateToView,
    ],
  );

  const onSimpleRunnerClick = useCallback(() => {
    if (isRaceMarket && eventViewLink) {
      dispatchNavigateToView(eventViewLink.viewUrl, cardUrn, runner.name);
      navigate(eventViewLink);
    } else {
      displayRunnerView();
    }
  }, [runner, eventViewLink, isRaceMarket, cardUrn, dispatchNavigateToView, displayRunnerView]);

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

  if (isRaceMarket) {
    return (
      <View style={styles.hrRunnerMargin}>
        <RaceRunner
          marketStatus={marketStatus}
          horseRacingRunneri18nLabels={horseRacingRunneri18nLabels}
          isOddsboostMarketType={isOddsboostMarketType}
          runner={runner}
          marketName={marketName}
          marketUrn={marketUrn}
          cardUrn={cardUrn}
          runnerViewLink={runnerViewLink}
          hasDefaultSilk={hasDefaultSilk}
          showTrapIcon={showTrapIcon}
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
      </View>
    );
  } else if (hasJerseys || hasStats) {
    return (
      <FootballRunner
        runnerName={runner.name}
        jersey={runner.jersey}
        useFallbackJersey={runner.useFallbackJersey}
        statValue={runner.statValue}
        statValueInterpolation={runner.statValueInterpolation}
        statLabel={runner.statLabel}
        shouldRenderJerseySpace={hasJerseys}
        rightColumn={
          <View style={[styles.button, buttonStyles(runnerIdx as number, numberOfRunners as number)]}>
            <ConnectedSportsbookBetButton
              marketUrn={marketUrn}
              runnerUrn={runner.urn}
              component={SportsbookBetButton}
              cardUrn={cardUrn}
              rounded={false}
              tall
            />
          </View>
        }
      />
    );
  } else {
    return (
      <View>
        <Runner name={runner.name} onClick={displayRunnerView}>
          <View style={[styles.button, buttonStyles(runnerIdx as number, numberOfRunners as number)]}>
            <ConnectedSportsbookBetButton
              marketUrn={marketUrn}
              runnerUrn={runner.urn}
              component={SportsbookBetButton}
              cardUrn={cardUrn}
              rounded={false}
              tall
            />
          </View>
        </Runner>
      </View>
    );
  }
};

export default SportsbookRunner;
