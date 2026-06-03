import React from "react";
import { act, render } from "@testing-library/react";
import { embed, onMessage, onReady, sendMessage } from "@monterosa/sdk-launcher-kit";
import { EmptyState } from "@ppb/the-wall-web";
import { useSelector } from "react-redux";
import MonterosaContentCard from "./MonterosaContentCard.web";
import useMonterosaContentVMFn from "../viewmodel/MonterosaContent.viewmodel";
import MonterosaContentPlaceholder from "./MonterosaContentPlaceholder.web";

jest.mock("@monterosa/sdk-core", () => ({
  configure: jest.fn(() => ({ id: "sdk" })),
  destroy: jest.fn(),
}));
import { MiniBanner } from "../../MiniBanner/MiniBanner.web";

jest.mock("../viewmodel/MonterosaContent.viewmodel", () => ({
  __esModule: true,
  default: jest.fn(),
  MONTEROSA_BETSLIP_ACTION: "mr_betslip_selections",
}));
jest.mock("@ppb/the-wall-web", () => ({
  EmptyState: jest.fn(({ props }) => <empty-state-mock {...props} />),
}));
jest.mock("./MonterosaContentPlaceholder.web", () => jest.fn(() => <monterosa-content-placeholder-mock />));
jest.mock("@monterosa/sdk-interact-kit", () => ({
  getProject: jest.fn(),
  getEvents: jest.fn(() => [{ eventId: "event_id" }]),
}));
jest.mock("@monterosa/sdk-launcher-kit", () => ({
  embed: jest.fn(),
  getExperience: jest.fn(() => ({ id: "experience" })),
  onMessage: jest.fn(() => jest.fn()),
  onReady: jest.fn(() => jest.fn()),
  sendMessage: jest.fn(),
}));
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));
jest.mock("@ppb/tbd-store/helpers/cookie-consent", () => ({
  getCookieConsentCategories: jest.fn(() => ({ MARKETING_TARGETING_3RD_PARTY: "C0002" })),
}));
jest.mock("@ppb/tbd-store/state/cookie-consent/cookie-consent-selectors", () => ({
  createIsCookieConsentCategoryActiveSelector: jest.fn(
    () => (cookieConsent, category) => cookieConsent?.activeCategories?.includes(category),
  ),
}));
jest.mock("../../MiniBanner/MiniBanner.web", () => ({
  MiniBanner: jest.fn(() => <mini-banner-mock />),
}));

const URN = "ppb:tbd:card:monterosaContent:1";
const emptyLabelTranslations = {
  title: "I18N.REDIRECT404.TITLE",
  message: "I18N.REDIRECT404.SUBTITLE",
  consentTitle: "I18N.MONTEROSA.COOKIE.TITLE",
  consentMessage: "I18N.MONTEROSA.COOKIE.DESCRIPTION",
  consentLink: "I18N.MONTEROSA.COOKIE.LINK",
};

function renderComponent(called = true, loading = false, hasConsent = true, onAddSelectionsToBetslip = jest.fn()) {
  useMonterosaContentVMFn.mockReturnValue({
    called,
    loading,
    vm: {
      data: {
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
    ...render(<MonterosaContentCard urn={URN} />),
  };
}

describe("MonterosaContent component", () => {
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

      return render(<MonterosaContentCard urn={URN} />);
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
        renderComponent(false);
      });

      it("should return null", () => {
        const { container } = render(<MonterosaContentCard urn={URN} />);
        expect(container.firstChild).toBeNull();
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

  describe("when `useMonterosaContentVM` returns data", () => {
    let container;
    beforeEach(() => {
      ({ container } = renderComponent(true));
    });

    it("should render experience container", () => {
      expect(container.querySelector("div")).toBeTruthy();
      expect(embed).toHaveBeenCalled();
    });

    it("should send user preferences when the experience becomes ready", () => {
      renderComponent(true);

      const experience = onReady.mock.calls.at(-1)[0];
      const readyCallback = onReady.mock.calls.at(-1)[1];

      act(() => {
        readyCallback();
      });

      expect(sendMessage).toHaveBeenCalledWith(experience, "set_user_preferences", {
        oddsFormat: "FRACTIONAL",
      });
    });

    it("should resend user preferences when odds format changes after ready", () => {
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

      const { rerender } = render(<MonterosaContentCard urn={URN} />);
      const experience = onReady.mock.calls.at(-1)[0];
      const readyCallback = onReady.mock.calls.at(-1)[1];

      act(() => {
        readyCallback();
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

      rerender(<MonterosaContentCard urn={URN} />);

      expect(sendMessage).toHaveBeenLastCalledWith(experience, "set_user_preferences", {
        oddsFormat: "DECIMAL",
      });
    });

    it("should resend user preferences when experience key changes", () => {
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

      const { rerender } = render(<MonterosaContentCard urn={URN} />);
      const firstExperience = onReady.mock.calls.at(-1)[0];
      const firstReadyCallback = onReady.mock.calls.at(-1)[1];

      act(() => {
        firstReadyCallback();
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

      rerender(<MonterosaContentCard urn={URN} />);

      const secondExperience = onReady.mock.calls.at(-1)[0];
      const secondReadyCallback = onReady.mock.calls.at(-1)[1];

      act(() => {
        secondReadyCallback();
      });

      expect(sendMessage).toHaveBeenNthCalledWith(1, firstExperience, "set_user_preferences", {
        oddsFormat: "FRACTIONAL",
      });
      expect(sendMessage).toHaveBeenNthCalledWith(2, secondExperience, "set_user_preferences", {
        oddsFormat: "FRACTIONAL",
      });
    });

    it("should forward monterosa betslip action payload to viewmodel callback", () => {
      const onAddSelectionsToBetslip = jest.fn();
      renderComponent(true, false, true, onAddSelectionsToBetslip);

      const onMessageCallback = onMessage.mock.calls.at(-1)[1];
      const payload = {
        selections: [
          {
            marketId: "926.100",
            selectionId: 1,
          },
        ],
      };

      onMessageCallback({
        action: "mr_betslip_selections",
        payload,
      });

      expect(onAddSelectionsToBetslip).toHaveBeenCalledWith(payload);
    });

    it("should ignore non-betslip monterosa actions", () => {
      const onAddSelectionsToBetslip = jest.fn();
      renderComponent(true, false, true, onAddSelectionsToBetslip);

      const onMessageCallback = onMessage.mock.calls.at(-1)[1];
      onMessageCallback({
        action: "some_other_action",
        payload: {
          selections: [{ marketId: "926.100", selectionId: 1 }],
        },
      });

      expect(onAddSelectionsToBetslip).not.toHaveBeenCalled();
    });
  });

  describe("when cookie consent is not active", () => {
    it("should show consent required message", () => {
      renderComponent(true, false, false);

      expect(MiniBanner).toHaveBeenCalledWith(
        expect.objectContaining({
          brandTitle: emptyLabelTranslations.consentTitle,
          title: emptyLabelTranslations.consentMessage,
          subText: emptyLabelTranslations.consentLink,
          onMiniBannerTap: expect.any(Function),
        }),
        undefined,
      );
    });

    it("should call OneTrust toggle when mini banner is activated", () => {
      window.OneTrust = { ToggleInfoDisplay: jest.fn() };

      renderComponent(true, false, false);

      const { onMiniBannerTap } = MiniBanner.mock.calls[MiniBanner.mock.calls.length - 1][0];
      onMiniBannerTap();

      expect(window.OneTrust.ToggleInfoDisplay).toHaveBeenCalled();
    });
  });
});
