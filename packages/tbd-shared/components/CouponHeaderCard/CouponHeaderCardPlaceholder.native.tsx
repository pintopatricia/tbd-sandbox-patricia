import { FunctionComponent } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Placeholder } from "@ppb/the-wall-native";
import styles from "./CouponHeaderCardPlaceholder.native.styles";
import { COUPON_HEADER_PLACEHOLDER } from "./CouponHeaderCard.native.selectors";

const CouponHeaderCardPlaceholder: FunctionComponent = () => (
  <View {...getTestProps(COUPON_HEADER_PLACEHOLDER)} style={styles.placeholderContainer}>
    <View style={styles.placeholder}>
      <Placeholder style={styles.tempPlaceholderOverride} />
    </View>
  </View>
);

export default CouponHeaderCardPlaceholder;
