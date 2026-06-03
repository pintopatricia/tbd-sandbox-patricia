import { objectDeepSort } from "./sorting";

describe("objectDeepSort", () => {
  it("should sort object properties", () => {
    const obj = {
      b: 2,
      a: 1,
      c: {
        d: 4,
        f: 3,
        e: 5,
      },
    };

    const ascOrder = objectDeepSort(obj);
    expect(Object.keys(ascOrder)).toStrictEqual(["a", "b", "c"]);
    expect(Object.keys(ascOrder.c)).toStrictEqual(["d", "e", "f"]);

    const descOrder = objectDeepSort(obj, "desc");
    expect(Object.keys(descOrder)).toStrictEqual(["c", "b", "a"]);
    expect(Object.keys(descOrder.c)).toStrictEqual(["f", "e", "d"]);
  });

  it("should sort object properties recursively", () => {
    const obj = {
      b: 2,
      a: 1,
      c: {
        e: 3,
        d: 4,
        f: {
          h: 5,
          g: 6,
        },
      },
    };

    const ascOrder = objectDeepSort(obj);
    expect(Object.keys(ascOrder)).toStrictEqual(["a", "b", "c"]);
    expect(Object.keys(ascOrder.c)).toStrictEqual(["d", "e", "f"]);
    expect(Object.keys(ascOrder.c.f)).toStrictEqual(["g", "h"]);

    const descOrder = objectDeepSort(obj, "desc");
    expect(Object.keys(descOrder)).toStrictEqual(["c", "b", "a"]);
    expect(Object.keys(descOrder.c)).toStrictEqual(["f", "e", "d"]);
    expect(Object.keys(descOrder.c.f)).toStrictEqual(["h", "g"]);
  });

  it("should sort objects inside arrays", () => {
    const array = [
      {
        c: {
          e: 3,
          d: 4,
          f: {
            g: 6,
            h: 5,
            i: [3, 2, 1],
          },
        },
        b: 2,
        a: 1,
      },
      {
        c: {
          e: 3,
          d: 4,
          f: {
            g: 6,
            h: 5,
            i: [3, 2, 1],
          },
        },
        z: 2,
      },
    ];

    const ascOrder = objectDeepSort(array);
    expect(Object.keys(ascOrder[0])).toStrictEqual(["a", "b", "c"]);
    expect(Object.keys(ascOrder[0].c)).toStrictEqual(["d", "e", "f"]);
    expect(Object.keys(ascOrder[0].c.f)).toStrictEqual(["g", "h", "i"]);
    expect(ascOrder[0].c.f.i).toStrictEqual([1, 2, 3]);

    expect(Object.keys(ascOrder[1])).toStrictEqual(["c", "z"]);
    expect(Object.keys(ascOrder[1].c)).toStrictEqual(["d", "e", "f"]);
    expect(Object.keys(ascOrder[1].c.f)).toStrictEqual(["g", "h", "i"]);
    expect(ascOrder[1].c.f.i).toStrictEqual([1, 2, 3]);

    const descOrder = objectDeepSort(array, "desc");
    expect(Object.keys(descOrder[0])).toStrictEqual(["z", "c"]);
    expect(Object.keys(descOrder[0].c)).toStrictEqual(["f", "e", "d"]);
    expect(Object.keys(descOrder[0].c.f)).toStrictEqual(["i", "h", "g"]);
    expect(descOrder[0].c.f.i).toStrictEqual([3, 2, 1]);

    expect(Object.keys(descOrder[1])).toStrictEqual(["c", "b", "a"]);
    expect(Object.keys(descOrder[1].c)).toStrictEqual(["f", "e", "d"]);
    expect(Object.keys(descOrder[1].c.f)).toStrictEqual(["i", "h", "g"]);
    expect(descOrder[1].c.f.i).toStrictEqual([3, 2, 1]);
  });

  it("should sort maps", () => {
    const map = new Map([
      ["b", 2],
      ["a", 1],
      ["c", { d: 4, f: 3, e: { g: 6, h: 5 } }],
    ]);

    const ascOrder = objectDeepSort(map);
    expect(Array.from(ascOrder.keys())).toStrictEqual(["a", "b", "c"]);
    expect(Object.keys(ascOrder.get("c"))).toStrictEqual(["d", "e", "f"]);
    expect(Object.keys(ascOrder.get("c").e)).toStrictEqual(["g", "h"]);

    const descOrder = objectDeepSort(map, "desc");
    expect(Array.from(descOrder.keys())).toStrictEqual(["c", "b", "a"]);
    expect(Object.keys(descOrder.get("c"))).toStrictEqual(["f", "e", "d"]);
    expect(Object.keys(descOrder.get("c").e)).toStrictEqual(["h", "g"]);
  });

  it("should sort sets", () => {
    const set = new Set([
      { b: 2, a: 1 },
      { d: 4, c: 3 },
    ]);

    const ascOrder = objectDeepSort(set);
    expect(Object.keys(Array.from(ascOrder)[0])).toStrictEqual(["a", "b"]);
    expect(Object.keys(Array.from(ascOrder)[1])).toStrictEqual(["c", "d"]);

    const descOrder = objectDeepSort(set, "desc");
    expect(Object.keys(Array.from(descOrder)[0])).toStrictEqual(["d", "c"]);
    expect(Object.keys(Array.from(descOrder)[1])).toStrictEqual(["b", "a"]);
  });

  it("should sort array of objects", () => {
    const obj = {
      params: {
        participantIds: [{ urn: "urn:5" }, { urn: "urn:2" }],
        outcomeIds: ["GOALS", "FOULS"],
      },
    };

    const ascOrder = objectDeepSort(obj);
    expect(Object.keys(ascOrder.params)).toStrictEqual(["outcomeIds", "participantIds"]);
    expect(ascOrder.params.outcomeIds).toStrictEqual(["FOULS", "GOALS"]);
    expect(ascOrder.params.participantIds[0].urn).toBe("urn:2");
    expect(ascOrder.params.participantIds[1].urn).toBe("urn:5");

    const descOrder = objectDeepSort(obj, "desc");
    expect(Object.keys(descOrder.params)).toStrictEqual(["participantIds", "outcomeIds"]);
    expect(descOrder.params.outcomeIds).toStrictEqual(["GOALS", "FOULS"]);
    expect(descOrder.params.participantIds[0].urn).toBe("urn:5");
    expect(descOrder.params.participantIds[1].urn).toBe("urn:2");
  });

  it("should sort array of strings", () => {
    const arr = ["cab", "abc", "bca"];

    const ascOrder = objectDeepSort(arr);
    expect(ascOrder).toStrictEqual(["abc", "bca", "cab"]);

    const descOrder = objectDeepSort(arr, "desc");
    expect(descOrder).toStrictEqual(["cab", "bca", "abc"]);
  });
});
