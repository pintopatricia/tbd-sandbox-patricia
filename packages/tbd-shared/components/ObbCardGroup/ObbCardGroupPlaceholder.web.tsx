/* eslint-disable jsx-a11y/heading-has-content */
import { FunctionComponent } from "react";
import styles from "./ObbCardGroupPlaceholder.web.css";

const ComponentPlaceholder: FunctionComponent = () => (
  <section className={styles.placeholder}>
    <h3 className={`${styles.placeholderTitle} typography-h380`}></h3>
    <div className={styles.placeholderContainer}></div>
  </section>
);
/**
 * CardGroup placeholder
 */
const ObbCardGroupPlaceholder: FunctionComponent = () => (
  <>
    {Array(3)
      .fill({})
      .map((_, i) => (
        <ComponentPlaceholder key={i} />
      ))}
  </>
);

export default ObbCardGroupPlaceholder;
