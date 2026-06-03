import { FunctionComponent, useCallback, useState } from "react";
import { ScrollView, View } from "react-native";
import { ScrollableSwimlane, SupportingContentButton } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import styles from "./SupportingContentCardGroup.native.styles";
import ConnectedCard from "../../../Card";
import Card from "../../../Card/Card.native";
import {
  SupportingContentCardGroupProps,
  SupportingContentButtonWrapperProps,
  SupportingContentSelectedItem,
} from "./SupportingContentCardGroup.types";
import { SUPPORTING_CONTENT_CARD_GROUP_CONTAINER } from "./SupportingContentCardGroup.native.selectors";

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

  const twoItemsStyleOverride = items.length === 2 ? styles.swimlaneItemTwoItems : undefined;
  const supportingContentItemStyles = [styles.swimlaneItem, twoItemsStyleOverride];

  return (
    <View style={styles.container} {...getTestProps(SUPPORTING_CONTENT_CARD_GROUP_CONTAINER, false)}>
      <ScrollableSwimlane>
        <ScrollView horizontal contentContainerStyle={styles.scrollView} showsHorizontalScrollIndicator={false}>
          {items.map((item) => (
            <View key={item.urn} style={supportingContentItemStyles}>
              <SupportingContentButtonWrapper
                item={item}
                isSelected={selectedItem?.urn === item.urn}
                onSupportingContentButtonPress={onSupportingContentButtonPress}
                setSelectedItem={setSelectedItem}
              />
            </View>
          ))}
        </ScrollView>
      </ScrollableSwimlane>
      {!!selectedItem && (
        <View style={contentStyles}>
          <ConnectedCard urn={selectedItem.urn} component={Card} typename={selectedItem.typename} visible={visible} />
        </View>
      )}
    </View>
  );
};

export default SupportingContentCardGroup;
