
import { FunctionComponent } from "react";
import styles from "./SwimlaneCardGroupPlaceholder.web.css";
import { Placeholder } from "@ppb/the-wall-web";

/**
 * CardGroup placeholder
 */
const SwimlaneCardGroupPlaceholder: FunctionComponent = () => (
  <section className={styles.placeholder}>
    <h2 className={`${styles.placeholderTitle} typography-h380`}>
      <Placeholder />
    </h2>
    <div className={styles.placeholderContainer}>
      <Placeholder />
    </div>
  </section>
);

export default SwimlaneCardGroupPlaceholder;
