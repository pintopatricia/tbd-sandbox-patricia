import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { SportsbookBetButton, SportsbookMarket, Card, QuickLink } from "@ppb/the-wall-web";
import { DisplayMode } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { VirtualRunner } from "./snowflakes/VirtualRunner/VirtualRunner.web";
import VirtualMarketCard from "./VirtualMarketCard.web";

const dispatchBetPlacement = jest.fn();
const dispatchInactiveBetButtonClickAction = jest.fn();

jest.mock("@ppb/the-wall-web", () => ({
  SportsbookBetButton: jest.fn(() => <sbk-bet-button />),
  SportsbookMarket: jest.fn(({ props, children }) => <sbk-market {...props}>{children}</sbk-market>),
  Card: jest.fn(({ props, children }) => <card-mock {...props}>{children}</card-mock>),
  QuickLink: jest.fn(({ props, children }) => <quicklink-mock {...props}>{children}</quicklink-mock>),
}));

jest.mock("./snowflakes/VirtualRunner/VirtualRunner.web", () => ({
  VirtualRunner: jest.fn(({ props, children }) => <runner-mock {...props}>{children}</runner-mock>),
}));

function renderVirtualMarketCard({
  marketUrn,
  title,
  status,
  i18n = {},
  eachWayTermsLabel,
  infoBlurbs = [],
  runners = [],
  gameRulesViewLink = {},
  animated = false,
} = {}) {
  return render(
    <VirtualMarketCard
      marketUrn={marketUrn}
      title={title}
      status={status}
      i18n={i18n}
      eachWayTermsLabel={eachWayTermsLabel}
      infoBlurbs={infoBlurbs}
      runners={runners}
      gameRulesViewLink={gameRulesViewLink}
      dispatchBetPlacement={dispatchBetPlacement}
      dispatchInactiveBetButtonClickAction={dispatchInactiveBetButtonClickAction}
      animated={animated}
    />,
  );
}

describe("VirtualMarketCard", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("rendering", () => {
    it("should render Card with title", () => {
      renderVirtualMarketCard({ title: "horses" });

      expect(Card).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "horses",
        }),
        undefined,
      );
    });

    describe("SportsbookMarket", () => {
      it("should render with basic props", () => {
        renderVirtualMarketCard();

        expect(SportsbookMarket).toHaveBeenCalledWith(
          expect.objectContaining({
            status: undefined,
            guaranteedPriceAvailable: false,
            i18n: {},
            infoBlurbs: [],
            intersectOffset: "210px 100%",
            children: [],
          }),
          undefined,
        );
      });

      it("should include eachWayTerms in infoBlurbs when provided", () => {
        renderVirtualMarketCard({
          infoBlurbs: [
            {
              title: "Each Way Terms",
            },
          ],
        });

        expect(SportsbookMarket).toHaveBeenCalledWith(
          expect.objectContaining({
            status: undefined,
            guaranteedPriceAvailable: false,
            i18n: {},
            infoBlurbs: [
              {
                title: "Each Way Terms",
              },
            ],
            intersectOffset: "210px 100%",
            children: [],
          }),
          undefined,
        );
      });

      it("should have empty infoBlurbs when no eachWayTerms", () => {
        renderVirtualMarketCard({
          infoBlurbs: [],
        });

        expect(SportsbookMarket).toHaveBeenCalledWith(
          expect.objectContaining({
            status: undefined,
            guaranteedPriceAvailable: false,
            i18n: {},
            infoBlurbs: [],
            intersectOffset: "210px 100%",
            children: [],
          }),
          undefined,
        );
      });
    });

    describe("QuickLink", () => {
      it("should render with game rules link", () => {
        renderVirtualMarketCard({
          i18n: { gameRules: "Game Rules" },
          gameRulesViewLink: {
            viewDisplayMode: DisplayMode.BlankWebview,
            viewUrl: "https://example.com/rules",
            viewUrn: EntityType.ExternalView,
          },
        });

        expect(QuickLink).toHaveBeenCalledWith(
          expect.objectContaining({
            isHighlighted: false,
            item: {
              text: "Game Rules",
              target: "blank",
              viewLink: {
                viewDisplayMode: DisplayMode.BlankWebview,
                viewUrl: "https://example.com/rules",
                viewUrn: EntityType.ExternalView,
              },
            },
          }),
          undefined,
        );
      });
    });
  });

  describe("runners", () => {
    it("should render VirtualRunner for each runner", () => {
      renderVirtualMarketCard({
        runners: [
          {
            urn: "runner:1",
            name: "Runner 1",
            description: "Description 1",
            number: 1,
            humanTexture: "texture1",
            sportId: 1,
            showSilk: true,
          },
          {
            urn: "runner:2",
            name: "Runner 2",
            description: "Description 2",
            number: 2,
            humanTexture: "texture2",
            sportId: 1,
            showSilk: true,
          },
        ],
      });

      expect(VirtualRunner).toHaveBeenCalledTimes(2);
      expect(VirtualRunner).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          name: "Runner 1",
          description: "Description 1",
          number: 1,
          humanTexture: "texture1",
          sportId: 1,
          showSilk: true,
        }),
        undefined,
      );
    });

    describe("bet buttons", () => {
      it("should render default button when not selected", () => {
        renderVirtualMarketCard({
          runners: [
            {
              urn: "runner:1",
              label: "2.0",
              isSelected: false,
            },
          ],
        });

        expect(SportsbookBetButton).toHaveBeenCalledWith(
          expect.objectContaining({
            label: "2.0",
            status: "default",
            animated: false,
          }),
          undefined,
        );
      });

      it("should render selected button when selected", () => {
        renderVirtualMarketCard({
          runners: [
            {
              urn: "runner:1",
              label: "2.0",
              isSelected: true,
            },
          ],
        });

        expect(SportsbookBetButton).toHaveBeenCalledWith(
          expect.objectContaining({
            label: "2.0",
            status: "selected",
            animated: false,
          }),
          undefined,
        );
      });

      describe("onClick behavior", () => {
        it("should dispatch bet placement when no toast message", () => {
          renderVirtualMarketCard({
            runners: [
              {
                urn: "runner:1",
                odds: { decimal: 2.0 },
              },
            ],
          });

          SportsbookBetButton.mock.calls[0][0].onClick();

          expect(dispatchBetPlacement).toHaveBeenCalledWith(
            { urn: "runner:1", odds: { decimal: 2.0 } },
            expect.objectContaining({ betOriginURL: expect.any(String) }),
          );
          expect(dispatchInactiveBetButtonClickAction).not.toHaveBeenCalled();
        });

        it("should dispatch inactive button click when has toast message", () => {
          renderVirtualMarketCard({
            runners: [
              {
                urn: "runner:1",
                toastMessageStatus: "SUSPENDED",
              },
            ],
          });

          SportsbookBetButton.mock.calls[0][0].onClick();

          expect(dispatchInactiveBetButtonClickAction).toHaveBeenCalledWith("SUSPENDED");
          expect(dispatchBetPlacement).not.toHaveBeenCalled();
        });
      });
    });
  });
});
