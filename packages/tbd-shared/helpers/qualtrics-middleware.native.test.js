import Qualtrics from "react-native-qualtrics/src";
import { QUALTRICS__SEND_NEW_PAGE_NAMED } from "@ppb/tbd-store/actions/qualtrics";
import { NETWORK__FETCH_APP_CONTEXT_SUCCESS } from "@ppb/tbd-store/actions/app-context";
import { qualtricsMiddleware } from "./qualtrics-middleware.native";

jest.mock("react-native-qualtrics/src", () => ({
  initializeProjectWithExtRefId: jest.fn(),
  registerViewVisit: jest.fn(),
  evaluateProject: jest.fn(),
  displayTarget: jest.fn(),
  resetViewCounter: jest.fn(),
  setLastDisplayTimeForIntercept: jest.fn(),
}));

jest.mock("../config/app-configuration.native", () => ({
  appConfig: {
    QUALTRICS_KEYS: {
      brand: "brandName",
      project: "projectId",
    },
  },
}));

const STATE_MOCK = {
  entities: {
    throttles: {
      SBG_QUALTRICS: {
        isActive: true,
      },
    },
  },
};

function setupStoreFn(dispatchSpy = jest.fn(), getStateSpy = jest.fn(() => STATE_MOCK)) {
  return {
    dispatch: dispatchSpy,
    getState: getStateSpy,
  };
}

describe("qualtrics middleware", () => {
  let nextSpy;

  const sendPageAction = {
    type: QUALTRICS__SEND_NEW_PAGE_NAMED,
    payload: {
      pageName: "Test",
    },
  };
  const initAction = {
    type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
    payload: {
      initialState: {
        entities: {
          userdetails: {
            accountId: "123456",
            loggedIn: true,
          },
        },
      },
    },
  };
  beforeEach(() => {
    jest.resetAllMocks();

    nextSpy = jest.fn();
  });

  describe("when qualtrics is not initialized yet", () => {
    describe("when action type is QUALTRICS__SEND_NEW_PAGE_NAMED", () => {
      it("should not register view with name", async () => {
        await qualtricsMiddleware()(setupStoreFn())(nextSpy)(sendPageAction);
        expect(Qualtrics.registerViewVisit).not.toHaveBeenCalled();
      });
    });

    describe("when action type is NETWORK__FETCH_APP_CONTEXT_SUCCESS", () => {
      describe("when user is not logged in", () => {
        const notLoggedIn = {
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            initialState: {
              entities: {
                userdetails: {
                  accountId: "123456",
                  loggedIn: false,
                },
              },
            },
          },
        };

        it("should not initialize qualtrics", async () => {
          await qualtricsMiddleware()(setupStoreFn())(nextSpy)(notLoggedIn);
          expect(Qualtrics.initializeProjectWithExtRefId).not.toHaveBeenCalled();
        });
      });

      describe("init qualtrics response passed first call", () => {
        const initQualtricsMiddleware = qualtricsMiddleware();

        it("should not call initialize qualtrics if throttle is not active", async () => {
          const STATE_TROTTLE_MOCK = {
            entities: {
              throttles: {
                SBG_QUALTRICS: {
                  isActive: false,
                },
              },
            },
          };
          const stateSpy = jest.fn(() => STATE_TROTTLE_MOCK);
          await initQualtricsMiddleware(setupStoreFn(jest.fn(), stateSpy))(nextSpy)(initAction);
          expect(Qualtrics.initializeProjectWithExtRefId).not.toHaveBeenCalled();
        });

        it("should call initialize qualtrics with success response", async () => {
          await initQualtricsMiddleware(setupStoreFn())(nextSpy)(initAction);
          expect(Qualtrics.initializeProjectWithExtRefId).toHaveBeenCalledTimes(1);
          expect(Qualtrics.initializeProjectWithExtRefId).toHaveBeenCalledWith(
            "brandName",
            "projectId",
            "123456",
            expect.any(Function),
          );
        });

        describe("when user is logged in and qualtrics passed", () => {
          const response = {
            SI_9MobMkcKduariES: {
              message: "Qualtrics: Intercept has been loaded",
              passed: true,
            },
          };

          beforeAll(async () => {
            await initQualtricsMiddleware(setupStoreFn())(nextSpy)(initAction);

            await Qualtrics.initializeProjectWithExtRefId.mock.calls[0][3](response);
          });

          it("should not initialize qualtrics second time", async () => {
            await initQualtricsMiddleware(setupStoreFn())(nextSpy)(initAction);
            expect(Qualtrics.initializeProjectWithExtRefId).not.toHaveBeenCalled();
          });
        });
      });

      describe("init qualtrics response failed first call", () => {
        it("should call initialize qualtrics with failed response", async () => {
          await qualtricsMiddleware()(setupStoreFn())(nextSpy)(initAction);
          expect(Qualtrics.initializeProjectWithExtRefId).toHaveBeenCalledTimes(1);
          expect(Qualtrics.initializeProjectWithExtRefId).toHaveBeenCalledWith(
            "brandName",
            "projectId",
            "123456",
            expect.any(Function),
          );
        });

        describe("when user is logged in and qualtrics failed to init first call", () => {
          const response = {
            SI_9MobMkcKduariES: {
              message: "Qualtrics: Intercept has been loaded",
              passed: false,
            },
          };

          beforeAll(async () => {
            await qualtricsMiddleware()(setupStoreFn())(nextSpy)(initAction);

            await Qualtrics.initializeProjectWithExtRefId.mock.calls[0][3](response);
          });

          it("should initialize qualtrics on second call", async () => {
            await qualtricsMiddleware()(setupStoreFn())(nextSpy)(initAction);
            expect(Qualtrics.initializeProjectWithExtRefId).toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe("when qualtrics is initialized", () => {
    const initQualtricsMiddleware = qualtricsMiddleware();
    const response = {
      SI_9MobMkcKduariES: {
        message: "Qualtrics: Intercept has been loaded",
        passed: true,
      },
    };

    it("should call initialize qualtrics with success response", async () => {
      await initQualtricsMiddleware(setupStoreFn())(nextSpy)(initAction);
      await Qualtrics.initializeProjectWithExtRefId.mock.calls[0][3](response);
      expect(Qualtrics.initializeProjectWithExtRefId).toHaveBeenCalledTimes(1);
    });

    describe("when user is logged in and qualtrics passed", () => {
      describe("when action type is QUALTRICS__SEND_NEW_PAGE_NAMED", () => {
        it("should not register view with name if throttle is not active", async () => {
          const STATE_TROTTLE_MOCK = {
            entities: {
              throttles: {
                SBG_QUALTRICS: {
                  isActive: false,
                },
              },
            },
          };
          const stateSpy = jest.fn(() => STATE_TROTTLE_MOCK);
          await initQualtricsMiddleware(setupStoreFn(jest.fn(), stateSpy))(nextSpy)(sendPageAction);
          expect(Qualtrics.registerViewVisit).not.toHaveBeenCalled();
        });

        it("should register view with name", async () => {
          await initQualtricsMiddleware(setupStoreFn())(nextSpy)(sendPageAction);
          expect(Qualtrics.registerViewVisit).toHaveBeenCalled();
        });

        it("should evaluate project", async () => {
          await initQualtricsMiddleware(setupStoreFn())(nextSpy)(sendPageAction);
          expect(Qualtrics.evaluateProject).toHaveBeenCalled();
        });

        describe("when evaluateProject passed", () => {
          const evaluateResponse = {
            SI_9MobMkcKduariES: {
              message: "Qualtrics: Evaluated Projected",
              surveyUrl: "survey_url",
              passed: true,
              recordImpression: jest.fn(),
            },
          };

          it("should display target", async () => {
            await initQualtricsMiddleware(setupStoreFn())(nextSpy)(sendPageAction);

            await Qualtrics.evaluateProject.mock.calls[0][0](evaluateResponse);
            expect(Qualtrics.displayTarget).toHaveBeenCalled();
          });

          it("should reset view counter", async () => {
            await initQualtricsMiddleware(setupStoreFn())(nextSpy)(sendPageAction);

            await Qualtrics.evaluateProject.mock.calls[0][0](evaluateResponse);
            expect(Qualtrics.resetViewCounter).toHaveBeenCalled();
          });

          it("should set last display time for intercept", async () => {
            await initQualtricsMiddleware(setupStoreFn())(nextSpy)(sendPageAction);

            await Qualtrics.evaluateProject.mock.calls[0][0](evaluateResponse);
            expect(Qualtrics.setLastDisplayTimeForIntercept).toHaveBeenCalled();
          });
        });

        describe("when evaluateProject not passed", () => {
          const evaluateResponse = {
            SI_9MobMkcKduariES: {
              message: "Qualtrics: Evaluated Projected",
              surveyUrl: "survey_url",
              passed: false,
              recordImpression: jest.fn(),
            },
          };

          it("should not display target", async () => {
            await initQualtricsMiddleware(setupStoreFn())(nextSpy)(sendPageAction);

            await Qualtrics.evaluateProject.mock.calls[0][0](evaluateResponse);
            expect(Qualtrics.displayTarget).not.toHaveBeenCalled();
          });

          it("should not reset view counter", async () => {
            await initQualtricsMiddleware(setupStoreFn())(nextSpy)(sendPageAction);

            await Qualtrics.evaluateProject.mock.calls[0][0](evaluateResponse);
            expect(Qualtrics.resetViewCounter).not.toHaveBeenCalled();
          });

          it("should not set last display time for intercept", async () => {
            await initQualtricsMiddleware(setupStoreFn())(nextSpy)(sendPageAction);

            await Qualtrics.evaluateProject.mock.calls[0][0](evaluateResponse);
            expect(Qualtrics.setLastDisplayTimeForIntercept).not.toHaveBeenCalled();
          });
        });
      });
    });
  });
});
