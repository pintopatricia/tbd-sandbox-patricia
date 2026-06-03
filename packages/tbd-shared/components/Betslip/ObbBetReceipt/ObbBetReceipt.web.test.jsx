import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { ObbBetReceipt } from "./ObbBetReceipt.web";

import { SportsbookReceiptPanel } from "../SportsbookReceipt/snowflakes/SportsbookReceiptPanel/SportsbookReceiptPanel.web";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn(() => ({
    current: null,
  })),
}));

jest.mock("../SportsbookReceipt/snowflakes/SportsbookReceiptPanel/SportsbookReceiptPanel.web", () => ({
  SportsbookReceiptPanel: jest.fn((props) => {
    // mock calls of empty functions to add coverage
    props.onReUseSelectionsClick?.();
    props.onBetIdCopy?.();
    props.onRegulatorBetIdCopy?.();

    return <sportsbook-receipt-place-panel-mock {...props} />;
  }),
}));

const i18nLabelsMock = {
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

const DEFAULT_PROPS = {
  i18n: i18nLabelsMock,
  betSelections: [],
  singles: [],
  multiples: [],
  totalReturns: "4.00",
  totalStake: "2.0",
  dispatchAccordionToggle: jest.fn(),
};

function renderObbBetReceipt(props = {}) {
  const componentProps = { ...DEFAULT_PROPS, ...props };

  return render(<ObbBetReceipt {...componentProps} />);
}

describe("ObbBetReceipt", () => {
  afterEach(jest.clearAllMocks);

  describe("when it is the initial render", () => {
    describe("when there is all necessary data", () => {
      it("should call BetslipSportsbookReceiptPanel", () => {
        renderObbBetReceipt({});

        expect(SportsbookReceiptPanel).toHaveBeenCalledWith(
          {
            selections: [],
            boostedMultiples: [],
            multiples: [],
            singles: [],
            casts: [],
            betBuilders: [],
            totalStake: "2.0",
            potentialReturns: "4.00",
            i18n: i18nLabelsMock,
            onTitleClick: expect.any(Function),
            onReUseSelectionsClick: expect.any(Function),
            onBetIdCopy: expect.any(Function),
            onRegulatorBetIdCopy: expect.any(Function),
            isDesktop: false,
            displayAllSubtitleTextSingles: true,
            showReuseSelectionsButton: false,
          },
          undefined,
        );
        expect(SportsbookReceiptPanel).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when performing interactions", () => {
    describe("onTitleClick", () => {
      it("should call dispatchAccordionToggle", () => {
        const dispatchAccordionToggleMock = jest.fn();

        renderObbBetReceipt({ dispatchAccordionToggle: dispatchAccordionToggleMock });

        SportsbookReceiptPanel.mock.calls[0][0].onTitleClick(true);

        expect(dispatchAccordionToggleMock).toHaveBeenCalledWith(true);
        expect(dispatchAccordionToggleMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
