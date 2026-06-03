import {
  FETCH_WEB_MESSAGES,
  FETCH_WEB_MESSAGES_SUCCESS,
  READ_WEB_MESSAGE,
  READ_WEB_MESSAGE_SUCCESS,
  READ_WEB_MESSAGE_FAILURE,
  WEB_MESSAGES_MODULE_LOADED,
} from "../actions/catalogue";
import catalogueService from "../services/catalogue/catalogue-service";
import setupSagaMocks from "../saga-jest-setup";

jest.mock("../services/catalogue/catalogue-service", () => ({
  getWebMessages: jest.fn(() => "webMessages"),
  readWebMessage: jest.fn(),
}));

jest.mock("../state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({
    loggedIn: true,
  })),
}));

const OVERRIDEN_THROTTLES = {
  throttlesOn: ["1", "2"],
  throttlesOff: ["3"],
};

jest.mock("../state/entities/throttles/throttles-selectors", () => ({
  getOverridenThrottles: jest.fn(() => OVERRIDEN_THROTTLES),
}));

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ webMessagesRequestSaga: saga } = require("./web-messages-saga"));
  });
  const setupSaga = setupSagaMocks(saga);

  setupSaga.getState.mockReturnValue({ entities: {} });

  return setupSaga;
}

beforeEach(() => {
  jest.clearAllMocks();
});

const fetchWebMessagesAction = {
  type: FETCH_WEB_MESSAGES,
  payload: {
    postLoginSession: true,
  },
};

const readWebMessageAction = {
  type: READ_WEB_MESSAGE,
  payload: {
    customerMessageId: "ppb:tbd:modalElement:webMessage:100",
  },
};

describe("WebMessages saga", () => {
  it('should dispatch a "WEB_MESSAGES_MODULE_LOADED"', () => {
    const { stopSaga, dispatch } = setup();

    expect(dispatch).toHaveBeenCalledWith({ type: WEB_MESSAGES_MODULE_LOADED });

    stopSaga();
  });

  describe("when FETCH_WEB_MESSAGES is dispatched", () => {
    it("should call catalogue service", async () => {
      const { putActions, stopSaga } = setup();

      await putActions([fetchWebMessagesAction]);

      expect(catalogueService.getWebMessages).toHaveBeenCalled();

      stopSaga();
    });

    it('should dispatch a "FETCH_WEB_MESSAGES_SUCCESS" on success', async () => {
      const { putActions, stopSaga, dispatch } = setup();

      await putActions([fetchWebMessagesAction]);

      expect(dispatch).toHaveBeenCalledWith({
        type: FETCH_WEB_MESSAGES_SUCCESS,
        payload: "webMessages",
      });

      stopSaga();
    });

    it('should not dispatch a "FETCH_WEB_MESSAGES_SUCCESS" on success when payload is null', async () => {
      catalogueService.getWebMessages.mockReturnValue(null);

      const { putActions, stopSaga, dispatch } = setup();

      dispatch.mockReset();

      await putActions([fetchWebMessagesAction]);

      expect(dispatch).not.toHaveBeenCalled();

      stopSaga();
    });
  });

  describe("when READ_WEB_MESSAGE is dispatched", () => {
    it("should call catalogue service with correct params", async () => {
      const { putActions, stopSaga } = setup();

      await putActions([readWebMessageAction]);

      expect(catalogueService.readWebMessage).toHaveBeenCalledWith(100, OVERRIDEN_THROTTLES);

      stopSaga();
    });

    it('should dispatch a "READ_WEB_MESSAGE_SUCCESS" on success', async () => {
      const { putActions, stopSaga, dispatch } = setup();

      await putActions([readWebMessageAction]);

      expect(dispatch).toHaveBeenCalledWith({
        type: READ_WEB_MESSAGE_SUCCESS,
      });

      stopSaga();
    });

    it('should dispatch a "READ_WEB_MESSAGE_FAILURE" on failure', async () => {
      catalogueService.readWebMessage.mockImplementationOnce(() => {
        throw new Error("Error message");
      });

      const { putActions, dispatch, stopSaga } = setup();

      await putActions([readWebMessageAction]);

      expect(dispatch).toHaveBeenCalledWith({
        type: READ_WEB_MESSAGE_FAILURE,
      });

      stopSaga();
    });
  });
});
