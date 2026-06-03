import { raceDistance } from "./distance-formatters";

describe("distance formatters", () => {
  describe("raceDistance", () => {
    it.each`
      miles   | furlongs     | yards        | expected
      ${1}    | ${2}         | ${3}         | ${"1m 2f 3y"}
      ${1}    | ${undefined} | ${0}         | ${"1m"}
      ${1}    | ${0}         | ${undefined} | ${"1m"}
      ${1}    | ${2}         | ${null}      | ${"1m 2f"}
      ${1}    | ${0}         | ${3}         | ${"1m 3y"}
      ${null} | ${2}         | ${0}         | ${"2f"}
      ${0}    | ${2}         | ${3}         | ${"2f 3y"}
      ${1}    | ${null}      | ${3}         | ${"1m 3y"}
    `(
      'should return "$expected" when miles are $miles furlongs are $furlongs and yards are $yards',
      async ({ miles, furlongs, yards, expected }) => {
        expect(raceDistance({ miles, furlongs, yards })).toBe(expected);
      },
    );
  });
});
