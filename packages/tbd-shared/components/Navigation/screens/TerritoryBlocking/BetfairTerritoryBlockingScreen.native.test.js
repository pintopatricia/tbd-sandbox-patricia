import { render } from "@testing-library/react-native";
import { i18n } from "../../../../helpers/i18n";
import BetfairTerritoryBlockingScreen from "./BetfairTerritoryBlockingScreen.native";
import { BetfairTerritoryBlockingPage } from "../../../TerritoryBlockingPage/BetfairTerritoryBlockingPage.native";

const translationMock = "sometranslation";

jest.mock("../../../TerritoryBlockingPage/BetfairTerritoryBlockingPage.native", () => ({
  BetfairTerritoryBlockingPage: jest.fn(() => <betfair-territory-blocking-page />),
}));

jest.mock("../../../../helpers/i18n", () => ({
  i18n: jest.fn(() => translationMock),
}));

function renderScreen() {
  return render(<BetfairTerritoryBlockingScreen />);
}

describe("TerritoryBlockingScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderScreen();
  });

  it("should render the TerritoryBlockingPage", () => {
    expect(BetfairTerritoryBlockingPage).toHaveBeenCalledTimes(1);
    expect(BetfairTerritoryBlockingPage).toHaveBeenCalledWith(
      {
        info: "Betfair - Mobile Web",
        message: translationMock,
        title: translationMock,
      },
      undefined,
    );
  });

  it("should generate the necessary translations", () => {
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.TERRITORYBLOCKING.TITLE" });
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.TERRITORYBLOCKING.BODY" });
  });
});
