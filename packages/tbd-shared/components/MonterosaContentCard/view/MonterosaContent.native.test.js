import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import { EmptyState } from "@ppb/the-wall-native";

jest.mock("@react-native-firebase/analytics", () => ({
  firebase: {
    analytics: jest.fn(() => ({
      logEvent: jest.fn(),
    })),
  },
}));

jest.mock("react-native-onetrust-cmp", () => ({
  showPreferenceCenterUI: jest.fn(),
  getConsentStatusForCategory: jest.fn().mockResolvedValue(1),
}));

jest.mock("@ppb/the-wall-native", () => ({
  EmptyState: jest.fn(({ props }) => <empty-state-mock {...props} />),
}));

import { MonterosaSdkExperienceView, sendMessage } from "@monterosa-sdk/react-native";
import { useSelector } from "react-redux";
import MonterosaContent from "./MonterosaContent.native";
import useMonterosaContentVMFn from "../viewmodel/MonterosaContent.viewmodel";
import MonterosaContentPlaceholder from "./MonterosaContentPlaceholder.native";
import { showPreferenceCenter } from "../../../cookie-consent/cookie-consent.native";
import { MiniBanner } from "../../MiniBanner/MiniBanner.native";

jest.mock("../viewmodel/MonterosaContent.viewmodel", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("./MonterosaContentPlaceholder.native", () => jest.fn(() => <monterosa-content-placeholder-mock />));
jest.mock("@monterosa-sdk/react-native", () => ({
  MonterosaSdkExperienceView: jest.fn(() => (
    <monterosa-sdk-experience-view-mock testID={"monterosa-experience-container"} />
  )),
  sendMessage: jest.fn(),
}));
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));
jest.mock("@ppb/tbd-store/helpers/cookie-consent", () => ({
  getCookieConsentCategories: jest.fn(() => ({ PERFORMANCE: "C0002" })),
}));
jest.mock("@ppb/tbd-store/state/cookie-consent/cookie-consent-selectors", () => ({
  createIsCookieConsentCategoryActiveSelector: jest.fn(
    () => (cookieConsent, category) => cookieConsent?.activeCategories?.includes(category),
  ),
}));
jest.mock("../../../cookie-consent/cookie-consent.native", () => ({
  showPreferenceCenter: jest.fn(),
}));
jest.mock("../../MiniBanner/MiniBanner.native", () => ({
  MiniBanner: jest.fn(() => <mini-banner-mock testID="mini-banner-mock" />),
}));

const URN = "ppb:tbd:card:monterosaContent:1";
const emptyLabelTranslations = {
  title: "I18N.REDIRECT404.TITLE",
  message: "I18N.REDIRECT404.SUBTITLE",
  consentTitle: "I18N.MONTEROSA.COOKIE.TITLE",
  consentMessage: "I18N.MONTEROSA.COOKIE.DESCRIPTION",
  consentLink: "I18N.MONTEROSA.COOKIE.LINK",
};

function renderComponent(
  called = true,
  loading = false,
  vmData = null,
  hasConsent = true,
  onAddSelectionsToBetslip = jest.fn(),
) {
  useMonterosaContentVMFn.mockReturnValue({
    called,
    loading,
    vm: {
      data: vmData || {
        urn: URN,
        host: "host_urn",
        oddsDisplayFormat: "FRACTIONAL",
        projectId: "project_id",
        monterosaEventId: "event_id",
      },
      hasConsent,
      emptyLabelTranslations,
      events: {
        onAddSelectionsToBetslip,
      },
    },
  });

  return {
    onAddSelectionsToBetslip,
    ...render(<MonterosaContent urn={URN} />),
  };
}

describe("MonterosaContent.native component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSelector.mockImplementation((selector) => selector({ cookieConsent: { activeCategories: ["C0002"] } }));
  });

  describe("when `useMonterosaContentVM` returns no data", () => {
    beforeEach(() => {
      useMonterosaContentVMFn.mockReturnValue({
        called: true,
        loading: false,
        vm: {
          data: null,
          hasConsent: true,
          emptyLabelTranslations,
          events: {},
        },
      });

      return render(<MonterosaContent urn={URN} />);
    });

    it("should call the EmptyState component", () => {
      expect(EmptyState).toHaveBeenCalledTimes(1);
      expect(EmptyState).toHaveBeenCalledWith(
        {
          hasImage: true,
          image: expect.any(Object),
          title: emptyLabelTranslations.title,
          message: emptyLabelTranslations.message,
        },
        undefined,
      );
    });

    describe("and the request is not called", () => {
      beforeEach(() => {
        renderComponent(true, true);
      });

      it("should return not call `MonterosaSdkExperienceView`", () => {
        expect(MonterosaSdkExperienceView).not.toHaveBeenCalled();
      });
    });

    describe("and the request is loading", () => {
      beforeEach(() => {
        renderComponent(true, true);
      });

      it("should call the placeholder", () => {
        expect(MonterosaContentPlaceholder).toHaveBeenCalledTimes(1);
        expect(MonterosaContentPlaceholder).toHaveBeenCalledWith({}, undefined);
      });
    });
  });

  describe("when `useMonterosaContentVM` returns data with consent", () => {
    let getByTestId;
    beforeEach(() => {
      ({ getByTestId } = renderComponent(true, false, null, true));
    });

    it("should render MonterosaSdkExperienceView", () => {
      expect(getByTestId("monterosa-experience-container")).toBeTruthy();
      expect(MonterosaSdkExperienceView).toHaveBeenCalled();
    });
  });

  describe("when cookie consent is not active", () => {
    it("should render MiniBanner with consent copy", () => {
      renderComponent(true, false, null, false);

      expect(MiniBanner).toHaveBeenCalledWith(
        {
          brandTitle: emptyLabelTranslations.consentTitle,
          title: emptyLabelTranslations.consentMessage,
          subText: emptyLabelTranslations.consentLink,
          onMiniBannerTap: expect.any(Function),
        },
        undefined,
      );
    });

    it("opens preference center when MiniBanner is pressed", () => {
      const { View, Pressable } = jest.requireActual("react-native");
      MiniBanner.mockImplementation(({ onMiniBannerTap }) => (
        <Pressable accessibilityRole="button" testID="mini-banner-interactive" onPress={onMiniBannerTap}>
          <View />
        </Pressable>
      ));
      const { getByTestId } = renderComponent(true, false, null, false);
      fireEvent.press(getByTestId("mini-banner-interactive"));
      expect(showPreferenceCenter).toHaveBeenCalledTimes(1);
    });
  });

  describe("when visible prop is false and consent is active", () => {
    it("should still render the experience view to preserve content across tab changes", () => {
      useMonterosaContentVMFn.mockReturnValue({
        called: true,
        loading: false,
        vm: {
          data: {
            urn: URN,
            host: "host_urn",
            projectId: "project_id",
            monterosaEventId: "event_id",
          },
          hasConsent: true,
          emptyLabelTranslations,
          events: {},
        },
      });

      render(<MonterosaContent urn={URN} visible={false} />);

      expect(MonterosaSdkExperienceView).toHaveBeenCalled();
    });
  });

  describe("when placeholder is loading", () => {
    it("should show placeholder component", () => {
      renderComponent(true, true, null);

      expect(MonterosaContentPlaceholder).toHaveBeenCalled();
    });
  });

  describe("onMessageReceived", () => {
    it("forwards monterosa betslip message payload to viewmodel callback", () => {
      const onAddSelectionsToBetslip = jest.fn();
      renderComponent(true, false, null, true, onAddSelectionsToBetslip);

      const onMessageReceived = MonterosaSdkExperienceView.mock.calls[0][0].onMessageReceived;
      const selectionsPayload = {
        selections: [{ marketId: "926.100", selectionId: 1 }],
      };

      act(() => {
        onMessageReceived({
          nativeEvent: {
            type: "experienceMessage",
            payload: {
              action: "mr_betslip_selections",
              payload: selectionsPayload,
            },
          },
        });
      });

      expect(onAddSelectionsToBetslip).toHaveBeenCalledWith(selectionsPayload);
    });

    it("updates min height when intrinsic size event is received", async () => {
      renderComponent(true, false, null, true);

      const onMessageReceived = MonterosaSdkExperienceView.mock.calls[0][0].onMessageReceived;

      act(() => {
        onMessageReceived({
          nativeEvent: {
            type: "experienceEvent",
            payload: {
              event: "didChangeIntrinsicSize",
              size: { height: 400 },
            },
          },
        });
      });

      await waitFor(() => {
        const latestProps = MonterosaSdkExperienceView.mock.calls.at(-1)[0];
        expect(latestProps.style.minHeight).toBe(400);
      });
    });

    it("sends user preferences when the experience becomes ready", () => {
      renderComponent(true, false, null, true);

      const onMessageReceived = MonterosaSdkExperienceView.mock.calls[0][0].onMessageReceived;

      act(() => {
        onMessageReceived({
          nativeEvent: {
            type: "experienceEvent",
            payload: {
              event: "didBecomeReady",
            },
          },
        });
      });

      expect(sendMessage).toHaveBeenCalledWith(expect.any(Object), "set_user_preferences", {
        oddsFormat: "FRACTIONAL",
      });
    });

    it("resends user preferences when odds format changes after ready", () => {
      const viewModel = {
        called: true,
        loading: false,
        vm: {
          data: {
            urn: URN,
            host: "host_urn",
            oddsDisplayFormat: "FRACTIONAL",
            projectId: "project_id",
            monterosaEventId: "event_id",
          },
          hasConsent: true,
          emptyLabelTranslations,
          events: {
            onAddSelectionsToBetslip: jest.fn(),
          },
        },
      };

      useMonterosaContentVMFn.mockReturnValue(viewModel);

      const { rerender } = render(<MonterosaContent urn={URN} />);
      const onMessageReceived = MonterosaSdkExperienceView.mock.calls[0][0].onMessageReceived;

      act(() => {
        onMessageReceived({
          nativeEvent: {
            type: "experienceEvent",
            payload: {
              event: "didBecomeReady",
            },
          },
        });
      });

      useMonterosaContentVMFn.mockReturnValue({
        ...viewModel,
        vm: {
          ...viewModel.vm,
          data: {
            ...viewModel.vm.data,
            oddsDisplayFormat: "DECIMAL",
          },
        },
      });

      rerender(<MonterosaContent urn={URN} />);

      expect(sendMessage).toHaveBeenLastCalledWith(expect.any(Object), "set_user_preferences", {
        oddsFormat: "DECIMAL",
      });
    });

    it("resends user preferences when experience key changes", () => {
      const viewModel = {
        called: true,
        loading: false,
        vm: {
          data: {
            urn: URN,
            host: "host_urn",
            oddsDisplayFormat: "FRACTIONAL",
            projectId: "project_id",
            monterosaEventId: "event_id",
          },
          hasConsent: true,
          emptyLabelTranslations,
          events: {
            onAddSelectionsToBetslip: jest.fn(),
          },
        },
      };

      useMonterosaContentVMFn.mockReturnValue(viewModel);

      const { rerender } = render(<MonterosaContent urn={URN} />);
      const firstOnMessageReceived = MonterosaSdkExperienceView.mock.calls.at(-1)[0].onMessageReceived;

      act(() => {
        firstOnMessageReceived({
          nativeEvent: {
            type: "experienceEvent",
            payload: {
              event: "didBecomeReady",
            },
          },
        });
      });

      useMonterosaContentVMFn.mockReturnValue({
        ...viewModel,
        vm: {
          ...viewModel.vm,
          data: {
            ...viewModel.vm.data,
            monterosaEventId: "event_id_2",
          },
        },
      });

      rerender(<MonterosaContent urn={URN} />);

      const secondOnMessageReceived = MonterosaSdkExperienceView.mock.calls.at(-1)[0].onMessageReceived;

      act(() => {
        secondOnMessageReceived({
          nativeEvent: {
            type: "experienceEvent",
            payload: {
              event: "didBecomeReady",
            },
          },
        });
      });

      expect(sendMessage).toHaveBeenNthCalledWith(1, expect.any(Object), "set_user_preferences", {
        oddsFormat: "FRACTIONAL",
      });
      expect(sendMessage).toHaveBeenNthCalledWith(2, expect.any(Object), "set_user_preferences", {
        oddsFormat: "FRACTIONAL",
      });
    });
  });
});
