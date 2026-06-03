import type { FunctionComponent, JSX } from "react";
import { RecentFormCaptionContentType } from "@ppb/the-wall-common/types";
import { RecentFormCaption } from "@ppb/the-wall-web";
import { RecentFormResult } from "../RecentFormResult/RecentFormResult.web";

import styles from "./RecentFormDetailed.web.css";
import { RecentFormDetailedProps } from "./RecentFormDetailed.types";
import { RecentFormResultI18n, RecentFormResultProps } from "../RecentFormResult/RecentFormResult.types";

function captionDisplayExtraTime(
  relativeFixtureResult: [RecentFormResultProps[], RecentFormResultProps[]],
): RecentFormCaptionContentType[] {
  return relativeFixtureResult.find((element) => element.find((elementProps) => elementProps.isExtraTimeScore === true))
    ? [RecentFormCaptionContentType.AET]
    : [];
}

function captionDisplayPenalties(
  relativeFixtureResult: [RecentFormResultProps[], RecentFormResultProps[]],
): RecentFormCaptionContentType[] {
  return relativeFixtureResult.find((element) => element.find((elementProps) => elementProps.penaltyScore))
    ? [RecentFormCaptionContentType.PEN]
    : [];
}

function renderFormResult(fixtureResult: RecentFormResultProps, i18n: RecentFormResultI18n): JSX.Element {
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
  const content = [];
  const [homeFixtureResult, awayFixtureResult] = relativeFixtureResult;
  const numberOfFixtures = Math.max(homeFixtureResult.length, awayFixtureResult.length);

  for (let i = 0; i < numberOfFixtures; i += 1) {
    content.push(
      <div key={i} className={styles.resultsContainer}>
        <div className={`${styles.resultContainer} ${styles.homeContainer}`}>
          {renderFormResult(homeFixtureResult[i], i18n)}
        </div>
        <div className={`${styles.resultContainer} ${styles.awayContainer}`}>
          {renderFormResult(awayFixtureResult[i], i18n)}
        </div>
      </div>,
    );
  }
  return <>{content}</>;
}

export const RecentFormDetailed: FunctionComponent<RecentFormDetailedProps> = ({ relativeFixtureResult, i18n }) => (
  <div className={styles.container}>
    <div className={styles.scoresContainer}>{renderScores(relativeFixtureResult, i18n.recentFormResultI18n)}</div>
    <div className={styles.caption}>
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
    </div>
  </div>
);
