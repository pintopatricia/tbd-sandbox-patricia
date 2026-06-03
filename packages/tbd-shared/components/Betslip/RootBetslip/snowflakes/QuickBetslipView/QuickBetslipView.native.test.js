import { render } from "@testing-library/react-native";

import { Styled, Text } from "@ppb/the-wall-native";
import { QuickBetslipView } from "./QuickBetslipView.native";
import { Minimized } from "../Minimized/Minimized.native";

jest.mock("@ppb/the-wall-native", () => ({
  BetsSummary: jest.fn(() => null),
  CurrencyNumberInputField: jest.fn(() => null),
  PrimaryButton: jest.fn(() => null),
  QuickStakes: jest.fn(() => null),
  Styled: jest.fn(({ translation }) => translation),
  Text: jest.fn(({ children }) => children),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => null),
}));

jest.mock("../Minimized/Minimized.native", () => ({
  Minimized: jest.fn(({ children }) => children),
}));

jest.mock("../../../Keyboard/FooterCustomKeyboard.native", () => ({
  FooterCustomKeyboard: jest.fn(() => null),
}));

jest.mock("../../../JurisdictionalOperatorInfo/JurisdictionalOperatorInfo.native", () => ({
  JurisdictionalOperatorInfo: jest.fn(() => null),
}));

jest.mock("../../../Notifier/Notifier.native", () => ({
  Notifier: jest.fn(() => null),
}));

jest.mock("../../../Notifier", () => jest.fn(() => null));

jest.mock("./useScrollHandler.native", () => ({
  useScrollHandler: jest.fn(),
}));

jest.mock("@ppb/tbd-router/native", () => ({
  navigateDeposit: jest.fn(),
}));

const HEADER_MOCK = {
  counter: 1,
  title: "Some title",
  subtitle: "Some subtitle",
  moreLabel: null,
  isPriceBoostMultiple: false,
};

const i18nMock = {
  termsLabel: "Terms",
  termsLinkLabel: "T&Cs",
  stakePlaceholder: "Stake",
  totalStakeLabel: "Total Stake",
  totalReturnsLabel: "Total Returns",
};

function renderQuickBetslipView(overrides = {}) {
  const props = {
    header: HEADER_MOCK,
    i18n: i18nMock,
    combinationId: "COMB:1",
    balanceAfterBet: "£990.00",
    placeButtonLabel: "Place £10.00 bet",
    totalReturns: "£25.50",
    currencySymbol: "£",
    stake: 10,
    isStakeValid: true,
    quickStakes: [{ stake: 5, displayStake: "+5" }],
    onClick: jest.fn(),
    dispatchStakeChange: jest.fn(),
    dispatchIncrementPress: jest.fn(),
    ...overrides,
  };

  return render(<QuickBetslipView {...props} />);
}

describe("QuickBetslipView.native", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("header title", () => {
    it("should pass header.counter to Minimized component", () => {
      renderQuickBetslipView({
        header: { ...HEADER_MOCK, counter: 3 },
      });

      expect(Minimized).toHaveBeenCalledWith(expect.objectContaining({ counter: 3 }), undefined);
    });

    it("should pass header.title to Styled component for title rendering", () => {
      renderQuickBetslipView({
        header: { ...HEADER_MOCK, title: "Some title" },
      });

      expect(Styled).toHaveBeenCalledWith(expect.objectContaining({ translation: "Some title" }), undefined);
    });
  });

  describe("header subtitle", () => {
    it("should render header.subtitle via Styled component", () => {
      renderQuickBetslipView({
        header: { ...HEADER_MOCK, subtitle: "Some subtitle" },
      });

      expect(Styled).toHaveBeenCalledWith(expect.objectContaining({ translation: "Some subtitle" }), undefined);
    });

    it("should set numberOfLines to 1 when isPriceBoostMultiple is false", () => {
      renderQuickBetslipView({
        header: { ...HEADER_MOCK, isPriceBoostMultiple: false },
      });

      expect(Styled.mock.calls[1][0].numberOfLines).toBe(1);
    });

    it("should set numberOfLines to 3 when isPriceBoostMultiple is true", () => {
      renderQuickBetslipView({
        header: { ...HEADER_MOCK, isPriceBoostMultiple: true },
      });

      expect(Styled.mock.calls[1][0].numberOfLines).toBe(3);
    });
  });

  describe("moreLabel", () => {
    it("should not render moreLabel when header.moreLabel is null", () => {
      renderQuickBetslipView({
        header: { ...HEADER_MOCK, moreLabel: null },
      });

      expect(Text).not.toHaveBeenCalledWith(expect.objectContaining({ children: "+2 more" }), undefined);
    });

    it("should render moreLabel via Text when header.moreLabel is provided", () => {
      renderQuickBetslipView({
        header: { ...HEADER_MOCK, moreLabel: "+2 more" },
      });

      expect(Text).toHaveBeenCalledWith(expect.objectContaining({ children: "+2 more" }), undefined);
    });
  });

  describe("auto-populate stake from lastSuccessfulStake", () => {
    it("should dispatch stake change when stake is undefined, lastSuccessfulStake is set and isLastStakeValid is true", () => {
      const dispatchStakeChange = jest.fn();

      renderQuickBetslipView({
        stake: undefined,
        lastSuccessfulStake: 12.5,
        isLastStakeValid: true,
        dispatchStakeChange,
      });

      expect(dispatchStakeChange).toHaveBeenCalledWith({ id: "COMB:1", newValue: 12.5 });
    });

    it("should not dispatch stake change when isLastStakeValid is false", () => {
      const dispatchStakeChange = jest.fn();

      renderQuickBetslipView({
        stake: undefined,
        lastSuccessfulStake: 12.5,
        isLastStakeValid: false,
        dispatchStakeChange,
      });

      expect(dispatchStakeChange).not.toHaveBeenCalled();
    });

    it("should not dispatch stake change when stake is already defined", () => {
      const dispatchStakeChange = jest.fn();

      renderQuickBetslipView({
        stake: 10,
        lastSuccessfulStake: 12.5,
        isLastStakeValid: true,
        dispatchStakeChange,
      });

      expect(dispatchStakeChange).not.toHaveBeenCalled();
    });

    it("should not dispatch stake change when lastSuccessfulStake is undefined", () => {
      const dispatchStakeChange = jest.fn();

      renderQuickBetslipView({
        stake: undefined,
        lastSuccessfulStake: undefined,
        isLastStakeValid: true,
        dispatchStakeChange,
      });

      expect(dispatchStakeChange).not.toHaveBeenCalled();
    });

    it("should auto-populate only once across re-renders even when isLastStakeValid toggles", () => {
      const dispatchStakeChange = jest.fn();
      const baseProps = {
        header: HEADER_MOCK,
        i18n: i18nMock,
        combinationId: "COMB:1",
        balanceAfterBet: "£990.00",
        placeButtonLabel: "Place £10.00 bet",
        totalReturns: "£25.50",
        currencySymbol: "£",
        stake: undefined,
        isStakeValid: true,
        quickStakes: [{ stake: 5, displayStake: "+5" }],
        onClick: jest.fn(),
        dispatchStakeChange,
        dispatchIncrementPress: jest.fn(),
        lastSuccessfulStake: 7,
        isLastStakeValid: true,
      };

      const { rerender } = render(<QuickBetslipView {...baseProps} />);
      rerender(<QuickBetslipView {...baseProps} isLastStakeValid={false} />);
      rerender(<QuickBetslipView {...baseProps} isLastStakeValid={true} />);

      expect(dispatchStakeChange).toHaveBeenCalledTimes(1);
      expect(dispatchStakeChange).toHaveBeenCalledWith({ id: "COMB:1", newValue: 7 });
    });
  });
});
