import { UI__BETSLIP_ACCORDION_HEADER_CLICK } from "@ppb/tbd-store/actions/betslip";
import { getObbReport } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({ localeCode: "en-GB" })),
}));

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest.fn().mockReturnValue(jest.fn().mockReturnValue({})),
}));

jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../../../formatters/currency-formatters", () => ({
  getCurrencySymbol: jest.fn().mockReturnValue("€"),
  currencyFormatWithDecimalPlaces: jest.fn().mockImplementation(({ value }) => `${value}€`),
}));

jest.spyOn(global.console, "log").mockImplementation(() => jest.fn());
jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getObbReport: jest.fn().mockReturnValue({
    bets: {
      "bet:urn:1": {
        betId: "bet:urn:1",
        receiptId: "receiptId1",
        price: {
          fractional: {
            numerator: 13,
            denominator: 5,
            __typename: "FractionalOdds",
          },
          decimal: 3.6,
        },
        potentialPayout: 3.6,
        stake: 1,
        betType: "SINGLE",
        legs: [
          {
            legId: "leg1",
            event: {
              eventId: 123456,
              name: "Farense v Estoril Praia",
              urn: "urn:1",
            },
            metadata: {
              participantsDescription: "Player 83450",
              outcomeDescription: "GOALS AT_LEAST 1 MATCH",
              aggregatorDescription: "Player to achieve Outcome",
              legTypeDescription: "I18N.OBB.BETTYPE.playerVsPlayer",
            },
            price: {
              fractional: {
                numerator: 13,
                denominator: 5,
                __typename: "FractionalOdds",
              },
              decimal: 3.6,
            },
          },
        ],
      },
      "bet:urn:2": {
        betId: "bet:urn:2",
        receiptId: "betReceiptId2",
        price: {
          fractional: {
            numerator: 15,
            denominator: 5,
            __typename: "FractionalOdds",
          },
          decimal: 4,
        },
        potentialPayout: 4,
        stake: 1,
        betType: "SINGLE",
        legs: [
          {
            legId: "leg2",
            event: {
              eventId: 123456,
              name: "Farense v Estoril Praia",
              urn: "urn:1",
            },
            metadata: {
              participantsDescription: "Denzel Dumfries | Marcus Thuram",
              outcomeDescription:
                "To Commit More Fouls Than Joao Neves During Regular Time | To Win More Fouls Than Khvicha Kvaratskhelia During Regular Time",
              legDescription:
                "Denzel Dumfries To Commit More Fouls Than Joao Neves During Regular Time | Marcus Thuram To Win More Fouls Than Khvicha Kvaratskhelia During Regular Time",
              legTypeDescription: "I18N.OBB.BETTYPE.xOfN",
            },
            price: {
              fractional: {
                numerator: 15,
                denominator: 5,
                __typename: "FractionalOdds",
              },
              decimal: 4,
            },
          },
        ],
      },
    },
  }),
}));

jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  createGetThrottleSelector: jest.fn(() => jest.fn(() => true)),
}));

describe("ObbBetReceipt mapToPropsFactory", () => {
  beforeEach(jest.clearAllMocks);

  describe("makeMapStateToProps", () => {
    function setup() {
      const defaultState = {
        entities: {
          preferences: {},
          throttles: {},
        },
      };
      return makeMapStateToProps()(defaultState);
    }

    it("should call console.error with the error thrown from `getUserDetails`", () => {
      getUserDetails.mockImplementationOnce(() => {
        throw new Error("GET_USER_DETAILS_ERROR");
      });

      expect(setup()).toEqual({});
      expect(global.console.error).toHaveBeenCalledWith(new Error("GET_USER_DETAILS_ERROR"));
    });

    it("Should return empty if there are no reports in the state.", () => {
      getObbReport.mockReturnValueOnce(null);

      expect(setup({})).toEqual({});
    });

    describe("when there are reports in the state", () => {
      it("should return expected result", () => {
        const result = setup({});

        expect(result).toEqual({
          betSelections: [],
          i18n: {
            accaInsuranceLabel: "",
            betBuilderTitleLabel: "I18N.BETSLIP.MULTIPLES",
            betReceiptIdLabel: "I18N.MYBETS.BETID",
            boostedMultiplesTitleLabel: "",
            castsTitleLabel: "",
            confirmationMessage: "I18N.BET.PLACED.CONFIRMATION.MESSAGING",
            eachWayLabel: "",
            guaranteedPriceLabel: "",
            linesLabel: "",
            multiBetBuilderTitleLabel: "",
            multiplesTitleLabel: "",
            oddsLabel: "I18N.BETSLIP.ODDS",
            oddsMovementDescription: "",
            oddsMovementLabel: "",
            reUseSelectionsLabel: "",
            receiptStatusLabel: "I18N.BETSLIP.RECEIPT_TITLE",
            receiptTitle: "I18N.BETSLIP.RECEIPT_TITLE",
            regulatorBetIdLabel: "I18N.MYBETS.BETID_AUX",
            returnsLabel: "I18N.BETSLIP.RETURNS",
            selectionsLabel: "I18N.BETSLIP.SELECTIONS",
            singlesTitleLabel: "I18N.BETSLIP.SINGLES",
            stakeLabel: "I18N.BETSLIP.STAKE",
            totalReturnsLabel: "I18N.BETSLIP.TOTAL_RETURNS",
            totalStakeLabel: "I18N.BETSLIP.TOTAL_STAKE",
          },
          multiples: [
            {
              betReceiptId: "betReceiptId2",
              hasBonusUsed: false,
              id: "bet:urn:2",
              odds: "4",
              returns: "4€",
              selections: [
                {
                  eventName: "Farense v Estoril Praia",
                  id: "leg2-0",
                  subtitle: "To Commit More Fouls Than Joao Neves During Regular Time",
                  title: "Denzel Dumfries",
                  urn: "leg2",
                },
                {
                  eventName: "Farense v Estoril Praia",
                  id: "leg2-1",
                  subtitle: "To Win More Fouls Than Khvicha Kvaratskhelia During Regular Time",
                  title: "Marcus Thuram",
                  urn: "leg2",
                },
              ],
              selectionsLabel: "I18N.BETSLIP.SELECTIONS_COUNT",
              stake: "1",
              title: "Farense v Estoril Praia",
              type: "",
            },
          ],
          singles: [
            {
              betReceiptId: "receiptId1",
              eachWaySubtitle: "",
              hasEachWay: false,
              hasMyOddsBoost: false,
              isGuaranteedPriceSelected: false,
              isPriceBoosted: false,
              odds: "3.6",
              profitOrLiability: "3.6€",
              stake: "1",
              subtitle: "GOALS AT_LEAST 1 MATCH - Farense v Estoril Praia",
              title: "Player 83450",
            },
          ],
          totalReturns: "7.6€",
          totalStake: "2€",
        });
      });

      it("should return expected result without participant description", () => {
        getObbReport.mockReturnValueOnce({
          bets: {
            "bet:urn:1": {
              betId: "bet:urn:1",
              receiptId: "receiptId1",
              price: {
                fractional: {
                  numerator: 13,
                  denominator: 5,
                  __typename: "FractionalOdds",
                },
                decimal: 3.6,
              },
              potentialPayout: 3.6,
              stake: 1,
              betType: "SINGLE",
              legs: [
                {
                  legId: "leg1",
                  event: {
                    eventId: 123456,
                    urn: "urn:1",
                  },
                  metadata: {
                    aggregatorDescription: "Player to achieve Outcome",
                    legTypeDescription: "I18N.OBB.BETTYPE.playerVsPlayer",
                  },
                  price: {
                    fractional: {
                      numerator: 13,
                      denominator: 5,
                      __typename: "FractionalOdds",
                    },
                    decimal: 3.6,
                  },
                },
              ],
            },
            "bet:urn:2": {
              betId: "bet:urn:2",
              receiptId: "betReceiptId2",
              price: {
                fractional: {
                  numerator: 15,
                  denominator: 5,
                  __typename: "FractionalOdds",
                },
                decimal: 4,
              },
              potentialPayout: 4,
              stake: 1,
              betType: "SINGLE",
              legs: [
                {
                  legId: "leg2",
                  event: {
                    eventId: 123456,
                    name: "Farense v Estoril Praia",
                    urn: "urn:1",
                  },
                  metadata: {
                    legDescription:
                      "Denzel Dumfries To Commit More Fouls Than Joao Neves During Regular Time | Marcus Thuram To Win More Fouls Than Khvicha Kvaratskhelia During Regular Time",
                    legTypeDescription: "I18N.OBB.BETTYPE.xOfN",
                  },
                  price: {
                    fractional: {
                      numerator: 15,
                      denominator: 5,
                      __typename: "FractionalOdds",
                    },
                    decimal: 4,
                  },
                },
              ],
              selectionsToWin: 2,
            },
          },
        });
        const result = setup({});

        expect(result).toEqual({
          betSelections: [],
          i18n: {
            accaInsuranceLabel: "",
            betBuilderTitleLabel: "I18N.BETSLIP.MULTIPLES",
            betReceiptIdLabel: "I18N.MYBETS.BETID",
            boostedMultiplesTitleLabel: "",
            castsTitleLabel: "",
            confirmationMessage: "I18N.BET.PLACED.CONFIRMATION.MESSAGING",
            eachWayLabel: "",
            guaranteedPriceLabel: "",
            linesLabel: "",
            multiBetBuilderTitleLabel: "",
            multiplesTitleLabel: "",
            oddsLabel: "I18N.BETSLIP.ODDS",
            oddsMovementDescription: "",
            oddsMovementLabel: "",
            reUseSelectionsLabel: "",
            receiptStatusLabel: "I18N.BETSLIP.RECEIPT_TITLE",
            receiptTitle: "I18N.BETSLIP.RECEIPT_TITLE",
            regulatorBetIdLabel: "I18N.MYBETS.BETID_AUX",
            returnsLabel: "I18N.BETSLIP.RETURNS",
            selectionsLabel: "I18N.BETSLIP.SELECTIONS",
            singlesTitleLabel: "I18N.BETSLIP.SINGLES",
            stakeLabel: "I18N.BETSLIP.STAKE",
            totalReturnsLabel: "I18N.BETSLIP.TOTAL_RETURNS",
            totalStakeLabel: "I18N.BETSLIP.TOTAL_STAKE",
          },
          multiples: [
            {
              betReceiptId: "betReceiptId2",
              hasBonusUsed: false,
              id: "bet:urn:2",
              odds: "4",
              returns: "4€",
              selections: [
                {
                  eventName: "Farense v Estoril Praia",
                  id: "leg2-0",
                  subtitle: "",
                  title: "Denzel Dumfries To Commit More Fouls Than Joao Neves During Regular Time",
                  urn: "leg2",
                },
                {
                  eventName: "Farense v Estoril Praia",
                  id: "leg2-1",
                  subtitle: "",
                  title: "Marcus Thuram To Win More Fouls Than Khvicha Kvaratskhelia During Regular Time",
                  urn: "leg2",
                },
              ],
              selectionsLabel: "I18N.BETSLIP.SELECTIONS_COUNT",
              stake: "1",
              title: "Farense v Estoril Praia",
              type: "",
              selectionsToWin: 2,
            },
          ],
          singles: [
            {
              betReceiptId: "receiptId1",
              eachWaySubtitle: "",
              hasEachWay: false,
              hasMyOddsBoost: false,
              isGuaranteedPriceSelected: false,
              isPriceBoosted: false,
              odds: "3.6",
              profitOrLiability: "3.6€",
              stake: "1",
              subtitle: "",
            },
          ],
          totalReturns: "7.6€",
          totalStake: "2€",
        });
      });
    });
  });

  describe("mapDispatchToProps", () => {
    describe("dispatchAccordionToggle", () => {
      it("should call dispatch with UI__BETSLIP_ACCORDION_HEADER_CLICK", () => {
        const { dispatchAccordionToggle } = mapDispatchToProps;

        const action = dispatchAccordionToggle(true);

        expect(action).toEqual({
          type: UI__BETSLIP_ACCORDION_HEADER_CLICK,
          payload: { isExpanded: true },
        });
      });
    });
  });
});
