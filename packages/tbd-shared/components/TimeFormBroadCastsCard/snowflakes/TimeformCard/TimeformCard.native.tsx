import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { FunctionComponent } from "react";
import { View } from "react-native";
import { Text } from "@ppb/the-wall-native";
import { Stars } from "./snowflakes/Stars/Stars.native";
import {
  TIMEFORM_CARD,
  TIMEFORM_CARD_CONTENT,
  TIMEFORM_CARD_RUNNER_RATING,
  TIMEFORM_CARD_RUNNER_RATING_TEXT,
  TIMEFORM_CARD_VERDICT_LABEL,
  TIMEFORM_CARD_VERDICT_SECTION,
  TIMEFORM_CARD_VERDICT_TEXT,
} from "./TimeformCard.native.selectors";
import styles from "./TimeformCard.native.styles";
import { RunnerRatingProps, TimeformCardProps } from "./TimeformCard.types";

const MAX_STARS = 5;
const getRunnerRatingStyle = (isLast: boolean): Record<string, unknown>[] => [
  styles.runnerRating,
  isLast ? styles.noMarginBottom : {},
];

type RunnerRatingViewModel = RunnerRatingProps & { isLast: boolean };

const RunnerRating: FunctionComponent<RunnerRatingViewModel> = ({ index, isLast, runnerName, numStars }) => (
  <View style={getRunnerRatingStyle(isLast)} {...getTestProps(TIMEFORM_CARD_RUNNER_RATING, false)}>
    <Text
      {...getTestProps(TIMEFORM_CARD_RUNNER_RATING_TEXT, false)}
      numberOfLines={1}
      style={styles.runnerText}
    >{`${index}. ${runnerName}`}</Text>
    <Stars filled={numStars} outline={MAX_STARS - numStars} />
  </View>
);

export const TimeformCard: FunctionComponent<TimeformCardProps> = ({ runnerRatings, verdictLabel, verdict }) => (
  <View style={styles.timeformCard} {...getTestProps(TIMEFORM_CARD, false)}>
    <View style={styles.content} {...getTestProps(TIMEFORM_CARD_CONTENT, false)}>
      {runnerRatings.map(({ name, stars }, index) => (
        <RunnerRating
          key={name}
          index={index + 1}
          isLast={index + 1 === runnerRatings.length}
          runnerName={name}
          numStars={stars}
        />
      ))}
      {!!verdict && !!verdictLabel && (
        <View style={styles.verdictSection} {...getTestProps(TIMEFORM_CARD_VERDICT_SECTION, false)}>
          <Text style={styles.verdictLabel} {...getTestProps(TIMEFORM_CARD_VERDICT_LABEL, false)}>
            {verdictLabel}
          </Text>
          <Text style={styles.verdict} {...getTestProps(TIMEFORM_CARD_VERDICT_TEXT, false)}>
            {verdict}
          </Text>
        </View>
      )}
    </View>
  </View>
);
