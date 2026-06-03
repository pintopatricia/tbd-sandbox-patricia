import { act, fireEvent, render } from "@testing-library/react-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { NavigationIconName } from "@ppb/the-wall-icons";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { navigate } from "@ppb/tbd-router";
import { OpenBets } from "./OpenBets.native";
import { TEST_ID } from "./OpenBets.native.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock testID="generic-icon-mock-id" />),
}));
jest.mock("@ppb/tbd-router", () => ({
  navigate: jest.fn(),
}));

function renderOpenBets({ viewLink, dispatchResetFilters }) {
  return render(<OpenBets viewLink={viewLink} dispatchResetFilters={dispatchResetFilters} />);
}

describe("OpenBets", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("When there is no viewLink", () => {
    it("should not render", () => {
      const result = renderOpenBets({ viewLink: null });

      expect(result.toJSON()).toBeNull();
    });
  });

  describe("When there is a viewLink", () => {
    it("should render an icon", () => {
      renderOpenBets({ viewLink: { viewUrn: "ppb:urn" } });

      expect(GenericIcon).toHaveBeenCalledWith(
        {
          name: NavigationIconName.MY_BETS,
          color: tokens.MyBetsIconColour,
        },
        undefined,
      );
    });

    describe("when icon is pressed", () => {
      it("should call navigate", () => {
        const dispatchResetFilters = jest.fn();
        const { getByTestId } = renderOpenBets({ viewLink: { viewUrn: "ppb:urn" }, dispatchResetFilters });
        const container = getByTestId(TEST_ID);

        act(() => fireEvent.press(container));

        expect(navigate).toHaveBeenCalledWith({ viewUrn: "ppb:urn" });
        expect(dispatchResetFilters).toHaveBeenCalledWith();
        expect(dispatchResetFilters).toHaveBeenCalledTimes(1);
      });
    });
  });
});
