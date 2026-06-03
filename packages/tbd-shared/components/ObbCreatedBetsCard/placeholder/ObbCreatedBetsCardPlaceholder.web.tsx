import { Divider, Placeholder } from "@ppb/the-wall-web";
import styles from "./ObbCreatedBetsCardPlaceholder.web.css";

const ObbCreatedBetsCardPlaceholder = () => (
  <div className={styles.card}>
    <div className={styles.header}>
      <div className={styles.durationContainer}>
        <Placeholder />
      </div>
      <div className={styles.teamsRow}>
        <div className={styles.teamContainer}>
          <Placeholder />
        </div>
        <div className={styles.scoreContainer}>
          <Placeholder />
        </div>
        <div className={styles.teamContainer}>
          <Placeholder />
        </div>
      </div>
    </div>

    <div className={styles.outcomesContainer}>
      <div className={styles.marketSection}>
        <div className={styles.marketContent}>
          <div className={styles.marketContentContainer}>
            <Placeholder />
          </div>
          <div className={styles.buttonContainer}>
            <Placeholder />
          </div>
        </div>
        <div className={styles.statsContainer}>
          <div className={styles.statsPlaceholderContainer}>
            <Placeholder />
          </div>
        </div>
      </div>

      <Divider />

      <div className={styles.marketSection}>
        <div className={styles.marketContent}>
          <div className={styles.marketContentContainer}>
            <Placeholder />
          </div>
          <div className={styles.buttonContainer}>
            <Placeholder />
          </div>
        </div>
        <div className={styles.statsContainer}>
          <div className={styles.statsPlaceholderContainer}>
            <Placeholder />
          </div>
        </div>
      </div>
    </div>

    <div className={styles.footer}>
      <Divider />
      <div className={styles.seeAllContainer}>
        <div className={styles.linkContainer}>
          <Placeholder />
        </div>
      </div>
    </div>
  </div>
);

export default ObbCreatedBetsCardPlaceholder;
