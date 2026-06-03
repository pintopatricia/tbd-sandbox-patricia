import { render, act, waitFor } from "@testing-library/react-native";

import ExchangeOnboardingBottomSheet from "./ExchangeOnboardingBottomSheet/ExchangeOnboardingBottomSheet.native";
import Storage from "../../helpers/storage.native";
import { ExchangeOnboarding } from "./ExchangeOnboarding.native";

jest.mock("./ExchangeOnboardingBottomSheet/ExchangeOnboardingBottomSheet.native", () =>
  jest.fn(() => <exchange-onboarding-bottom-sheet-mock />),
);

jest.mock("../../helpers/storage.native", () => ({
  getItem: jest.fn(() => Promise.resolve(undefined)),
  setItem: jest.fn(),
}));

const DEFAULT_PROPS = {
  canShowExchangeOnboarding: true,
  i18nLabels: {
    bottomSheetTitle: "bottomSheetTitle",
    bottomSheetDescription: "bottomSheetDescription",
    bottomSheetDismissButton: "bottomSheetDismissButton",
  },
};

const setupExchangeOnboarding = (overrideProps = {}) => {
  const props = { ...DEFAULT_PROPS, ...overrideProps };
  return render(<ExchangeOnboarding {...props} />);
};

describe("ExchangeOnboarding.native", () => {
  beforeEach(jest.clearAllMocks);

  describe("when canShowExchangeOnboarding is false", () => {
    it("should not call any component", async () => {
      setupExchangeOnboarding({ canShowExchangeOnboarding: false });
      await waitFor(() => expect(ExchangeOnboardingBottomSheet).not.toHaveBeenCalled());
    });
  });

  describe("when canShowExchangeOnboarding is true", () => {
    it("should call ExchangeOnboardingBottomSheet", async () => {
      setupExchangeOnboarding({ canShowExchangeOnboarding: true });

      await waitFor(() =>
        expect(ExchangeOnboardingBottomSheet).toHaveBeenCalledWith(
          {
            title: "bottomSheetTitle",
            description: "bottomSheetDescription",
            dismissButtonText: "bottomSheetDismissButton",
            onDismiss: expect.any(Function),
          },
          undefined,
        ),
      );
    });

    describe("when ExchangeOnboardingBottomSheet.onDismiss is triggered", () => {
      it("should hide ExchangeOnboardingBottomSheet component", async () => {
        setupExchangeOnboarding({
          canShowExchangeOnboarding: true,
        });

        await waitFor(() => expect(ExchangeOnboardingBottomSheet).toHaveBeenCalled());

        act(() => {
          const { onDismiss } = ExchangeOnboardingBottomSheet.mock.calls[0][0];
          onDismiss();
        });

        await waitFor(() => expect(ExchangeOnboardingBottomSheet).toHaveBeenCalledTimes(1));
      });

      it("should persist wasExchangeOnboardingShown to Storage", async () => {
        setupExchangeOnboarding({
          canShowExchangeOnboarding: true,
        });

        await waitFor(() => expect(ExchangeOnboardingBottomSheet).toHaveBeenCalled());

        act(() => {
          const { onDismiss } = ExchangeOnboardingBottomSheet.mock.calls[0][0];
          onDismiss();
        });

        await waitFor(() => expect(Storage.setItem).toHaveBeenCalledWith("wasExchangeOnboardingShown", true));
      });
    });

    describe("when bottom sheet was previously dismissed", () => {
      beforeEach(() => {
        Storage.getItem.mockResolvedValue(true);
      });

      it("should not call ExchangeOnboardingBottomSheet", async () => {
        setupExchangeOnboarding({ canShowExchangeOnboarding: true });

        await waitFor(() => expect(ExchangeOnboardingBottomSheet).not.toHaveBeenCalled());
      });
    });
  });
});
