 
import { FunctionComponent } from "react";
import { Placeholder } from "@ppb/the-wall-web";
import styles from "./SportRibbonCardGroupPlaceholder.web.css";

/**
 * SportRibbonCardGroup placeholder
 */
const SportRibbonCardGroupPlaceholder: FunctionComponent = () => (
  <section className={styles.placeholderContainer}>
    <div className={styles.placeholder}>
      <Placeholder />
    </div>
    <div className={styles.placeholder}>
      <Placeholder />
    </div>
    <div className={styles.placeholder}>
      <Placeholder />
    </div>
    <div className={styles.placeholder}>
      <Placeholder />
    </div>
    <div className={styles.placeholder}>
      <Placeholder />
    </div>
    <div className={styles.placeholder}>
      <Placeholder />
    </div>
  </section>
);

export default SportRibbonCardGroupPlaceholder;
