import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { SportsbookBetButton as SportsbookBetButtonComponent } from "@ppb/the-wall-web";
import { BetButtonTheme } from "@ppb/the-wall-common/types";
import SportsbookBetButton from "./SportsbookBetButton.web";
import SportsbookBetButtonPlaceholder from "./SportsbookBetButtonPlaceholder.web";

const dispatchBetPlacement = jest.fn();
const onPotentialBetChange = jest.fn();
const dispatchInactiveBetButtonClickAction = jest.fn();

jest.mock("@ppb/the-wall-web", () => ({
  SportsbookBetButton: jest.fn(() => <sportsbook-bet-button-mock />),
}));

jest.mock("./SportsbookBetButtonPlaceholder.web", () => ({
  __esModule: true,
  default: jest.fn(() => <sportsbook-bet-button-placeholder-mock />),
}));

jest.mock("@ppb/the-wall-common/types", () => ({
  BetButtonTheme: { DARK: "DARK" },
  BetButtonStatus: { Normal: "Normal", Selected: "Selected" },
}));

function setup(sportsbookBetButtonProps) {
  return render(<SportsbookBetButton {...sportsbookBetButtonProps} />);
}

const componentProps = {
  runnerUrn: "fakeRunnerUrn",
  cardUrn: "fakeCardUrn",
  label: "1.1",
  secondaryLabel: "1.2",
  handicapLabel: "handicap",
  status: "default",
  odds: {
    decimal: 1.1,
    fractional: { numerator: 1, denominator: 2 },
  },
  oddsboost: true,
  animated: false,
  dispatchBetPlacement,
  onPotentialBetChange,
  isBetslipCollapsed: true,
  struckThrough: true,
  theme: BetButtonTheme.DARK,
  toastMessageStatus: undefined,
  dispatchInactiveBetButtonClickAction,
};

describe("Connected sportsbook bet button", () => {
  afterEach(jest.clearAllMocks);

  describe("when no data is available", () => {
    it("should render a placeholder component", () => {
      setup({});

      expect(SportsbookBetButtonPlaceholder).toHaveBeenCalledWith({}, undefined);
    });

    describe("but status is closed", () => {
      it("should render the component", () => {
        setup({ ...componentProps, status: "closed" });

        expect(SportsbookBetButtonComponent).toHaveBeenCalledWith(
          {
            animated: false,
            handicapLabel: "handicap",
            onClick: expect.any(Function),
            label: "1.1",
            oddsboost: true,
            rounded: undefined,
            secondaryLabel: "1.2",
            status: "closed",
            struckThrough: true,
            tall: undefined,
          },
          undefined,
        );
      });
    });
  });

  describe("when data is available", () => {
    it("should render a sportsbook bet button component with the correct props", () => {
      setup(componentProps);

      expect(SportsbookBetButtonComponent).toHaveBeenCalledWith(
        {
          onClick: expect.any(Function),
          label: "1.1",
          secondaryLabel: "1.2",
          handicapLabel: "handicap",
          status: "default",
          oddsboost: true,
          struckThrough: true,
          animated: false,
        },
        undefined,
      );
      expect(SportsbookBetButtonComponent).toHaveBeenCalledTimes(1);
    });

    it("should call SportsbookBetButtonComponent with Selected Status when isSelected is true", () => {
      setup({ ...componentProps, status: "selected" });

      expect(SportsbookBetButtonComponent).toHaveBeenCalledWith(
        {
          onClick: expect.any(Function),
          label: "1.1",
          secondaryLabel: "1.2",
          handicapLabel: "handicap",
          status: "selected",
          oddsboost: true,
          struckThrough: true,
          animated: false,
        },
        undefined,
      );
      expect(SportsbookBetButtonComponent).toHaveBeenCalledTimes(1);
    });

    it("should call onPotentialBetChange when isSelected prop updates", () => {
      const { rerender } = setup(componentProps);

      expect(onPotentialBetChange).toHaveBeenCalledWith(false, true);

      rerender(<SportsbookBetButton {...{ ...componentProps, status: "selected" }} />);

      expect(onPotentialBetChange).toHaveBeenCalledWith(true, true);
    });

    describe("when click on SportsbookBetButtonComponent", () => {
      describe("and onPromoClickCallback is defined", () => {
        it("should call onPromoClickCallback", () => {
          const onPromoClickCallback = jest.fn();
          setup({ ...componentProps, onPromoClickCallback });
          SportsbookBetButtonComponent.mock.calls[0][0].onClick();
          expect(onPromoClickCallback).toHaveBeenCalled();
        });
      });

      describe("when toastMessageStatus is undefined", () => {
        it(`should call dispatchBetPlacement and not call dispatchInactiveBetButtonClickAction
         on the SportsbookBetButtonComponent onClick cb`, () => {
          setup(componentProps);

          SportsbookBetButtonComponent.mock.calls[0][0].onClick();

          expect(dispatchBetPlacement).toHaveBeenCalledWith(
            {
              urn: "fakeRunnerUrn",
              odds: {
                decimal: 1.1,
                fractional: { numerator: 1, denominator: 2 },
              },
            },
            { cardUrn: "fakeCardUrn", betOriginURL: "http://localhost/" },
          );

          expect(dispatchInactiveBetButtonClickAction).not.toHaveBeenCalled();
        });
      });

      describe("when toastMessageStatus is defined", () => {
        it(`should call dispatchInactiveBetButtonClickAction with toastMessageStatus and not call dispatchBetPlacement
        on the SportsbookBetButtonComponent onClick cb`, () => {
          setup({ ...componentProps, toastMessageStatus: "toastMessage" });

          SportsbookBetButtonComponent.mock.calls[0][0].onClick();

          expect(dispatchInactiveBetButtonClickAction).toHaveBeenCalledWith("toastMessage");
          expect(dispatchBetPlacement).not.toHaveBeenCalled();
        });
      });
    });

    describe("when struckThrough", () => {
      it("should call SportsbookBetButtonComponent with correct elements", () => {
        setup({ ...componentProps, struckThrough: false, secondaryLabel: "runnerName" });

        expect(SportsbookBetButtonComponent).toHaveBeenCalledWith(
          {
            onClick: expect.any(Function),
            label: "1.1",
            secondaryLabel: "runnerName",
            handicapLabel: "handicap",
            status: "default",
            oddsboost: true,
            struckThrough: false,
            animated: false,
          },
          undefined,
        );
        expect(SportsbookBetButtonComponent).toHaveBeenCalledTimes(1);
      });
    });

    describe("when not struckThrough", () => {
      it("should call SportsbookBetButtonComponent with correct elements", () => {
        setup({ ...componentProps, struckThrough: true, secondaryLabel: "runnerName" });

        expect(SportsbookBetButtonComponent).toHaveBeenCalledWith(
          {
            onClick: expect.any(Function),
            label: "1.1",
            secondaryLabel: "runnerName",
            handicapLabel: "handicap",
            status: "default",
            oddsboost: true,
            struckThrough: true,
            animated: false,
          },
          undefined,
        );
        expect(SportsbookBetButtonComponent).toHaveBeenCalledTimes(1);
      });
    });
  });
});
