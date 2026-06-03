import { render, act } from "@testing-library/react";

import { BottomSheet, Image, PrimaryButton } from "@ppb/the-wall-web";

import ExchangeOnboardingBottomSheet from "./ExchangeOnboardingBottomSheet.web";
import { createImagePath } from "../../../helpers/create-image-path.web";

jest.mock("@ppb/the-wall-web", () => ({
  BottomSheet: jest.fn(({ children, props }) => <bottom-sheet-mock {...props}> {children} </bottom-sheet-mock>),
  Image: jest.fn(() => <image-mock />),
  PrimaryButton: jest.fn(() => <primary-button-mock />),
}));

jest.mock("../../../helpers/create-image-path.web", () => ({
  createImagePath: jest.fn((name) => `mock-path/${name}`),
}));

const setupExchangeOnboardingBottomSheet = ({
  title = "title",
  description = "description",
  dismissButtonText = "dismissButtonText",
  onDismiss = jest.fn(),
} = {}) =>
  render(
    <ExchangeOnboardingBottomSheet
      title={title}
      description={description}
      dismissButtonText={dismissButtonText}
      onDismiss={onDismiss}
    />,
  );

describe("ExchangeOnboardingBottomSheet.web", () => {
  beforeEach(jest.clearAllMocks);

  it("should call BottomSheet", () => {
    setupExchangeOnboardingBottomSheet();

    expect(BottomSheet).toHaveBeenCalledWith(
      {
        containerId: "exchange-onboarding-bottom-sheet",
        title: "title",
        onHeaderIconTap: expect.any(Function),
        showOverlay: true,
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
    setupExchangeOnboardingBottomSheet();

    expect(createImagePath).toHaveBeenCalledWith("exchange-onboarding");
    expect(Image).toHaveBeenCalledWith({ src: "mock-path/exchange-onboarding", alt: "Exchange onboarding" }, undefined);
  });

  it("should not render the image when createImagePath returns undefined", () => {
    createImagePath.mockReturnValueOnce(undefined);

    setupExchangeOnboardingBottomSheet();

    expect(Image).not.toHaveBeenCalled();
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
