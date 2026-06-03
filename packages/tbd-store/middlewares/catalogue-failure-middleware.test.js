import { HttpResponseError } from "@flutter-global/uki-channels-http-clients";
import { catalogueFailureMiddleware } from "./catalogue-failure-middleware";

describe("catalogueFailureMiddleware", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  afterEach(() => {
    console.error.mockClear();
  });

  describe("when FETCH_CATALOGUE_FAILURE is intercepted", () => {
    describe("and the http error is a 429", () => {
      it("should dispatch FETCH_CATALOGUE_RATE_LIMIT_FAILURE, log error and call next(action)", () => {
        const nextMock = jest.fn();
        const dispatch = jest.fn();
        const getState = jest.fn();
        const action = {
          type: "FETCH_CATALOGUE_FAILURE",
          payload: { error: new HttpResponseError("url", "method", "query", "body", 429) },
        };

        getState.mockReturnValue({ entities: { userdetails: { loggedIn: true, accountId: 12345 } } });

        catalogueFailureMiddleware({ dispatch, getState })(nextMock)(action);

        expect(dispatch).toHaveBeenCalledWith({
          type: "FETCH_CATALOGUE_RATE_LIMIT_FAILURE",
          payload: { loggedIn: true },
        });
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith("Rate limit achieved for user 12345");
        expect(nextMock).toHaveBeenCalledWith(action);
        expect(nextMock).toHaveBeenCalledTimes(1);
      });
    });

    describe("and the error is not 429", () => {
      it("should call next middleware with unmodified action", () => {
        const nextMock = jest.fn();
        const dispatch = jest.fn();
        const getState = jest.fn();

        const action = {
          type: "FETCH_CATALOGUE_FAILURE",
          payload: { error: new HttpResponseError("url", "method", "query", "body", 500) },
        };

        catalogueFailureMiddleware({ dispatch, getState })(nextMock)(action);

        expect(dispatch).not.toHaveBeenCalled();
        expect(console.error).not.toHaveBeenCalled();
        expect(nextMock).toHaveBeenCalledWith(action);
        expect(nextMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
