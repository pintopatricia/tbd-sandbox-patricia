import { UI__RECEIPT_CLOSE } from "@ppb/tbd-store/actions/receipt";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { i18n } from "../../helpers/i18n";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";

const USER_DETAILS_MOCK = { userDetailsProps: "userDetailsData", loggedIn: true };

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => USER_DETAILS_MOCK),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(() => "TRANSLATED_LABEL"),
}));

jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn(() => "FORMATTED_NUMBER"),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

let props;

const CASHOUT_RECEIPT = {
  entityURN: "ppb:sbkCashoutQuote:1088320641",
  receiptTitle: {
    translate: {
      key: "I18N.CASHOUT.SUCCESS_TITLE",
    },
  },
  detailTitle: {
    translated: "Dortmund v Man City",
  },
  detailSubtitle: {
    translated: "Match Odds",
  },
  segmentLeftLabel: {
    translate: {
      key: "I18N.CASHOUT.TITLE",
    },
  },
  segmentLeftValue: {
    value: 0.11,
    decimalPlaces: 2,
  },
  segmentRightLabel: {
    translate: {
      key: "I18N.CASHOUT.PROFIT",
    },
  },
  segmentRightValue: undefined,
};

const getMockState = (receipt) => ({
  layouts: {
    cards: {
      receipt,
    },
  },
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("makeMapStateToProps", () => {
  describe("when cashout receipt is not defined", () => {
    beforeAll(() => {
      props = makeMapStateToProps()(getMockState(null), {});
    });

    it("should return empty object", () => {
      expect(props).toEqual({});
    });
  });

  describe("when cashout receipt is defined", () => {
    beforeEach(() => {
      props = makeMapStateToProps()(getMockState(CASHOUT_RECEIPT), {});
    });

    it("should translate all non translated", () => {
      expect(i18n).toHaveBeenCalledTimes(3);
      expect(i18n).toHaveBeenCalledWith(CASHOUT_RECEIPT.receiptTitle.translate);
      expect(i18n).toHaveBeenCalledWith(CASHOUT_RECEIPT.segmentLeftLabel.translate);
      expect(i18n).toHaveBeenCalledWith(CASHOUT_RECEIPT.segmentRightLabel.translate);
    });

    it("should format all defined receipt values", () => {
      expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledTimes(1);
      expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
        ...USER_DETAILS_MOCK,
        ...CASHOUT_RECEIPT.segmentLeftValue,
      });
    });

    it("should return the expected View Model", () => {
      expect(props).toEqual({
        entityURN: CASHOUT_RECEIPT.entityURN,
        isLoggedIn: true,
        receiptTitle: "TRANSLATED_LABEL",
        detailTitle: CASHOUT_RECEIPT.detailTitle.translated,
        detailSubtitle: CASHOUT_RECEIPT.detailSubtitle.translated,
        segmentLeftLabel: "TRANSLATED_LABEL",
        segmentLeftValue: "FORMATTED_NUMBER",
        segmentRightLabel: "TRANSLATED_LABEL",
        segmentRightValue: undefined,
        buttonText: undefined,
        errorMessage: undefined,
        errorDetail: undefined,
      });
    });
  });

  describe("when cashout receipt is defined and `getUserDetails` throws", () => {
    const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

    beforeEach(() => {
      getUserDetails.mockImplementationOnce(() => {
        throw new Error(GET_USER_DETAILS_ERROR);
      });
    });

    it("should call console.error with the error thrown by `getUserDetails`", () => {
      makeMapStateToProps()(getMockState(CASHOUT_RECEIPT), {});

      expect(global.console.error).toHaveBeenCalledWith(new Error(GET_USER_DETAILS_ERROR));
    });

    it("should return an empty object", () => {
      expect(makeMapStateToProps()(getMockState(CASHOUT_RECEIPT), {})).toEqual({});
    });
  });
});

describe("mapDispatchToProps", () => {
  describe("on dispatchOnReceiptClose trigger", () => {
    it("should dispatch ReceiptCloseAction", () => {
      const { dispatchOnReceiptClose } = mapDispatchToProps;

      expect(dispatchOnReceiptClose("entityURN")).toEqual({
        type: UI__RECEIPT_CLOSE,

        payload: {
          entityURN: "entityURN",
        },
      });
    });
  });
});
