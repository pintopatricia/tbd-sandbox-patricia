import type { JSX } from "react";
import { FunctionComponent } from "react";
import * as React from "react";
import { View } from "react-native";
import { RecentFormCaptionContentType } from "@ppb/the-wall-common/types";
import { RecentFormCaption } from "@ppb/the-wall-native/components/RecentForm/RecentFormCaption/RecentFormCaption";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import {
  RECENT_FORM_DETAILED,
  RECENT_FORM_DETAILED_HOME,
  RECENT_FORM_DETAILED_AWAY,
  RECENT_FORM_DETAILED_CAPTION,
  RECENT_FORM_DETAILED_RESULT_CONTAINER,
} from "./RecentFormDetailed.native.selectors";
import styles from "./RecentFormDetailed.native.styles";
import { RecentFormDetailedProps } from "./RecentFormDetailed.types";
import { RecentFormResult } from "../RecentFormResult/RecentFormResult.native";
import { RecentFormResultI18n, RecentFormResultProps } from "../RecentFormResult/RecentFormResult.types";

function captionDisplayExtraTime(
  relativeFixtureResult: [RecentFormResultProps[], RecentFormResultProps[]],
): RecentFormCaptionContentType[] {
  return relativeFixtureResult.some((element) => element.find((elementProps) => elementProps.isExtraTimeScore === true))
    ? [RecentFormCaptionContentType.AET]
    : [];
}

function captionDisplayPenalties(
  relativeFixtureResult: [RecentFormResultProps[], RecentFormResultProps[]],
): RecentFormCaptionContentType[] {
  return relativeFixtureResult.some((element) => element.find((elementProps) => elementProps.penaltyScore))
    ? [RecentFormCaptionContentType.PEN]
    : [];
}

function renderFormResult(fixtureResult: RecentFormResultProps, i18n: RecentFormResultI18n): React.ReactElement<any> {
  return (
    fixtureResult && (
      <RecentFormResult
        key={`${fixtureResult.opponent}-${fixtureResult.date}`}
        score={fixtureResult.score}
        opponent={fixtureResult.opponent}
        penaltyScore={fixtureResult.penaltyScore}
        isExtraTimeScore={fixtureResult.isExtraTimeScore}
        outcome={fixtureResult.outcome}
        date={fixtureResult.date}
        side={fixtureResult.side}
        alignment={fixtureResult.alignment}
        translations={i18n}
      />
    )
  );
}

function renderScores(
  relativeFixtureResult: [RecentFormResultProps[], RecentFormResultProps[]],
  i18n: RecentFormResultI18n,
): JSX.Element {
  const content: JSX.Element[] = [];
  const [homeFixtureResult, awayFixtureResult] = relativeFixtureResult;
  const numberOfFixtures = Math.max(homeFixtureResult.length, awayFixtureResult.length);
  for (let i = 0; i < numberOfFixtures; i += 1) {
    const innerContainerStyle = [
      i === 0 && styles.innerContainerFirst,
      i === numberOfFixtures - 1 && styles.innerContainerLast,
    ];

    content.push(
      <View {...getTestProps(RECENT_FORM_DETAILED_RESULT_CONTAINER, false)} key={i} style={styles.resultContainer}>
        <View {...getTestProps(RECENT_FORM_DETAILED_HOME, false)} style={[styles.homeContainer, innerContainerStyle]}>
          {renderFormResult(homeFixtureResult[i], i18n)}
        </View>
        <View {...getTestProps(RECENT_FORM_DETAILED_AWAY, false)} style={[styles.awayContainer, innerContainerStyle]}>
          {renderFormResult(awayFixtureResult[i], i18n)}
        </View>
      </View>,
    );
  }
  return <>{content}</>;
}

export const RecentFormDetailed: FunctionComponent<RecentFormDetailedProps> = ({ relativeFixtureResult, i18n }) => (
  <View {...getTestProps(RECENT_FORM_DETAILED, false)} style={styles.container}>
    <View style={styles.resultsContainer}>{renderScores(relativeFixtureResult, i18n.recentFormResultI18n)}</View>
    <View {...getTestProps(RECENT_FORM_DETAILED_CAPTION, false)} style={styles.caption}>
      <RecentFormCaption
        i18n={i18n.captionI18n}
        content={[
          RecentFormCaptionContentType.W,
          RecentFormCaptionContentType.D,
          RecentFormCaptionContentType.L,
          RecentFormCaptionContentType.A,
          RecentFormCaptionContentType.H,
          ...captionDisplayExtraTime(relativeFixtureResult),
          ...captionDisplayPenalties(relativeFixtureResult),
        ]}
      />
    </View>
  </View>
);
