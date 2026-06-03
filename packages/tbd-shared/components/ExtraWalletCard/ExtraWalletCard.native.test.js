import { render, act } from "@testing-library/react-native";
import { WalletTypes } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { Option, InfoLabel } from "@ppb/the-wall-native";
import { InfoLabelType } from "@ppb/the-wall-common/types";
import ExtraWalletCard from "./ExtraWalletCard.native";
import { Countdown } from "./snowflakes/Countdown/Countdown.native";

jest.mock("@ppb/the-wall-native", () => ({
  Option: jest.fn(({ children, ...props }) => <option-component {...props}>{children}</option-component>),
  InfoLabel: jest.fn(() => <info-label-component></info-label-component>),
}));

jest.mock("./snowflakes/Countdown/Countdown.native", () => ({
  Countdown: jest.fn(({ children, ...props }) => <countdown-component {...props}>{children}</countdown-component>),
}));

const onOptionWalletsUpdate = jest.fn(() => {});
const dispatchToggleWalletClick = jest.fn();

const optionWallets = {
  WALLET_1: {
    walletId: "WALLET_1",
    combinationId: "COMB_1",
    isSelected: true,
    isDisabled: false,
    amount: 10.5678,
    type: WalletTypes.BonusCash,
  },
  WALLET_2: {
    walletId: "WALLET_2",
    combinationId: "COMB_2",
    isSelected: true,
    isDisabled: true,
    type: WalletTypes.AccaInsuranceToken,
  },
  WALLET_3: {
    walletId: "WALLET_3",
    isSelected: false,
    isDisabled: false,
    type: WalletTypes.PriceBoostToken,
  },
  WALLET_4: {
    walletId: "WALLET_4",
    isSelected: false,
    isDisabled: false,
    type: WalletTypes.MoneyBackToken,
  },
  WALLET_5: {
    walletId: "WALLET_5",
    isSelected: false,
    isDisabled: false,
    type: WalletTypes.GhostLegToken,
    numberOfLegs: 1,
  },
};

const mockProps = {
  title: "5.00€ Free Bet",
  subtitle: "amazing subtitle, keep going",
  timeLeftText: "1 min",
  countdownType: "alert",
  optionId: "WALLET_1",
  optionWallets,
  onOptionWalletsUpdate,
  badges: [],
  dispatchToggleWalletClick,
};

describe("ExtraWalletCard", () => {
  beforeEach(jest.clearAllMocks);

  describe("When the wallet being drawn is not on the given optionWallets", () => {
    it("should render the option in readonly, unselected", () => {
      render(<ExtraWalletCard {...mockProps} optionId={"WALLET_UNKNOWN"} />);

      expect(Option).toHaveBeenCalledWith(
        {
          disabled: undefined,
          onPress: undefined,
          checkboxId: undefined,
          title: mockProps.title,
          subtitle: mockProps.subtitle,
          isReadOnly: true,
          isSelected: false,
          children: expect.any(Object),
        },
        undefined,
      );
    });
  });

  describe("When the wallet being drawn is in the given optionWallets and is disabled", () => {
    it("should render a disabled option as non readonly and selected state of the wallet", () => {
      render(<ExtraWalletCard {...mockProps} optionId={"WALLET_2"} />);

      expect(Option).toHaveBeenCalledWith(
        {
          disabled: true,
          title: mockProps.title,
          subtitle: mockProps.subtitle,
          isReadOnly: false,
          isSelected: true,
          onPress: undefined,
          checkboxId: undefined,
          children: expect.any(Object),
        },
        undefined,
      );
    });
  });

  describe("When the wallet being drawn is in the given optionWallets and is not disabled", () => {
    it("should render the option with the state of the wallet plus a onPress callback function", () => {
      render(<ExtraWalletCard {...mockProps} />);

      expect(Option).toHaveBeenCalledWith(
        {
          title: mockProps.title,
          subtitle: mockProps.subtitle,
          isReadOnly: false,
          isSelected: true,
          checkboxId: "WALLET_1",
          onPress: expect.any(Function),
          children: expect.any(Object),
          disabled: false,
        },
        undefined,
      );
    });

    it("should call onOptionWalletsUpdate and dispatchToggleWalletClick when onPress is triggered", () => {
      render(<ExtraWalletCard {...mockProps} badges={[{ label: "firstBadge", taggingLabel: "firstBadgeTagging" }]} />);

      const { onPress } = Option.mock.calls[0][0];

      act(() => {
        onPress();
      });

      expect(onOptionWalletsUpdate).toHaveBeenCalledWith("WALLET_1", false);
      expect(dispatchToggleWalletClick).toHaveBeenCalledWith(
        true,
        "free bets",
        undefined,
        "10.57",
        undefined,
        undefined,
        WalletTypes.BonusCash,
      );
    });

    it("should call dispatchToggleWalletClick for GhostLegToken even without totalAmountGenerosity", () => {
      render(<ExtraWalletCard {...mockProps} optionId={"WALLET_5"} />);

      const { onPress } = Option.mock.calls[0][0];

      act(() => {
        onPress();
      });

      expect(onOptionWalletsUpdate).toHaveBeenCalledWith("WALLET_5", true);
      expect(dispatchToggleWalletClick).toHaveBeenCalledWith(
        false,
        "ghost leg",
        1,
        undefined,
        undefined,
        undefined,
        WalletTypes.GhostLegToken,
      );
    });

    it("should call dispatchToggleWalletClick with formattedFixedOdds value when onPress is triggered and amount is not available", () => {
      render(<ExtraWalletCard {...mockProps} optionId="WALLET_3" formattedFixedOdds="7.5" />);

      const { onPress } = Option.mock.calls[0][0];
      act(() => onPress());

      expect(dispatchToggleWalletClick).toHaveBeenCalledWith(
        false,
        "boost",
        undefined,
        "7.5",
        undefined,
        undefined,
        WalletTypes.PriceBoostToken,
      );
    });
  });

  describe("When the countdownType is defined", () => {
    it("should render the Countdown", () => {
      render(<ExtraWalletCard {...mockProps} />);

      expect(Countdown).toHaveBeenCalledWith(
        {
          type: mockProps.countdownType,
          text: mockProps.timeLeftText,
        },
        undefined,
      );
    });
  });

  describe("When the countdownType is not defined", () => {
    it("should not render the Countdown", () => {
      render(<ExtraWalletCard {...mockProps} countdownType={undefined} />);

      expect(Countdown).not.toHaveBeenCalled();
    });
  });

  describe("When the badges array is filled", () => {
    it("should render the Countdown", () => {
      render(<ExtraWalletCard {...mockProps} badges={[{ label: "Badge 1" }, { label: "Badge 2" }]} />);

      expect(InfoLabel).toHaveBeenCalledTimes(2);
      expect(InfoLabel).toHaveBeenCalledWith(
        {
          infoLabelType: InfoLabelType.BRANDED,
          label: "Badge 1",
        },
        undefined,
      );

      expect(InfoLabel).toHaveBeenCalledWith(
        {
          infoLabelType: InfoLabelType.BRANDED,
          label: "Badge 2",
        },
        undefined,
      );
    });
  });
});
