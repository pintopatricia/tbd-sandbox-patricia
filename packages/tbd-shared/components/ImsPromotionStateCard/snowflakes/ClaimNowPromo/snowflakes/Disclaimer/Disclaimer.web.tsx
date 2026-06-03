import { FunctionComponent } from "react";
import classnames from "classnames";
import styles from "./Disclaimer.web.css";

export type DisclaimerI18N = {
  titleFirstPart: string;
  titleSecondPart: string;
  listTitle: string;
  listItemOne: string;
  listItemTwo: string;
  bottomText: string;
};

export type DisclaimerProps = {
  value: string;
  i18n: DisclaimerI18N;
};

export const Disclaimer: FunctionComponent<DisclaimerProps> = ({ value, i18n }) => {
  const completeTitle = `${i18n.titleFirstPart} ${value} ${i18n.titleSecondPart}`;
  return (
    <div className={classnames(styles.disclaimer, "typography-h082")}>
      <p>{completeTitle}</p>
      <p>{i18n.listTitle}</p>
      <ol className={styles.list}>
        <li className={styles.listItem}>{i18n.listItemOne}</li>
        <li className={styles.listItem}>{i18n.listItemTwo}</li>
      </ol>
      <p>{i18n.bottomText}</p>
    </div>
  );
};
