import type { ApolloCache } from "@apollo/client";
import type { RaceMeetingViewQuery } from "../../../../../types/__generated__/graphql";
import { RaceItemsContentQuery } from "../../RaceItemsContent/model/RaceItemsContent.graphql";
import { cacheWarmup } from "./cache-warmup";

type RaceMeetingView = Extract<NonNullable<RaceMeetingViewQuery["View"]>, { __typename: "RaceMeetingView" }>;

describe("cacheWarmup", () => {
  it("writes the fields required by RaceItemsContentQuery", () => {
    const writeQuery = jest.fn();
    const cache = { writeQuery } as unknown as ApolloCache<unknown>;

    const view = {
      __typename: "RaceMeetingView",
      urn: "ppb:tbd:view:raceMeeting:7|12345.1500",
      races: [],
      items: {
        __typename: "RaceContentConnection",
        selectedRace: {
          __typename: "RaceNavigationItem",
          race: {
            urn: "ppb:race:12345.1500",
          },
          viewLink: {
            viewUrn: "ppb:tbd:view:raceMeeting:7|12345.1500",
            viewUrl: "horse-racing/example",
          },
          promotion: null,
        },
        edges: [],
        pageInfo: null,
      },
    } as RaceMeetingView;

    cacheWarmup(cache, view);

    expect(writeQuery).toHaveBeenCalledWith({
      query: RaceItemsContentQuery,
      variables: { viewURN: view.urn, race: view.items.selectedRace.race.urn },
      data: {
        View: {
          __typename: "RaceMeetingView",
          urn: view.urn,
          races: view.races,
          items: view.items,
        },
      },
    });
  });
});