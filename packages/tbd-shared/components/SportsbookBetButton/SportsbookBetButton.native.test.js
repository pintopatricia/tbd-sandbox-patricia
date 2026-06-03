import { render } from "@testing-library/react-native";
import { SportsbookBetButton as SportsbookBetButtonComponent } from "@ppb/the-wall-native";
import SportsbookBetButton from "./SportsbookBetButton.native";
import SportsbookBetButtonPlaceholder from "./SportsbookBetButtonPlaceholder.native";

const dispatchBetPlacement = jest.fn();
const onPotentialBetChange = jest.fn();
const dispatchInactiveBetButtonClickAction = jest.fn();

jest.mock("@ppb/the-wall-native", () => ({
  SportsbookBetButton: jest.fn(() => <sportsbook-bet-button-mock />),
}));

jest.mock("@ppb/the-wall-common/types", () => ({
  BetButtonTheme: { DARK: "DARK" },
  BetButtonStatus: { Normal: "Normal", Selected: "Selected" },
}));

const PARENTS = ["ppb:tab:1", "ppb:cardgroup:1"];
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => PARENTS),
}));

jest.mock("./SportsbookBetButtonPlaceholder.native", () => ({
  __esModule: true,
  default: jest.fn(() => <sportsbook-bet-button-placeholder-mock />),
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
  dispatchBetPlacement,
  onPotentialBetChange,
  isBetslipCollapsed: true,
  struckThrough: true,
  toastMessageStatus: undefined,
  dispatchInactiveBetButtonClickAction,
  animated: false,
  accessibilityHints: {
    selected: "selected",
    default: "default",
  },
  accessibilityLabel: "label",
};

describe("Connected sportsbook bet button", () => {
  afterEach(jest.clearAllMocks);

  describe("when has all the props needed", () => {
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
          toastMessageStatus: undefined,
          animated: false,
          accessibilityHints: {
            selected: "selected",
            default: "default",
          },
          accessibilityLabel: "label",
        },
        undefined,
      );
      expect(SportsbookBetButtonComponent).toHaveBeenCalledTimes(1);
    });

    it("should render a sportsbook bet button placeholder when there is no label", () => {
      setup({ ...componentProps, label: undefined });

      expect(SportsbookBetButtonPlaceholder).toHaveBeenCalled();
      expect(SportsbookBetButtonComponent).not.toHaveBeenCalled();
    });

    it("should not render a sportsbook bet button placeholder when Status is closed", () => {
      setup({ ...componentProps, label: undefined, status: "closed" });

      expect(SportsbookBetButtonPlaceholder).not.toHaveBeenCalled();
      expect(SportsbookBetButtonComponent).toHaveBeenCalled();
    });

    it("should call SportsbookBetButtonComponent with selected Status when is true", () => {
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
          toastMessageStatus: undefined,
          animated: false,
          accessibilityHints: {
            selected: "selected",
            default: "default",
          },
          accessibilityLabel: "label",
        },
        undefined,
      );
      expect(SportsbookBetButtonComponent).toHaveBeenCalledTimes(1);
    });

    it("should call SportsbookBetButtonComponent without struckThrough when struckThrough is false", () => {
      setup({ ...componentProps, struckThrough: false });

      expect(SportsbookBetButtonComponent).toHaveBeenCalledWith(
        {
          onClick: expect.any(Function),
          label: "1.1",
          secondaryLabel: "1.2",
          handicapLabel: "handicap",
          status: "default",
          oddsboost: true,
          struckThrough: false,
          toastMessageStatus: undefined,
          animated: false,
          accessibilityHints: {
            selected: "selected",
            default: "default",
          },
          accessibilityLabel: "label",
        },
        undefined,
      );
      expect(SportsbookBetButtonComponent).toHaveBeenCalledTimes(1);
    });

    it("should call onPotentialBetChange when the button status changes to 'selected'", () => {
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
            { cardUrn: "fakeCardUrn", betOriginURL: "" },
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
  });

  describe("when has no label prop", () => {
    it("should render a sportsbook bet button placeholder when there is no label", () => {
      setup({ ...componentProps, label: undefined });

      expect(SportsbookBetButtonPlaceholder).toHaveBeenCalled();
      expect(SportsbookBetButtonComponent).not.toHaveBeenCalled();
    });

    it("should not render a sportsbook bet button placeholder when Status is closed", () => {
      setup({ ...componentProps, label: undefined, status: "closed" });

      expect(SportsbookBetButtonPlaceholder).not.toHaveBeenCalled();
      expect(SportsbookBetButtonComponent).toHaveBeenCalled();
    });
  });
});
