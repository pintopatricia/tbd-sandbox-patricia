import { FunctionComponent } from "react";
import classnames from "classnames";
import styles from "./EmptyBetslip.web.css";
import { i18n } from "../../../helpers/i18n";

export const EmptyBetslip: FunctionComponent = () => (
  <section className={styles.placeholder}>
    <div className={styles.container}>
      <div className={classnames(styles.header, "typography-h370")}>{i18n({ key: "I18N.BETSLIP.EMPTY.TITLE" })}</div>
      <div className={classnames(styles.textContainer, "typography-h156")}>
        {i18n({ key: "I18N.BETSLIP.EMPTY.BODY" })}
      </div>
    </div>
  </section>
);

export default EmptyBetslip;
