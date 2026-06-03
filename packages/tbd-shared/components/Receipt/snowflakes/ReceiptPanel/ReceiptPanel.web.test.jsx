import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { AlertType, BetDetailsColor, BetDetailsAction } from "@ppb/the-wall-common/types";
import { ReceiptTitle, BetDetails, BetSegments, Alert } from "@ppb/the-wall-web";
import { ReceiptPanel } from "./ReceiptPanel.web";

jest.mock("@ppb/the-wall-web", () => ({
  ReceiptTitle: jest.fn(() => <receipt-title-mock />),
  Alert: jest.fn(() => <alerts-mock />),
  BetSegments: jest.fn(() => <bet-segment-mock />),
  BetDetails: jest.fn(() => <bet-details-mock />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  spacings: {},
  typography: {},
}));

const onDismissPressMock = jest.fn();

const dummyReceipt = {
  receiptTitle: "receiptTitle",
  detailTitle: "Selection",
  detailSubtitle: "Market - Event Name",
  segmentLeftValue: "2.1€",
  segmentLeftLabel: "Label",
  segmentRightValue: "£10.5",
  segmentRightLabel: "profitOrLiabilityLabel",
  buttonText: "Done",
  onDismissPress: onDismissPressMock,
};

let queryByTestId;

function renderReceiptPanel(receiptProps, isChildrenAvailable) {
  return !isChildrenAvailable
    ? render(<ReceiptPanel {...receiptProps} />)
    : render(
        <ReceiptPanel {...receiptProps}>
          <span data-testid="children-mock">Children</span>
        </ReceiptPanel>,
      );
}

describe("ReceiptPanel", () => {
  beforeEach(jest.clearAllMocks);

  describe("ReceiptTitle", () => {
    it("should have a proper title and dismiss button", () => {
      renderReceiptPanel(dummyReceipt);

      expect(ReceiptTitle.mock.calls[0][0].title).toEqual("receiptTitle");
      expect(ReceiptTitle.mock.calls[0][0].buttonText).toEqual("Done");
      expect(ReceiptTitle.mock.calls[0][0].onButtonClick).toBe(onDismissPressMock);
      expect(ReceiptTitle).toHaveBeenCalledTimes(1);
    });
  });

  describe("and no error is available", () => {
    it("should display a receipt detail", () => {
      renderReceiptPanel(dummyReceipt);

      expect(BetDetails).toHaveBeenCalledTimes(1);
      expect(BetDetails).toHaveBeenCalledWith(
        {
          tagName: "div",
          title: dummyReceipt.detailTitle,
          subtitle: dummyReceipt.detailSubtitle,
          color: BetDetailsColor.Grey,
          action: BetDetailsAction.None,
        },
        undefined,
      );
    });

    describe("and the mandatory segment fields are available", () => {
      it("should display a receipt segment", () => {
        renderReceiptPanel(dummyReceipt);

        expect(BetSegments).toHaveBeenCalledTimes(1);
        expect(BetSegments).toHaveBeenCalledWith(
          {
            leftValue: dummyReceipt.segmentLeftValue,
            leftLabel: dummyReceipt.segmentLeftLabel,
            rightValue: dummyReceipt.segmentRightValue,
            rightLabel: dummyReceipt.segmentRightLabel,
          },
          undefined,
        );
      });

      describe("and the mandatory segment fields are not all available", () => {
        it("should display a receipt segment", () => {
          renderReceiptPanel({ ...dummyReceipt, segmentLeftValue: undefined });

          expect(BetSegments).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("and an error is available", () => {
    beforeEach(() => {
      renderReceiptPanel({
        ...dummyReceipt,
        errorMessage: "error message",
      });
    });

    it("should display a error title", () => {
      expect(ReceiptTitle).toHaveBeenCalledWith(
        {
          title: "receiptTitle",
          buttonText: "Done",
          onButtonClick: onDismissPressMock,
        },
        undefined,
      );
    });

    it("should display a error notification", () => {
      expect(Alert).toHaveBeenCalledTimes(1);
      expect(Alert).toHaveBeenCalledWith(
        {
          type: AlertType.Error,
          message: "error message",
        },
        undefined,
      );
    });

    it("should hide the detail and segment part", () => {
      expect(BetDetails).not.toHaveBeenCalled();
      expect(BetSegments).not.toHaveBeenCalled();
    });
  });

  describe("when children is available", () => {
    beforeEach(() => {
      ({ queryByTestId } = renderReceiptPanel(
        {
          ...dummyReceipt,
        },
        true,
      ));
    });

    it("should display a title", () => {
      expect(ReceiptTitle).toHaveBeenCalledWith(
        {
          title: "receiptTitle",
          buttonText: "Done",
          onButtonClick: onDismissPressMock,
        },
        undefined,
      );
    });

    it("should render the children", () => {
      expect(queryByTestId("children-mock")).not.toBeNull();
    });

    it("should hide the detail, segment part and the notification", () => {
      expect(BetDetails).not.toHaveBeenCalled();
      expect(BetSegments).not.toHaveBeenCalled();
      expect(Alert).not.toHaveBeenCalled();
    });
  });
});
