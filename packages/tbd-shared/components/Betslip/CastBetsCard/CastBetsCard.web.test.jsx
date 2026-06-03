import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { CastBetsCard } from "./CastBetsCard.web";

import ConnectedCastBet from "../CastBet";
import { CastBet } from "../CastBet/CastBet.web";

jest.mock("../CastBet", () => jest.fn(({ props }) => <connected-cast-bet-mock {...props} />));

jest.mock("../CastBet/CastBet.web", () => jest.fn(({ props }) => <cast-bet-mock {...props} />));

function renderCastBetsCard({ castGroupIds = ["CAST:1", "CAST:2"], shouldFocusStakeField = true } = {}) {
  return render(<CastBetsCard castGroupIds={castGroupIds} shouldFocusStakeField={shouldFocusStakeField} />);
}

describe("CastBetsCard", () => {
  beforeEach(jest.clearAllMocks);

  describe("when there are cast group IDs", () => {
    it("should call ConnectedCastBet per id", () => {
      renderCastBetsCard();

      expect(ConnectedCastBet).toHaveBeenNthCalledWith(
        1,
        {
          castGroupId: "CAST:1",
          component: CastBet,
          shouldFocusStakeField: true,
        },
        undefined,
      );
      expect(ConnectedCastBet).toHaveBeenNthCalledWith(
        2,
        {
          castGroupId: "CAST:2",
          component: CastBet,
          shouldFocusStakeField: false,
        },
        undefined,
      );
      expect(ConnectedCastBet).toHaveBeenCalledTimes(2);
    });
  });

  describe("when there are no cast group IDs", () => {
    it("should not call ConnectedCastBet", () => {
      renderCastBetsCard({ castGroupIds: [] });

      expect(ConnectedCastBet).not.toHaveBeenCalled();
    });
  });
});
