import { canShare, share } from "./share.web";

jest.spyOn(navigator, "share");

describe("Share Web", () => {
  beforeEach(jest.clearAllMocks);

  describe("canShare", () => {
    describe("when navigator.canShare is not supported", () => {
      beforeEach(() => {
        navigator.canShare = null;
      });

      it("should return false", () => {
        expect(canShare()).toEqual(false);
      });
    });

    describe("when navigator.canShare is supported", () => {
      beforeEach(() => {
        navigator.canShare = jest.fn();
      });

      it("should return true", () => {
        expect(canShare()).toEqual(true);
      });
    });
  });

  describe("share", () => {
    const shareDataMock = {
      text: "some message",
      url: "www.someurl.com",
    };

    describe("when navigator.canShare is not supported", () => {
      beforeEach(() => {
        navigator.canShare = null;
      });

      it("should throw an error", async () => {
        await expect(share(shareDataMock)).rejects.toThrow("Your browser doesn't support the Web Share API");
      });
    });

    describe("when navigator.canShare is supported", () => {
      beforeEach(() => {
        navigator.canShare = jest.fn();
      });

      describe("and it returns false", () => {
        beforeEach(() => {
          navigator.canShare.mockReturnValue(false);
        });

        it("should throw an error", async () => {
          await expect(share(shareDataMock)).rejects.toThrow("Your system doesn't support sharing these files");
        });
      });

      describe("when it returns true", () => {
        beforeEach(() => {
          navigator.canShare.mockReturnValue(true);
        });

        describe("and navigator.share throws an exception", () => {
          const errorMessageMock = "some error";

          beforeEach(() => {
            navigator.share.mockRejectedValue(new Error(errorMessageMock));
          });

          it("should throw an error", async () => {
            await expect(share(shareDataMock)).rejects.toThrow(
              `An error occurred while sharing: Error: ${errorMessageMock}`,
            );
          });
        });

        describe("and navigator.share is successful", () => {
          beforeEach(() => {
            navigator.share.mockResolvedValue();

            share(shareDataMock);
          });

          it("should call navigator.canShare with shareData", () => {
            expect(navigator.canShare).toHaveBeenCalledTimes(1);
            expect(navigator.canShare).toHaveBeenCalledWith(shareDataMock);
          });

          it("should call navigator.share with shareData", () => {
            expect(navigator.share).toHaveBeenCalledTimes(1);
            expect(navigator.share).toHaveBeenCalledWith(shareDataMock);
          });
        });
      });
    });
  });
});
