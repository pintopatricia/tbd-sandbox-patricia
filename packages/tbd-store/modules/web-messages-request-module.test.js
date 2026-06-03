import { getWebMessagesRequestModule } from "./web-messages-request-module";

jest.mock("../middlewares/web-messages-saga", () => ({
  webMessagesRequestSaga: "webMessagesRequestSaga",
}));

describe("getWebMessagesRequestModule", () => {
  it("should return the WebMessagesRequest module", () => {
    expect(getWebMessagesRequestModule()).toEqual({
      id: "web-messages-request-module",
      middlewares: [],
      sagas: ["webMessagesRequestSaga"],
      initialActions: [],
    });
  });
});
