import type { JSX } from "react";
import { FunctionComponent } from "react";
import {
  RecentFormCaptionContentType as CaptionContentType,
  HeadToHeadResultProps,
  HeadToHeadResultViewMode,
} from "@ppb/the-wall-common/types";
import { HeadToHeadResult } from "@ppb/the-wall-web/components/bricks/HeadToHeadResult/HeadToHeadResult";
import { RecentFormCaption as Caption } from "@ppb/the-wall-web";
import { HeadToHeadDetailedProps } from "./HeadToHeadDetailed.types";
import styles from "./HeadToHeadDetailed.web.css";

function detailedHead2HeadResult(head2headDetailed: HeadToHeadResultProps[]): JSX.Element {
  const head2headDetailedResults = head2headDetailed.map((result, index) => (
    <div key={index}>
      <HeadToHeadResult
        key={index}
        homeTeamName={result.homeTeamName}
        homeTeamCrest={result.homeTeamCrest}
        awayTeamName={result.awayTeamName}
        awayTeamCrest={result.awayTeamCrest}
        score={result.score}
        afterExtraTime={result.afterExtraTime}
        penaltiesScore={result.penaltiesScore}
        competition={result.competition}
        date={result.date}
        dateTime={result.dateTime}
        i18n={result.i18n}
        viewMode={HeadToHeadResultViewMode.EXTENDED}
      />
      {index !== head2headDetailed.length - 1 && <div className={styles.border} />}
    </div>
  ));
  return <div className={styles.head2headResult}>{head2headDetailedResults}</div>;
}
function displayAETCaption(head2headResults: HeadToHeadResultProps[]): CaptionContentType[] {
  return head2headResults.find((element) => element.afterExtraTime === true) ? [CaptionContentType.AET] : [];
}

function displayPenaltiesCaption(head2headResults: HeadToHeadResultProps[]): CaptionContentType[] {
  return head2headResults.find((element) => element.penaltiesScore !== undefined) ? [CaptionContentType.PEN] : [];
}

function shouldDisplayCaption(head2headResults: HeadToHeadResultProps[]): boolean {
  return (
    head2headResults.filter((element) => element.afterExtraTime === true).length > 0 ||
    head2headResults.filter((element) => element.penaltiesScore !== undefined).length > 0
  );
}

export const HeadToHeadDetailed: FunctionComponent<HeadToHeadDetailedProps> = ({
  headToHeadDetailedProps,
  captionI18n,
}) => (
  <div className={styles.container}>
    {detailedHead2HeadResult(headToHeadDetailedProps)}
    {shouldDisplayCaption(headToHeadDetailedProps) && (
      <div className={styles.caption}>
        <Caption
          i18n={captionI18n}
          content={[...displayAETCaption(headToHeadDetailedProps), ...displayPenaltiesCaption(headToHeadDetailedProps)]}
        />
      </div>
    )}
  </div>
);
