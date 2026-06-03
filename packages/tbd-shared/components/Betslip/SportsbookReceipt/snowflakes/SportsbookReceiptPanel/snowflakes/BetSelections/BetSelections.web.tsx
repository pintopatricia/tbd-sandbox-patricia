import { FunctionComponent, useMemo, useState } from "react";

import { Collapse } from "@ppb/the-wall-web/components/bricks/Collapse/Collapse";
import { BetSelectionDetails } from "@ppb/the-wall-web/components/walls/BetSelectionDetails/BetSelectionDetails";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import classNames from "classnames";
import styles from "./BetSelections.web.css";
import { BetSelectionsHeaderProps, BetSelectionsViewModel } from "./BetSelections.types";

const BetSelectionsHeader: FunctionComponent<BetSelectionsHeaderProps> = ({ title, isOpen }) => {
  const chevron = useMemo(() => {
    const chevronIconName = isOpen ? SystemIconName.CHEVRON_UP : SystemIconName.CHEVRON_DOWN;

    return (
      <div className={styles.chevron}>
        <GenericIcon name={chevronIconName} />
      </div>
    );
  }, [isOpen]);

  return (
    <div className={styles.header}>
      <h3 className={styles.title}>{title}</h3>
      {chevron}
    </div>
  );
};

export const BetSelections: FunctionComponent<BetSelectionsViewModel> = ({
  title,
  selections,
  isPlacing,
  onTitleClick,
  onSelectionRemove,
  removeBorderRadius,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const header = <BetSelectionsHeader title={title} isOpen={isOpen} />;

  const containerClasses = classNames(styles.container, {
    [styles.borderRadius]: !removeBorderRadius,
  });

  return (
    <div className={containerClasses}>
      <Collapse onTitleClick={onTitleClick} header={header} isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className={styles.selections}>
          {selections.map((selection) => (
            <BetSelectionDetails
              key={selection.id}
              title={selection.title}
              subtitle={selection.subtitle}
              odd={selection.odd}
              oddsMovement={selection.oddsMovement}
              isPlacing={isPlacing}
              hintMessage={selection.hintMessage}
              hintType={selection.hintType}
              is90Min={selection.is90Min}
              selectionTypeIcon={selection.selectionTypeIcon}
              icon={selection.icon}
              onSelectionRemove={onSelectionRemove ? () => onSelectionRemove(selection.id, selection.urn) : undefined}
            />
          ))}
        </div>
      </Collapse>
    </div>
  );
};
