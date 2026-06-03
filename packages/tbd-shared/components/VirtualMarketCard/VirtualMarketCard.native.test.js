import { render, act } from "@testing-library/react-native";
import { navigate } from "@ppb/tbd-router/native";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { SportsbookBetButton, SportsbookMarket, Card, QuickLink } from "@ppb/the-wall-native";
import { DisplayMode } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { VirtualRunner } from "./snowflakes/VirtualRunner/VirtualRunner.native";
import styles from "./VirtualMarketCard.native.styles";
import VirtualMarketCard from "./VirtualMarketCard.native";

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
}));

jest.mock("@ppb/tbd-urn-codecs", () => ({
  ...jest.requireActual("@ppb/tbd-urn-codecs"),
  __esModule: true,
  codecs: {
    parse: jest.fn(),
  },
}));

jest.mock("@ppb/the-wall-native", () => ({
  SportsbookBetButton: jest.fn(() => <sbk-bet-button />),
  SportsbookMarket: jest.fn(({ props, children }) => <sbk-market {...props}>{children}</sbk-market>),
  Card: jest.fn(({ props, children }) => <card-mock {...props}>{children}</card-mock>),
  QuickLink: jest.fn(({ props, children }) => <quicklink {...props}>{children}</quicklink>),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  spacings: {},
  heights: {},
}));

jest.mock("./snowflakes/VirtualRunner/VirtualRunner.native", () => ({
  VirtualRunner: jest.fn(({ props, children }) => <runner-mock {...props}>{children}</runner-mock>),
}));

const dispatchBetPlacement = jest.fn();
const dispatchInactiveBetButtonClickAction = jest.fn();

function renderVirtualMarketCard({
  urn = "market:urn",
  title,
  status,
  i18n = {},
  runners = [],
  gameRulesViewLink = {},
  animated = false,
} = {}) {
  return render(
    <VirtualMarketCard
      urn={urn}
      title={title}
      status={status}
      i18n={i18n}
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

  it("should render", () => {
    const { queryByTestId } = renderVirtualMarketCard();

    expect(queryByTestId("virtual-market-card-container")).not.toBeNull();
  });

  it("should call Card", () => {
    const marketUrn = "market:urn";
    const title = "horses";
    const tabsLabel = "market x";

    renderVirtualMarketCard({ marketUrn, title, i18n: { tabsLabel } });

    expect(Card).toHaveBeenCalledWith(
      {
        title,
        children: expect.anything(),
      },
      undefined,
    );
    expect(Card).toHaveBeenCalledTimes(1);
  });

  it("should call SportsbookMarket", () => {
    renderVirtualMarketCard({
      status: "status mock",
      i18n: { labels: "labels" },
      runners: [{ urn: "runner:urn", label: "2.1" }],
    });

    expect(SportsbookMarket).toHaveBeenCalledWith(
      {
        status: "status mock",
        guaranteedPriceAvailable: false,
        i18n: { labels: "labels" },
        children: expect.anything(),
      },
      undefined,
    );
    expect(SportsbookMarket).toHaveBeenCalledTimes(1);
  });

  it("should call Quicklink", () => {
    renderVirtualMarketCard({
      status: "status mock",
      i18n: { gameRules: "Virtuals" },
      runners: [{ urn: "runner:urn", label: "2.1", theme: "DARK" }],
      gameRulesViewLink: {
        viewDisplayMode: DisplayMode.BlankWebview,
        viewUrl: "https://support.betfair.com/app/answers/detail/a_id/5977/",
        viewUrn: EntityType.ExternalView,
      },
    });

    expect(QuickLink).toHaveBeenCalledWith(
      {
        isHighlighted: false,
        item: {
          text: "Virtuals",
        },
        onPress: expect.anything(),
      },
      undefined,
    );
    expect(QuickLink).toHaveBeenCalledTimes(1);
  });

  it("should call Runner for each runner", () => {
    renderVirtualMarketCard({
      runners: [
        {
          urn: "runner:1:urn",
          name: "Wild",
          description: "runner 1 description",
          number: 1,
          humanTexture: "texture 1",
          sportId: 0,
          showSilk: true,
        },
        {
          urn: "runner:2:urn",
          name: "Crazy",
          description: "runner 2 description",
          number: 2,
          humanTexture: "texture 2",
          sportId: 0,
          showSilk: true,
        },
      ],
    });

    expect(VirtualRunner).toHaveBeenNthCalledWith(
      1,
      {
        name: "Wild",
        description: "runner 1 description",
        number: 1,
        humanTexture: "texture 1",
        sportId: 0,
        showSilk: true,
        children: expect.anything(),
      },
      undefined,
    );
    expect(VirtualRunner).toHaveBeenNthCalledWith(
      2,
      {
        name: "Crazy",
        description: "runner 2 description",
        number: 2,
        humanTexture: "texture 2",
        sportId: 0,
        showSilk: true,
        children: expect.anything(),
      },
      undefined,
    );
    expect(VirtualRunner).toHaveBeenCalledTimes(2);
  });

  describe("and when clicking on the game rules quicklink", () => {
    it("should call the navigate", () => {
      renderVirtualMarketCard({
        status: "status mock",
        i18n: { gameRules: "game_rules" },
        runners: [{ urn: "runner:urn", label: "2.1", theme: "DARK" }],
        gameRulesViewLink: {
          viewDisplayMode: DisplayMode.BlankWebview,
          viewUrl: "https://support.betfair.com/app/answers/detail/a_id/5977/",
          viewUrn: EntityType.ExternalView,
        },
      });
      act(() => {
        const { onPress } = QuickLink.mock.calls[0][0];
        onPress();
      });

      expect(navigate).toHaveBeenCalledWith({
        viewUrl: "https://support.betfair.com/app/answers/detail/a_id/5977/",
        viewUrn: EntityType.ExternalView,
        viewDisplayMode: DisplayMode.BlankWebview,
      });
    });
  });

  describe("SportsbookBetButton", () => {
    describe("when runner is not selected", () => {
      it("should call SportsbookBetButton with default status", () => {
        renderVirtualMarketCard({ runners: [{ urn: "runner:urn", label: "4.2" }] });

        expect(SportsbookBetButton).toHaveBeenCalledWith(
          { label: "4.2", onClick: expect.any(Function), status: "default", animated: false },
          undefined,
        );
        expect(SportsbookBetButton).toHaveBeenCalledTimes(1);
      });
    });

    describe("when runner is selected", () => {
      it("should call SportsbookBetButton with selected status", () => {
        renderVirtualMarketCard({ runners: [{ urn: "runner:urn", label: "4.2", isSelected: true }] });

        expect(SportsbookBetButton).toHaveBeenCalledWith(
          { label: "4.2", onClick: expect.any(Function), status: "selected", animated: false },
          undefined,
        );
        expect(SportsbookBetButton).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when click on SportsbookBetButtonComponent", () => {
    describe("when toastMessageStatus is undefined", () => {
      it(`should call dispatchBetPlacement with correct bet and metadata`, () => {
        const cardUrn = "market:123";
        renderVirtualMarketCard({
          urn: cardUrn,
          runners: [
            {
              urn: "runner:urn",
              label: "4.2",
              odds: {
                decimal: 1.1,
                fractional: { numerator: 1, denominator: 2 },
              },
            },
          ],
        });
        SportsbookBetButton.mock.calls[0][0].onClick();

        expect(dispatchBetPlacement).toHaveBeenCalledWith(
          {
            urn: "runner:urn",
            odds: {
              decimal: 1.1,
              fractional: { numerator: 1, denominator: 2 },
            },
          },
          {
            cardUrn,
            betOriginURL: "",
          },
        );

        expect(dispatchInactiveBetButtonClickAction).not.toHaveBeenCalled();
      });
    });

    describe("when toastMessageStatus is defined", () => {
      it(`should call dispatchInactiveBetButtonClickAction with toastMessageStatus and not call dispatchBetPlacement
        on the SportsbookBetButtonComponent onClick cb`, () => {
        renderVirtualMarketCard({
          runners: [
            {
              urn: "runner:urn",
              label: "4.2",
              odds: {
                decimal: 1.1,
                fractional: { numerator: 1, denominator: 2 },
              },
              toastMessageStatus: "toastMessage",
            },
          ],
        });

        SportsbookBetButton.mock.calls[0][0].onClick();

        expect(dispatchInactiveBetButtonClickAction).toHaveBeenCalledWith("toastMessage");
        expect(dispatchBetPlacement).not.toHaveBeenCalled();
      });
    });
  });

  describe("the container", () => {
    it("should have marketContainer style", () => {
      const { queryByTestId } = renderVirtualMarketCard();
      const container = queryByTestId("virtual-market-card-container");

      expect(container.props.style).toEqual(styles.marketContainer);
    });
  });
});
