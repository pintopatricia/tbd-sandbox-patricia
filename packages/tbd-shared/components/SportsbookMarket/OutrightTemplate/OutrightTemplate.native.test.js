import { render } from "@testing-library/react-native";
import { SportsbookMarket } from "@ppb/the-wall-native";
import OutrightTemplate from "./OutrightTemplate.native";
import ConnectedSportsbookBetButton from "../../SportsbookBetButton";
import SportsbookBetButton from "../../SportsbookBetButton/SportsbookBetButton.native";
import useAlphabeticalSort from "../../../hooks/useAlphabeticalSort";

const runnersMock = [
  { urn: "urn2", name: "runner2", handicapLabel: "runner2HandicapLabel" },
  { urn: "urn3", name: "runner3", handicapLabel: "runner3HandicapLabel" },
  { urn: "urn1", name: "runner1", handicapLabel: "runner1HandicapLabel" },
];

const i18nMock = {
  azSwitcher: "A - Z",
};

jest.useFakeTimers();

jest.mock("../../SportsbookBetButton", () => jest.fn(() => <connected-sportsbook-bet-button />));
jest.mock("../../SportsbookBetButton/SportsbookBetButton.native", () => jest.fn(() => <market-runner />));

jest.mock("@ppb/the-wall-native", () => ({
  SportsbookMarket: jest.fn(({ children, ...props }) => <market-blurbs-mock {...props}>{children}</market-blurbs-mock>),
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
    dispatchAzSwitchClick: jest.fn(),
    infoBlurbs: undefined,
    marketPromo: undefined,
    onMarketPromoClick: undefined,
    onLinkClick: undefined,
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

    it("should render SportsbookMarket with the expected props including blurb props", () => {
      const infoBlurbs = [{ id: 1, text: "Info blurb" }];
      const marketPromo = { id: 1, text: "Market promo" };
      const onMarketPromoClick = jest.fn();
      const onLinkClick = jest.fn();

      setup({
        infoBlurbs,
        marketPromo,
        onMarketPromoClick,
        onLinkClick,
      });

      expect(SportsbookMarket).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "OPEN",
          guaranteedPriceAvailable: false,
          i18n: i18nMock,
          isOutrightTemplate: true,
          infoBlurbs,
          marketPromo,
          onMarketPromoClick,
          onLinkClick,
          children: expect.anything(),
        }),
        undefined,
      );
    });

    it("should render SportsbookMarket without optional blurb props when not provided", () => {
      setup();

      expect(SportsbookMarket).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "OPEN",
          guaranteedPriceAvailable: false,
          i18n: i18nMock,
          isOutrightTemplate: true,
          infoBlurbs: undefined,
          marketPromo: undefined,
          onMarketPromoClick: undefined,
          onLinkClick: undefined,
          children: expect.anything(),
        }),
        undefined,
      );
    });

    it("should not include azSwitcherProps when isShowMoreAvailable is false", () => {
      setup();

      const props = SportsbookMarket.mock.calls[0][0];
      expect(props.azSwitcherProps).toBeUndefined();
    });

    it("should render bet buttons for all runners", () => {
      setup();

      runnersMock.forEach((runner, index) => {
        expect(ConnectedSportsbookBetButton.mock.calls[index][0]).toEqual({
          marketUrn: "marketUrn",
          runnerUrn: runner.urn,
          component: SportsbookBetButton,
          cardUrn: "cardUrn",
          displayPreviousOdd: false,
          isSecondaryLabelRunnerName: true,
          isSecondaryLabelUppercase: true,
          rounded: false,
        });
      });
    });
  });

  describe("when isShowMoreAvailable is true", () => {
    const props = { numberOfItemsToDisplay: 2, isShowMoreAvailable: true };

    it("should call useAlphabeticalSort with the expected props", () => {
      setup(props);

      expect(useAlphabeticalSort).toHaveBeenCalledWith({
        items: runnersMock,
        sortKey: "name",
        isItemsListCollapsed: false,
        numberOfItemsToDisplay: 2,
        dispatchAzSwitchClick: expect.any(Function),
      });
    });

    it("should include azSwitcherProps with correct values", () => {
      setup(props);

      const marketProps = SportsbookMarket.mock.calls[0][0];
      expect(marketProps.azSwitcherProps).toEqual({
        isChecked: false,
        isLeftPosition: false,
        text: i18nMock.azSwitcher,
        callback: expect.any(Function),
      });
    });

    it("should render bet buttons for all runners", () => {
      setup(props);

      runnersMock.forEach((runner, index) => {
        expect(ConnectedSportsbookBetButton.mock.calls[index][0]).toEqual({
          marketUrn: "marketUrn",
          runnerUrn: runner.urn,
          component: SportsbookBetButton,
          cardUrn: "cardUrn",
          displayPreviousOdd: false,
          isSecondaryLabelRunnerName: true,
          isSecondaryLabelUppercase: true,
          rounded: false,
        });
      });
    });
  });
});
