 
import { FunctionComponent } from "react";
import styles from "./ObbCardPlaceholder.web.css";

/**
 * CardGroup placeholder
 */
const ObbCardPlaceholder: FunctionComponent = () => (
  <section className={styles.placeholder}>
    <div className={styles.placeholderContainer}></div>
  </section>
);

export default ObbCardPlaceholder;
