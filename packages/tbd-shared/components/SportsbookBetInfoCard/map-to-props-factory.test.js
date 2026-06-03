import {
  UI__MY_BETS_COPY_BET_ID,
  UI__MY_BETS_COPY_REGULATOR_BET_ID,
  UI__MY_BETS_COPY_DEVICE_ID,
  UI__MY_BETS_SBK_ADD_PREVIOUS_SELECTIONS_CLICK,
} from "@ppb/tbd-store/actions/my-bets";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import { BetInfoItemMode } from "@ppb/the-wall-common/types";
import { createGetMyBetsFiltersStateSelector } from "@ppb/tbd-store/state/layout/cards/my-bets/my-bets-selectors";

import { formatFullDateAndTime } from "../../helpers/dates";
import { i18n } from "../../helpers/i18n";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const USER_DETAILS_MOCK = {
  localeCodeBcp47: "locale",
  jurisdiction: {},
  timezone: "timezone",
};
const getUserDetailsSelector = jest.fn(() => USER_DETAILS_MOCK);

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetailsSelector),
}));

const getSportsbookBetInfoCard = jest.fn((sportsbookbetinfos, urn) => sportsbookbetinfos[urn]);

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getSportsbookBetInfoCard),
}));

const getSportsbookBetByBetId = jest.fn((sportsbookbets, urn) => sportsbookbets[urn]);
jest.mock("@ppb/tbd-store/state/betting/sportsbook-bets/sportsbook-bets-selectors", () => ({
  createSportsbookBetByBetReceiptIdSelector: jest.fn(() => getSportsbookBetByBetId),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(
    ({ key, interpolationValues }) =>
      `${key}${
        interpolationValues
          ? Object.keys(interpolationValues).map(
              (interpolationValuesKey) =>
                ` ${interpolationValuesKey.toUpperCase()}:${interpolationValues[interpolationValuesKey]}`,
            )
          : ""
      }`,
  ),
}));

jest.mock("../../helpers/dates", () => ({
  formatFullDateAndTime: jest.fn((time) => `TIME_${time}`),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/my-bets/my-bets-selectors", () => ({
  createGetMyBetsFiltersStateSelector: jest.fn(() => {}),
}));

const DEFAULT_STATE = {
  layouts: {
    cards: {
      sportsbookbetinfos: {
        "ppb:tbd:card:sbkBetInfo:923378353": {
          urn: "ppb:tbd:card:sbkBetInfo:923378353",
          betReceiptId: "betReceiptId",
          placedDate: "2023-04-25T00:00:00.000Z",
          product: "sportsbook",
          betSelections: [
            {
              marketUrn: "ppb:sbkMarket:123.123456789",
              runnerUrn: "ppb:sbkRunner:1234",
            },
          ],
        },
        "ppb:tbd:card:sbkBetInfo:923378354": {
          urn: "ppb:tbd:card:sbkBetInfo:923378354",
          betReceiptId: "betReceiptId2",
          regulatorBetId: "regulatorBetId",
          placedDate: "2023-04-25T00:00:00.000Z",
          settledDate: "2023-04-27T10:00:00.000Z",
          deviceId: "deviceId",
        },
      },
    },
    views: {
      mybets: {},
    },
  },
  betting: {
    sportsbookbets: {
      "ppb:tbd:card:sbkBet:123456789": {
        urn: "ppb:tbd:card:sbkBet:123456789",
        betReceiptId: "betReceiptId",
        isLotteries: false,
      },
    },
  },
  entities: {
    brandSettings: { SPORTSBOOK_BET_BUTTON_ANIMATION: false },
  },
};

const setup = (state, containerProps = {}) => makeMapStateToProps()(state, containerProps);

describe("makeMapStateToProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when getSportsbookBetInfoCard does not return a sportsbook bet info card", () => {
    it("should return an empty object", () => {
      getSportsbookBetInfoCard.mockReturnValueOnce(undefined);
      createGetMyBetsFiltersStateSelector.mockReturnValue(() => ({ orderTypeFilter: "open" }));
      expect(setup(DEFAULT_STATE)).toEqual({});
    });
  });

  describe("when urn corresponds to bet info with only placed date and bet receipt id", () => {
    beforeEach(() => {
      createGetMyBetsFiltersStateSelector.mockReturnValue(() => ({ orderTypeFilter: "open" }));
      getSportsbookBetByBetId.mockReturnValue({
        urn: "ppb:tbd:card:sbkBet:123456789",
        betReceiptId: "betReceiptId",
        isLotteries: false,
      });
    });
    it("should call formatFullDateAndTime with the correct parameters", () => {
      setup(DEFAULT_STATE, {
        urn: "ppb:tbd:card:sbkBetInfo:923378353",
      });

      expect(formatFullDateAndTime).toHaveBeenCalledTimes(1);
      expect(formatFullDateAndTime).toHaveBeenCalledWith(
        new Date("2023-04-25T00:00:00.000Z"),
        USER_DETAILS_MOCK.localeCodeBcp47,
        USER_DETAILS_MOCK.timezone,
      );
    });

    it("should return an object with data", () => {
      expect(
        setup(DEFAULT_STATE, {
          urn: "ppb:tbd:card:sbkBetInfo:923378353",
        }),
      ).toEqual({
        animated: false,
        labels: {
          betId: "I18N.MYBETS.BETID",
          placedDate: "I18N.MYBETS.PLACED_DATE_TIME",
          regulatorBetId: "I18N.MYBETS.BETID_AUX",
          settledDate: "I18N.MYBETS.SETTLED_DATE_TIME",
          deviceId: "I18N.MYBETS.DEVICE_ID",
          reUseSelections: "I18N.BETSLIP.RE_USE_SELECTIONS",
        },
        betId: "betReceiptId",
        deviceId: undefined,
        isSettledView: false,
        betSelections: [
          {
            marketUrn: "ppb:sbkMarket:123.123456789",
            runnerUrn: "ppb:sbkRunner:1234",
          },
        ],
        product: "sportsbook",
        placedDateItem: {
          mode: BetInfoItemMode.WITHOUT_COPY,
          title: "I18N.MYBETS.PLACED_DATE_TIME",
          value: `TIME_${new Date("2023-04-25T00:00:00.002Z")}`,
        },
        showReuseSelectionsButton: true,
      });
    });
  });

  describe("when urn corresponds to bet info with all data", () => {
    it("should call formatFullDateAndTime twice with the correct parameters", () => {
      createGetMyBetsFiltersStateSelector.mockReturnValue(() => ({ orderTypeFilter: "settled" }));
      setup(DEFAULT_STATE, {
        urn: "ppb:tbd:card:sbkBetInfo:923378354",
      });

      expect(formatFullDateAndTime).toHaveBeenCalledTimes(2);
      expect(formatFullDateAndTime).toHaveBeenNthCalledWith(
        1,
        new Date("2023-04-25T00:00:00.000Z"),
        USER_DETAILS_MOCK.localeCodeBcp47,
        USER_DETAILS_MOCK.timezone,
      );
      expect(formatFullDateAndTime).toHaveBeenNthCalledWith(
        2,
        new Date("2023-04-27T10:00:00.000Z"),
        USER_DETAILS_MOCK.localeCodeBcp47,
        USER_DETAILS_MOCK.timezone,
      );
    });

    it("should return an object with all data", () => {
      expect(
        setup(DEFAULT_STATE, {
          urn: "ppb:tbd:card:sbkBetInfo:923378354",
        }),
      ).toEqual({
        labels: {
          betId: "I18N.MYBETS.BETID",
          placedDate: "I18N.MYBETS.PLACED_DATE_TIME",
          regulatorBetId: "I18N.MYBETS.BETID_AUX",
          settledDate: "I18N.MYBETS.SETTLED_DATE_TIME",
          deviceId: "I18N.MYBETS.DEVICE_ID",
          reUseSelections: "I18N.BETSLIP.RE_USE_SELECTIONS",
        },
        betId: "betReceiptId2",
        regulatorBetId: "regulatorBetId",
        deviceId: undefined,
        isSettledView: true,
        placedDateItem: {
          mode: BetInfoItemMode.WITHOUT_COPY,
          title: "I18N.MYBETS.PLACED_DATE_TIME",
          value: `TIME_${new Date("2023-04-25T00:00:00.002Z")}`,
        },
        settledDateItem: {
          mode: BetInfoItemMode.WITHOUT_COPY,
          title: "I18N.MYBETS.SETTLED_DATE_TIME",
          value: `TIME_${new Date("2023-04-27T10:00:00.002Z")}`,
        },
        animated: false,
        showReuseSelectionsButton: true,
      });
    });

    describe("when jurisdiction is BRAZIL", () => {
      beforeEach(() => {
        getUserDetailsSelector.mockReturnValueOnce({
          ...USER_DETAILS_MOCK,
          jurisdiction: { jurisdiction: Jurisdiction.BRAZIL },
        });
      });

      it("should return the deviceId", () => {
        expect(
          setup(DEFAULT_STATE, {
            urn: "ppb:tbd:card:sbkBetInfo:923378354",
          }),
        ).toEqual(
          expect.objectContaining({
            deviceId: "deviceId",
          }),
        );
      });
    });
  });

  describe("getStaticLabels", () => {
    let mapStateToProps;

    beforeEach(() => {
      mapStateToProps = makeMapStateToProps();
    });

    it("should invoke i18n for page on makeMapStateToProps call", () => {
      mapStateToProps(DEFAULT_STATE, { urn: "ppb:tbd:card:sbkBetInfo:923378353" });

      expect(i18n).toHaveBeenCalledTimes(6);
      expect(i18n).toHaveBeenNthCalledWith(1, { key: "I18N.MYBETS.BETID" });
      expect(i18n).toHaveBeenNthCalledWith(2, { key: "I18N.MYBETS.BETID_AUX" });
      expect(i18n).toHaveBeenNthCalledWith(3, { key: "I18N.MYBETS.PLACED_DATE_TIME" });
      expect(i18n).toHaveBeenNthCalledWith(4, { key: "I18N.MYBETS.SETTLED_DATE_TIME" });
      expect(i18n).toHaveBeenNthCalledWith(5, { key: "I18N.MYBETS.DEVICE_ID" });
      expect(i18n).toHaveBeenNthCalledWith(6, { key: "I18N.BETSLIP.RE_USE_SELECTIONS" });
    });

    it("should not call i18n again when locale code is the same", () => {
      getUserDetailsSelector.mockReturnValueOnce({ ...USER_DETAILS_MOCK, localeCode: "jp" });
      mapStateToProps(DEFAULT_STATE, { urn: "ppb:tbd:card:sbkBetInfo:923378353" });

      expect(i18n).toHaveBeenCalledTimes(6);
      expect(i18n).toHaveBeenNthCalledWith(1, { key: "I18N.MYBETS.BETID" });
      expect(i18n).toHaveBeenNthCalledWith(2, { key: "I18N.MYBETS.BETID_AUX" });
      expect(i18n).toHaveBeenNthCalledWith(3, { key: "I18N.MYBETS.PLACED_DATE_TIME" });
      expect(i18n).toHaveBeenNthCalledWith(4, { key: "I18N.MYBETS.SETTLED_DATE_TIME" });
      expect(i18n).toHaveBeenNthCalledWith(5, { key: "I18N.MYBETS.DEVICE_ID" });
      expect(i18n).toHaveBeenNthCalledWith(6, { key: "I18N.BETSLIP.RE_USE_SELECTIONS" });

      getUserDetailsSelector.mockReturnValueOnce({ ...USER_DETAILS_MOCK, localeCode: "jp" });
      mapStateToProps(DEFAULT_STATE, { urn: "ppb:tbd:card:sbkBetInfo:923378353" });
      expect(i18n).toHaveBeenCalledTimes(6);
    });

    it("should call i18n again when locale code is not the same", () => {
      getUserDetailsSelector.mockReturnValueOnce({ ...USER_DETAILS_MOCK, localeCode: "jp" });
      mapStateToProps(DEFAULT_STATE, { urn: "ppb:tbd:card:sbkBetInfo:923378353" });

      expect(i18n).toHaveBeenCalledTimes(6);
      expect(i18n).toHaveBeenNthCalledWith(1, { key: "I18N.MYBETS.BETID" });
      expect(i18n).toHaveBeenNthCalledWith(2, { key: "I18N.MYBETS.BETID_AUX" });
      expect(i18n).toHaveBeenNthCalledWith(3, { key: "I18N.MYBETS.PLACED_DATE_TIME" });
      expect(i18n).toHaveBeenNthCalledWith(4, { key: "I18N.MYBETS.SETTLED_DATE_TIME" });
      expect(i18n).toHaveBeenNthCalledWith(5, { key: "I18N.MYBETS.DEVICE_ID" });
      expect(i18n).toHaveBeenNthCalledWith(6, { key: "I18N.BETSLIP.RE_USE_SELECTIONS" });

      getUserDetailsSelector.mockReturnValueOnce({ ...USER_DETAILS_MOCK, localeCode: "en" });
      mapStateToProps(DEFAULT_STATE, { urn: "ppb:tbd:card:sbkBetInfo:923378353" });

      expect(i18n).toHaveBeenCalledTimes(12);
      expect(i18n).toHaveBeenNthCalledWith(7, { key: "I18N.MYBETS.BETID" });
      expect(i18n).toHaveBeenNthCalledWith(8, { key: "I18N.MYBETS.BETID_AUX" });
      expect(i18n).toHaveBeenNthCalledWith(9, { key: "I18N.MYBETS.PLACED_DATE_TIME" });
      expect(i18n).toHaveBeenNthCalledWith(10, { key: "I18N.MYBETS.SETTLED_DATE_TIME" });
      expect(i18n).toHaveBeenNthCalledWith(11, { key: "I18N.MYBETS.DEVICE_ID" });
      expect(i18n).toHaveBeenNthCalledWith(12, { key: "I18N.BETSLIP.RE_USE_SELECTIONS" });
    });
  });
});

describe("makeMapDispatchToProps", () => {
  const {
    dispatchCopyBetIdAction,
    dispatchCopyRegulatorBetIdAction,
    dispatchCopyDeviceIdAction,
    dispatchMyBetsSbkAddPreviousSelections,
  } = mapDispatchToProps;

  describe("dispatchCopyBetIdAction", () => {
    it("should dispatch a UI__MY_BETS_COPY_BET_ID action when it's called", () => {
      const action = dispatchCopyBetIdAction();

      expect(action).toEqual({
        type: UI__MY_BETS_COPY_BET_ID,
      });
    });
  });

  describe("dispatchCopyRegulatorBetIdAction", () => {
    it("should dispatch a UI__MY_BETS_COPY_REGULATOR_BET_ID action when it's called", () => {
      const action = dispatchCopyRegulatorBetIdAction();

      expect(action).toEqual({
        type: UI__MY_BETS_COPY_REGULATOR_BET_ID,
      });
    });
  });

  describe("dispatchCopyDeviceIdAction", () => {
    it("should dispatch a UI__MY_BETS_COPY_DEVICE_ID action when it's called", () => {
      const action = dispatchCopyDeviceIdAction();

      expect(action).toEqual({
        type: UI__MY_BETS_COPY_DEVICE_ID,
      });
    });
  });

  describe("dispatchMyBetsSbkAddPreviousSelections", () => {
    it("should dispatch a dispatchMyBetsSbkAddPreviousSelections when it's called", () => {
      createGetMyBetsFiltersStateSelector.mockReturnValue(() => ({ orderTypeFilter: "open" }));
      const action = dispatchMyBetsSbkAddPreviousSelections(
        {
          marketUrn: "ppb:sbkMarket:123.123456789",
          runnerUrn: "ppb:sbkRunner:1234",
        },
        "sportsbook",
      );

      expect(action).toEqual({
        type: UI__MY_BETS_SBK_ADD_PREVIOUS_SELECTIONS_CLICK,
        payload: {
          ensureSelectionsFromStore: false,
          group: "REAL",
          source: "open",
          selections: {
            marketUrn: "ppb:sbkMarket:123.123456789",
            runnerUrn: "ppb:sbkRunner:1234",
          },
        },
      });
    });
  });
});
