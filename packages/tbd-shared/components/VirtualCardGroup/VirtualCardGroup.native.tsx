import { FunctionComponent, useEffect } from "react";
import { View } from "react-native";
import { ComponentProps } from "./props";
import ConnectedCardGroup from "../CardGroup";
import CardGroup from "../CardGroup/CardGroup.native";
import styles from "./VirtualCardGroup.native.styles";

const VirtualCardGroup: FunctionComponent<ComponentProps> = ({
  urn: cardUrn,
  items,
  visible,
  dispatchVirtualsSubscribe,
  dispatchVirtualsUnsubscribe,
}) => {
  useEffect(() => {
    if (visible) {
      dispatchVirtualsSubscribe(cardUrn);
    } else {
      dispatchVirtualsUnsubscribe();
    }

    return () => {
      dispatchVirtualsUnsubscribe();
    };
  }, [cardUrn, dispatchVirtualsSubscribe, dispatchVirtualsUnsubscribe, visible]);

  return (
    <View>
      {items.map(({ urn, typename }, index) => (
        <View
          style={[index + 1 < items.length && styles.cardItem, typename === "PebbleCardGroup" && styles.pebbleCardItem]}
          key={urn}
        >
          <ConnectedCardGroup urn={urn} component={CardGroup} typename={typename} />
        </View>
      ))}
    </View>
  );
};

export default VirtualCardGroup;
