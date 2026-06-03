import { FunctionComponent, useEffect } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Alert } from "@ppb/the-wall-native/components/Alert/Alert";
import { navigate } from "@ppb/tbd-router";
import { codecs } from "@ppb/tbd-urn-codecs";
import { OrderTypeFilterItem } from "@ppb/tbd-store/state/layout/cards/MyBets.types";
import { Text } from "@ppb/the-wall-native";
import { ComponentProps } from "./props";
import {
  RACE_RESULTS_CARD,
  WINNING_TIME_AND_BSP_ADVANTAGE_LABEL,
  WINNING_TIME_LABEL,
  WINNING_TIME,
  BSP_ADVANTAGE_LABEL,
  BSP_ADVANTAGE,
  STATUS_ALERT,
} from "./RaceResultsCard.native.selectors";
import styles from "./RaceResultsCard.native.styles";
import { RacingResults } from "./snowflakes/RacingResults/RacingResults.native";

const RaceResultsCard: FunctionComponent<ComponentProps> = ({
  title,
  resultType,
  labels,
  resultLabels,
  runners,
  ranNumber,
  raceUrn,
  winningTime,
  bspAdvantage,
  dispatchSubscribeRaceUpdates,
  dispatchUnsubscribeRaceUpdates,
  dnfCodes,
  statusAlert,
}) => {
  useEffect(() => {
    dispatchSubscribeRaceUpdates(raceUrn);

    return () => {
      dispatchUnsubscribeRaceUpdates(raceUrn);
    };
  }, [dispatchSubscribeRaceUpdates, dispatchUnsubscribeRaceUpdates, raceUrn]);

  return (
    <View {...getTestProps(RACE_RESULTS_CARD, false)} style={styles.cardContainer}>
      {statusAlert && (
        <Alert
          onUrlClick={() => {
            navigate({
              viewUrn: codecs.myBetsView.encode(OrderTypeFilterItem.Settled).uid,
            });
          }}
          {...getTestProps(STATUS_ALERT)}
          {...statusAlert}
          url={"-"}
        />
      )}
      {!!resultType && (
        <RacingResults title={title} labels={labels} runners={runners} ranNumber={ranNumber} dnfCodes={dnfCodes} />
      )}
      {!!(winningTime || bspAdvantage) && (
        <>
          <Text {...getTestProps(WINNING_TIME_AND_BSP_ADVANTAGE_LABEL)} style={styles.winningAndBspTitle}>
            {resultLabels.winningAndBspAdvantageLabel}
          </Text>
          {!!winningTime && (
            <View style={styles.infoWrapper}>
              <Text {...getTestProps(WINNING_TIME_LABEL)} style={styles.winningTimeLabel}>
                {resultLabels.winningTimeLabel}
              </Text>
              <Text {...getTestProps(WINNING_TIME)} style={styles.winningTime}>
                {winningTime || "-"}
              </Text>
            </View>
          )}
          {!!bspAdvantage && (
            <View style={styles.infoWrapper}>
              <Text {...getTestProps(BSP_ADVANTAGE_LABEL)} style={styles.bspAdvantageLabel}>
                {resultLabels.bspAdvantageLabel}
              </Text>
              <Text {...getTestProps(BSP_ADVANTAGE)} style={styles.bspAdvantage}>
                {bspAdvantage || "-"}
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default RaceResultsCard;
