import { render, fireEvent } from "@testing-library/react-native";
import { useNavigation } from "@react-navigation/native";
import BackNavigationItem from "./BackNavigationItem.native";
import selectors from "./BackNavigationItem.native.selectors";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: () => "GenericIcon",
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    PageHeaderPadding: { paddingLeft: 12, paddingRight: 12 },
    PageHeaderVerticalGap: { gap: 12 },
    PageHeaderIconSizing: 20,
  },
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

describe("BackNavigationItem", () => {
  let mockDispatchGamingBackButtonClickAction;
  let mockGoBack;

  beforeEach(() => {
    mockDispatchGamingBackButtonClickAction = jest.fn();
    mockGoBack = jest.fn();

    useNavigation.mockReturnValue({ goBack: mockGoBack });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should calls navigation.goBack", () => {
    const { getByTestId } = render(
      <BackNavigationItem
        title="Back Navigation Title"
        returnToHomepage={false}
        dispatchGamingBackButtonClickAction={mockDispatchGamingBackButtonClickAction}
      />,
    );

    fireEvent.press(getByTestId(selectors.BACK_NAVIGATION));

    expect(mockGoBack).toHaveBeenCalledTimes(1);
    expect(mockDispatchGamingBackButtonClickAction).toHaveBeenCalledTimes(1);
  });
});
