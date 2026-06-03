import { FC, useMemo } from "react";
import { View } from "react-native";
import { ShadowedView } from "react-native-fast-shadow";

import { Sport } from "@ppb/the-wall-common/types/VirtualSport.types";
import { VirtualSilk } from "@ppb/the-wall-common/icons/Virtuals/VirtualSilk";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Text } from "@ppb/the-wall-native";
import { VirtualRunnerProps } from "./VirtualRunner.types";
import {
  TEST_ID,
  VIRTUAL_RUNNER_DESCRIPTION,
  VIRTUAL_RUNNER_IMAGE,
  VIRTUAL_RUNNER_INFORMATION_CONTAINER,
  VIRTUAL_RUNNER_INNER_CONTAINTER,
  VIRTUAL_RUNNER_LINE_CONTAINER,
  VIRTUAL_RUNNER_NAME,
  VIRTUAL_RUNNER_NUMBER,
  VIRTUAL_RUNNER_SILK_CONTAINER,
} from "./VirtualRunner.native.selectors";
import styles from "./VirtualRunner.native.styles";

export const VirtualRunner: FC<VirtualRunnerProps> = ({
  children,
  number,
  name,
  sportId,
  showSilk,
  humanTexture,
  description,
}) => {
  const iconStyle = useMemo(
    () => [
      [Sport.HorsesFlat, Sport.HorsesJumps, Sport.HorsesSprint].includes(sportId) && styles.horseRacing,
      [Sport.Greyhounds, Sport.MotorRacing].includes(sportId) && styles.square,
      [Sport.WorldCup, Sport.ClubFootball].includes(sportId) && styles.football,
    ],
    [sportId],
  );

  return (
    <View {...getTestProps(TEST_ID, false)}>
      <View style={styles.virtualRunnerLine} {...getTestProps(VIRTUAL_RUNNER_LINE_CONTAINER, false)}>
        <View style={styles.virtualRunnerInnerContainer} {...getTestProps(VIRTUAL_RUNNER_INNER_CONTAINTER, false)}>
          {number && (
            <View style={styles.leftColumn}>
              <Text style={styles.virtualRunnerNumber} {...getTestProps(VIRTUAL_RUNNER_NUMBER, false)}>
                {number}
              </Text>
            </View>
          )}
          {showSilk && (
            <ShadowedView {...getTestProps(VIRTUAL_RUNNER_IMAGE, false)} style={styles.imageContainer}>
              {humanTexture ? (
                <View style={iconStyle} {...getTestProps(VIRTUAL_RUNNER_SILK_CONTAINER, false)}>
                  <VirtualSilk sportId={sportId} humanTexture={humanTexture} />
                </View>
              ) : (
                <View style={iconStyle} {...getTestProps("virtual-runner-space", false)} />
              )}
            </ShadowedView>
          )}
          <View style={styles.informationContainer} {...getTestProps(VIRTUAL_RUNNER_INFORMATION_CONTAINER, false)}>
            <Text {...getTestProps(VIRTUAL_RUNNER_NAME, false)} style={styles.name}>
              {name}
            </Text>
            {description && (
              <Text style={styles.description} {...getTestProps(VIRTUAL_RUNNER_DESCRIPTION, false)}>
                {description}
              </Text>
            )}
          </View>
        </View>
        {children}
      </View>
    </View>
  );
};
