import { Text } from "react-native";

import { render } from "@testing-library/react-native";

import { AlertType, BetDetailsColor, BetDetailsAction } from "@ppb/the-wall-common/types";

import { ReceiptTitle } from "@ppb/the-wall-native/components/BetReceipt/ReceiptTitle/ReceiptTitle";
import { Alert } from "@ppb/the-wall-native/components/Alert/Alert";
import { BetSegments } from "@ppb/the-wall-native/components/BetReceipt/BetSegments/BetSegments";
import { BetDetails } from "@ppb/the-wall-native/components/BetDetails/BetDetails";
import { ReceiptPanel } from "./ReceiptPanel.native";

jest.mock("@ppb/the-wall-native/components/BetReceipt/ReceiptTitle/ReceiptTitle", () => ({
  ReceiptTitle: jest.fn(() => <receipt-title-mock />),
}));

jest.mock("@ppb/the-wall-native/components/Alert/Alert", () => ({
  Alert: jest.fn(() => <alerts-mock />),
}));

jest.mock("@ppb/the-wall-native/components/BetReceipt/BetSegments/BetSegments", () => ({
  BetSegments: jest.fn(() => <bet-segment-mock />),
}));

jest.mock("@ppb/the-wall-native/components/BetDetails/BetDetails", () => ({
  BetDetails: jest.fn(() => <bet-details-mock />),
}));

jest.mock("react-native-svg", () => ({ SvgCssUri: jest.fn(() => <svg-css-uri-mock />) }));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    ReceiptPanelBorderRadius: {},
    ReceiptPanelTitleIconColour: "ReceiptPanelTitleIconColour",
    ReceiptPanelShadow: {
      shadowColor: "shadowColor",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 1,
    },
  },
}));
jest.mock("../../../../helpers/i18n", () => ({
  i18n: ({ key }) => key,
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
  return isChildrenAvailable
    ? render(
        <ReceiptPanel {...receiptProps}>
          <Text testID="children-mock">Children</Text>
        </ReceiptPanel>,
      )
    : render(<ReceiptPanel {...receiptProps} />);
}

describe("ReceiptPanel", () => {
  beforeEach(jest.clearAllMocks);

  describe("ReceiptTitle", () => {
    it("should have a proper title and dismiss button", () => {
      renderReceiptPanel(dummyReceipt);

      expect(ReceiptTitle.mock.calls[0][0].title).toEqual("receiptTitle");
      expect(ReceiptTitle.mock.calls[0][0].buttonText).toEqual("Done");
      expect(ReceiptTitle.mock.calls[0][0].onButtonPress).toBe(onDismissPressMock);
      expect(ReceiptTitle).toHaveBeenCalledTimes(1);
    });
  });

  describe("and no error is available", () => {
    it("should display a receipt detail", () => {
      renderReceiptPanel({ ...dummyReceipt });

      expect(BetDetails).toHaveBeenCalledTimes(1);
      expect(BetDetails).toHaveBeenCalledWith(
        {
          title: dummyReceipt.detailTitle,
          subtitle: dummyReceipt.detailSubtitle,
          color: BetDetailsColor.Grey,
          action: BetDetailsAction.None,
          i18n: {
            Remove: "I18N.ACCESSIBILITY.REMOVE_BET_SELECTION",
            Edit: "I18N.ACCESSIBILITY.EDIT_BET",
            None: "I18N.ACCESSIBILITY.NO_ACTION_AVAILABLE",
          },
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
          onButtonPress: onDismissPressMock,
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
          onButtonPress: onDismissPressMock,
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
