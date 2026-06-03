import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { ActionLinkColor, ActionLinkTypography } from "@ppb/the-wall-common/types";
import { CasinoIconName, SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ActionLink } from "@ppb/the-wall-web";
import { ProgressBar } from "@ppb/the-wall-web/components/bricks/ProgressBar/ProgressBar";
import { OngoingBadge } from "../OngoingBadge/OngoingBadge.web";
import { OngoingPromoCardTypes, AdditionalMessageType } from "./OngoingPromoCard.types";

import { OngoingPromoCard } from "./OngoingPromoCard.web";
import styles from "./OngoingPromoCard.web.css";
import {
  TEST_ID,
  TITLE,
  TC_TEXT,
  FOOTER_TEXT_CONTAINER,
  REMAINING_HEADER,
  REMAINING_SUBHEADER,
  REQUIREMENTS,
  ADDITIONAL_MESSAGE,
  TIMELEFT_SECTION,
} from "./OngoingPromoCard.web.selectors";

jest.mock("@ppb/the-wall-web", () => ({
  ActionLink: jest.fn(() => <action-link />),
}));

jest.mock("@ppb/the-wall-web/components/bricks/ProgressBar/ProgressBar", () => ({
  ProgressBar: jest.fn(() => <progress-bar />),
}));

jest.mock("../OngoingBadge/OngoingBadge.web", () => ({
  OngoingBadge: jest.fn(() => <ongoing-badge-mock />),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

function renderPromoCard({
  title = "20 FREE SPINS",
  type = OngoingPromoCardTypes.FREE_SPINS,
  tcText = "Terms and conditions",
  remainingHeader = "23 Free Spins Remaining",
  backgroundImage = "imageUrl",
  i18N = {
    cancel: "Cancel",
    refresh: "Refresh",
    footerText: "Time left",
    badgeLabel: "Ongoing",
    pendingWinnings: "Pending winnings",
  },
  footerValue = "4 days 3 hours",
  progressValue = 20,
  requirements = "Some requirements",
  remainingSubheader = "Some subheader",
  additionalMessage = {},
  pendingWinnings = "",
  disableRefresh = false,
  onCancel = () => {},
  onRefresh = () => {},
}) {
  const { container } = render(
    <OngoingPromoCard
      title={title}
      type={type}
      tcText={tcText}
      backgroundImage={backgroundImage}
      i18N={i18N}
      footerValue={footerValue}
      progressValue={progressValue}
      remainingHeader={remainingHeader}
      requirements={requirements}
      remainingSubheader={remainingSubheader}
      additionalMessage={additionalMessage}
      disableRefresh={disableRefresh}
      pendingWinnings={pendingWinnings}
      onCancel={onCancel}
      onRefresh={onRefresh}
    />,
  );
  return container.querySelector(TEST_ID);
}

describe("Ongoing Promo Card", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("render component", () => {
    it("should render with correct css class", () => {
      const promo = renderPromoCard({});
      expect(promo).toHaveClass(styles.promoCard);
    });

    it("should have the correct background image", () => {
      const promo = renderPromoCard({});
      expect(promo).toHaveStyle(`background-image: url(imageUrl)`);
    });

    it("should call Ongoing Badge with the right props", () => {
      renderPromoCard({});
      expect(OngoingBadge).toHaveBeenCalledWith({ label: "Ongoing" }, undefined);
    });

    it("should have the correct title", () => {
      const promo = renderPromoCard({});
      const promoTitle = promo.querySelector(TITLE);

      expect(promoTitle).toHaveTextContent("20 FREE SPINS");
    });

    it("should have the correct terms text", () => {
      const promo = renderPromoCard({});
      const termsText = promo.querySelector(TC_TEXT);

      expect(termsText).toHaveTextContent("Terms and conditions");
    });

    it("should have the correct 'remaining' header text", () => {
      const promo = renderPromoCard({});
      const remainingHeader = promo.querySelector(REMAINING_HEADER);

      expect(remainingHeader).toHaveTextContent("23 Free Spins Remaining");
    });

    it("should NOT render the additional message", () => {
      const promo = renderPromoCard({});
      const completedContainer = promo.querySelector(ADDITIONAL_MESSAGE);

      expect(completedContainer).toBeNull();
    });

    describe("With type 'FREE SPINS'", () => {
      it("should render svg icon for free spins", () => {
        renderPromoCard({});
        expect(GenericIcon).toHaveBeenCalledWith(
          {
            name: CasinoIconName.FREE_SPINS,
            color: "#FFFFFF",
          },
          undefined,
        );
      });

      it("should render correct svg icon for Time Left", () => {
        renderPromoCard({});
        expect(GenericIcon).toHaveBeenCalledWith(
          {
            name: CasinoIconName.FREE_SPINS,
            color: "#FFFFFF",
          },
          undefined,
        );
      });

      it("should not render progress bar", () => {
        renderPromoCard({});
        expect(ProgressBar).toHaveBeenCalledTimes(0);
      });
    });

    describe("With undefined type'", () => {
      it("should render svg icon for free spins", () => {
        renderPromoCard({ type: undefined });
        expect(GenericIcon).toHaveBeenCalledWith(
          {
            name: CasinoIconName.FREE_SPINS,
            color: "#FFFFFF",
          },
          undefined,
        );
      });

      it("should render correct svg icon for Time Left", () => {
        renderPromoCard({ type: undefined });
        expect(GenericIcon).toHaveBeenCalledWith(
          {
            name: CasinoIconName.IN_GAME,
            color: "#FFFFFF",
          },
          undefined,
        );
      });
    });

    describe("With type 'GOLDEN CHIPS'", () => {
      it("should render svg icon for golden chips", () => {
        renderPromoCard({ type: OngoingPromoCardTypes.GOLDEN_CHIPS });
        expect(GenericIcon).toHaveBeenCalledWith(
          {
            name: CasinoIconName.TABLE_GAMES,
            color: "#FFFFFF",
          },
          undefined,
        );
      });

      it("should NOT render svg icon for free spins", () => {
        renderPromoCard({ type: OngoingPromoCardTypes.GOLDEN_CHIPS });
        expect(GenericIcon).not.toHaveBeenCalledWith(
          {
            name: CasinoIconName.FREE_SPINS,
            color: "#FFFFFF",
          },
          undefined,
        );
      });

      it("Should have 'remaining' subheader text", () => {
        const promo = renderPromoCard({
          type: OngoingPromoCardTypes.GOLDEN_CHIPS,
        });
        const remainingText = promo.querySelector(REMAINING_SUBHEADER);

        expect(remainingText).toHaveTextContent("Some subheader");
      });

      it("Should have requirements text", () => {
        const promo = renderPromoCard({
          type: OngoingPromoCardTypes.GOLDEN_CHIPS,
        });
        const remainingText = promo.querySelector(REQUIREMENTS);

        expect(remainingText).toHaveTextContent("Some requirements");
      });

      it("should have correct footer text", () => {
        const promo = renderPromoCard({ type: OngoingPromoCardTypes.GOLDEN_CHIPS, pendingWinnings: "$0" });
        const footerText = promo.querySelector(FOOTER_TEXT_CONTAINER);

        expect(footerText).toHaveTextContent("Pending winnings: $0");
      });

      it("should render Progress bar with correct values", () => {
        renderPromoCard({ type: OngoingPromoCardTypes.GOLDEN_CHIPS });
        expect(ProgressBar).toHaveBeenCalledTimes(1);
        expect(ProgressBar).toHaveBeenCalledWith(
          {
            home: 20,
            away: 80,
            homeColor: "var(--brand-casino-icon-default)",
            awayColor: "var(--agnostic-neutrals-icon-default)",
          },
          undefined,
        );
      });

      it("should have the timeleft section when pending winnings exist", () => {
        const promo = renderPromoCard({ type: OngoingPromoCardTypes.GOLDEN_CHIPS, pendingWinnings: "$24" });
        const timeleftSection = promo.querySelector(TIMELEFT_SECTION);

        expect(timeleftSection).toHaveTextContent("Time left: 4 days 3 hours");
      });

      it("should render svg icon for pending icons", () => {
        renderPromoCard({ type: OngoingPromoCardTypes.GOLDEN_CHIPS, pendingWinnings: "$24" });
        expect(GenericIcon).toHaveBeenCalledWith(
          {
            name: CasinoIconName.JACKPOT,
            color: "#FFFFFF",
          },
          undefined,
        );
      });
    });

    describe("With type 'CASH'", () => {
      it("should render svg icon for cash", () => {
        renderPromoCard({ type: OngoingPromoCardTypes.CASH });
        expect(GenericIcon).toHaveBeenCalledWith(
          {
            name: CasinoIconName.FEATURES,
            color: "#FFFFFF",
          },
          undefined,
        );
      });

      it("shouldn't render  svg icon for pending winnings", () => {
        renderPromoCard({ type: OngoingPromoCardTypes.CASH });
        expect(GenericIcon).not.toHaveBeenCalledWith(
          {
            name: CasinoIconName.JACKPOT,
            color: "#FFFFFF",
          },
          undefined,
        );
      });

      it("should NOT render svg icon for free spins", () => {
        renderPromoCard({ type: OngoingPromoCardTypes.CASH });
        expect(GenericIcon).not.toHaveBeenCalledWith(
          {
            name: CasinoIconName.FREE_SPINS,
            color: "#FFFFFF",
          },
          undefined,
        );
      });

      it("should render svg icon for Time Left", () => {
        renderPromoCard({ type: OngoingPromoCardTypes.CASH });
        expect(GenericIcon).toHaveBeenCalledWith(
          {
            name: CasinoIconName.IN_GAME,
            color: "#FFFFFF",
          },
          undefined,
        );
      });

      it("Should have 'remaining' subheader text", () => {
        const promo = renderPromoCard({
          type: OngoingPromoCardTypes.CASH,
        });
        const remainingText = promo.querySelector(REMAINING_SUBHEADER);

        expect(remainingText).toHaveTextContent("Some subheader");
      });

      it("Should have requirements text", () => {
        const promo = renderPromoCard({
          type: OngoingPromoCardTypes.CASH,
        });
        const remainingText = promo.querySelector(REQUIREMENTS);

        expect(remainingText).toHaveTextContent("Some requirements");
      });

      it("should have correct footer text", () => {
        const promo = renderPromoCard({
          type: OngoingPromoCardTypes.CASH,
        });
        const footerText = promo.querySelector(FOOTER_TEXT_CONTAINER);
        expect(footerText).toHaveTextContent("Time left: 4 days 3 hours");
      });

      it("should render Progress bar with correct values", () => {
        renderPromoCard({
          type: OngoingPromoCardTypes.CASH,
        });
        expect(ProgressBar).toHaveBeenCalledTimes(1);
        expect(ProgressBar).toHaveBeenCalledWith(
          {
            home: 20,
            away: 80,
            homeColor: "var(--brand-casino-icon-default)",
            awayColor: "var(--agnostic-neutrals-icon-default)",
          },
          undefined,
        );
      });
    });

    describe("With type 'OPT_IN'", () => {
      it("should not render svg icon for cash", () => {
        renderPromoCard({ type: OngoingPromoCardTypes.OPTIN });
        expect(GenericIcon).not.toHaveBeenCalledWith(
          {
            name: CasinoIconName.FEATURES,
            color: "#FFFFFF",
          },
          undefined,
        );
      });

      it("shouldn't render  svg icon for pending winnings", () => {
        renderPromoCard({ type: OngoingPromoCardTypes.OPTIN });
        expect(GenericIcon).not.toHaveBeenCalledWith(
          {
            name: CasinoIconName.JACKPOT,
            color: "#FFFFFF",
          },
          undefined,
        );
      });

      it("should NOT render svg icon for free spins", () => {
        renderPromoCard({ type: OngoingPromoCardTypes.OPTIN });
        expect(GenericIcon).not.toHaveBeenCalledWith(
          {
            name: CasinoIconName.FREE_SPINS,
            color: "#FFFFFF",
          },
          undefined,
        );
      });

      it("should render svg icon for Time Left", () => {
        renderPromoCard({ type: OngoingPromoCardTypes.OPTIN });
        expect(GenericIcon).toHaveBeenCalledWith(
          {
            name: CasinoIconName.IN_GAME,
            color: "#FFFFFF",
          },
          undefined,
        );
      });

      it("Should not have 'remaining' subheader text", () => {
        const promo = renderPromoCard({
          type: OngoingPromoCardTypes.OPTIN,
        });
        const remainingText = promo.querySelector(REMAINING_SUBHEADER);

        expect(remainingText).toBeNull();
      });

      it("Should not have requirements text", () => {
        const promo = renderPromoCard({
          type: OngoingPromoCardTypes.OPTIN,
        });
        const remainingText = promo.querySelector(REQUIREMENTS);

        expect(remainingText).toBeNull();
      });

      it("should not render Progress bar", () => {
        renderPromoCard({ type: OngoingPromoCardTypes.OPTIN });
        expect(ProgressBar).toHaveBeenCalledTimes(0);
      });

      it("should not render two ActionLink components", () => {
        renderPromoCard({ type: OngoingPromoCardTypes.OPTIN });
        expect(ActionLink).toHaveBeenCalledTimes(0);
      });
    });

    describe("When the promotion has an additional message(success or warning)", () => {
      it("On success should render the text message and 'Check' svg", () => {
        const promo = renderPromoCard({
          additionalMessage: { text: "Congratulations!", type: AdditionalMessageType.SUCCESS },
        });
        const additionalMessage = promo.querySelector(ADDITIONAL_MESSAGE);
        expect(additionalMessage).toHaveTextContent("Congratulations!");
        expect(GenericIcon).toHaveBeenCalledWith(
          { name: SystemIconName.CHECKBOX_ACTIVE, color: "var(--brand-casino-icon-default)" },
          undefined,
        );
      });
      it("On warning should render the text message and 'Warning' svg", () => {
        const promo = renderPromoCard({
          additionalMessage: { text: "Warning!", type: AdditionalMessageType.WARNING },
        });
        const additionalMessage = promo.querySelector(ADDITIONAL_MESSAGE);
        expect(additionalMessage).toHaveTextContent("Warning!");
        expect(GenericIcon).toHaveBeenCalledWith(
          { name: SystemIconName.NOTIFICATION_WARNING, color: "var(--messaging-warning-icon-default)" },
          undefined,
        );
      });
    });

    describe("ActionLink", () => {
      it("should render two ActionLink components", () => {
        renderPromoCard({});
        expect(ActionLink).toHaveBeenCalledTimes(2);
      });

      it("should render the 'Cancel' ActionLink with correct props", () => {
        renderPromoCard({});
        expect(ActionLink.mock.calls[0][0]).toEqual({
          text: "Cancel",
          onClick: expect.any(Function),
          color: ActionLinkColor.Gold,
          typography: ActionLinkTypography.Small,
          noPadding: true,
        });
      });

      it("should render the 'Refresh' ActionLink with correct props", () => {
        renderPromoCard({});
        expect(ActionLink.mock.calls[1][0]).toEqual({
          text: "Refresh",
          onClick: expect.any(Function),
          color: ActionLinkColor.Gold,
          typography: ActionLinkTypography.Small,
          noPadding: true,
          disabled: false,
        });
      });

      it("should render the 'Refresh' ActionLink with correct props when is disabled", () => {
        renderPromoCard({ disableRefresh: true });
        expect(ActionLink.mock.calls[1][0]).toEqual({
          text: "Refresh",
          onClick: expect.any(Function),
          color: ActionLinkColor.Gold,
          typography: ActionLinkTypography.Small,
          noPadding: true,
          disabled: true,
        });
      });
    });
  });
});
