import { FunctionComponent, useCallback, useMemo, useState } from "react";
import { View } from "react-native";

import { BetSelectionDetails } from "@ppb/the-wall-native/components/BetDetails/BetSelectionDetails/BetSelectionDetails";
import { Collapse } from "@ppb/the-wall-native/components/Collapse/Collapse";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { Text } from "@ppb/the-wall-native";
import { BET_SELECTIONS, CONTENT, HEADER, SELECTION } from "./BetSelections.native.selectors";
import styles from "./BetSelections.native.styles";
import { BetSelectionItemProps, BetSelectionsHeaderProps, BetSelectionsViewModel } from "./BetSelections.types";

const BetSelectionItem: FunctionComponent<BetSelectionItemProps> = ({
  selection,
  onSelectionRemove,
  isPlacing,
  icon,
}) => {
  const handleSelectionRemove = useCallback(() => {
    if (onSelectionRemove) {
      onSelectionRemove(selection.id, selection.urn);
    }
  }, [onSelectionRemove, selection.id, selection.urn]);

  return (
    <View {...getTestProps(SELECTION, false)} key={selection.id}>
      <BetSelectionDetails
        title={selection.title}
        subtitle={selection.subtitle}
        odd={selection.odd}
        oddsMovement={selection.oddsMovement}
        hintMessage={selection.hintMessage}
        hintType={selection.hintType}
        isPlacing={isPlacing}
        is90Min={selection.is90Min}
        selectionTypeIcon={selection.selectionTypeIcon}
        icon={icon}
        onSelectionRemove={onSelectionRemove ? handleSelectionRemove : undefined}
        isPushNotificationsUnavailable={selection.isPushNotificationsUnavailable}
      />
    </View>
  );
};

const BetSelectionsHeader: FunctionComponent<BetSelectionsHeaderProps> = ({ title, isOpen }) => {
  const iconColor = styles.chevron.color;

  const chevron = useMemo(() => {
    const chevronIconName = isOpen ? SystemIconName.CHEVRON_UP : SystemIconName.CHEVRON_DOWN;

    return (
      <View style={styles.chevron}>
        <GenericIcon name={chevronIconName} color={iconColor} />
      </View>
    );
  }, [isOpen, iconColor]);

  return (
    <View {...getTestProps(HEADER, false)} style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {chevron}
    </View>
  );
};

export const BetSelections: FunctionComponent<BetSelectionsViewModel> = ({
  title,
  selections,
  onTitleClick,
  onSelectionRemove,
  removeBorderRadius,
  isPlacing,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const header = <BetSelectionsHeader title={title} isOpen={isOpen} />;

  const containerStyle = [styles.container, removeBorderRadius ? {} : styles.borderRadius];

  return (
    <View {...getTestProps(BET_SELECTIONS, false)} style={containerStyle}>
      <Collapse onTitleClick={onTitleClick} header={header} isOpen={isOpen} setIsOpen={setIsOpen}>
        <View style={styles.selections} {...getTestProps(CONTENT, false)}>
          {selections.map((selection) => (
            <BetSelectionItem
              key={selection.id}
              selection={selection}
              onSelectionRemove={onSelectionRemove}
              isPlacing={isPlacing}
              icon={selection.icon}
            />
          ))}
        </View>
      </Collapse>
    </View>
  );
};
