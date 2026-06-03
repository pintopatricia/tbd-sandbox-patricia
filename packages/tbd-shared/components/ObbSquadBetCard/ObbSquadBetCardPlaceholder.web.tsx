import { FunctionComponent } from "react";
import { Divider, Placeholder } from "@ppb/the-wall-web";
import styles from "./ObbSquadBetCardPlaceholder.web.css";

const ObbSquadBetCardPlaceholder: FunctionComponent = () => (
  <section className={styles.placeholderContainer}>
    <Placeholder className={styles.title} />
    <div className={styles.microPlayerContainer}>
      <Placeholder className={styles.microPlayer} />
      <Placeholder className={styles.microPlayer} />
      <Placeholder className={styles.microPlayer} />
      <Placeholder className={styles.microPlayer} />
    </div>
    <Placeholder className={styles.statsLabel} />
    <Divider />
    <Placeholder className={styles.outcomesLabel} />
    <div className={styles.betButtonContainer}>
      <Placeholder className={styles.betButton} />
      <Placeholder className={styles.betButton} />
      <Placeholder className={styles.betButton} />
      <Placeholder className={styles.betButton} />
    </div>
  </section>
);

export default ObbSquadBetCardPlaceholder;
