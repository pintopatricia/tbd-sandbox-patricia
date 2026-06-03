import { render } from "@testing-library/react-native";

import ConnectedSingle from "../Single";
import { Single } from "../Single/Single.native";
import { SinglesCard } from "./SinglesCard.native";
import ConnectedOneLineBet from "../OneLineBet";
import { OneLineBet } from "../OneLineBet/OneLineBet.native";

jest.mock("../Single", () => jest.fn(({ props }) => <connected-single-mock {...props} />));
jest.mock("../Single/Single.native", () => jest.fn(({ props }) => <single-mock {...props} />));

jest.mock("../OneLineBet", () => jest.fn(({ props }) => <connected-one-line-bet-mock {...props} />));
jest.mock("../OneLineBet/OneLineBet.native", () => jest.fn(({ props }) => <one-line-bet-mock {...props} />));

function renderSinglesCard({
  combinations = [{ combinationId: "C:1", isOneLineBet: false }],
  hasAvailabilityHints = true,
  shouldFocusStakeField = true,
} = {}) {
  return render(
    <SinglesCard
      combinations={combinations}
      hasAvailabilityHints={hasAvailabilityHints}
      shouldFocusStakeField={shouldFocusStakeField}
    />,
  );
}

describe("SinglesCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when only one combination", () => {
    describe("when is a single bet", () => {
      it("should call ConnectedSingle per id", () => {
        renderSinglesCard({});

        expect(ConnectedSingle).toHaveBeenCalledWith(
          {
            id: "C:1",
            component: Single,
            hasAvailabilityHints: true,
            shouldFocusStakeField: true,
          },
          undefined,
        );
        expect(ConnectedSingle).toHaveBeenCalledTimes(1);
      });
    });

    describe("when is a one line bet", () => {
      it("should call ConnectedOneLineBet per id", () => {
        renderSinglesCard({ combinations: [{ combinationId: "C:2", isOneLineBet: true }] });

        expect(ConnectedOneLineBet).toHaveBeenCalledWith(
          {
            id: "C:2",
            component: OneLineBet,
            hasAvailabilityHints: true,
            shouldFocusStakeField: true,
          },
          undefined,
        );
        expect(ConnectedOneLineBet).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when several combinations", () => {
    describe("when all are one line bets", () => {
      it("should call ConnectedOneLineBet per id", () => {
        renderSinglesCard({
          combinations: [
            { combinationId: "C:1", isOneLineBet: true },
            { combinationId: "C:2", isOneLineBet: true },
          ],
        });
        expect(ConnectedOneLineBet).toHaveBeenCalledWith(
          {
            id: "C:1",
            component: OneLineBet,
            hasAvailabilityHints: true,
            shouldFocusStakeField: true,
          },
          undefined,
        );
        expect(ConnectedOneLineBet).toHaveBeenCalledWith(
          {
            id: "C:2",
            component: OneLineBet,
            hasAvailabilityHints: true,
            shouldFocusStakeField: false,
          },
          undefined,
        );
        expect(ConnectedOneLineBet).toHaveBeenCalledTimes(2);
      });
    });

    describe("when all are single bets", () => {
      it("should call ConnectedSingle per id", () => {
        renderSinglesCard({
          combinations: [
            { combinationId: "C:1", isOneLineBet: false },
            { combinationId: "C:2", isOneLineBet: false },
          ],
        });
        expect(ConnectedSingle).toHaveBeenCalledWith(
          {
            id: "C:1",
            component: Single,
            hasAvailabilityHints: true,
            shouldFocusStakeField: true,
          },
          undefined,
        );
        expect(ConnectedSingle).toHaveBeenCalledWith(
          {
            id: "C:2",
            component: Single,
            hasAvailabilityHints: true,
            shouldFocusStakeField: false,
          },
          undefined,
        );
        expect(ConnectedSingle).toHaveBeenCalledTimes(2);
      });
    });
  });
});
