import type { JSX } from "react";
import { useCallback } from "react";

import { MarketPromo } from "@ppb/the-wall-web";

import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { ComponentProps } from "./props";

const MarketBlurb = ({
  title,
  description,
  signposting,
  i18nLabels,
  termsAndConditionsURL,
  variant,
  isExpanded,
  dispatchExternalPushAction,
  dispatchMarketBlurbLinkClick,
  dispatchToggleDescriptionBlurbCard,
  marketPromoVariant = "promotion",
}: ComponentProps): JSX.Element => {
  const handleMarketPromoClick = useCallback(
    ({ isOpen }: { isOpen: boolean }) => {
      dispatchToggleDescriptionBlurbCard(title, isOpen, variant);
    },
    [dispatchToggleDescriptionBlurbCard, title, variant],
  );

  const onLinkClick = useCallback(() => {
    dispatchMarketBlurbLinkClick(termsAndConditionsURL, title, variant);
    dispatchExternalPushAction(termsAndConditionsURL);
  }, [dispatchMarketBlurbLinkClick, dispatchExternalPushAction, termsAndConditionsURL, title, variant]);

  if (!title) {
    return <></>;
  }

  return (
    <MarketPromo
      variant={marketPromoVariant}
      title={title}
      description={description}
      isExpanded={isExpanded}
      signposting={signposting as Icons}
      linkText={i18nLabels.termsConditions}
      onMarketPromoClick={(isOpen) => handleMarketPromoClick({ isOpen })}
      onLinkClick={onLinkClick}
    />
  );
};
export default MarketBlurb;
