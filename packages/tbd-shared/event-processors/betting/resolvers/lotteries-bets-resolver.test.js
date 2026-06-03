import { getStore } from "@ppb/tbd-store/create-store";
import {
  UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION,
  UI__BETSLIP_OPEN,
  UI__BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION,
} from "@ppb/tbd-store/actions/betslip";
import {
  BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
  BETTING__SBK_MARKETS_REQUEST,
  BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION,
} from "@ppb/tbd-store/actions/betting";
import { addLotteriesBetToBetslip } from "./lotteries-bets-resolver";

jest.mock("@ppb/tbd-store/create-store", () => {
  const dispatch = jest.fn();
  return {
    getStore: jest.fn(() => ({
      dispatch,
    })),
  };
});

describe("lotteries-bets-resolver", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should dispatch the correct actions", () => {
    const cardUrn = "ppb:card:1";
    const markets = [
      { marketUrn: "ppb:market:1", marketId: "1" },
      { marketUrn: "ppb:market:2", marketId: "2" },
    ];
    const runnerUrns = ["ppb:runner:1", "ppb:runner:2"];
    const selectionIds = [101, 102];

    addLotteriesBetToBetslip(cardUrn, markets, runnerUrns, selectionIds);

    // Market request
    expect(getStore().dispatch).toHaveBeenCalledWith({
      type: BETTING__SBK_MARKETS_REQUEST,
      payload: {
        urns: ["ppb:market:1", "ppb:market:2"],
        group: "REAL",
      },
    });

    // Betslip open
    expect(getStore().dispatch).toHaveBeenCalledWith({
      type: UI__BETSLIP_OPEN,
      payload: { product: "Sportsbook" },
    });

    // Remove potential selections and all bets for each runner
    runnerUrns.forEach((runnerUrn) => {
      expect(getStore().dispatch).toHaveBeenCalledWith({
        type: UI__BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION,
        payload: { urn: runnerUrn },
      });
      expect(getStore().dispatch).toHaveBeenCalledWith({
        type: UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION,
      });
      expect(getStore().dispatch).toHaveBeenCalledWith({
        type: BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
      });
    });

    expect(getStore().dispatch).toHaveBeenCalledWith({
      type: BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION,
      payload: {
        marketUrns: ["ppb:market:1", "ppb:market:2"],
        marketIds: ["1", "2"],
        selectionIds,
        group: "REAL",
        urn: cardUrn,
      },
    });
  });

  it("should not dispatch when the runnerUrns arrays is empty", () => {
    const cardUrn = "ppb:card:1";
    const markets = [
      { marketUrn: "ppb:market:1", marketId: "1" },
      { marketUrn: "ppb:market:2", marketId: "2" },
    ];
    const selectionIds = [101, 102];

    addLotteriesBetToBetslip(cardUrn, markets, [], selectionIds);

    expect(getStore().dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: UI__BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION }),
    );

    expect(getStore().dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION }),
    );

    expect(getStore().dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION }),
    );

    expect(getStore().dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION }),
    );
  });

  it("should not dispatch when the markets arrays is empty", () => {
    const cardUrn = "ppb:card:1";
    const runnerUrns = ["ppb:runner:1", "ppb:runner:2"];
    const selectionIds = [101, 102];

    addLotteriesBetToBetslip(cardUrn, [], runnerUrns, selectionIds);

    expect(getStore().dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: UI__BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION }),
    );

    expect(getStore().dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION }),
    );

    expect(getStore().dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION }),
    );

    expect(getStore().dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION }),
    );
  });

  it("should not dispatch when the selectionIds arrays is empty", () => {
    const cardUrn = "ppb:card:1";
    const markets = [
      { marketUrn: "ppb:market:1", marketId: "1" },
      { marketUrn: "ppb:market:2", marketId: "2" },
    ];
    const runnerUrns = ["ppb:runner:1", "ppb:runner:2"];

    addLotteriesBetToBetslip(cardUrn, markets, runnerUrns, []);

    expect(getStore().dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: UI__BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION }),
    );

    expect(getStore().dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION }),
    );

    expect(getStore().dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION }),
    );

    expect(getStore().dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION }),
    );
  });
});
