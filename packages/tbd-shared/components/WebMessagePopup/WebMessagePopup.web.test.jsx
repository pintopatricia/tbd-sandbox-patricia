import { render } from "@testing-library/react";
import { Modal } from "@ppb/the-wall-web";
import WebMessagePopup from "./WebMessagePopup.web";

jest.mock("@ppb/the-wall-web", () => ({
  Modal: jest.fn(() => <modal-mock />),
}));

const DISPATCH_FETCH_WEB_MESSAGES = jest.fn();
const DISPATCH_READ_WEB_MESSAGE = jest.fn();

function renderWebMessagePopup(props) {
  return render(<WebMessagePopup {...props} />);
}

describe("WebMessagePopup component", () => {
  describe("when initializing", () => {
    let stateProps;
    beforeEach(() => {
      jest.clearAllMocks();
      stateProps = {
        webMessage: {
          urn: "mockedUrn1",
          title: "mockedTitle1",
          templateHeight: "mockedTemplateHeight1",
          templateWidth: "mockedTemplateWidth1",
          templateUrl: "mockedTemplateUrl1",
        },
        dispatchFetchWebMessages: DISPATCH_FETCH_WEB_MESSAGES,
        dispatchReadWebMessage: DISPATCH_READ_WEB_MESSAGE,
      };
      renderWebMessagePopup(stateProps);
    });

    it("should render Modal", () => {
      expect(Modal).toHaveBeenCalledTimes(1);
    });

    it("should dispatch a fetchWebMessages on useEffect hook", () => {
      expect(DISPATCH_FETCH_WEB_MESSAGES).toHaveBeenCalledTimes(1);
    });
  });
});
