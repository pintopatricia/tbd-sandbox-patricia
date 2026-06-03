import * as React from "react";
import { View } from "react-native";
import PromotionsHubCardGroup from "@ppb/tbd-components-promotions/components/PromotionsHubCardGroup/view/PromotionsHubCardGroup.native";
import styles from "./PromotionsHubCardGroup.native.styles";

type Props = {
  urn: string;
  visible?: boolean;
};

const PromotionsHubCardGroupWrapper: React.FunctionComponent<Props> = (props) => {
  return (
    <View style={styles.container}>
      <PromotionsHubCardGroup {...props} />
    </View>
  );
};

export default PromotionsHubCardGroupWrapper;
