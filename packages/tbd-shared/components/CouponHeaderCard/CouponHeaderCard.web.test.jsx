import { render } from "@testing-library/react";

import { CompetitionHeader } from "./snowflakes/CompetitionHeader/CompetitionHeader.web";
import CouponHeaderCard from "./CouponHeaderCard.web";

jest.mock("./snowflakes/CompetitionHeader/CompetitionHeader.web", () => ({
  CompetitionHeader: jest.fn(({ props }) => <competition-header-card-mock {...props} />),
}));

const eventMock = {
  preventDefault: jest.fn(),
};
const dispatchRouterPushActionMock = jest.fn();
const DEFAULT_PROPS = {
  title: "My Title",
  columns: ["a", "b", "c"],
  showComponent: true,
  dispatchRouterPushAction: dispatchRouterPushActionMock,
  hasStats: false,
};

function setup({ title, titleLink, columns, showComponent, dispatchRouterPushAction, hasStats } = DEFAULT_PROPS) {
  return render(
    <CouponHeaderCard
      title={title}
      titleLink={titleLink}
      columns={columns}
      showComponent={showComponent}
      dispatchRouterPushAction={dispatchRouterPushAction}
      hasStats={hasStats}
    />,
  );
}

describe("Coupon header card web", () => {
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
            onTitleClick: expect.any(Function),
            hasStats: false,
          },
          undefined,
        );
      });
    });

    describe("when titleLink prop is defined", () => {
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
            titleLink,
            columns: DEFAULT_PROPS.columns,
            onTitleClick: expect.any(Function),
            hasStats: false,
          },
          undefined,
        );
      });

      it("should call dispatchRouterPushAction when CompetitionHeader.onTitleClick is triggered", () => {
        setup({
          ...DEFAULT_PROPS,
          titleLink,
        });

        expect(eventMock.preventDefault).not.toHaveBeenCalled();
        expect(dispatchRouterPushActionMock).not.toHaveBeenCalled();

        const { onTitleClick } = CompetitionHeader.mock.calls[0][0];
        onTitleClick(eventMock);

        expect(eventMock.preventDefault).toHaveBeenCalledTimes(1);
        expect(dispatchRouterPushActionMock).toHaveBeenCalledTimes(1);
        expect(dispatchRouterPushActionMock).toHaveBeenCalledWith(titleLink);
      });
    });

    describe("when titleLink prop is not defined", () => {
      it("should call CompetitionHeader component with correct props", () => {
        setup();

        expect(CompetitionHeader).toHaveBeenCalledWith(
          {
            title: DEFAULT_PROPS.title,
            columns: DEFAULT_PROPS.columns,
            onTitleClick: expect.any(Function),
            hasStats: false,
          },
          undefined,
        );
      });

      it("should not call dispatchRouterPushAction when CompetitionHeader.onTitleClick is triggered", () => {
        setup();

        expect(eventMock.preventDefault).not.toHaveBeenCalled();
        expect(dispatchRouterPushActionMock).not.toHaveBeenCalled();

        const { onTitleClick } = CompetitionHeader.mock.calls[0][0];
        onTitleClick(eventMock);

        expect(eventMock.preventDefault).toHaveBeenCalledTimes(1);
        expect(dispatchRouterPushActionMock).not.toHaveBeenCalled();
      });
    });

    describe("when hasStats prop is true", () => {
      it("should call CompetitionHeader component with correct props", () => {
        setup({
          ...DEFAULT_PROPS,
          hasStats: true,
        });

        expect(CompetitionHeader).toHaveBeenCalledWith(
          {
            title: DEFAULT_PROPS.title,
            columns: DEFAULT_PROPS.columns,
            onTitleClick: expect.any(Function),
            hasStats: true,
          },
          undefined,
        );
      });
    });

    describe("when hasStats prop is false", () => {
      it("should not call CompetitionHeader component", () => {
        setup({
          ...DEFAULT_PROPS,
          hasStats: false,
        });

        expect(CompetitionHeader).toHaveBeenCalledWith(
          {
            title: DEFAULT_PROPS.title,
            columns: DEFAULT_PROPS.columns,
            onTitleClick: expect.any(Function),
            hasStats: false,
          },
          undefined,
        );
      });
    });
  });
});
