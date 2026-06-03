import { render } from "@testing-library/react-native";

import { navigate } from "@ppb/tbd-router";
import { CompetitionHeader } from "./snowflakes/CompetitionHeader/CompetitionHeader.native";

import CouponHeaderCard from "./CouponHeaderCard.native";

jest.mock("./snowflakes/CompetitionHeader/CompetitionHeader.native", () => ({
  CompetitionHeader: jest.fn(({ props }) => <competition-header-card-mock {...props} />),
}));

jest.mock("@ppb/tbd-router", () => ({
  navigate: jest.fn(),
}));

const DEFAULT_PROPS = {
  title: "My Title",
  columns: ["a", "b", "c"],
  hasStats: true,
};

function setup({ title, titleLink, columns, showComponent, hasStats } = DEFAULT_PROPS) {
  return render(
    <CouponHeaderCard
      title={title}
      titleLink={titleLink}
      columns={columns}
      showComponent={showComponent}
      hasStats={hasStats}
    />,
  );
}

describe("Coupon header card native", () => {
  afterEach(jest.clearAllMocks);

  describe("when initializing the component", () => {
    describe("when showComponent prop is false", () => {
      it("should not call CompetitionHeader component", () => {
        setup({
          ...DEFAULT_PROPS,
          showComponent: false,
        });

        expect(CompetitionHeader).not.toHaveBeenCalled();
      });
    });

    describe("when showComponent prop is true", () => {
      it("should call CompetitionHeader component with correct props", () => {
        setup({
          ...DEFAULT_PROPS,
          showComponent: true,
        });

        expect(CompetitionHeader).toHaveBeenCalledWith(
          {
            title: DEFAULT_PROPS.title,
            columns: DEFAULT_PROPS.columns,
            hasStats: true,
            onTitleClick: expect.any(Function),
          },
          undefined,
        );
      });
    });

    describe("when showComponent prop is not defined", () => {
      it("should call CompetitionHeader component with correct props", () => {
        setup();

        expect(CompetitionHeader).toHaveBeenCalledWith(
          {
            title: DEFAULT_PROPS.title,
            columns: DEFAULT_PROPS.columns,
            hasStats: true,
            onTitleClick: expect.any(Function),
          },
          undefined,
        );
      });
    });

    describe("when titleLink is defined", () => {
      const titleLink = {
        viewUrl: "/football/thai-league-cup/c-1",
        viewUrn: "tbd:competition:1",
      };

      it("should call CompetitionHeader component with correct props", () => {
        setup({
          ...DEFAULT_PROPS,
          titleLink,
        });

        expect(CompetitionHeader).toHaveBeenCalledWith(
          {
            title: DEFAULT_PROPS.title,
            columns: DEFAULT_PROPS.columns,
            hasStats: true,
            onTitleClick: expect.any(Function),
          },
          undefined,
        );
      });

      it("should call navigate when CompetitionHeader.onTitleClick is triggered", () => {
        setup({
          ...DEFAULT_PROPS,
          titleLink,
        });

        expect(navigate).not.toHaveBeenCalled();

        const { onTitleClick } = CompetitionHeader.mock.calls[0][0];
        onTitleClick();

        expect(navigate).toHaveBeenCalledTimes(1);
        expect(navigate).toHaveBeenCalledWith(titleLink);
      });
    });

    describe("when titleLink is not defined", () => {
      it("should call CompetitionHeader component with correct props", () => {
        setup();

        expect(CompetitionHeader).toHaveBeenCalledWith(
          {
            title: DEFAULT_PROPS.title,
            columns: DEFAULT_PROPS.columns,
            hasStats: true,
            onTitleClick: expect.any(Function),
          },
          undefined,
        );
      });

      it("should not call navigate when CompetitionHeader.onTitleClick is triggered", () => {
        setup();

        const { onTitleClick } = CompetitionHeader.mock.calls[0][0];
        onTitleClick();

        expect(navigate).not.toHaveBeenCalled();
      });
    });
  });
});
