import { render, screen } from "@testing-library/react";
import "jest-dom/extend-expect";
import { BetButton } from "../BetButton/BetButton.web";
import { BetButtonSize } from "../BetButton/BetButton.types";
import { ExchangeBetButton } from "./ExchangeBetButton.web";
import styles from "./ExchangeBetButton.web.css";

jest.mock("../BetButton/BetButton.web", () => ({
  BetButton: jest.fn((props) => <bet-button-mock {...props} data-testid="bet-button-mock" />),
}));

function renderExchangeBetButton({
  price = "1.3",
  liquidity = "1000€",
  side,
  status,
  onClick = () => {},
  disabled = false,
  size = BetButtonSize.Regular,
  isMarketDepthBase = false,
}) {
  return render(
    <ExchangeBetButton
      price={price}
      liquidity={liquidity}
      side={side}
      status={status}
      onClick={onClick}
      disabled={disabled}
      size={size}
      isMarketDepthBase={isMarketDepthBase}
    />,
  );
}

jest.useFakeTimers();

describe("ExchangeBetButton", () => {
  const fakeCallback = jest.fn();

  beforeEach(jest.clearAllMocks);

  it("should call BetButton with the right parameters", () => {
    renderExchangeBetButton({
      side: "BACK",
      onClick: fakeCallback,
    });
    expect(BetButton).toHaveBeenCalledWith(
      {
        ref: expect.any(Object),
        primaryLabel: "1.3",
        secondaryLabel: "1000€",
        status: "Normal",
        disabled: false,
        bgColor: "BLUE",
        onClick: expect.any(Function),
        type: "exc",
      },
      undefined,
    );
  });

  describe("when size is small", () => {
    describe("and side is back", () => {
      describe("and isMarketDepthBase is true", () => {
        it("should call BetButton with the right background color", () => {
          renderExchangeBetButton({
            size: BetButtonSize.Small,
            side: "BACK",
            isMarketDepthBase: true,
          });
          expect(BetButton).toHaveBeenCalledWith(
            {
              ref: expect.any(Object),
              primaryLabel: "1.3",
              secondaryLabel: "1000€",
              status: "Normal",
              disabled: false,
              bgColor: "BLUE",
              onClick: expect.any(Function),
              type: "exc",
            },
            undefined,
          );
        });
      });

      describe("and isMarketDepthBase is false", () => {
        it("should call BetButton with the right background color", () => {
          renderExchangeBetButton({
            size: BetButtonSize.Small,
            side: "BACK",
            isMarketDepthBase: false,
          });
          expect(BetButton).toHaveBeenCalledWith(
            {
              ref: expect.any(Object),
              primaryLabel: "1.3",
              secondaryLabel: "1000€",
              status: "Normal",
              disabled: false,
              bgColor: "DARK_BLUE",
              onClick: expect.any(Function),
              type: "exc",
            },
            undefined,
          );
        });
      });
    });

    describe("and side is not back", () => {
      describe("and isMarketDepthBase is true", () => {
        it("should call BetButton with the right background color", () => {
          renderExchangeBetButton({
            size: BetButtonSize.Small,
            side: "whatever",
            isMarketDepthBase: true,
          });
          expect(BetButton).toHaveBeenCalledWith(
            {
              ref: expect.any(Object),
              primaryLabel: "1.3",
              secondaryLabel: "1000€",
              status: "Normal",
              disabled: false,
              bgColor: "PINK",
              onClick: expect.any(Function),
              type: "exc",
            },
            undefined,
          );
        });
      });

      describe("and isMarketDepthBase is false", () => {
        it("should call BetButton with the right background color", () => {
          renderExchangeBetButton({
            size: BetButtonSize.Small,
            side: "whatever",
            isMarketDepthBase: false,
          });
          expect(BetButton).toHaveBeenCalledWith(
            {
              ref: expect.any(Object),
              primaryLabel: "1.3",
              secondaryLabel: "1000€",
              status: "Normal",
              disabled: false,
              bgColor: "DARK_PINK",
              onClick: expect.any(Function),
              type: "exc",
            },
            undefined,
          );
        });
      });
    });
  });

  describe("when size is not small", () => {
    describe("and isMarketDepthBase is true", () => {
      it("should call BetButton with the right background color", () => {
        renderExchangeBetButton({
          size: BetButtonSize.Regular,
          side: "BACK",
          isMarketDepthBase: true,
        });
        expect(BetButton).toHaveBeenCalledWith(
          {
            ref: expect.any(Object),
            primaryLabel: "1.3",
            secondaryLabel: "1000€",
            status: "Normal",
            disabled: false,
            bgColor: "BLUE",
            onClick: expect.any(Function),
            type: "exc",
          },
          undefined,
        );
      });
    });

    describe("and isMarketDepthBase is false", () => {
      it("should call BetButton with the right background color", () => {
        renderExchangeBetButton({
          size: BetButtonSize.Regular,
          side: "whatever",
          isMarketDepthBase: false,
        });
        expect(BetButton).toHaveBeenCalledWith(
          {
            ref: expect.any(Object),
            primaryLabel: "1.3",
            secondaryLabel: "1000€",
            status: "Normal",
            disabled: false,
            bgColor: "PINK",
            onClick: expect.any(Function),
            type: "exc",
          },
          undefined,
        );
      });
    });
  });

  describe("when a rerender is triggered due to prop changes", () => {
    describe("and side is back", () => {
      it("should have the flash blue animation class", () => {
        const { rerender } = renderExchangeBetButton({ side: "BACK" });
        const newPrice = "1.2";
        rerender(<ExchangeBetButton price={newPrice} side="BACK" />);

        const betButton = screen.getByTestId("bet-button-mock");
        expect(betButton).toHaveClass(styles.flashBlueAnimation);
      });
    });

    describe("and side is not back", () => {
      it("should have the flash pink animation class", () => {
        const { rerender } = renderExchangeBetButton({ side: "LAY" });
        const newPrice = "1.2";
        rerender(<ExchangeBetButton price={newPrice} side="LAY" />);

        const betButton = screen.getByTestId("bet-button-mock");
        expect(betButton).toHaveClass(styles.flashPinkAnimation);
      });
    });
  });
});
