import webMessagesReducer from "./web-messages-reducer";
import {
  FETCH_WEB_MESSAGES_SUCCESS,
  READ_WEB_MESSAGE_SUCCESS,
  READ_WEB_MESSAGE_FAILURE,
  WEB_MESSAGES_MODULE_LOADED,
} from "../../../actions/catalogue";

describe("web messages reducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = webMessagesReducer(undefined, {});

      expect(state).toEqual({ currentWebMessageIndex: null, webMessagesList: null, isModuleLoaded: false });
    });
  });

  describe("when action type is FETCH_WEB_MESSAGES_SUCCESS", () => {
    it("must return the state without the webMessagesList and currentWebMessageIndex", () => {
      const state = webMessagesReducer(
        {},
        {
          type: WEB_MESSAGES_MODULE_LOADED,
        },
      );

      expect(state).toEqual({
        isModuleLoaded: true,
      });
    });

    it("must return the state populated with the webMessagesList and currentWebMessageIndex", () => {
      const state = webMessagesReducer(
        {},
        {
          type: FETCH_WEB_MESSAGES_SUCCESS,
          payload: {
            MarketingMessages: [
              {
                urn: "mockedUrn",
                content: {
                  title: "mockedTitle",
                  templateHeight: "mockedTemplateHeight",
                  templateWidth: "mockedTemplateWidth",
                  templateUrl: "mockedTemplateUrl",
                },
              },
            ],
          },
        },
      );

      expect(state).toEqual({
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
      });
    });
  });

  describe("when action type is READ_WEB_MESSAGE_SUCCESS", () => {
    it("must return the state populated with the next currentWebMessageIndex", () => {
      const state = webMessagesReducer(
        {
          webMessagesList: [
            {
              urn: "firstMockedUrn",
              title: "firstMockedTitle",
              templateHeight: "firstMockedTemplateHeight",
              templateWidth: "firstMockedTemplateWidth",
              templateUrl: "firstMockedTemplateUrl",
            },
            {
              urn: "secondMockedUrn",
              title: "secondMockedTitle",
              templateHeight: "secondMockedTemplateHeight",
              templateWidth: "secondMockedTemplateWidth",
              templateUrl: "secondMockedTemplateUrl",
            },
          ],
          currentWebMessageIndex: 0,
        },
        {
          type: READ_WEB_MESSAGE_SUCCESS,
        },
      );

      expect(state).toEqual({
        webMessagesList: [
          {
            urn: "firstMockedUrn",
            title: "firstMockedTitle",
            templateHeight: "firstMockedTemplateHeight",
            templateWidth: "firstMockedTemplateWidth",
            templateUrl: "firstMockedTemplateUrl",
          },
          {
            urn: "secondMockedUrn",
            title: "secondMockedTitle",
            templateHeight: "secondMockedTemplateHeight",
            templateWidth: "secondMockedTemplateWidth",
            templateUrl: "secondMockedTemplateUrl",
          },
        ],
        currentWebMessageIndex: 1,
      });
    });
  });

  describe("when action type is READ_WEB_MESSAGE_FAILURE", () => {
    it("must return the state populated with the currentWebMessageIndex as null", () => {
      const state = webMessagesReducer(
        {
          webMessagesList: [
            {
              urn: "firstMockedUrn",
              title: "firstMockedTitle",
              templateHeight: "firstMockedTemplateHeight",
              templateWidth: "firstMockedTemplateWidth",
              templateUrl: "firstMockedTemplateUrl",
            },
            {
              urn: "secondMockedUrn",
              title: "secondMockedTitle",
              templateHeight: "secondMockedTemplateHeight",
              templateWidth: "secondMockedTemplateWidth",
              templateUrl: "secondMockedTemplateUrl",
            },
          ],
          currentWebMessageIndex: 0,
        },
        {
          type: READ_WEB_MESSAGE_FAILURE,
        },
      );

      expect(state).toEqual({
        webMessagesList: [
          {
            urn: "firstMockedUrn",
            title: "firstMockedTitle",
            templateHeight: "firstMockedTemplateHeight",
            templateWidth: "firstMockedTemplateWidth",
            templateUrl: "firstMockedTemplateUrl",
          },
          {
            urn: "secondMockedUrn",
            title: "secondMockedTitle",
            templateHeight: "secondMockedTemplateHeight",
            templateWidth: "secondMockedTemplateWidth",
            templateUrl: "secondMockedTemplateUrl",
          },
        ],
        currentWebMessageIndex: null,
      });
    });
  });
});
