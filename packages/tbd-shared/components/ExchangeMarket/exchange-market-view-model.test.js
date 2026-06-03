import { calc } from "@ppb/bet-engine";
import { getMarketRunnersByDisplayRunners } from "@ppb/tbd-store/helpers/markets";
import {
  createBookPercentageForExchangeMarketVm,
  createRunnersForExchangeMarketVm,
} from "./exchange-market-view-model";

jest.mock("@ppb/tbd-store/helpers/markets", () => ({
  shouldShowMarketDepth: jest.fn(),
  getRaceRunnerDetails: jest.fn(),
  getMarketRunnersByDisplayRunners: jest.fn(),
}));

jest.mock("@ppb/bet-engine", () => ({
  calc: {
    totalBookPercentage: jest.fn(() => ({
      back: 0,
      lay: 0,
    })),
  },
}));

const MARKET_URN = "ppb:excMarket:1.170411944";
const RUNNER_NAME = "Sao Bento";
const RUNNER1_URN = "ppb:excRunner:1.170403029/5774350/0";
const RUNNER2_URN = "ppb:excRunner:1.170403029/5774350/2";
const HANDICAP = 0;
const SELECTION_ID = 12345;
const REDUCTION = 2.1;
const DATE = "13:30 Mar 13";
const STATUS = "ACTIVE";
const RUNNERS = [
  {
    urn: RUNNER1_URN,
    name: RUNNER_NAME,
    selectionId: SELECTION_ID,
    handicap: HANDICAP,
    reduction: REDUCTION,
    date: DATE,
    status: STATUS,
  },
  {
    urn: RUNNER2_URN,
    name: RUNNER_NAME,
    selectionId: SELECTION_ID,
    handicap: HANDICAP,
    reduction: REDUCTION,
    date: DATE,
    status: STATUS,
  },
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createRunnersForExchangeMarketVm", () => {
  beforeAll(() => {
    getMarketRunnersByDisplayRunners.mockReturnValue(RUNNERS.reverse());
  });

  let exchangeRunners;
  beforeEach(() => {
    const getRunnersForExchangeMarket = createRunnersForExchangeMarketVm();
    exchangeRunners = getRunnersForExchangeMarket({
      marketRunners: [RUNNERS, RUNNERS, RUNNERS, RUNNERS],
      exchangeMarket: undefined,
    });
  });

  it("should return only number of runners to display", () => {
    expect(exchangeRunners.length).toEqual(2);
  });
});

describe("createBookPercentageForExchangeMarketVm", () => {
  const defaultBookPercentage = {
    back: 0,
    lay: 0,
  };

  describe("when there are no runners", () => {
    let getRunnersBookPercentage;

    beforeEach(() => {
      getRunnersBookPercentage = createBookPercentageForExchangeMarketVm();
    });

    it("should call calc.totalBookPercentage with an empty object", () => {
      getRunnersBookPercentage([], MARKET_URN);
      expect(calc.totalBookPercentage).toHaveBeenCalledWith({});
    });

    it("should return the default values for book percentage", () => {
      expect(getRunnersBookPercentage([], MARKET_URN)).toStrictEqual(defaultBookPercentage);
    });
  });

  describe("when there are runners", () => {
    describe("and prices are undefined", () => {
      let runnersBookPercentage;

      beforeEach(() => {
        const exchangeRunners = RUNNERS;
        const getRunnersBookPercentage = createBookPercentageForExchangeMarketVm();
        runnersBookPercentage = getRunnersBookPercentage(exchangeRunners, RUNNER1_URN);
      });

      it("should call calc.totalBookPercentage with an empty object", () => {
        expect(calc.totalBookPercentage).toHaveBeenCalledWith({});
        expect(runnersBookPercentage).toStrictEqual(defaultBookPercentage);
      });
    });

    describe("prices are not positive", () => {
      let runnersBookPercentage;

      beforeEach(() => {
        const exchangeRunners = [
          {
            ...RUNNERS,
            back: [{ price: -1 }],
            lay: [{ price: -2 }],
          },
        ];

        const getRunnersBookPercentage = createBookPercentageForExchangeMarketVm();
        runnersBookPercentage = getRunnersBookPercentage(exchangeRunners, RUNNER1_URN);
      });

      it("should return bookPercentage with default values", () => {
        expect(calc.totalBookPercentage).toHaveBeenCalledWith({});
        expect(runnersBookPercentage).toStrictEqual(defaultBookPercentage);
      });
    });

    describe("and prices are positive", () => {
      let runnersBookPercentage;
      beforeEach(() => {
        const exchangeRunners = [
          {
            back: [{ price: 1.23 }],
            lay: [{ price: 2.34 }],
            ...RUNNERS[0],
          },
        ];

        const getRunnersBookPercentage = createBookPercentageForExchangeMarketVm();
        runnersBookPercentage = getRunnersBookPercentage(exchangeRunners);
      });

      it("should call calc.totalBookPercentage with correct values", () => {
        expect(calc.totalBookPercentage).toHaveBeenCalledWith({
          [SELECTION_ID]: { back: 1.23, lay: 2.34 },
        });
        expect(runnersBookPercentage).toStrictEqual(defaultBookPercentage);
      });
    });
  });
});
