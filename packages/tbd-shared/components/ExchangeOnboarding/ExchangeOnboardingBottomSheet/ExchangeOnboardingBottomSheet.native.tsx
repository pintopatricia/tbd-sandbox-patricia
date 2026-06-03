import { FunctionComponent } from "react";
import { Image, View } from "react-native";

import { BottomSheet, PrimaryButton, Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import { IMAGE, DESCRIPTION } from "./ExchangeOnboardingBottomSheet.native.selectors";

import styles from "./ExchangeOnboardingBottomSheet.native.styles";
import { ExchangeOnboardingBottomSheetViewModel } from "../types";

const ExchangeOnboardingBottomSheet: FunctionComponent<ExchangeOnboardingBottomSheetViewModel> = ({
  title,
  description,
  dismissButtonText,
  onDismiss,
}) => (
  <BottomSheet title={title} onHeaderIconTap={onDismiss} showOverlay={true} withModal={true}>
    <View style={styles.spacing}>
      <View style={styles.imageContainer}>
        <Image
          {...getTestProps(IMAGE)}
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          source={require("../../../assets/images/exchange-onboarding.png")}
        />
      </View>
      <Text {...getTestProps(DESCRIPTION)} style={styles.content}>
        {description}
      </Text>
      <PrimaryButton label={dismissButtonText} onTap={onDismiss} />
    </View>
  </BottomSheet>
);

export default ExchangeOnboardingBottomSheet;
