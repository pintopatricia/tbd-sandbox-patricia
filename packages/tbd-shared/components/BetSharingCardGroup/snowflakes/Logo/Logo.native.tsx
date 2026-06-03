import { FunctionComponent } from "react";
import { View } from "react-native";

import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { NavigationIconName, AssetsIconName } from "@ppb/the-wall-icons";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { LogoProduct, LogoProps } from "./Logo.types";
import { LOGO_WRAPPER } from "./Logo.native.selectors";
import styles from "./Logo.native.styles";

const iconNameMap = {
  [LogoProduct.BETFAIR_EXCHANGE]: NavigationIconName.BETFAIR_EXCHANGE,
  [LogoProduct.GAMING]: AssetsIconName.BRAND_GAMES,
  [LogoProduct.NONE]: AssetsIconName.BRAND_LOGO, // Default logo
};

const wrapperStyle = {
  [LogoProduct.BETFAIR_EXCHANGE]: styles.exchange,
  [LogoProduct.GAMING]: styles.games,
  [LogoProduct.NONE]: styles.brand,
};

export const Logo: FunctionComponent<LogoProps> = ({
  product = LogoProduct.NONE,
  color = tokens.BrandLogoShapeColour,
}) => (
  <View style={wrapperStyle[product]} {...getTestProps(LOGO_WRAPPER, false)}>
    <GenericIcon name={iconNameMap[product]} color={color} />
  </View>
);
