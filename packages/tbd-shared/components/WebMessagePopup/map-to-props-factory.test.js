import { FETCH_WEB_MESSAGES, READ_WEB_MESSAGE } from "@ppb/tbd-store/actions/catalogue";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const STATE = {
  entities: {
    webMessages: {
      webMessagesList: [
        {
          urn: "mockedUrn",
          title: "mockedTitle",
          templateHeight: "mockedTemplateHeight",
          templateWidth: "mockedTemplateWidth",
          templateUrl: "mockedTemplateUrl",
        },
      ],
      currentWebMessageIndex: 0,
    },
    userdetails: {
      loggedIn: true,
    },
  },
};

jest.mock("../../config/endpoints", () => ({
  getEndpoint: jest.fn(() => "https://www.example.com/"),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({ loggedIn: true })),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

describe("makeMapStateToProps", () => {
  it("should map state to props", () => {
    const mapStateToProps = makeMapStateToProps();
    const props = mapStateToProps(STATE);

    expect(props).toEqual({
      webMessage: {
        urn: "mockedUrn",
        title: "mockedTitle",
        templateHeight: "mockedTemplateHeight",
        templateWidth: "mockedTemplateWidth",
        templateUrl: "https://www.example.com/mockedTemplateUrl",
      },
      loggedIn: true,
    });
  });

  describe("and `getUserDetails` throws", () => {
    const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

    beforeEach(() => {
      getUserDetails.mockImplementationOnce(() => {
        throw new Error(GET_USER_DETAILS_ERROR);
      });
    });

    it("should call console.error with the error thrown by `getUserDetails`", () => {
      makeMapStateToProps()(STATE);

      expect(global.console.error).toHaveBeenCalledWith(new Error(GET_USER_DETAILS_ERROR));
    });

    it("should return an empty object if `getUserDetails` throws", () => {
      const props = makeMapStateToProps()(STATE);

      expect(props).toEqual({});
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(() => {
    // eslint-disable-next-line no-restricted-syntax
    window.__POST_LOGIN_SESSION__ = true;
  });
  describe("on dispatchFetchWebMessages trigger", () => {
    it("should dispatch dispatchFetchWebMessages", () => {
      const { dispatchFetchWebMessages } = mapDispatchToProps;

      expect(dispatchFetchWebMessages(true)).toEqual({
        type: FETCH_WEB_MESSAGES,
        payload: {
          postLoginSession: true,
        },
      });
    });
  });

  describe("on dispatchReadWebMessage trigger", () => {
    it("should dispatch dispatchReadWebMessage", () => {
      const { dispatchReadWebMessage } = mapDispatchToProps;

      expect(dispatchReadWebMessage(100)).toEqual({
        type: READ_WEB_MESSAGE,
        payload: {
          customerMessageId: 100,
        },
      });
    });
  });
});
