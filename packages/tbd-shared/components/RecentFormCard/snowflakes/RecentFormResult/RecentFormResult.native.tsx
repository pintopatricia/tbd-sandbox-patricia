import { FunctionComponent } from "react";
import { View } from "react-native";
import { RecentFormCaptionContentType } from "@ppb/the-wall-common/types";
import { RecentFormIcon } from "@ppb/the-wall-native/components/RecentForm/RecentFormIcon/RecentFormIcon";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Text } from "@ppb/the-wall-native";
import {
  RECENT_FORM_SCORE,
  RECENT_FORM_EXTRA_TIME,
  RECENT_FORM_SCORE_PENALTIES,
  RECENT_FORM_PENALTIES,
  RECENT_FORM_OPPONENT,
  RECENT_FORM_COMPETITION,
  RECENT_FORM_DATE,
} from "./RecentFormResult.native.selectors";
import { leftStyleSheet, rightStyleSheet } from "./RecentFormResult.native.styles";
import { RecentFormResultAlignment, RecentFormResultProps } from "./RecentFormResult.types";

const RecentFormResultStyleSheet = {
  [RecentFormResultAlignment.RIGHT]: rightStyleSheet,
  [RecentFormResultAlignment.LEFT]: leftStyleSheet,
};

export const RecentFormResult: FunctionComponent<RecentFormResultProps> = ({
  score,
  isExtraTimeScore,
  penaltyScore,
  opponent,
  competition,
  date,
  side,
  outcome,
  alignment,
  translations,
}) => {
  const styles = RecentFormResultStyleSheet[alignment];

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <RecentFormIcon outcome={outcome} label={translations[outcome]} />
      </View>
      <View style={styles.recentFormContainer}>
        {!!score && (
          <View style={styles.scoreContainer}>
            <Text {...getTestProps(RECENT_FORM_SCORE)} style={styles.mainText}>
              {score.home} - {score.away}
            </Text>
            {!!isExtraTimeScore && (
              <Text {...getTestProps(RECENT_FORM_EXTRA_TIME)} style={styles.extraTime}>
                {translations[RecentFormCaptionContentType.AET]}
              </Text>
            )}
          </View>
        )}
        {!!penaltyScore && (
          <View style={styles.container}>
            <Text {...getTestProps(RECENT_FORM_SCORE_PENALTIES)} style={styles.penaltiesScore}>
              {penaltyScore.home} - {penaltyScore.away}
            </Text>
            <Text {...getTestProps(RECENT_FORM_PENALTIES)} style={styles.secondaryText}>
              {translations[RecentFormCaptionContentType.PEN]}
            </Text>
          </View>
        )}
        <Text {...getTestProps(RECENT_FORM_OPPONENT)} style={styles.recentFormOpponent}>
          {opponent} ({translations[side]})
        </Text>
        {!!competition && (
          <Text {...getTestProps(RECENT_FORM_COMPETITION)} style={styles.recentFormLabel}>
            {competition}
          </Text>
        )}
        <Text {...getTestProps(RECENT_FORM_DATE)} style={styles.recentFormLabel}>
          {date}
        </Text>
      </View>
    </View>
  );
};
