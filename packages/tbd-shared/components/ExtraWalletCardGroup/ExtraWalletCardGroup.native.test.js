import { render } from "@testing-library/react-native";
import { Option, Divider, Alert } from "@ppb/the-wall-native";
import { navigate } from "@ppb/tbd-router";
import ExtraWalletCardGroup from "./ExtraWalletCardGroup.native";
import ConnectedExtraWalletCard from "../ExtraWalletCard";
import ExtraWalletCard from "../ExtraWalletCard/ExtraWalletCard.native";

jest.mock("@ppb/the-wall-native", () => ({
  Alert: jest.fn(() => <alert-mock />),
  Option: jest.fn(() => <option-mock />),
  Divider: jest.fn(() => <divider-mock />),
}));

jest.mock("../ExtraWalletCard", () => jest.fn(() => <connected-card-mock />));

jest.mock("../ExtraWalletCard/ExtraWalletCard.native", () => jest.fn(() => <extra-wallet-native />));

jest.mock("@ppb/tbd-router", () => ({
  navigate: jest.fn(),
}));

const onOptionWalletsUpdate = () => {};
const optionWallets = {
  WALLET_1: {
    walletId: "WALLET_1",
    combinationId: "COMB_1",
    isSelected: true,
    isDisabled: false,
  },
  WALLET_2: {
    walletId: "WALLET_2",
    combinationId: "COMB_2",
    isSelected: true,
    isDisabled: true,
  },
  WALLET_3: {
    walletId: "WALLET_3",

    isSelected: false,
    isDisabled: false,
  },
};
const mockOptionTitle = "You have 25€ in Free Bets";
const mockOptionIcon = "Value--Bonus-Filled";
const i18nLabels = {
  helpMessage: "helpMessage",
  helpButtonLabel: "helpButtonLabel",
};

describe("ExtraWalletCardGroup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call the Option, Alert with the correct props and the Connected Cards listed in items", () => {
    render(
      <ExtraWalletCardGroup
        optionTitle={mockOptionTitle}
        optionIcon={mockOptionIcon}
        items={["ppb:tbd:card:extraWalletCard:1", "ppb:tbd:card:extraWalletCard:2"]}
        onOptionWalletsUpdate={onOptionWalletsUpdate}
        optionWallets={optionWallets}
        showAlert={true}
        i18nLabels={i18nLabels}
        helpUrl="mockHelpUrl"
        currentPebble="all"
      />,
    );

    expect(Option).toHaveBeenCalledWith(
      {
        icon: mockOptionIcon,
        iconSize: "small",
        title: mockOptionTitle,
        isSelected: false,
        isReadOnly: true,
      },
      undefined,
    );

    expect(Alert).toHaveBeenCalledWith(
      {
        type: "INFO",
        message: i18nLabels.helpMessage,
        dismissLabel: i18nLabels.helpButtonLabel,
        onClose: expect.any(Function),
      },
      undefined,
    );

    expect(ConnectedExtraWalletCard).toHaveBeenCalledTimes(2);

    expect(ConnectedExtraWalletCard).toHaveBeenNthCalledWith(
      1,
      {
        urn: "ppb:tbd:card:extraWalletCard:1",
        component: ExtraWalletCard,
        onOptionWalletsUpdate,
        optionWallets,
        currentPebble: "all",
      },
      undefined,
    );

    expect(ConnectedExtraWalletCard).toHaveBeenNthCalledWith(
      2,
      {
        urn: "ppb:tbd:card:extraWalletCard:2",
        component: ExtraWalletCard,
        onOptionWalletsUpdate,
        optionWallets,
        currentPebble: "all",
      },
      undefined,
    );

    expect(Divider).toHaveBeenCalledTimes(1);
  });

  it("should dispatch the right functions when user clicks on alert", () => {
    const mockDispatchHelpNavigationAction = jest.fn();
    const mockHelpUrl = "mockHelpUrl";

    render(
      <ExtraWalletCardGroup
        optionTitle={mockOptionTitle}
        optionIcon={mockOptionIcon}
        items={["ppb:tbd:card:extraWalletCard:1", "ppb:tbd:card:extraWalletCard:2"]}
        onOptionWalletsUpdate={onOptionWalletsUpdate}
        optionWallets={optionWallets}
        showAlert={true}
        i18nLabels={i18nLabels}
        helpUrl={mockHelpUrl}
        dispatchHelpNavigationAction={mockDispatchHelpNavigationAction}
        currentPebble="all"
        isFromBetslip={false}
      />,
    );
    const { onClose } = Alert.mock.calls[0][0];

    onClose();

    expect(mockDispatchHelpNavigationAction).toHaveBeenCalledWith(mockHelpUrl, "all", false);
    expect(navigate).toHaveBeenCalledWith({
      viewDisplayMode: "BLANK_WEBVIEW",
      viewUrl: mockHelpUrl,
      viewUrn: "ppb:tbd:view:external",
    });
  });

  it("should not call the Connected Cards if items is an empty array", () => {
    render(
      <ExtraWalletCardGroup
        optionTitle={mockOptionTitle}
        optionIcon={mockOptionIcon}
        items={[]}
        onOptionWalletsUpdate={onOptionWalletsUpdate}
        optionWallets={optionWallets}
      />,
    );

    expect(ConnectedExtraWalletCard).not.toHaveBeenCalled();
    expect(Divider).not.toHaveBeenCalled();
  });

  it("should not render the Option if optionTitle doesn't exist", () => {
    render(
      <ExtraWalletCardGroup
        optionIcon={mockOptionIcon}
        items={[]}
        onOptionWalletsUpdate={onOptionWalletsUpdate}
        optionWallets={optionWallets}
      />,
    );

    expect(Option).not.toHaveBeenCalled();
  });

  it("should not render the Alert if showAlert is false", () => {
    render(
      <ExtraWalletCardGroup
        optionTitle={mockOptionTitle}
        optionIcon={mockOptionIcon}
        items={["ppb:tbd:card:extraWalletCard:1", "ppb:tbd:card:extraWalletCard:2"]}
        onOptionWalletsUpdate={onOptionWalletsUpdate}
        optionWallets={optionWallets}
        i18nLabels={i18nLabels}
        showAlert={false}
        helpUrl="mockHelpUrl"
      />,
    );

    expect(Alert).not.toHaveBeenCalled();
  });

  it("should not render the Alert if helpUrl doesn't exist", () => {
    render(
      <ExtraWalletCardGroup
        optionTitle={mockOptionTitle}
        optionIcon={mockOptionIcon}
        items={["ppb:tbd:card:extraWalletCard:1", "ppb:tbd:card:extraWalletCard:2"]}
        onOptionWalletsUpdate={onOptionWalletsUpdate}
        optionWallets={optionWallets}
        i18nLabels={i18nLabels}
        showAlert={true}
        helpUrl={undefined}
      />,
    );

    expect(Alert).not.toHaveBeenCalled();
  });
});
