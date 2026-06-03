import { render, act } from "@testing-library/react-native";
import { WalletTypes } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { AlertType } from "@ppb/the-wall-common/types";
import { BottomSheet, PrimaryButton, PebbleList, ActionLink, Alert } from "@ppb/the-wall-native";
import { navigate } from "@ppb/tbd-router";
import GenerosityWallet from "./GenerosityWallet.native";
import ConnectedExtraWalletCardGroup from "../ExtraWalletCardGroup";
import ExtraWalletCardGroup from "../ExtraWalletCardGroup/ExtraWalletCardGroup.native";
import { updateOptionWallets, PebbleFilterOptions } from "../../helpers/generosity-wallets";

jest.mock("@ppb/the-wall-native", () => ({
  BottomSheet: jest.fn((props) => (
    <bottom-sheet {...props}>
      {props.headerContent}
      {props.children}
      {props.footerContent}
    </bottom-sheet>
  )),
  PrimaryButton: jest.fn(() => <primary-button-mock />),
  PebbleList: jest.fn(() => <pebble-list-mock />),
  Alert: jest.fn(() => <alert-mock />),
  ActionLink: jest.fn(() => <action-link-mock />),
}));

jest.mock("../ExtraWalletCardGroup", () => jest.fn(() => <connected-card-mock />));

jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn(({ value }) => `${value}.00€`),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues }) => `${key}${interpolationValues ? interpolationValues.bonus : ""}`),
}));

jest.mock("../../helpers/generosity-wallets", () => ({
  ...jest.requireActual("../../helpers/generosity-wallets"),
  sumWalletsAmounts: jest.fn((value1, value2) => value1 + value2),
  updateOptionWallets: jest.fn(() => ({ ola: "adeus" })),
}));

jest.mock("@ppb/tbd-router", () => ({
  navigate: jest.fn(),
}));

jest.mock("../ExtraWalletCardGroup/ExtraWalletCardGroup.native", () => jest.fn(() => <extra-wallet-native />));

const i18nLabels = {
  title: "title",
  defaultApplyButtonLabel: "defaultApplyButtonLabel",
  bonusPageMessage: "bonusPageMessage",
  alertMessage: "alertMessage",
  alertDetail: "alertDetail",
};

const optionWallets = {
  WALLET_1: {
    walletId: "WALLET_1",
    type: WalletTypes.BonusCash,
    combinationId: "COMB_1",
    amount: 25,
    isSelected: true,
    isDisabled: false,
  },
  WALLET_2: {
    walletId: "WALLET_2",
    type: WalletTypes.BonusCash,
    combinationId: "COMB_2",
    amount: 20,
    isSelected: true,
    isDisabled: true,
  },
  WALLET_3: {
    walletId: "WALLET_3",
    type: WalletTypes.BonusCash,
    isSelected: false,
    isDisabled: false,
  },
  WALLET_4: {
    walletId: "WALLET_4",
    type: WalletTypes.AccaInsuranceToken,
    isSelected: false,
    isDisabled: false,
  },
  WALLET_5: {
    walletId: "WALLET_5",
    type: WalletTypes.PriceBoostToken,
    isSelected: false,
    isDisabled: false,
  },
  WALLET_6: {
    walletId: "WALLET_6",
    type: WalletTypes.MoneyBackToken,
    isSelected: false,
    isDisabled: false,
  },
  WALLET_7: {
    walletId: "WALLET_7",
    type: WalletTypes.GhostLegToken,
    isSelected: false,
    isDisabled: false,
  },
};

const mockGenerosityFilterOptions = [
  {
    count: 4,
    id: "ALL",
    text: "I18N.OBB.FILTERTAGS.ALL",
  },
  {
    count: 1,
    id: "BONUS_CASH",
    text: "I18N.FREE_BETS",
  },
  {
    count: 2,
    id: "ACCA_INSURANCE_TOKEN",
    text: "I18N.MONEY_BACK_ACCA_TOKEN",
  },
  {
    count: 1,
    id: "PRICE_BOOST_TOKEN",
    text: "I18N.BET_BOOST_TOKEN",
  },
];

describe("GenerosityWallet", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the bottom sheet and the connected ExtraWalletCardGroup card with the right props", () => {
    render(
      <GenerosityWallet
        bonusPageUrl="bor"
        dispatchApplyButtonAction={jest.fn()}
        dispatchCloseBottomSheetAction={jest.fn()}
        dispatchPushExternalBlankAction={jest.fn()}
        generosityFilterOptions={mockGenerosityFilterOptions}
        i18nLabels={i18nLabels}
        optionWallets={optionWallets}
        userDetails={{ localeCode: "en-GB" }}
        shouldShowAlert={false}
      />,
    );

    expect(ConnectedExtraWalletCardGroup).toHaveBeenCalledWith(
      {
        component: ExtraWalletCardGroup,
        onOptionWalletsUpdate: expect.any(Function),
        optionWallets,
        itemsFilter: PebbleFilterOptions.All,
      },
      undefined,
    );

    expect(BottomSheet).toHaveBeenCalledWith(
      {
        onHeaderIconTap: expect.any(Function),
        title: i18nLabels.title,
        showOverlay: true,
        children: expect.any(Object),
        footerContent: expect.any(Object),
        headerContent: expect.any(Object),
        scrollViewRef: expect.any(Object),
      },
      undefined,
    );
  });

  describe("when there is no selected combination id and many generosity wallet types available", () => {
    it("should render only pebble list in bottom sheet header with right props", () => {
      render(
        <GenerosityWallet
          generosityFilterOptions={mockGenerosityFilterOptions}
          i18nLabels={i18nLabels}
          optionWallets={optionWallets}
          dispatchCloseBottomSheetAction={jest.fn()}
        />,
      );

      expect(PebbleList).toHaveBeenCalledWith(
        {
          items: mockGenerosityFilterOptions,
          defaultSelectedPebble: PebbleFilterOptions.All,
          onPebblePress: expect.any(Function),
        },
        undefined,
      );
    });

    const mockDispatchGenerosityWalletPebbleClick = jest.fn();
    const scrollToMock = jest.fn();

    it("should call mockDispatchGenerosityWalletPebbleClick when Pebble is clicked and calls scrollTo on scrollViewRef.current when defined", () => {
      render(
        <GenerosityWallet
          generosityFilterOptions={mockGenerosityFilterOptions}
          i18nLabels={i18nLabels}
          optionWallets={optionWallets}
          dispatchCloseBottomSheetAction={jest.fn()}
          dispatchGenerosityWalletPebbleClick={mockDispatchGenerosityWalletPebbleClick}
        />,
      );

      const bottomSheetProps = BottomSheet.mock.calls[0][0];
      const { scrollViewRef } = bottomSheetProps;
      scrollViewRef.current = { scrollTo: scrollToMock };

      const { onPebblePress } = PebbleList.mock.calls[0][0];

      act(() => {
        onPebblePress(PebbleFilterOptions.FreeBets);
      });

      expect(mockDispatchGenerosityWalletPebbleClick).toHaveBeenCalledWith(false, "all", "free bets");
      expect(scrollToMock).toHaveBeenCalledWith({ y: 0, animated: false });
    });
  });

  describe("when there is selectedCombinationId and default apply button label", () => {
    const mockDispatchCloseBottomSheetAction = jest.fn();
    const mockDispatchApplyButtonAction = jest.fn();
    const mockDispatchGenerosityWalletApplyButtonClick = jest.fn();

    describe("when the user opens the GenerosityWallet", () => {
      describe("and there are no selected wallets and shouldShowAlert is true", () => {
        it("should render a disabled primary button initially with the 'Apply' label and an Alert with the correct message", () => {
          render(
            <GenerosityWallet
              i18nLabels={i18nLabels}
              dispatchCloseBottomSheetAction={mockDispatchCloseBottomSheetAction}
              userDetails={{ localeCode: "en-GB" }}
              optionWallets={{
                ...optionWallets,
                WALLET_1: { ...optionWallets.WALLET_1, isSelected: false },
                WALLET_2: { ...optionWallets.WALLET_1, isSelected: false },
              }}
              selectedCombinationId="COMB_1"
              generosityFilterOptions={mockGenerosityFilterOptions}
              shouldShowAlert={true}
            />,
          );

          expect(BottomSheet).toHaveBeenCalledWith(
            {
              onHeaderIconTap: expect.any(Function),
              title: i18nLabels.title,
              showOverlay: true,
              children: expect.any(Object),
              footerContent: expect.any(Object),
              headerContent: expect.any(Object),
              scrollViewRef: expect.any(Object),
            },
            undefined,
          );
          expect(PrimaryButton).toHaveBeenCalledTimes(1);
          expect(PrimaryButton).toHaveBeenCalledWith(
            {
              label: i18nLabels.defaultApplyButtonLabel,
              disabled: true,
              onTap: expect.any(Function),
            },
            undefined,
          );
          expect(Alert).toHaveBeenCalledWith(
            {
              type: AlertType.Info,
              message: i18nLabels.alertMessage,
              detail: i18nLabels.alertDetail,
            },
            undefined,
          );
        });
      });

      describe("and there are selected wallets and shouldShowAlert is false", () => {
        it("should render a disabled primary button initially with the label that has the amount of free bets used", () => {
          render(
            <GenerosityWallet
              i18nLabels={i18nLabels}
              dispatchCloseBottomSheetAction={mockDispatchCloseBottomSheetAction}
              userDetails={{ localeCode: "en-GB" }}
              optionWallets={optionWallets}
              selectedCombinationId="COMB_1"
              generosityFilterOptions={mockGenerosityFilterOptions}
              shouldShowAlert={false}
            />,
          );

          expect(BottomSheet).toHaveBeenCalledWith(
            {
              onHeaderIconTap: expect.any(Function),
              title: i18nLabels.title,
              showOverlay: true,
              children: expect.any(Object),
              footerContent: expect.any(Object),
              headerContent: expect.any(Object),
              scrollViewRef: expect.any(Object),
            },
            undefined,
          );

          expect(PrimaryButton).toHaveBeenCalledTimes(1);
          expect(PrimaryButton).toHaveBeenCalledWith(
            {
              label: "I18N.LABEL.WALLET25.00€",
              disabled: true,
              onTap: expect.any(Function),
            },
            undefined,
          );
          expect(Alert).not.toHaveBeenCalled();
        });
      });
    });

    describe("when the user changes its selections on the GenerosityWallet", () => {
      beforeEach(() => {
        render(
          <GenerosityWallet
            i18nLabels={i18nLabels}
            dispatchCloseBottomSheetAction={mockDispatchCloseBottomSheetAction}
            userDetails={{ localeCode: "en-GB" }}
            optionWallets={optionWallets}
            selectedCombinationId="COMB_1"
            generosityFilterOptions={mockGenerosityFilterOptions}
          />,
        );
      });

      it("should render an enabled primary button with the label that has the amount of free bets used if there are wallets selected", () => {
        const { onOptionWalletsUpdate } = ConnectedExtraWalletCardGroup.mock.calls[0][0];

        updateOptionWallets.mockReturnValue({
          ...optionWallets,
          WALLET_1: { ...optionWallets.WALLET_1, isSelected: false, combinationId: "COMB_1" },
        });

        act(() => {
          onOptionWalletsUpdate("WALLET_1", false);
        });

        expect(BottomSheet).toHaveBeenCalledTimes(2);
        expect(BottomSheet).toHaveBeenNthCalledWith(
          2,
          {
            onHeaderIconTap: expect.any(Function),
            title: i18nLabels.title,
            showOverlay: true,
            children: expect.any(Object),
            footerContent: expect.any(Object),
            headerContent: expect.any(Object),
            scrollViewRef: expect.any(Object),
          },
          undefined,
        );

        expect(PrimaryButton).toHaveBeenCalledTimes(2);
        expect(PrimaryButton).toHaveBeenNthCalledWith(
          2,
          {
            label: i18nLabels.defaultApplyButtonLabel,
            disabled: false,
            onTap: expect.any(Function),
          },
          undefined,
        );
      });
      it("should render an enabled primary button with the default 'Apply' label if there are no wallets selected", () => {
        const { onOptionWalletsUpdate } = ConnectedExtraWalletCardGroup.mock.calls[0][0];

        updateOptionWallets.mockReturnValue({
          ...optionWallets,
          WALLET_1: { ...optionWallets.WALLET_1, isSelected: false, combinationId: "COMB_1" },
          WALLET_2: { ...optionWallets.WALLET_2, isSelected: false, combinationId: "COMB_1" },
        });

        act(() => {
          onOptionWalletsUpdate("WALLET_1", false);
          onOptionWalletsUpdate("WALLET_2", false);
        });

        expect(BottomSheet).toHaveBeenCalledTimes(2);
        expect(BottomSheet).toHaveBeenNthCalledWith(
          2,
          {
            onHeaderIconTap: expect.any(Function),
            title: i18nLabels.title,
            showOverlay: true,
            children: expect.any(Object),
            footerContent: expect.any(Object),
            headerContent: expect.any(Object),
            scrollViewRef: expect.any(Object),
          },
          undefined,
        );

        expect(PrimaryButton).toHaveBeenCalledTimes(2);
        expect(PrimaryButton).toHaveBeenNthCalledWith(
          2,
          {
            label: i18nLabels.defaultApplyButtonLabel,
            disabled: false,
            onTap: expect.any(Function),
          },
          undefined,
        );
      });

      it("should render an enabled primary button with the money back apply label when selecting an acca insurance type of token", () => {
        const { onOptionWalletsUpdate } = ConnectedExtraWalletCardGroup.mock.calls[0][0];

        updateOptionWallets.mockReturnValue({
          ...optionWallets,
          WALLET_1: { ...optionWallets.WALLET_1, isSelected: false, combinationId: undefined },
          WALLET_4: { ...optionWallets.WALLET_4, isSelected: true, combinationId: "COMB_1" },
        });

        act(() => {
          onOptionWalletsUpdate("WALLET_4", true);
        });

        expect(BottomSheet).toHaveBeenCalledTimes(2);
        expect(BottomSheet).toHaveBeenCalledWith(
          expect.objectContaining({
            onHeaderIconTap: expect.any(Function),
            title: i18nLabels.title,
            showOverlay: true,
            children: expect.any(Object),
            footerContent: expect.any(Object),
            scrollViewRef: expect.any(Object),
          }),
          undefined,
        );

        expect(PrimaryButton).toHaveBeenCalledTimes(2);
        expect(PrimaryButton).toHaveBeenNthCalledWith(
          2,
          {
            label: "I18N.APPLY_MONEY_BACK_ACCA",
            disabled: false,
            onTap: expect.any(Function),
          },
          undefined,
        );
      });

      it("should render an enabled primary button with the price boost apply label", () => {
        const { onOptionWalletsUpdate } = ConnectedExtraWalletCardGroup.mock.calls[0][0];

        updateOptionWallets.mockReturnValue({
          ...optionWallets,
          WALLET_1: { ...optionWallets.WALLET_1, isSelected: false, combinationId: undefined },
          WALLET_5: { ...optionWallets.WALLET_5, isSelected: true, combinationId: "COMB_1" },
        });

        act(() => {
          onOptionWalletsUpdate("WALLET_5", true);
        });

        expect(BottomSheet).toHaveBeenCalledTimes(2);
        expect(BottomSheet).toHaveBeenCalledWith(
          expect.objectContaining({
            onHeaderIconTap: expect.any(Function),
            title: i18nLabels.title,
            showOverlay: true,
            children: expect.any(Object),
            footerContent: expect.any(Object),
            scrollViewRef: expect.any(Object),
          }),
          undefined,
        );

        expect(PrimaryButton).toHaveBeenCalledTimes(2);
        expect(PrimaryButton).toHaveBeenNthCalledWith(
          2,
          {
            label: "I18N.APPLY_BET_BOOST",
            disabled: false,
            onTap: expect.any(Function),
          },
          undefined,
        );
      });

      it("should render an enabled primary button with the money back apply label when selecting a money back type of token", () => {
        const { onOptionWalletsUpdate } = ConnectedExtraWalletCardGroup.mock.calls[0][0];

        updateOptionWallets.mockReturnValue({
          ...optionWallets,
          WALLET_1: { ...optionWallets.WALLET_1, isSelected: false, combinationId: undefined },
          WALLET_6: { ...optionWallets.WALLET_6, isSelected: true, combinationId: "COMB_1" },
        });

        act(() => {
          onOptionWalletsUpdate("WALLET_6", true);
        });

        expect(BottomSheet).toHaveBeenCalledTimes(2);
        expect(BottomSheet).toHaveBeenCalledWith(
          expect.objectContaining({
            onHeaderIconTap: expect.any(Function),
            title: i18nLabels.title,
            children: expect.any(Object),
            footerContent: expect.any(Object),
          }),
          undefined,
        );

        expect(PrimaryButton).toHaveBeenCalledTimes(2);
        expect(PrimaryButton).toHaveBeenNthCalledWith(
          2,
          {
            label: "I18N.APPLY_MONEY_BACK_ACCA",
            disabled: false,
            onTap: expect.any(Function),
          },
          undefined,
        );
      });

      it("should render an enabled primary button with the ghost leg apply label when selecting a ghost leg type of token", () => {
        const { onOptionWalletsUpdate } = ConnectedExtraWalletCardGroup.mock.calls[0][0];

        updateOptionWallets.mockReturnValue({
          ...optionWallets,
          WALLET_1: { ...optionWallets.WALLET_1, isSelected: false, combinationId: undefined },
          WALLET_7: { ...optionWallets.WALLET_7, isSelected: true, combinationId: "COMB_1" },
        });

        act(() => {
          onOptionWalletsUpdate("WALLET_7", true);
        });

        expect(BottomSheet).toHaveBeenCalledTimes(2);
        expect(BottomSheet).toHaveBeenCalledWith(
          expect.objectContaining({
            onHeaderIconTap: expect.any(Function),
            title: i18nLabels.title,
            children: expect.any(Object),
            footerContent: expect.any(Object),
          }),
          undefined,
        );

        expect(PrimaryButton).toHaveBeenCalledTimes(2);
        expect(PrimaryButton).toHaveBeenNthCalledWith(
          2,
          {
            label: "I18N.APPLY_GHOST_LEG_BAB",
            disabled: false,
            onTap: expect.any(Function),
          },
          undefined,
        );
      });
    });

    describe("when apply button is enable", () => {
      it("should call dispatchApplyButtonAction and dispatchGenerosityWalletApplyButtonClick with the correct arguments and dispatchCloseBottomSheetAction when PrimaryButton is clicked to select", () => {
        render(
          <GenerosityWallet
            i18nLabels={i18nLabels}
            dispatchCloseBottomSheetAction={mockDispatchCloseBottomSheetAction}
            dispatchApplyButtonAction={mockDispatchApplyButtonAction}
            dispatchGenerosityWalletApplyButtonClick={mockDispatchGenerosityWalletApplyButtonClick}
            userDetails={{ localeCode: "en-GB" }}
            optionWallets={{
              ...optionWallets,
              WALLET_1: {
                ...optionWallets.WALLET_1,
                isSelected: false,
              },
            }}
            selectedCombinationId="COMB_1"
            generosityFilterOptions={mockGenerosityFilterOptions}
          />,
        );

        const { onOptionWalletsUpdate } = ConnectedExtraWalletCardGroup.mock.calls[0][0];

        updateOptionWallets.mockReturnValue({
          ...optionWallets,
          WALLET_1: { ...optionWallets.WALLET_1, isSelected: true, combinationId: "COMB_1" },
        });

        act(() => {
          onOptionWalletsUpdate("WALLET_1", true);
        });

        const { onTap } = PrimaryButton.mock.calls[1][0];

        onTap();

        expect(mockDispatchApplyButtonAction).toHaveBeenCalledWith(
          "COMB_1",
          ["WALLET_1"],
          WalletTypes.BonusCash,
          undefined,
          "25.00",
        );

        expect(mockDispatchGenerosityWalletApplyButtonClick).toHaveBeenCalledWith(
          "free bets",
          undefined,
          "25.00",
          "all",
          undefined,
          WalletTypes.BonusCash,
        );
      });

      it("should call dispatchApplyButtonAction and dispatchGenerosityWalletApplyButtonClick with the correct arguments and dispatchCloseBottomSheetAction when PrimaryButton is clicked to deselect", () => {
        render(
          <GenerosityWallet
            i18nLabels={i18nLabels}
            dispatchCloseBottomSheetAction={mockDispatchCloseBottomSheetAction}
            dispatchApplyButtonAction={mockDispatchApplyButtonAction}
            dispatchGenerosityWalletApplyButtonClick={mockDispatchGenerosityWalletApplyButtonClick}
            userDetails={{ localeCode: "en-GB" }}
            optionWallets={optionWallets}
            selectedCombinationId="COMB_1"
            generosityFilterOptions={mockGenerosityFilterOptions}
          />,
        );

        const { onOptionWalletsUpdate } = ConnectedExtraWalletCardGroup.mock.calls[0][0];

        updateOptionWallets.mockReturnValue({
          ...optionWallets,
          WALLET_1: { ...optionWallets.WALLET_1, isSelected: false, combinationId: undefined },
        });

        act(() => {
          onOptionWalletsUpdate("WALLET_1", false);
        });

        const { onTap } = PrimaryButton.mock.calls[1][0];

        onTap();

        expect(mockDispatchApplyButtonAction).toHaveBeenCalledWith(
          "COMB_1",
          [],
          undefined,
          WalletTypes.BonusCash,
          "0.00",
        );

        expect(mockDispatchGenerosityWalletApplyButtonClick).toHaveBeenCalledWith(
          undefined,
          undefined,
          "0.00",
          "all",
          undefined,
          undefined,
        );
      });
    });
  });

  describe("when there is no selectedCombinationId", () => {
    const mockDispatchCloseBottomSheetAction = jest.fn();
    const mockDispatchApplyButtonAction = jest.fn();
    const mockDispatchPushExternalBlankAction = jest.fn();
    const mockDispatchGenerosityPageNavigationAction = jest.fn();
    const mockBonusPageUrl = "title";

    it("should render a bonus page action link", () => {
      render(
        <GenerosityWallet
          i18nLabels={i18nLabels}
          dispatchCloseBottomSheetAction={mockDispatchCloseBottomSheetAction}
          dispatchApplyButtonAction={mockDispatchApplyButtonAction}
          userDetails={{ localeCode: "en-GB" }}
          optionWallets={optionWallets}
          dispatchPushExternalBlankAction={mockDispatchPushExternalBlankAction}
          generosityFilterOptions={mockGenerosityFilterOptions}
          bonusPageUrl={"bonusPageUrl"}
        />,
      );

      expect(ActionLink).toHaveBeenCalledWith(
        { text: i18nLabels.bonusPageMessage, onClick: expect.any(Function), noPadding: true },
        undefined,
      );
    });

    it("and should call dispatchPushExternalBlankAction and dispatchGenerosityPageNavigationAction when user clicks on page action link", () => {
      render(
        <GenerosityWallet
          dispatchCloseBottomSheetAction={mockDispatchCloseBottomSheetAction}
          dispatchApplyButtonAction={mockDispatchApplyButtonAction}
          dispatchPushExternalBlankAction={mockDispatchPushExternalBlankAction}
          dispatchGenerosityPageNavigationAction={mockDispatchGenerosityPageNavigationAction}
          userDetails={{ localeCode: "en-GB" }}
          optionWallets={optionWallets}
          generosityFilterOptions={mockGenerosityFilterOptions}
          bonusPageUrl={mockBonusPageUrl}
          i18nLabels={i18nLabels}
        />,
      );

      const { onClick } = ActionLink.mock.calls[0][0];

      onClick();

      expect(navigate).toHaveBeenCalledWith({
        viewDisplayMode: "BLANK_WEBVIEW",
        viewUrl: mockBonusPageUrl,
        viewUrn: "ppb:tbd:view:external",
      });
      expect(mockDispatchGenerosityPageNavigationAction).toHaveBeenCalledWith(mockBonusPageUrl, "all");
    });
  });

  it("should call dispatchCloseBottomSheetAction when header icon is tapped and was opened from header", () => {
    const mockDispatchCloseBottomSheetAction = jest.fn();

    render(
      <GenerosityWallet
        i18nLabels={i18nLabels}
        dispatchCloseBottomSheetAction={mockDispatchCloseBottomSheetAction}
        optionWallets={optionWallets}
        generosityFilterOptions={mockGenerosityFilterOptions}
      />,
    );

    const { onHeaderIconTap } = BottomSheet.mock.calls[0][0];

    onHeaderIconTap();

    expect(mockDispatchCloseBottomSheetAction).toHaveBeenCalledWith(false, "all");
  });

  it("should call dispatchCloseBottomSheetAction when header icon is tapped and was opened from betslip", () => {
    const mockDispatchCloseBottomSheetAction = jest.fn();

    render(
      <GenerosityWallet
        i18nLabels={i18nLabels}
        dispatchCloseBottomSheetAction={mockDispatchCloseBottomSheetAction}
        optionWallets={optionWallets}
        selectedCombinationId="COMB_1"
        generosityFilterOptions={mockGenerosityFilterOptions}
      />,
    );

    const { onHeaderIconTap } = BottomSheet.mock.calls[0][0];

    onHeaderIconTap();

    expect(mockDispatchCloseBottomSheetAction).toHaveBeenCalledWith(true, "all");
  });

  it("should re-render connected ExtraWalletCardGroup card with the new optionWallets when onOptionWalletsUpdate is triggered", () => {
    const mockDispatchCloseBottomSheetAction = jest.fn();

    render(
      <GenerosityWallet
        i18nLabels={i18nLabels}
        dispatchCloseBottomSheetAction={mockDispatchCloseBottomSheetAction}
        optionWallets={optionWallets}
        generosityFilterOptions={mockGenerosityFilterOptions}
      />,
    );

    const { onOptionWalletsUpdate } = ConnectedExtraWalletCardGroup.mock.calls[0][0];

    updateOptionWallets.mockReturnValue({
      ...optionWallets,
      WALLET_1: { ...optionWallets.WALLET_1, isSelected: false, combinationId: undefined },
    });

    act(() => {
      onOptionWalletsUpdate("WALLET_1", false);
    });

    expect(ConnectedExtraWalletCardGroup).toHaveBeenCalledWith(
      {
        component: ExtraWalletCardGroup,
        onOptionWalletsUpdate: expect.any(Function),
        itemsFilter: PebbleFilterOptions.All,
        optionWallets: {
          ...optionWallets,
          WALLET_1: {
            walletId: "WALLET_1",
            type: WalletTypes.BonusCash,
            combinationId: undefined,
            amount: 25,
            isSelected: false,
            isDisabled: false,
          },
        },
      },
      undefined,
    );
  });
});
