import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { ColdDiamond } from "../ColdDiamond/ColdDiamond.web";
import { HotDiamond } from "../HotDiamond/HotDiamond.web";
import { Jackpot } from "../Jackpot/Jackpot.web";
import { JackpotMerchandise } from "./JackpotMerchandise.web";
import { RedDiamonds } from "../RedDiamonds/RedDiamonds.web";
import { WhiteDiamonds } from "../WhiteDiamonds/WhiteDiamonds.web";

jest.mock("../ColdDiamond/ColdDiamond.web", () => ({
  ColdDiamond: jest.fn(() => <diamond-cold-mock />),
}));

jest.mock("../HotDiamond/HotDiamond.web", () => ({
  HotDiamond: jest.fn(() => <diamond-hot-mock />),
}));

jest.mock("../Jackpot/Jackpot.web", () => ({
  Jackpot: jest.fn(() => <jackpot-mock />),
}));

jest.mock("../RedDiamonds/RedDiamonds.web", () => ({
  RedDiamonds: jest.fn(() => <diamonds-red-mock />),
}));

jest.mock("../WhiteDiamonds/WhiteDiamonds.web", () => ({
  WhiteDiamonds: jest.fn(() => <diamonds-white-mock />),
}));

function renderJackpotMerchandise(
  state = "HOT",
  logoUrl = "fakeUrl",
  items = [
    { title: "test", value: "value", description: "description", state: "HOT" },
    { title: "test1", value: "value1", description: "description1", state: "HOT" },
    { title: "test2", value: "value2", description: "description2", state: "COLD" },
  ],
) {
  return render(<JackpotMerchandise items={items} state={state} logoUrl={logoUrl} />);
}

describe("Jackpot Merchandise", () => {
  beforeEach(jest.clearAllMocks);

  describe("jackpot element", () => {
    it("should be called 3 times", () => {
      renderJackpotMerchandise();

      expect(Jackpot).toHaveBeenCalledTimes(3);
      expect(Jackpot).toHaveBeenNthCalledWith(
        1,
        {
          hasBigTitle: true,
          state: "HOT",
          title: "test",
          value: "value",
          description: "description",
        },
        undefined,
      );
      expect(Jackpot).toHaveBeenNthCalledWith(
        2,
        {
          hasBigTitle: false,
          state: "HOT",
          title: "test1",
          value: "value1",
          description: "description1",
        },
        undefined,
      );
      expect(Jackpot).toHaveBeenNthCalledWith(
        3,
        {
          hasBigTitle: false,
          state: "COLD",
          title: "test2",
          value: "value2",
          description: "description2",
        },
        undefined,
      );
    });
    describe("background jackpot", () => {
      it("should have background for hot state", () => {
        renderJackpotMerchandise();
        expect(HotDiamond).toHaveBeenCalledTimes(1);
        expect(RedDiamonds).toHaveBeenCalledTimes(1);
      });
      it("should have background for cold state", () => {
        renderJackpotMerchandise("COLD");
        expect(ColdDiamond).toHaveBeenCalledTimes(1);
        expect(WhiteDiamonds).toHaveBeenCalledTimes(1);
      });
    });
  });
});
