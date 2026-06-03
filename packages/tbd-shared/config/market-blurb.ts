import type { ExternalLink } from "@ppb/tbd-store";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { MarketFlags } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";

import { type MarketPromoProps } from "@ppb/the-wall-common/types";
import type { TranslationKey } from "../translations/keys";

export type MarketBlurb = {
  titleKey: keyof TranslationKey;
  descriptionKey: keyof TranslationKey;
  signposting: MarketPromoProps["signposting"];
  externalLinkType: ExternalLink;
  gaModuleSuffix?: string;
};

export const MARKET_BLURB_SUPER_SUB: MarketBlurb = {
  titleKey: "I18N.MARKET_BLURB.SUPER_SUB.TITLE",
  descriptionKey: "I18N.MARKET_BLURB.SUPER_SUB.DESCRIPTION",
  signposting: IconsList.SUPER_SUB,
  externalLinkType: "SUPER_SUB",
  gaModuleSuffix: MarketFlags.SUPER_SUB,
};
