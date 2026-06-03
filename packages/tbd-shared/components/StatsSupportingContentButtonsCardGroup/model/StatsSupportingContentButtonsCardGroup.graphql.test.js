import { useLazyQuery } from "@apollo/client/react";
import { renderHook } from "@testing-library/react";
import {
  useStatsSupportingContentButtonsCardGroupQuery,
  StatsSupportingContentButtonsCardGroupQuery,
} from "./StatsSupportingContentButtonsCardGroup.graphql";
import { hydrateItemCards } from "./HydrateStatsSupportingContentButtonsCardGroup";

const CARD_URN = "ppb:tbd:card:1";

const callFn = jest.fn();

jest.mock("@apollo/client/react", () => ({
  ...jest.requireActual("@apollo/client/react"),
  useLazyQuery: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/layout-snapshot", () => ({
  generateLayoutSnapshot: jest.fn((value) => value),
}));

jest.mock("./HydrateStatsSupportingContentButtonsCardGroup", () => ({
  hydrateItemCards: jest.fn(() => true),
}));

function setup() {
  const { result } = renderHook(() =>
    useStatsSupportingContentButtonsCardGroupQuery({ cardURN: CARD_URN }, { visible: true }),
  );
  return result;
}

describe("useStatsSupportingContentButtonsCardGroup.graphql", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("useStatsSupportingContentButtonsCardGroupQuery", () => {
    beforeEach(() => {
      useLazyQuery.mockReturnValue([
        callFn,
        {
          called: true,
          loading: false,
          data: {
            Cards: [
              {
                __typename: "StatsSupportingContentButtonsCardGroup",
                urn: CARD_URN,
              },
            ],
          },
        },
      ]);
    });

    it("should call useLazyQuery with the correct parameters", () => {
      setup();

      expect(useLazyQuery).toHaveBeenCalledWith(StatsSupportingContentButtonsCardGroupQuery);
    });

    it("should return the correct value", () => {
      const result = setup();

      expect(result.current).toEqual({
        loading: false,
        data: {
          card: {
            __typename: "StatsSupportingContentButtonsCardGroup",
            urn: CARD_URN,
          },
        },
      });
    });

    it("should hydrate the item cards", () => {
      setup();

      expect(hydrateItemCards).toHaveBeenCalled();
    });

    it("should fetch the card when the component is mounted", () => {
      useLazyQuery.mockReturnValue([
        callFn,
        {
          called: false,
          loading: false,
        },
      ]);

      setup();

      expect(callFn).toHaveBeenCalledWith({ variables: { urn: "ppb:tbd:card:1" } });
    });
  });
});
