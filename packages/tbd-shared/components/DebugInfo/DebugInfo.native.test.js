import { render } from "@testing-library/react-native";
import { getEndpoint } from "../../config/endpoints";
import { DebugInfo } from "./DebugInfo.native";

const USER_AGENT = "iosuseragent";
const ENDPOINT = "www.example.com";
const URL_ERROR_INSTANCE = "URL is not a constructor";
const URL_NON_ERROR_INSTANCE = "URL non-error instance exception";
const APP_KEY = "abcdef";
const OS = "jest";

jest.mock("react-native/Libraries/Utilities/Platform", () => ({
  OS,
  select: (obj) => obj[OS],
}));

jest.mock("../../config/app-configuration.native", () => ({
  appConfig: {
    APP_KEYS: { jest: APP_KEY },
  },
}));

jest.mock("../../helpers/user-agent.native", () => ({
  getCustomUserAgent: jest.fn().mockReturnValue(USER_AGENT),
}));

jest.mock("../../config/endpoints", () => ({
  getEndpoint: jest.fn(() => "https://www.example.com/path-to-endpoint"),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {},
  typography: {},
  spacings: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

function renderDebugInfo(props) {
  return render(<DebugInfo {...props} reason={new Error("dummy error")} />);
}

describe("DebugInfo", () => {
  describe("when rendered", () => {
    let userAgent;
    let endpoint;
    let os;
    let appKey;

    beforeEach(() => {
      const { queryByText } = renderDebugInfo();
      userAgent = queryByText(USER_AGENT);
      endpoint = queryByText(ENDPOINT);
      os = queryByText(OS);
      appKey = queryByText(APP_KEY);
    });

    it("gets the CATALOGUE endpoint info", () => {
      expect(getEndpoint).toHaveBeenCalledWith("CATALOGUE");
    });

    it("shows the debug information", () => {
      expect(userAgent).not.toBeNull();
      expect(endpoint).not.toBeNull();
      expect(os).not.toBeNull();
      expect(appKey).not.toBeNull();
    });

    describe("and URL endpoint exception is thrown", () => {
      describe("and exception is instance of Error", () => {
        beforeEach(() => {
          global.URL = null;
          console.error = () => {};
          const { queryByText } = renderDebugInfo();
          endpoint = queryByText(URL_ERROR_INSTANCE);
        });

        it("shows URL endpoint exception error", () => {
          expect(endpoint).not.toBeNull();
        });
      });
      describe("and exception is not an instance of Error", () => {
        beforeEach(() => {
          global.URL = jest.fn();
          global.URL.mockImplementation(() => {
            throw URL_NON_ERROR_INSTANCE;
          });
          console.error = () => {};
          const { queryByText } = renderDebugInfo();
          endpoint = queryByText(URL_NON_ERROR_INSTANCE);
        });

        it("shows URL endpoint exception error", () => {
          expect(endpoint).not.toBeNull();
        });
      });
    });
  });
});
