import { render, act } from "@testing-library/react-native";
import { Image } from "react-native";

import { BottomSheet, PrimaryButton } from "@ppb/the-wall-native";

import ExchangeOnboardingBottomSheet from "./ExchangeOnboardingBottomSheet.native";
import { IMAGE } from "./ExchangeOnboardingBottomSheet.native.selectors";

jest.mock("@ppb/the-wall-native", () => ({
  BottomSheet: jest.fn(({ children, props }) => <bottom-sheet-mock {...props}> {children} </bottom-sheet-mock>),
  PrimaryButton: jest.fn(() => <primary-button-mock />),
  Text: jest.requireActual("react-native").Text,
}));

const setupExchangeOnboardingBottomSheet = ({
  title = "title",
  descrption = "description",
  dismissButtonText = "dismissButtonText",
  onDismiss = jest.fn(),
} = {}) =>
  render(
    <ExchangeOnboardingBottomSheet
      title={title}
      description={descrption}
      dismissButtonText={dismissButtonText}
      onDismiss={onDismiss}
    />,
  );

describe("ExchangeOnboardingBottomSheet.native", () => {
  beforeEach(jest.clearAllMocks);

  it("should call BottomSheet", () => {
    setupExchangeOnboardingBottomSheet();

    expect(BottomSheet).toHaveBeenCalledWith(
      {
        title: "title",
        onHeaderIconTap: expect.any(Function),
        showOverlay: true,
        withModal: true,
        children: expect.anything(),
      },
      undefined,
    );
  });

  it("should call PrimaryButton", () => {
    setupExchangeOnboardingBottomSheet();

    expect(PrimaryButton).toHaveBeenCalledWith(
      {
        label: "dismissButtonText",
        onTap: expect.any(Function),
      },
      undefined,
    );
  });

  it("should render the exchange onboarding image", () => {
    const { getByTestId } = setupExchangeOnboardingBottomSheet();

    expect(getByTestId(IMAGE)).toBeTruthy();
  });

  describe("when BottomSheet.onHeaderIconTap is called", () => {
    it("should call onDismiss", () => {
      const onDismiss = jest.fn();
      setupExchangeOnboardingBottomSheet({ onDismiss });

      act(() => {
        const { onHeaderIconTap } = BottomSheet.mock.calls[0][0];
        onHeaderIconTap();
      });

      expect(onDismiss).toHaveBeenCalled();
    });
  });

  describe("when PrimaryButton.onTap is called", () => {
    it("should call onDismiss", () => {
      const onDismiss = jest.fn();
      setupExchangeOnboardingBottomSheet({ onDismiss });

      act(() => {
        const { onTap } = PrimaryButton.mock.calls[0][0];
        onTap();
      });

      expect(onDismiss).toHaveBeenCalled();
    });
  });
});
