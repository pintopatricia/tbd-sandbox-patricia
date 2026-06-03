import { FunctionComponent, useCallback, useState } from "react";
import { ScrollableSwimlane, SupportingContentButton } from "@ppb/the-wall-web";
import styles from "./SupportingContentCardGroup.web.css";
import ConnectedCard from "../../../Card";
import Card from "../../../Card/Card.web";
import {
  SupportingContentCardGroupProps,
  SupportingContentButtonWrapperProps,
  SupportingContentSelectedItem,
} from "./SupportingContentCardGroup.types";

const SupportingContentButtonWrapper: FunctionComponent<SupportingContentButtonWrapperProps> = ({
  item,
  isSelected,
  onSupportingContentButtonPress,
  setSelectedItem,
}) => {
  const { urn, label, icon } = item;

  const onButtonPress = useCallback(
    (isOpen: boolean) => {
      setSelectedItem(isOpen ? item : null);
      onSupportingContentButtonPress(urn, isOpen);
    },
    [setSelectedItem, item, onSupportingContentButtonPress, urn],
  );

  return (
    <SupportingContentButton title={label} icon={icon} isOpen={isSelected} showExpandIcon onPress={onButtonPress} />
  );
};

const SupportingContentCardGroup: FunctionComponent<SupportingContentCardGroupProps> = ({
  items,
  visible = true,
  onSupportingContentButtonPress,
}) => {
  const [selectedItem, setSelectedItem] = useState<SupportingContentSelectedItem>(null);

  if (!items.length) {
    return null;
  }

  const contentStyles = selectedItem?.applyContentStyles ? styles.content : undefined;

  return (
    <section className={styles.container}>
      <ScrollableSwimlane large>
        {items.map((item) => (
          <div key={item.urn} className={styles.swimlaneItem}>
            <SupportingContentButtonWrapper
              item={item}
              isSelected={selectedItem?.urn === item.urn}
              onSupportingContentButtonPress={onSupportingContentButtonPress}
              setSelectedItem={setSelectedItem}
            />
          </div>
        ))}
      </ScrollableSwimlane>
      {selectedItem && (
        <div className={contentStyles}>
          <ConnectedCard urn={selectedItem.urn} component={Card} typename={selectedItem.typename} visible={visible} />
        </div>
      )}
    </section>
  );
};

export default SupportingContentCardGroup;
