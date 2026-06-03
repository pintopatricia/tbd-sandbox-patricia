import { render } from "@testing-library/react-native";

import { Overlay } from "@ppb/the-wall-native";
import { ReceiptPanel } from "./snowflakes/ReceiptPanel/ReceiptPanel.native";
import Receipt from "./Receipt.native";
import styles from "./Receipt.native.styles";
import { RECEIPT, RECEIPT_MODAL } from "./Receipt.native.selectors";

jest.mock("@ppb/the-wall-native", () => ({
  Overlay: jest.fn(() => <overlay-mock></overlay-mock>),
}));

jest.mock("./snowflakes/ReceiptPanel/ReceiptPanel.native", () => ({
  ReceiptPanel: jest.fn(({ children, ...props }) => <receipt-panel-mock {...props}>{children}</receipt-panel-mock>),
}));

jest.mock("../ForbiddenContentCard", () =>
  jest.fn(() => <connected-forbidden-content data-testid="connected-forbidden-content" />),
);
jest.mock("../ForbiddenContentCard/ForbiddenContentCard.native", () =>
  jest.fn(() => <forbidden-content-mock data-testid="forbidden-content-native" />),
);

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: jest.fn(() => ({ top: 0, left: 0, bottom: 0, right: 0 })),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  stackings: {},
}));

const spy = jest.fn();

function renderReceipt({
  entityURN,
  isLoggedIn = true,
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
      isLoggedIn={isLoggedIn}
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
      expect(result.queryByTestId(RECEIPT)).toHaveStyle(styles.receiptPanel);
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

    describe("when isLoggedIn is false", () => {
      beforeAll(() => {
        result = renderReceipt({
          entityURN: "entityURN",
          isLoggedIn: false,
        });
      });

      it("shouldn't call the modal component", () => {
        expect(result.queryByTestId(RECEIPT_MODAL)).toBeNull();
      });

      it("should render the receipt panel with the correct props", () => {
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

      expect(Overlay).toHaveBeenCalledWith({}, undefined);
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
