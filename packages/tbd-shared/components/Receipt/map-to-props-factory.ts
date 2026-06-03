import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { UI__RECEIPT_CLOSE, ReceiptCloseAction } from "@ppb/tbd-store/actions/receipt";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { UserDetailsState, UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { FormatableNumber } from "@ppb/tbd-store/state/entities/Receipt.types";
import { buildTranslatableText } from "../../helpers/translatable-text";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import { CurrencyUserDetails } from "../../formatters/formatters";
import { ReceiptPanelProps } from "./snowflakes/ReceiptPanel/ReceiptPanel.types";

export type CardProps = {
  entityURN: string;
  isLoggedIn: boolean;
} & ReceiptPanelProps;

export type StateProps = CardProps | Record<string, never>;

export type ContainerProps = {
  currentView?: string | null;
};

const buildReceiptValue = (userDetails: UserDetailsState, receiptValue?: FormatableNumber): string | undefined =>
  receiptValue
    ? currencyFormatWithDecimalPlaces({
        ...(<CurrencyUserDetails>userDetails),
        ...receiptValue,
      })
    : undefined;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> =
  () =>
  (state: ApplicationState): StateProps => {
    try {
      const { receipt } = state.layouts.cards;

      if (!receipt) {
        return {};
      }

      const { entityURN } = receipt;
      const userDetails = <UserDetails>getUserDetails(state);
      const { loggedIn } = userDetails;

      return {
        entityURN,
        isLoggedIn: loggedIn,
        receiptTitle: buildTranslatableText(receipt.receiptTitle) || "",
        detailTitle: buildTranslatableText(receipt.detailTitle) || "",
        detailSubtitle: buildTranslatableText(receipt.detailSubtitle),
        segmentLeftLabel: buildTranslatableText(receipt.segmentLeftLabel),
        segmentLeftValue: buildReceiptValue(userDetails, receipt.segmentLeftValue),
        segmentRightLabel: buildTranslatableText(receipt.segmentRightLabel),
        segmentRightValue: buildReceiptValue(userDetails, receipt.segmentRightValue),
        buttonText: buildTranslatableText(receipt.buttonText),
        errorMessage: buildTranslatableText(receipt.errorMessage),
        errorDetail: buildTranslatableText(receipt.errorDetail),
      };
    } catch (e) {
      console.error(e);

      return {};
    }
  };

const dispatchOnReceiptClose = (entityURN: string): ReceiptCloseAction => ({
  type: UI__RECEIPT_CLOSE,
  payload: {
    entityURN,
  },
});

export type DispatchProps = {
  dispatchOnReceiptClose: typeof dispatchOnReceiptClose;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchOnReceiptClose,
};
