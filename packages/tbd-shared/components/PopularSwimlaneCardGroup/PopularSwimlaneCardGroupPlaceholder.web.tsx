/* eslint-disable jsx-a11y/heading-has-content */
import { FunctionComponent } from "react";
import styles from "./PopularSwimlaneCardGroupPlaceholder.web.css";

const PopularSwimlaneCardGroupPlaceholder: FunctionComponent = () => (
  <section className={styles.placeholder}>
    <h2 className={`${styles.placeholderTitle} typography-h380`}></h2>
    <div className={styles.placeholderContainer}></div>
  </section>
);

export default PopularSwimlaneCardGroupPlaceholder;
