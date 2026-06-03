import { FunctionComponent } from "react";

import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { NavigationIconName, AssetsIconName } from "@ppb/the-wall-icons";
import { LogoProduct, LogoProps } from "./Logo.types";
import styles from "./Logo.web.css";

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
export const Logo: FunctionComponent<LogoProps> = ({ product = LogoProduct.NONE, color }) => (
  <div className={styles.logoContainer}>
    <div className={wrapperStyle[product]}>
      <GenericIcon name={iconNameMap[product]} color={color} />
    </div>
  </div>
);
