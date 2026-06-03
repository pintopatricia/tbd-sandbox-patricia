import { FunctionComponent } from "react";
import { View } from "react-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName, OthersIconName } from "@ppb/the-wall-icons";
import { colors } from "@ppb/the-wall-common/base-theme";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import DefaultHorseSilk from "@ppb/the-wall-native/assets/images/default_silk.svg";
import { TBDImage } from "@ppb/the-wall-native/components/TBDImage/TBDImage";
import { Text } from "@ppb/the-wall-native";
import {
  RACING_RESULTS,
  RACING_RESULTS_TITLE,
  RACING_RESULTS_TABLE_HEADERS,
  RACING_RESULTS_TABLE_ROW,
  RACING_RESULTS_POSITION,
  RACING_RESULTS_DISTANCE,
  RACING_RESULTS_RUNNER,
  RACING_RESULTS_HORSE_NAME,
  RACING_RESULTS_STARTING_PRICE,
  RACING_RESULTS_NUMBER_OF_RAN_RUNNERS,
  RACING_RESULTS_SILK,
  RACING_RESULTS_RUNNER_SILK,
  RACING_RESULTS_RUNNER_SILK_DEFAULT,
  RACING_RESULTS_DRAW_NUMBER,
  RACING_RESULTS_JOCKEY_NAME,
  RACING_RESULTS_TRAINER_NAME,
  RACING_RESULTS_SADDLE_CLOTH,
  RACING_RESULTS_WINNER_RIBBON,
  RACING_RESULTS_DNFS_BOARD,
  RACING_RESULTS_DNFS_INFO,
  RACING_RESULTS_DNF_ITEM,
  RACING_RESULTS_DNF_CODE,
  RACING_RESULTS_DNF_VALUE,
  RACING_RESULTS_FAV,
} from "./RacingResults.native.selectors";
import styles from "./RacingResults.native.styles";
import { RacingResultsProps } from "./RacingResults.types";

export const RacingResults: FunctionComponent<RacingResultsProps> = ({
  title,
  labels,
  runners,
  ranNumber,
  dnfCodes,
}) => {
  const racingResultHeaders = [
    labels.positionLabel,
    labels.distanceLabel,
    labels.horseLabel,
    labels.startingPriceLabel,
  ];

  return (
    <View {...getTestProps(RACING_RESULTS, false)}>
      <Text numberOfLines={2} {...getTestProps(RACING_RESULTS_TITLE, false)} style={styles.title}>
        {title}
      </Text>
      {!!ranNumber && (
        <View style={styles.tableInfo}>
          <View style={styles.infoIcon}>
            <GenericIcon name={SystemIconName.NOTIFICATION_INFO} color={colors.ActionTertiaryIconDefault} />
          </View>
          <Text {...getTestProps(RACING_RESULTS_NUMBER_OF_RAN_RUNNERS)} style={styles.ranLabel}>
            {`${labels.ranLabel}: ${ranNumber}`}
          </Text>
        </View>
      )}
      <View style={styles.racingResultHeaders}>
        {racingResultHeaders.map((header, index) => (
          <View
            key={`${header}-${index}`}
            style={(index === 0 && styles.positionCell) || (index < 2 ? styles.staticCell : styles.cell)}
          >
            <Text
              numberOfLines={1}
              {...getTestProps(RACING_RESULTS_TABLE_HEADERS)}
              style={[styles.headerText, index === racingResultHeaders.length - 1 && styles.lastCell]}
            >
              {header}
            </Text>
          </View>
        ))}
      </View>
      <View>
        {runners.length > 0 &&
          runners.map(
            (
              {
                position,
                positionStatusCode,
                distance,
                horseName,
                jockeyName,
                trainerName,
                saddleCloth,
                draw,
                silk,
                startingPrice,
                hasPerformance,
                isNonRunner,
                favouriteLabel,
              },
              index,
            ) => {
              if (hasPerformance || isNonRunner) {
                return (
                  <View {...getTestProps(RACING_RESULTS_TABLE_ROW, false)} key={`racing-result-${index}`}>
                    <View style={styles.racingResultRow}>
                      <View style={styles.positionCell}>
                        <View style={styles.positionBox}>
                          <Text
                            {...getTestProps(RACING_RESULTS_POSITION)}
                            numberOfLines={1}
                            style={styles.positionLabel}
                          >
                            {position || positionStatusCode || "-"}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.staticCell}>
                        {position === 1 ? (
                          <View {...getTestProps(RACING_RESULTS_WINNER_RIBBON)} style={styles.winnerRibbonContainer}>
                            <GenericIcon name={OthersIconName.WINNER_RIBBON} color={colors.NeutralsIconDefault} />
                          </View>
                        ) : (
                          <Text
                            {...getTestProps(RACING_RESULTS_DISTANCE)}
                            numberOfLines={1}
                            style={styles.distanceLabel}
                          >
                            {distance || "-"}
                          </Text>
                        )}
                      </View>
                      <View
                        {...getTestProps(RACING_RESULTS_RUNNER, false)}
                        style={[styles.runnerInfoCell, styles.runnerInfoContainer]}
                      >
                        {silk ? (
                          <View style={styles.silkContainer}>
                            <TBDImage
                              {...getTestProps(RACING_RESULTS_RUNNER_SILK, false)}
                              source={silk}
                              style={styles.silk}
                              fallbackTestID={RACING_RESULTS_RUNNER_SILK_DEFAULT}
                              fallbackSource={DefaultHorseSilk}
                            />
                          </View>
                        ) : (
                          <View {...getTestProps(RACING_RESULTS_SILK)} style={styles.silkContainer}></View>
                        )}
                        <View style={styles.runnerLine}>
                          <View style={styles.leftColumn}>
                            {!!saddleCloth && (
                              <Text {...getTestProps(RACING_RESULTS_SADDLE_CLOTH)} style={styles.saddleCloth}>
                                {saddleCloth}
                              </Text>
                            )}
                            {typeof draw === "number" && (
                              <Text {...getTestProps(RACING_RESULTS_DRAW_NUMBER)} style={styles.drawNumber}>
                                ({draw})
                              </Text>
                            )}
                          </View>
                          <View style={{ flexGrow: 1 }}>
                            <Text
                              {...getTestProps(RACING_RESULTS_HORSE_NAME)}
                              numberOfLines={1}
                              style={styles.horseInformation}
                            >
                              {horseName}
                            </Text>
                            {!!jockeyName && (
                              <Text
                                {...getTestProps(RACING_RESULTS_JOCKEY_NAME)}
                                numberOfLines={1}
                                style={styles.runnerInfoInline}
                              >{`J: ${jockeyName}`}</Text>
                            )}
                            {!!trainerName && (
                              <Text
                                {...getTestProps(RACING_RESULTS_TRAINER_NAME)}
                                numberOfLines={1}
                                style={styles.runnerInfoInline}
                              >{`T: ${trainerName}`}</Text>
                            )}
                          </View>
                        </View>
                      </View>
                      <View>
                        <Text
                          {...getTestProps(RACING_RESULTS_STARTING_PRICE)}
                          numberOfLines={1}
                          style={styles.startingPriceLabel}
                        >
                          {startingPrice}
                        </Text>
                        {!!favouriteLabel && (
                          <Text {...getTestProps(RACING_RESULTS_FAV)} style={styles.favLabel}>
                            {favouriteLabel}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                );
              }
              return null;
            },
          )}
      </View>
      {!!dnfCodes && (
        <View style={styles.dnfsBoard} {...getTestProps(RACING_RESULTS_DNFS_BOARD, false)}>
          <View style={styles.dnfInfoIcon}>
            <GenericIcon name={SystemIconName.NOTIFICATION_INFO} color={colors.ActionTertiaryIconDefault} />
          </View>
          <View style={styles.dnfCodesContainer} {...getTestProps(RACING_RESULTS_DNFS_INFO, false)}>
            {Object.entries(dnfCodes).map(([dnfCode, translation], index) => (
              <View
                key={`${dnfCode}-${index}`}
                style={styles.dnfItem}
                {...getTestProps(RACING_RESULTS_DNF_ITEM, false)}
              >
                <Text style={styles.dnfCode} {...getTestProps(RACING_RESULTS_DNF_CODE, false)}>
                  {dnfCode}:
                </Text>
                <Text style={styles.dnfValue} {...getTestProps(RACING_RESULTS_DNF_VALUE, false)}>
                  {translation}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};
