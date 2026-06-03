/* eslint-disable jsx-a11y/heading-has-content */
import { FunctionComponent } from "react";
import styles from "./HalfTimeSpecialsSwimlaneCardGroupPlaceholder.web.css";

/**
 * CardGroup placeholder
 */
const HalfTimeSpecialsSwimlaneCardGroupPlaceholder: FunctionComponent = () => (
  <section className={styles.placeholder}>
    <h2 className={`${styles.placeholderTitle} typography-h380`}></h2>
    <div className={styles.placeholderContainer}></div>
  </section>
);

export default HalfTimeSpecialsSwimlaneCardGroupPlaceholder;
