import { render } from "@testing-library/react-native";

import { SportsbookReceiptPanel } from "../SportsbookReceipt/snowflakes/SportsbookReceiptPanel/SportsbookReceiptPanel.native";
import { ObbBetReceipt } from "./ObbBetReceipt.native";
import ConnectedNotificationsSubscription from "../../NotificationsSubscription";
import { NotificationsViewMode } from "../../NotificationsSubscription/map-to-props-factory";
import NotificationsSubscription from "../../NotificationsSubscription/NotificationsSubscription.native";

jest.mock("../SportsbookReceipt/snowflakes/SportsbookReceiptPanel/SportsbookReceiptPanel.native", () => ({
  SportsbookReceiptPanel: jest.fn((props) => {
    // mock calls of empty functions to add coverage
    props.onReUseSelectionsClick?.();
    props.onBetIdCopy?.();
    props.onRegulatorBetIdCopy?.();

    return (
      <>
        {props.notificationsSubscription}
        <sportsbook-receipt-place-panel-mock {...props} />
      </>
    );
  }),
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

const i18nMock = {
  totalStakeLabel: "totalStakeLabel",
  totalReturnsLabel: "totalReturnsLabel",
  receiptTitle: "receiptTitle",
  selectionsLabel: "selectionsLabel",
  oddsLabel: "oddsLabel",
  stakeLabel: "stakeLabel",
  returnsLabel: "returnsLabel",
  singlesTitleLabel: "singlesTitleLabel",
  betBuilderTitleLabel: "betBuilderTitleLabel",
  receiptStatusLabel: "receiptStatusLabel",
  betReceiptIdLabel: "betReceiptIdLabel",
  regulatorBetIdLabel: "regulatorBetIdLabel",
  confirmationMessage: "confirmationMessage",
  multiplesTitleLabel: "",
  boostedMultiplesTitleLabel: "",
  castsTitleLabel: "",
  multiBetBuilderTitleLabel: "",
  eachWayLabel: "",
  accaInsuranceLabel: "",
  linesLabel: "",
  oddsBoostLabel: "",
  reUseSelectionsLabel: "",
  guaranteedPriceLabel: "",
};

const defaultMock = {
  i18n: i18nMock,
  betSelections: [],
  singles: [],
  multiples: [],
  totalReturns: "4.00",
  totalStake: "2.0",
  dispatchAccordionToggle: jest.fn(),
};

function renderObbBetReceipt(props = {}) {
  const { betSelections, i18n, totalReturns, totalStake, singles, multiples, dispatchAccordionToggle } = {
    ...defaultMock,
    ...props,
  };

  return render(
    <ObbBetReceipt
      betSelections={betSelections}
      i18n={i18n}
      totalReturns={totalReturns}
      totalStake={totalStake}
      singles={singles}
      multiples={multiples}
      dispatchAccordionToggle={dispatchAccordionToggle}
    />,
  );
}

describe("ObbBetReceipt", () => {
  beforeEach(() => jest.clearAllMocks());
  describe("when it is the initial render", () => {
    describe("when there is all necessary data", () => {
      it("should call SportsbookReceiptPanel", () => {
        renderObbBetReceipt({});

        expect(SportsbookReceiptPanel).toHaveBeenCalledWith(
          {
            selections: [],
            singles: [],
            displayAllSubtitleTextSingles: true,
            betBuilders: [],
            boostedMultiples: [],
            casts: [],
            i18n: i18nMock,
            multiples: [],
            notificationsSubscription: expect.any(Object),
            onBetIdCopy: expect.any(Function),
            onTitleClick: expect.any(Function),
            onReUseSelectionsClick: expect.any(Function),
            onRegulatorBetIdCopy: expect.any(Function),
            potentialReturns: "4.00",
            totalStake: "2.0",
            showReuseSelectionsButton: false,
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

        renderObbBetReceipt({ dispatchAccordionToggle: dispatchAccordionToggleMock });

        SportsbookReceiptPanel.mock.calls[0][0].onTitleClick(false);

        expect(dispatchAccordionToggleMock).toHaveBeenCalledWith(false);
        expect(dispatchAccordionToggleMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
