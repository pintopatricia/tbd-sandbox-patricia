import { getMainUrl } from "./domain.web";

const windowLocationSpy = jest.spyOn(window, "location", "get");

describe("domain", () => {
  beforeEach(jest.clearAllMocks);

  describe("getMainUrl", () => {
    describe("when window.location is defined", () => {
      beforeEach(() => {
        windowLocationSpy.mockReturnValueOnce({ origin: "http://www.betfair.com" });
      });

      it("should return the application's url according to the window", () => {
        expect(getMainUrl()).toBe("http://www.betfair.com/betting");
      });
    });

    describe("when window.location is undefined", () => {
      beforeEach(() => {
        windowLocationSpy.mockReturnValueOnce(undefined);
      });

      it("should return the application's url with the correct jurisdiction", () => {
        expect(getMainUrl()).toBe("https://www.betfair.com/betting");
      });
    });
  });
});
