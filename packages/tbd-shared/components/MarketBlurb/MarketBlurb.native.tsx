import { FunctionComponent, useCallback } from "react";

import { navigate } from "@ppb/tbd-router/native";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { DisplayMode } from "@ppb/the-wall-common/types/ViewLink.types";
import { MarketPromo } from "@ppb/the-wall-native";

import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ComponentProps } from "./props";

const MarketBlurb: FunctionComponent<ComponentProps> = ({
  title,
  description,
  i18nLabels,
  signposting,
  termsAndConditionsURL,
  variant,
  isExpanded,
  dispatchMarketBlurbLinkClick,
  dispatchToggleDescriptionBlurbCard,
  marketPromoVariant = "promotion",
}) => {
  const handleMarketPromoClick = useCallback(
    ({ isOpen }: { isOpen: boolean }) => {
      dispatchToggleDescriptionBlurbCard(title, isOpen, variant);
    },
    [dispatchToggleDescriptionBlurbCard, title, variant],
  );

  const onLinkClick = useCallback(() => {
    dispatchMarketBlurbLinkClick(termsAndConditionsURL, title, variant);

    navigate({
      viewUrn: EntityType.ExternalView,
      viewUrl: termsAndConditionsURL,
      viewDisplayMode: DisplayMode.BlankInapp,
    });
  }, [dispatchMarketBlurbLinkClick, termsAndConditionsURL, title, variant]);

  if (!title && !description) {
    return <></>;
  }

  return (
    <MarketPromo
      variant={marketPromoVariant}
      title={title}
      description={description}
      isExpanded={isExpanded}
      signposting={signposting as Icons}
      linkText={i18nLabels?.termsConditions}
      onMarketPromoClick={(isOpen) => handleMarketPromoClick({ isOpen })}
      onLinkClick={onLinkClick}
    />
  );
};

export default MarketBlurb;
