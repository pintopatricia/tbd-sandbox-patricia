import { Overlay } from "@ppb/the-wall-web";
import { render } from "@testing-library/react/dist/pure";
import Receipt from "./Receipt.web";
import styles from "./Receipt.web.css";
import { ReceiptPanel } from "./snowflakes/ReceiptPanel/ReceiptPanel.web";

jest.mock("@ppb/the-wall-web", () => ({
  Overlay: jest.fn(() => <overlay-mock></overlay-mock>),
}));

jest.mock("./snowflakes/ReceiptPanel/ReceiptPanel.web", () => ({
  ReceiptPanel: jest.fn(({ children, ...props }) => <receipt-panel-mock {...props}>{children}</receipt-panel-mock>),
}));

jest.mock("@ppb/the-wall-web/hooks/useDisableBodyScroll", () => ({
  useDisableBodyScroll: jest.fn(),
}));

const spy = jest.fn();

function renderReceipt({
  entityURN,
  detailTitle = "detailTitle",
  detailSubtitle = "detailSubtitle",
  receiptTitle = "receiptTitle",
  segmentLeftLabel = "segmentLeftLabel",
  segmentLeftValue = "segmentLeftValue",
  buttonText = "buttonText",
  segmentRightLabel = "segmentRightLabel",
  segmentRightValue = "segmentRightValue",
  errorMessage = "errorMessage",
  errorDetail = "errorDetail",
  dispatchOnReceiptClose = spy,
}) {
  return render(
    <Receipt
      entityURN={entityURN}
      receiptTitle={receiptTitle}
      detailTitle={detailTitle}
      detailSubtitle={detailSubtitle}
      segmentLeftLabel={segmentLeftLabel}
      segmentLeftValue={segmentLeftValue}
      segmentRightLabel={segmentRightLabel}
      segmentRightValue={segmentRightValue}
      buttonText={buttonText}
      errorMessage={errorMessage}
      errorDetail={errorDetail}
      dispatchOnReceiptClose={dispatchOnReceiptClose}
    />,
  );
}

describe("Receipt Component", () => {
  let result;
  describe("when entityURN is undefined", () => {
    beforeAll(() => {
      renderReceipt({});
    });

    it("should not render the cashout receipt panel", () => {
      expect(ReceiptPanel).not.toHaveBeenCalled();
    });
  });

  describe("when entityURN is defined", () => {
    beforeAll(() => {
      result = renderReceipt({
        entityURN: "entityURN",
      });
    });

    it("should render the receipt with the correct style", () => {
      const { container } = result;
      const divReceiptPanel = container.getElementsByClassName(styles.receiptPanel)[0];

      expect(divReceiptPanel).toBeTruthy();
    });

    it("should render the cashout receipt panel with the correct props", () => {
      expect(ReceiptPanel).toHaveBeenCalledTimes(1);
      expect(ReceiptPanel).toHaveBeenCalledWith(
        {
          receiptTitle: "receiptTitle",
          detailTitle: "detailTitle",
          detailSubtitle: "detailSubtitle",
          segmentLeftLabel: "segmentLeftLabel",
          segmentLeftValue: "segmentLeftValue",
          segmentRightValue: "segmentRightValue",
          segmentRightLabel: "segmentRightLabel",
          buttonText: "buttonText",
          errorMessage: "errorMessage",
          errorDetail: "errorDetail",
          onDismissPress: expect.any(Function),
        },
        undefined,
      );
    });

    describe("and onDismissPress trigger", () => {
      it("should dispatchOnReceiptClose", () => {
        renderReceipt({});
        const { onDismissPress } = ReceiptPanel.mock.calls[0][0];
        onDismissPress();

        expect(spy).toHaveBeenCalledWith("entityURN");
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when is an error receipt", () => {
    it("should render the receipt overlay", () => {
      renderReceipt({
        entityURN: "entityURN",
        errorMessage: "error message",
      });

      expect(Overlay).toHaveBeenCalledWith({ fullPageOverlay: true }, undefined);
    });
  });

  describe("when is not an error receipt", () => {
    it("should not render the receipt overlay", () => {
      jest.clearAllMocks();
      renderReceipt({
        entityURN: "entityURN",
        errorMessage: null,
      });

      expect(Overlay).not.toHaveBeenCalled();
    });
  });
});
