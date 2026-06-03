import { FunctionComponent } from "react";
import classnames from "classnames";

import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";

import styles from "./SuccessfulDepositContent.web.css";
import { ComponentProps } from "../props";

export const SuccessfulDepositContent: FunctionComponent<ComponentProps["depositSuccessfulLabels"]> = ({
  depositSuccessful,
  placingBet,
}) => {
  const successfulDepositTitleClassname = classnames(styles.successfulDepositTitle, "typography-h380");

  return (
    <div className={styles.successfulDeposit}>
      <div className={styles.successfulDepositIcon}>
        <GenericIcon name={SystemIconName.NOTIFICATION_SUCCESS} color={"var(--messaging-success-icon-default)"} />
      </div>
      <h2 className={successfulDepositTitleClassname}>{depositSuccessful}</h2>
      <p className={"typography-h152"}>{placingBet}</p>
    </div>
  );
};
