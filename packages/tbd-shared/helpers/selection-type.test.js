import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { getSelectionTypeIcon, SelectionTypeIconVariant } from "./selection-type";

describe("selection type - helper", () => {
  describe("getSelectionTypeIcon", () => {
    it.each([
      [IconsList.TWO_UP_EARLY_PAYOUT_MONOCHROME, "FULL_TIME_RESULT_-_2_UP", false, undefined],
      [IconsList.TWO_UP_EARLY_PAYOUT_MONOCHROME, "FULL_TIME_RESULT_-_2_UP", false, SelectionTypeIconVariant.MONOCHROME],
      [IconsList.TWO_UP_EARLY_PAYOUT, "FULL_TIME_RESULT_-_2_UP", false, SelectionTypeIconVariant.COLORED],
      [IconsList.SUPER_SUB, "POTATO", true, SelectionTypeIconVariant.COLORED],
      [undefined, "", false, undefined],
      [undefined, "UNKNOWN", false, undefined],
    ])(
      "should return `%s` for the market type of `%s` and SuperSub as `%s` and with variant as `%s`",
      (result, marketType, isSuperSub, variant) => {
        expect(getSelectionTypeIcon(marketType, isSuperSub, variant)).toEqual(result);
      },
    );
  });
});
