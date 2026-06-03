import { render } from "@testing-library/react-native";

import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { i18n } from "../../helpers/i18n";

import { NO_CONTENT_AVAILABLE } from "./NoContentAvailableCard.native.selectors";
import { NoContentAvailableCard } from "./NoContentAvailableCard.native";
import styles from "./NoContentAvailableCard.native.styles";

const translationMock = "translationMock";

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/tbd-shared/helpers/i18n", () => ({
  i18n: jest.fn(() => translationMock),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  spacings: {},
  typography: {},
  colors: { NeutralsIconSecondary: "NeutralsIconSecondary" },
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn((props) => <generic-icon-mock {...props} />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

function renderNoContentAvailableCard() {
  return render(<NoContentAvailableCard />);
}

describe("NoContentAvailableCard", () => {
  beforeEach(jest.clearAllMocks);

  describe("when view is rendered", () => {
    it("should draw the container with the correct styling", () => {
      const { queryByTestId } = renderNoContentAvailableCard();
      const noContentAvailableContainer = queryByTestId(NO_CONTENT_AVAILABLE);

      expect(noContentAvailableContainer).toHaveStyle(styles.noContentAvailableContainer);
    });

    it("should call GenericIcon with correct props", () => {
      renderNoContentAvailableCard();

      expect(GenericIcon).toHaveBeenCalledWith(
        {
          name: SystemIconName.CLOSE,
          color: "NeutralsIconSecondary",
        },
        undefined,
      );
    });

    it("should call i18n with correct props", () => {
      renderNoContentAvailableCard();
      expect(i18n).toHaveBeenNthCalledWith(1, { key: "I18N.NO_PRICE_AVAILABLE.TITLE" });
      expect(i18n).toHaveBeenNthCalledWith(2, { key: "I18N.NO_CONTENT_AVAILABLE.TEXT" });
    });
  });
});
