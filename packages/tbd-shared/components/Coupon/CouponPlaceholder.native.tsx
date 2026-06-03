import { FunctionComponent } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Placeholder } from "@ppb/the-wall-native";
import couponStyles from "./Coupon.native.styles";
import styles from "./CouponPlaceholder.native.styles";
import { COUPON_PLACEHOLDER } from "./Coupon.native.selectors";

const CouponCardGroupPlaceholder: FunctionComponent = () => (
  <View {...getTestProps(COUPON_PLACEHOLDER)} style={couponStyles.couponEventScoreContainer}>
    <View style={[couponStyles.fixtureHeaderContainer, styles.fixtureHeaderContainer]}>
      <View style={styles.teamName}>
        <Placeholder style={styles.tempPlaceholderOverride} />
      </View>
      <View style={styles.teamName}>
        <Placeholder style={styles.tempPlaceholderOverride} />
      </View>
    </View>
    <View style={couponStyles.betButtonsContainer}>
      <View style={styles.betButton}>
        <Placeholder style={styles.tempPlaceholderOverride} />
      </View>
      <View style={styles.betButton}>
        <Placeholder style={styles.tempPlaceholderOverride} />
      </View>
      <View style={styles.betButton}>
        <Placeholder style={styles.tempPlaceholderOverride} />
      </View>
      <View style={styles.statsButton}>
        <Placeholder style={styles.tempPlaceholderOverride} />
      </View>
    </View>
  </View>
);

export default CouponCardGroupPlaceholder;
