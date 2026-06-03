import { Product } from "@ppb/tbd-store";
import { getStore } from "@ppb/tbd-store/create-store";
import { UI__BETSLIP_OPEN } from "@ppb/tbd-store/actions/betslip";
import { BETTING__SBK_MARKETS_REQUEST, BETTING__SBK_ADD_SELECTIONS } from "@ppb/tbd-store/actions/betting";
import { marketCodec, sportsbookRunnerCodec } from "@ppb/tbd-urn-codecs";
import { addMonterosaSelectionsToBetslip } from "./monterosa-bets-resolver";

jest.mock("@ppb/tbd-store/create-store", () => {
  const dispatch = jest.fn();
  const getState = jest.fn(() => ({
    betting: {
      sportsbookBetting: {
        runners: {},
      },
    },
  }));

  return {
    getStore: jest.fn(() => ({
      dispatch,
      getState,
    })),
  };
});

describe("monterosa-bets-resolver", () => {
  const cardUrn = "ppb:tbd:card:monterosaContent:1";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns empty array and does not dispatch when selections is empty", () => {
    const result = addMonterosaSelectionsToBetslip(cardUrn, []);

    expect(result).toEqual([]);
    expect(getStore().dispatch).not.toHaveBeenCalled();
  });

  it("opens betslip only when all selections already exist", () => {
    const existingSelection = {
      marketId: "926.100",
      selectionId: 1,
    };

    getStore().getState.mockReturnValue({
      betting: {
        sportsbookBetting: {
          runners: {
            "ppb:tbd:runner:1": existingSelection,
          },
        },
      },
    });

    const result = addMonterosaSelectionsToBetslip(cardUrn, [existingSelection]);

    expect(result).toEqual([existingSelection]);
    expect(getStore().dispatch).toHaveBeenCalledTimes(1);
    expect(getStore().dispatch).toHaveBeenCalledWith({
      type: UI__BETSLIP_OPEN,
      payload: {
        product: Product.Sportsbook,
      },
    });
  });

  it("deduplicates and dispatches market request plus add selections", () => {
    const selections = [
      { marketId: "926.200", selectionId: 11 },
      { marketId: "926.200", selectionId: 11 },
      { marketId: "926.201", selectionId: 12 },
      { marketId: "926.201", selectionId: 13 },
    ];

    const result = addMonterosaSelectionsToBetslip(cardUrn, selections);

    const deduplicatedSelections = [
      { marketId: "926.200", selectionId: 11 },
      { marketId: "926.201", selectionId: 12 },
      { marketId: "926.201", selectionId: 13 },
    ];

    expect(result).toEqual(deduplicatedSelections);

    const expectedMarketUrns = [marketCodec.encode("926.200").uid, marketCodec.encode("926.201").uid];

    const expectedSelections = deduplicatedSelections.map(({ marketId, selectionId }) => ({
      marketUrn: marketCodec.encode(marketId).uid,
      runnerUrn: sportsbookRunnerCodec.encode(marketId, selectionId).uid,
    }));

    expect(getStore().dispatch).toHaveBeenCalledWith({
      type: BETTING__SBK_MARKETS_REQUEST,
      payload: {
        urns: expectedMarketUrns,
        group: "REAL",
      },
    });

    expect(getStore().dispatch).toHaveBeenCalledWith({
      type: UI__BETSLIP_OPEN,
      payload: {
        product: Product.Sportsbook,
      },
    });

    expect(getStore().dispatch).toHaveBeenCalledWith({
      type: BETTING__SBK_ADD_SELECTIONS,
      payload: {
        selections: expectedSelections,
        group: "REAL",
        cardUrn,
        ensureSelectionsFromStore: true,
      },
    });
  });
});
