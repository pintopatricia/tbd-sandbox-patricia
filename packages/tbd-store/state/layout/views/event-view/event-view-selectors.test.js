import { getViewbyURN } from "./event-view-selectors";

describe("getViewbyURN", () => {
  const viewMock = {
    urn: "urn:tbd:layout:event",
    typename: "EventView",
    items: ["urn:tbd:card:1", "urn:tbd:card:2"],
  };
  const stateMock = {
    event: {
      "urn:tbd:layout:event": {
        urn: "urn:tbd:layout:event",
        typename: "EventView",
        items: ["urn:tbd:card:1", "urn:tbd:card:2"],
      },
    },
    sport: {
      "urn:tbd:layout:sport": {
        urn: "urn:tbd:layout:sport",
        typename: "SportView",
        items: ["urn:tbd:card:3", "urn:tbd:card:2"],
      },
    },
  };

  it("must return undefined when receiving an URN for a non-existing view", () => {
    const view = getViewbyURN("RANDOM_URN");
    expect(view).toBe(undefined);
  });

  it("must return a view entity when receiving an URN for an existing view", () => {
    const view = getViewbyURN(stateMock, "urn:tbd:layout:event");
    expect(view).toEqual(viewMock);
  });
});
