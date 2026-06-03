import { render } from "@testing-library/react-native";
import { DisplayMode } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { navigate } from "@ppb/tbd-router/native";
import { PrimaryButton } from "@ppb/the-wall-native";
import { SkybetTerritoryBlockingPage } from "./SkybetTerritoryBlockingPage.native";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  PrimaryButton: jest.fn((props) => <primary-button {...props} />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
}));

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

const TITLE = "We’re unavailable where you are";
const MESSAGE =
  "You can’t access Sky Bet from your current location. This is usually due to legal restrictions—ours not yours!";
const INFO = "Find out more";

function renderTerritoryBlocking() {
  return render(<SkybetTerritoryBlockingPage title={TITLE} message={MESSAGE} info={INFO} />);
}

describe("SkybetTerritoryBlocking", () => {
  describe("when rendered", () => {
    let title;
    let message;

    beforeEach(() => {
      const { queryByText } = renderTerritoryBlocking();
      title = queryByText(TITLE);
      message = queryByText(MESSAGE);
    });

    it("should show territory blocking information", () => {
      expect(title).not.toBeNull();
      expect(message).not.toBeNull();
      expect(PrimaryButton).toHaveBeenCalledTimes(1);
    });

    describe("when user clicks on Find out More", () => {
      beforeEach(() => {
        renderTerritoryBlocking();
      });

      it("should call navigate with correct values", async () => {
        PrimaryButton.mock.calls[0][0].onTap();

        expect(navigate).toHaveBeenCalledWith({
          viewUrl: "https://support.skybet.com/app/answers/detail/accepted-countries-using-your-account-abroad/",
          viewUrn: "ppb:tbd:view:external",
          viewDisplayMode: DisplayMode.BlankBrowser,
        });

        expect(mockDispatch).toHaveBeenCalledWith({
          type: "UI__NAVIGATE_TO_MOBILE_WEB",
          payload: {
            label: INFO,
            url: "https://support.skybet.com/app/answers/detail/accepted-countries-using-your-account-abroad/",
          },
        });
      });
    });
  });
});
