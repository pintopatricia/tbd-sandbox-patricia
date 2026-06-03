import { render, waitFor, fireEvent } from "@testing-library/react-native";
import { SecondaryButton } from "@ppb/the-wall-native";
import FreezeSelection from "./FreezeSelection.native";
import FreezeSelectionBottomSheet from "./FreezeSelectionBottomSheet";

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.mock("@ppb/the-wall-native", () => ({
  SecondaryButton: jest.fn(({ onTap }) => <secondary-button-mock press={onTap} testID="freeze-selection-button" />),
  Alert: jest.fn(() => <alert-component></alert-component>),
}));

jest.mock("./FreezeSelectionBottomSheet", () =>
  jest.fn((props) => <freeze-selection-bottom-sheet-mock testID="freeze-selection-bottom-sheet" {...props} />),
);

jest.mock("../FixtureHeader/FixtureHeader.native", () => ({
  FixtureHeader: jest.fn(() => <fixture-header-mock />),
}));

const mockDispatchAccaFreezeOpenedAction = jest.fn();
const mockDispatchAccaFreezeClosedAction = jest.fn();

const defaultProps = {
  numberOfEligibleLegs: 1,
  numberOfBetLegs: 5,
  urn: "urn",
  freezeDetails: "",
  isSettled: false,
  shouldShowFreezeSelectionButton: true,
  statusLabelText: "I18N.DATE.TODAY",
  returns: "£1.00",
  isAccaFreezeBrandSetting: true,
  stake: "£0.10",
  dispatchAccaFreezeOpenedAction: mockDispatchAccaFreezeOpenedAction,
  dispatchAccaFreezeClosedAction: mockDispatchAccaFreezeClosedAction,
};

function renderFreezeSelection(props) {
  return render(<FreezeSelection {...props} />);
}

describe("FreezeSelection", () => {
  beforeEach(jest.clearAllMocks);

  it("should create a SecondaryButton", () => {
    renderFreezeSelection(defaultProps);

    expect(SecondaryButton).toHaveBeenCalledWith(
      {
        label: "I18N.FREEZE_SELECTION.BUTTON_LABEL",
        secondaryLabel: "I18N.FREEZE_SELECTION.BUTTON_SECONDARY_LABEL: 1/5",
        disabled: false,
        onTap: expect.any(Function),
        stopAnimation: false,
        icon: "Value--Acca-Freeze",
      },
      undefined,
    );
  });

  it("should create a SecondaryButton with disabled state if numberOfEligibleLegs is zero", () => {
    renderFreezeSelection({ ...defaultProps, numberOfEligibleLegs: 0 });

    expect(SecondaryButton).toHaveBeenCalledWith(
      {
        label: "I18N.FREEZE_SELECTION.BUTTON_DISABLED_LABEL",
        secondaryLabel: undefined,
        disabled: true,
        onTap: expect.any(Function),
        stopAnimation: false,
        icon: "Value--Acca-Freeze",
      },
      undefined,
    );
  });

  it("should open the bottom sheet when the button is clicked", async () => {
    const { getByTestId } = renderFreezeSelection(defaultProps);

    fireEvent.press(getByTestId("freeze-selection-button"));
    await waitFor(() => {
      getByTestId("freeze-selection-bottom-sheet");
    });

    expect(FreezeSelectionBottomSheet).toHaveBeenCalledTimes(1);
  });

  it("should dispatch an event when bottom sheet opened", async () => {
    const { getByTestId } = renderFreezeSelection(defaultProps);

    fireEvent.press(getByTestId("freeze-selection-button"));
    await waitFor(() => {
      getByTestId("freeze-selection-bottom-sheet");
    });

    expect(mockDispatchAccaFreezeOpenedAction).toHaveBeenCalledTimes(1);
    expect(mockDispatchAccaFreezeClosedAction).not.toHaveBeenCalled();
  });

  it("should dispatch an event when bottom sheet calls onDismiss", async () => {
    const { getByTestId } = renderFreezeSelection(defaultProps);

    fireEvent.press(getByTestId("freeze-selection-button"));
    await waitFor(() => {
      getByTestId("freeze-selection-bottom-sheet");
      const { onDismiss } = FreezeSelectionBottomSheet.mock.calls[0][0];
      onDismiss();
    });

    expect(mockDispatchAccaFreezeClosedAction).toHaveBeenCalledTimes(1);
  });

  it("should not render the SecondaryButton if shouldShowFreezeSelectionButton is false", () => {
    renderFreezeSelection({ ...defaultProps, shouldShowFreezeSelectionButton: false });
    expect(SecondaryButton).not.toHaveBeenCalled();
  });
});
