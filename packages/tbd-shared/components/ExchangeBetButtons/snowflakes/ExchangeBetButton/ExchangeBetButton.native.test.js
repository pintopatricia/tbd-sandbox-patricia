import { render } from "@testing-library/react-native";
import { BetButton } from "../BetButton/BetButton.native";
import { ExchangeBetButton } from "./ExchangeBetButton.native";
import { BetButtonColor, BetButtonSize, BetButtonStatus, BetButtonType } from "../BetButton/BetButton.types";

jest.mock("../BetButton/BetButton.native", () => ({
  BetButton: jest.fn(() => <bet-button-mock></bet-button-mock>),
}));

const DEFAULT_PRICE = "price";
const DEFAULT_LIQUIDITY = "liquidity";

const fakeCallback = jest.fn();

function renderBetButton({
  price = DEFAULT_PRICE,
  status,
  disabled,
  onClick = fakeCallback,
  liquidity = DEFAULT_LIQUIDITY,
  side,
  isMarketDepthBase,
  size,
}) {
  return render(
    <ExchangeBetButton
      price={price}
      liquidity={liquidity}
      status={status}
      disabled={disabled}
      onClick={onClick}
      side={side}
      size={size}
      isMarketDepthBase={isMarketDepthBase}
    />,
  );
}

describe("ExchangeBetButton", () => {
  describe("When the button is rendered", () => {
    beforeEach(() => {
      renderBetButton({
        price: "label",
        liquidity: "secondarylabel",
        status: BetButtonStatus.Normal,
        disabled: false,
        onClick: fakeCallback,
        side: "Lay",
        isMarketDepthBase: true,
      });
    });

    it("should create a BetButton with the correct props", () => {
      expect(BetButton).toHaveBeenCalledWith(
        {
          primaryLabel: "label",
          secondaryLabel: "secondarylabel",
          status: BetButtonStatus.Normal,
          disabled: false,
          onClick: fakeCallback,
          bgColor: BetButtonColor.Pink,
          type: BetButtonType.Exc,
        },
        undefined,
      );
    });
  });

  const calledWith = {
    primaryLabel: DEFAULT_PRICE,
    secondaryLabel: DEFAULT_LIQUIDITY,
    status: BetButtonStatus.Normal,
    disabled: false,
    onClick: fakeCallback,
    type: BetButtonType.Exc,
  };

  describe("when size is Small", () => {
    describe("and exchange side is back", () => {
      describe("and is market depth base", () => {
        it("should be blue", () => {
          renderBetButton({
            side: "BACK",
            isMarketDepthBase: true,
            size: BetButtonSize.Small,
          });

          expect(BetButton).toHaveBeenCalledWith(
            {
              ...calledWith,
              bgColor: BetButtonColor.Blue,
            },
            undefined,
          );
        });
      });

      describe("and is not market depth base", () => {
        it("should be dark blue", () => {
          renderBetButton({
            side: "BACK",
            isMarketDepthBase: false,
            size: BetButtonSize.Small,
          });

          expect(BetButton).toHaveBeenCalledWith(
            {
              ...calledWith,
              bgColor: BetButtonColor.DarkBlue,
            },
            undefined,
          );
        });
      });
    });

    describe("and exchange side is lay", () => {
      describe("and is market depth base", () => {
        it("should be pink", () => {
          renderBetButton({
            side: "Lay",
            isMarketDepthBase: true,
            size: BetButtonSize.Small,
          });

          expect(BetButton).toHaveBeenCalledWith(
            {
              ...calledWith,
              bgColor: BetButtonColor.Pink,
            },
            undefined,
          );
        });
      });

      describe("and is not market depth base", () => {
        it("should be dark pink", () => {
          renderBetButton({
            side: "Lay",
            isMarketDepthBase: false,
            size: BetButtonSize.Small,
          });

          expect(BetButton).toHaveBeenCalledWith(
            {
              ...calledWith,
              bgColor: BetButtonColor.DarkPink,
            },
            undefined,
          );
        });
      });
    });
  });

  describe("when size is regular", () => {
    describe("and exchange side is back", () => {
      it("should be blue", () => {
        renderBetButton({
          side: "BACK",
          isMarketDepthBase: false,
          size: BetButtonSize.Regular,
        });

        expect(BetButton).toHaveBeenCalledWith(
          {
            ...calledWith,
            bgColor: BetButtonColor.Blue,
          },
          undefined,
        );
      });
    });

    describe("and exchange side is lay", () => {
      it("should be pink", () => {
        renderBetButton({
          side: "Lay",
          isMarketDepthBase: false,
          size: BetButtonSize.Regular,
        });

        expect(BetButton).toHaveBeenCalledWith(
          {
            ...calledWith,
            bgColor: BetButtonColor.Pink,
          },
          undefined,
        );
      });
    });
  });
});
