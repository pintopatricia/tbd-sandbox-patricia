import type { MarketId, SelectionId } from "@ppb/betslip-core/src/types/imply/common";
import type { URN } from "@ppb/the-wall-common/types";

export type MonterosaContentCardEvents = {
  "@@BETSLIP/ADD_MONTEROSA_TO_BETSLIP": {
    cardUrn: URN;
    selections: {
      marketId: MarketId;
      selectionId: SelectionId;
    }[];
  };
};
