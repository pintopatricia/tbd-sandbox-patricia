import type { JSX } from "react";
import { FunctionComponent } from "react";
import classNames from "classnames";

import MarketBlurbsGA4Variants from "../../../helpers/market-blurbs-ga4-variants";

import ConnectedMarketBlurb from "../../MarketBlurb";
import MarketBlurb from "../../MarketBlurb/MarketBlurb.web";

import { ComponentProps } from "./props";
import styles from "./NinetyMinuteBlurb.web.css";

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

  const containerStyle = classNames({
    [styles.container]: hasSpacing,
  });

  return (
    <div className={containerStyle}>
      <ConnectedMarketBlurb
        component={MarketBlurb}
        titleKey={titleKey}
        descriptionKey={descriptionKey}
        signposting={signposting}
        externalLinkType={externalLinkType}
        variant={MarketBlurbsGA4Variants.NINETY_MINUTES}
      />
    </div>
  );
};

export default NinetyMinuteBlurb;
