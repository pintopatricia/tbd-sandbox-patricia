import scrollToTop from "./scroll-to-top";

const scrollToSpy = jest.fn();
global.scrollTo = scrollToSpy;

const scrollToSpyHTML = jest.fn();

describe("scrollToTop", () => {
  beforeEach(jest.clearAllMocks);

  describe("when element exists", () => {
    beforeEach(() => {
      document.getElementById = jest.fn(() => ({
        scrollTo: scrollToSpyHTML,
      }));

      scrollToTop();
    });

    it("should not scroll window to top", () => {
      expect(scrollToSpy).not.toHaveBeenCalled();
    });

    it("should scroll element to top", () => {
      expect(scrollToSpyHTML).toHaveBeenCalledTimes(1);
      expect(scrollToSpyHTML).toHaveBeenCalledWith(0, 0);
    });
  });

  describe("when element doesn't exist", () => {
    beforeEach(() => {
      document.getElementById = jest.fn(undefined);

      scrollToTop();
    });

    it("should scroll window to top", () => {
      expect(scrollToSpy).toHaveBeenCalledTimes(1);
      expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
    });

    it("should not scroll element to top", () => {
      expect(scrollToSpyHTML).not.toHaveBeenCalled();
    });
  });
});
