import { BottomSheet, PrimaryButton, Overlay, Modal, PebbleList, ActionLink, Alert } from "@ppb/the-wall-web";
import { render, act } from "@testing-library/react";
import { WalletTypes } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { AlertType } from "@ppb/the-wall-common/types";
import GenerosityWallet from "./GenerosityWallet.web";
import ConnectedExtraWalletCardGroup from "../ExtraWalletCardGroup";
import ExtraWalletCardGroup from "../ExtraWalletCardGroup/ExtraWalletCardGroup.web";
import { ConfigContext } from "../Config/ConfigContext";
import { updateOptionWallets, PebbleFilterOptions } from "../../helpers/generosity-wallets";

jest.mock("@ppb/the-wall-web", () => ({
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
  Overlay: jest.fn(({ children }) => <div>{children}</div>),
  Modal: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock("../ExtraWalletCardGroup", () => jest.fn(() => <connected-card-mock />));

jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn(({ value }) => `${value}.00€`),
}));

jest.mock("../../helpers/generosity-wallets", () => ({
  ...jest.requireActual("../../helpers/generosity-wallets"),
  sumWalletsAmounts: jest.fn((value1, value2) => value1 + value2),
  updateOptionWallets: jest.fn(() => ({ ola: "adeus" })),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues }) => `${key}${interpolationValues ? interpolationValues.bonus : ""}`),
}));

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
    amount: 25,
    combinationId: "COMB_1",
    isSelected: true,
    isDisabled: false,
  },
  WALLET_2: {
    walletId: "WALLET_2",
    type: WalletTypes.BonusCash,
    amount: 20,
    combinationId: "COMB_2",
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

const renderGenerosityWallet = (generosityWalletProps, isDesktopLayout = false) =>
  render(
    <ConfigContext.Provider value={{ isDesktopLayout }}>
      <GenerosityWallet {...generosityWalletProps} />
    </ConfigContext.Provider>,
  );

describe("GenerosityWallet", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when rendering the GenerosityWallet in mobile", () => {
    it("should render the connected ExtraWalletCardGroup card with the right props in an overlayed bottom sheet", () => {
      renderGenerosityWallet({
        title: "title",
        dispatchCloseBottomSheetAction: jest.fn(),
        dispatchApplyButtonAction: jest.fn(),
        userDetails: { localeCode: "en-GB" },
        extraWalletCardGroup: { urn: "", typename: "" },
        optionWallets,
        generosityFilterOptions: mockGenerosityFilterOptions,
        i18nLabels,
      });

      expect(ConnectedExtraWalletCardGroup).toHaveBeenCalledWith(
        {
          component: ExtraWalletCardGroup,
          onOptionWalletsUpdate: expect.any(Function),
          optionWallets,
          itemsFilter: "ALL",
        },
        undefined,
      );

      expect(Overlay).toHaveBeenCalled();

      expect(BottomSheet).toHaveBeenCalledWith(
        expect.objectContaining({
          onHeaderIconTap: expect.any(Function),
          title: "title",
          children: expect.any(Object),
          headerContent: expect.any(Object),
          footerContent: expect.any(Object),
        }),
        undefined,
      );
      expect(Modal).not.toHaveBeenCalled();
    });
  });

  describe("when rendering the GenerosityWallet in desktop", () => {
    describe("and when there are more than one type of generosity available", () => {
      it("should render the connected ExtraWalletCardGroup card with the right props in a modal", () => {
        renderGenerosityWallet(
          {
            title: "title",
            dispatchCloseBottomSheetAction: jest.fn(),
            dispatchApplyButtonAction: jest.fn(),
            userDetails: { localeCode: "en-GB" },
            extraWalletCardGroup: { urn: "", typename: "" },
            optionWallets,
            generosityFilterOptions: mockGenerosityFilterOptions,
            i18nLabels,
          },
          true,
        );

        expect(ConnectedExtraWalletCardGroup).toHaveBeenCalledWith(
          {
            component: ExtraWalletCardGroup,
            onOptionWalletsUpdate: expect.any(Function),
            optionWallets,
            itemsFilter: "ALL",
          },
          undefined,
        );

        expect(Overlay).not.toHaveBeenCalled();
        expect(BottomSheet).not.toHaveBeenCalled();

        expect(Modal).toHaveBeenCalledWith(
          {
            onDismiss: expect.any(Function),
            title: "title",
            children: expect.any(Object),
            footerContent: expect.any(Object),
            dismissOnOutsideTap: true,
            headerContent: expect.any(Object),
          },
          undefined,
        );
      });
    });

    describe("and when there is one type of generosity available", () => {
      it("should render the connected ExtraWalletCardGroup card with the right props in a modal", () => {
        renderGenerosityWallet(
          {
            title: "title",
            dispatchCloseBottomSheetAction: jest.fn(),
            dispatchApplyButtonAction: jest.fn(),
            userDetails: { localeCode: "en-GB" },
            extraWalletCardGroup: { urn: "", typename: "" },
            optionWallets,
            generosityFilterOptions: mockGenerosityFilterOptions.slice(0, 2),
            i18nLabels,
          },
          true,
        );

        expect(ConnectedExtraWalletCardGroup).toHaveBeenCalledWith(
          {
            component: ExtraWalletCardGroup,
            onOptionWalletsUpdate: expect.any(Function),
            optionWallets,
            itemsFilter: "ALL",
          },
          undefined,
        );

        expect(Overlay).not.toHaveBeenCalled();
        expect(BottomSheet).not.toHaveBeenCalled();

        expect(Modal).toHaveBeenCalledWith(
          expect.objectContaining({
            onDismiss: expect.any(Function),
            title: "title",
            children: expect.any(Object),
            footerContent: expect.any(Object),
            dismissOnOutsideTap: true,
            headerContent: undefined,
          }),
          undefined,
        );
      });
    });
  });

  it("should render the bottom sheet and the connected ExtraWalletCardGroup card with the right props", () => {
    renderGenerosityWallet({
      bonusPageUrl: "bonusPageUrl",
      dispatchCloseBottomSheetAction: jest.fn(),
      dispatchApplyButtonAction: jest.fn(),
      dispatchPushExternalBlankAction: jest.fn(),
      generosityFilterOptions: mockGenerosityFilterOptions,
      i18nLabels,
      optionWallets,
      userDetails: { localeCode: "en-GB" },
      shouldShowAlert: false,
    });

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
      expect.objectContaining({
        onHeaderIconTap: expect.any(Function),
        title: i18nLabels.title,
        children: expect.any(Object),
        footerContent: expect.any(Object),
        headerContent: expect.any(Object),
      }),
      undefined,
    );
  });

  describe("when there is no selected combination id and many generosity wallet types available", () => {
    it("should render only pebble list in bottom sheet header with right props", () => {
      renderGenerosityWallet({
        generosityFilterOptions: mockGenerosityFilterOptions,
        dispatchCloseBottomSheetAction: jest.fn(),
        i18nLabels,
      });

      expect(PebbleList).toHaveBeenCalledWith(
        {
          items: mockGenerosityFilterOptions,
          defaultSelectedPebble: PebbleFilterOptions.All,
          onPebbleClick: expect.any(Function),
        },
        undefined,
      );
    });
  });

  it("should call mockDispatchGenerosityWalletPebbleClick when Pebble is clicked", () => {
    const mockDispatchGenerosityWalletPebbleClick = jest.fn();

    render(
      <GenerosityWallet
        generosityFilterOptions={mockGenerosityFilterOptions}
        dispatchCloseBottomSheetAction={jest.fn()}
        dispatchGenerosityWalletPebbleClick={mockDispatchGenerosityWalletPebbleClick}
        i18nLabels={i18nLabels}
      />,
    );

    const { onPebbleClick } = PebbleList.mock.calls[0][0];

    act(() => {
      onPebbleClick(PebbleFilterOptions.FreeBets);
    });

    expect(mockDispatchGenerosityWalletPebbleClick).toHaveBeenCalledWith(false, "all", "free bets");
  });

  describe("when there is selectedCombinationId and default apply button label", () => {
    const mockDispatchCloseBottomSheetAction = jest.fn();
    const mockDispatchApplyButtonAction = jest.fn();
    const mockDispatchGenerosityWalletApplyButtonClick = jest.fn();

    describe("when the user opens the GenerosityWallet", () => {
      describe("and there are no selected wallets", () => {
        it("should render a disabled primary button initially with the 'Apply' label", () => {
          renderGenerosityWallet({
            dispatchCloseBottomSheetAction: mockDispatchCloseBottomSheetAction,
            dispatchApplyButtonAction: mockDispatchApplyButtonAction,
            userDetails: { localeCode: "en-GB" },
            optionWallets: {
              ...optionWallets,
              WALLET_1: { ...optionWallets.WALLET_1, isSelected: false },
              WALLET_2: { ...optionWallets.WALLET_1, isSelected: false },
            },
            selectedCombinationId: "COMB_1",
            generosityFilterOptions: mockGenerosityFilterOptions,
            i18nLabels,
            shouldShowAlert: true,
          });

          expect(BottomSheet).toHaveBeenCalledWith(
            expect.objectContaining({
              onHeaderIconTap: expect.any(Function),
              title: i18nLabels.title,
              children: expect.any(Object),
              footerContent: expect.any(Object),
            }),
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
          renderGenerosityWallet({
            dispatchCloseBottomSheetAction: mockDispatchCloseBottomSheetAction,
            dispatchApplyButtonAction: mockDispatchApplyButtonAction,
            userDetails: { localeCode: "en-GB" },
            optionWallets,
            selectedCombinationId: "COMB_1",
            generosityFilterOptions: mockGenerosityFilterOptions,
            i18nLabels,
            shouldShowAlert: false,
          });

          expect(BottomSheet).toHaveBeenCalledWith(
            expect.objectContaining({
              onHeaderIconTap: expect.any(Function),
              title: i18nLabels.title,
              children: expect.any(Object),
              footerContent: expect.any(Object),
            }),
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
        renderGenerosityWallet({
          dispatchCloseBottomSheetAction: mockDispatchCloseBottomSheetAction,
          dispatchApplyButtonAction: mockDispatchApplyButtonAction,
          userDetails: { localeCode: "en-GB" },
          optionWallets,
          selectedCombinationId: "COMB_1",
          generosityFilterOptions: mockGenerosityFilterOptions,
          i18nLabels,
        });
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
            children: expect.any(Object),
            footerContent: expect.any(Object),
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
        renderGenerosityWallet({
          dispatchCloseBottomSheetAction: mockDispatchCloseBottomSheetAction,
          dispatchApplyButtonAction: mockDispatchApplyButtonAction,
          dispatchGenerosityWalletApplyButtonClick: mockDispatchGenerosityWalletApplyButtonClick,
          userDetails: { localeCode: "en-GB" },
          optionWallets: {
            ...optionWallets,
            WALLET_1: {
              ...optionWallets.WALLET_1,
              isSelected: false,
            },
          },
          selectedCombinationId: "COMB_1",
          generosityFilterOptions: mockGenerosityFilterOptions,
          i18nLabels,
        });

        const { onOptionWalletsUpdate } = ConnectedExtraWalletCardGroup.mock.calls[0][0];

        updateOptionWallets.mockReturnValue({
          ...optionWallets,
          WALLET_1: { ...optionWallets.WALLET_1, isSelected: true, combinationId: "COMB_1" },
        });

        act(() => {
          onOptionWalletsUpdate("WALLET_1", true);
        });

        const { onTap } = PrimaryButton.mock.calls[1][0];

        act(() => {
          onTap();
        });

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
        renderGenerosityWallet({
          dispatchCloseBottomSheetAction: mockDispatchCloseBottomSheetAction,
          dispatchApplyButtonAction: mockDispatchApplyButtonAction,
          dispatchGenerosityWalletApplyButtonClick: mockDispatchGenerosityWalletApplyButtonClick,
          userDetails: { localeCode: "en-GB" },
          optionWallets,
          selectedCombinationId: "COMB_1",
          generosityFilterOptions: mockGenerosityFilterOptions,
          i18nLabels,
        });

        const { onOptionWalletsUpdate } = ConnectedExtraWalletCardGroup.mock.calls[0][0];

        updateOptionWallets.mockReturnValue({
          ...optionWallets,
          WALLET_1: { ...optionWallets.WALLET_1, isSelected: false, combinationId: undefined },
        });

        act(() => {
          onOptionWalletsUpdate("WALLET_1", false);
        });

        const { onTap } = PrimaryButton.mock.calls[1][0];

        act(() => {
          onTap();
        });

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
    const mockDispatchGenerosityWalletPebbleClick = jest.fn();
    const mockBonusPageUrl = "title";

    it("should render a bonus page action link", () => {
      renderGenerosityWallet({
        dispatchCloseBottomSheetAction: mockDispatchCloseBottomSheetAction,
        dispatchApplyButtonAction: mockDispatchApplyButtonAction,
        dispatchPushExternalBlankAction: mockDispatchPushExternalBlankAction,
        userDetails: { localeCode: "en-GB" },
        optionWallets,
        generosityFilterOptions: mockGenerosityFilterOptions,
        bonusPageUrl: mockBonusPageUrl,
        i18nLabels,
      });

      expect(ActionLink).toHaveBeenCalledWith(
        { text: i18nLabels.bonusPageMessage, onClick: expect.any(Function), noPadding: true },
        undefined,
      );
    });

    it("and should call dispatchPushExternalBlankAction and dispatchGenerosityPageNavigationAction when user clicks on page action link", () => {
      renderGenerosityWallet({
        dispatchCloseBottomSheetAction: mockDispatchCloseBottomSheetAction,
        dispatchApplyButtonAction: mockDispatchApplyButtonAction,
        dispatchPushExternalBlankAction: mockDispatchPushExternalBlankAction,
        userDetails: { localeCode: "en-GB" },
        optionWallets,
        generosityFilterOptions: mockGenerosityFilterOptions,
        bonusPageUrl: mockBonusPageUrl,
        i18nLabels,
        dispatchGenerosityPageNavigationAction: mockDispatchGenerosityPageNavigationAction,
        dispatchGenerosityWalletPebbleClick: mockDispatchGenerosityWalletPebbleClick,
      });

      const { onClick } = ActionLink.mock.calls[0][0];

      onClick();

      expect(mockDispatchPushExternalBlankAction).toHaveBeenCalledWith(mockBonusPageUrl);
      expect(mockDispatchGenerosityPageNavigationAction).toHaveBeenCalledWith(mockBonusPageUrl, "all");
    });
  });

  it("should call dispatchCloseBottomSheetAction when header icon is tapped and was opened from header", () => {
    const mockDispatchCloseBottomSheetAction = jest.fn();

    renderGenerosityWallet({
      dispatchCloseBottomSheetAction: mockDispatchCloseBottomSheetAction,
      optionWallets,
      generosityFilterOptions: mockGenerosityFilterOptions,
      i18nLabels,
    });

    const { onHeaderIconTap } = BottomSheet.mock.calls[0][0];

    onHeaderIconTap();

    expect(mockDispatchCloseBottomSheetAction).toHaveBeenCalledWith(false, "all");
  });

  it("should call dispatchCloseBottomSheetAction when header icon is tapped and was opened from betslip", () => {
    const mockDispatchCloseBottomSheetAction = jest.fn();

    renderGenerosityWallet({
      dispatchCloseBottomSheetAction: mockDispatchCloseBottomSheetAction,
      optionWallets,
      selectedCombinationId: "COMB_1",
      generosityFilterOptions: mockGenerosityFilterOptions,
      i18nLabels,
    });

    const { onHeaderIconTap } = BottomSheet.mock.calls[0][0];

    onHeaderIconTap();

    expect(mockDispatchCloseBottomSheetAction).toHaveBeenCalledWith(true, "all");
  });

  it("should re-render connected ExtraWalletCardGroup card with the new optionWallets when onOptionWalletsUpdate is triggered", () => {
    const mockDispatchCloseBottomSheetAction = jest.fn();

    renderGenerosityWallet({
      dispatchCloseBottomSheetAction: mockDispatchCloseBottomSheetAction,
      optionWallets,
      generosityFilterOptions: mockGenerosityFilterOptions,
      i18nLabels,
    });

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
        optionWallets: {
          ...optionWallets,
          WALLET_1: {
            walletId: "WALLET_1",
            type: WalletTypes.BonusCash,
            amount: 25,
            combinationId: undefined,
            isSelected: false,
            isDisabled: false,
          },
        },
        itemsFilter: PebbleFilterOptions.All,
      },
      undefined,
    );
  });
});
