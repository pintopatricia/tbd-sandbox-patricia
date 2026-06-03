import "jest-dom/extend-expect";
import { render, act } from "@testing-library/react";
import { ExchangeBetButton } from "./snowflakes/ExchangeBetButton/ExchangeBetButton.web";
import ExchangeBetButtons from "./ExchangeBetButtons.web";

jest.mock("./snowflakes/ExchangeBetButton/ExchangeBetButton.web", () => ({
  ExchangeBetButton: jest.fn(() => <exchange-bet-button-mock />),
}));

function setup(exchangeBetButtonsProps) {
  return render(<ExchangeBetButtons {...exchangeBetButtonsProps} />);
}

const cardURN = "ppb:tbd:card:1";
const marketId = "174822835";
const marketURN = "ppb:market:1.174822835";
const runnerURN = "ppb:excRunner:1.174822835/24/0";

const NBSP = String.fromCharCode(160);

const price1stItem = {
  disabled: false,
  isSelected: true,
  liquidity: `10${NBSP}€`,
  marketDepth: 0,
  price: 1,
  side: "BACK",
};

const dispatchBetPlacement = jest.fn();
const onBetButtonClick = jest.fn();

const containerProps = {
  cardURN,
  betBtnSize: "SMALL",
  displayBestOdds: false,
  marketId,
  marketURN,
  prices: [
    price1stItem,
    {
      disabled: false,
      isSelected: false,
      liquidity: `5${NBSP}€`,
      marketDepth: 1,
      price: 2,
      side: "LAY",
    },
  ],
  runnerURN,
  dispatchBetPlacement,
  onBetButtonClick,
};

describe("Exchange bet buttons", () => {
  afterEach(jest.clearAllMocks);

  describe("when prices are empty", () => {
    it("should not render any exchange bet button", () => {
      setup({ ...containerProps, prices: [] });
      expect(ExchangeBetButton).not.toHaveBeenCalled();
    });
  });

  describe("when prices are not empty", () => {
    it("should render the same number of exchange bet buttons as there are prices", () => {
      setup(containerProps);

      expect(ExchangeBetButton).toHaveBeenCalledTimes(containerProps.prices.length);
    });

    it("should pass expected props to each ExchangeBetButton", () => {
      setup(containerProps);

      expect(ExchangeBetButton).toHaveBeenNthCalledWith(
        1,
        {
          onClick: expect.any(Function),
          price: "1",
          liquidity: `10${NBSP}€`,
          side: "BACK",
          status: "Selected",
          disabled: false,
          size: "SMALL",
          isMarketDepthBase: false,
        },
        undefined,
      );
      expect(ExchangeBetButton).toHaveBeenNthCalledWith(
        2,
        {
          onClick: expect.any(Function),
          price: "2",
          liquidity: `5${NBSP}€`,
          side: "LAY",
          status: "Normal",
          disabled: false,
          size: "SMALL",
          isMarketDepthBase: false,
        },
        undefined,
      );
    });

    describe("when clicking a bet button", () => {
      jest.useFakeTimers();
      it("should call onBetButtonClick and dispatchBetPlacement", () => {
        setup(containerProps);

        act(() => {
          ExchangeBetButton.mock.calls[0][0].onClick();
          jest.runAllTimers();
        });

        expect(onBetButtonClick).toHaveBeenCalled();

        expect(dispatchBetPlacement).toHaveBeenCalledWith(
          {
            marketURN,
            urn: runnerURN,
            price: price1stItem.price,
            side: price1stItem.side,
            isSelected: price1stItem.isSelected,
            marketDepth: price1stItem.marketDepth,
          },
          { cardURN, betOriginURL: "http://localhost/", marketId },
        );
        expect(dispatchBetPlacement).toHaveBeenCalledTimes(1);
      });
    });

    describe("when isSelected updates to false", () => {
      it("should call onBetButtonClick with false", () => {
        const { rerender } = setup(containerProps);
        rerender(<ExchangeBetButtons {...{ ...containerProps, isSelected: false }} />);
        expect(onBetButtonClick).toHaveBeenCalledWith(false);
      });
    });
  });
});
