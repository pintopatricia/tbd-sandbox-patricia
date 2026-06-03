import type { JSX } from "react";
import { FunctionComponent } from "react";
import { View } from "react-native";

import MarketBlurbsGA4Variants from "../../../helpers/market-blurbs-ga4-variants";

import ConnectedMarketBlurb from "../../MarketBlurb";
import MarketBlurb from "../../MarketBlurb/MarketBlurb.native";

import { ComponentProps } from "./props";
import styles from "./NinetyMinuteBlurb.native.styles";

const NinetyMinuteBlurb: FunctionComponent<ComponentProps> = ({
  titleKey,
  descriptionKey,
  signposting,
  hasSpacing,
  externalLinkType,
}): JSX.Element => {
  if (!titleKey || !descriptionKey) {
    return <></>;
  }

  const containerStyle = hasSpacing && [styles.container];

  return (
    <View style={containerStyle}>
      <ConnectedMarketBlurb
        component={MarketBlurb}
        titleKey={titleKey}
        descriptionKey={descriptionKey}
        signposting={signposting}
        externalLinkType={externalLinkType}
        variant={MarketBlurbsGA4Variants.NINETY_MINUTES}
      />
    </View>
  );
};

export default NinetyMinuteBlurb;
