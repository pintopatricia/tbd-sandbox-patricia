import { OddsDisplayPreference } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import {
  MY_BETS_SUBSCRIBE_CARD_UPDATES,
  MY_BETS_UNSUBSCRIBE_CARD_UPDATES,
  UI__MY_BETS_BET_SHARING_PREVIEW_TAP,
  SUBSCRIBE_BET_RESULT,
  UNSUBSCRIBE_BET_RESULT,
  UI__MY_BETS_HERITAGE_INFO_LABEL_CLICK,
  SUBSCRIBE_BET_MUTATION_ELIGIBILITY,
  UNSUBSCRIBE_BET_MUTATION_ELIGIBILITY,
  UI__MY_BETS_ACCA_FREEZE_OPENED,
  UI__MY_BETS_ACCA_FREEZE_CLOSED,
} from "@ppb/tbd-store/actions/my-bets";
import { BetEdgeEnum } from "@ppb/tbd-store/state/betting/sportsbook-bets/SportsbookBet.types";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { InfoLabelType, StatusLabelType } from "@ppb/the-wall-common/types";
import { OthersIconName, ValueIconName } from "@ppb/the-wall-icons";

import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import { i18n } from "../../helpers/i18n";
import {
  formatOddsByPriceType,
  getBetStatusLabel,
  getBetSubTitle,
  getBetSupportingText,
  getBetTitle,
  getPlacedReturns,
  isAccaInsuranceSelected,
  isMultipleBetType,
} from "../../helpers/my-bets";
import { buildFreeBetsLabel } from "../Betslip/betslip-formatters";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("../../helpers/my-bets", () => ({
  formatOddsByPriceType: jest.fn(),
  getBetStatusLabel: jest.fn(),
  getBetSupportingText: jest.fn(),
  getBetSubTitle: jest.fn(),
  getBetTitle: jest.fn(),
  getPlacedReturns: jest.fn(),
  isAccaInsuranceSelected: jest.fn(),
  isMultipleBetType: jest.fn(),
}));

const getUserDetails = jest.fn(() => ({}));
const getMyBetsFiltersState = jest.fn(() => ({}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/my-bets/my-bets-selectors", () => ({
  createGetMyBetsFiltersStateSelector: jest.fn(() => getMyBetsFiltersState),
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

jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn(),
}));

const getIsCashoutQuoteDisplayedByURN = jest.fn();

jest.mock("@ppb/tbd-store/state/betting/sportsbook-cashouts/sportsbook-cashout-selectors", () => ({
  createIsSportsbookCashoutQuoteDisplayedSelector: jest.fn(() => getIsCashoutQuoteDisplayedByURN),
}));

const getUserPreferencesWithProductSwitcher = jest.fn(() => ({
  sportsbookOddsDisplay: OddsDisplayPreference.Decimal,
}));

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest.fn(() => getUserPreferencesWithProductSwitcher),
}));

const getSportsbookBetCardByURN = jest.fn();

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getSportsbookBetCardByURN),
}));

const getSportsbookBetByURN = jest.fn();
const getSportsbookBetLegsByURN = jest.fn();
const getIsAccaFreezeEligible = jest.fn();
const getAccaFreezeEligibleLegs = jest.fn(() => []);
const getIsBetFrozen = jest.fn(() => false);

jest.mock("@ppb/tbd-store/state/betting/sportsbook-bets/sportsbook-bets-selectors", () => ({
  createSportsbookBetSelector: jest.fn(() => getSportsbookBetByURN),
  createIsAccaFreezeEligibleSelector: jest.fn(() => getIsAccaFreezeEligible),
}));

jest.mock("@ppb/tbd-store/state/entities/sportsbook-bet-legs/sportsbook-bet-legs-selectors", () => ({
  createSportsbookBetLegsSelector: jest.fn(() => getSportsbookBetLegsByURN),
  createAccaFreezeEligibleLegsSelector: jest.fn(() => getAccaFreezeEligibleLegs),
  createIsBetFrozenSelector: jest.fn(() => getIsBetFrozen),
}));

jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  createGetThrottleSelector: jest.fn().mockReturnValue(jest.fn().mockReturnValue({ isActive: false })),
}));

jest.mock("../Betslip/betslip-formatters", () => ({
  buildFreeBetsLabel: jest.fn(),
}));

jest.mock("../../helpers/dates", () => ({
  formatStartDateWithTodayOrTomorrow: jest.fn(() => "formatStartDateWithTodayOrTomorrowMock"),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/UserDetailsState", () => ({
  isOnlineUserDetails: jest.fn(() => true),
}));

jest.mock("../../config/endpoints", () => ({
  getExternalLinks: jest.fn().mockReturnValue({
    RULE4: {
      INTERNATIONAL: {
        en: "https://support.skybet.com/s/article/Horse-Racing-Rule-4-Rules",
        no: "https://support.betfair.com/no/app/answers/detail/a_id/11011",
      },
    },
    DEAD_HEAT: {
      INTERNATIONAL: {
        en: "https://support.skybet.com/s/article/Dead-Heat",
        no: "https://support.betfair.com/no/app/answers/detail/a_id/11016",
      },
    },
  }),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

const BET = {
  urn: "ppb:sbkBet:923378353",
  betReceiptId: "O/10221904/0000164",
  betType: "SINGLE",
  betId: 1,
  isSGM: false,
  isSettled: false,
  currentSize: 0.11,
  profitAndLoss: 0.91,
  result: "CASHED_OUT",
  edges: [],
  legs: [
    {
      result: "WON",
      parts: [
        {
          eventDescription: "Juventus v Lazio",
          eventMarketDescription: "Match Odds",
          selectionName: "Juventus",
          marketBetUrn: "ppb:marketBet:924.254694341",
          marketType: "SOME_MOCK_MARKET_TYPE",
          originalPrice: "2.2",
          price: "2.8",
          priceType: "pricetypemock",
          isSuperSub: false,
        },
      ],
    },
  ],
};

const BET_WITH_SUPER_SUB = {
  urn: "ppb:sbkBet:923378353",
  betReceiptId: "O/10221904/0000164",
  betType: "SINGLE",
  betId: 1,
  isSGM: false,
  isSettled: false,
  currentSize: 0.11,
  profitAndLoss: 0.91,
  result: "CASHED_OUT",
  edges: [],
  legs: [
    {
      result: "WON",
      parts: [
        {
          eventDescription: "Juventus v Lazio",
          eventMarketDescription: "Match Odds",
          selectionName: "Juventus",
          marketBetUrn: "ppb:marketBet:924.254694341",
          marketType: "SOME_MOCK_MARKET_TYPE",
          originalPrice: "2.2",
          price: "2.8",
          priceType: "pricetypemock",
          isSuperSub: true,
        },
      ],
    },
  ],
};

const NINETY_MINUTE_BET = {
  ...BET,
  urn: "ppb:sbkBet:90",
  result: "WON",
  has90MinBet: true,
};

const SPORTSBOOK_BET_CARD = {
  urn: "ppb:tbd:card:sbkBet:923378353",
  betURN: "ppb:sbkBet:923378353",
  type: "SPORTSBOOK_BET_CARD",
  navigationLinks: [],
};

const SPORTSBOOK_BET_90_MINUTE_CARD = {
  ...SPORTSBOOK_BET_CARD,
  urn: "ppb:tbd:card:sbkBet:90",
  betURN: "ppb:sbkBet:90",
};

const DEFAULT_SINGLE_BET_STATE = {
  layouts: {
    cards: {
      sportsbookbets: {
        "ppb:tbd:card:sbkBet:923378353": { ...SPORTSBOOK_BET_CARD },
        "ppb:tbd:card:sbkBet:90": { ...SPORTSBOOK_BET_90_MINUTE_CARD },
      },
    },
    betcardgroups: "betcardgroupsState",
    views: {
      mybets: "mybetsState",
    },
  },
  betting: {
    sportsbookbets: {
      "ppb:sbkBet:923378353": { ...BET },
      "ppb:sbkBet:90": { ...NINETY_MINUTE_BET },
    },
  },
  entities: { preferences: {}, throttles: {}, brandSettings: { SHOW_SELECTION_TYPE_ICON: true } },
};

const DEFAULT_SINGLE_BET_STATE_WITH_SUPER_SUB = {
  layouts: {
    cards: {
      sportsbookbets: {
        "ppb:tbd:card:sbkBet:923378353": { ...SPORTSBOOK_BET_CARD },
        "ppb:tbd:card:sbkBet:90": { ...SPORTSBOOK_BET_90_MINUTE_CARD },
      },
    },
    betcardgroups: "betcardgroupsState",
    views: {
      mybets: "mybetsState",
    },
  },
  betting: {
    sportsbookbets: {
      "ppb:sbkBet:923378353": { ...BET_WITH_SUPER_SUB },
      "ppb:sbkBet:90": { ...NINETY_MINUTE_BET },
    },
  },
  entities: { preferences: {}, throttles: {}, brandSettings: { SHOW_SELECTION_TYPE_ICON: true } },
};

const DEFAULT_SINGLE_BET_STATE_WITH_BOG = {
  ...DEFAULT_SINGLE_BET_STATE,
  betting: {
    ...DEFAULT_SINGLE_BET_STATE.betting,
    sportsbookbets: {
      "ppb:sbkBet:923378353": {
        ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
        legs: [
          {
            ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs[0],
            parts: [
              {
                ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs[0].parts[0],
                priceType: "GUARANTEED",
              },
            ],
          },
        ],
      },
    },
  },
};

const DEFAULT_SINGLE_BET_STATE_WITH_RULE_4_DEDUCTIONS = {
  layouts: {
    cards: {
      sportsbookbets: {
        "ppb:tbd:card:sbkBet:923378353": {
          urn: "ppb:tbd:card:sbkBet:923378353",
          betURN: "ppb:sbkBet:923378353",
          type: "SPORTSBOOK_BET_CARD",
          marketViewLink: {
            viewUrn: "ppb:tbd:view:market:924.236203282",
            viewUrl: "soccer/english-premier-league/english-premier-league/top-10-finish-202021/mwe-924.236203282",
          },
          eventViewLinks: {
            "ppb:tbd:view:event:2022802": {
              viewUrn: "ppb:tbd:view:event:2022802",
              viewUrl: "soccer/english-premier-league/english-premier-league/e-2022802",
            },
          },
        },
      },
    },
    views: {
      mybets: "mybetsState",
    },
  },
  betting: {
    sportsbookbets: {
      "ppb:sbkBet:923378353": {
        urn: "ppb:sbkBet:923378353",
        betReceiptId: "O/10221904/0000164",
        betType: "SINGLE",
        betId: 123,
        currentSize: 0.11,
        profitAndLoss: 0.91,
        result: "CASHED_OUT_2",
        legs: [
          {
            result: "WON",
            parts: [
              {
                eventDescription: "Juventus v Lazio",
                eventMarketDescription: "Match Odds",
                selectionName: "Juventus",
                eventViewUrn: "ppb:tbd:view:event:2022802",
                handicap: 1,
                rule4Deductions: 30,
              },
            ],
          },
        ],
      },
    },
  },
  entities: { preferences: {}, throttles: {} },
};

const DEFAULT_SINGLE_BET_STATE_WITH_RULE_4_AND_DEAD_HEAT = {
  layouts: {
    cards: {
      sportsbookbets: {
        "ppb:tbd:card:sbkBet:923378353": {
          urn: "ppb:tbd:card:sbkBet:923378353",
          betURN: "ppb:sbkBet:923378353",
          type: "SPORTSBOOK_BET_CARD",
          marketViewLink: {
            viewUrn: "ppb:tbd:view:market:924.236203282",
            viewUrl: "soccer/english-premier-league/english-premier-league/top-10-finish-202021/mwe-924.236203282",
          },
          eventViewLinks: {
            "ppb:tbd:view:event:2022802": {
              viewUrn: "ppb:tbd:view:event:2022802",
              viewUrl: "soccer/english-premier-league/english-premier-league/e-2022802",
            },
          },
        },
      },
    },
    views: {
      mybets: "mybetsState",
    },
  },
  betting: {
    sportsbookbets: {
      "ppb:sbkBet:923378353": {
        urn: "ppb:sbkBet:923378353",
        betReceiptId: "O/10221904/0000164",
        betType: "SINGLE",
        betId: 123,
        currentSize: 0.11,
        profitAndLoss: 0.91,
        result: "CASHED_OUT_2",
        legs: [
          {
            result: "WON",
            parts: [
              {
                eventDescription: "Juventus v Lazio",
                eventMarketDescription: "Match Odds",
                selectionName: "Juventus",
                eventViewUrn: "ppb:tbd:view:event:2022802",
                handicap: 1,
                rule4Deductions: 30,
                deadHeatWinDeductions: 30,
              },
            ],
          },
        ],
      },
    },
  },
  entities: { preferences: {}, throttles: {} },
};

const DEFAULT_MULTIPLE_BET_STATE = {
  layouts: {
    cards: {
      sportsbookbets: {
        "ppb:tbd:card:sbkBet:923378353": {
          urn: "ppb:tbd:card:sbkBet:923378353",
          betURN: "ppb:sbkBet:923378353",
          type: "SPORTSBOOK_BET_CARD",
        },
      },
    },
    views: {
      mybets: "mybetsState",
    },
  },
  betting: {
    sportsbookbets: {
      "ppb:sbkBet:923378353": {
        urn: "ppb:sbkBet:923378353",
        betReceiptId: "O/10221904/0000164",
        betType: "DOUBLE",
        isSGM: false,
        isPBM: false,
        betId: 12345,
        betPrice: { decimal: 2.3, fractional: { numerator: 9, denominator: 1 } },
        originalBetPrice: { decimal: 2, fractional: { numerator: 2, denominator: 1 } },
        currentSize: 0.32,
        profitAndLoss: 1.91,
        numLines: 1,
        edges: [],
        legs: [
          {
            result: "WON",
            parts: [
              {
                eventDescription: "Man Utd v Everton",
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                marketBetUrn: "ppb:marketBet:30086678",
                rule4Deductions: 5,
              },
            ],
          },
          {
            result: "LOST",
            parts: [
              {
                eventDescription: "Man Utd v Everton",
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                marketBetUrn: "ppb:marketBet:55677043",
                eachwayPlaces: 2,
                eachwayFactor: {
                  numerator: 1,
                  denominator: 15,
                },
                rule4Deductions: 0,
              },
            ],
          },
          {
            result: "PLACED",
            parts: [
              {
                eventDescription: "Man Utd v Everton",
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                marketBetUrn: "ppb:marketBet:notMapped",
                rule4Deductions: 0,
              },
            ],
          },
          {
            result: "VOID",
            parts: [
              {
                eventDescription: "Man Utd v Everton",
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                result: "VOID",
                rule4Deductions: 0,
              },
            ],
          },
        ],
        result: "CASHED_OUT",
      },
    },
  },
  entities: { preferences: {}, throttles: {} },
};

const DEFAULT_MULTIPLE_BET_STATE_WITH_RULE_4_AND_DEAD_HEAT = {
  layouts: {
    cards: {
      sportsbookbets: {
        "ppb:tbd:card:sbkBet:923378353": {
          urn: "ppb:tbd:card:sbkBet:923378353",
          betURN: "ppb:sbkBet:923378353",
          type: "SPORTSBOOK_BET_CARD",
        },
      },
    },
    views: {
      mybets: "mybetsState",
    },
  },
  betting: {
    sportsbookbets: {
      "ppb:sbkBet:923378353": {
        urn: "ppb:sbkBet:923378353",
        betReceiptId: "O/10221904/0000164",
        betType: "DOUBLE",
        isSGM: false,
        betId: 12345,
        betPrice: { decimal: 2.3, fractional: { numerator: 9, denominator: 1 } },
        originalBetPrice: { decimal: 2, fractional: { numerator: 2, denominator: 1 } },
        currentSize: 0.32,
        profitAndLoss: 1.91,
        numLines: 1,
        edges: [],
        legs: [
          {
            result: "WON",
            parts: [
              {
                eventDescription: "Man Utd v Everton",
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                marketBetUrn: "ppb:marketBet:30086678",
                rule4Deductions: 0,
              },
            ],
          },
          {
            result: "LOST",
            parts: [
              {
                eventDescription: "Man Utd v Everton",
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                marketBetUrn: "ppb:marketBet:55677043",
                eachwayPlaces: 2,
                eachwayFactor: {
                  numerator: 1,
                  denominator: 15,
                },
                rule4Deductions: 5,
                deadHeatEachwayDeductions: 30,
              },
            ],
          },
          {
            result: "PLACED",
            parts: [
              {
                eventDescription: "Man Utd v Everton",
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                marketBetUrn: "ppb:marketBet:notMapped",
                rule4Deductions: 0,
              },
            ],
          },
          {
            result: "VOID",
            parts: [
              {
                eventDescription: "Man Utd v Everton",
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                result: "VOID",
                rule4Deductions: 0,
              },
            ],
          },
        ],
        result: "CASHED_OUT",
      },
    },
  },
  entities: { preferences: {}, throttles: {} },
};

const ALL_LEGS_WON_MULTIPLE_BET_STATE = {
  layouts: {
    cards: {
      sportsbookbets: {
        "ppb:tbd:card:sbkBet:923378353": {
          urn: "ppb:tbd:card:sbkBet:923378353",
          betURN: "ppb:sbkBet:923378353",
          type: "SPORTSBOOK_BET_CARD",
        },
      },
    },
    views: {
      mybets: "mybetsState",
    },
  },
  betting: {
    sportsbookbets: {
      "ppb:sbkBet:923378353": {
        urn: "ppb:sbkBet:923378353",
        betReceiptId: "O/10221904/0000164",
        betType: "DOUBLE",
        currentSize: 0.32,
        profitAndLoss: 1.91,
        numLines: 1,
        betId: 123456,
        edges: [{ reason: BetEdgeEnum.ACCA_INSURANCE }],
        legs: [
          {
            result: "WON",
            parts: [
              {
                eventDescription: "Man Utd v Everton",
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                marketBetUrn: "ppb:marketBet:30086678",
              },
            ],
          },
          {
            result: "WON",
            parts: [
              {
                eventDescription: "Man Utd v Everton",
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                marketBetUrn: "ppb:marketBet:55677043",
              },
            ],
          },
        ],
        result: "WON",
      },
    },
  },
  entities: { preferences: {}, throttles: {} },
};

const ONE_LOST_LEG_MULTIPLE_BET_STATE = {
  layouts: {
    cards: {
      sportsbookbets: {
        "ppb:tbd:card:sbkBet:923378353": {
          urn: "ppb:tbd:card:sbkBet:923378353",
          betURN: "ppb:sbkBet:923378353",
          type: "SPORTSBOOK_BET_CARD",
        },
      },
    },
    views: {
      mybets: "mybetsState",
    },
  },
  betting: {
    sportsbookbets: {
      "ppb:sbkBet:923378353": {
        urn: "ppb:sbkBet:923378353",
        betId: 1234567,
        betReceiptId: "O/10221904/0000164",
        betType: "DOUBLE",
        currentSize: 0.32,
        profitAndLoss: 1.91,
        numLines: 1,
        edges: [{ reason: BetEdgeEnum.ACCA_INSURANCE }],
        legs: [
          {
            result: "LOST",
            parts: [
              {
                eventDescription: "Man Utd v Everton",
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                marketBetUrn: "ppb:marketBet:30086678",
              },
            ],
          },
          {
            result: "WON",
            parts: [
              {
                eventDescription: "Man Utd v Everton",
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                marketBetUrn: "ppb:marketBet:55677043",
              },
            ],
          },
        ],
        result: "WON",
      },
    },
  },
  entities: { preferences: {}, throttles: {} },
};

const ONE_VOID_LEG_MULTIPLE_BET_STATE = {
  layouts: {
    cards: {
      sportsbookbets: {
        "ppb:tbd:card:sbkBet:923378353": {
          urn: "ppb:tbd:card:sbkBet:923378353",
          betURN: "ppb:sbkBet:923378353",
          type: "SPORTSBOOK_BET_CARD",
        },
      },
    },
    views: {
      mybets: "mybetsState",
    },
  },
  betting: {
    sportsbookbets: {
      "ppb:sbkBet:923378353": {
        urn: "ppb:sbkBet:923378353",
        betId: 1234567,
        betReceiptId: "O/10221904/0000164",
        betType: "DOUBLE",
        currentSize: 0.32,
        profitAndLoss: 1.91,
        numLines: 1,
        edges: [],
        legs: [
          {
            result: "VOID",
            parts: [
              {
                eventDescription: "Man Utd v Everton",
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                marketBetUrn: "ppb:marketBet:30086678",
              },
            ],
          },
          {
            result: "LOST",
            parts: [
              {
                eventDescription: "Grêmio v Internacional",
                eventMarketDescription: "First Goal Scorer",
                selectionName: "Tinga",
                marketBetUrn: "ppb:marketBet:30086679",
              },
            ],
          },
          {
            result: "WON",
            parts: [
              {
                eventDescription: "Man Utd v Everton",
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                marketBetUrn: "ppb:marketBet:55677043",
              },
            ],
          },
        ],
        result: "LOST",
      },
    },
  },
  entities: { preferences: {}, throttles: {} },
};

const SEVERAL_LEGS_LOST_MULTIPLE_BET_STATE = {
  layouts: {
    cards: {
      sportsbookbets: {
        "ppb:tbd:card:sbkBet:923378353": {
          urn: "ppb:tbd:card:sbkBet:923378353",
          betURN: "ppb:sbkBet:923378353",
          type: "SPORTSBOOK_BET_CARD",
        },
      },
    },
    views: {
      mybets: "mybetsState",
    },
  },
  betting: {
    sportsbookbets: {
      "ppb:sbkBet:923378353": {
        urn: "ppb:sbkBet:923378353",
        betReceiptId: "O/10221904/0000164",
        betType: "DOUBLE",
        currentSize: 0.32,
        betId: 12345678,
        profitAndLoss: 1.91,
        numLines: 1,
        edges: [],
        legs: [
          {
            result: "LOST",
            parts: [
              {
                eventDescription: "Man Utd v Everton",
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                marketBetUrn: "ppb:marketBet:30086678",
              },
            ],
          },
          {
            result: "LOST",
            parts: [
              {
                eventDescription: "Man Utd v Everton",
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                marketBetUrn: "ppb:marketBet:55677043",
              },
            ],
          },
        ],
        result: "CASHED_OUT",
      },
    },
  },
  entities: { preferences: {}, throttles: {} },
};

const ONE_LEG_ACCA_AVAILABLE_MULTIPLE_BET_STATE = {
  layouts: {
    cards: {
      sportsbookbets: {
        "ppb:tbd:card:sbkBet:923378353": {
          urn: "ppb:tbd:card:sbkBet:923378353",
          betURN: "ppb:sbkBet:923378353",
          type: "SPORTSBOOK_BET_CARD",
        },
      },
    },
    views: {
      mybets: "mybetsState",
    },
  },
  betting: {
    sportsbookbets: {
      "ppb:sbkBet:923378353": {
        urn: "ppb:sbkBet:923378353",
        betReceiptId: "O/10221904/0000164",
        betType: "DOUBLE",
        currentSize: 0.32,
        betId: 12345678,
        profitAndLoss: 1.91,
        numLines: 1,
        edges: [],
        legs: [
          {
            parts: [
              {
                eventDescription: "Man Utd v Everton",
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                marketBetUrn: "ppb:marketBet:55677043",
              },
            ],
            mutations: {
              eligibility: [
                {
                  mutation: "AccaFreeze",
                  mutationAvailability: "Available",
                },
              ],
            },
          },
          {
            parts: [
              {
                eventDescription: "Man Utd v Everton",
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                marketBetUrn: "ppb:marketBet:55677043",
              },
            ],
            mutations: {
              eligibility: [
                {
                  mutation: "AccaFreeze",
                  mutationAvailability: "Unavailable",
                },
              ],
            },
          },
        ],
        result: "CASHED_OUT",
        mutations: {
          eligibility: [{ mutation: "AccaFreeze" }],
        },
      },
    },
  },
  entities: { preferences: {}, throttles: {} },
};

const NO_LEGS_ACCA_AVAILABLE_MULTIPLE_BET_STATE = {
  layouts: {
    cards: {
      sportsbookbets: {
        "ppb:tbd:card:sbkBet:923378353": {
          urn: "ppb:tbd:card:sbkBet:923378353",
          betURN: "ppb:sbkBet:923378353",
          type: "SPORTSBOOK_BET_CARD",
        },
      },
    },
    views: {
      mybets: "mybetsState",
    },
  },
  betting: {
    sportsbookbets: {
      "ppb:sbkBet:923378353": {
        urn: "ppb:sbkBet:923378353",
        betReceiptId: "O/10221904/0000164",
        betType: "DOUBLE",
        currentSize: 0.32,
        betId: 12345678,
        profitAndLoss: 1.91,
        numLines: 1,
        edges: [],
        legs: [
          {
            parts: [
              {
                eventDescription: "Man Utd v Everton",
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                marketBetUrn: "ppb:marketBet:55677043",
              },
            ],
            mutations: {
              eligibility: [
                {
                  mutation: "AccaFreeze",
                  mutationAvailability: "Unavailable",
                },
              ],
            },
          },
          {
            parts: [
              {
                eventDescription: "Man Utd v Everton",
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                marketBetUrn: "ppb:marketBet:55677043",
              },
            ],
            mutations: {
              eligibility: [
                {
                  mutation: "AccaFreeze",
                  mutationAvailability: "Unavailable",
                },
              ],
            },
          },
        ],
        result: "CASHED_OUT",
        mutations: {
          eligibility: [{ mutation: "None" }],
        },
      },
    },
  },
  entities: { preferences: {}, throttles: {} },
};

const ONE_LEG_ACCA_FROZEN_MULTIPLE_BET_STATE = {
  layouts: {
    cards: {
      sportsbookbets: {
        "ppb:tbd:card:sbkBet:923378353": {
          urn: "ppb:tbd:card:sbkBet:923378353",
          betURN: "ppb:sbkBet:923378353",
          type: "SPORTSBOOK_BET_CARD",
        },
      },
    },
    views: {
      mybets: "mybetsState",
    },
  },
  betting: {
    sportsbookbets: {
      "ppb:sbkBet:923378353": {
        urn: "ppb:sbkBet:923378353",
        betReceiptId: "O/10221904/0000164",
        betType: "DOUBLE",
        currentSize: 0.32,
        betId: 12345678,
        profitAndLoss: 1.91,
        numLines: 1,
        edges: [],
        legs: [
          {
            parts: [
              {
                eventDescription: "Man Utd v Everton",
                eventMarketDescription: "Match Odds",
                selectionName: "Man Utd",
                marketBetUrn: "ppb:marketBet:55677043",
              },
            ],
            mutations: {
              eligibility: [
                {
                  mutation: "AccaFreeze",
                  mutationAvailability: "Available",
                },
              ],
              details: [
                {
                  freezeDetails: {
                    awayTeamScore: 0,
                    homeTeamScore: 1,
                    minute: 34,
                    homeTeamName: "Cardiff",
                    awayTeamName: "Swansea",
                  },
                },
              ],
            },
          },
          {
            parts: [
              {
                eventDescription: "Man Utd v Everton",
                eventMarketDescription: "Match Odds",
                selectionName: "Man Utd",
                marketBetUrn: "ppb:marketBet:55677043",
              },
            ],
            mutations: {
              eligibility: [
                {
                  mutation: "AccaFreeze",
                  mutationAvailability: "Unavailable",
                },
              ],
            },
          },
        ],
        result: "CASHED_OUT",
        mutations: {
          eligibility: [{ mutation: "AccaFreeze" }],
        },
      },
    },
  },
  entities: { preferences: {}, throttles: {}, brandSettings: { ACCA_FREEZE: true } },
};

const betStatusLabelOptions = { locale: undefined, showWinLoseVoidFeature: false, timezone: undefined };

function setup(state, containerProps = {}) {
  return makeMapStateToProps()(state, containerProps);
}

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("when `getUserDetails` throws", () => {
    const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

    beforeEach(() => {
      getUserDetails.mockImplementationOnce(() => {
        throw new Error(GET_USER_DETAILS_ERROR);
      });
    });

    it("should call console.error with the error thrown by `getUserDetails`", () => {
      setup(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

      expect(global.console.error).toHaveBeenCalledWith(new Error(GET_USER_DETAILS_ERROR));
    });

    it("should return an empty object", () => {
      const props = setup(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

      expect(props).toEqual({});
    });
  });

  describe("when the bet has Super Sub markets", () => {
    beforeEach(() => {
      getSportsbookBetCardByURN.mockReturnValueOnce(
        DEFAULT_SINGLE_BET_STATE_WITH_SUPER_SUB.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"],
      );
      getSportsbookBetByURN.mockReturnValueOnce(
        DEFAULT_SINGLE_BET_STATE_WITH_SUPER_SUB.betting.sportsbookbets["ppb:sbkBet:923378353"],
      );
      getSportsbookBetLegsByURN.mockReturnValueOnce(
        DEFAULT_SINGLE_BET_STATE_WITH_SUPER_SUB.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
      );
      createGetThrottleSelector.mockReturnValueOnce(jest.fn().mockReturnValue({ isActive: true }));
    });

    it("should render the Super Sub icon when bet has Super Sub", async () => {
      const { superSubIcon } = setup(DEFAULT_SINGLE_BET_STATE_WITH_SUPER_SUB, { urn: "ppb:tbd:card:sbkBet:923378353" });

      expect(superSubIcon).toEqual("Value--Super-Sub-With-Label");
    });
  });

  describe("when the bet has no Super Sub markets", () => {
    beforeEach(() => {
      getSportsbookBetCardByURN.mockReturnValueOnce(
        DEFAULT_SINGLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"],
      );
      getSportsbookBetByURN.mockReturnValueOnce(
        DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
      );
      getSportsbookBetLegsByURN.mockReturnValueOnce(
        DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
      );
      createGetThrottleSelector.mockReturnValueOnce(jest.fn().mockReturnValue({ isActive: true }));
    });

    it("should not render the Super Sub icon when bet has no Super Sub", async () => {
      const { superSubIcon } = setup(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

      expect(superSubIcon).toEqual(undefined);
    });
  });

  describe("when the brand setting is disabled", () => {
    beforeEach(() => {
      getSportsbookBetCardByURN.mockReturnValueOnce(
        DEFAULT_SINGLE_BET_STATE_WITH_SUPER_SUB.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"],
      );
      getSportsbookBetByURN.mockReturnValueOnce(
        DEFAULT_SINGLE_BET_STATE_WITH_SUPER_SUB.betting.sportsbookbets["ppb:sbkBet:923378353"],
      );
      getSportsbookBetLegsByURN.mockReturnValueOnce(
        DEFAULT_SINGLE_BET_STATE_WITH_SUPER_SUB.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
      );
      createGetThrottleSelector.mockReturnValueOnce(jest.fn().mockReturnValue({ isActive: false }));
    });

    it("should not render the Super Sub icon when brand setting is disabled", async () => {
      const { superSubIcon } = setup(DEFAULT_SINGLE_BET_STATE_WITH_SUPER_SUB, { urn: "ppb:tbd:card:sbkBet:923378353" });

      expect(superSubIcon).toEqual(undefined);
    });
  });

  describe("when getSportsbookBetCardByURN does not return a bet card", () => {
    it("should return an empty object", () => {
      getSportsbookBetCardByURN.mockReturnValueOnce(undefined);

      expect(setup(DEFAULT_SINGLE_BET_STATE)).toEqual({});
    });
  });

  describe("when getSportsbookBetCardByURN returns a single bet", () => {
    beforeEach(() => {
      getSportsbookBetCardByURN.mockReturnValueOnce(
        DEFAULT_SINGLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"],
      );
      isMultipleBetType.mockReturnValue(false);
    });

    describe("when getSportsbookBetByURN returns undefined", () => {
      beforeEach(() => {
        getSportsbookBetByURN.mockReturnValueOnce(undefined);
      });

      it("should return an empty object", () => {
        expect(setup(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" })).toEqual({});
      });
    });

    describe("when getSportsbookBetByURN returns a single bet", () => {
      it("should return labels", () => {
        getSportsbookBetByURN.mockReturnValueOnce(
          DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
        );
        getSportsbookBetLegsByURN.mockReturnValueOnce(
          DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );
        getPlacedReturns.mockReturnValueOnce("");
        const { labels } = setup(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

        expect(labels).toEqual({
          guaranteedPriceLabel: "I18N.LABELS.BEST_ODDS_GUARANTEED_REDUCED",
          heritageInfoLabel: {
            icon: "System--external-link",
            label: "I18N.HERITAGE.INFO_LABEL",
          },
          stake: "I18N.BETSLIP.STAKE",
          returns: "I18N.BETSLIP.RETURNS",
          placedReturns: "",
          freeBetsBonus: "",
          ghostLeg: "I18N.GHOST_LEG_APPLIED",
          oddsBoost: "I18N.BOOST_APPLIED",
          priceBoost: "I18N.MYBETS.PRICE_BOOST.SIGNPOST",
          moneyBackAcca: "I18N.MONEY_BACK_ACCA_APPLIED",
          moneyBack: "I18N.MONEY_BACK_ACCA_APPLIED",
        });
      });

      describe("when isSettled is true", () => {
        it("should return correct labels", () => {
          getSportsbookBetByURN.mockReturnValueOnce({
            ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
            isSettled: true,
          });
          getSportsbookBetLegsByURN.mockReturnValueOnce(
            DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
          );
          getPlacedReturns.mockReturnValueOnce("");
          const { labels } = setup(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

          expect(labels).toEqual({
            guaranteedPriceLabel: "I18N.LABELS.BEST_ODDS_GUARANTEED_REDUCED",
            heritageInfoLabel: {
              icon: "System--external-link",
              label: "I18N.HERITAGE.INFO_LABEL",
            },
            stake: "I18N.BETSLIP.STAKE",
            returns: "I18N.MY_BET.SETTLED_RETURNS",
            placedReturns: "",
            freeBetsBonus: "",
            ghostLeg: "I18N.GHOST_LEG_APPLIED",
            oddsBoost: "I18N.BOOST_APPLIED",
            priceBoost: "I18N.MYBETS.PRICE_BOOST.SIGNPOST",
            moneyBackAcca: "I18N.MONEY_BACK_ACCA_APPLIED",
            moneyBack: "I18N.MONEY_BACK_ACCA_APPLIED",
          });
        });
      });

      describe("when getBetTitle returns", () => {
        beforeEach(() => {
          getSportsbookBetByURN.mockReturnValueOnce(
            DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
          );
          getSportsbookBetLegsByURN.mockReturnValueOnce(
            DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
          );

          getBetTitle.mockReturnValueOnce("BET_SUPPORTING_TEXT_MOCK");
        });

        it("should return title", () => {
          const { title } = setup(DEFAULT_SINGLE_BET_STATE, {
            urn: "ppb:tbd:card:sbkBet:923378354",
          });

          expect(title).toBe("BET_SUPPORTING_TEXT_MOCK");
        });
      });

      describe("when getBetSupportingText returns", () => {
        beforeEach(() => {
          getSportsbookBetByURN.mockReturnValueOnce(
            DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
          );
          getSportsbookBetLegsByURN.mockReturnValueOnce(
            DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
          );
          getBetSupportingText.mockReturnValueOnce("BET_SUPPORTING_TEXT_MOCK");
        });

        it("should return supportingText", () => {
          const { supportingText } = setup(DEFAULT_SINGLE_BET_STATE, {
            urn: "ppb:tbd:card:sbkBet:923378354",
          });

          expect(supportingText).toBe("BET_SUPPORTING_TEXT_MOCK");
        });
      });

      describe("when getBetStatusLabel returns a valid object", () => {
        const BET_STATUS_LABEL = {
          text: "I18N.MY_BETS.RESULT.WON",
          icon: OthersIconName.CASH,
          type: StatusLabelType.WON,
        };

        beforeEach(() => {
          getBetStatusLabel.mockReturnValueOnce(BET_STATUS_LABEL);
        });

        it("should call getBetStatusLabel with bet and betLegs", () => {
          getSportsbookBetByURN.mockReturnValueOnce(
            DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
          );
          getSportsbookBetLegsByURN.mockReturnValueOnce(
            DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
          );
          setup(DEFAULT_SINGLE_BET_STATE, {
            urn: "ppb:tbd:card:sbkBet:923378353",
          });

          expect(getBetStatusLabel).toHaveBeenCalledWith(BET, BET.legs, betStatusLabelOptions);
        });

        it("should return statusLabelText, statusLabelIcon and statusLabelType", () => {
          getSportsbookBetByURN.mockReturnValueOnce(
            DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
          );
          getSportsbookBetLegsByURN.mockReturnValueOnce(
            DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
          );

          const { statusLabelText, statusLabelIcon, statusLabelType } = setup(DEFAULT_SINGLE_BET_STATE, {
            urn: "ppb:tbd:card:sbkBet:923378353",
          });

          expect(statusLabelText).toEqual(BET_STATUS_LABEL.text);
          expect(statusLabelIcon).toEqual(BET_STATUS_LABEL.icon);
          expect(statusLabelType).toEqual(BET_STATUS_LABEL.type);
        });

        describe("when MY_BETS_WIN_LOST_VOID throttle is active", () => {
          const betStatusLabelOptionsWithThrottle = {
            locale: "foo",
            timezone: "bar",
            showWinLoseVoidFeature: true,
          };

          it("should call getBetStatusLabel with bet, betLegs and options with showWinLoseVoidFeature set to true", () => {
            getUserDetails.mockReturnValueOnce({
              localeCodeBcp47: betStatusLabelOptionsWithThrottle.locale,
              timezone: betStatusLabelOptionsWithThrottle.timezone,
            });

            createGetThrottleSelector.mockReturnValueOnce(jest.fn().mockReturnValue({ isActive: true }));

            getSportsbookBetByURN.mockReturnValueOnce({
              ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
              lowestEventStartTime: "lowestEventStartTimeMock",
            });
            getSportsbookBetLegsByURN.mockReturnValueOnce(
              DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
            );
            setup(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378354" });

            expect(getBetStatusLabel).toHaveBeenCalledWith(
              {
                ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
                lowestEventStartTime: "lowestEventStartTimeMock",
              },
              DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
              betStatusLabelOptionsWithThrottle,
            );
          });
        });
      });

      it("should return isMultiple as false", () => {
        getSportsbookBetByURN.mockReturnValueOnce(
          DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
        );
        getSportsbookBetLegsByURN.mockReturnValueOnce(
          DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );
        const { isMultiple } = setup(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

        expect(isMultiple).toEqual(false);
      });

      describe("when currencyFormatWithDecimalPlaces returns", () => {
        beforeEach(() => {
          getUserDetails.mockReturnValueOnce({
            currencyCode: "EUR",
            localeCodeBcp47: "locale",
            timezone: "timezone",
          });
          currencyFormatWithDecimalPlaces.mockReturnValueOnce("STAKE_VALUE").mockReturnValue("RETURNS_VALUE");
          getSportsbookBetByURN.mockReturnValueOnce(
            DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
          );
          getSportsbookBetLegsByURN.mockReturnValueOnce(
            DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
          );
        });

        it("should return stake value formatted", () => {
          const { stake } = setup(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

          expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
            currencyCode: "EUR",
            decimalPlaces: 2,
            value: 0.11,
            localeCodeBcp47: "locale",
            timezone: "timezone",
          });

          expect(stake).toEqual("STAKE_VALUE");
        });

        it("should return potential win value formatted as returns", () => {
          const { returns } = setup(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

          expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
            currencyCode: "EUR",
            decimalPlaces: 2,
            value: 0.11,
            localeCodeBcp47: "locale",
            timezone: "timezone",
          });

          expect(returns).toEqual("RETURNS_VALUE");
        });
      });
    });

    describe("when getSportsbookBetByURN returns a single bet with bonus", () => {
      beforeEach(() => {
        getSportsbookBetByURN.mockReturnValueOnce({
          ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
          bonus: 1,
        });
        getSportsbookBetLegsByURN.mockReturnValueOnce(
          DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );
        buildFreeBetsLabel.mockReturnValueOnce("I18N.USED_FREEBET");
        getPlacedReturns.mockReturnValueOnce("");
      });

      it("should return freeBetsBonus label formatted", () => {
        const { labels } = setup(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378354" });

        expect(labels).toEqual({
          guaranteedPriceLabel: "I18N.LABELS.BEST_ODDS_GUARANTEED_REDUCED",
          heritageInfoLabel: {
            icon: "System--external-link",
            label: "I18N.HERITAGE.INFO_LABEL",
          },
          stake: "I18N.BETSLIP.STAKE",
          returns: "I18N.BETSLIP.RETURNS",
          placedReturns: "",
          freeBetsBonus: "I18N.USED_FREEBET",
          ghostLeg: "I18N.GHOST_LEG_APPLIED",
          oddsBoost: "I18N.BOOST_APPLIED",
          priceBoost: "I18N.MYBETS.PRICE_BOOST.SIGNPOST",
          moneyBackAcca: "I18N.MONEY_BACK_ACCA_APPLIED",
          moneyBack: "I18N.MONEY_BACK_ACCA_APPLIED",
        });
      });

      it("should return betSegmentInfo with freeBetsBonus", () => {
        const { betSegmentInfos } = setup(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378354" });

        expect(betSegmentInfos).toEqual([
          {
            label: "I18N.USED_FREEBET",
            icon: "Value--Free-Bet",
            infoLabelType: "generosity",
          },
        ]);
      });
    });

    describe("when getSportsbookBetByURN returns a single bet with hasRule4Deductions", () => {
      beforeEach(() => {
        getSportsbookBetByURN.mockReturnValueOnce(
          DEFAULT_SINGLE_BET_STATE_WITH_RULE_4_DEDUCTIONS.betting.sportsbookbets["ppb:sbkBet:923378353"],
        );
        getSportsbookBetLegsByURN.mockReturnValueOnce(
          DEFAULT_SINGLE_BET_STATE_WITH_RULE_4_DEDUCTIONS.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );
      });

      it("should return a proper betSegmentInfos", () => {
        getUserDetails.mockReturnValueOnce({
          localeCode: "en",
          jurisdiction: {
            jurisdiction: "INTERNATIONAL",
          },
        });
        const { betSegmentInfos } = setup(DEFAULT_SINGLE_BET_STATE_WITH_RULE_4_DEDUCTIONS, {
          urn: "ppb:tbd:card:sbkBet:923378354",
        });

        expect(betSegmentInfos).toEqual([
          {
            externalUrl: "https://support.skybet.com/s/article/Horse-Racing-Rule-4-Rules",
            icon: "System--external-link",
            iconPosition: "right",
            infoLabelType: "info",
            label: "I18N.MYBETS.RULE4 RULE4PERCENTAGE:30%",
          },
        ]);
      });
    });

    describe("when setting originalReturns", () => {
      beforeEach(() => {
        currencyFormatWithDecimalPlaces.mockReturnValue("RETURNS_VALUE");
      });

      describe("when originalPotentialWin is not defined", () => {
        beforeEach(() => {
          getSportsbookBetByURN.mockReturnValueOnce({
            ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
            originalPotentialWin: undefined,
            isSettled: false,
          });

          getSportsbookBetLegsByURN.mockReturnValueOnce(
            DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
          );
        });

        it("should return originalReturns as undefined", () => {
          const { originalReturns } = setup(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

          expect(originalReturns).toEqual(undefined);
        });
      });

      describe("when settled", () => {
        beforeEach(() => {
          getSportsbookBetByURN.mockReturnValueOnce({
            ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
            originalPotentialWin: 23,
            isSettled: true,
          });

          getSportsbookBetLegsByURN.mockReturnValueOnce(
            DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
          );
        });

        it("should return originalReturns as undefined", () => {
          const { originalReturns } = setup(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

          expect(originalReturns).toEqual(undefined);
        });
      });

      describe("when not boosted", () => {
        beforeEach(() => {
          getSportsbookBetByURN.mockReturnValueOnce({
            ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
            originalPotentialWin: 23,
            isSettled: false,
          });

          getSportsbookBetLegsByURN.mockReturnValueOnce(
            DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
          );
        });

        it("should return originalReturns as undefined", () => {
          const { originalReturns } = setup(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

          expect(originalReturns).toEqual(undefined);
        });
      });

      describe("when not settled, not PBM and boosted, with an original win value", () => {
        beforeEach(() => {
          getSportsbookBetByURN.mockReturnValueOnce({
            ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
            originalPotentialWin: 23,
            isSettled: false,
            isOddsBoosted: true,
            isPBM: false,
          });

          getSportsbookBetLegsByURN.mockReturnValueOnce(
            DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
          );
        });

        it("should return originalReturns formatted", () => {
          const { originalReturns } = setup(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

          expect(originalReturns).toEqual("RETURNS_VALUE");
        });
      });
    });

    describe("when getSportsbookBetByURN returns a single bet without profitAndLoss", () => {
      beforeEach(() => {
        getSportsbookBetByURN.mockReturnValueOnce({
          ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
          profitAndLoss: undefined,
        });

        getSportsbookBetLegsByURN.mockReturnValueOnce(
          DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );
      });

      it("should return potential win value with TBD value and placed returns as undefined", () => {
        const { returns, placedReturns } = setup(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

        expect(returns).toEqual("I18N.BETSLIP.TBD");
        expect(placedReturns).toEqual(undefined);
      });
    });

    describe("when getSportsbookBetByURN returns a single bet with potentialWinForPlace", () => {
      beforeEach(() => {
        getSportsbookBetByURN.mockReturnValueOnce({
          ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
          potentialWinForPlace: 0.12,
        });

        getSportsbookBetLegsByURN.mockReturnValueOnce(
          DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );
      });

      it("should return placedReturns formatted", () => {
        const { placedReturns } = setup(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

        expect(placedReturns).toEqual("RETURNS_VALUE");
      });
    });

    describe("when getSportsbookBetByURN returns a single bet with oddsBoost", () => {
      beforeEach(() => {
        getSportsbookBetByURN.mockReturnValueOnce({
          ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
          isOddsBoosted: true,
        });
        getSportsbookBetLegsByURN.mockReturnValueOnce(
          DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );
        const mockFunction = (odd) => `${odd}_FORMATTED`;
        formatOddsByPriceType.mockImplementationOnce(mockFunction).mockImplementationOnce(mockFunction);
      });

      it("should return both original and current odds boost", () => {
        const { betSegmentInfos } = setup(DEFAULT_SINGLE_BET_STATE, {
          urn: "ppb:tbd:card:sbkBet:923378353",
        });

        expect(formatOddsByPriceType).toHaveBeenCalledWith("2.8", "pricetypemock", "DECIMAL", true);
        expect(formatOddsByPriceType).toHaveBeenCalledWith("2.2", "pricetypemock", "DECIMAL", true);

        expect(betSegmentInfos[0].oddsValue).toEqual("2.8_FORMATTED");
        expect(betSegmentInfos[0].previousOddsValue).toEqual("2.2_FORMATTED");
      });
    });
    describe("when getSportsbookBetByURN returns a single bet with isPBM", () => {
      it("should return isPBM from the bet", () => {
        getSportsbookBetByURN.mockReturnValueOnce({
          ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
          isPBM: true,
        });
        getSportsbookBetLegsByURN.mockReturnValueOnce(
          DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );
        const { isPBM } = setup(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });
        expect(isPBM).toEqual(true);
      });

      it("should return showOddsBoostSignposting as false when isPBM is true", () => {
        getSportsbookBetByURN.mockReturnValueOnce({
          ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
          isPBM: true,
          isOddsBoosted: true,
        });

        getSportsbookBetLegsByURN.mockReturnValueOnce(
          DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );
        const { showOddsBoostSignposting } = setup(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

        expect(showOddsBoostSignposting).toEqual(false);
      });

      it("should return showOddsBoostSignposting as true when isPBM is false", () => {
        getSportsbookBetByURN.mockReturnValueOnce({
          ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
          isPBM: false,
          isOddsBoosted: true,
        });

        getSportsbookBetLegsByURN.mockReturnValueOnce(
          DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );
        const { showOddsBoostSignposting } = setup(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

        expect(showOddsBoostSignposting).toEqual(true);
      });
    });
    describe("when getSportsbookBetByURN returns a single bet with isPBS", () => {
      it("should return isPBS from the bet", () => {
        getSportsbookBetByURN.mockReturnValueOnce({
          ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
          isPBS: true,
        });
        getSportsbookBetLegsByURN.mockReturnValueOnce(
          DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );
        const { isPBS } = setup(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });
        expect(isPBS).toEqual(true);
      });
    });
    describe("when getSportsbookBetByURN returns a single bet with boostedInfo", () => {
      describe("when build statusLabelBoostedInfo", () => {
        it("should return undefined when isPBS is false", () => {
          getSportsbookBetByURN.mockReturnValueOnce({
            ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
            isPBS: false,
          });
          getSportsbookBetLegsByURN.mockReturnValueOnce(
            DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
          );

          const { boostedInfo } = setup(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

          expect(boostedInfo).toBeUndefined();
        });

        it("should return undefined when isPBM", () => {
          getSportsbookBetByURN.mockReturnValueOnce({
            ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
            isPBM: false,
          });
          getSportsbookBetLegsByURN.mockReturnValueOnce(
            DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
          );

          const { boostedInfo } = setup(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

          expect(boostedInfo).toBeUndefined();
        });

        describe("when isPBM is true", () => {
          it("should return correct iconName and label", () => {
            getSportsbookBetByURN.mockReturnValueOnce({
              ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
              isPBM: true,
            });

            getSportsbookBetLegsByURN.mockReturnValueOnce([
              {
                ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
                parts: [
                  {
                    marketType: "SOME_PBM_MARKET",
                  },
                ],
              },
            ]);

            const { statusLabelBoostedInfo } = setup(DEFAULT_SINGLE_BET_STATE, {
              urn: "ppb:tbd:card:sbkBet:923378353",
            });

            expect(statusLabelBoostedInfo.iconName).toEqual(ValueIconName.BOOSTER);
            expect(statusLabelBoostedInfo.label).toEqual("I18N.MYBETS.PRICE_BOOST.SIGNPOST");
          });
        });

        describe("when isPBS is true", () => {
          it("should return correct iconName and label", () => {
            getSportsbookBetByURN.mockReturnValueOnce({
              ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
              isPBS: true,
            });

            getSportsbookBetLegsByURN.mockReturnValueOnce([
              {
                ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
                parts: [
                  {
                    marketType: "SUPER_BOOST",
                  },
                ],
              },
            ]);

            const { statusLabelBoostedInfo } = setup(DEFAULT_SINGLE_BET_STATE, {
              urn: "ppb:tbd:card:sbkBet:923378353",
            });

            expect(statusLabelBoostedInfo.iconName).toEqual(ValueIconName.SUPER_BOOST);
            expect(statusLabelBoostedInfo.label).toEqual("I18N.SUPER_BOOST.SIGNPOSTING");
          });
        });
      });
    });

    describe("when getSportsbookBetByURN returns a single 90 minute bet", () => {
      beforeEach(() => {
        getSportsbookBetByURN.mockReturnValueOnce(NINETY_MINUTE_BET);
        getSportsbookBetLegsByURN.mockReturnValueOnce(
          DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );
      });

      it("should return the 90 minute betSegmentInfos", () => {
        const { betSegmentInfos } = setup(DEFAULT_SINGLE_BET_STATE, {
          urn: "ppb:tbd:card:sbkBet:90",
        });

        expect(betSegmentInfos).toEqual([
          {
            infoLabelType: InfoLabelType.BRANDED,
            label: "I18N.NINETY_MINUTE.MY_BETS_LABEL",
          },
        ]);
      });
    });

    describe("when getSportsbookBetByURN returns a single 90 minute bet and result was not WIN", () => {
      beforeEach(() => {
        getSportsbookBetByURN.mockReturnValueOnce({ ...NINETY_MINUTE_BET, result: "NOT_WIN" });

        getSportsbookBetLegsByURN.mockReturnValueOnce(
          DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );
      });

      it("should return an empty array if the bet has `has90MinBet` as true", () => {
        const { betSegmentInfos } = setup(DEFAULT_SINGLE_BET_STATE, {
          urn: "ppb:tbd:card:sbkBet:90",
        });

        expect(betSegmentInfos).toEqual([]);
      });
    });

    describe("when getSportsbookBetByURN returns a single bet with cashoutQuoteURN", () => {
      beforeEach(() => {
        getSportsbookBetByURN.mockReturnValueOnce({
          ...DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
          cashoutQuoteURN: "SOME_CASHOUT_URN",
        });

        getSportsbookBetLegsByURN.mockReturnValueOnce(
          DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );
      });

      describe("and has no quote", () => {
        beforeEach(() => {
          getIsCashoutQuoteDisplayedByURN.mockReturnValueOnce(false);
        });

        it("should return the cashoutQuoteURN with a false hasQuote", () => {
          const { cashoutQuoteURN, hasQuote } = setup(DEFAULT_SINGLE_BET_STATE, {
            urn: "ppb:tbd:card:sbkBet:923378353",
          });

          expect(cashoutQuoteURN).toEqual("SOME_CASHOUT_URN");
          expect(hasQuote).toEqual(false);
        });
      });

      describe("and has a quote available", () => {
        beforeEach(() => {
          getIsCashoutQuoteDisplayedByURN.mockReturnValueOnce(true);
        });

        it("should return the cashoutQuoteURN with a true hasQuote", () => {
          const { cashoutQuoteURN, hasQuote } = setup(DEFAULT_SINGLE_BET_STATE, {
            urn: "ppb:tbd:card:sbkBet:923378353",
          });

          expect(cashoutQuoteURN).toEqual("SOME_CASHOUT_URN");
          expect(hasQuote).toEqual(true);
        });
      });
    });

    describe("when getSportsbookBetByURN returns a single bet with priceType of 'GUARANTEED'", () => {
      beforeEach(() => {
        getSportsbookBetByURN.mockReturnValueOnce(
          DEFAULT_SINGLE_BET_STATE_WITH_BOG.betting.sportsbookbets["ppb:sbkBet:923378353"],
        );

        getSportsbookBetLegsByURN.mockReturnValueOnce(
          DEFAULT_SINGLE_BET_STATE_WITH_BOG.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );
      });

      it("should return isPriceGuaranteedAvailable as true", () => {
        const { isGuaranteedPriceSelected } = setup(DEFAULT_SINGLE_BET_STATE_WITH_BOG, {
          urn: "ppb:tbd:card:sbkBet:923378353",
        });

        expect(isGuaranteedPriceSelected).toEqual(true);
      });
    });

    describe("with external links", () => {
      it("rule 4 and dead heat InfoLabels directs to SBG url", () => {
        getUserDetails.mockReturnValueOnce({ localeCode: "en", jurisdiction: { jurisdiction: "INTERNATIONAL" } });
        const state = {
          ...DEFAULT_SINGLE_BET_STATE_WITH_RULE_4_AND_DEAD_HEAT,
          entities: { preferences: {}, throttles: {} },
        };

        getSportsbookBetCardByURN.mockReturnValue(state.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"]);
        getSportsbookBetByURN.mockReturnValue(state.betting.sportsbookbets["ppb:sbkBet:923378353"]);
        getSportsbookBetLegsByURN.mockReturnValue(state.betting.sportsbookbets["ppb:sbkBet:923378353"].legs);
        const props = makeMapStateToProps()(state, { urn: "ppb:tbd:card:sbkBet:923378353" });

        expect(props.betSegmentInfos).toEqual([
          {
            externalUrl: "https://support.skybet.com/s/article/Horse-Racing-Rule-4-Rules",
            icon: "System--external-link",
            iconPosition: "right",
            infoLabelType: "info",
            label: "I18N.MYBETS.RULE4 RULE4PERCENTAGE:30%",
          },
          {
            externalUrl: "https://support.skybet.com/s/article/Dead-Heat",
            icon: "System--external-link",
            iconPosition: "right",
            infoLabelType: "info",
            label: "I18N.MYBETS.DEAD_HEAT",
          },
        ]);
      });
    });

    describe("when jurisdiction is INTERNATIONAL and locale is EN", () => {
      it("rule 4 and dead heat InfoLabels directs to SBG url", () => {
        getUserDetails.mockReturnValueOnce({ localeCode: "en", jurisdiction: { jurisdiction: "INTERNATIONAL" } });
        const state = {
          ...DEFAULT_SINGLE_BET_STATE_WITH_RULE_4_AND_DEAD_HEAT,
          entities: { preferences: {}, throttles: {} },
        };

        getSportsbookBetCardByURN.mockReturnValue(state.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"]);
        getSportsbookBetByURN.mockReturnValue(state.betting.sportsbookbets["ppb:sbkBet:923378353"]);
        getSportsbookBetLegsByURN.mockReturnValue(state.betting.sportsbookbets["ppb:sbkBet:923378353"].legs);
        const props = makeMapStateToProps()(state, { urn: "ppb:tbd:card:sbkBet:923378353" });

        expect(props.betSegmentInfos).toEqual([
          {
            externalUrl: "https://support.skybet.com/s/article/Horse-Racing-Rule-4-Rules",
            icon: "System--external-link",
            iconPosition: "right",
            infoLabelType: "info",
            label: "I18N.MYBETS.RULE4 RULE4PERCENTAGE:30%",
          },
          {
            externalUrl: "https://support.skybet.com/s/article/Dead-Heat",
            icon: "System--external-link",
            iconPosition: "right",
            infoLabelType: "info",
            label: "I18N.MYBETS.DEAD_HEAT",
          },
        ]);
      });
    });

    describe("when jurisdiction is international and locale is NO", () => {
      it("rule 4 and dead heat InfoLabels directs to SBG url", () => {
        const state = {
          ...DEFAULT_SINGLE_BET_STATE_WITH_RULE_4_AND_DEAD_HEAT,
          entities: { preferences: {}, throttles: {} },
        };

        getSportsbookBetCardByURN.mockReturnValue(state.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"]);
        getSportsbookBetByURN.mockReturnValue(state.betting.sportsbookbets["ppb:sbkBet:923378353"]);
        getSportsbookBetLegsByURN.mockReturnValue(state.betting.sportsbookbets["ppb:sbkBet:923378353"].legs);
        getUserDetails.mockReturnValueOnce({ localeCode: "no", jurisdiction: { jurisdiction: "INTERNATIONAL" } });

        const props = makeMapStateToProps()(state, { urn: "ppb:tbd:card:sbkBet:923378353" });
        expect(props.betSegmentInfos).toEqual([
          {
            externalUrl: "https://support.betfair.com/no/app/answers/detail/a_id/11011",
            icon: "System--external-link",
            iconPosition: "right",
            infoLabelType: "info",
            label: "I18N.MYBETS.RULE4 RULE4PERCENTAGE:30%",
          },
          {
            externalUrl: "https://support.betfair.com/no/app/answers/detail/a_id/11016",
            icon: "System--external-link",
            iconPosition: "right",
            infoLabelType: "info",
            label: "I18N.MYBETS.DEAD_HEAT",
          },
        ]);
      });
    });
  });

  describe("when getSportsbookBetCardByURN returns a multiple bet", () => {
    beforeEach(() => {
      getSportsbookBetCardByURN.mockReturnValueOnce(
        DEFAULT_MULTIPLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"],
      );
      isMultipleBetType.mockReturnValue(true);
    });

    describe("when one betleg is available for acca freeze", () => {
      it("should return numberOfAccaFreezeEligibleLegs as 1", () => {
        getSportsbookBetByURN.mockReturnValueOnce(
          ONE_LEG_ACCA_AVAILABLE_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
        );

        getSportsbookBetLegsByURN.mockReturnValueOnce(
          ONE_LEG_ACCA_AVAILABLE_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );

        getAccaFreezeEligibleLegs.mockReturnValueOnce(["test_string"]);

        const { numberOfAccaFreezeEligibleLegs } = setup(ONE_LEG_ACCA_AVAILABLE_MULTIPLE_BET_STATE, {
          urn: "ppb:tbd:card:sbkBet:923378354",
        });

        expect(numberOfAccaFreezeEligibleLegs).toEqual(1);
      });
    });

    describe("when none of the betlegs are available for acca freeze", () => {
      it("should return numberOfAccaFreezeEligibleLegs as 0", () => {
        getSportsbookBetByURN.mockReturnValueOnce(
          NO_LEGS_ACCA_AVAILABLE_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
        );

        getSportsbookBetLegsByURN.mockReturnValueOnce(
          NO_LEGS_ACCA_AVAILABLE_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );
        const { numberOfAccaFreezeEligibleLegs } = setup(NO_LEGS_ACCA_AVAILABLE_MULTIPLE_BET_STATE, {
          urn: "ppb:tbd:card:sbkBet:923378354",
        });

        expect(numberOfAccaFreezeEligibleLegs).toEqual(0);
      });
    });

    describe("when the bet has an eligibily of AccaFreeze", () => {
      it("should return isAccaFreezeEligible as true", () => {
        getSportsbookBetByURN.mockReturnValueOnce(
          ONE_LEG_ACCA_AVAILABLE_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
        );

        getSportsbookBetLegsByURN.mockReturnValueOnce(
          ONE_LEG_ACCA_AVAILABLE_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );
        getIsAccaFreezeEligible.mockReturnValueOnce(true);
        const { isAccaFreezeEligible } = setup(ONE_LEG_ACCA_AVAILABLE_MULTIPLE_BET_STATE, {
          urn: "ppb:tbd:card:sbkBet:923378354",
        });

        expect(isAccaFreezeEligible).toEqual(true);
      });

      it("should return a populated freezeDetails string when there is a frozen leg", () => {
        getSportsbookBetByURN.mockReturnValueOnce(
          ONE_LEG_ACCA_FROZEN_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
        );

        getSportsbookBetLegsByURN.mockReturnValueOnce(
          ONE_LEG_ACCA_FROZEN_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );
        const { freezeDetails } = setup(ONE_LEG_ACCA_FROZEN_MULTIPLE_BET_STATE, {
          urn: "ppb:tbd:card:sbkBet:923378354",
        });

        expect(freezeDetails).not.toEqual("");
      });

      it("should return an empty freezeDetails string when there is no frozen leg", () => {
        getSportsbookBetByURN.mockReturnValueOnce(
          ONE_LEG_ACCA_AVAILABLE_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
        );

        getSportsbookBetLegsByURN.mockReturnValueOnce(
          ONE_LEG_ACCA_AVAILABLE_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );
        const { freezeDetails } = setup(ONE_LEG_ACCA_AVAILABLE_MULTIPLE_BET_STATE, {
          urn: "ppb:tbd:card:sbkBet:923378354",
        });

        expect(freezeDetails).toEqual("");
      });
    });

    describe("when the bet is not available for acca freeze", () => {
      it("should return isAccaFreezeEligible as false", () => {
        getSportsbookBetByURN.mockReturnValueOnce(
          NO_LEGS_ACCA_AVAILABLE_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
        );

        getSportsbookBetLegsByURN.mockReturnValueOnce(
          NO_LEGS_ACCA_AVAILABLE_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );

        getIsAccaFreezeEligible.mockReturnValueOnce(false);
        const { isAccaFreezeEligible } = setup(NO_LEGS_ACCA_AVAILABLE_MULTIPLE_BET_STATE, {
          urn: "ppb:tbd:card:sbkBet:923378354",
        });

        expect(isAccaFreezeEligible).toEqual(false);
      });
    });

    describe("when the bet is eligible for being frozen and has not been frozen already", () => {
      it("should return shouldShowFreezeSelectionButton as true", () => {
        getSportsbookBetByURN.mockReturnValueOnce(
          ONE_LEG_ACCA_AVAILABLE_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
        );

        getSportsbookBetLegsByURN.mockReturnValueOnce(
          ONE_LEG_ACCA_AVAILABLE_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );

        getIsAccaFreezeEligible.mockReturnValueOnce(true);
        getIsBetFrozen.mockReturnValueOnce(false);

        const { shouldShowFreezeSelectionButton } = setup(ONE_LEG_ACCA_AVAILABLE_MULTIPLE_BET_STATE, {
          urn: "ppb:tbd:card:sbkBet:923378354",
        });

        expect(shouldShowFreezeSelectionButton).toEqual(true);
      });
    });

    describe("when the bet is eligible for being frozen and has been frozen already", () => {
      it("should return shouldShowFreezeSelectionButton as false", () => {
        getSportsbookBetByURN.mockReturnValueOnce(
          ONE_LEG_ACCA_AVAILABLE_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
        );

        getSportsbookBetLegsByURN.mockReturnValueOnce(
          ONE_LEG_ACCA_AVAILABLE_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );

        getIsAccaFreezeEligible.mockReturnValueOnce(true);
        getIsBetFrozen.mockReturnValueOnce(true);
        const { shouldShowFreezeSelectionButton } = setup(ONE_LEG_ACCA_AVAILABLE_MULTIPLE_BET_STATE, {
          urn: "ppb:tbd:card:sbkBet:923378354",
        });

        expect(shouldShowFreezeSelectionButton).toEqual(false);
      });
    });

    describe("when the bet is not eligible for being frozen", () => {
      it("should return shouldShowFreezeSelectionButton as false", () => {
        getSportsbookBetByURN.mockReturnValueOnce(
          ONE_LEG_ACCA_AVAILABLE_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
        );

        getSportsbookBetLegsByURN.mockReturnValueOnce(
          ONE_LEG_ACCA_AVAILABLE_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );

        getIsAccaFreezeEligible.mockReturnValueOnce(false);
        const { shouldShowFreezeSelectionButton } = setup(ONE_LEG_ACCA_AVAILABLE_MULTIPLE_BET_STATE, {
          urn: "ppb:tbd:card:sbkBet:923378354",
        });

        expect(shouldShowFreezeSelectionButton).toEqual(false);
      });
    });

    describe("when the number of betlegs = 2", () => {
      it("should return numberOfBetLegs as 2", () => {
        getSportsbookBetByURN.mockReturnValueOnce(
          NO_LEGS_ACCA_AVAILABLE_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
        );

        getSportsbookBetLegsByURN.mockReturnValueOnce(
          NO_LEGS_ACCA_AVAILABLE_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );
        const { numberOfBetLegs } = setup(NO_LEGS_ACCA_AVAILABLE_MULTIPLE_BET_STATE, {
          urn: "ppb:tbd:card:sbkBet:923378354",
        });

        expect(numberOfBetLegs).toEqual(2);
      });
    });

    describe("when getSportsbookBetByURN returns a multiple bet", () => {
      beforeEach(() => {
        getSportsbookBetByURN.mockReturnValueOnce(
          DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
        );

        getSportsbookBetLegsByURN.mockReturnValueOnce(
          DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );
      });

      it("should return labels", () => {
        getUserDetails.mockReturnValueOnce({ localeCode: "en", jurisdiction: { jurisdiction: "INTERNATIONAL" } });
        getPlacedReturns.mockReturnValueOnce("");
        const { labels } = setup(DEFAULT_MULTIPLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

        expect(labels).toEqual({
          guaranteedPriceLabel: "I18N.LABELS.BEST_ODDS_GUARANTEED_REDUCED",
          heritageInfoLabel: {
            icon: "System--external-link",
            label: "I18N.HERITAGE.INFO_LABEL",
          },
          stake: "I18N.BETSLIP.STAKE",
          returns: "I18N.BETSLIP.RETURNS",
          placedReturns: "",
          freeBetsBonus: "",
          ghostLeg: "I18N.GHOST_LEG_APPLIED",
          oddsBoost: "I18N.BOOST_APPLIED",
          priceBoost: "I18N.MYBETS.PRICE_BOOST.SIGNPOST",
          moneyBackAcca: "I18N.MONEY_BACK_ACCA_APPLIED",
          moneyBack: "I18N.MONEY_BACK_ACCA_APPLIED",
        });
      });

      describe("when getBetTitle returns", () => {
        beforeEach(() => {
          getBetTitle.mockReturnValueOnce("BET_TITLE_MOCK");
        });

        it("should return title", () => {
          getUserDetails.mockReturnValueOnce({ localeCode: "en", jurisdiction: { jurisdiction: "INTERNATIONAL" } });
          const { title } = setup(DEFAULT_MULTIPLE_BET_STATE, {
            urn: "ppb:tbd:card:sbkBet:923378354",
          });

          expect(title).toBe("BET_TITLE_MOCK");
        });
      });

      describe("when getBetSupportingText returns", () => {
        beforeEach(() => {
          getBetSupportingText.mockReturnValueOnce("BET_SUPPORTING_TEXT_MOCK");
        });

        it("should return supportingText", () => {
          getUserDetails.mockReturnValueOnce({ localeCode: "en", jurisdiction: { jurisdiction: "INTERNATIONAL" } });
          const { supportingText } = setup(DEFAULT_MULTIPLE_BET_STATE, {
            urn: "ppb:tbd:card:sbkBet:923378354",
          });

          expect(supportingText).toBe("BET_SUPPORTING_TEXT_MOCK");
        });
      });

      describe("when getBetStatusLabel returns a valid object", () => {
        const BET_STATUS_LABEL = {
          text: "I18N.MY_BETS.RESULT.WON",
          icon: OthersIconName.CASH,
          type: StatusLabelType.WON,
        };

        beforeEach(() => {
          getBetStatusLabel.mockReturnValueOnce(BET_STATUS_LABEL);
        });

        it("should return statusLabelText, statusLabelIcon and statusLabelType", () => {
          getUserDetails.mockReturnValueOnce({ localeCode: "en", jurisdiction: { jurisdiction: "INTERNATIONAL" } });
          const { statusLabelText, statusLabelIcon, statusLabelType } = setup(DEFAULT_MULTIPLE_BET_STATE, {
            urn: "ppb:tbd:card:sbkBet:923378353",
          });

          expect(statusLabelText).toEqual(BET_STATUS_LABEL.text);
          expect(statusLabelIcon).toEqual(BET_STATUS_LABEL.icon);
          expect(statusLabelType).toEqual(BET_STATUS_LABEL.type);
        });
      });

      it("should return isMultiple as true", () => {
        getUserDetails.mockReturnValueOnce({ localeCode: "en", jurisdiction: { jurisdiction: "INTERNATIONAL" } });
        const { isMultiple } = setup(DEFAULT_MULTIPLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

        expect(isMultiple).toEqual(true);
      });

      describe("when currencyFormatWithDecimalPlaces returns", () => {
        beforeEach(() => {
          getUserDetails.mockReturnValueOnce({
            currencyCode: "EUR",
            localeCodeBcp47: "locale",
            timezone: "timezone",
            localeCode: "en",
            jurisdiction: { jurisdiction: "INTERNATIONAL" },
          });
          currencyFormatWithDecimalPlaces.mockReturnValueOnce("STAKE_VALUE").mockReturnValue("RETURNS_VALUE");
        });

        it("should return stake value formatted", () => {
          const { stake } = setup(DEFAULT_MULTIPLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

          expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
            currencyCode: "EUR",
            decimalPlaces: 2,
            value: 0.32,
            localeCodeBcp47: "locale",
            timezone: "timezone",
            localeCode: "en",
            jurisdiction: { jurisdiction: "INTERNATIONAL" },
          });

          expect(stake).toEqual("STAKE_VALUE");
        });

        it("should return potential win value formatted as returns", () => {
          const { returns } = setup(DEFAULT_MULTIPLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

          expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
            currencyCode: "EUR",
            decimalPlaces: 2,
            value: 1.91,
            localeCodeBcp47: "locale",
            timezone: "timezone",
            localeCode: "en",
            jurisdiction: { jurisdiction: "INTERNATIONAL" },
          });

          expect(returns).toEqual("RETURNS_VALUE");
        });
      });

      describe("when multiple hasRule4Deductions", () => {
        it("should return a proper betSegmentInfos", () => {
          getUserDetails.mockReturnValueOnce({ localeCode: "en", jurisdiction: { jurisdiction: "INTERNATIONAL" } });
          const { betSegmentInfos } = setup(DEFAULT_MULTIPLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

          expect(betSegmentInfos).toEqual([
            {
              label: "I18N.MYBETS.RULE4_MULTIPLES",
              externalUrl: "https://support.skybet.com/s/article/Horse-Racing-Rule-4-Rules",
              icon: "System--external-link",
              iconPosition: "right",
              infoLabelType: "info",
            },
          ]);
        });
      });
    });

    describe("when getSportsbookBetByURN returns a multiple bet with acca insurance", () => {
      beforeEach(() => {
        isAccaInsuranceSelected.mockReturnValueOnce(true);
      });

      describe("when the bets are open", () => {
        describe("when no legs have been set as LOST", () => {
          beforeEach(() => {
            getSportsbookBetByURN.mockReturnValueOnce({
              ...ALL_LEGS_WON_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
              isSettled: false,
            });

            getSportsbookBetLegsByURN.mockReturnValueOnce(
              ALL_LEGS_WON_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
            );
          });

          it("should return a proper betSegmentInfos", () => {
            const { betSegmentInfos } = setup(ALL_LEGS_WON_MULTIPLE_BET_STATE, {
              urn: "ppb:tbd:card:sbkBet:923378353",
            });

            expect(betSegmentInfos).toEqual([
              { label: "I18N.MY_BETS.ACCA_INSURANCE_APPLIED", icon: ValueIconName.ACCA_INSURANCE },
            ]);
          });
        });

        describe("when one leg has been set as VOID", () => {
          beforeEach(() => {
            getSportsbookBetByURN.mockReturnValueOnce(
              ONE_VOID_LEG_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
            );

            getSportsbookBetLegsByURN.mockReturnValueOnce(
              ONE_VOID_LEG_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
            );
          });

          it("should return an empty betSegmentInfos", () => {
            const { betSegmentInfos } = setup(ONE_VOID_LEG_MULTIPLE_BET_STATE, {
              urn: "ppb:tbd:card:sbkBet:923378353",
            });

            expect(betSegmentInfos).toEqual([]);
          });
        });

        describe("when one leg has been set as LOST", () => {
          beforeEach(() => {
            getSportsbookBetByURN.mockReturnValueOnce({
              ...ONE_LOST_LEG_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
              isSettled: false,
            });

            getSportsbookBetLegsByURN.mockReturnValueOnce(
              ONE_LOST_LEG_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
            );
          });

          it("should return a proper betSegmentInfos", () => {
            const { betSegmentInfos } = setup(ONE_LOST_LEG_MULTIPLE_BET_STATE, {
              urn: "ppb:tbd:card:sbkBet:923378353",
            });

            expect(betSegmentInfos).toEqual([
              { label: "I18N.MY_BETS.ACCA_INSURANCE_APPLIED", icon: ValueIconName.ACCA_INSURANCE },
            ]);
          });
        });

        describe("when more than one leg has been set as LOST", () => {
          beforeEach(() => {
            getSportsbookBetByURN.mockReturnValueOnce({
              ...SEVERAL_LEGS_LOST_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
              edges: [{ reason: BetEdgeEnum.ACCA_INSURANCE }],
              result: "WON",
              isSettled: false,
            });

            getSportsbookBetLegsByURN.mockReturnValueOnce(
              SEVERAL_LEGS_LOST_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
            );
          });

          it("should return a proper betSegmentInfos", () => {
            const { betSegmentInfos } = setup(SEVERAL_LEGS_LOST_MULTIPLE_BET_STATE, {
              urn: "ppb:tbd:card:sbkBet:923378353",
            });

            expect(betSegmentInfos).toEqual([
              { label: "I18N.MY_BETS.ACCA_INSURANCE_APPLIED", icon: ValueIconName.ACCA_INSURANCE },
            ]);
          });
        });
      });

      describe("when the bets are settled", () => {
        describe("when no legs have been set as LOST", () => {
          beforeEach(() => {
            getSportsbookBetByURN.mockReturnValueOnce({
              ...ALL_LEGS_WON_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
              isSettled: true,
            });

            getSportsbookBetLegsByURN.mockReturnValueOnce(
              ALL_LEGS_WON_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
            );
          });

          it("should return a proper betSegmentInfos", () => {
            const { betSegmentInfos } = setup(ALL_LEGS_WON_MULTIPLE_BET_STATE, {
              urn: "ppb:tbd:card:sbkBet:923378353",
            });

            expect(betSegmentInfos).toEqual([
              { label: "I18N.MY_BETS.ACCA_INSURANCE_APPLIED", icon: ValueIconName.ACCA_INSURANCE },
            ]);
          });
        });

        describe("when one leg has been set as LOST", () => {
          beforeEach(() => {
            getSportsbookBetByURN.mockReturnValueOnce({
              ...ONE_LOST_LEG_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
              isSettled: true,
            });

            getSportsbookBetLegsByURN.mockReturnValueOnce(
              ONE_LOST_LEG_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
            );
          });

          it("should return a proper betSegmentInfos", () => {
            const { betSegmentInfos } = setup(ONE_LOST_LEG_MULTIPLE_BET_STATE, {
              urn: "ppb:tbd:card:sbkBet:923378353",
            });

            expect(betSegmentInfos).toEqual([
              { label: "I18N.MY_BETS.ACCA_INSURANCE_STAKE_BACK", icon: ValueIconName.ACCA_INSURANCE },
            ]);
          });
        });

        describe("when more than one leg has been set as LOST", () => {
          beforeEach(() => {
            getSportsbookBetByURN.mockReturnValueOnce({
              ...SEVERAL_LEGS_LOST_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
              edges: [{ reason: BetEdgeEnum.ACCA_INSURANCE }],
              result: "WON",
              isSettled: true,
            });

            getSportsbookBetLegsByURN.mockReturnValueOnce(
              SEVERAL_LEGS_LOST_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
            );
          });

          it("should return a proper betSegmentInfos", () => {
            const { betSegmentInfos } = setup(SEVERAL_LEGS_LOST_MULTIPLE_BET_STATE, {
              urn: "ppb:tbd:card:sbkBet:923378353",
            });

            expect(betSegmentInfos).toEqual([
              { label: "I18N.MY_BETS.ACCA_INSURANCE", icon: ValueIconName.ACCA_INSURANCE },
            ]);
          });
        });
      });
    });

    describe("when getSportsBookBetByURN returns a multiple bet with oddsBoost", () => {
      beforeEach(() => {
        getSportsbookBetByURN.mockReturnValueOnce({
          ...DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
          isOddsBoosted: true,
          originalPotentialWin: 23,
        });

        getSportsbookBetLegsByURN.mockReturnValueOnce(
          DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );

        const mockFunction = (odd) => `${odd.decimal}_FORMATTED`;
        formatOddsByPriceType.mockImplementationOnce(mockFunction).mockImplementationOnce(mockFunction);
      });

      it("should return isPMB false from the bet", () => {
        getUserDetails.mockReturnValueOnce({ localeCode: "en", jurisdiction: { jurisdiction: "INTERNATIONAL" } });
        const { isPBM } = setup(DEFAULT_MULTIPLE_BET_STATE, {
          urn: "ppb:tbd:card:sbkBet:923378353",
        });
        expect(isPBM).toEqual(false);
      });

      it("should return both original and current odds boost as undefined", () => {
        getUserDetails.mockReturnValueOnce({ localeCode: "en", jurisdiction: { jurisdiction: "INTERNATIONAL" } });
        const { betSegmentInfos } = setup(DEFAULT_MULTIPLE_BET_STATE, {
          urn: "ppb:tbd:card:sbkBet:923378353",
        });

        expect(formatOddsByPriceType).toHaveBeenCalledWith(
          { decimal: 2.3, fractional: { numerator: 9, denominator: 1 } },
          undefined,
          "DECIMAL",
          true,
        );
        expect(formatOddsByPriceType).toHaveBeenCalledWith(
          { decimal: 2, fractional: { numerator: 2, denominator: 1 } },
          undefined,
          "DECIMAL",
          true,
        );

        expect(betSegmentInfos[1].oddsValue).toEqual("2.3_FORMATTED");
        expect(betSegmentInfos[1].previousOddsValue).toEqual("2_FORMATTED");
      });

      it("should return betSegmentInfo with oddsBoosted", () => {
        const { betSegmentInfos } = setup(DEFAULT_MULTIPLE_BET_STATE, {
          urn: "ppb:tbd:card:sbkBet:923378353",
        });

        expect(betSegmentInfos[1]).toEqual({
          label: "I18N.BOOST_APPLIED",
          icon: "Value--Booster",
          oddsValue: "2.3_FORMATTED",
          previousOddsValue: "2_FORMATTED",
          infoLabelType: "generosity",
        });
      });
    });
    describe("when exteternal links is international and locale is EN", () => {
      it("rule 4 and dead heat InfoLabels directs to .com en url", () => {
        getUserDetails.mockReturnValueOnce({ localeCode: "en", jurisdiction: { jurisdiction: "INTERNATIONAL" } });
        const stateWithoutSbgLinks = {
          ...DEFAULT_MULTIPLE_BET_STATE_WITH_RULE_4_AND_DEAD_HEAT,
          entities: { preferences: {}, throttles: {} },
        };

        getSportsbookBetCardByURN.mockReturnValue(
          stateWithoutSbgLinks.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"],
        );
        getSportsbookBetByURN.mockReturnValue(stateWithoutSbgLinks.betting.sportsbookbets["ppb:sbkBet:923378353"]);
        getSportsbookBetLegsByURN.mockReturnValue(
          stateWithoutSbgLinks.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );
        const props = makeMapStateToProps()(stateWithoutSbgLinks, { urn: "ppb:tbd:card:sbkBet:923378353" });

        expect(props.betSegmentInfos).toEqual([
          {
            externalUrl: "https://support.skybet.com/s/article/Horse-Racing-Rule-4-Rules",
            icon: "System--external-link",
            iconPosition: "right",
            infoLabelType: "info",
            label: "I18N.MYBETS.RULE4_MULTIPLES",
          },
          {
            externalUrl: "https://support.skybet.com/s/article/Dead-Heat",
            icon: "System--external-link",
            iconPosition: "right",
            infoLabelType: "info",
            label: "I18N.MYBETS.DEAD_HEAT",
          },
        ]);
      });
    });

    describe("when exteternal links is international and locale is NO", () => {
      it("rule 4 and dead heat InfoLabels directs to internation NO url", () => {
        getUserDetails.mockReturnValueOnce({ localeCode: "no", jurisdiction: { jurisdiction: "INTERNATIONAL" } });
        const props = setup(DEFAULT_MULTIPLE_BET_STATE_WITH_RULE_4_AND_DEAD_HEAT, {
          urn: "ppb:tbd:card:sbkBet:923378353",
        });

        expect(props.betSegmentInfos).toEqual([
          {
            externalUrl: "https://support.betfair.com/no/app/answers/detail/a_id/11011",
            icon: "System--external-link",
            iconPosition: "right",
            infoLabelType: "info",
            label: "I18N.MYBETS.RULE4_MULTIPLES",
          },
          {
            externalUrl: "https://support.betfair.com/no/app/answers/detail/a_id/11016",
            icon: "System--external-link",
            iconPosition: "right",
            infoLabelType: "info",
            label: "I18N.MYBETS.DEAD_HEAT",
          },
        ]);
      });
    });
  });

  describe("when getSportsbookBetByURN returns a bet with several lines", () => {
    beforeEach(() => {
      getUserDetails.mockReturnValueOnce({
        localeCode: "pt",
        currencyCode: "€",
        localeCodeBcp47: "some localeCodeBcp47",
        jurisdiction: { jurisdiction: "INTERNATIONAL" },
      });
      getSportsbookBetCardByURN.mockReturnValueOnce(
        DEFAULT_MULTIPLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"],
      );
      getSportsbookBetByURN.mockReturnValueOnce({
        ...DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
        numLines: 3,
        currentSizePerLine: 1,
      });
      getSportsbookBetLegsByURN.mockReturnValueOnce(
        DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
      );
    });

    it("should return stake detail", () => {
      const { stakeDetail } = setup(DEFAULT_MULTIPLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

      expect(stakeDetail).toBe("(3 x RETURNS_VALUE)");
    });
  });

  describe("when getSportsbookBetByURN returns a bet with eligible mutations", () => {
    beforeEach(() => {
      getUserDetails.mockReturnValueOnce({ jurisdiction: { jurisdiction: "INTERNATIONAL" } });
      getSportsbookBetCardByURN.mockReturnValueOnce(
        DEFAULT_MULTIPLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"],
      );
      getSportsbookBetByURN.mockReturnValueOnce({
        ...DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
        mutations: {
          eligibility: ["AccaFreeze"],
        },
      });
      getSportsbookBetLegsByURN.mockReturnValueOnce(
        DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
      );
    });

    it("should return isMutationEligible as true", () => {
      const { isMutationEligible } = setup(DEFAULT_MULTIPLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

      expect(isMutationEligible).toBeTruthy();
    });
  });

  describe("when getting translations", () => {
    let mapStateToProps;

    beforeEach(() => {
      getSportsbookBetCardByURN.mockReturnValue(
        DEFAULT_SINGLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"],
      );
      getSportsbookBetByURN.mockReturnValue(DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"]);
      getSportsbookBetLegsByURN.mockReturnValue(
        DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
      );
      mapStateToProps = makeMapStateToProps();
    });

    describe("when locale code is the same", () => {
      beforeAll(() => {
        getUserDetails.mockReturnValueOnce({ localeCode: "pt" });
        getUserDetails.mockReturnValueOnce({ localeCode: "pt" });
      });

      it("should call i18n only once for each key", () => {
        mapStateToProps(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

        expect(i18n).toHaveBeenCalledTimes(9);

        mapStateToProps(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

        expect(i18n).toHaveBeenCalledTimes(9);
      });
    });

    describe("when locale code is not the same", () => {
      beforeEach(() => {
        getUserDetails.mockReturnValueOnce({ localeCode: "pt" });
        getUserDetails.mockReturnValueOnce({ localeCode: "en" });
      });

      it("should call i18n again for each key", () => {
        mapStateToProps(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

        expect(i18n).toHaveBeenCalledTimes(9);

        mapStateToProps(DEFAULT_SINGLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

        expect(i18n).toHaveBeenCalledTimes(18);
      });
    });
  });

  describe("when getMyBetsFiltersState returns a heritage view", () => {
    beforeAll(() => {
      getSportsbookBetCardByURN.mockReturnValue(
        DEFAULT_SINGLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"],
      );
      getSportsbookBetByURN.mockReturnValue(DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"]);
      getSportsbookBetLegsByURN.mockReturnValue(
        DEFAULT_SINGLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
      );

      getMyBetsFiltersState.mockReturnValue({ isHeritageView: true });
    });

    it("should not return statusLabel", () => {
      const { statusLabelText, statusLabelIcon, statusLabeType } = setup(DEFAULT_SINGLE_BET_STATE, {
        urn: "ppb:tbd:card:sbkBet:923378353",
      });

      expect(statusLabelText).toBeUndefined();
      expect(statusLabelIcon).toBeUndefined();
      expect(statusLabeType).toBeUndefined();
    });

    it("should return shouldSubscribe as false", () => {
      const { shouldSubscribe } = setup(DEFAULT_SINGLE_BET_STATE, {
        urn: "ppb:tbd:card:sbkBet:923378353",
      });

      expect(shouldSubscribe).toBe(false);
    });
  });

  describe("Alert generation based on bet state and conditions", () => {
    const setupMocks = (betOverrides = {}, betLegsOverrides = [], betStatusLabel = null, returnsValue = null) => {
      getSportsbookBetByURN.mockReturnValueOnce({
        ...ONE_LEG_ACCA_FROZEN_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
        ...betOverrides,
      });

      getSportsbookBetLegsByURN.mockReturnValueOnce(
        ONE_LEG_ACCA_FROZEN_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        ...betLegsOverrides,
      );

      if (betStatusLabel) {
        getBetStatusLabel.mockReturnValueOnce(betStatusLabel);
      }

      if (returnsValue) {
        currencyFormatWithDecimalPlaces.mockReturnValue(returnsValue);
      }
    };

    it("should return an INFO alert for ACCA freeze success when the bet is not settled", () => {
      setupMocks({ isSettled: false }, [], null, null);

      const { alert } = setup(ONE_LEG_ACCA_FROZEN_MULTIPLE_BET_STATE, {
        urn: "ppb:tbd:card:sbkBet:923378354",
      });

      expect(alert).toEqual({
        type: "INFO",
        message: i18n({ key: "I18N.MY_BETS.ACCA_FREEZE_SUCCESS" }),
        detail: "Cardiff 1-0 Swansea (34') @ undefined",
        iconOverload: "System--notification-success",
      });
    });

    it("should return a SUCCESS alert for a settled bet with a WON status", () => {
      setupMocks(
        { isSettled: true },
        [],
        {
          text: "I18N.MY_BETS.RESULT.WON",
          icon: OthersIconName.CASH,
          type: StatusLabelType.WON,
        },
        "RETURNS_VALUE",
      );

      const { alert } = setup(ONE_LEG_ACCA_FROZEN_MULTIPLE_BET_STATE, {
        urn: "ppb:tbd:card:sbkBet:923378354",
      });

      expect(alert).toEqual({
        type: "SUCCESS",
        message: i18n({ key: "I18N.WON_SETTLED_BET", interpolationValues: { winnings: "RETURNS_VALUE" } }),
      });
    });

    it("should return a SUCCESS alert for a settled bet with a PLACED status when profitAndLoss equals currentSize", () => {
      setupMocks(
        { isSettled: true, currentSize: 0.32, profitAndLoss: 0.32 },
        [],
        {
          text: "I18N.MY_BETS.RESULT.PLACED",
          icon: OthersIconName.CASH,
          type: StatusLabelType.WON,
        },
        "RETURNS_VALUE",
      );

      const { alert } = setup(ONE_LEG_ACCA_FROZEN_MULTIPLE_BET_STATE, {
        urn: "ppb:tbd:card:sbkBet:923378354",
      });

      expect(alert).toEqual({
        type: "SUCCESS",
        message: i18n({ key: "I18N.MY_BETS.PLACED_SETTLED_BET", interpolationValues: { winnings: "RETURNS_VALUE" } }),
        detail: i18n({ key: "I18N.MY_BETS.PLACED_BET_RETURN_DETAIL" }),
      });
    });

    it("should return a SUCCESS alert for a settled bet with a PLACED status when profitAndLoss is greater than currentSize", () => {
      setupMocks(
        { isSettled: true, currentSize: 0.32, profitAndLoss: 0.38 },
        [],
        {
          text: "I18N.MY_BETS.RESULT.PLACED",
          icon: OthersIconName.CASH,
          type: StatusLabelType.WON,
        },
        "RETURNS_VALUE",
      );

      const { alert } = setup(ONE_LEG_ACCA_FROZEN_MULTIPLE_BET_STATE, {
        urn: "ppb:tbd:card:sbkBet:923378354",
      });

      expect(alert).toEqual({
        type: "SUCCESS",
        message: i18n({ key: "I18N.WON_SETTLED_BET", interpolationValues: { winnings: "RETURNS_VALUE" } }),
      });
    });

    describe("when ghostLegToken payout is triggered in alert", () => {
      it("should return SUCCESS alert with payout amount when ghostLegToken.payout exists", () => {
        currencyFormatWithDecimalPlaces
          .mockReturnValueOnce("STAKE_VALUE")
          .mockReturnValueOnce("RETURNS_VALUE")
          .mockReturnValueOnce("GHOST_LEG_PAYOUT_VALUE");

        getSportsbookBetByURN.mockReturnValueOnce({
          ...DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
          isSettled: true,
          ghostLegToken: {
            tokenId: "TOKEN_123",
            repricedDecimalOdds: 3.5,
            payout: 75.5,
          },
        });

        const { alert } = setup(DEFAULT_MULTIPLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

        expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith(
          expect.objectContaining({ value: 75.5, decimalPlaces: 2 }),
        );

        expect(alert).toEqual({
          type: "SUCCESS",
          message: i18n({
            key: "I18N.GHOST_LEG_VALUE_WON",
            interpolationValues: { return: "GHOST_LEG_PAYOUT_VALUE" },
          }),
        });
      });

      it("should not return alert when ghostLegToken.payout is null or undefined", () => {
        getSportsbookBetByURN.mockReturnValueOnce({
          ...DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
          isSettled: true,
          ghostLegToken: {
            tokenId: "TOKEN_123",
            repricedDecimalOdds: 3.5,
            payout: null,
          },
        });

        const { alert } = setup(DEFAULT_MULTIPLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

        expect(alert).toBeUndefined();
      });
    });

    it("should return undefined when no alert conditions are met", () => {
      const { alert } = setup(NO_LEGS_ACCA_AVAILABLE_MULTIPLE_BET_STATE, {
        urn: "ppb:tbd:card:sbkBet:923378354",
      });

      expect(alert).toEqual(undefined);
    });
  });

  describe("when getSportsBookBetByURN returns a multiple bet with isAccaInsuranceReward", () => {
    beforeEach(() => {
      getSportsbookBetByURN.mockReturnValueOnce({
        ...DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
        isAccaInsuranceReward: true,
      });

      getSportsbookBetLegsByURN.mockReturnValueOnce(
        DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
      );
    });

    it("should return betSegmentInfo with moneyback", () => {
      const { betSegmentInfos } = setup(DEFAULT_MULTIPLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

      expect(betSegmentInfos[1]).toEqual({
        label: "I18N.MONEY_BACK_ACCA_APPLIED",
        icon: "Value--Money-Back",
        infoLabelType: "generosity",
      });
    });
  });

  describe("when getSportsBookBetByURN returns a multiple bet with isMoneyBackReward on", () => {
    beforeEach(() => {
      getSportsbookBetByURN.mockReturnValueOnce({
        ...DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
        isMoneyBackReward: true,
      });

      getSportsbookBetLegsByURN.mockReturnValueOnce(
        DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
      );
    });

    it("should return betSegmentInfo with moneyback", () => {
      const { betSegmentInfos } = setup(DEFAULT_MULTIPLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

      expect(betSegmentInfos[1]).toEqual({
        label: "I18N.MONEY_BACK_ACCA_APPLIED",
        icon: "Value--Money-Back",
        infoLabelType: "generosity",
      });
    });
  });

  describe("when getSportsbookBetByURN returns a bet with ghostLegToken", () => {
    const ghostLegTokenState = {
      urn: "ppb:sbkBet:923378353",
      betReceiptId: "O/10221904/0000164",
      betType: "DOUBLE",
      currentSize: 0.32,
      betId: 12345678,
      profitAndLoss: 1.91,
      numLines: 1,
      edges: [],
      result: "LOST",
      ghostLegToken: {
        tokenId: "TOKEN_123",
        repricedDecimalOdds: 3.5,
        payout: 50.25,
      },
    };

    describe("when ghostLegToken has payout and repricedDecimalOdds", () => {
      beforeEach(() => {
        getSportsbookBetByURN.mockReturnValueOnce({
          ...DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
          ...ghostLegTokenState,
          isSettled: true,
        });
      });

      it("should include ghostLeg in betSegmentInfos when ghostLegToken exists", () => {
        const { betSegmentInfos } = setup(DEFAULT_MULTIPLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

        const ghostLegSegment = betSegmentInfos.find((segment) => segment.label === "I18N.GHOST_LEG_APPLIED");

        expect(ghostLegSegment).toBeDefined();
        expect(ghostLegSegment).toEqual({
          label: "I18N.GHOST_LEG_APPLIED",
          icon: "Value--Ghost-Leg",
          infoLabelType: "generosity",
          oddsValue: undefined,
        });
      });

      it("should format ghostLegOdds correctly from repricedDecimalOdds", () => {
        formatOddsByPriceType.mockReturnValueOnce("3.5_FORMATTED");

        const { betSegmentInfos } = setup(DEFAULT_MULTIPLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

        const ghostLegSegment = betSegmentInfos.find((segment) => segment.label === "I18N.GHOST_LEG_APPLIED");

        expect(ghostLegSegment.oddsValue).toBe("3.5_FORMATTED");
      });
    });

    describe("when ghostLegToken has no repricedDecimalOdds", () => {
      beforeEach(() => {
        getSportsbookBetByURN.mockReturnValueOnce({
          ...DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"],
          ghostLegToken: {
            tokenId: "TOKEN_123",
            repricedDecimalOdds: null,
            payout: 50.25,
          },
        });
      });

      it("should not include oddsValue in ghostLeg segment when repricedDecimalOdds is null", () => {
        const { betSegmentInfos } = setup(DEFAULT_MULTIPLE_BET_STATE, { urn: "ppb:tbd:card:sbkBet:923378353" });

        const ghostLegSegment = betSegmentInfos.find((segment) => segment.label === "I18N.GHOST_LEG_APPLIED");

        expect(ghostLegSegment).toEqual({
          label: "I18N.GHOST_LEG_APPLIED",
          icon: "Value--Ghost-Leg",
          infoLabelType: "generosity",
          oddsValue: undefined,
        });
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  const {
    dispatchSubscribeCardUpdatesAction,
    dispatchUnsubscribeCardUpdatesAction,
    dispatchShareIconTap,
    dispatchSubscribeBlhResult,
    dispatchUnsubscribeBlhResult,
    dispatchHeritageInfoLabelClick,
    dispatchSubscribeBmeResult,
    dispatchUnsubscribeBmeResult,
    dispatchAccaFreezeOpenedAction,
    dispatchAccaFreezeClosedAction,
  } = mapDispatchToProps;

  describe.each([
    ["dispatchSubscribeCardUpdatesAction", dispatchSubscribeCardUpdatesAction, MY_BETS_SUBSCRIBE_CARD_UPDATES],
    ["dispatchUnsubscribeCardUpdatesAction", dispatchUnsubscribeCardUpdatesAction, MY_BETS_UNSUBSCRIBE_CARD_UPDATES],
    ["dispatchSubscribeBlhResult", dispatchSubscribeBlhResult, SUBSCRIBE_BET_RESULT],
    ["dispatchUnsubscribeBlhResult", dispatchUnsubscribeBlhResult, UNSUBSCRIBE_BET_RESULT],
    ["dispatchSubscribeBmeResult", dispatchSubscribeBmeResult, SUBSCRIBE_BET_MUTATION_ELIGIBILITY],
    ["dispatchUnsubscribeBmeResult", dispatchUnsubscribeBmeResult, UNSUBSCRIBE_BET_MUTATION_ELIGIBILITY],
  ])("%s", (_, actionFn, type) => {
    it(`should dispatch a ${actionFn.name} when it's called`, () => {
      expect(actionFn("mockSbkBetURN")).toEqual({
        type,
        payload: {
          urn: "mockSbkBetURN",
        },
      });
    });
  });

  describe("dispatchShareIconTap", () => {
    it("should dispatch an action of type UI__MY_BETS_BET_SHARING_PREVIEW_TAP", () => {
      expect(dispatchShareIconTap()).toEqual({
        type: UI__MY_BETS_BET_SHARING_PREVIEW_TAP,
      });
    });
  });

  describe("dispatchAccaFreezeOpenedAction", () => {
    it("should dispatch an action of type UI__MY_BETS_ACCA_FREEZE_OPENED", () => {
      expect(dispatchAccaFreezeOpenedAction()).toEqual({
        type: UI__MY_BETS_ACCA_FREEZE_OPENED,
      });
    });
  });

  describe("dispatchAccaFreezeClosedAction", () => {
    it("should dispatch an action of type UI__MY_BETS_ACCA_FREEZE_CLOSED", () => {
      expect(dispatchAccaFreezeClosedAction()).toEqual({
        type: UI__MY_BETS_ACCA_FREEZE_CLOSED,
      });
    });
  });

  describe("dispatchHeritageInfoLabelClick", () => {
    it("should dispatch an action of type UI__MY_BETS_HERITAGE_INFO_LABEL_CLICK", () => {
      expect(dispatchHeritageInfoLabelClick({ viewUrl: "mocker url" }, "mocked heritage label")).toEqual({
        type: UI__MY_BETS_HERITAGE_INFO_LABEL_CLICK,
        payload: {
          viewLink: { viewUrl: "mocker url" },
          label: "mocked heritage label",
        },
      });
    });
  });
});
