import { FunctionComponent, useMemo, useState } from "react";
import { Collapse, BetInfo } from "@ppb/the-wall-web";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { BetInfoCollapseProps } from "./BetInfoCollapse.types";
import { i18n } from "../../helpers/i18n";
import styles from "./BetInfoCollapse.web.css";

export const BetInfoCollapse: FunctionComponent<BetInfoCollapseProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const chevronIconName = isOpen ? SystemIconName.CHEVRON_UP : SystemIconName.CHEVRON_DOWN;

  const header = useMemo(
    () => (
      <div className={styles.betInfoHeader}>
        <div className={styles.betInfoHeaderTitle}>{i18n({ key: "I18N.MY_BETS.BET_DETAILS" })}</div>
        <span className={styles.betInfoHeaderIcon}>
          <GenericIcon name={chevronIconName} color={"var(--card-header-transparent-icon-colour)"} />
        </span>
      </div>
    ),
    [chevronIconName],
  );

  return (
    <div className={styles.betInfoCollapse}>
      <Collapse header={header} isOpen={isOpen} setIsOpen={setIsOpen}>
        <BetInfo items={items} />
      </Collapse>
    </div>
  );
};
