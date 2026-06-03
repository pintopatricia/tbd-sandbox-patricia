import { render } from "@testing-library/react-native";
import { SportsbookReceiptPanel } from "./snowflakes/SportsbookReceiptPanel/SportsbookReceiptPanel.native";
import { SportsbookReceipt } from "./SportsbookReceipt.native";
import ConnectedNotificationsSubscription from "../../NotificationsSubscription";
import { NotificationsViewMode } from "../../NotificationsSubscription/map-to-props-factory";
import NotificationsSubscription from "../../NotificationsSubscription/NotificationsSubscription.native";

jest.mock("./snowflakes/SportsbookReceiptPanel/SportsbookReceiptPanel.native", () => ({
  SportsbookReceiptPanel: jest.fn((props) => (
    <>
      {props.notificationsSubscription}
      <sportsbook-receipt-place-panel-mock />
    </>
  )),
}));

jest.mock("../../SkyBetClubTrackerCard/view/SkyBetClubTrackerCard.native", () =>
  jest.fn((props) => <sky-bet-club-tracker-mock {...props} />),
);

jest.mock("@ppb/tbd-router/native", () => ({ navigate: jest.fn() }));

jest.mock("../../NotificationsSubscription/NotificationsSubscription.native", () =>
  jest.fn((props) => <notifications-subscription-mock {...props} />),
);

jest.mock("../../NotificationsSubscription", () =>
  jest.fn((props) => <connected-notifications-subscription-mock {...props} />),
);

jest.mock("react-native-device-info", () => ({}));

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
  multiples = [],
  casts = [],
  betBuilders = [],
  multiBetBuilder = {},
  multiBetBuilderGroups = {},
  potentialReturns = "1.11",
  totalStake = "2.22",
  totalOriginalReturns = "1.50",
  isOddsBoosted = true,
  i18n = i18nLabelsMock,
  hasShownReceiptIds = false,
  dispatchAccordionToggle = jest.fn(),
  dispatchReUseSelections = jest.fn(),
  dispatchCopyBetIdAction = jest.fn(),
  dispatchCopyRegulatorBetIdAction = jest.fn(),
  showTopContent = false,
  oneLineBets = [],
}) {
  return render(
    <SportsbookReceipt
      oneLineBets={oneLineBets}
      singles={singles}
      multiples={multiples}
      casts={casts}
      betBuilders={betBuilders}
      multiBetBuilder={multiBetBuilder}
      multiBetBuilderGroups={multiBetBuilderGroups}
      selections={selections}
      potentialReturns={potentialReturns}
      totalOriginalReturns={totalOriginalReturns}
      totalStake={totalStake}
      isOddsBoosted={isOddsBoosted}
      dispatchAccordionToggle={dispatchAccordionToggle}
      dispatchReUseSelections={dispatchReUseSelections}
      i18n={i18n}
      hasShownReceiptIds={hasShownReceiptIds}
      dispatchCopyBetIdAction={dispatchCopyBetIdAction}
      dispatchCopyRegulatorBetIdAction={dispatchCopyRegulatorBetIdAction}
      showTopContent={showTopContent}
    />,
  );
}

describe("SportsbookReceipt", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("when it is the initial render", () => {
    describe("when there is all necessary data", () => {
      it("should call SportsbookReceiptPanel", () => {
        renderSportsbookReceipt({});

        expect(SportsbookReceiptPanel).toHaveBeenCalledWith(
          {
            selections: [],
            multiples: [],
            singles: [],
            casts: [],
            betBuilders: [],
            multiBetBuilder: {},
            multiBetBuilderGroups: {},
            totalStake: "2.22",
            totalOriginalReturns: "1.50",
            potentialReturns: "1.11",
            isOddsBoosted: true,
            notificationsSubscription: expect.any(Object),
            i18n: i18nLabelsMock,
            onTitleClick: expect.any(Function),
            onReUseSelectionsClick: expect.any(Function),
            hasShownReceiptIds: false,
            onBetIdCopy: expect.any(Function),
            onRegulatorBetIdCopy: expect.any(Function),
            topContent: null,
            oneLineBets: [],
            showReuseSelectionsButton: true,
          },
          undefined,
        );
        expect(ConnectedNotificationsSubscription).toHaveBeenCalledWith(
          {
            viewMode: NotificationsViewMode.BET_RECEIPT,
            component: NotificationsSubscription,
          },
          undefined,
        );
        expect(SportsbookReceiptPanel).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when performing interactions", () => {
    describe("onTitleClick", () => {
      it("should call dispatckAccordionToggle", () => {
        const dispatchAccordionToggleMock = jest.fn();

        renderSportsbookReceipt({ dispatchAccordionToggle: dispatchAccordionToggleMock });

        SportsbookReceiptPanel.mock.calls[0][0].onTitleClick("mockArg");

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

        SportsbookReceiptPanel.mock.calls[0][0].onReUseSelectionsClick();

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

        SportsbookReceiptPanel.mock.calls[0][0].onBetIdCopy();

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

        SportsbookReceiptPanel.mock.calls[0][0].onRegulatorBetIdCopy();

        expect(dispatchCopyRegulatorBetIdActionMock).toHaveBeenCalledWith();
        expect(dispatchCopyRegulatorBetIdActionMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
