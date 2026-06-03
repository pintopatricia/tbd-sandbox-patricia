import {
  UI__BETSLIP_ACCORDION_HEADER_CLICK,
  UI__BETSLIP_SBK_RECEIPT_BET_ID_COPY,
  UI__BETSLIP_SBK_RECEIPT_REGULATOR_BET_ID_COPY,
  UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK,
} from "@ppb/tbd-store/actions/betslip";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import { i18n } from "../../../helpers/i18n";
import { currencyFormatWithDecimalPlaces } from "../../../formatters/currency-formatters";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import {
  createSelectionsBuilder,
  createMultiplesBuilder,
  createBoostedMultiplesBuilder,
  createSinglesBuilder,
  createCastsBuilder,
  createBetBuildersBuilder,
  createMultiBetBuilder,
  createMultiBetBuilderGroups,
  createOneLineBetsBuilder,
} from "./sportsbook-receipt-mapper";
import { buildPotentialReturns, buildTotalOriginalReturns } from "../betslip-formatters";

jest.mock("../../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getSportsbookReport: jest.fn(() => ({
    result: {
      totalStake: "some totalStake",
      totalPotentialReturns: "some totalPotentialReturns",
      totalBonusUsed: "some totalBonusUsed",
      originalTotalPotentialReturns: "some originalTotalPotentialReturns",
      isAnyPriceBoostUsed: true,
    },
  })),
}));

jest.mock("./sportsbook-receipt-mapper", () => ({
  createSelectionsBuilder: jest.fn(() => jest.fn(() => "some selections")),
  createMultiplesBuilder: jest.fn(() => jest.fn(() => "some multiples")),
  createBoostedMultiplesBuilder: jest.fn(() => jest.fn(() => "some boosted multiples")),
  createSinglesBuilder: jest.fn(() => jest.fn(() => "some singles")),
  createCastsBuilder: jest.fn(() => jest.fn(() => "some casts")),
  createBetBuildersBuilder: jest.fn(() => jest.fn(() => "some bet builders")),
  createMultiBetBuilder: jest.fn(() => jest.fn(() => "multi bet builder")),
  createMultiBetBuilderGroups: jest.fn(() => jest.fn(() => "multi bet builder groups")),
  createOneLineBetsBuilder: jest.fn(() => jest.fn(() => "some one line bets")),
}));

jest.mock("@ppb/tbd-store/helpers/formatters");
jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({
    countryCode: "PT",
    currencyCode: "EUR",
    localeCode: "pt",
    jurisdiction: {
      jurisdiction: Jurisdiction.ITALY,
    },
  })),
}));

const getThrottleSelector = jest.fn().mockImplementation((throttles, throttle) => throttles[throttle]);

jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  createGetThrottleSelector: jest.fn(() => getThrottleSelector),
}));

jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../betslip-formatters", () => ({
  buildPotentialReturns: jest.fn(() => ""),
  buildTotalOriginalReturns: jest.fn(() => ""),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

const setupMapStateToProps = ({
  appState,
  selectionsBuilder = jest.fn(() => []),
  multiplesBuilder = jest.fn(() => []),
  boostedMultiplesBuilder = jest.fn(() => []),
  singlesBuilder = jest.fn(() => []),
  castsBuilder = jest.fn(() => []),
  betBuildersBuilder = jest.fn(() => []),
  multiBetBuilder = jest.fn(() => {}),
  multiBetBuilderGroups = jest.fn(() => {}),
  oneLineBetsBuilder = jest.fn(() => []),
}) => {
  createSelectionsBuilder.mockReturnValue(selectionsBuilder);
  createMultiplesBuilder.mockReturnValue(multiplesBuilder);
  createBoostedMultiplesBuilder.mockReturnValue(boostedMultiplesBuilder);
  createSinglesBuilder.mockReturnValue(singlesBuilder);
  createCastsBuilder.mockReturnValue(castsBuilder);
  createBetBuildersBuilder.mockReturnValue(betBuildersBuilder);
  createMultiBetBuilder.mockReturnValue(multiBetBuilder);
  createMultiBetBuilderGroups.mockReturnValue(multiBetBuilderGroups);
  createOneLineBetsBuilder.mockReturnValue(oneLineBetsBuilder);
  return makeMapStateToProps()(appState);
};

describe("SportsbookReceipt Map to Props factory", () => {
  beforeEach(jest.clearAllMocks);

  describe("makeMapStateToProps", () => {
    describe("when `getUserDetails` throws", () => {
      const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

      beforeEach(() => {
        getUserDetails.mockImplementationOnce(() => {
          throw new Error(GET_USER_DETAILS_ERROR);
        });
      });

      it("should call console.error with the error thrown from `getUserDetails`", () => {
        setupMapStateToProps({});

        expect(global.console.error).toHaveBeenCalledWith(new Error("GET_USER_DETAILS_ERROR"));
      });

      it("should return an empty object", () => {
        expect(setupMapStateToProps({})).toEqual({});
      });
    });

    describe("selections", () => {
      it("should build selections using selections builder function", () => {
        const selectionsBuilderSpy = jest.fn(() => ["some selection", "another selection"]);
        const { selections } = setupMapStateToProps({
          appState: {
            entities: {
              preferences: {},
              throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } },
            },
          },
          selectionsBuilder: selectionsBuilderSpy,
        });

        expect(createSelectionsBuilder).toHaveBeenCalledTimes(1);
        expect(selectionsBuilderSpy).toHaveBeenCalledTimes(1);
        expect(selectionsBuilderSpy).toHaveBeenCalledWith({
          entities: { preferences: {}, throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } } },
        });
        expect(selections).toEqual(["some selection", "another selection"]);
      });
    });

    describe("multiples", () => {
      it("should build multiples using multiples builder function", () => {
        const multiplesBuilderSpy = jest.fn(() => ["some multiple", "another multiple"]);
        const { multiples } = setupMapStateToProps({
          appState: {
            entities: {
              preferences: {},
              throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } },
            },
          },
          multiplesBuilder: multiplesBuilderSpy,
        });

        expect(createMultiplesBuilder).toHaveBeenCalledTimes(1);
        expect(multiplesBuilderSpy).toHaveBeenCalledTimes(1);
        expect(multiplesBuilderSpy).toHaveBeenCalledWith({
          entities: { preferences: {}, throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } } },
        });
        expect(multiples).toEqual(["some multiple", "another multiple"]);
      });
    });

    describe("boosted multiples", () => {
      it("should build multiples using boosted multiples builder function", () => {
        const boostedMultiplesBuilderSpy = jest.fn(() => ["some multiple", "another multiple"]);
        const { boostedMultiples } = setupMapStateToProps({
          appState: {
            entities: {
              preferences: {},
              throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } },
            },
          },
          boostedMultiplesBuilder: boostedMultiplesBuilderSpy,
        });

        expect(createMultiplesBuilder).toHaveBeenCalledTimes(1);
        expect(boostedMultiplesBuilderSpy).toHaveBeenCalledTimes(1);
        expect(boostedMultiplesBuilderSpy).toHaveBeenCalledWith({
          entities: { preferences: {}, throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } } },
        });
        expect(boostedMultiples).toEqual(["some multiple", "another multiple"]);
      });
    });

    describe("oneLineBets", () => {
      it("should build oneline bets using one line bets builder function", () => {
        const oneLineBetsBuilderSpy = jest.fn(() => ["some oneline bet", "another oneline bet"]);
        const { oneLineBets } = setupMapStateToProps({
          appState: {
            entities: {
              preferences: {},
              throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } },
            },
          },
          oneLineBetsBuilder: oneLineBetsBuilderSpy,
        });

        expect(createOneLineBetsBuilder).toHaveBeenCalledTimes(1);
        expect(oneLineBetsBuilderSpy).toHaveBeenCalledTimes(1);
        expect(oneLineBetsBuilderSpy).toHaveBeenCalledWith({
          entities: { preferences: {}, throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } } },
        });
        expect(oneLineBets).toEqual(["some oneline bet", "another oneline bet"]);
      });
    });

    describe("singles", () => {
      it("should build singles using singles builder function", () => {
        const singlesBuilderSpy = jest.fn(() => ["some multiple", "another multiple"]);
        const { singles } = setupMapStateToProps({
          appState: {
            entities: {
              preferences: {},
              throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } },
            },
          },
          singlesBuilder: singlesBuilderSpy,
        });

        expect(createSinglesBuilder).toHaveBeenCalledTimes(1);
        expect(singlesBuilderSpy).toHaveBeenCalledTimes(1);
        expect(singlesBuilderSpy).toHaveBeenCalledWith({
          entities: { preferences: {}, throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } } },
        });
        expect(singles).toEqual(["some multiple", "another multiple"]);
      });
    });

    describe("casts", () => {
      it("should build casts using casts builder function", () => {
        const castsBuilderSpy = jest.fn(() => ["some cast", "another cast"]);
        const { casts } = setupMapStateToProps({
          appState: {
            entities: {
              preferences: {},
              throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } },
            },
          },
          castsBuilder: castsBuilderSpy,
        });

        expect(createCastsBuilder).toHaveBeenCalledTimes(1);
        expect(castsBuilderSpy).toHaveBeenCalledTimes(1);
        expect(castsBuilderSpy).toHaveBeenCalledWith({
          entities: { preferences: {}, throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } } },
        });
        expect(casts).toEqual(["some cast", "another cast"]);
      });
    });

    describe("bet builders", () => {
      it("should build bet builders using bet builders builder function", () => {
        const betBuildersBuilderSpy = jest.fn(() => ["some bet builder", "another bet builder"]);
        const { betBuilders } = setupMapStateToProps({
          appState: {
            entities: {
              preferences: {},
              throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } },
            },
          },
          betBuildersBuilder: betBuildersBuilderSpy,
        });

        expect(createBetBuildersBuilder).toHaveBeenCalledTimes(1);
        expect(betBuildersBuilderSpy).toHaveBeenCalledWith({
          entities: { preferences: {}, throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } } },
        });
        expect(betBuildersBuilderSpy).toHaveBeenCalledTimes(1);
        expect(betBuilders).toEqual(["some bet builder", "another bet builder"]);
      });
    });

    describe("multi bet builder", () => {
      it("should build the multi bet builder using the builder function", () => {
        const multiBetBuilderSpy = jest.fn(() => ({ title: "Title" }));
        const { multiBetBuilder } = setupMapStateToProps({
          appState: {
            entities: {
              preferences: {},
              throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } },
            },
          },
          multiBetBuilder: multiBetBuilderSpy,
        });

        expect(createMultiBetBuilder).toHaveBeenCalledTimes(1);
        expect(multiBetBuilderSpy).toHaveBeenCalledWith({
          entities: { preferences: {}, throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } } },
        });
        expect(multiBetBuilderSpy).toHaveBeenCalledTimes(1);
        expect(multiBetBuilder).toEqual({ title: "Title" });
      });
    });

    describe("multi bet builder groups", () => {
      it("should build the multi bet builder groups using the builder function", () => {
        const multiBetBuilderGroupsSpy = jest.fn(() => ({ "group:1": {} }));
        const { multiBetBuilderGroups } = setupMapStateToProps({
          appState: {
            entities: {
              preferences: {},
              throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } },
            },
          },
          multiBetBuilderGroups: multiBetBuilderGroupsSpy,
        });

        expect(createMultiBetBuilderGroups).toHaveBeenCalledTimes(1);
        expect(multiBetBuilderGroupsSpy).toHaveBeenCalledWith({
          entities: { preferences: {}, throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } } },
        });
        expect(multiBetBuilderGroupsSpy).toHaveBeenCalledTimes(1);
        expect(multiBetBuilderGroups).toEqual({ "group:1": {} });
      });
    });

    describe("total stake", () => {
      it("should return total stake formatted with two decimal places", () => {
        currencyFormatWithDecimalPlaces.mockReturnValue("some formatted total stake");
        const { totalStake } = setupMapStateToProps({
          appState: { entities: { preferences: {}, throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } } } },
        });

        expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledTimes(1);
        expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
          countryCode: "PT",
          currencyCode: "EUR",
          localeCode: "pt",
          decimalPlaces: 2,
          value: "some totalStake",
          jurisdiction: {
            jurisdiction: Jurisdiction.ITALY,
          },
        });
        expect(totalStake).toEqual("some formatted total stake");
      });
    });

    describe("potential returns", () => {
      it("should return formatted total potential returns", () => {
        buildPotentialReturns.mockReturnValue("some formatted potential returns");

        const { potentialReturns } = setupMapStateToProps({
          appState: {
            entities: {
              preferences: {},
              throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } },
            },
          },
        });

        expect(buildPotentialReturns).toHaveBeenCalledTimes(1);
        expect(buildPotentialReturns).toHaveBeenCalledWith("some totalStake", "some totalPotentialReturns", {
          countryCode: "PT",
          currencyCode: "EUR",
          localeCode: "pt",
          jurisdiction: {
            jurisdiction: Jurisdiction.ITALY,
          },
        });
        expect(potentialReturns).toEqual("some formatted potential returns");
      });
    });

    describe("total original returns", () => {
      it("should return formatted total original returns", () => {
        buildTotalOriginalReturns.mockReturnValue("some total original returns");

        const { totalOriginalReturns } = setupMapStateToProps({
          appState: {
            entities: {
              preferences: {},
              throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } },
            },
          },
        });

        expect(buildTotalOriginalReturns).toHaveBeenCalledTimes(1);
        expect(buildTotalOriginalReturns).toHaveBeenCalledWith(
          "some totalStake",
          "some totalPotentialReturns",
          "some originalTotalPotentialReturns",
          true,
          {
            countryCode: "PT",
            currencyCode: "EUR",
            localeCode: "pt",
            jurisdiction: {
              jurisdiction: Jurisdiction.ITALY,
            },
          },
        );
        expect(totalOriginalReturns).toEqual("some total original returns");
      });
    });

    describe("isOddsBoosted", () => {
      it("should return isOddsBoosted", () => {
        const { isOddsBoosted } = setupMapStateToProps({
          appState: { entities: { preferences: {}, throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } } } },
        });

        expect(isOddsBoosted).toEqual(true);
      });
    });

    describe("showTopContent", () => {
      describe("Sky Bet Club", () => {
        it("should be true if brand setting and throttle are both active", () => {
          const { showTopContent } = setupMapStateToProps({
            appState: {
              entities: {
                preferences: {},
                throttles: {
                  ENABLE_SKYBETCLUB_TRACKER: { isActive: true },
                },
                brandSettings: { SKYBETCLUB: true },
              },
            },
          });

          expect(showTopContent).toEqual(true);
        });

        it("should be false if brand setting is active and throttle inactive", () => {
          const { showTopContent } = setupMapStateToProps({
            appState: {
              entities: {
                preferences: {},
                throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } },
                brandSettings: { SKYBETCLUB: true },
              },
            },
          });

          expect(showTopContent).toEqual(false);
        });

        it("should be false if brand setting is inactive and throttle active", () => {
          const { showTopContent } = setupMapStateToProps({
            appState: {
              entities: {
                preferences: {},
                throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: true } },
                brandSettings: { SKYBETCLUB: false },
              },
            },
          });

          expect(showTopContent).toEqual(false);
        });
      });

      describe("Betfair Club", () => {
        it("should be true if brand setting and throttle are both active", () => {
          const { showTopContent } = setupMapStateToProps({
            appState: {
              entities: {
                preferences: {},
                throttles: {
                  ENABLE_BETFAIRCLUB_TRACKER: { isActive: true },
                },
                brandSettings: { BETFAIRCLUB: true },
              },
            },
          });

          expect(showTopContent).toEqual(true);
        });

        it("should be false if brand setting is active and throttle inactive", () => {
          const { showTopContent } = setupMapStateToProps({
            appState: {
              entities: {
                preferences: {},
                throttles: { ENABLE_BETFAIRCLUB_TRACKER: { isActive: false } },
                brandSettings: { BETFAIRCLUB: true },
              },
            },
          });

          expect(showTopContent).toEqual(false);
        });

        it("should be false if brand setting is inactive and throttle active", () => {
          const { showTopContent } = setupMapStateToProps({
            appState: {
              entities: {
                preferences: {},
                throttles: { ENABLE_BETFAIRCLUB_TRACKER: { isActive: true } },
                brandSettings: { BETFAIRCLUB: false },
              },
            },
          });

          expect(showTopContent).toEqual(false);
        });
      });

      it("should be false if Sky Bet Club and Betfair Club brand settings are both inactive", () => {
        const { showTopContent } = setupMapStateToProps({
          appState: {
            entities: {
              preferences: {},
              throttles: {
                ENABLE_SKYBETCLUB_TRACKER: { isActive: false },
                ENABLE_BETFAIRCLUB_TRACKER: { isActive: false },
              },
              brandSettings: { SKYBETCLUB: false, BETFAIRCLUB: false },
            },
          },
        });

        expect(showTopContent).toEqual(false);
      });
    });

    describe("i18n", () => {
      it("should return translations", () => {
        const selectionsBuilderSpy = jest.fn(() => ["some selection", "another selection"]);

        const { i18n: labels } = setupMapStateToProps({
          appState: { entities: { preferences: {}, throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } } } },
          selectionsBuilder: selectionsBuilderSpy,
        });

        expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.MULTIPLES" });
        expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.CASTS" });
        expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.BET_BUILDER" });
        expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.ODDS" });
        expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.TOTAL_RETURNS" });
        expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.RECEIPT_TITLE" });
        expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.RETURNS" });
        expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.SINGLES" });
        expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.STAKE" });
        expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.TOTAL_STAKE" });
        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.BETSLIP.SELECTIONS_COUNT",
          interpolationValues: { numberOfSelections: "2" },
        });
        expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.EACHWAY" });
        expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.LINES" });
        expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.ACCA_INSURANCE_APPLIED" });
        expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.RE_USE_SELECTIONS" });
        expect(i18n).toHaveBeenCalledWith({ key: "I18N.LABELS.BEST_ODDS_GUARANTEED_REDUCED" });
        expect(i18n).toHaveBeenCalledWith({ key: "I18N.MYBETS.BETID" });
        expect(i18n).toHaveBeenCalledWith({ key: "I18N.MYBETS.BETID_AUX" });
        expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.GROUPS.PRICE_BOOST" });
        expect(labels).toEqual({
          multiplesTitleLabel: "I18N.BETSLIP.MULTIPLES",
          boostedMultiplesTitleLabel: "I18N.BETSLIP.GROUPS.PRICE_BOOST",
          castsTitleLabel: "I18N.BETSLIP.CASTS",
          betBuilderTitleLabel: "I18N.BETSLIP.BET_BUILDER",
          multiBetBuilderTitleLabel: "I18N.BETSLIP.BET_BUILDER_MULTIS",
          oddsLabel: "I18N.BETSLIP.ODDS",
          totalReturnsLabel: "I18N.BETSLIP.TOTAL_RETURNS",
          receiptStatusLabel: "I18N.BETSLIP.RECEIPT_TITLE",
          returnsLabel: "I18N.BETSLIP.RETURNS",
          selectionsLabel: "I18N.BETSLIP.SELECTIONS_COUNT",
          singlesTitleLabel: "I18N.BETSLIP.SINGLES",
          stakeLabel: "I18N.BETSLIP.STAKE",
          totalStakeLabel: "I18N.BETSLIP.TOTAL_STAKE",
          eachWayLabel: "I18N.BETSLIP.EACHWAY",
          accaInsuranceLabel: "I18N.BETSLIP.ACCA_INSURANCE_APPLIED",
          linesLabel: "I18N.BETSLIP.LINES",
          reUseSelectionsLabel: "I18N.BETSLIP.RE_USE_SELECTIONS",
          guaranteedPriceLabel: "I18N.LABELS.BEST_ODDS_GUARANTEED_REDUCED",
          betReceiptIdLabel: "I18N.MYBETS.BETID",
          regulatorBetIdLabel: "I18N.MYBETS.BETID_AUX",
          confirmationMessage: "I18N.BET.PLACED.CONFIRMATION.MESSAGING",
        });
      });
    });

    describe("hasShownReceiptIds", () => {
      it("should return false if the jurisdiction is not ITALY", () => {
        getUserDetails.mockImplementationOnce(() => ({
          countryCode: "PT",
          currencyCode: "EUR",
          localeCode: "pt",
          jurisdiction: {
            jurisdiction: Jurisdiction.SPAIN,
          },
        }));
        const singlesBuilderSpy = jest.fn(() => ["some multiple", "another multiple"]);
        const { hasShownReceiptIds } = setupMapStateToProps({
          appState: { entities: { preferences: {}, throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } } } },
          singlesBuilder: singlesBuilderSpy,
        });

        expect(hasShownReceiptIds).toBe(false);
      });

      it("should return true if the jurisdiction is ITALY", () => {
        getUserDetails.mockImplementationOnce(() => ({
          countryCode: "PT",
          currencyCode: "EUR",
          localeCode: "pt",
          jurisdiction: {
            jurisdiction: Jurisdiction.ITALY,
          },
        }));
        const singlesBuilderSpy = jest.fn(() => ["some multiple", "another multiple"]);
        const { hasShownReceiptIds } = setupMapStateToProps({
          appState: { entities: { preferences: {}, throttles: { ENABLE_SKYBETCLUB_TRACKER: { isActive: false } } } },
          singlesBuilder: singlesBuilderSpy,
        });

        expect(hasShownReceiptIds).toBe(true);
      });
    });

    describe("hasBoostSignposting", () => {
      describe("when when PRICE_BOOST_SINGLES_SIGNPOSTING is enabled", () => {
        it("should return true", () => {
          const { hasBoostSignposting } = setupMapStateToProps({
            appState: {
              entities: { preferences: {}, throttles: { PRICE_BOOST_SINGLES_SIGNPOSTING: { isActive: true } } },
            },
          });

          expect(hasBoostSignposting).toBe(true);
        });
      });

      describe("when when PRICE_BOOST_SINGLES_SIGNPOSTING is disabled", () => {
        it("should return false", () => {
          const { hasBoostSignposting } = setupMapStateToProps({
            appState: {
              entities: { preferences: {}, throttles: { PRICE_BOOST_SINGLES_SIGNPOSTING: { isActive: false } } },
            },
          });

          expect(hasBoostSignposting).toBe(false);
        });
      });
    });
  });

  describe("makeMapDispatchToProps", () => {
    it("should map dispatchAccordionToggle", () => {
      const { dispatchAccordionToggle } = mapDispatchToProps;

      expect(dispatchAccordionToggle).toBeDefined();
    });

    it("should map dispatchReUseSelections", () => {
      const { dispatchReUseSelections } = mapDispatchToProps;

      expect(dispatchReUseSelections).toBeDefined();
    });

    it("should map dispatchCopyBetIdAction", () => {
      const { dispatchCopyBetIdAction } = mapDispatchToProps;

      expect(dispatchCopyBetIdAction).toBeDefined();
    });

    it("should map dispatchCopyRegulatorBetIdAction", () => {
      const { dispatchCopyRegulatorBetIdAction } = mapDispatchToProps;

      expect(dispatchCopyRegulatorBetIdAction).toBeDefined();
    });

    describe("dispatchAccordionToggle", () => {
      it("should dispatch a betslip accordion header click when dispatchAccordionToggle is called", () => {
        const { dispatchAccordionToggle } = mapDispatchToProps;

        const action = dispatchAccordionToggle(true);

        expect(action).toEqual({
          type: UI__BETSLIP_ACCORDION_HEADER_CLICK,
          payload: { isExpanded: true },
        });
      });
    });

    describe("dispatchReUseSelections", () => {
      it("should dispatch a re use selections click when dispatchReUseSelections is called with the number of selections", () => {
        const { dispatchReUseSelections } = mapDispatchToProps;

        const action = dispatchReUseSelections(["some selection", "another selection"]);

        expect(action).toEqual({
          type: UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK,
          payload: {
            numberOfSelections: 2,
          },
        });
      });
    });

    describe("dispatchCopyBetIdAction", () => {
      it("should dispatch a copy betId when dispatchCopyBetIdAction is called", () => {
        const { dispatchCopyBetIdAction } = mapDispatchToProps;

        const action = dispatchCopyBetIdAction();

        expect(action).toEqual({
          type: UI__BETSLIP_SBK_RECEIPT_BET_ID_COPY,
        });
      });
    });

    describe("dispatchCopyRegulatorBetIdAction", () => {
      it("should dispatch a copy regulatorId when dispatchCopyRegulatorBetIdAction is called", () => {
        const { dispatchCopyRegulatorBetIdAction } = mapDispatchToProps;

        const action = dispatchCopyRegulatorBetIdAction();

        expect(action).toEqual({
          type: UI__BETSLIP_SBK_RECEIPT_REGULATOR_BET_ID_COPY,
        });
      });
    });
  });
});
