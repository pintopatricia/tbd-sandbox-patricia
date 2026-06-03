import { render } from "@testing-library/react-native";

import { PrimaryButton } from "@ppb/the-wall-native";

import SpainSessionNotification from "./SpainSessionNotification.native";

jest.mock("@ppb/the-wall-native", () => ({
  PrimaryButton: jest.fn(() => <primary-button-mock />),
  Text: jest.requireActual("react-native").Text,
}));

const messageMock = {
  title: "Test title",
  body: "Test body",
  action: "Continue",
};
const handleCloseNotificationSpy = jest.fn();

const renderSpainSessionNotification = ({
  message = messageMock,
  handleCloseNotification = handleCloseNotificationSpy,
} = {}) => render(<SpainSessionNotification message={message} handleCloseNotification={handleCloseNotification} />);

describe("SpainSessionNotification", () => {
  beforeEach(jest.clearAllMocks);

  it("should render the notification correctly", () => {
    const { getByText } = renderSpainSessionNotification();

    expect(getByText(messageMock.title)).toBeTruthy();
    expect(getByText(messageMock.body)).toBeTruthy();

    expect(PrimaryButton).toHaveBeenCalledTimes(1);
    expect(PrimaryButton).toHaveBeenCalledWith(
      {
        label: messageMock.action,
        onTap: handleCloseNotificationSpy,
      },
      undefined,
    );
  });
});
