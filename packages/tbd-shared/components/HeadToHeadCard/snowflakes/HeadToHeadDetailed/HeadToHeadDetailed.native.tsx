import type { JSX } from "react";
import { FunctionComponent } from "react";
import { View } from "react-native";
import { RecentFormCaptionContentType, HeadToHeadResultProps } from "@ppb/the-wall-common/types";
import { HeadToHeadResult } from "@ppb/the-wall-native/components/HeadToHead/HeadToHeadResult/HeadToHeadResult";
import { RecentFormCaption } from "@ppb/the-wall-native/components/RecentForm/RecentFormCaption/RecentFormCaption";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { HeadToHeadDetailedProps } from "./HeadToHeadDetailed.types";
import styles from "./HeadToHeadDetailed.native.styles";
import {
  HEAD_TO_HEAD_DETAILED,
  HEAD_TO_HEAD_DETAILED_CAPTION,
  HEAD_TO_HEAD_DETAILED_RESULTS,
} from "./HeadToHeadDetailed.native.selectors";

function detailedHeadToHeadResult(headToHeadDetailed: HeadToHeadResultProps[]): JSX.Element {
  const headToHeadDetailedResults = headToHeadDetailed.map((result, index) => (
    <View key={index}>
      <View style={styles.headToHeadResultContainer} {...getTestProps(HEAD_TO_HEAD_DETAILED_RESULTS, false)}>
        <HeadToHeadResult {...result} />
      </View>
    </View>
  ));
  return <View>{headToHeadDetailedResults}</View>;
}

function displayAETCaption(headToHeadResults: HeadToHeadResultProps[]): RecentFormCaptionContentType[] {
  return headToHeadResults.some((element) => element.afterExtraTime === true) ? [RecentFormCaptionContentType.AET] : [];
}

function displayPenaltiesCaption(headToHeadResults: HeadToHeadResultProps[]): RecentFormCaptionContentType[] {
  return headToHeadResults.some((element) => element.penaltiesScore !== undefined)
    ? [RecentFormCaptionContentType.PEN]
    : [];
}

function shouldDisplayCaption(headToHeadResults: HeadToHeadResultProps[]): boolean {
  return (
    headToHeadResults.some((element) => element.afterExtraTime === true) ||
    headToHeadResults.some((element) => element.penaltiesScore !== undefined)
  );
}

export const HeadToHeadDetailed: FunctionComponent<HeadToHeadDetailedProps> = ({
  headToHeadDetailedProps,
  captionI18n,
}) => {
  if (headToHeadDetailedProps.length === 0) {
    return null;
  }

  return (
    <View style={styles.headToHeadDetailedContainer} {...getTestProps(HEAD_TO_HEAD_DETAILED, false)}>
      {detailedHeadToHeadResult(headToHeadDetailedProps)}
      {shouldDisplayCaption(headToHeadDetailedProps) && (
        <View style={styles.caption} {...getTestProps(HEAD_TO_HEAD_DETAILED_CAPTION, false)}>
          <RecentFormCaption
            i18n={captionI18n}
            content={[
              ...displayAETCaption(headToHeadDetailedProps),
              ...displayPenaltiesCaption(headToHeadDetailedProps),
            ]}
          />
        </View>
      )}
    </View>
  );
};
