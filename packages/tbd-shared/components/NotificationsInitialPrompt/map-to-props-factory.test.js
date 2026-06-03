import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getUserDetails = jest.fn(() => ({ loggedIn: true }));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

describe("MapToPropsFactory - NotificationsInitialPrompt", () => {
  describe("mapStateToProps", () => {
    let mapStateToProps;

    beforeEach(() => {
      mapStateToProps = makeMapStateToProps();
    });

    describe("with userdetails", () => {
      describe("and the throttle enabled", () => {
        it("should return the correct props", () => {
          const props = mapStateToProps({
            entities: {
              userdetails: { loggedIn: true },
            },
          });

          expect(props).toStrictEqual({
            acceptLabel: "I18N.PROMPT.FIRST_LOGIN_ACCEPT",
            descriptionLabel: "I18N.PROMPT.FIRST_LOGIN_DESCRIPTION",
            isLoggedIn: true,
            rejectLabel: "I18N.PROMPT.FIRST_LOGIN_REJECT",
            titleLabel: "I18N.PROMPT.FIRST_LOGIN_LABEL",
          });
        });
      });
    });

    describe("when `getUserDetails` throws", () => {
      const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

      beforeEach(() => {
        getUserDetails.mockImplementationOnce(() => {
          throw new Error(GET_USER_DETAILS_ERROR);
        });
      });

      it("should call console.error with the error thrown by `getUserDetails`", () => {
        mapStateToProps();
        expect(global.console.error).toHaveBeenCalledWith(new Error(GET_USER_DETAILS_ERROR));
      });

      it("should return an empty object", () => {
        expect(mapStateToProps()).toEqual({});
      });
    });
  });

  describe("mapDispatchToProps", () => {
    describe("dispatchRegisterDevice", () => {
      it("should return the correct action", () => {
        expect(mapDispatchToProps.dispatchRegisterDevice("applicationTypeId", "deviceId", {})).toEqual({
          type: "PN_REGISTER_DEVICE",
          payload: {
            applicationTypeId: "applicationTypeId",
            deviceId: "deviceId",
            deviceOptions: {},
          },
        });
      });
    });

    describe("dispatchNativePromptShown", () => {
      it("should return the correct action", () => {
        expect(mapDispatchToProps.dispatchNativePromptShown()).toEqual({
          type: "PN_NATIVE_PROMPT_SHOWN_EVENT",
        });
      });
    });

    describe("dispatchPushNotificationEvent", () => {
      it("should return the correct action", () => {
        expect(mapDispatchToProps.dispatchPushNotificationEvent("label", "module")).toEqual({
          type: "PN_INTERACTION_EVENT",
          payload: {
            module: "module",
            label: "label",
          },
        });
      });
    });
  });
});
