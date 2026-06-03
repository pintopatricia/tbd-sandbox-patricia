import { Platform } from "react-native";
import { render, fireEvent } from "@testing-library/react-native";
import i18next from "i18next";
import { DisplayMode } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { navigate } from "@ppb/tbd-router/native";
import { BetfairTerritoryBlockingPage } from "./BetfairTerritoryBlockingPage.native";
import { HELP_ICON } from "./BetfairTerritoryBlockingPage.native.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
}));

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

const TITLE = "Access Restricted";
const MESSAGE = "It looks like you're using the app in a location that restricts betting.";
const INFO = "Visit Help Center";

function renderTerritoryBlocking() {
  return render(<BetfairTerritoryBlockingPage title={TITLE} message={MESSAGE} info={INFO} />);
}

describe("BetfairTerritoryBlocking", () => {
  describe("when rendered", () => {
    let title;
    let message;
    let info;
    let onPress;

    beforeEach(() => {
      const { queryByText } = renderTerritoryBlocking();
      title = queryByText(TITLE);
      message = queryByText(MESSAGE);
      info = queryByText(INFO);
    });

    it("should show territory blocking information", () => {
      expect(title).not.toBeNull();
      expect(message).not.toBeNull();
      expect(info).not.toBeNull();
    });

    describe("when user clicks on Help Center", () => {
      beforeEach(() => {
        Platform.OS = "ios";
        const { queryByTestId } = renderTerritoryBlocking();
        onPress = queryByTestId(HELP_ICON);
      });

      it("should call navigate with correct values", async () => {
        await fireEvent(onPress, "onPress");

        expect(navigate).toHaveBeenCalledWith({
          viewUrl: "https://www.betfair.com/sport/",
          viewUrn: "ppb:tbd:view:external",
          viewDisplayMode: DisplayMode.BlankBrowser,
        });

        expect(mockDispatch).toHaveBeenCalledWith({
          type: "UI__NAVIGATE_TO_MOBILE_WEB",
          payload: { label: "Visit Help Center", url: "https://www.betfair.com/sport/" },
        });
      });

      describe.skip("and when platform is ios", () => {
        beforeEach(() => {
          Platform.OS = "ios";
        });

        describe("and language is not in the helpers url list", () => {
          it("should call navigate with correct values", async () => {
            i18next.language = "fr";
            await fireEvent(onPress, "onPress");

            expect(navigate).toHaveBeenCalledWith({
              viewUrl: "https://support.betfair.com/",
              viewUrn: "ppb:tbd:view:external",
              viewDisplayMode: DisplayMode.BlankBrowser,
            });
          });
        });

        describe("and language is undefined", () => {
          it("should call navigate with correct values", async () => {
            await fireEvent(onPress, "onPress");

            expect(navigate).toHaveBeenCalledWith({
              viewUrl: "https://support.betfair.com/",
              viewUrn: "ppb:tbd:view:external",
              viewDisplayMode: DisplayMode.BlankBrowser,
            });
          });
        });

        describe("and language is 'en_GB'", () => {
          it("should call navigate with correct values", async () => {
            i18next.language = "en_GB";
            await fireEvent(onPress, "onPress");

            expect(navigate).toHaveBeenCalledWith({
              viewUrl: "https://support.betfair.com/",
              viewUrn: "ppb:tbd:view:external",
              viewDisplayMode: DisplayMode.BlankBrowser,
            });
          });
        });

        describe("and language is different from 'en_GB'", () => {
          it("should call navigate with correct values", async () => {
            i18next.language = "es_419";
            await fireEvent(onPress, "onPress");

            expect(navigate).toHaveBeenCalledWith({
              viewUrl: "https://support.betfair.com/es/app/home",
              viewUrn: "ppb:tbd:view:external",
              viewDisplayMode: DisplayMode.BlankBrowser,
            });
          });
        });

        describe("and device locale is 'en_AU'", () => {
          it("should call navigate with correct values", async () => {
            // getDeviceLocaleCode.mockReturnValue("en_AU");
            await fireEvent(onPress, "onPress");

            expect(navigate).toHaveBeenCalledWith({
              viewUrl: "https://www.betfair.com.au/hub/contact-us",
              viewUrn: "ppb:tbd:view:external",
              viewDisplayMode: DisplayMode.BlankBrowser,
            });
          });
        });
      });

      describe.skip("and when platform is android", () => {
        beforeEach(() => {
          Platform.OS = "android";
        });

        describe("and language is not in the helpers url list", () => {
          it("should call navigate with correct values", async () => {
            i18next.language = "fr";
            await fireEvent(onPress, "onPress");

            expect(navigate).toHaveBeenCalledWith({
              viewUrl: "https://support.betfair.com/",
              viewUrn: "ppb:tbd:view:external",
              viewDisplayMode: DisplayMode.BlankBrowser,
            });
          });
        });

        describe("and language is undefined", () => {
          it("should call navigate with correct values", async () => {
            await fireEvent(onPress, "onPress");

            expect(navigate).toHaveBeenCalledWith({
              viewUrl: "https://support.betfair.com/",
              viewUrn: "ppb:tbd:view:external",
              viewDisplayMode: DisplayMode.BlankBrowser,
            });
          });
        });

        describe("and language is 'en_GB'", () => {
          it("should call navigate with correct values", async () => {
            i18next.language = "en_GB";
            await fireEvent(onPress, "onPress");

            expect(navigate).toHaveBeenCalledWith({
              viewUrl: "https://support.betfair.com/",
              viewUrn: "ppb:tbd:view:external",
              viewDisplayMode: DisplayMode.BlankBrowser,
            });
          });
        });

        describe("and language is different from 'en_GB'", () => {
          it("should call navigate with correct values", async () => {
            i18next.language = "es_419";
            await fireEvent(onPress, "onPress");

            expect(navigate).toHaveBeenCalledWith({
              viewUrl: "https://support.betfair.com/es/app/home",
              viewUrn: "ppb:tbd:view:external",
              viewDisplayMode: DisplayMode.BlankBrowser,
            });
          });
        });

        describe("and device locale is 'en_AU'", () => {
          it("should call navigate with correct values", async () => {
            // getDeviceLocaleCode.mockReturnValue("en_AU");
            await fireEvent(onPress, "onPress");

            expect(navigate).toHaveBeenCalledWith({
              viewUrl: "https://www.betfair.com.au/hub/contact-us",
              viewUrn: "ppb:tbd:view:external",
              viewDisplayMode: DisplayMode.BlankBrowser,
            });
          });
        });
      });
    });
  });
});
