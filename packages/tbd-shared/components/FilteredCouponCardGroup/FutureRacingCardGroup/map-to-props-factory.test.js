import { FETCH_CARDS_FROM_LIST } from "@ppb/tbd-store/actions/catalogue";
import { mapDispatchToProps, makeMapStateToProps } from "./map-to-props-factory";

const getFutureRacingCardGroupByURN = jest.fn();
const getUserDetails = jest.fn(() => "userDetails");

const groupItemsByDate = jest.fn();

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: jest.fn(() => getFutureRacingCardGroupByURN),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));

jest.mock("../../../view-model-factories/future-racing-grouping", () => ({
  createFutureRacingViewModel: jest.fn(() => groupItemsByDate),
}));

const stateMock = {
  entities: {
    userdetails: {
      localeCode: "en_GB",
    },
  },
  layouts: {
    cardgroups: {
      futureracingcardgroups: {
        cardgroupURN: {
          urn: "cardgroupURN",
          items: [
            { urn: "item:1", typename: "item" },
            { urn: "item:2", typename: "item" },
          ],
        },
      },
    },
  },
};

describe("mapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should call getFutureRacingCardGroupByURN", () => {
    const mapStateToProps = makeMapStateToProps();

    mapStateToProps(stateMock, { urn: "cardgroupURN" });

    expect(getFutureRacingCardGroupByURN).toHaveBeenCalledWith(
      stateMock.layouts.cardgroups.futureracingcardgroups,
      "cardgroupURN",
    );
  });

  it("should call groupItemsByDate", () => {
    getFutureRacingCardGroupByURN.mockReturnValue({
      items: [
        { date: "1234T", urn: "item:1", typename: "item" },
        { date: "1234T", urn: "item:2", typename: "item" },
        { date: "1235T", urn: "item:3", typename: "item" },
      ],
    });

    const mapStateToProps = makeMapStateToProps();

    mapStateToProps(stateMock, { urn: "cardgroupURN" });

    expect(groupItemsByDate).toHaveBeenCalledWith(
      {
        items: [
          { date: "1234T", urn: "item:1", typename: "item" },
          { date: "1234T", urn: "item:2", typename: "item" },
          { date: "1235T", urn: "item:3", typename: "item" },
        ],
      },
      "userDetails",
    );
  });

  describe("when card group exists", () => {
    beforeEach(() => {
      getFutureRacingCardGroupByURN.mockReturnValue({
        items: [
          { date: "1234T", urn: "item:1", typename: "item" },
          { date: "1234T", urn: "item:2", typename: "item" },
          { date: "1235T", urn: "item:3", typename: "item" },
        ],
      });

      groupItemsByDate.mockReturnValue({
        cardItems: [
          {
            date: "4 june",
            items: [
              { date: "1234T", urn: "item:1", typename: "item" },
              { date: "1234T", urn: "item:2", typename: "item" },
            ],
          },
          {
            date: "5 june",
            items: [{ date: "1235T", urn: "item:3", typename: "item" }],
          },
        ],
        urnList: [
          { date: "1234T", urn: "item:1", typename: "item" },
          { date: "1234T", urn: "item:2", typename: "item" },
          { date: "1235T", urn: "item:3", typename: "item" },
        ],
      });
    });

    it("should return correct state", () => {
      const mapStateToProps = makeMapStateToProps();

      const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

      expect(result).toEqual({
        urn: "cardgroupURN",
        urnList: [
          { date: "1234T", urn: "item:1", typename: "item" },
          { date: "1234T", urn: "item:2", typename: "item" },
          { date: "1235T", urn: "item:3", typename: "item" },
        ],
        items: [
          {
            date: "4 june",
            items: [
              { date: "1234T", urn: "item:1", typename: "item" },
              { date: "1234T", urn: "item:2", typename: "item" },
            ],
          },
          {
            date: "5 june",
            items: [{ date: "1235T", urn: "item:3", typename: "item" }],
          },
        ],
      });
    });
  });

  describe("when card group does not exists", () => {
    beforeEach(() => {
      getFutureRacingCardGroupByURN.mockReturnValue(undefined);
    });

    it("should return empty", () => {
      const mapStateToProps = makeMapStateToProps();

      const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

      expect(result).toEqual({});
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("dispatchFetchCards", () => {
    it("should dispatch fetch cards action", () => {
      const { dispatchFetchCards } = mapDispatchToProps;

      expect(dispatchFetchCards("urn:fake", [{ urn: "urn:1" }])).toEqual({
        payload: { urn: "urn:fake", partials: [{ urn: "urn:1" }] },
        type: FETCH_CARDS_FROM_LIST,
      });
    });
  });
});
