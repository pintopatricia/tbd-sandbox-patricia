import { render } from "@testing-library/react-native";
import { i18n } from "../../../../helpers/i18n";
import SkybetTerritoryBlockingScreen from "./SkybetTerritoryBlockingScreen.native";
import { SkybetTerritoryBlockingPage } from "../../../TerritoryBlockingPage/SkybetTerritoryBlockingPage.native";

const translationMock = "sometranslation";

jest.mock("../../../TerritoryBlockingPage/SkybetTerritoryBlockingPage.native", () => ({
  SkybetTerritoryBlockingPage: jest.fn(() => <skybet-territory-blocking-page />),
}));

jest.mock("../../../../helpers/i18n", () => ({
  i18n: jest.fn(() => translationMock),
}));

function renderScreen() {
  return render(<SkybetTerritoryBlockingScreen />);
}

describe("SkybetTerritoryBlockingScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderScreen();
  });

  it("should render the SkybetTerritoryBlockingPage", () => {
    expect(SkybetTerritoryBlockingPage).toHaveBeenCalledTimes(1);
    expect(SkybetTerritoryBlockingPage).toHaveBeenCalledWith(
      {
        info: translationMock,
        message: translationMock,
        title: translationMock,
      },
      undefined,
    );
  });

  it("should generate the necessary translations", () => {
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.TERRITORYBLOCKING.TITLE" });
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.TERRITORYBLOCKING.BODY" });
    expect(i18n).toHaveBeenCalledWith({ key: "I18N.TERRITORYBLOCKING.INFO" });
  });
});
