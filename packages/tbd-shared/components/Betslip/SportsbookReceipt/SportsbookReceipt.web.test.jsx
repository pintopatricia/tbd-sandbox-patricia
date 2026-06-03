import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { SportsbookReceiptPanel as BetslipSportsbookReceiptPanel } from "./snowflakes/SportsbookReceiptPanel/SportsbookReceiptPanel.web";
import { SportsbookReceipt } from "./SportsbookReceipt.web";

jest.mock("./snowflakes/SportsbookReceiptPanel/SportsbookReceiptPanel.web", () => ({
  SportsbookReceiptPanel: jest.fn(() => <sportsbook-receipt-place-panel-mock />),
}));

const i18nLabelsMock = {
  multiplesTitleLabel: "Multiples",
  selectionsLabel: "Selections",
  oddsLabel: "Odds",
  stakeLabel: "Stake",
  returnsLabel: "Returns Label",
  totalStakeLabel: "Total Stake Label",
  totalReturnsLabel: "Total Returns Label",
  singlesTitleLabel: "Singles",
  receiptStatusLabel: "Bet Placed",
  reUseSelectionsLabel: "Re Use Selections Label",
};

function renderSportsbookReceipt({
  selections = [],
  singles = [],
  boostedMultiples = [],
  multiples = [],
  oneLineBets = [],
  betBuilders = [],
  multiBetBuilder = {},
  multiBetBuilderGroups = {},
  potentialReturns = "1.11",
  totalOriginalReturns = "1.50",
  totalStake = "2.22",
  i18n = i18nLabelsMock,
  hasShownReceiptIds = false,
  dispatchAccordionToggle = jest.fn(),
  dispatchReUseSelections = jest.fn(),
  casts = [],
  dispatchCopyBetIdAction = jest.fn(),
  dispatchCopyRegulatorBetIdAction = jest.fn(),
}) {
  return render(
    <SportsbookReceipt
      singles={singles}
      boostedMultiples={boostedMultiples}
      multiples={multiples}
      casts={casts}
      oneLineBets={oneLineBets}
      betBuilders={betBuilders}
      multiBetBuilder={multiBetBuilder}
      multiBetBuilderGroups={multiBetBuilderGroups}
      selections={selections}
      potentialReturns={potentialReturns}
      totalOriginalReturns={totalOriginalReturns}
      totalStake={totalStake}
      dispatchAccordionToggle={dispatchAccordionToggle}
      dispatchReUseSelections={dispatchReUseSelections}
      i18n={i18n}
      hasShownReceiptIds={hasShownReceiptIds}
      dispatchCopyBetIdAction={dispatchCopyBetIdAction}
      dispatchCopyRegulatorBetIdAction={dispatchCopyRegulatorBetIdAction}
      isOddsBoosted={false}
      showTopContent={false}
    />,
  );
}

describe("SportsbookReceipt", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("when it is the initial render", () => {
    describe("when there is all necessary data", () => {
      it("should call BetslipSportsbookReceiptPanel", () => {
        const BOOSTED_MULTIPLES_MOCK = ["bm:1", "bm:2"];
        renderSportsbookReceipt({ boostedMultiples: BOOSTED_MULTIPLES_MOCK });

        expect(BetslipSportsbookReceiptPanel).toHaveBeenCalledWith(
          {
            selections: [],
            boostedMultiples: BOOSTED_MULTIPLES_MOCK,
            multiples: [],
            singles: [],
            casts: [],
            betBuilders: [],
            multiBetBuilder: {},
            multiBetBuilderGroups: {},
            totalStake: "2.22",
            potentialReturns: "1.11",
            totalOriginalReturns: "1.50",
            i18n: i18nLabelsMock,
            onTitleClick: expect.any(Function),
            onReUseSelectionsClick: expect.any(Function),
            hasShownReceiptIds: false,
            onBetIdCopy: expect.any(Function),
            onRegulatorBetIdCopy: expect.any(Function),
            isOddsBoosted: false,
            isDesktop: false,
            topContent: null,
            oneLineBets: [],
            showReuseSelectionsButton: true,
          },
          undefined,
        );
        expect(BetslipSportsbookReceiptPanel).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when performing interactions", () => {
    describe("onTitleClick", () => {
      it("should call dispatckAccordionToggle", () => {
        const dispatchAccordionToggleMock = jest.fn();

        renderSportsbookReceipt({ dispatchAccordionToggle: dispatchAccordionToggleMock });

        BetslipSportsbookReceiptPanel.mock.calls[0][0].onTitleClick("mockArg");

        expect(dispatchAccordionToggleMock).toHaveBeenCalledWith("mockArg");
        expect(dispatchAccordionToggleMock).toHaveBeenCalledTimes(1);
      });
    });

    describe("onReUseSelectionsClick", () => {
      it("should call dispatchReUseSelectionsMock with selections", () => {
        const dispatchReUseSelectionsMock = jest.fn();

        renderSportsbookReceipt({
          selections: ["some selection", "another selection"],
          dispatchReUseSelections: dispatchReUseSelectionsMock,
        });

        BetslipSportsbookReceiptPanel.mock.calls[0][0].onReUseSelectionsClick();

        expect(dispatchReUseSelectionsMock).toHaveBeenCalledWith(["some selection", "another selection"]);
        expect(dispatchReUseSelectionsMock).toHaveBeenCalledTimes(1);
      });
    });

    describe("onBetIdCopy", () => {
      it("should call dispatchCopyBetIdAction", () => {
        const dispatchCopyBetIdActionMock = jest.fn();

        renderSportsbookReceipt({
          selections: ["some selection", "another selection"],
          dispatchCopyBetIdAction: dispatchCopyBetIdActionMock,
        });

        BetslipSportsbookReceiptPanel.mock.calls[0][0].onBetIdCopy();

        expect(dispatchCopyBetIdActionMock).toHaveBeenCalledWith();
        expect(dispatchCopyBetIdActionMock).toHaveBeenCalledTimes(1);
      });
    });

    describe("onRegulatorBetIdCopy", () => {
      it("should call dispatchCopyRegulatorBetIdAction", () => {
        const dispatchCopyRegulatorBetIdActionMock = jest.fn();

        renderSportsbookReceipt({
          selections: ["some selection", "another selection"],
          dispatchCopyRegulatorBetIdAction: dispatchCopyRegulatorBetIdActionMock,
        });

        BetslipSportsbookReceiptPanel.mock.calls[0][0].onRegulatorBetIdCopy();

        expect(dispatchCopyRegulatorBetIdActionMock).toHaveBeenCalledWith();
        expect(dispatchCopyRegulatorBetIdActionMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
