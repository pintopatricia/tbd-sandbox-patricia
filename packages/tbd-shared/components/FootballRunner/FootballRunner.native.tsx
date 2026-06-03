import React from "react";
import { View } from "react-native";
import { Text } from "@ppb/the-wall-native";
import styles from "./FootballRunner.styles";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { AssetsIconName } from "@ppb/the-wall-icons";
import { i18n } from "../../helpers/i18n";
import { TranslationKey } from "../../translations/keys";
import { ImageWithFallback } from "../ImageWithFallback/ImageWithFallback.native";
import { FootballRunnerProps } from "./props";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

const FootballRunner: React.FC<FootballRunnerProps> = ({
  runnerName,
  statValue,
  statValueInterpolation,
  statLabel,
  rightColumn,
  jersey,
  useFallbackJersey,
  shouldRenderJerseySpace,
}) => {
  const hasJersey: boolean = !!jersey || !!useFallbackJersey;

  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        {(hasJersey || shouldRenderJerseySpace) && (
          <View style={styles.jerseyContainer} {...getTestProps("jersey-container", false)}>
            {jersey && (
              <ImageWithFallback
                url={jersey}
                alt={`${runnerName} jersey`}
                fallbackIconName={AssetsIconName.FALLBACK_JERSEY}
                style={styles.jerseyImage}
              />
            )}
            {useFallbackJersey && <GenericIcon name={AssetsIconName.FALLBACK_JERSEY} />}
          </View>
        )}

        <View>
          <View>
            <Text style={styles.runnerName}>{runnerName}</Text>
          </View>
          {statValue && (
            <View style={styles.runnerStats}>
              <Text style={styles.statName}>
                {i18n({ key: (statLabel ?? "I18N.IN_LINE_STATS_PER_MATCH_AVG") as keyof TranslationKey })}
              </Text>
              <Text style={styles.statValue}>
                {statValueInterpolation
                  ? i18n({ key: statValue as keyof TranslationKey, interpolationValues: statValueInterpolation })
                  : statValue}
              </Text>
            </View>
          )}
        </View>
      </View>
      {rightColumn && <View style={styles.rightColumn}>{rightColumn}</View>}
    </View>
  );
};

export default FootballRunner;
