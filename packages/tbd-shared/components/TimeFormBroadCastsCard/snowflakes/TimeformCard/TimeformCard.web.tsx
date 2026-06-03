import { FunctionComponent } from "react";
import { Stars } from "./snowflakes/Stars/Stars.web";
import { RunnerRatingProps, TimeformCardProps } from "./TimeformCard.types";
import styles from "./TimeformCard.web.css";

const MAX_STARS = 5;

export const RunnerRating: FunctionComponent<RunnerRatingProps> = ({ index, runnerName, numStars }) => (
  <div className={`typography-h152 ${styles.runnerRating}`}>
    <label className={styles.runnerText}>{`${index}. ${runnerName}`}</label>
    <Stars filled={numStars} outline={MAX_STARS - numStars} />
  </div>
);

export const TimeformCard: FunctionComponent<TimeformCardProps> = ({ runnerRatings, verdictLabel, verdict }) => (
  <div className={styles.timeformCard}>
    <section className={styles.content}>
      {runnerRatings.map(({ name, stars }, index) => (
        <RunnerRating key={name} index={index + 1} runnerName={name} numStars={stars} />
      ))}
      {verdict && verdictLabel && (
        <section className={styles.verdictSection}>
          <label className={`typography-h098 ${styles.verdictLabel}`}>{verdictLabel}</label>
          <section className={`typography-h152 ${styles.verdict}`}>{verdict}</section>
        </section>
      )}
    </section>
  </div>
);
