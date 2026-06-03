import { Icons, IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SportsbookMarket } from "@ppb/tbd-store";

enum SelectionType {
  TWO_UP = "TWO_UP",
  SUPER_SUB = "SUPER_SUB",
}

const SELECTION_TYPE_MAP: Record<SportsbookMarket["marketType"], SelectionType> = {
  "FULL_TIME_RESULT_-_2_UP": SelectionType.TWO_UP,
};

const getSelectionType = (marketType: string, isSuperSub: boolean): SelectionType | undefined =>
  isSuperSub ? SelectionType.SUPER_SUB : SELECTION_TYPE_MAP[marketType];

export enum SelectionTypeIconVariant {
  COLORED = "COLORED",
  MONOCHROME = "MONOCHROME",
}

const SELECTION_TYPE_ICONS: {
  [type in SelectionType]: { [variant in SelectionTypeIconVariant]: Icons };
} = {
  [SelectionType.TWO_UP]: {
    [SelectionTypeIconVariant.COLORED]: IconsList.TWO_UP_EARLY_PAYOUT,
    [SelectionTypeIconVariant.MONOCHROME]: IconsList.TWO_UP_EARLY_PAYOUT_MONOCHROME,
  },
  [SelectionType.SUPER_SUB]: {
    [SelectionTypeIconVariant.COLORED]: IconsList.SUPER_SUB,
    [SelectionTypeIconVariant.MONOCHROME]: IconsList.SUPER_SUB_MONOCHROME,
  },
};

/**
 * This function returns the icon for the given selection type.
 *
 * @param [marketType] - the market type.
 * @param [isSuperSub] - true if superSub is enabled.
 * @param [variant] - the icon color variant.
 * @returns The icon for the given selection type.
 */
export const getSelectionTypeIcon = (
  marketType?: string,
  isSuperSub = false,
  variant = SelectionTypeIconVariant.MONOCHROME,
): Icons | undefined => {
  const selectionType = marketType ? getSelectionType(marketType, isSuperSub) : undefined;

  return selectionType ? SELECTION_TYPE_ICONS[selectionType]?.[variant] : undefined;
};
