import setupSagaMocks from "../saga-jest-setup";
import bannersService from "../services/max/banners-service";

jest.mock("../services/max/banners-service");

const setup = () => {
  let saga;
  jest.isolateModules(() => {
    ({ bannerActionRequestSaga: saga } = require("./account-banners-saga"));
  });
  return setupSagaMocks(saga);
};

describe("accountBannersSaga", () => {
  beforeEach(jest.clearAllMocks);

  const accountBannersAction = {
    type: "BANNER_ACTION_REQUEST",
    payload: {
      urn: "urn",
      index: 0,
      bannerAction: {
        data: "data",
        action: "action",
        actionFinalize: {
          onErrorBanner: "onErrorBanner",
        },
      },
    },
  };

  describe("when BANNER_ACTION_REQUEST is dispatched", () => {
    it("should call bannersService", async () => {
      const { putActions, dispatch, stopSaga } = setup();

      await putActions([accountBannersAction]);

      expect(bannersService.handleBannerAction).toHaveBeenCalledWith("data", "action");
      expect(dispatch).toHaveBeenCalledWith({
        payload: {
          index: 0,
          urn: "urn",
        },
        type: "UPDATE_CURRENT_BANNER",
      });

      stopSaga();
    });

    describe("and bannerAction has no data", () => {
      it("should not call bannersService", async () => {
        const { putActions, dispatch, stopSaga } = setup();
        const action = {
          type: "BANNER_ACTION_REQUEST",
          payload: {
            urn: "urn",
            index: 0,
            bannerAction: {
              action: "action",
            },
          },
        };

        await putActions([action]);

        expect(bannersService.handleBannerAction).not.toHaveBeenCalled();
        expect(dispatch).not.toHaveBeenCalled();

        stopSaga();
      });
    });

    describe("and bannerAction has no action", () => {
      it("should not call bannersService", async () => {
        const { putActions, dispatch, stopSaga } = setup();
        const action = {
          type: "BANNER_ACTION_REQUEST",
          payload: {
            urn: "urn",
            index: 0,
            bannerAction: {
              data: "data",
            },
          },
        };

        await putActions([action]);

        expect(bannersService.handleBannerAction).not.toHaveBeenCalled();
        expect(dispatch).not.toHaveBeenCalled();

        stopSaga();
      });
    });

    describe("when an error is thrown", () => {
      it("should dispatch SET_ERROR_BANNER", async () => {
        const { putActions, dispatch, stopSaga } = setup();

        bannersService.handleBannerAction.mockImplementationOnce(() => {
          throw new Error("Error message");
        });

        await putActions([accountBannersAction]);

        expect(dispatch).toHaveBeenCalledWith({
          type: "SET_ERROR_BANNER",
          payload: {
            urn: "urn",
            errorBanner: "onErrorBanner",
          },
        });

        stopSaga();
      });

      describe("and onErrorBanner is not defined", () => {
        it("should not dispatch anything", async () => {
          const { putActions, dispatch, stopSaga } = setup();
          const action = {
            type: "BANNER_ACTION_REQUEST",
            payload: {
              urn: "urn",
              index: 0,
              bannerAction: {
                data: "data",
                action: "action",
              },
            },
          };

          bannersService.handleBannerAction.mockImplementationOnce(() => {
            throw new Error("Error message");
          });

          await putActions([action]);

          expect(dispatch).not.toHaveBeenCalled();

          stopSaga();
        });
      });
    });
  });
});
