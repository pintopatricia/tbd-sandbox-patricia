import { HttpResponseError } from "@flutter-global/uki-channels-http-clients";
import {
  isCougarUnauthorizedError,
  isHttpForbiddenError,
  isHttpResponseError,
  isHttpUnauthorizedError,
} from "./error-parsing";

describe("error-parsing helper", () => {
  beforeEach(jest.clearAllMocks);

  describe("isHttpUnauthorizedError", () => {
    describe("when error has HTTP Status Code", () => {
      describe("when HTTP Status Code is 401", () => {
        it("should return true", () => {
          const error = Error("StatusCode=401");

          expect(isHttpUnauthorizedError(error)).toBe(true);
        });
      });

      describe("when HTTP Status Code is not 401", () => {
        it("should return false", () => {
          const error = Error("StatusCode=400");

          expect(isHttpUnauthorizedError(error)).toBe(false);
        });
      });

      describe("when HTTP Status Code is 403", () => {
        it("should return true", () => {
          const error = Error("StatusCode=403");

          expect(isHttpForbiddenError(error)).toBe(true);
        });
      });

      describe("when HTTP Status Code is not 403", () => {
        it("should return false", () => {
          const error = Error("StatusCode=400");

          expect(isHttpForbiddenError(error)).toBe(false);
        });
      });
    });

    describe("when error does not have HTTP Status Code", () => {
      it("should return false", () => {
        const error = Error("Error");

        expect(isHttpUnauthorizedError(error)).toBe(false);
      });
    });
  });

  describe("isCougarUnauthorizedError", () => {
    describe("when FaultCode is Client", () => {
      describe("and FaultString is SecurityException", () => {
        it("should return true", () => {
          const error = Error("FaultCode=Client, FaultString=DSC-0015");

          expect(isCougarUnauthorizedError(error)).toBe(true);
        });
      });

      describe("and FaultString is InvalidCredentials", () => {
        it("should return true", () => {
          const error = Error("FaultCode=Client, FaultString=DSC-0035");

          expect(isCougarUnauthorizedError(error)).toBe(true);
        });
      });

      describe("and FaultString is UnrecognisedCredentials", () => {
        it("should return true", () => {
          const error = Error("FaultCode=Client, FaultString=DSC-0036");

          expect(isCougarUnauthorizedError(error)).toBe(true);
        });
      });

      describe("and FaultString is of other type", () => {
        it("should return false", () => {
          const error = Error("FaultCode=Client, FaultString=DSC-0099");

          expect(isCougarUnauthorizedError(error)).toBe(false);
        });
      });
    });

    describe("when FaultCode is not Client", () => {
      it("should return false", () => {
        const error = Error("FaultCode=Server, FaultString=DSC-0015");

        expect(isCougarUnauthorizedError(error)).toBe(false);
      });
    });
  });

  describe("isHttpResponseError", () => {
    describe("when error is not of type HttpResponseError", () => {
      it("should return false", () => {
        const error = Error("FaultCode=Server, FaultString=DSC-0015");

        expect(isHttpResponseError(error)).toBe(false);
      });
    });

    describe("when error is of type HttpResponseError", () => {
      it("should return true", () => {
        const error = new HttpResponseError("url", "method", "query", "body", "httpStatusCode");

        expect(isHttpResponseError(error)).toBe(true);
      });
    });
  });
});
