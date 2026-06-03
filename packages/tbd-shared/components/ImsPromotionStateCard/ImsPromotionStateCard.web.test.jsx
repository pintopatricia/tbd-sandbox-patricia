import "jest-dom/extend-expect";
import { render, act } from "@testing-library/react";
import { ConfirmDrawer, Alert } from "@ppb/the-wall-web";
import { PromotionLayout, PromotionStatus } from "@ppb/tbd-store/state/entities/ims-promotions/ImsPromotion";
import { OngoingPromoCardTypes, AlertType } from "@ppb/the-wall-common/types";
import { AcceptPromoCard } from "./snowflakes/AcceptPromoCard/AcceptPromoCard.web";
import { ClaimNowPromo } from "./snowflakes/ClaimNowPromo/ClaimNowPromo.web";
import { OngoingPromoCard } from "./snowflakes/OngoingPromoCard/OngoingPromoCard.web";
import ImsPromotionStateCard from "./ImsPromotionStateCard.web";

jest.mock("@ppb/tbd-store/state/entities/ims-promotions/ImsPromotion", () => ({
  PromotionLayout: {
    Accept: "ACCEPT",
    BuyIn: "BUY_IN",
    Test: "test",
  },
  PromotionStatus: {
    OptedIn: "OPTED_IN",
    NotOptedIn: "NOT_OPTED_IN",
  },
}));

jest.mock("@ppb/the-wall-common/types", () => ({
  OngoingPromoCardTypes: {
    FREE_SPINS: "FREE_SPINS",
    GOLDEN_CHIPS: "GOLDEN_CHIPS",
  },
  AdditionalMessageType: {
    SUCCESS: "SUCCESS",
    WARNING: "WARNING",
  },
  AlertType: {
    Success: "SUCCESS",
    Warning: "WARNING",
    Error: "ERROR",
    Info: "INFO",
  },
}));
jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn().mockReturnValue("£20"),
}));

jest.mock("@ppb/the-wall-web", () => ({
  ConfirmDrawer: jest.fn(() => <confirm-drawer-mock />),
  Alert: jest.fn(() => <notification-mock />),
}));

jest.mock("./snowflakes/OngoingPromoCard/OngoingPromoCard.web", () => ({
  OngoingPromoCard: jest.fn(() => <ongoing-promo-mock />),
}));

jest.mock("./snowflakes/ClaimNowPromo/ClaimNowPromo.web", () => ({
  ClaimNowPromo: jest.fn(() => <claim-now-mock />),
}));

jest.mock("./snowflakes/AcceptPromoCard/AcceptPromoCard.web", () => ({
  AcceptPromoCard: jest.fn(() => <accept-mock />),
}));

global.window = Object.create(window);
Object.defineProperty(window, "location", {
  value: {
    href: "https://www.betfair.com/betting/casino/promotions",
  },
});

function setup({
  promoCard = "fakeCard",
  layout = "ACCEPT",
  status = PromotionStatus.NotOptedIn,
  promotion = "fakePromo",
  title = "Title",
  image = "fakeUrl",
  disclaimerText = null,
  subHeadline = "fakeSubheadline",
  ctaText = "fakeTest",
  dispatchProps = {
    dispatchAcceptPromotion: null,
    dispatchCancelPromotion: null,
    dispatchDepositNavigation: null,
    dispatchRefreshPromotion: null,
    dispatchClearErrorMessage: null,
    dispatchSawPromotionError: null,
    dispatchInteractCancelPromotionModal: null,
    dispatchExternalPushAction: null,
  },
  bonusAmount = 0,
  bonusPercent = 100,
  i18n = {
    deposit: "Deposit",
    availableFunds: "availableFunds",
    cancel: "cancel",
    pendingWinnings: "pending winnings",
    refresh: "refresh",
    footerText: "footerText",
    badgeLabel: "badgeLabel",
    remainingHeader: "remainingHeader",
    remainingSubHeader: "remainingSubHeader",
    requirements: "requirements",
  },
  min = 1,
  max = 10,
  buyInMaxValue = 10,
  step = 1,
  currencyDetails = { currencyCode: null, localeCode: null },
  type = OngoingPromoCardTypes.FREE_SPINS,
  progressValue = 30,
  footerValue = "fakeFooter",
  availableFunds = 50,
  notificationMessage = undefined,
  pendingWinnings = "",
  depositViewLink = { viewUrn: "fakeUrn", viewUrl: "fakeUrl" },
  isLoggedIn = true,
  authData = { SSO_URL: "SSO_URL" },
}) {
  return render(
    <ImsPromotionStateCard
      promoCard={promoCard}
      status={status}
      promotion={promotion}
      title={title}
      disclaimerText={disclaimerText}
      subHeadline={subHeadline}
      image={image}
      layout={layout}
      ctaText={ctaText}
      i18n={i18n}
      min={min}
      max={max}
      buyInMaxValue={buyInMaxValue}
      step={step}
      type={type}
      currencyDetails={currencyDetails}
      bonusAmount={bonusAmount}
      bonusPercent={bonusPercent}
      progressValue={progressValue}
      footerValue={footerValue}
      availableFunds={availableFunds}
      notificationMessage={notificationMessage}
      pendingWinnings={pendingWinnings}
      depositViewLink={depositViewLink}
      isLoggedIn={isLoggedIn}
      authData={authData}
      dispatchAcceptPromotion={dispatchProps.dispatchAcceptPromotion}
      dispatchCancelPromotion={dispatchProps.dispatchCancelPromotion}
      dispatchDepositNavigation={dispatchProps.dispatchDepositNavigation}
      dispatchRefreshPromotion={dispatchProps.dispatchRefreshPromotion}
      dispatchClearErrorMessage={dispatchProps.dispatchClearErrorMessage}
      dispatchSawPromotionError={dispatchProps.dispatchSawPromotionError}
      dispatchInteractCancelPromotionModal={dispatchProps.dispatchInteractCancelPromotionModal}
      dispatchExternalPushAction={dispatchProps.dispatchExternalPushAction}
    />,
  );
}

const dispatchProps = {
  dispatchCancelPromotion: jest.fn(),
  dispatchAcceptPromotion: jest.fn(),
  dispatchDepositNavigation: jest.fn(),
  dispatchRefreshPromotion: jest.fn(),
  dispatchSawPromotionError: jest.fn(),
  dispatchClearErrorMessage: jest.fn(),
  dispatchInteractCancelPromotionModal: jest.fn(),
  dispatchExternalPushAction: jest.fn(),
};

describe("ImsPromotionStateCard component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when initializing the component", () => {
    it("shouldn't render any component", () => {
      setup({ layout: PromotionLayout.Test });

      expect(AcceptPromoCard).toHaveBeenCalledTimes(0);
      expect(ClaimNowPromo).toHaveBeenCalledTimes(0);
      expect(OngoingPromoCard).toHaveBeenCalledTimes(0);
      expect(Alert).toHaveBeenCalledTimes(0);
    });

    it("should initialize AcceptPromoCard component with the correct props", () => {
      setup({});

      expect(AcceptPromoCard).toHaveBeenCalledWith(
        {
          i18n: {
            accept: "fakeTest",
          },
          image: "fakeUrl",
          tcText: "fakeSubheadline",
          title: "Title",
          onAccept: expect.any(Function),
        },
        undefined,
      );
    });

    it("should initialize ClaimNowPromoCard component with the correct props", () => {
      setup({ layout: PromotionLayout.BuyIn });
      expect(ClaimNowPromo).toHaveBeenCalledWith(
        {
          title: "Title",
          availableFunds: "£20",
          subHeader: "fakeSubheadline",
          backgroundImage: "fakeUrl",
          steps: 10,
          initialStep: 9,
          bubbleLabel: "£20",
          disclaimer: { i18n: null, value: "£20" },
          i18n: { claimNow: "fakeTest", availableFunds: "availableFunds" },
          onClaimNow: expect.any(Function),
          onChange: expect.any(Function),
        },
        undefined,
      );
    });

    it("should initialize Ongoing promo card component with the correct props", () => {
      setup({
        layout: PromotionLayout.Accept,
        status: PromotionStatus.OptedIn,
        dispatchProps,
        pendingWinnings: "$23",
      });

      expect(OngoingPromoCard).toHaveBeenCalledTimes(1);
      expect(OngoingPromoCard).toHaveBeenCalledWith(
        {
          title: "Title",
          type: "FREE_SPINS",
          tcText: "fakeSubheadline",
          requirements: "requirements",
          backgroundImage: "fakeUrl",
          remainingHeader: "remainingHeader",
          remainingSubheader: "remainingSubHeader",
          footerValue: "fakeFooter",
          disableRefresh: false,
          i18N: {
            cancel: "cancel",
            refresh: "refresh",
            footerText: "footerText",
            badgeLabel: "badgeLabel",
            pendingWinnings: "pending winnings",
          },
          progressValue: 30,
          pendingWinnings: "$23",
          onCancel: expect.any(Function),
          onRefresh: expect.any(Function),
        },
        undefined,
      );
    });
  });

  describe("When there is a notification message", () => {
    it("should render Alert with accept promotion", () => {
      setup({
        layout: PromotionLayout.Accept,
        status: PromotionStatus.NotOptedIn,
        notificationMessage: { type: AlertType.Warning, title: "title", body: "body" },
        dispatchProps,
      });
      expect(Alert).toHaveBeenCalledTimes(1);
      expect(Alert).toHaveBeenCalledWith(
        {
          type: AlertType.Warning,
          message: "title",
          detail: "body",
        },
        undefined,
      );
    });
    it("should render Alert with claim now promotion", () => {
      setup({
        layout: PromotionLayout.Accept,
        status: PromotionStatus.NotOptedIn,
        notificationMessage: { type: AlertType.Warning, title: "title", body: "body" },
        dispatchProps,
      });
      expect(Alert).toHaveBeenCalledTimes(1);
      expect(Alert).toHaveBeenCalledWith(
        {
          type: AlertType.Warning,
          message: "title",
          detail: "body",
        },
        undefined,
      );
    });
    it("should render Alert with ongoing promotion", () => {
      setup({
        layout: PromotionLayout.Accept,
        status: PromotionStatus.NotOptedIn,
        notificationMessage: { type: AlertType.Warning, title: "title", body: "body" },
        dispatchProps,
      });
      expect(dispatchProps.dispatchSawPromotionError).toHaveBeenCalledTimes(1);
      expect(dispatchProps.dispatchSawPromotionError).toHaveBeenCalledWith("title");
      expect(Alert).toHaveBeenCalledTimes(1);
      expect(Alert).toHaveBeenCalledWith(
        {
          type: AlertType.Warning,
          message: "title",
          detail: "body",
        },
        undefined,
      );
    });
  });

  describe("When pressing the accept button", () => {
    describe("When the user is logged in", () => {
      it("should dispatch the Accept promotion action with correct props", () => {
        setup({ layout: PromotionLayout.Accept, status: PromotionStatus.NotOptedIn, dispatchProps });
        expect(AcceptPromoCard).toHaveBeenCalledTimes(1);

        const { onAccept } = AcceptPromoCard.mock.calls[0][0];
        onAccept();

        expect(dispatchProps.dispatchAcceptPromotion).toHaveBeenCalledTimes(1);
        expect(dispatchProps.dispatchAcceptPromotion).toHaveBeenCalledWith(
          "fakePromo",
          "Title",
          "Not Accepted",
          "NOT_OPTED_IN",
          undefined,
          "FREE_SPINS",
          30,
        );
      });
    });

    describe("When the user is not logged in", () => {
      it("should dispatch the External push action with correct props", () => {
        setup({ layout: PromotionLayout.Accept, status: PromotionStatus.NotOptedIn, dispatchProps, isLoggedIn: false });
        expect(AcceptPromoCard).toHaveBeenCalledTimes(1);

        const { onAccept } = AcceptPromoCard.mock.calls[0][0];
        onAccept();

        expect(dispatchProps.dispatchExternalPushAction).toHaveBeenCalledTimes(1);
        expect(dispatchProps.dispatchExternalPushAction).toHaveBeenCalledWith(
          "login",
          "promotional-modal",
          "SSO_URL&url=https%3A%2F%2Fwww.betfair.com%2Fbetting%2Fcasino%2Fpromotions",
        );
      });
    });
  });

  describe("On a 'claim now' promotion type", () => {
    describe("When the user is logged in", () => {
      it("should dispatch the Accept promotion action with correct  amount prop", () => {
        setup({ layout: PromotionLayout.BuyIn, status: PromotionStatus.NotOptedIn, dispatchProps });
        expect(ClaimNowPromo).toHaveBeenCalledTimes(1);

        const { onClaimNow } = ClaimNowPromo.mock.calls[0][0];
        onClaimNow();

        expect(dispatchProps.dispatchAcceptPromotion).toHaveBeenCalledTimes(1);
        expect(dispatchProps.dispatchAcceptPromotion).toHaveBeenCalledWith(
          "fakePromo",
          "Title",
          "Not Accepted",
          "NOT_OPTED_IN",
          10,
          "FREE_SPINS",
          30,
        );
      });
    });
    describe("When user is not logged in", () => {
      it("should dispatch the External push action with correct props", () => {
        setup({ layout: PromotionLayout.BuyIn, status: PromotionStatus.NotOptedIn, dispatchProps, isLoggedIn: false });
        expect(ClaimNowPromo).toHaveBeenCalledTimes(1);

        const { onClaimNow } = ClaimNowPromo.mock.calls[0][0];
        onClaimNow();

        expect(dispatchProps.dispatchExternalPushAction).toHaveBeenCalledTimes(1);
        expect(dispatchProps.dispatchExternalPushAction).toHaveBeenCalledWith(
          "login",
          "promotional-modal",
          "SSO_URL&url=https%3A%2F%2Fwww.betfair.com%2Fbetting%2Fcasino%2Fpromotions",
        );
      });
    });
  });

  describe("When pressing the cancel button", () => {
    describe("When  confirming", () => {
      it("Should dispatch the cancel promotion action", () => {
        setup({ layout: PromotionLayout.Accept, status: PromotionStatus.OptedIn, dispatchProps });
        expect(OngoingPromoCard).toHaveBeenCalledTimes(1);
        const { onCancel } = OngoingPromoCard.mock.calls[0][0];
        act(() => {
          onCancel();
        });
        expect(ConfirmDrawer).toHaveBeenCalledTimes(1);
        const { onRefuseTap } = ConfirmDrawer.mock.calls[0][0];
        act(() => {
          onRefuseTap();
        });
        expect(dispatchProps.dispatchCancelPromotion).toHaveBeenCalledTimes(1);
      });
    });
    describe("When  cancelling", () => {
      it("Should not dispatch the cancel promotion action", () => {
        setup({ layout: PromotionLayout.Accept, status: PromotionStatus.OptedIn, dispatchProps });
        expect(OngoingPromoCard).toHaveBeenCalledTimes(1);
        const { onCancel } = OngoingPromoCard.mock.calls[0][0];
        act(() => {
          onCancel();
        });
        expect(ConfirmDrawer).toHaveBeenCalledTimes(1);
        const { onAcceptTap } = ConfirmDrawer.mock.calls[0][0];
        act(() => {
          onAcceptTap();
        });
        expect(dispatchProps.dispatchCancelPromotion).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe("Claim Now promotion", () => {
    describe("When available funds >= selected buy in value", () => {
      it("should dispatch the Accept promotion action when pressing main button", () => {
        setup({ layout: PromotionLayout.BuyIn, status: PromotionStatus.NotOptedIn, dispatchProps });
        expect(ClaimNowPromo).toHaveBeenCalledTimes(1);
        const { onClaimNow } = ClaimNowPromo.mock.calls[0][0];
        onClaimNow();
        expect(dispatchProps.dispatchAcceptPromotion).toHaveBeenCalledTimes(1);
      });
    });
    describe("When available funds < selected buy in value", () => {
      it("should dispatch the depositNavigation  action when pressing main button", () => {
        setup({ layout: PromotionLayout.BuyIn, status: PromotionStatus.NotOptedIn, dispatchProps, availableFunds: 0 });
        expect(ClaimNowPromo).toHaveBeenCalledTimes(1);
        const { onClaimNow } = ClaimNowPromo.mock.calls[0][0];
        onClaimNow();
        expect(dispatchProps.dispatchDepositNavigation).toHaveBeenCalledTimes(1);
      });
    });
    describe("When pressing the refresh button", () => {
      it("should dispatch the Refresh promotion action with correct props", () => {
        setup({ layout: PromotionLayout.Accept, status: PromotionStatus.OptedIn, dispatchProps });
        expect(OngoingPromoCard).toHaveBeenCalledTimes(1);

        act(() => {
          OngoingPromoCard.mock.calls[0][0].onRefresh();
        });

        expect(dispatchProps.dispatchRefreshPromotion).toHaveBeenCalledTimes(1);
        expect(dispatchProps.dispatchRefreshPromotion).toHaveBeenCalledWith(
          "fakeCard",
          "Title",
          "Accepted",
          "OPTED_IN",
          "refresh",
          "fakePromo",
          "FREE_SPINS",
          30,
        );
      });
    });
    describe("When pressing the refresh button second time", () => {
      it("should disable the RefreshButton after click on refresh", () => {
        setup({ layout: PromotionLayout.Accept, status: PromotionStatus.OptedIn, dispatchProps });
        expect(OngoingPromoCard).toHaveBeenCalledTimes(1);

        act(() => {
          OngoingPromoCard.mock.calls[0][0].onRefresh();
        });

        expect(OngoingPromoCard).toHaveBeenCalledTimes(2);
        expect(OngoingPromoCard).toHaveBeenNthCalledWith(
          1,
          {
            disableRefresh: false,
            title: "Title",
            type: "FREE_SPINS",
            tcText: "fakeSubheadline",
            requirements: "requirements",
            backgroundImage: "fakeUrl",
            remainingHeader: "remainingHeader",
            remainingSubheader: "remainingSubHeader",
            footerValue: "fakeFooter",
            i18N: {
              cancel: "cancel",
              refresh: "refresh",
              footerText: "footerText",
              badgeLabel: "badgeLabel",
              pendingWinnings: "pending winnings",
            },
            progressValue: 30,
            pendingWinnings: "",
            onCancel: expect.any(Function),
            onRefresh: expect.any(Function),
          },
          undefined,
        );
        expect(OngoingPromoCard).toHaveBeenNthCalledWith(
          2,
          {
            disableRefresh: true,
            title: "Title",
            type: "FREE_SPINS",
            tcText: "fakeSubheadline",
            requirements: "requirements",
            backgroundImage: "fakeUrl",
            remainingHeader: "remainingHeader",
            remainingSubheader: "remainingSubHeader",
            footerValue: "fakeFooter",
            i18N: {
              cancel: "cancel",
              refresh: "refresh",
              footerText: "footerText",
              badgeLabel: "badgeLabel",
              pendingWinnings: "pending winnings",
            },
            progressValue: 30,
            pendingWinnings: "",
            onCancel: expect.any(Function),
            onRefresh: expect.any(Function),
          },
          undefined,
        );

        expect(dispatchProps.dispatchRefreshPromotion).toHaveBeenCalledTimes(1);
        expect(dispatchProps.dispatchRefreshPromotion).toHaveBeenCalledWith(
          "fakeCard",
          "Title",
          "Accepted",
          "OPTED_IN",
          "refresh",
          "fakePromo",
          "FREE_SPINS",
          30,
        );
      });
    });
  });
});
