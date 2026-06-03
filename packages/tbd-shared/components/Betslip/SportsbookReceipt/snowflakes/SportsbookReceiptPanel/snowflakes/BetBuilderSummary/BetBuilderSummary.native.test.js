import { render } from "@testing-library/react-native";

import { BetSummary } from "@ppb/the-wall-native";
import { TITLE } from "./BetBuilderSummary.native.selectors";
import { BetBuilderSummary } from "./BetBuilderSummary.native";
import { BetSelections } from "../BetSelections/BetSelections.native";
import { SettlementConditionCard } from "../../../../../ObbMultiple/snowflakes/SettlementConditionCard/SettlementConditionCard.native";

jest.mock("@ppb/the-wall-native", () => ({
  BetSummary: jest.fn(() => <controls-mock />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("../BetSelections/BetSelections.native", () => ({
  BetSelections: jest.fn(() => <bet-selections-mock />),
}));

jest.mock("../../../../../ObbMultiple/snowflakes/SettlementConditionCard/SettlementConditionCard.native", () => ({
  SettlementConditionCard: jest.fn(() => <settlement-condition-card-mock />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    BetBuilderSummaryVerticalGap: {},
    BetBuilderSummaryTitleColour: {},
    BetBuilderSummaryTitleTypography: {},
    BetBuilderSummaryPadding: {},
  },
}));

function renderBetBuilderSummary({
  bet = {
    selections: [],
    notifications: [],
  },
  labels = {},
  ...rest
} = {}) {
  return render(<BetBuilderSummary bet={bet} labels={labels} {...rest} />);
}

describe("BetBuilderSummary", () => {
  beforeEach(jest.clearAllMocks);

  describe("title", () => {
    it("should place the passed title in the correct place", () => {
      const container = renderBetBuilderSummary({
        bet: {
          title: "Title",
          notifications: [{ type: "notification type" }],
        },
      });

      expect(container.getByTestId(TITLE)).toHaveTextContent("Title");
    });
  });

  describe("selections", () => {
    it("should call BetSelections with correct values", () => {
      renderBetBuilderSummary({
        bet: {
          selections: [{ id: "S-1" }],
          selectionsLabel: "Selections",
        },
      });

      expect(BetSelections).toHaveBeenCalledWith(
        {
          selections: [{ id: "S-1" }],
          title: "Selections",
        },
        undefined,
      );
      expect(BetSelections).toHaveBeenCalledTimes(1);
    });
  });

  describe("settlementConditionCard", () => {
    describe("when selectionsToWin is defined", () => {
      it("should call SettlementConditionCard with correct values", () => {
        renderBetBuilderSummary({
          bet: {
            selections: [{ id: "S-1" }, { id: "S-2" }, { id: "S-3" }],
            selectionsToWin: 2,
          },
        });

        expect(SettlementConditionCard).toHaveBeenCalledWith(
          {
            readOnlyProps: {
              selectionsToWin: 2,
              totalSelections: 3,
            },
          },
          undefined,
        );

        expect(SettlementConditionCard).toHaveBeenCalledTimes(1);
      });
    });

    describe("when selectionsToWin is not defined", () => {
      it("should not call SettlementConditionCard", () => {
        renderBetBuilderSummary({
          bet: {
            selections: [{ id: "S-1" }],
            selectionsLabel: "Selections",
          },
        });

        expect(SettlementConditionCard).not.toHaveBeenCalled();
      });
    });
  });

  describe("summary", () => {
    it("should instantiate BetSummary with proper values", () => {
      renderBetBuilderSummary({
        bet: {
          id: "testId",
          type: "Double",
          title: "Title",
          odds: "3/4",
          stake: "3",
          returns: "3",
          hasBonusUsed: true,
          freeBetsLabel: "free bets used",
          generosityAlertMessage: "free bets wallets used",
          generosityIconName: "generosityIconName",
          selections: [{ id: "S-1" }],
          selectionsLabel: "Selections",
          isPushNotificationsUnavailable: false,
          hasMyOddsBoost: false,
          previousOdds: "1/2",
          previousValue: "$1.00",
        },
        labels: {
          odds: "Odds",
          stake: "Stake",
          returns: "Returns",
        },
        hasShownReceiptIds: true,
      });

      expect(BetSummary).toHaveBeenCalledTimes(1);
      expect(BetSummary).toHaveBeenCalledWith(
        {
          i18n: {
            eachWayLabel: "",
            linesLabel: "",
            oddsLabel: "Odds",
            returnsLabel: "Returns",
            stakeLabel: "Stake",
            accaInsuranceLabel: "",
          },
          hasBonusUsed: true,
          hasMyOddsBoost: false,
          freeBetsLabel: "free bets used",
          generosityAlertMessage: "free bets wallets used",
          generosityIconName: "generosityIconName",
          odds: "3/4",
          returns: "3",
          stake: "3",
          title: "Double",
          hasAccaInsurance: false,
          hasShownReceiptIds: true,
          isPushNotificationsUnavailable: false,
          previousOdds: "1/2",
          previousValue: "$1.00",
        },
        undefined,
      );
    });
  });
});
