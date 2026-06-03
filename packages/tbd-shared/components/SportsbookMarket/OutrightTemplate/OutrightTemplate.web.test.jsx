import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { SportsbookMarket } from "@ppb/the-wall-web";
import { SportsbookMarketStatus } from "@ppb/the-wall-common/constants";
import ConnectedSportsbookBetButton from "../../SportsbookBetButton";
import SportsbookBetButton from "../../SportsbookBetButton/SportsbookBetButton.web";
import useAlphabeticalSort from "../../../hooks/useAlphabeticalSort";
import INTERSECTION_CONFIG from "../../../config/cards-intersection";
import OutrightTemplate from "./OutrightTemplate.web";

const runnersMock = [
  { urn: "urn2", name: "runner2", handicapLabel: "runner2HandicapLabel" },
  { urn: "urn3", name: "runner3", handicapLabel: "runner3HandicapLabel" },
  { urn: "urn1", name: "runner1", handicapLabel: "runner1HandicapLabel" },
];

const i18nMock = {
  azSwitcher: "A - Z",
};

jest.mock("../../SportsbookBetButton", () => jest.fn(() => <sportsbook-bet-button />));
jest.mock("../../SportsbookBetButton/SportsbookBetButton.web", () => jest.fn(() => <market-runner />));

jest.mock("@ppb/the-wall-web", () => ({
  SportsbookMarket: jest.fn(({ props, children }) => (
    <sportsbook-market-mock {...props}>{children}</sportsbook-market-mock>
  )),
}));

jest.mock("../../../hooks/useAlphabeticalSort", () =>
  jest.fn(() => ({
    azSwitcherLabel: i18nMock.azSwitcher,
    isSorted: false,
    itemsToDisplay: runnersMock,
    onSwitch: jest.fn(),
  })),
);

function setup(overwriteProps) {
  const componentProps = {
    marketUrn: "marketUrn",
    runners: runnersMock,
    i18n: i18nMock,
    cardUrn: "cardUrn",
    isShowMoreAvailable: false,
    isItemsListCollapsed: false,
    numberOfItemsToDisplay: undefined,
    onIntersectCallback: jest.fn(),
    dispatchAzSwitchClick: jest.fn(),
    onLinkClick: jest.fn(),
    onMarketPromoClick: jest.fn(),
    infoBlurbs: undefined,
    marketPromo: undefined,
    ...overwriteProps,
  };

  return render(<OutrightTemplate {...componentProps} />);
}

describe("Outright Template", () => {
  beforeEach(jest.clearAllMocks);

  describe("when isShowMoreAvailable is false", () => {
    it("should call useAlphabeticalSort with the expected props", () => {
      setup();

      expect(useAlphabeticalSort).toHaveBeenCalledWith({
        items: runnersMock,
        sortKey: "name",
        isItemsListCollapsed: false,
        numberOfItemsToDisplay: undefined,
        dispatchAzSwitchClick: expect.any(Function),
      });
    });

    it("should render the SportsbookMarket component without defining the azSwitcherProps", () => {
      setup();

      expect(SportsbookMarket).toHaveBeenCalledWith(
        {
          status: SportsbookMarketStatus.OPEN,
          guaranteedPriceAvailable: false,
          i18n: i18nMock,
          intersectOffset: INTERSECTION_CONFIG.rootMargin,
          onIntersectCallback: expect.any(Function),
          isOutrightTemplate: true,
          azSwitcherProps: undefined,
          infoBlurbs: undefined,
          marketPromo: undefined,
          onMarketPromoClick: expect.any(Function),
          onLinkClick: expect.any(Function),
          children: expect.anything(),
        },
        undefined,
      );
    });

    it("should render a bet button for every market", () => {
      setup();

      expect(ConnectedSportsbookBetButton.mock.calls[0][0]).toEqual({
        marketUrn: "marketUrn",
        runnerUrn: "urn2",
        component: SportsbookBetButton,
        cardUrn: "cardUrn",
        displayPreviousOdd: false,
        isSecondaryLabelRunnerName: true,
        isSecondaryLabelUppercase: true,
      });

      expect(ConnectedSportsbookBetButton.mock.calls[1][0]).toEqual({
        marketUrn: "marketUrn",
        runnerUrn: "urn3",
        component: SportsbookBetButton,
        cardUrn: "cardUrn",
        displayPreviousOdd: false,
        isSecondaryLabelRunnerName: true,
        isSecondaryLabelUppercase: true,
      });

      expect(ConnectedSportsbookBetButton.mock.calls[2][0]).toEqual({
        marketUrn: "marketUrn",
        runnerUrn: "urn1",
        component: SportsbookBetButton,
        cardUrn: "cardUrn",
        displayPreviousOdd: false,
        isSecondaryLabelRunnerName: true,
        isSecondaryLabelUppercase: true,
      });
    });
  });

  describe("when isShowMoreAvailable is true", () => {
    it("should call useAlphabeticalSort with the expected props", () => {
      setup({ numberOfItemsToDisplay: 2, isShowMoreAvailable: true });

      expect(useAlphabeticalSort).toHaveBeenCalledWith({
        items: runnersMock,
        sortKey: "name",
        isItemsListCollapsed: false,
        numberOfItemsToDisplay: 2,
        dispatchAzSwitchClick: expect.any(Function),
      });
    });

    it("should render the SportsbookMarket component and define the azSwitcherProps", () => {
      setup({ numberOfItemsToDisplay: 2, isShowMoreAvailable: true });

      expect(SportsbookMarket).toHaveBeenCalledWith(
        {
          status: SportsbookMarketStatus.OPEN,
          guaranteedPriceAvailable: false,
          i18n: i18nMock,
          intersectOffset: INTERSECTION_CONFIG.rootMargin,
          onIntersectCallback: expect.any(Function),
          isOutrightTemplate: true,
          azSwitcherProps: {
            text: i18nMock.azSwitcher,
            isLeftPosition: false,
            isChecked: false,
            callback: expect.any(Function),
            checkboxId: "marketUrn",
            checkboxName: "marketUrn",
          },
          infoBlurbs: undefined,
          marketPromo: undefined,
          onMarketPromoClick: expect.any(Function),
          onLinkClick: expect.any(Function),
          children: expect.anything(),
        },
        undefined,
      );
    });

    it("should render a bet button for every market", () => {
      setup({ numberOfItemsToDisplay: 2, isShowMoreAvailable: true });

      expect(ConnectedSportsbookBetButton.mock.calls[0][0]).toEqual({
        marketUrn: "marketUrn",
        runnerUrn: "urn2",
        component: SportsbookBetButton,
        cardUrn: "cardUrn",
        displayPreviousOdd: false,
        isSecondaryLabelRunnerName: true,
        isSecondaryLabelUppercase: true,
      });

      expect(ConnectedSportsbookBetButton.mock.calls[1][0]).toEqual({
        marketUrn: "marketUrn",
        runnerUrn: "urn3",
        component: SportsbookBetButton,
        cardUrn: "cardUrn",
        displayPreviousOdd: false,
        isSecondaryLabelRunnerName: true,
        isSecondaryLabelUppercase: true,
      });

      expect(ConnectedSportsbookBetButton.mock.calls[2][0]).toEqual({
        marketUrn: "marketUrn",
        runnerUrn: "urn1",
        component: SportsbookBetButton,
        cardUrn: "cardUrn",
        displayPreviousOdd: false,
        isSecondaryLabelRunnerName: true,
        isSecondaryLabelUppercase: true,
      });
    });
  });

  describe("when infoBlurbs and marketPromo are provided", () => {
    it("should pass the props to SportsbookMarket", () => {
      const infoBlurbs = [{ text: "info blurb" }];
      const marketPromo = { text: "market promo" };

      setup({ infoBlurbs, marketPromo });

      expect(SportsbookMarket).toHaveBeenCalledWith(
        expect.objectContaining({
          infoBlurbs,
          marketPromo,
          onMarketPromoClick: expect.any(Function),
          onLinkClick: expect.any(Function),
        }),
        undefined,
      );
    });
  });
});
