import "jest-dom/extend-expect";
import { render } from "@testing-library/react";

import { Styled } from "@ppb/the-wall-web";
import { QuickBetslipView } from "./QuickBetslipView.web";
import styles from "./QuickBetslipView.module.css";
import { Minimized } from "../Minimized/Minimized.web";

jest.mock("@ppb/the-wall-web", () => ({
  BetsSummary: jest.fn(() => null),
  CurrencyNumberInputField: jest.fn(() => null),
  Link: jest.fn(({ children }) => <span>{children}</span>),
  PrimaryButton: jest.fn(() => null),
  QuickStakes: jest.fn(() => null),
  Styled: jest.fn(({ translation }) => <span>{translation}</span>),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => null),
}));

jest.mock("../Minimized/Minimized.web", () => ({
  Minimized: jest.fn(({ children, counter }) => <span data-counter={counter}>{children}</span>),
}));

jest.mock("../../../Keyboard/FooterCustomKeyboard.web", () => ({
  FooterCustomKeyboard: jest.fn(() => null),
}));

jest.mock("../../../Notifier/Notifier.web", () => ({
  Notifier: jest.fn(() => null),
}));

jest.mock("../../../Notifier", () => jest.fn(() => null));

jest.mock("./useScrollHandler.web", () => ({
  useScrollHandler: jest.fn(),
}));

const defaultHeader = {
  counter: 1,
  title: "Some title",
  subtitle: "Some subtitle",
  moreLabel: null,
  isPriceBoostMultiple: false,
};

const defaultI18n = {
  termsLabel: "Terms",
  termsLinkLabel: "T&Cs",
  stakePlaceholder: "Stake",
  totalStakeLabel: "Total Stake",
  totalReturnsLabel: "Total Returns",
};

function renderQuickBetslipView(overrides = {}) {
  const props = {
    header: defaultHeader,
    i18n: defaultI18n,
    combinationId: "COMB:1",
    balanceAfterBet: "£990.00",
    placeButtonLabel: "Place £10.00 bet",
    totalReturns: "£25.50",
    currencySymbol: "£",
    stake: 10,
    isStakeValid: true,
    quickStakes: [{ stake: 5, displayStake: "+5" }],
    termsUrl: "https://example.com/terms",
    onClick: jest.fn(),
    dispatchStakeChange: jest.fn(),
    dispatchIncrementPress: jest.fn(),
    ...overrides,
  };

  return render(<QuickBetslipView {...props} />);
}

describe("QuickBetslipView", () => {
  beforeEach(jest.clearAllMocks);

  describe("header title", () => {
    it("should pass header.counter to Minimized component", () => {
      renderQuickBetslipView({
        header: { ...defaultHeader, counter: 3 },
      });

      expect(Minimized).toHaveBeenCalledWith(expect.objectContaining({ counter: 3 }), undefined);
    });

    it("should pass header.title to Styled component for title rendering", () => {
      renderQuickBetslipView({
        header: { ...defaultHeader, title: "My Betslip Title" },
      });

      expect(Styled).toHaveBeenCalledWith(expect.objectContaining({ translation: "My Betslip Title" }), undefined);
    });
  });

  describe("header subtitle", () => {
    it("should render header.subtitle via Styled component", () => {
      renderQuickBetslipView({
        header: { ...defaultHeader, subtitle: "Runner - Market" },
      });

      expect(Styled).toHaveBeenCalledWith(expect.objectContaining({ translation: "Runner - Market" }), undefined);
    });

    it("should not apply price boost multiple class when isPriceBoostMultiple is false", () => {
      const { container } = renderQuickBetslipView({
        header: { ...defaultHeader, isPriceBoostMultiple: false },
      });

      const subtitleInfo = container.querySelector(`.${styles.headerSubtitleInfo}`);

      expect(subtitleInfo).not.toHaveClass(styles.headerSubtitleInfoPriceBoostMultiple);
    });

    it("should apply price boost multiple class when isPriceBoostMultiple is true", () => {
      const { container } = renderQuickBetslipView({
        header: { ...defaultHeader, isPriceBoostMultiple: true },
      });

      const subtitleInfo = container.querySelector(`.${styles.headerSubtitleInfo}`);

      expect(subtitleInfo).toHaveClass(styles.headerSubtitleInfoPriceBoostMultiple);
    });
  });

  describe("moreLabel", () => {
    it("should not render moreLabel span when header.moreLabel is null", () => {
      const { container } = renderQuickBetslipView({
        header: { ...defaultHeader, moreLabel: null },
      });

      const moreLabel = container.querySelector(`.${styles.headerSubtitleMore}`);

      expect(moreLabel).toBeNull();
    });

    it("should render moreLabel span when header.moreLabel is provided", () => {
      const { container } = renderQuickBetslipView({
        header: { ...defaultHeader, moreLabel: "+2 more" },
      });

      const moreLabel = container.querySelector(`.${styles.headerSubtitleMore}`);

      expect(moreLabel).not.toBeNull();
      expect(moreLabel.textContent).toBe("+2 more");
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
        header: defaultHeader,
        i18n: defaultI18n,
        combinationId: "COMB:1",
        balanceAfterBet: "£990.00",
        placeButtonLabel: "Place £10.00 bet",
        totalReturns: "£25.50",
        currencySymbol: "£",
        isStakeValid: true,
        quickStakes: [{ stake: 5, displayStake: "+5" }],
        termsUrl: "https://example.com/terms",
        onClick: jest.fn(),
        dispatchStakeChange,
        dispatchIncrementPress: jest.fn(),
        stake: undefined,
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
