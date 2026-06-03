import { render } from "@testing-library/react-native";
import { BetInfoItemMode } from "@ppb/the-wall-common/types";

import { BetInfo, Collapse } from "@ppb/the-wall-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { i18n } from "../../helpers/i18n";
import { BetInfoCollapse } from "./BetInfoCollapse.native";

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.fn(() => <text-mock />),
  Collapse: jest.fn(() => <collapse-mock />),
  BetInfo: jest.fn(() => <bet-info-mock />),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

const MOCK_ITEMS = [
  { title: "Betfair Id", value: "123456789", mode: BetInfoItemMode.WITHOUT_COPY },
  { title: "Placed", value: "28/03/2026, 14:30", mode: BetInfoItemMode.WITHOUT_COPY },
];

function renderBetInfoCollapse({ items = MOCK_ITEMS } = {}) {
  return render(<BetInfoCollapse items={items} />);
}

describe("BetInfoCollapse", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render", () => {
    const { toJSON } = renderBetInfoCollapse();

    expect(toJSON()).toBeDefined();
  });

  describe("Collapse", () => {
    it("should be called with expected props", () => {
      renderBetInfoCollapse();

      expect(Collapse).toHaveBeenCalledWith(
        expect.objectContaining({
          isOpen: false,
          setIsOpen: expect.any(Function),
          header: expect.any(Object),
          children: expect.any(Object),
        }),
        undefined,
      );
      expect(Collapse).toHaveBeenCalledTimes(1);
    });

    it("should pass BET DETAILS title to header", () => {
      renderBetInfoCollapse();

      expect(i18n).toHaveBeenCalledWith({ key: "I18N.MY_BETS.BET_DETAILS" });
    });

    it("should render chevron icon in header", () => {
      renderBetInfoCollapse();
      render(Collapse.mock.calls[0][0].header);

      expect(GenericIcon).toHaveBeenCalled();
    });
  });

  describe("BetInfo", () => {
    it("should be called with the provided items", () => {
      renderBetInfoCollapse();
      render(Collapse.mock.calls[0][0].children);

      expect(BetInfo).toHaveBeenCalledWith(
        expect.objectContaining({
          items: MOCK_ITEMS,
        }),
        undefined,
      );
      expect(BetInfo).toHaveBeenCalledTimes(1);
    });
  });
});
