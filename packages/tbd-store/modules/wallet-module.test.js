import { FETCH_USER_MAIN_WALLET } from "../actions/user-wallets";
import { getWalletModule } from "./wallet-module";

jest.mock("../middlewares/wallet-saga", () => ({
  fetchUserWalletsSaga: "fetchUserWalletsSaga",
}));

describe("getWalletModule", () => {
  it("should return the wallet module", () => {
    expect(getWalletModule()).toEqual({
      id: "wallet-module",
      middlewares: [],
      sagas: ["fetchUserWalletsSaga"],
      initialActions: [
        {
          type: FETCH_USER_MAIN_WALLET,
        },
      ],
    });
  });
});
