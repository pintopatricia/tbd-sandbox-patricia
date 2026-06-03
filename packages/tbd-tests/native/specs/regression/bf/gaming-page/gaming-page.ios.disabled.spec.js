const { BottomBarSO, GamingScreenSO } = require("../../../../screen-objects");

const gamingScreenSO = new GamingScreenSO();

const { startApp } = require("../../../utils/urls");

// TODO: this test needs to be revised. It's an 99.99% e2e test and only 0.01% mocked. It should only be of one type.
describe("Gaming Screens", () => {
  beforeAll(async () => {
    await startApp("home");
    await browser.waitUntilDisplayed(BottomBarSO.gaming);
    await BottomBarSO.gaming.click();
    await browser.waitUntilDisplayed(gamingScreenSO.onBoardingView);
  });

  it("[PRPI-2713] The Games OnBoarding View should be displayed", async () => {
    expect(await gamingScreenSO.onBoardingView.isDisplayed()).toBe(true);
  });

  it("[PRPI-2714] The 'Save and Close' button should be displayed", async () => {
    expect(await gamingScreenSO.onBoardingFirstButton.isDisplayed()).toBe(true);
  });

  it("[PRPI-2715] The 'Skip' button should be displayed", async () => {
    expect(await gamingScreenSO.onBoardingSecondButton.isDisplayed()).toBe(true);
  });

  describe("When the user close the OnBoarding view", () => {
    beforeAll(async () => {
      await gamingScreenSO.onBoardingSecondButton.click();
      await browser.waitUntilDisplayed(gamingScreenSO.lobbyView);
    });

    it("[PRPI-2716] The Games Lobby View should be displayed", async () => {
      expect(await gamingScreenSO.lobbyView.isDisplayed()).toBe(true);
    });

    it("[PRPI-2717] The My Selections button should be displayed", async () => {
      expect(await gamingScreenSO.customiseButton.isDisplayed()).toBe(true);
    });

    describe("When the user is tapping on 'Customise' button", () => {
      beforeAll(async () => {
        await gamingScreenSO.customiseButton.click();
        await browser.waitUntilDisplayed(gamingScreenSO.mySelectionsView);
      });

      it("[PRPI-2718] The My Selections View is displayed", async () => {
        expect(await gamingScreenSO.mySelectionsView.isDisplayed()).toBe(true);
      });

      it("[PRPI-2719] The selection tag should be displayed", async () => {
        expect(await gamingScreenSO.mySelectionTag.isDisplayed()).toBe(true);
      });

      describe("When the user is tapping on 'My Selection'", () => {
        beforeAll(async () => {
          await gamingScreenSO.mySelectionTag.click();
          await browser.waitUntilDisplayed(gamingScreenSO.mySelectionsView);
        });

        it("[PRPI-2720] The My Selections View is displayed", async () => {
          expect(await gamingScreenSO.mySelectionsView.isDisplayed()).toBe(true);
        });

        it("[PRPI-2721] The 'Save and Close' button is displayed", async () => {
          expect(await gamingScreenSO.saveAndCloseButton.isDisplayed()).toBe(true);
        });

        describe("When the user is tapping on 'Save and Close'", () => {
          beforeAll(async () => {
            await gamingScreenSO.saveAndCloseButton.click();
            await browser.waitUntilDisplayed(gamingScreenSO.manageCollectionButton);
          });

          it("[PRPI-2722] The 'Manage' collection button should be displayed", async () => {
            expect(await gamingScreenSO.manageCollectionButton.isDisplayed()).toBe(true);
          });

          it("[PRPI-2723] There should be only one item in the My Selections swimlane", async () => {
            expect(await gamingScreenSO.swimLaneTileCells.length).toBe(1);
          });
        });
      });
    });
  });
});
