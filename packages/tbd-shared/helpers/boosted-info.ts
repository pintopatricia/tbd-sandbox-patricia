import { ValueIconName } from "@ppb/the-wall-icons";
import type { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { i18n } from "./i18n";

export type BoostedMarketTypeMap = {
  iconName: Icons;
  label: string;
};

const i18nLabels = {
  priceBoost: i18n({ key: "I18N.MYBETS.PRICE_BOOST.SIGNPOST" }),
  superBoost: i18n({ key: "I18N.SUPER_BOOST.SIGNPOSTING" }),
  doubleUpBoost: i18n({ key: "I18N.DOUBLE_UP_BOOST.SIGNPOSTING" }),
  featuredBoost: i18n({ key: "I18N.FEATURED_BOOST.SIGNPOSTING" }),
  bumperBoost: i18n({ key: "I18N.BUMPER_PRICE_BOOST.SIGNPOSTING" }),
};

const marketTypeMapped: Record<string, BoostedMarketTypeMap> = {
  SUPER_BOOST: {
    iconName: ValueIconName.SUPER_BOOST,
    label: i18nLabels.superBoost,
  },
  "SBG_-_SUPER_BOOST": {
    iconName: ValueIconName.SUPER_BOOST,
    label: i18nLabels.superBoost,
  },
  "SBG_-_DOUBLE_UP_BOOST": {
    iconName: ValueIconName.DOUBLE_UP_BOOST,
    label: i18nLabels.doubleUpBoost,
  },
  "SBG_-_FEATURED_BOOST": {
    iconName: ValueIconName.PRICE_BOOST,
    label: i18nLabels.featuredBoost,
  },
  BUMPER_PRICE_BOOST: {
    iconName: ValueIconName.PRICE_BOOST,
    label: i18nLabels.bumperBoost,
  },
};

/**
 * This function returns the boosted information (icon and label) for the given market type.
 *
 * @param marketType - the market type to look up.
 * @returns An object containing the icon name and label for the boosted market type,
 *          with fallbacks to default values if not found.
 */
export const getBoostedInfo = (marketType: string): BoostedMarketTypeMap => {
  const mappedValues = marketTypeMapped[marketType];

  const iconName = mappedValues?.iconName ?? ValueIconName.PRICE_BOOST;
  const label = mappedValues?.label ?? i18nLabels.priceBoost;

  return {
    iconName,
    label,
  };
};
