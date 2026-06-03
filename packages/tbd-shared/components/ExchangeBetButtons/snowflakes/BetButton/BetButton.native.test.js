import { colors } from "@ppb/the-wall-common/base-theme";
import { fireEvent, render } from "@testing-library/react-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { BetButtonColor, BetButtonStatus, BetButtonType } from "./BetButton.types";
import { BetButton } from "./BetButton.native";
import {
  BET_BUTTON_PRIMARY_LABEL_TEST_ID,
  BET_BUTTON_SECONDARY_LABEL_TEST_ID,
  BET_BUTTON_SECONDARY_LABEL_HANDICAP_TEST_ID,
  BET_BUTTON_TEST_ID,
  BET_BUTTON_ICON_TEST_ID,
} from "./BetButton.native.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-native/hooks/useOptimistic", () => ({
  useOptimistic: jest.fn().mockImplementation((state, updater) => [state, (index) => updater(state, index)]),
}));

jest.mock("react-native-reanimated", () => {
  return {
    ...jest.requireActual("react-native-reanimated"),
    __esModule: true,
    createAnimatedComponent: () => jest.fn(() => <mock-creat-animated-component />),
    useAnimatedStyle: (cb) => cb(),
    interpolate: jest.fn,
    useAnimatedProps: (cb) => cb(),
    interpolateColor: jest.fn((...v) => v[2][2]),
    Easing: {
      ease: (t) => t,
    },
    withTiming: (toValue, _, cb) => {
      if (cb) cb(true);
      return toValue;
    },
    withDelay: (_, animationValue) => animationValue,
    withSequence: () => 0,
  };
});

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {
    "opacity-disabled": 0.37,
    ActionExchangeBackBackgroundDefault: "#395ACF",
    ActionExchangeBackBackgroundHit: "#13318A",
    ActionExchangeBackBackgroundFlash: "#0292FF",
    ActionSportsbookBackgroundDefault: "#007C8F",
    ActionSportsbookBackgroundHit: "#004752",
    ActionSportsbookBackgroundFlash: "#00D7F9",
    ActionExchangeLayBackgroundDefault: "#CF396F",
    ActionExchangeLayBackgroundHit: "#911739",
    ActionExchangeLayBackgroundFlash: "#FF018E",
    ActionBoostBackgroundDefault: "#343436",
    ActionBoostBackgroundHit: "#18181A",
    SignpostingGenerosityTextDefault: "#FFB80C",
    ActionExchangeBackTextDefault: "#FCFCFD",
    ActionExchangeLayTextDefault: "#FCFCFD",
    ActionSportsbookTextSecondary: "#FCFCFD",
  },
  typography: {},
  heights: {},
  spacings: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

jest.useFakeTimers({
  legacyFakeTimers: true,
});

function renderBetButton({
  primaryLabel = "1.3",
  secondaryLabel,
  handicapLabel,
  status,
  type,
  onClick,
  disabled,
  bgColor = BetButtonColor.Blue,
  isOddsboostMarketType = false,
  isSecondaryLabelStruckThrough = true,
  icon,
  noAnimation = false,
}) {
  return render(
    <BetButton
      primaryLabel={primaryLabel}
      secondaryLabel={secondaryLabel}
      handicapLabel={handicapLabel}
      status={status}
      disabled={disabled}
      onClick={onClick}
      bgColor={bgColor}
      type={type}
      isOddsboostMarketType={isOddsboostMarketType}
      isSecondaryLabelStruckThrough={isSecondaryLabelStruckThrough}
      icon={icon}
      noAnimation={noAnimation}
    />,
  );
}

function getButton(props) {
  const { getByTestId } = renderBetButton(props);
  return getByTestId(BET_BUTTON_TEST_ID);
}

function getPrimaryLabel(props) {
  const { getByTestId } = renderBetButton(props);
  return getByTestId(BET_BUTTON_PRIMARY_LABEL_TEST_ID);
}

function getSecondaryLabel(props) {
  const { queryByTestId } = renderBetButton(props);
  return queryByTestId(BET_BUTTON_SECONDARY_LABEL_TEST_ID);
}

function getSecondaryLabelHandicap(props) {
  const { queryByTestId } = renderBetButton(props);
  return queryByTestId(BET_BUTTON_SECONDARY_LABEL_HANDICAP_TEST_ID);
}

function getIcon(props) {
  const { queryByTestId } = renderBetButton(props);
  return queryByTestId(BET_BUTTON_ICON_TEST_ID);
}

describe("BetButton", () => {
  beforeAll(() => {
    jest.spyOn(global, "requestAnimationFrame").mockImplementation((cb) => cb());
  });

  describe("When the button is not disabled", () => {
    let button;
    const fakeCallback = jest.fn();

    beforeEach(() => {
      button = getButton({
        onClick: fakeCallback,
      });
    });

    it("shouldn't be disabled", () => {
      expect(button).not.toBeDisabled();
    });

    it("should have opacity 1", () => {
      expect(button).toHaveStyle({ opacity: 1 });
    });

    it("should call the callback function", () => {
      fireEvent.press(button);
      expect(fakeCallback).toHaveBeenCalled();
    });
  });

  describe("When button is disabled", () => {
    let button;

    beforeEach(() => {
      button = getButton({
        disabled: true,
      });
    });

    it("should be disabled", () => {
      expect(button).toBeDisabled();
    });

    it("should have opacity 0.37", () => {
      expect(button).toHaveStyle({ opacity: 0.37 });
    });
  });

  it("should draw the odd", () => {
    const oddLabel = getPrimaryLabel({ primaryLabel: "1.3" });
    expect(oddLabel).toHaveTextContent("1.3");
  });

  describe("When the secondaryLabel is provided", () => {
    let secondaryLabel;
    beforeEach(() => {
      secondaryLabel = getSecondaryLabel({
        secondaryLabel: "1000€",
        type: BetButtonType.Exc,
      });
    });

    it("should draw the secondaryLabel", () => {
      expect(secondaryLabel).not.toBeNull();
      expect(secondaryLabel).toHaveTextContent("1000€");
    });
  });

  describe("When the noAnimation props is true", () => {
    let button;
    beforeEach(() => {
      button = getButton({
        noAnimation: true,
        type: BetButtonType.Sbk,
        bgColor: BetButtonColor.Teal,
      });
    });

    it("should have the default background", () => {
      expect(button).toHaveStyle({ backgroundColor: colors.ActionSportsbookBackgroundDefault });
    });
  });

  describe("When the icon props are provided", () => {
    beforeEach(() => {
      getIcon({
        primaryLabel: "bananas",
        icon: {
          name: "some-icon-name",
          color: "some-color",
        },
      });
    });

    it("should draw icon", () => {
      expect(GenericIcon).toHaveBeenCalledWith({ name: "some-icon-name", color: "some-color" }, undefined);
    });
  });

  describe("When the secondaryLabel is provided and the type is SBK", () => {
    describe("and the handicap is not provided", () => {
      it("should not draw the handicap", () => {
        const secondaryLabelHandicap = getSecondaryLabelHandicap({
          type: BetButtonType.Sbk,
          secondaryLabel: "Secondary Label",
          handicapLabel: undefined,
        });

        expect(secondaryLabelHandicap).toBeNull();
      });
    });

    describe("and the handicap is provided", () => {
      it("should draw the handicap", () => {
        const secondaryLabelHandicap = getSecondaryLabelHandicap({
          type: BetButtonType.Sbk,
          secondaryLabel: "Secondary Label",
          handicapLabel: "handicap",
        });

        expect(secondaryLabelHandicap).not.toBeNull();
        expect(secondaryLabelHandicap).toHaveTextContent("handicap");
      });
    });
  });

  describe("When the secondary label is not provided", () => {
    let secondaryLabel;
    beforeEach(() => {
      secondaryLabel = getSecondaryLabel({});
    });

    it("should not draw the secondary", () => {
      expect(secondaryLabel).toBeNull();
    });
  });

  describe("When the button is Blue", () => {
    describe("and the button is normal", () => {
      let containerView;
      let primaryLabelContainer;
      let secondaryLabelContainer;

      beforeEach(() => {
        containerView = getButton({
          bgColor: BetButtonColor.Blue,
          status: BetButtonStatus.Normal,
        });

        primaryLabelContainer = getPrimaryLabel({
          secondaryLabel: "1.1",
          type: BetButtonType.Exc,
          bgColor: BetButtonColor.Blue,
          status: BetButtonStatus.Normal,
          isOddsboostMarketType: false,
        });

        secondaryLabelContainer = getSecondaryLabel({
          secondaryLabel: "1.1",
          type: BetButtonType.Exc,
          bgColor: BetButtonColor.Blue,
          status: BetButtonStatus.Normal,
        });
      });

      it("should have the background color equal to ActionExchangeBackBackgroundDefault", () => {
        expect(containerView).toHaveStyle({
          backgroundColor: colors.ActionExchangeBackBackgroundDefault,
        });
      });

      it("should have the font color equal to ActionExchangeBackTextDefault", () => {
        expect(primaryLabelContainer).toHaveStyle({
          color: colors.ActionExchangeBackTextDefault,
        });
      });

      it("should have the secondary label font color equal to ActionExchangeBackTextDefault", () => {
        expect(secondaryLabelContainer).toHaveStyle({
          color: colors.ActionExchangeBackTextDefault,
        });
      });
    });

    describe("and the button is selected", () => {
      let selectedContainerView;
      beforeEach(() => {
        selectedContainerView = getButton({
          bgColor: BetButtonColor.Blue,
          status: BetButtonStatus.Selected,
        });
      });

      it("should have the background colour equal to ActionExchangeBackBackgroundHit", () => {
        expect(selectedContainerView).toHaveStyle({
          backgroundColor: colors.ActionExchangeBackBackgroundHit,
        });
      });

      describe("and the button is disabled", () => {
        let disabledContainerView;

        beforeEach(() => {
          disabledContainerView = getButton({
            bgColor: BetButtonColor.Blue,
            status: BetButtonStatus.Selected,
            disabled: true,
          });
        });

        it("should have the background colour equal to ActionExchangeBackBackgroundDefault", () => {
          expect(disabledContainerView).toHaveStyle({
            backgroundColor: colors.ActionExchangeBackBackgroundDefault,
          });
        });
      });
    });
  });

  describe("When the button is pink", () => {
    describe("and the button is normal", () => {
      let containerView;
      let primaryLabelContainer;
      let secondaryLabelContainer;

      beforeEach(() => {
        containerView = getButton({
          bgColor: BetButtonColor.Pink,
          status: BetButtonStatus.Normal,
        });

        primaryLabelContainer = getPrimaryLabel({
          secondaryLabel: "1.1",
          type: BetButtonType.Exc,
          bgColor: BetButtonColor.Pink,
          status: BetButtonStatus.Normal,
          isOddsboostMarketType: false,
        });

        secondaryLabelContainer = getSecondaryLabel({
          secondaryLabel: "1.1",
          type: BetButtonType.Exc,
          bgColor: BetButtonColor.Pink,
          status: BetButtonStatus.Normal,
        });
      });

      it("should have the background colour equal to ActionExchangeLayBackgroundDefault", () => {
        expect(containerView).toHaveStyle({
          backgroundColor: colors.ActionExchangeLayBackgroundDefault,
        });
      });

      it("should have the font color equal to ActionExchangeLayTextDefault", () => {
        expect(primaryLabelContainer).toHaveStyle({
          color: colors.ActionExchangeLayTextDefault,
        });
      });

      it("should have the secondary label font color equal to ActionExchangeLayTextDefault", () => {
        expect(secondaryLabelContainer).toHaveStyle({
          color: colors.ActionExchangeLayTextDefault,
        });
      });
    });

    describe("and the button is selected", () => {
      let selectedContainerView;

      beforeEach(() => {
        selectedContainerView = getButton({
          bgColor: BetButtonColor.Pink,
          status: BetButtonStatus.Selected,
        });
      });

      it("should have the background colour equal to ActionExchangeLayBackgroundHit", () => {
        expect(selectedContainerView).toHaveStyle({
          backgroundColor: colors.ActionExchangeLayBackgroundHit,
        });
      });

      describe("and the button is disabled", () => {
        let disabledContainerView;

        beforeEach(() => {
          disabledContainerView = getButton({
            bgColor: BetButtonColor.Pink,
            status: BetButtonStatus.Selected,
            disabled: true,
          });
        });

        it("should have the background colour equal to ActionExchangeLayBackgroundDefault", () => {
          expect(disabledContainerView).toHaveStyle({
            backgroundColor: colors.ActionExchangeLayBackgroundDefault,
          });
        });
      });
    });
  });

  describe("When the button is teal", () => {
    describe("and the button is normal", () => {
      let containerView;
      let primaryLabelContainer;
      let secondaryLabelContainer;

      beforeEach(() => {
        containerView = getButton({
          bgColor: BetButtonColor.Teal,
          status: BetButtonStatus.Normal,
        });

        primaryLabelContainer = getPrimaryLabel({
          secondaryLabel: "1.1",
          type: BetButtonType.Sbk,
          bgColor: BetButtonColor.Teal,
          status: BetButtonStatus.Normal,
          isOddsboostMarketType: false,
        });

        secondaryLabelContainer = getSecondaryLabel({
          secondaryLabel: "1.1",
          type: BetButtonType.Sbk,
          bgColor: BetButtonColor.Teal,
          status: BetButtonStatus.Normal,
        });
      });

      it("should have the background colour equal to ActionSportsbookBackgroundDefault", () => {
        expect(containerView).toHaveStyle({
          backgroundColor: colors.ActionSportsbookBackgroundDefault,
        });
      });

      it("should have the font color equal to ActionSportsbookTextSecondary", () => {
        expect(primaryLabelContainer).toHaveStyle({
          color: colors.ActionSportsbookTextSecondary,
        });
      });

      it("should have the secondary label font color equal to ActionSportsbookTextSecondary", () => {
        expect(secondaryLabelContainer).toHaveStyle({
          color: colors.ActionSportsbookTextSecondary,
        });
      });
    });

    describe("and the button is selected", () => {
      let selectedContainerView;

      beforeEach(() => {
        selectedContainerView = getButton({
          bgColor: BetButtonColor.Teal,
          status: BetButtonStatus.Selected,
        });
      });

      it("should have the background colour equal to ActionSportsbookBackgroundHit", () => {
        expect(selectedContainerView).toHaveStyle({
          backgroundColor: colors.ActionSportsbookBackgroundHit,
        });
      });

      describe("and the button is disabled", () => {
        let disabledContainerView;

        beforeEach(() => {
          disabledContainerView = getButton({
            bgColor: BetButtonColor.Teal,
            status: BetButtonStatus.Selected,
            disabled: true,
          });
        });

        it("should have the background colour equal to ActionSportsbookBackgroundDefault", () => {
          expect(disabledContainerView).toHaveStyle({
            backgroundColor: colors.ActionSportsbookBackgroundDefault,
          });
        });
      });
    });
  });

  describe("When the button is grey", () => {
    describe("and the button is normal", () => {
      let buttonContainer;
      let primaryLabelContainer;
      let secondaryLabelContainer;

      beforeEach(() => {
        buttonContainer = getButton({
          secondaryLabel: "1.1",
          type: BetButtonType.Sbk,
          bgColor: BetButtonColor.Grey,
          status: BetButtonStatus.Normal,
        });

        primaryLabelContainer = getPrimaryLabel({
          secondaryLabel: "1.1",
          type: BetButtonType.Sbk,
          bgColor: BetButtonColor.Grey,
          status: BetButtonStatus.Normal,
          isOddsboostMarketType: true,
        });

        secondaryLabelContainer = getSecondaryLabel({
          secondaryLabel: "1.1",
          type: BetButtonType.Sbk,
          bgColor: BetButtonColor.Grey,
          status: BetButtonStatus.Normal,
        });
      });

      it("should have the background colour equal to ActionBoostBackgroundDefault", () => {
        expect(buttonContainer).toHaveStyle({
          backgroundColor: colors.ActionBoostBackgroundDefault,
        });
      });

      it("should have the font colour equal to SignpostingGenerosityTextDefault", () => {
        expect(primaryLabelContainer).toHaveStyle({
          color: colors.SignpostingGenerosityTextDefault,
        });
      });

      it("should have the secondary label strike through", () => {
        expect(secondaryLabelContainer).toHaveStyle({
          textDecorationLine: "line-through",
        });
      });
    });

    describe("and the button is normal without secondaryLabel", () => {
      let buttonContainer;
      let primaryLabelContainer;
      let secondaryLabelContainer;

      beforeEach(() => {
        buttonContainer = getButton({
          type: BetButtonType.Sbk,
          bgColor: BetButtonColor.Grey,
          status: BetButtonStatus.Normal,
        });

        primaryLabelContainer = getPrimaryLabel({
          type: BetButtonType.Sbk,
          bgColor: BetButtonColor.Grey,
          status: BetButtonStatus.Normal,
          isOddsboostMarketType: true,
        });

        secondaryLabelContainer = getSecondaryLabel({
          type: BetButtonType.Sbk,
          bgColor: BetButtonColor.Grey,
          status: BetButtonStatus.Normal,
        });
      });

      it("should not display secondary label", () => {
        expect(secondaryLabelContainer).toBeNull();
      });

      it("should have the background colour equal to ActionBoostBackgroundDefault", () => {
        expect(buttonContainer).toHaveStyle({
          backgroundColor: colors.ActionBoostBackgroundDefault,
        });
      });

      it("should have the font colour equal to SignpostingGenerosityTextDefault", () => {
        expect(primaryLabelContainer).toHaveStyle({
          color: colors.SignpostingGenerosityTextDefault,
        });
      });
    });

    describe("and the button is selected", () => {
      let selectedContainerView;

      beforeEach(() => {
        selectedContainerView = getButton({
          secondaryLabel: "1.1",
          type: BetButtonType.Sbk,
          bgColor: BetButtonColor.Grey,
          status: BetButtonStatus.Selected,
        });
      });

      it("should have the background colour equal to ActionBoostBackgroundHit", () => {
        expect(selectedContainerView).toHaveStyle({
          backgroundColor: colors.ActionBoostBackgroundHit,
        });
      });

      describe("and the button is disabled", () => {
        let disabledContainerView;

        beforeEach(() => {
          disabledContainerView = getButton({
            secondaryLabel: "1.1",
            type: BetButtonType.Sbk,
            bgColor: BetButtonColor.Grey,
            status: BetButtonStatus.Selected,
            disabled: true,
          });
        });

        it("should have the background colour equal to ActionBoostBackgroundDefault", () => {
          expect(disabledContainerView).toHaveStyle({
            backgroundColor: colors.ActionBoostBackgroundDefault,
          });
        });
      });
    });

    describe("and the button is price bet button for sportsbook", () => {
      let secondaryLabelContainer;

      beforeEach(() => {
        secondaryLabelContainer = getSecondaryLabel({
          secondaryLabel: "Futebol Clube do Porto",
          type: BetButtonType.Sbk,
          bgColor: BetButtonColor.Grey,
          status: BetButtonStatus.Normal,
          isOddsboostMarketType: true,
          isSecondaryLabelStruckThrough: false,
        });
      });

      it("should not add the lineThrough class to secondary label", () => {
        expect(secondaryLabelContainer).not.toHaveStyle({
          textDecorationLine: "line-through",
        });
      });

      it("should draw the label", () => {
        expect(secondaryLabelContainer).toHaveTextContent("Futebol Clube do Porto");
      });
    });
  });
});
