import { Text } from "react-native";
import { render, fireEvent } from "@testing-library/react-native";

import { PreferenceCard } from "./PreferenceCard.native";
import {
  PREFERENCES_CARD_TITLE,
  PREFERENCES_CARD_INFO_BTN,
  PREFERENCES_CARD_OPTION,
  PREFERENCES_CARD_HINT,
  PREFERENCES_CARD_EXTRA_CONTENT,
} from "./PreferenceCard.native.selectors";

jest.mock("react-native-svg", () => ({ SvgCssUri: jest.fn(() => <svg-css-uri-mock />) }));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
}));

jest.mock("@ppb/the-wall-icons", () => ({
  SystemIconName: {
    NOTIFICATION_INFO: "NOTIFICATION_INFO",
  },
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(({ props }) => <generic-icon-mock {...props} />),
}));

jest.mock("./PreferenceCard.native.styles", () => ({ styles: {} }));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

function renderPreferenceCard({
  title = "",
  hint = "",
  children = <Text>children</Text>,
  onInfoButtonClick = jest.fn(),
  extraContent,
} = {}) {
  return render(
    <PreferenceCard title={title} hint={hint} onInfoButtonClick={onInfoButtonClick} extraContent={extraContent}>
      {children}
    </PreferenceCard>,
  );
}

describe("PreferenceCard", () => {
  beforeEach(jest.clearAllMocks);

  describe("children", () => {
    it("should have the content included", () => {
      const { queryByTestId } = renderPreferenceCard();
      const option = queryByTestId(PREFERENCES_CARD_OPTION);

      expect(option).toHaveTextContent("children");
    });
  });

  describe("when extraContent is provided", () => {
    it("should have hint text", () => {
      const { queryByTestId } = renderPreferenceCard({ extraContent: <Text>SOME_TEXT</Text> });
      const extraContent = queryByTestId(PREFERENCES_CARD_EXTRA_CONTENT);

      expect(extraContent).toHaveTextContent("SOME_TEXT");
    });
  });

  describe("when title is provided", () => {
    it("should have title text", () => {
      const { queryByTestId } = renderPreferenceCard({ title: "preferenceCardMockTitle" });
      const title = queryByTestId(PREFERENCES_CARD_TITLE);

      expect(title).toHaveTextContent("preferenceCardMockTitle");
    });
  });

  describe("when hint is provided", () => {
    it("should have hint text", () => {
      const { queryByTestId } = renderPreferenceCard({ hint: "preferenceCardMockHint" });
      const hint = queryByTestId(PREFERENCES_CARD_HINT);

      expect(hint).toHaveTextContent("preferenceCardMockHint");
    });
  });

  describe("when onInfoButtonClick is provided", () => {
    it("should have info button", () => {
      const onInfoButtonClick = jest.fn();
      const { queryByTestId } = renderPreferenceCard({ onInfoButtonClick });

      const infoBtn = queryByTestId(PREFERENCES_CARD_INFO_BTN);
      fireEvent.press(infoBtn);

      expect(onInfoButtonClick).toHaveBeenCalledTimes(1);
    });
  });
});
