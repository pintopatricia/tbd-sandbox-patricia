import { render } from "@testing-library/react-native";

import { ForecastTricastSelection } from "@ppb/the-wall-native";

import { CastRunner } from "./CastRunner.native";

jest.mock("@ppb/the-wall-native", () => ({
  ForecastTricastSelection: jest.fn(() => <fc-tc-mock />),
  SilkWrapper: jest.fn(() => <silk-wrapper-mock />),
  TrapWrapper: jest.fn(() => <trap-wrapper-mock />),
}));

function renderCastRunner({
  horse = "horseName",
  icon,
  silkFallbackType = "silkFallbackType",
  position = 3,
  positionOrdinal = "rd",
  racingSport = 7,
} = {}) {
  return render(
    <CastRunner
      horse={horse}
      icon={icon}
      silkFallbackType={silkFallbackType}
      racingSport={racingSport}
      position={position}
      positionOrdinal={positionOrdinal}
    />,
  );
}

describe("ConnectedCastRunner", () => {
  beforeEach(jest.clearAllMocks);

  describe("when all the props are passed", () => {
    it("should call ForecastTricastSelection with correct props", () => {
      renderCastRunner({ icon: "silkUrl" });

      expect(ForecastTricastSelection).toHaveBeenCalledWith(
        expect.objectContaining({
          horse: "horseName",
          icon: expect.any(Object),
          position: 3,
          positionOrdinal: "rd",
        }),
        undefined,
      );
    });

    it("should call ForecastTricastSelection with undefined silk when unmapped racingSport", () => {
      renderCastRunner({ racingSport: 1111 });

      expect(ForecastTricastSelection).toHaveBeenCalledWith(
        expect.objectContaining({
          horse: "horseName",
          icon: undefined,
          position: 3,
          positionOrdinal: "rd",
        }),
        undefined,
      );
    });
  });
});
