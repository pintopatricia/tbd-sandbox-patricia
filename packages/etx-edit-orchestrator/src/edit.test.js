import edit from "./edit";

const originalBet = {
  limitOrder: {
    persistenceType: "LAPSE",
    size: 3,
    price: 2.5,
  },
  betId: "1",
  selectionId: 125,
  orderType: "LIMIT",
  side: "back",
  handicap: 0,
};

let editedBet;

describe("edit", () => {
  describe("when edited bet persistence type is different from the original bet", () => {
    it("should return the respective update instruction", () => {
      editedBet = {
        ...originalBet,
        limitOrder: {
          ...originalBet.limitOrder,
          persistenceType: "LAPSE_ON_CLOSE",
        },
      };

      expect(edit(editedBet, originalBet)).toEqual({
        instruction: {
          betId: "1",
          newPersistenceType: "LAPSE_ON_CLOSE",
        },
        method: "update",
      });
    });
  });

  describe("when edited bet price is different from the original bet", () => {
    it("should return the respective replace instruction", () => {
      editedBet = {
        ...originalBet,
        limitOrder: {
          ...originalBet.limitOrder,
          price: 5,
        },
      };

      expect(edit(editedBet, originalBet)).toEqual({
        instruction: {
          betId: "1",
          newPrice: 5,
        },
        method: "replace",
      });
    });
  });

  describe("when edited bet size is different from the original bet", () => {
    describe("when edited bet size is higher than the original", () => {
      it("should return a place instruction with size delta as size", () => {
        editedBet = {
          ...originalBet,
          limitOrder: {
            ...originalBet.limitOrder,
            size: 4,
          },
        };

        expect(edit(editedBet, originalBet)).toEqual({
          instruction: {
            handicap: 0,
            limitOrder: {
              persistenceType: "LAPSE",
              price: 2.5,
              size: 1,
            },
            orderType: "LIMIT",
            selectionId: 125,
            side: "back",
          },
          method: "place",
        });
      });
    });

    describe("when edited bet size is lower than the original", () => {
      it("should return a place instruction with size delta as size", () => {
        editedBet = {
          ...originalBet,
          limitOrder: {
            ...originalBet.limitOrder,
            size: 2.5,
          },
        };

        expect(edit(editedBet, originalBet)).toEqual({
          instruction: {
            betId: "1",
            sizeReduction: 0.5,
          },
          method: "cancel",
        });
      });
    });
  });

  describe("when a not allowed edition is made", () => {
    it("should return error", () => {
      editedBet = {
        ...originalBet,
        side: "lay",
      };
      const errorMessage = `Expected a possible bet edition, but no edit can be made with '${editedBet}' as bet and ${originalBet} as originalBet.`;

      expect(() => edit(editedBet, originalBet)).toThrow(errorMessage);
    });
  });
});
