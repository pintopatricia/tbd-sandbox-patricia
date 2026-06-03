import { makeMapStateToProps } from "./map-to-props-factory";

const MOCK_STATE = {
  layouts: {
    cardgroups: {
      betcardgroups: {
        "ppb:tbd:card:bet:group:22222222": {
          typename: "BetCardGroup",
          urn: "ppb:tbd:card:bet:group:22222222",
          items: [
            {
              typename: "ContentSummaryCard",
              urn: "ppb:tbd:card:contentSummary:sport:22222222",
            },
          ],
        },
        "ppb:tbd:card:bet:group:33333333": {
          typename: "BetCardGroup",
          urn: "ppb:tbd:card:bet:group:33333333",
          items: [],
        },
      },
    },
  },
  betting: {
    exchangemarketbets: {},
  },
};

const getBetCardGroupByURN = jest.fn();

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: () => getBetCardGroupByURN,
}));

const BET_CARD_GROUP_URN_WITH_ITEMS = "ppb:tbd:card:bet:group:22222222";
const BET_CARD_GROUP_URN_WITHOUT_ITEMS = "ppb:tbd:card:bet:group:33333333";

afterEach(() => {
  jest.clearAllMocks();
});

let props;

const setup = (urn) => {
  getBetCardGroupByURN.mockReturnValue(MOCK_STATE.layouts.cardgroups.betcardgroups[urn]);
  props = makeMapStateToProps()(MOCK_STATE, { urn });
};

describe("makeMapStateToProps", () => {
  describe("mapStateToProps", () => {
    describe("when the retrieved card group has items", () => {
      it("should call getBetCardGroup with the correct slice", () => {
        setup(BET_CARD_GROUP_URN_WITH_ITEMS);
        expect(getBetCardGroupByURN).toHaveBeenCalledWith(
          MOCK_STATE.layouts.cardgroups.betcardgroups,
          BET_CARD_GROUP_URN_WITH_ITEMS,
        );
      });

      it("should return the correct props", () => {
        setup(BET_CARD_GROUP_URN_WITH_ITEMS);
        expect(props).toEqual({
          items: MOCK_STATE.layouts.cardgroups.betcardgroups[BET_CARD_GROUP_URN_WITH_ITEMS].items,
        });
      });
    });

    describe("when the retrieved card group has no items", () => {
      it("should call getBetCardGroup with the correct slice", () => {
        setup(BET_CARD_GROUP_URN_WITHOUT_ITEMS);
        expect(getBetCardGroupByURN).toHaveBeenCalledWith(
          MOCK_STATE.layouts.cardgroups.betcardgroups,
          BET_CARD_GROUP_URN_WITHOUT_ITEMS,
        );
      });

      it("should return the correct props", () => {
        setup(BET_CARD_GROUP_URN_WITHOUT_ITEMS);
        expect(props).toEqual({
          items: MOCK_STATE.layouts.cardgroups.betcardgroups[BET_CARD_GROUP_URN_WITHOUT_ITEMS].items,
        });
      });
    });

    describe("where there's no card group available", () => {
      it("should return items as an empty array", () => {
        setup("WRONG_URN");
        expect(props).toEqual({ items: [] });
      });
    });
  });
});
